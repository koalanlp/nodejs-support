"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.query = query;
exports.getPackage = getPackage;
exports.PACKAGE_REQUIRE_ASSEMBLY = exports.CORE = exports.UTAGGER = exports.KHAIII = exports.ETRI = exports.DAON = exports.OKT = exports.RHINO = exports.ARIRANG = exports.EUNJEON = exports.KKMA = exports.KMR = exports.HNN = void 0;

var _jvm = require("./jvm");

/**
 * KoalaNLP가 지원하는 패키지의 목록을 키값으로 가지고 있습니다.
 *
 * * **주의** API를 import한다고 하여 자동으로 초기화가 되지 않으니 꼭 {@link module:koalanlp/Util.initialize}를 실행하시기 바랍니다.
 *
 * @module koalanlp/API
 * @example
 * import * as API from 'koalanlp/API';
 * **/

/**
 * @public
 * @typedef {string} API
 */

/**
 * 한나눔.
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-hnn.svg?style=flat-square&label=r"/> 버전이 최신입니다. 문장분리, 품사분석, 구문분석, 의존분석이 가능합니다.
 * @type API
 * @example
 * import {HNN} from 'koalanlp/API';
 */
const HNN = 'hnn';
/**
 * 코모란.
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-kmr.svg?style=flat-square&label=r"/> 버전이 최신입니다. 품사분석만 가능합니다.
 * @type API
 * @example
 * import {KMR} from 'koalanlp/API';
 */

exports.HNN = HNN;
const KMR = 'kmr';
/**
 * 꼬꼬마.
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-kkma.svg?style=flat-square&label=r"/> 버전이 최신입니다. 품사분석, 의존분석만 가능합니다.
 * @type API
 * @example
 * import {KKMA} from 'koalanlp/API';
 */

exports.KMR = KMR;
const KKMA = 'kkma';
/**
 * 은전한닢.
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-eunjeon.svg?style=flat-square&label=r"/> 버전이 최신입니다. 품사분석만 가능합니다.
 * @type API
 * @example
 * import {EUNJEON} from 'koalanlp/API';
 */

exports.KKMA = KKMA;
const EUNJEON = 'eunjeon';
/**
 * 아리랑.
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-arirang.svg?style=flat-square&label=r"/> 버전이 최신입니다. 품사분석만 가능합니다.
 * @type API
 * @example
 * import {ARIRANG} from 'koalanlp/API';
 */

exports.EUNJEON = EUNJEON;
const ARIRANG = 'arirang';
/**
 * 라이노.
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-rhino.svg?style=flat-square&label=r"/> 버전이 최신입니다. 품사분석만 가능합니다.
 * @type API
 * @example
 * import {RHINO} from 'koalanlp/API';
 */

exports.ARIRANG = ARIRANG;
const RHINO = 'rhino';
/**
 * 트위터.
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-okt.svg?style=flat-square&label=r"/> 버전이 최신입니다. 문장분리, 품사분석만 가능합니다.
 * @type API
 * @example
 * import {OKT} from 'koalanlp/API';
 */

exports.RHINO = RHINO;
const OKT = 'okt';
/**
 * 다온.
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-daon.svg?style=flat-square&label=r"/> 버전이 최신입니다. 품사분석만 가능합니다.
 * @type API
 * @example
 * import {DAON} from 'koalanlp/API';
 */

exports.OKT = OKT;
const DAON = 'daon';
/**
 * ETRI Open API.
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-etri.svg?style=flat-square&label=r"/> 버전이 최신입니다.
 * @type API
 * @example
 * import {ETRI} from 'koalanlp/API';
 */

exports.DAON = DAON;
const ETRI = 'etri';
/**
 * Kakao Khaiii (Experimental)
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-khaiii.svg?style=flat-square&label=r"/> 버전이 최신입니다.
 *
 * **(참고)**
 * - 이 기능은 현재 실험적인 기능입니다.
 * - Khaiii는 C++로 개발되어 별도 설치가 필요합니다. [Khaiii](https://github.com/kakao/khaiii) 공식 홈페이지에서 설치법을 확인하시고, 설치하시면 됩니다.
 *
 * @type API
 * @example
 * import {KHAIII} from 'koalanlp/API';
 */

exports.ETRI = ETRI;
const KHAIII = 'khaiii';
/**
 * UTagger (Experimental)
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-utagger.svg?style=flat-square&label=r"/> 버전이 최신입니다.
 *
 * **(참고)**
 * - 이 기능은 현재 실험적인 기능입니다.
 * - UTagger는 C로 개발되어 별도 설치가 필요합니다. [UTagger install](https://koalanlp.github.io/usage/Install-UTagger.md)에서 설치법을 확인하시고, 설치하시면 됩니다.
 *
 * @type API
 * @example
 * import {UTAGGER} from 'koalanlp/API';
 */

exports.KHAIII = KHAIII;
const UTAGGER = 'utagger';
/**
 * 분석기 Interface 정의 라이브러리.
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-core.svg?style=flat-square&label=r"/> 버전이 최신입니다. 편의기능을 제공하며 타 분석기 참조시 함께 참조됩니다.
 * @type API
 * @example
 * import {CORE} from 'koalanlp/API';
 */

exports.UTAGGER = UTAGGER;
const CORE = 'core';
/**
 * 'assembly' classifier 필요 여부
 * @private
 */

exports.CORE = CORE;
const PACKAGE_REQUIRE_ASSEMBLY = [HNN, KKMA, ARIRANG, RHINO, DAON];
/**
 * 해당 API가 분석기를 지원하는지 확인함.
 * @param {!API} api 분석기 API
 * @param {!string} type 분석기 유형
 * @returns {Object} 지원한다면 해당 분석기 Java 클래스.
 * @private
 */

exports.PACKAGE_REQUIRE_ASSEMBLY = PACKAGE_REQUIRE_ASSEMBLY;

function query(api, type) {
  try {
    return _jvm.JVM.koalaClassOf(api, type);
  } catch (e) {
    throw Error(`API.${api}에서 ${type}을 불러오는 데 실패했습니다! ${type}이 없거나, 다운로드가 완전하지 않았을 수 있습니다. Cause: ${e}`);
  }
}
/**
 * API의 패키지 이름 반환
 * @param {string} api 분석기 API
 * @return {string} 패키지 이름 접미사
 * @private
 */


function getPackage(api) {
  return api.toLowerCase();
}