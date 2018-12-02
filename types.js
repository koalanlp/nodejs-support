"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoarseEntityType = exports.RoleType = exports.DependencyTag = exports.PhraseTag = exports.POS = void 0;

var _jvm = require("./jvm");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * 자바 Enum 표현
 * @private
 */
class JavaEnum {
  /**
   * Enum 명칭
   * @type {string}
   */

  /**
   * Enum 순서 번호
   * @type {number}
   */

  /**
   * Enum class 이름
   * @type {string}
   */
  constructor(reference) {
    _defineProperty(this, "keyname", '');

    _defineProperty(this, "ordinal", -1);

    _defineProperty(this, "classType", '');

    this.reference = reference;
    this.keyname = reference.name_;
    this.ordinal = reference.ordinal;
    this.classType = reference.getClass().getName();
  }
  /**
   * 문자열로 변환
   * @returns {string} 이 값을 표현하는 문자열
   */


  toString() {
    return this.keyname;
  }
  /**
   * 두 대상이 같은지 확인합니다.
   * @param other 다른 대상
   * @returns {boolean} 같다면 true.
   */


  equals(other) {
    if (other instanceof JavaEnum && this.classType === other.classType) return other.reference.equals(this.reference);else return false;
  }
  /**
   * 전체 값의 목록을 불러옵니다.
   * @param clsName 불러올 클래스
   * @returns {Array} 전체 값 목록
   */


  static getAllOf(...clsName) {
    return _jvm.JVM.toJsArray(_jvm.JVM.koalaClassOf(...clsName).values());
  }

}
/**
 * 세종 품사표기
 * @example
 * import { POS } from 'koalanlp/types';
 * POS.NNP;
 */


class POS extends JavaEnum {
  /**
   * POS 값 전체
   * @type {Object.<string, POS>}
   * @private
   */

  /**
   * POS 값들을 모두 돌려줍니다.
   * @returns {POS[]} POS값들의 array
   */
  static values() {
    if (POS._values.length() === 0) {
      JavaEnum.getAllOf('POS').forEach(it => {
        POS._values[it.name] = new POS(it);
      });
    }

    return POS._values.values();
  }
  /**
   * 이름에 해당하는 값을 찾아줍니다.
   * @param {!string} name 해당 이름으로 된 값
   * @returns {POS}
   */


  static withName(name) {
    return POS._values[name];
  }
  /**
   * 이 값이 체언인지 확인합니다.
   * @returns {boolean} 체언인 경우 true
   */


  isNoun() {
    return this.reference.isNoun();
  }
  /**
   * 이 값이 용언인지 확인합니다.
   * @returns {boolean} 용언인 경우 true
   */


  isPredicate() {
    return this.reference.isPredicate();
  }
  /**
   * 이 값이 수식언인지 확인합니다.
   * @returns {boolean} 수식언인 경우 true
   */


  isModifier() {
    return this.reference.isModifier();
  }
  /**
   * 이 값이 관계언인지 확인합니다.
   * @returns {boolean} 관계언인 경우 true
   */


  isPostPosition() {
    return this.reference.isPostPosition();
  }
  /**
   * 이 값이 어미인지 확인합니다.
   * @returns {boolean} 어미인 경우 true
   */


  isEnding() {
    return this.reference.isEnding();
  }
  /**
   * 이 값이 접사인지 확인합니다.
   * @returns {boolean} 접사인 경우 true
   */


  isAffix() {
    return this.reference.isAffix();
  }
  /**
   * 이 값이 접미사인지 확인합니다.
   * @returns {boolean} 접미사인 경우 true
   */


  isSuffix() {
    return this.reference.isSuffix();
  }
  /**
   * 이 값이 기호인지 확인합니다.
   * @returns {boolean} 기호인 경우 true
   */


  isSymbol() {
    return this.reference.isSymbol();
  }
  /**
   * 이 값이 미확인 단어인지 확인합니다.
   * @returns {boolean} 미확인 단어인 경우 true
   */


  isUnknown() {
    return this.reference.isUnknown();
  }
  /**
   * 이 값이 주어진 [tag]로 시작하는지 확인합니다.
   * @param {!string} tag 시작하는지 확인할 품사 분류
   * @returns {boolean} 포함되는 경우(시작하는 경우) True
   */


  startsWith(tag) {
    return this.reference.startsWith(tag);
  }

}
/**
 * 세종 구문구조 표지자
 * @example
 * import { PhraseTag } from 'koalanlp/types';
 */


exports.POS = POS;

_defineProperty(POS, "_values", {});

class PhraseTag extends JavaEnum {
  /**
   * 값 전체
   * @type {Object.<string, PhraseTag>}
   * @private
   */

  /**
   * PhraseTag 값들을 모두 돌려줍니다.
   * @returns {PhraseTag[]} PhraseTag값들의 array
   */
  static values() {
    if (PhraseTag._values.length() === 0) {
      JavaEnum.getAllOf('PhraseTag').forEach(it => {
        PhraseTag._values[it.name] = new PhraseTag(it);
      });
    }

    return PhraseTag._values.values();
  }
  /**
   * 이름에 해당하는 값을 찾아줍니다.
   * @param {!string} name 해당 이름으로 된 값
   * @returns {PhraseTag}
   */


  static withName(name) {
    return PhraseTag._values[name];
  }

}
/**
 * ETRI 의존구문구조 기능표지자
 * @example
 * import { DependencyTag } from 'koalanlp/types';
 */


exports.PhraseTag = PhraseTag;

_defineProperty(PhraseTag, "_values", {});

class DependencyTag extends JavaEnum {
  /**
   * 값 전체
   * @type {Object.<string, DependencyTag>}
   * @private
   */

  /**
   * DependencyTag 값들을 모두 돌려줍니다.
   * @returns {DependencyTag[]} DependencyTag값들의 array
   */
  static values() {
    if (DependencyTag._values.length() === 0) {
      JavaEnum.getAllOf('DependencyTag').forEach(it => {
        DependencyTag._values[it.name] = new DependencyTag(it);
      });
    }

    return DependencyTag._values.values();
  }
  /**
   * 이름에 해당하는 값을 찾아줍니다.
   * @param {!string} name 해당 이름으로 된 값
   * @returns {DependencyTag}
   */


  static withName(name) {
    return DependencyTag._values[name];
  }

}
/**
 * ETRI 의미역 분석 표지
 * @example
 * import { RoleType } from 'koalanlp/types';
 */


exports.DependencyTag = DependencyTag;

_defineProperty(DependencyTag, "_values", {});

class RoleType extends JavaEnum {
  /**
   * 값 전체
   * @type {Object.<string, RoleType>}
   * @private
   */

  /**
   * RoleType 값들을 모두 돌려줍니다.
   * @returns {RoleType[]} RoleType값들의 array
   */
  static values() {
    if (RoleType._values.length() === 0) {
      JavaEnum.getAllOf('RoleType').forEach(it => {
        RoleType._values[it.name] = new RoleType(it);
      });
    }

    return RoleType._values.values();
  }
  /**
   * 이름에 해당하는 값을 찾아줍니다.
   * @param {!string} name 해당 이름으로 된 값
   * @returns {RoleType}
   */


  static withName(name) {
    return RoleType._values[name];
  }

}
/**
 * ETRI 개체명 대분류
 * @example
 * import { CoarseEntityType } from 'koalanlp/types';
 */


exports.RoleType = RoleType;

_defineProperty(RoleType, "_values", {});

class CoarseEntityType extends JavaEnum {
  /**
   * 값 전체
   * @type {Object.<string, CoarseEntityType>}
   * @private
   */

  /**
   * CoarseEntityType 값들을 모두 돌려줍니다.
   * @returns {CoarseEntityType[]} CoarseEntityType값들의 array
   */
  static values() {
    if (CoarseEntityType._values.length() === 0) {
      JavaEnum.getAllOf('CoarseEntityType').forEach(it => {
        CoarseEntityType._values[it.name] = new CoarseEntityType(it);
      });
    }

    return CoarseEntityType._values.values();
  }
  /**
   * 이름에 해당하는 값을 찾아줍니다.
   * @param {!string} name 해당 이름으로 된 값
   * @returns {CoarseEntityType}
   */


  static withName(name) {
    return CoarseEntityType._values[name];
  }

}

exports.CoarseEntityType = CoarseEntityType;

_defineProperty(CoarseEntityType, "_values", {});