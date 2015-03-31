(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var _ = Package.underscore._;
var Random = Package.random.Random;

/* Package-scope variables */
var ObserveSequence, seqChangedToEmpty, seqChangedToArray, seqChangedToCursor;

(function () {

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/observe-sequence/observe_sequence.js                                 //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
var warn = function () {                                                         // 1
  if (ObserveSequence._suppressWarnings) {                                       // 2
    ObserveSequence._suppressWarnings--;                                         // 3
  } else {                                                                       // 4
    if (typeof console !== 'undefined' && console.warn)                          // 5
      console.warn.apply(console, arguments);                                    // 6
                                                                                 // 7
    ObserveSequence._loggedWarnings++;                                           // 8
  }                                                                              // 9
};                                                                               // 10
                                                                                 // 11
var idStringify = LocalCollection._idStringify;                                  // 12
var idParse = LocalCollection._idParse;                                          // 13
                                                                                 // 14
ObserveSequence = {                                                              // 15
  _suppressWarnings: 0,                                                          // 16
  _loggedWarnings: 0,                                                            // 17
                                                                                 // 18
  // A mechanism similar to cursor.observe which receives a reactive             // 19
  // function returning a sequence type and firing appropriate callbacks         // 20
  // when the value changes.                                                     // 21
  //                                                                             // 22
  // @param sequenceFunc {Function} a reactive function returning a              // 23
  //     sequence type. The currently supported sequence types are:              // 24
  //     'null', arrays and cursors.                                             // 25
  //                                                                             // 26
  // @param callbacks {Object} similar to a specific subset of                   // 27
  //     callbacks passed to `cursor.observe`                                    // 28
  //     (http://docs.meteor.com/#observe), with minor variations to             // 29
  //     support the fact that not all sequences contain objects with            // 30
  //     _id fields.  Specifically:                                              // 31
  //                                                                             // 32
  //     * addedAt(id, item, atIndex, beforeId)                                  // 33
  //     * changedAt(id, newItem, oldItem, atIndex)                              // 34
  //     * removedAt(id, oldItem, atIndex)                                       // 35
  //     * movedTo(id, item, fromIndex, toIndex, beforeId)                       // 36
  //                                                                             // 37
  // @returns {Object(stop: Function)} call 'stop' on the return value           // 38
  //     to stop observing this sequence function.                               // 39
  //                                                                             // 40
  // We don't make any assumptions about our ability to compare sequence         // 41
  // elements (ie, we don't assume EJSON.equals works; maybe there is extra      // 42
  // state/random methods on the objects) so unlike cursor.observe, we may       // 43
  // sometimes call changedAt() when nothing actually changed.                   // 44
  // XXX consider if we *can* make the stronger assumption and avoid             // 45
  //     no-op changedAt calls (in some cases?)                                  // 46
  //                                                                             // 47
  // XXX currently only supports the callbacks used by our                       // 48
  // implementation of {{#each}}, but this can be expanded.                      // 49
  //                                                                             // 50
  // XXX #each doesn't use the indices (though we'll eventually need             // 51
  // a way to get them when we support `@index`), but calling                    // 52
  // `cursor.observe` causes the index to be calculated on every                 // 53
  // callback using a linear scan (unless you turn it off by passing             // 54
  // `_no_indices`).  Any way to avoid calculating indices on a pure             // 55
  // cursor observe like we used to?                                             // 56
  observe: function (sequenceFunc, callbacks) {                                  // 57
    var lastSeq = null;                                                          // 58
    var activeObserveHandle = null;                                              // 59
                                                                                 // 60
    // 'lastSeqArray' contains the previous value of the sequence                // 61
    // we're observing. It is an array of objects with '_id' and                 // 62
    // 'item' fields.  'item' is the element in the array, or the                // 63
    // document in the cursor.                                                   // 64
    //                                                                           // 65
    // '_id' is whichever of the following is relevant, unless it has            // 66
    // already appeared -- in which case it's randomly generated.                // 67
    //                                                                           // 68
    // * if 'item' is an object:                                                 // 69
    //   * an '_id' field, if present                                            // 70
    //   * otherwise, the index in the array                                     // 71
    //                                                                           // 72
    // * if 'item' is a number or string, use that value                         // 73
    //                                                                           // 74
    // XXX this can be generalized by allowing {{#each}} to accept a             // 75
    // general 'key' argument which could be a function, a dotted                // 76
    // field name, or the special @index value.                                  // 77
    var lastSeqArray = []; // elements are objects of form {_id, item}           // 78
    var computation = Tracker.autorun(function () {                              // 79
      var seq = sequenceFunc();                                                  // 80
                                                                                 // 81
      Tracker.nonreactive(function () {                                          // 82
        var seqArray; // same structure as `lastSeqArray` above.                 // 83
                                                                                 // 84
        if (activeObserveHandle) {                                               // 85
          // If we were previously observing a cursor, replace lastSeqArray with // 86
          // more up-to-date information.  Then stop the old observe.            // 87
          lastSeqArray = _.map(lastSeq.fetch(), function (doc) {                 // 88
            return {_id: doc._id, item: doc};                                    // 89
          });                                                                    // 90
          activeObserveHandle.stop();                                            // 91
          activeObserveHandle = null;                                            // 92
        }                                                                        // 93
                                                                                 // 94
        if (!seq) {                                                              // 95
          seqArray = seqChangedToEmpty(lastSeqArray, callbacks);                 // 96
        } else if (seq instanceof Array) {                                       // 97
          seqArray = seqChangedToArray(lastSeqArray, seq, callbacks);            // 98
        } else if (isStoreCursor(seq)) {                                         // 99
          var result /* [seqArray, activeObserveHandle] */ =                     // 100
                seqChangedToCursor(lastSeqArray, seq, callbacks);                // 101
          seqArray = result[0];                                                  // 102
          activeObserveHandle = result[1];                                       // 103
        } else {                                                                 // 104
          throw badSequenceError();                                              // 105
        }                                                                        // 106
                                                                                 // 107
        diffArray(lastSeqArray, seqArray, callbacks);                            // 108
        lastSeq = seq;                                                           // 109
        lastSeqArray = seqArray;                                                 // 110
      });                                                                        // 111
    });                                                                          // 112
                                                                                 // 113
    return {                                                                     // 114
      stop: function () {                                                        // 115
        computation.stop();                                                      // 116
        if (activeObserveHandle)                                                 // 117
          activeObserveHandle.stop();                                            // 118
      }                                                                          // 119
    };                                                                           // 120
  },                                                                             // 121
                                                                                 // 122
  // Fetch the items of `seq` into an array, where `seq` is of one of the        // 123
  // sequence types accepted by `observe`.  If `seq` is a cursor, a              // 124
  // dependency is established.                                                  // 125
  fetch: function (seq) {                                                        // 126
    if (!seq) {                                                                  // 127
      return [];                                                                 // 128
    } else if (seq instanceof Array) {                                           // 129
      return seq;                                                                // 130
    } else if (isStoreCursor(seq)) {                                             // 131
      return seq.fetch();                                                        // 132
    } else {                                                                     // 133
      throw badSequenceError();                                                  // 134
    }                                                                            // 135
  }                                                                              // 136
};                                                                               // 137
                                                                                 // 138
var badSequenceError = function () {                                             // 139
  return new Error("{{#each}} currently only accepts " +                         // 140
                   "arrays, cursors or falsey values.");                         // 141
};                                                                               // 142
                                                                                 // 143
var isStoreCursor = function (cursor) {                                          // 144
  return cursor && _.isObject(cursor) &&                                         // 145
    _.isFunction(cursor.observe) && _.isFunction(cursor.fetch);                  // 146
};                                                                               // 147
                                                                                 // 148
// Calculates the differences between `lastSeqArray` and                         // 149
// `seqArray` and calls appropriate functions from `callbacks`.                  // 150
// Reuses Minimongo's diff algorithm implementation.                             // 151
var diffArray = function (lastSeqArray, seqArray, callbacks) {                   // 152
  var diffFn = Package.minimongo.LocalCollection._diffQueryOrderedChanges;       // 153
  var oldIdObjects = [];                                                         // 154
  var newIdObjects = [];                                                         // 155
  var posOld = {}; // maps from idStringify'd ids                                // 156
  var posNew = {}; // ditto                                                      // 157
  var posCur = {};                                                               // 158
  var lengthCur = lastSeqArray.length;                                           // 159
                                                                                 // 160
  _.each(seqArray, function (doc, i) {                                           // 161
    newIdObjects.push({_id: doc._id});                                           // 162
    posNew[idStringify(doc._id)] = i;                                            // 163
  });                                                                            // 164
  _.each(lastSeqArray, function (doc, i) {                                       // 165
    oldIdObjects.push({_id: doc._id});                                           // 166
    posOld[idStringify(doc._id)] = i;                                            // 167
    posCur[idStringify(doc._id)] = i;                                            // 168
  });                                                                            // 169
                                                                                 // 170
  // Arrays can contain arbitrary objects. We don't diff the                     // 171
  // objects. Instead we always fire 'changedAt' callback on every               // 172
  // object. The consumer of `observe-sequence` should deal with                 // 173
  // it appropriately.                                                           // 174
  diffFn(oldIdObjects, newIdObjects, {                                           // 175
    addedBefore: function (id, doc, before) {                                    // 176
      var position = before ? posCur[idStringify(before)] : lengthCur;           // 177
                                                                                 // 178
      if (before) {                                                              // 179
        // If not adding at the end, we need to update indexes.                  // 180
        // XXX this can still be improved greatly!                               // 181
        _.each(posCur, function (pos, id) {                                      // 182
          if (pos >= position)                                                   // 183
            posCur[id]++;                                                        // 184
        });                                                                      // 185
      }                                                                          // 186
                                                                                 // 187
      lengthCur++;                                                               // 188
      posCur[idStringify(id)] = position;                                        // 189
                                                                                 // 190
      callbacks.addedAt(                                                         // 191
        id,                                                                      // 192
        seqArray[posNew[idStringify(id)]].item,                                  // 193
        position,                                                                // 194
        before);                                                                 // 195
    },                                                                           // 196
    movedBefore: function (id, before) {                                         // 197
      var prevPosition = posCur[idStringify(id)];                                // 198
      var position = before ? posCur[idStringify(before)] : lengthCur - 1;       // 199
                                                                                 // 200
      _.each(posCur, function (pos, id) {                                        // 201
        if (pos >= prevPosition && pos <= position)                              // 202
          posCur[id]--;                                                          // 203
        else if (pos <= prevPosition && pos >= position)                         // 204
          posCur[id]++;                                                          // 205
      });                                                                        // 206
                                                                                 // 207
      posCur[idStringify(id)] = position;                                        // 208
                                                                                 // 209
      callbacks.movedTo(                                                         // 210
        id,                                                                      // 211
        seqArray[posNew[idStringify(id)]].item,                                  // 212
        prevPosition,                                                            // 213
        position,                                                                // 214
        before);                                                                 // 215
    },                                                                           // 216
    removed: function (id) {                                                     // 217
      var prevPosition = posCur[idStringify(id)];                                // 218
                                                                                 // 219
      _.each(posCur, function (pos, id) {                                        // 220
        if (pos >= prevPosition)                                                 // 221
          posCur[id]--;                                                          // 222
      });                                                                        // 223
                                                                                 // 224
      delete posCur[idStringify(id)];                                            // 225
      lengthCur--;                                                               // 226
                                                                                 // 227
      callbacks.removedAt(                                                       // 228
        id,                                                                      // 229
        lastSeqArray[posOld[idStringify(id)]].item,                              // 230
        prevPosition);                                                           // 231
    }                                                                            // 232
  });                                                                            // 233
                                                                                 // 234
  _.each(posNew, function (pos, idString) {                                      // 235
    var id = idParse(idString);                                                  // 236
    if (_.has(posOld, idString)) {                                               // 237
      // specifically for primitive types, compare equality before               // 238
      // firing the 'changedAt' callback. otherwise, always fire it              // 239
      // because doing a deep EJSON comparison is not guaranteed to              // 240
      // work (an array can contain arbitrary objects, and 'transform'           // 241
      // can be used on cursors). also, deep diffing is not                      // 242
      // necessarily the most efficient (if only a specific subfield             // 243
      // of the object is later accessed).                                       // 244
      var newItem = seqArray[pos].item;                                          // 245
      var oldItem = lastSeqArray[posOld[idString]].item;                         // 246
                                                                                 // 247
      if (typeof newItem === 'object' || newItem !== oldItem)                    // 248
          callbacks.changedAt(id, newItem, oldItem, pos);                        // 249
      }                                                                          // 250
  });                                                                            // 251
};                                                                               // 252
                                                                                 // 253
seqChangedToEmpty = function (lastSeqArray, callbacks) {                         // 254
  return [];                                                                     // 255
};                                                                               // 256
                                                                                 // 257
seqChangedToArray = function (lastSeqArray, array, callbacks) {                  // 258
  var idsUsed = {};                                                              // 259
  var seqArray = _.map(array, function (item, index) {                           // 260
    var id;                                                                      // 261
    if (typeof item === 'string') {                                              // 262
      // ensure not empty, since other layers (eg DomRange) assume this as well  // 263
      id = "-" + item;                                                           // 264
    } else if (typeof item === 'number' ||                                       // 265
               typeof item === 'boolean' ||                                      // 266
               item === undefined) {                                             // 267
      id = item;                                                                 // 268
    } else if (typeof item === 'object') {                                       // 269
      id = (item && item._id) || index;                                          // 270
    } else {                                                                     // 271
      throw new Error("{{#each}} doesn't support arrays with " +                 // 272
                      "elements of type " + typeof item);                        // 273
    }                                                                            // 274
                                                                                 // 275
    var idString = idStringify(id);                                              // 276
    if (idsUsed[idString]) {                                                     // 277
      if (typeof item === 'object' && '_id' in item)                             // 278
        warn("duplicate id " + id + " in", array);                               // 279
      id = Random.id();                                                          // 280
    } else {                                                                     // 281
      idsUsed[idString] = true;                                                  // 282
    }                                                                            // 283
                                                                                 // 284
    return { _id: id, item: item };                                              // 285
  });                                                                            // 286
                                                                                 // 287
  return seqArray;                                                               // 288
};                                                                               // 289
                                                                                 // 290
seqChangedToCursor = function (lastSeqArray, cursor, callbacks) {                // 291
  var initial = true; // are we observing initial data from cursor?              // 292
  var seqArray = [];                                                             // 293
                                                                                 // 294
  var observeHandle = cursor.observe({                                           // 295
    addedAt: function (document, atIndex, before) {                              // 296
      if (initial) {                                                             // 297
        // keep track of initial data so that we can diff once                   // 298
        // we exit `observe`.                                                    // 299
        if (before !== null)                                                     // 300
          throw new Error("Expected initial data from observe in order");        // 301
        seqArray.push({ _id: document._id, item: document });                    // 302
      } else {                                                                   // 303
        callbacks.addedAt(document._id, document, atIndex, before);              // 304
      }                                                                          // 305
    },                                                                           // 306
    changedAt: function (newDocument, oldDocument, atIndex) {                    // 307
      callbacks.changedAt(newDocument._id, newDocument, oldDocument,             // 308
                          atIndex);                                              // 309
    },                                                                           // 310
    removedAt: function (oldDocument, atIndex) {                                 // 311
      callbacks.removedAt(oldDocument._id, oldDocument, atIndex);                // 312
    },                                                                           // 313
    movedTo: function (document, fromIndex, toIndex, before) {                   // 314
      callbacks.movedTo(                                                         // 315
        document._id, document, fromIndex, toIndex, before);                     // 316
    }                                                                            // 317
  });                                                                            // 318
  initial = false;                                                               // 319
                                                                                 // 320
  return [seqArray, observeHandle];                                              // 321
};                                                                               // 322
                                                                                 // 323
///////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['observe-sequence'] = {
  ObserveSequence: ObserveSequence
};

})();

//# sourceMappingURL=observe-sequence.js.map
