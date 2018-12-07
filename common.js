"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDefined = isDefined;
exports.getOrUndefined = getOrUndefined;
exports.assert = assert;
exports.typeCheck = typeCheck;

/** @private */
function isDefined(value) {
  return typeof value !== 'undefined' && value !== null;
}
/** @private */


function getOrUndefined(value) {
  return isDefined(value) ? value : undefined;
}
/** @private */


function assert(condition, msg) {
  if (!condition) throw TypeError(msg);
}
/** @private */


function typeCheck(values, ...types) {
  types = new Set(types);
  new Set(values.map(x => {
    let t = typeof x;
    if (t === 'object') t = x.constructor.name;
    return t;
  })).forEach(t => {
    assert(types.has(t), `[${[...types].toString()}] 중 하나를 기대했지만 ${t} 타입이 들어왔습니다!`);
  });
}