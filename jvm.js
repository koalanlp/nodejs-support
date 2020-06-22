"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JVM = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * JVM Wrapper
 * @private
 */
class JVM {
  /**
   * Reflection된 Java Class 보관소
   * @type {Object.<string, Object>}
   * @private
   */

  /**
   * 시스템에서 사용하는 JVM Instance
   */

  /**
   * 불러온 패키지 목록.
   */

  /**
   * Node-java에서 사용하는 JVM interface
   * @private
   * @type {Object}
   */
  static init(java, packages) {
    if (typeof java === 'undefined' || java === null || JVM.java) throw TypeError('java는 null일 수 없고, JVM.init()은 한 번만 실행되어야 합니다.');
    JVM.PACKAGES = packages;
    JVM.java = java;
  }
  /**
   * Java class 반환
   * @param {!string} path Class package path
   * @returns {Object} Java class
   */


  static classOf(...path) {
    let clsName = path.join('.');
    if (!JVM._classes.hasOwnProperty(clsName)) JVM._classes[clsName] = JVM.java.import(clsName);
    return JVM._classes[clsName];
  }
  /**
   * Koala Class 반환
   * @param {!string} path Class package path
   * @returns {Object} Java class
   */


  static koalaClassOf(...path) {
    return JVM.classOf('kr.bydelta.koala', ...path);
  }
  /**
   * Koala Enum 반환
   * @param {!string} tagset 표지자 집합 클래스 이름
   * @param {?string} tag 표지자 이름
   * @returns {?Object} 표지자 이름에 맞는 Java Enum
   */


  static koalaEnumOf(tagset, tag) {
    if (tag !== null && typeof tag !== 'undefined') return JVM.koalaClassOf(tagset).valueOf(tag);else return null;
  }
  /**
   * Java Iterable -> JSON Array
   * @param {Object} array
   * @param itemConverter
   * @returns {Array}
   */


  static toJsArray(array, itemConverter = x => x, isIterable = false) {
    if (typeof array === "undefined" || array === null) return [];
    if (Array.isArray(array)) return array.map(itemConverter);
    let result = [];

    if (isIterable) {
      let it = array.iterator();

      while (it.hasNext()) {
        result.push(itemConverter(it.next()));
      }
    } else {
      let length = array.size();

      for (let i = 0; i < length; ++i) {
        result.push(itemConverter(array.get(i)));
      }
    }

    return result;
  }
  /**
   * JSON Array -> Java List
   * @param {Object[]} array
   */


  static listOf(array) {
    let list = new (JVM.classOf('java.util.ArrayList'))();

    for (const item of array) list.add(item);

    return list;
  }
  /**
   * Make Java Pair
   * @param {Object} a First entry
   * @param {Object} b Second entry
   */


  static pair(a, b) {
    return new (JVM.classOf('kotlin.Pair'))(a, b);
  }
  /**
   * Make Java Char
   * @param {?string} ch Character
   * @returns {Object} Java Character
   */


  static char(ch) {
    if (ch !== null && typeof ch !== 'undefined') return JVM.java.newChar(ch.charCodeAt(0));else return null;
  }
  /**
   * Make Java Set
   * @param {Object[]} array Items
   * @returns {Object} Java Set
   */


  static setOf(array) {
    let list = new (JVM.classOf('java.util.HashSet'))();

    for (const item of array) list.add(item);

    return list;
  }

  static posFilter(posSet) {
    return JVM.java.newProxy('kotlin.jvm.functions.Function1', {
      'invoke': function (tag) {
        return posSet.includes(tag.name());
      }
    });
  }
  /**
   * Check whether these packages are compatible.
   * @param {Object.<string, string>} packages
   */


  static canLoadPackages(packages) {
    let result = {};

    if (JVM.java && JVM.java.isJvmCreated()) {
      for (let [pack, ver] of Object.entries(packages)) {
        result[pack] = JVM.PACKAGES.hasOwnProperty(pack) && (ver.toUpperCase() === 'LATEST' || JVM.PACKAGES[pack] >= ver);
      }
    } else {
      for (let pack of Object.keys(packages)) {
        result[pack] = true;
      }
    }

    return result;
  }

}

exports.JVM = JVM;

_defineProperty(JVM, "_classes", {});

_defineProperty(JVM, "INSTANCE", void 0);

_defineProperty(JVM, "PACKAGES", void 0);

_defineProperty(JVM, "java", void 0);