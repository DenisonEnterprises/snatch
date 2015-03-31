(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var Tracker, Deps;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/tracker/tracker.js                                                                                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/////////////////////////////////////////////////////                                                             // 1
// Package docs at http://docs.meteor.com/#tracker //                                                             // 2
/////////////////////////////////////////////////////                                                             // 3
                                                                                                                  // 4
/**                                                                                                               // 5
 * @namespace Tracker                                                                                             // 6
 * @summary The namespace for Tracker-related methods.                                                            // 7
 */                                                                                                               // 8
Tracker = {};                                                                                                     // 9
                                                                                                                  // 10
// http://docs.meteor.com/#tracker_active                                                                         // 11
                                                                                                                  // 12
/**                                                                                                               // 13
 * @summary True if there is a current computation, meaning that dependencies on reactive data sources will be tracked and potentially cause the current computation to be rerun.
 * @locus Client                                                                                                  // 15
 * @type {Boolean}                                                                                                // 16
 */                                                                                                               // 17
Tracker.active = false;                                                                                           // 18
                                                                                                                  // 19
// http://docs.meteor.com/#tracker_currentcomputation                                                             // 20
                                                                                                                  // 21
/**                                                                                                               // 22
 * @summary The current computation, or `null` if there isn't one.  The current computation is the [`Tracker.Computation`](#tracker_computation) object created by the innermost active call to `Tracker.autorun`, and it's the computation that gains dependencies when reactive data sources are accessed.
 * @locus Client                                                                                                  // 24
 * @type {Tracker.Computation}                                                                                    // 25
 */                                                                                                               // 26
Tracker.currentComputation = null;                                                                                // 27
                                                                                                                  // 28
// References to all computations created within the Tracker by id.                                               // 29
// Keeping these references on an underscore property gives more control to                                       // 30
// tooling and packages extending Tracker without increasing the API surface.                                     // 31
// These can used to monkey-patch computations, their functions, use                                              // 32
// computation ids for tracking, etc.                                                                             // 33
Tracker._computations = {};                                                                                       // 34
                                                                                                                  // 35
var setCurrentComputation = function (c) {                                                                        // 36
  Tracker.currentComputation = c;                                                                                 // 37
  Tracker.active = !! c;                                                                                          // 38
};                                                                                                                // 39
                                                                                                                  // 40
var _debugFunc = function () {                                                                                    // 41
  // We want this code to work without Meteor, and also without                                                   // 42
  // "console" (which is technically non-standard and may be missing                                              // 43
  // on some browser we come across, like it was on IE 7).                                                        // 44
  //                                                                                                              // 45
  // Lazy evaluation because `Meteor` does not exist right away.(??)                                              // 46
  return (typeof Meteor !== "undefined" ? Meteor._debug :                                                         // 47
          ((typeof console !== "undefined") && console.log ?                                                      // 48
           function () { console.log.apply(console, arguments); } :                                               // 49
           function () {}));                                                                                      // 50
};                                                                                                                // 51
                                                                                                                  // 52
var _throwOrLog = function (from, e) {                                                                            // 53
  if (throwFirstError) {                                                                                          // 54
    throw e;                                                                                                      // 55
  } else {                                                                                                        // 56
    var messageAndStack;                                                                                          // 57
    if (e.stack && e.message) {                                                                                   // 58
      var idx = e.stack.indexOf(e.message);                                                                       // 59
      if (idx >= 0 && idx <= 10) // allow for "Error: " (at least 7)                                              // 60
        messageAndStack = e.stack; // message is part of e.stack, as in Chrome                                    // 61
      else                                                                                                        // 62
        messageAndStack = e.message +                                                                             // 63
        (e.stack.charAt(0) === '\n' ? '' : '\n') + e.stack; // e.g. Safari                                        // 64
    } else {                                                                                                      // 65
      messageAndStack = e.stack || e.message;                                                                     // 66
    }                                                                                                             // 67
    _debugFunc()("Exception from Tracker " + from + " function:",                                                 // 68
                 messageAndStack);                                                                                // 69
  }                                                                                                               // 70
};                                                                                                                // 71
                                                                                                                  // 72
// Takes a function `f`, and wraps it in a `Meteor._noYieldsAllowed`                                              // 73
// block if we are running on the server. On the client, returns the                                              // 74
// original function (since `Meteor._noYieldsAllowed` is a                                                        // 75
// no-op). This has the benefit of not adding an unnecessary stack                                                // 76
// frame on the client.                                                                                           // 77
var withNoYieldsAllowed = function (f) {                                                                          // 78
  if ((typeof Meteor === 'undefined') || Meteor.isClient) {                                                       // 79
    return f;                                                                                                     // 80
  } else {                                                                                                        // 81
    return function () {                                                                                          // 82
      var args = arguments;                                                                                       // 83
      Meteor._noYieldsAllowed(function () {                                                                       // 84
        f.apply(null, args);                                                                                      // 85
      });                                                                                                         // 86
    };                                                                                                            // 87
  }                                                                                                               // 88
};                                                                                                                // 89
                                                                                                                  // 90
var nextId = 1;                                                                                                   // 91
// computations whose callbacks we should call at flush time                                                      // 92
var pendingComputations = [];                                                                                     // 93
// `true` if a Tracker.flush is scheduled, or if we are in Tracker.flush now                                      // 94
var willFlush = false;                                                                                            // 95
// `true` if we are in Tracker.flush now                                                                          // 96
var inFlush = false;                                                                                              // 97
// `true` if we are computing a computation now, either first time                                                // 98
// or recompute.  This matches Tracker.active unless we are inside                                                // 99
// Tracker.nonreactive, which nullfies currentComputation even though                                             // 100
// an enclosing computation may still be running.                                                                 // 101
var inCompute = false;                                                                                            // 102
// `true` if the `_throwFirstError` option was passed in to the call                                              // 103
// to Tracker.flush that we are in. When set, throw rather than log the                                           // 104
// first error encountered while flushing. Before throwing the error,                                             // 105
// finish flushing (from a finally block), logging any subsequent                                                 // 106
// errors.                                                                                                        // 107
var throwFirstError = false;                                                                                      // 108
                                                                                                                  // 109
var afterFlushCallbacks = [];                                                                                     // 110
                                                                                                                  // 111
var requireFlush = function () {                                                                                  // 112
  if (! willFlush) {                                                                                              // 113
    setTimeout(Tracker.flush, 0);                                                                                 // 114
    willFlush = true;                                                                                             // 115
  }                                                                                                               // 116
};                                                                                                                // 117
                                                                                                                  // 118
// Tracker.Computation constructor is visible but private                                                         // 119
// (throws an error if you try to call it)                                                                        // 120
var constructingComputation = false;                                                                              // 121
                                                                                                                  // 122
//                                                                                                                // 123
// http://docs.meteor.com/#tracker_computation                                                                    // 124
                                                                                                                  // 125
/**                                                                                                               // 126
 * @summary A Computation object represents code that is repeatedly rerun                                         // 127
 * in response to                                                                                                 // 128
 * reactive data changes. Computations don't have return values; they just                                        // 129
 * perform actions, such as rerendering a template on the screen. Computations                                    // 130
 * are created using Tracker.autorun. Use stop to prevent further rerunning of a                                  // 131
 * computation.                                                                                                   // 132
 * @instancename computation                                                                                      // 133
 */                                                                                                               // 134
Tracker.Computation = function (f, parent) {                                                                      // 135
  if (! constructingComputation)                                                                                  // 136
    throw new Error(                                                                                              // 137
      "Tracker.Computation constructor is private; use Tracker.autorun");                                         // 138
  constructingComputation = false;                                                                                // 139
                                                                                                                  // 140
  var self = this;                                                                                                // 141
                                                                                                                  // 142
  // http://docs.meteor.com/#computation_stopped                                                                  // 143
                                                                                                                  // 144
  /**                                                                                                             // 145
   * @summary True if this computation has been stopped.                                                          // 146
   * @locus Client                                                                                                // 147
   * @memberOf Tracker.Computation                                                                                // 148
   * @instance                                                                                                    // 149
   * @name  stopped                                                                                               // 150
   */                                                                                                             // 151
  self.stopped = false;                                                                                           // 152
                                                                                                                  // 153
  // http://docs.meteor.com/#computation_invalidated                                                              // 154
                                                                                                                  // 155
  /**                                                                                                             // 156
   * @summary True if this computation has been invalidated (and not yet rerun), or if it has been stopped.       // 157
   * @locus Client                                                                                                // 158
   * @memberOf Tracker.Computation                                                                                // 159
   * @instance                                                                                                    // 160
   * @name  invalidated                                                                                           // 161
   * @type {Boolean}                                                                                              // 162
   */                                                                                                             // 163
  self.invalidated = false;                                                                                       // 164
                                                                                                                  // 165
  // http://docs.meteor.com/#computation_firstrun                                                                 // 166
                                                                                                                  // 167
  /**                                                                                                             // 168
   * @summary True during the initial run of the computation at the time `Tracker.autorun` is called, and false on subsequent reruns and at other times.
   * @locus Client                                                                                                // 170
   * @memberOf Tracker.Computation                                                                                // 171
   * @instance                                                                                                    // 172
   * @name  firstRun                                                                                              // 173
   * @type {Boolean}                                                                                              // 174
   */                                                                                                             // 175
  self.firstRun = true;                                                                                           // 176
                                                                                                                  // 177
  self._id = nextId++;                                                                                            // 178
  self._onInvalidateCallbacks = [];                                                                               // 179
  // the plan is at some point to use the parent relation                                                         // 180
  // to constrain the order that computations are processed                                                       // 181
  self._parent = parent;                                                                                          // 182
  self._func = f;                                                                                                 // 183
  self._recomputing = false;                                                                                      // 184
                                                                                                                  // 185
  // Register the computation within the global Tracker.                                                          // 186
  Tracker._computations[self._id] = self;                                                                         // 187
                                                                                                                  // 188
  var errored = true;                                                                                             // 189
  try {                                                                                                           // 190
    self._compute();                                                                                              // 191
    errored = false;                                                                                              // 192
  } finally {                                                                                                     // 193
    self.firstRun = false;                                                                                        // 194
    if (errored)                                                                                                  // 195
      self.stop();                                                                                                // 196
  }                                                                                                               // 197
};                                                                                                                // 198
                                                                                                                  // 199
// http://docs.meteor.com/#computation_oninvalidate                                                               // 200
                                                                                                                  // 201
/**                                                                                                               // 202
 * @summary Registers `callback` to run when this computation is next invalidated, or runs it immediately if the computation is already invalidated.  The callback is run exactly once and not upon future invalidations unless `onInvalidate` is called again after the computation becomes valid again.
 * @locus Client                                                                                                  // 204
 * @param {Function} callback Function to be called on invalidation. Receives one argument, the computation that was invalidated.
 */                                                                                                               // 206
Tracker.Computation.prototype.onInvalidate = function (f) {                                                       // 207
  var self = this;                                                                                                // 208
                                                                                                                  // 209
  if (typeof f !== 'function')                                                                                    // 210
    throw new Error("onInvalidate requires a function");                                                          // 211
                                                                                                                  // 212
  if (self.invalidated) {                                                                                         // 213
    Tracker.nonreactive(function () {                                                                             // 214
      withNoYieldsAllowed(f)(self);                                                                               // 215
    });                                                                                                           // 216
  } else {                                                                                                        // 217
    self._onInvalidateCallbacks.push(f);                                                                          // 218
  }                                                                                                               // 219
};                                                                                                                // 220
                                                                                                                  // 221
// http://docs.meteor.com/#computation_invalidate                                                                 // 222
                                                                                                                  // 223
/**                                                                                                               // 224
 * @summary Invalidates this computation so that it will be rerun.                                                // 225
 * @locus Client                                                                                                  // 226
 */                                                                                                               // 227
Tracker.Computation.prototype.invalidate = function () {                                                          // 228
  var self = this;                                                                                                // 229
  if (! self.invalidated) {                                                                                       // 230
    // if we're currently in _recompute(), don't enqueue                                                          // 231
    // ourselves, since we'll rerun immediately anyway.                                                           // 232
    if (! self._recomputing && ! self.stopped) {                                                                  // 233
      requireFlush();                                                                                             // 234
      pendingComputations.push(this);                                                                             // 235
    }                                                                                                             // 236
                                                                                                                  // 237
    self.invalidated = true;                                                                                      // 238
                                                                                                                  // 239
    // callbacks can't add callbacks, because                                                                     // 240
    // self.invalidated === true.                                                                                 // 241
    for(var i = 0, f; f = self._onInvalidateCallbacks[i]; i++) {                                                  // 242
      Tracker.nonreactive(function () {                                                                           // 243
        withNoYieldsAllowed(f)(self);                                                                             // 244
      });                                                                                                         // 245
    }                                                                                                             // 246
    self._onInvalidateCallbacks = [];                                                                             // 247
  }                                                                                                               // 248
};                                                                                                                // 249
                                                                                                                  // 250
// http://docs.meteor.com/#computation_stop                                                                       // 251
                                                                                                                  // 252
/**                                                                                                               // 253
 * @summary Prevents this computation from rerunning.                                                             // 254
 * @locus Client                                                                                                  // 255
 */                                                                                                               // 256
Tracker.Computation.prototype.stop = function () {                                                                // 257
  if (! this.stopped) {                                                                                           // 258
    this.stopped = true;                                                                                          // 259
    this.invalidate();                                                                                            // 260
    // Unregister from global Tracker.                                                                            // 261
    delete Tracker._computations[this._id];                                                                       // 262
  }                                                                                                               // 263
};                                                                                                                // 264
                                                                                                                  // 265
Tracker.Computation.prototype._compute = function () {                                                            // 266
  var self = this;                                                                                                // 267
  self.invalidated = false;                                                                                       // 268
                                                                                                                  // 269
  var previous = Tracker.currentComputation;                                                                      // 270
  setCurrentComputation(self);                                                                                    // 271
  var previousInCompute = inCompute;                                                                              // 272
  inCompute = true;                                                                                               // 273
  try {                                                                                                           // 274
    withNoYieldsAllowed(self._func)(self);                                                                        // 275
  } finally {                                                                                                     // 276
    setCurrentComputation(previous);                                                                              // 277
    inCompute = previousInCompute;                                                                                // 278
  }                                                                                                               // 279
};                                                                                                                // 280
                                                                                                                  // 281
Tracker.Computation.prototype._recompute = function () {                                                          // 282
  var self = this;                                                                                                // 283
                                                                                                                  // 284
  self._recomputing = true;                                                                                       // 285
  try {                                                                                                           // 286
    while (self.invalidated && ! self.stopped) {                                                                  // 287
      try {                                                                                                       // 288
        self._compute();                                                                                          // 289
      } catch (e) {                                                                                               // 290
        _throwOrLog("recompute", e);                                                                              // 291
      }                                                                                                           // 292
      // If _compute() invalidated us, we run again immediately.                                                  // 293
      // A computation that invalidates itself indefinitely is an                                                 // 294
      // infinite loop, of course.                                                                                // 295
      //                                                                                                          // 296
      // We could put an iteration counter here and catch run-away                                                // 297
      // loops.                                                                                                   // 298
    }                                                                                                             // 299
  } finally {                                                                                                     // 300
    self._recomputing = false;                                                                                    // 301
  }                                                                                                               // 302
};                                                                                                                // 303
                                                                                                                  // 304
//                                                                                                                // 305
// http://docs.meteor.com/#tracker_dependency                                                                     // 306
                                                                                                                  // 307
/**                                                                                                               // 308
 * @summary A Dependency represents an atomic unit of reactive data that a                                        // 309
 * computation might depend on. Reactive data sources such as Session or                                          // 310
 * Minimongo internally create different Dependency objects for different                                         // 311
 * pieces of data, each of which may be depended on by multiple computations.                                     // 312
 * When the data changes, the computations are invalidated.                                                       // 313
 * @class                                                                                                         // 314
 * @instanceName dependency                                                                                       // 315
 */                                                                                                               // 316
Tracker.Dependency = function () {                                                                                // 317
  this._dependentsById = {};                                                                                      // 318
};                                                                                                                // 319
                                                                                                                  // 320
// http://docs.meteor.com/#dependency_depend                                                                      // 321
//                                                                                                                // 322
// Adds `computation` to this set if it is not already                                                            // 323
// present.  Returns true if `computation` is a new member of the set.                                            // 324
// If no argument, defaults to currentComputation, or does nothing                                                // 325
// if there is no currentComputation.                                                                             // 326
                                                                                                                  // 327
/**                                                                                                               // 328
 * @summary Declares that the current computation (or `fromComputation` if given) depends on `dependency`.  The computation will be invalidated the next time `dependency` changes.
                                                                                                                  // 330
If there is no current computation and `depend()` is called with no arguments, it does nothing and returns false. // 331
                                                                                                                  // 332
Returns true if the computation is a new dependent of `dependency` rather than an existing one.                   // 333
 * @locus Client                                                                                                  // 334
 * @param {Tracker.Computation} [fromComputation] An optional computation declared to depend on `dependency` instead of the current computation.
 * @returns {Boolean}                                                                                             // 336
 */                                                                                                               // 337
Tracker.Dependency.prototype.depend = function (computation) {                                                    // 338
  if (! computation) {                                                                                            // 339
    if (! Tracker.active)                                                                                         // 340
      return false;                                                                                               // 341
                                                                                                                  // 342
    computation = Tracker.currentComputation;                                                                     // 343
  }                                                                                                               // 344
  var self = this;                                                                                                // 345
  var id = computation._id;                                                                                       // 346
  if (! (id in self._dependentsById)) {                                                                           // 347
    self._dependentsById[id] = computation;                                                                       // 348
    computation.onInvalidate(function () {                                                                        // 349
      delete self._dependentsById[id];                                                                            // 350
    });                                                                                                           // 351
    return true;                                                                                                  // 352
  }                                                                                                               // 353
  return false;                                                                                                   // 354
};                                                                                                                // 355
                                                                                                                  // 356
// http://docs.meteor.com/#dependency_changed                                                                     // 357
                                                                                                                  // 358
/**                                                                                                               // 359
 * @summary Invalidate all dependent computations immediately and remove them as dependents.                      // 360
 * @locus Client                                                                                                  // 361
 */                                                                                                               // 362
Tracker.Dependency.prototype.changed = function () {                                                              // 363
  var self = this;                                                                                                // 364
  for (var id in self._dependentsById)                                                                            // 365
    self._dependentsById[id].invalidate();                                                                        // 366
};                                                                                                                // 367
                                                                                                                  // 368
// http://docs.meteor.com/#dependency_hasdependents                                                               // 369
                                                                                                                  // 370
/**                                                                                                               // 371
 * @summary True if this Dependency has one or more dependent Computations, which would be invalidated if this Dependency were to change.
 * @locus Client                                                                                                  // 373
 * @returns {Boolean}                                                                                             // 374
 */                                                                                                               // 375
Tracker.Dependency.prototype.hasDependents = function () {                                                        // 376
  var self = this;                                                                                                // 377
  for(var id in self._dependentsById)                                                                             // 378
    return true;                                                                                                  // 379
  return false;                                                                                                   // 380
};                                                                                                                // 381
                                                                                                                  // 382
// http://docs.meteor.com/#tracker_flush                                                                          // 383
                                                                                                                  // 384
/**                                                                                                               // 385
 * @summary Process all reactive updates immediately and ensure that all invalidated computations are rerun.      // 386
 * @locus Client                                                                                                  // 387
 */                                                                                                               // 388
Tracker.flush = function (_opts) {                                                                                // 389
  // XXX What part of the comment below is still true? (We no longer                                              // 390
  // have Spark)                                                                                                  // 391
  //                                                                                                              // 392
  // Nested flush could plausibly happen if, say, a flush causes                                                  // 393
  // DOM mutation, which causes a "blur" event, which runs an                                                     // 394
  // app event handler that calls Tracker.flush.  At the moment                                                   // 395
  // Spark blocks event handlers during DOM mutation anyway,                                                      // 396
  // because the LiveRange tree isn't valid.  And we don't have                                                   // 397
  // any useful notion of a nested flush.                                                                         // 398
  //                                                                                                              // 399
  // https://app.asana.com/0/159908330244/385138233856                                                            // 400
  if (inFlush)                                                                                                    // 401
    throw new Error("Can't call Tracker.flush while flushing");                                                   // 402
                                                                                                                  // 403
  if (inCompute)                                                                                                  // 404
    throw new Error("Can't flush inside Tracker.autorun");                                                        // 405
                                                                                                                  // 406
  inFlush = true;                                                                                                 // 407
  willFlush = true;                                                                                               // 408
  throwFirstError = !! (_opts && _opts._throwFirstError);                                                         // 409
                                                                                                                  // 410
  var finishedTry = false;                                                                                        // 411
  try {                                                                                                           // 412
    while (pendingComputations.length ||                                                                          // 413
           afterFlushCallbacks.length) {                                                                          // 414
                                                                                                                  // 415
      // recompute all pending computations                                                                       // 416
      while (pendingComputations.length) {                                                                        // 417
        var comp = pendingComputations.shift();                                                                   // 418
        comp._recompute();                                                                                        // 419
      }                                                                                                           // 420
                                                                                                                  // 421
      if (afterFlushCallbacks.length) {                                                                           // 422
        // call one afterFlush callback, which may                                                                // 423
        // invalidate more computations                                                                           // 424
        var func = afterFlushCallbacks.shift();                                                                   // 425
        try {                                                                                                     // 426
          func();                                                                                                 // 427
        } catch (e) {                                                                                             // 428
          _throwOrLog("afterFlush", e);                                                                           // 429
        }                                                                                                         // 430
      }                                                                                                           // 431
    }                                                                                                             // 432
    finishedTry = true;                                                                                           // 433
  } finally {                                                                                                     // 434
    if (! finishedTry) {                                                                                          // 435
      // we're erroring                                                                                           // 436
      inFlush = false; // needed before calling `Tracker.flush()` again                                           // 437
      Tracker.flush({_throwFirstError: false}); // finish flushing                                                // 438
    }                                                                                                             // 439
    willFlush = false;                                                                                            // 440
    inFlush = false;                                                                                              // 441
  }                                                                                                               // 442
};                                                                                                                // 443
                                                                                                                  // 444
// http://docs.meteor.com/#tracker_autorun                                                                        // 445
//                                                                                                                // 446
// Run f(). Record its dependencies. Rerun it whenever the                                                        // 447
// dependencies change.                                                                                           // 448
//                                                                                                                // 449
// Returns a new Computation, which is also passed to f.                                                          // 450
//                                                                                                                // 451
// Links the computation to the current computation                                                               // 452
// so that it is stopped if the current computation is invalidated.                                               // 453
                                                                                                                  // 454
/**                                                                                                               // 455
 * @summary Run a function now and rerun it later whenever its dependencies change. Returns a Computation object that can be used to stop or observe the rerunning.
 * @locus Client                                                                                                  // 457
 * @param {Function} runFunc The function to run. It receives one argument: the Computation object that will be returned.
 * @returns {Tracker.Computation}                                                                                 // 459
 */                                                                                                               // 460
Tracker.autorun = function (f) {                                                                                  // 461
  if (typeof f !== 'function')                                                                                    // 462
    throw new Error('Tracker.autorun requires a function argument');                                              // 463
                                                                                                                  // 464
  constructingComputation = true;                                                                                 // 465
  var c = new Tracker.Computation(f, Tracker.currentComputation);                                                 // 466
                                                                                                                  // 467
  if (Tracker.active)                                                                                             // 468
    Tracker.onInvalidate(function () {                                                                            // 469
      c.stop();                                                                                                   // 470
    });                                                                                                           // 471
                                                                                                                  // 472
  return c;                                                                                                       // 473
};                                                                                                                // 474
                                                                                                                  // 475
// http://docs.meteor.com/#tracker_nonreactive                                                                    // 476
//                                                                                                                // 477
// Run `f` with no current computation, returning the return value                                                // 478
// of `f`.  Used to turn off reactivity for the duration of `f`,                                                  // 479
// so that reactive data sources accessed by `f` will not result in any                                           // 480
// computations being invalidated.                                                                                // 481
                                                                                                                  // 482
/**                                                                                                               // 483
 * @summary Run a function without tracking dependencies.                                                         // 484
 * @locus Client                                                                                                  // 485
 * @param {Function} func A function to call immediately.                                                         // 486
 */                                                                                                               // 487
Tracker.nonreactive = function (f) {                                                                              // 488
  var previous = Tracker.currentComputation;                                                                      // 489
  setCurrentComputation(null);                                                                                    // 490
  try {                                                                                                           // 491
    return f();                                                                                                   // 492
  } finally {                                                                                                     // 493
    setCurrentComputation(previous);                                                                              // 494
  }                                                                                                               // 495
};                                                                                                                // 496
                                                                                                                  // 497
// http://docs.meteor.com/#tracker_oninvalidate                                                                   // 498
                                                                                                                  // 499
/**                                                                                                               // 500
 * @summary Registers a new [`onInvalidate`](#computation_oninvalidate) callback on the current computation (which must exist), to be called immediately when the current computation is invalidated or stopped.
 * @locus Client                                                                                                  // 502
 * @param {Function} callback A callback function that will be invoked as `func(c)`, where `c` is the computation on which the callback is registered.
 */                                                                                                               // 504
Tracker.onInvalidate = function (f) {                                                                             // 505
  if (! Tracker.active)                                                                                           // 506
    throw new Error("Tracker.onInvalidate requires a currentComputation");                                        // 507
                                                                                                                  // 508
  Tracker.currentComputation.onInvalidate(f);                                                                     // 509
};                                                                                                                // 510
                                                                                                                  // 511
// http://docs.meteor.com/#tracker_afterflush                                                                     // 512
                                                                                                                  // 513
/**                                                                                                               // 514
 * @summary Schedules a function to be called during the next flush, or later in the current flush if one is in progress, after all invalidated computations have been rerun.  The function will be run once and not on subsequent flushes unless `afterFlush` is called again.
 * @locus Client                                                                                                  // 516
 * @param {Function} callback A function to call at flush time.                                                   // 517
 */                                                                                                               // 518
Tracker.afterFlush = function (f) {                                                                               // 519
  afterFlushCallbacks.push(f);                                                                                    // 520
  requireFlush();                                                                                                 // 521
};                                                                                                                // 522
                                                                                                                  // 523
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/tracker/deprecated.js                                                                                 //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
// Deprecated functions.                                                                                          // 1
                                                                                                                  // 2
// These functions used to be on the Meteor object (and worked slightly                                           // 3
// differently).                                                                                                  // 4
// XXX COMPAT WITH 0.5.7                                                                                          // 5
Meteor.flush = Tracker.flush;                                                                                     // 6
Meteor.autorun = Tracker.autorun;                                                                                 // 7
                                                                                                                  // 8
// We used to require a special "autosubscribe" call to reactively subscribe to                                   // 9
// things. Now, it works with autorun.                                                                            // 10
// XXX COMPAT WITH 0.5.4                                                                                          // 11
Meteor.autosubscribe = Tracker.autorun;                                                                           // 12
                                                                                                                  // 13
// This Tracker API briefly existed in 0.5.8 and 0.5.9                                                            // 14
// XXX COMPAT WITH 0.5.9                                                                                          // 15
Tracker.depend = function (d) {                                                                                   // 16
  return d.depend();                                                                                              // 17
};                                                                                                                // 18
                                                                                                                  // 19
Deps = Tracker;                                                                                                   // 20
                                                                                                                  // 21
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.tracker = {
  Tracker: Tracker,
  Deps: Deps
};

})();

//# sourceMappingURL=tracker.js.map
