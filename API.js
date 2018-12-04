"use strict";

var cov_19kml7auf8 = function () {
  var path = "/home/bydelta/WebstormProjects/nodejs-support/src/API.js",
      hash = "cf3f489cce734514c337b533d04314926d60d0b8",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/bydelta/WebstormProjects/nodejs-support/src/API.js",
    statementMap: {
      "0": {
        start: {
          line: 25,
          column: 19
        },
        end: {
          line: 25,
          column: 24
        }
      },
      "1": {
        start: {
          line: 35,
          column: 19
        },
        end: {
          line: 35,
          column: 24
        }
      },
      "2": {
        start: {
          line: 45,
          column: 20
        },
        end: {
          line: 45,
          column: 26
        }
      },
      "3": {
        start: {
          line: 55,
          column: 23
        },
        end: {
          line: 55,
          column: 32
        }
      },
      "4": {
        start: {
          line: 65,
          column: 23
        },
        end: {
          line: 65,
          column: 32
        }
      },
      "5": {
        start: {
          line: 75,
          column: 21
        },
        end: {
          line: 75,
          column: 28
        }
      },
      "6": {
        start: {
          line: 85,
          column: 19
        },
        end: {
          line: 85,
          column: 24
        }
      },
      "7": {
        start: {
          line: 95,
          column: 20
        },
        end: {
          line: 95,
          column: 26
        }
      },
      "8": {
        start: {
          line: 105,
          column: 20
        },
        end: {
          line: 105,
          column: 26
        }
      },
      "9": {
        start: {
          line: 115,
          column: 20
        },
        end: {
          line: 115,
          column: 26
        }
      },
      "10": {
        start: {
          line: 122,
          column: 40
        },
        end: {
          line: 122,
          column: 73
        }
      },
      "11": {
        start: {
          line: 133,
          column: 4
        },
        end: {
          line: 137,
          column: 5
        }
      },
      "12": {
        start: {
          line: 134,
          column: 8
        },
        end: {
          line: 134,
          column: 43
        }
      },
      "13": {
        start: {
          line: 136,
          column: 8
        },
        end: {
          line: 136,
          column: 67
        }
      },
      "14": {
        start: {
          line: 148,
          column: 4
        },
        end: {
          line: 148,
          column: 29
        }
      }
    },
    fnMap: {
      "0": {
        name: "query",
        decl: {
          start: {
            line: 132,
            column: 16
          },
          end: {
            line: 132,
            column: 21
          }
        },
        loc: {
          start: {
            line: 132,
            column: 33
          },
          end: {
            line: 138,
            column: 1
          }
        },
        line: 132
      },
      "1": {
        name: "getPackage",
        decl: {
          start: {
            line: 147,
            column: 16
          },
          end: {
            line: 147,
            column: 26
          }
        },
        loc: {
          start: {
            line: 147,
            column: 32
          },
          end: {
            line: 149,
            column: 1
          }
        },
        line: 147
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.query = query;
exports.getPackage = getPackage;
exports.PACKAGE_REQUIRE_ASSEMBLY = exports.CORE = exports.ETRI = exports.DAON = exports.OKT = exports.RHINO = exports.ARIRANG = exports.EUNJEON = exports.KKMA = exports.KMR = exports.HNN = void 0;

var _jvm = require("./jvm");

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
const HNN = (cov_19kml7auf8.s[0]++, 'hnn');
/**
 * 코모란.
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-kmr.svg?style=flat-square&label=r"/> 버전이 최신입니다. 품사분석만 가능합니다.
 * @type API
 * @example
 * import {KMR} from 'koalanlp/API';
 */

exports.HNN = HNN;
const KMR = (cov_19kml7auf8.s[1]++, 'kmr');
/**
 * 꼬꼬마.
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-kkma.svg?style=flat-square&label=r"/> 버전이 최신입니다. 품사분석, 의존분석만 가능합니다.
 * @type API
 * @example
 * import {KKMA} from 'koalanlp/API';
 */

exports.KMR = KMR;
const KKMA = (cov_19kml7auf8.s[2]++, 'kkma');
/**
 * 은전한닢.
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-eunjeon.svg?style=flat-square&label=r"/> 버전이 최신입니다. 품사분석만 가능합니다.
 * @type API
 * @example
 * import {EUNJEON} from 'koalanlp/API';
 */

exports.KKMA = KKMA;
const EUNJEON = (cov_19kml7auf8.s[3]++, 'eunjeon');
/**
 * 아리랑.
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-arirang.svg?style=flat-square&label=r"/> 버전이 최신입니다. 품사분석만 가능합니다.
 * @type API
 * @example
 * import {ARIRANG} from 'koalanlp/API';
 */

exports.EUNJEON = EUNJEON;
const ARIRANG = (cov_19kml7auf8.s[4]++, 'arirang');
/**
 * 라이노.
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-rhino.svg?style=flat-square&label=r"/> 버전이 최신입니다. 품사분석만 가능합니다.
 * @type API
 * @example
 * import {RHINO} from 'koalanlp/API';
 */

exports.ARIRANG = ARIRANG;
const RHINO = (cov_19kml7auf8.s[5]++, 'rhino');
/**
 * 트위터.
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-okt.svg?style=flat-square&label=r"/> 버전이 최신입니다. 문장분리, 품사분석만 가능합니다.
 * @type API
 * @example
 * import {OKT} from 'koalanlp/API';
 */

exports.RHINO = RHINO;
const OKT = (cov_19kml7auf8.s[6]++, 'okt');
/**
 * 다온.
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-daon.svg?style=flat-square&label=r"/> 버전이 최신입니다. 품사분석만 가능합니다.
 * @type API
 * @example
 * import {DAON} from 'koalanlp/API';
 */

exports.OKT = OKT;
const DAON = (cov_19kml7auf8.s[7]++, 'daon');
/**
 * ETRI Open API.
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-etri.svg?style=flat-square&label=r"/> 버전이 최신입니다.
 * @type API
 * @example
 * import {ETRI} from 'koalanlp/API';
 */

exports.DAON = DAON;
const ETRI = (cov_19kml7auf8.s[8]++, 'etri');
/**
 * 분석기 Interface 정의 라이브러리.
 * 현재 <img src="https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-core.svg?style=flat-square&label=r"/> 버전이 최신입니다. 편의기능을 제공하며 타 분석기 참조시 함께 참조됩니다.
 * @type API
 * @example
 * import {CORE} from 'koalanlp/API';
 */

exports.ETRI = ETRI;
const CORE = (cov_19kml7auf8.s[9]++, 'core');
/**
 * 'assembly' classifier 필요 여부
 * @private
 */

exports.CORE = CORE;
const PACKAGE_REQUIRE_ASSEMBLY = (cov_19kml7auf8.s[10]++, [HNN, KKMA, ARIRANG, RHINO, DAON]);
/**
 * 해당 API가 분석기를 지원하는지 확인함.
 * @param {!API} api 분석기 API
 * @param {!string} type 분석기 유형
 * @returns {Object} 지원한다면 해당 분석기 Java 클래스.
 * @private
 */

exports.PACKAGE_REQUIRE_ASSEMBLY = PACKAGE_REQUIRE_ASSEMBLY;

function query(api, type) {
  cov_19kml7auf8.f[0]++;
  cov_19kml7auf8.s[11]++;

  try {
    cov_19kml7auf8.s[12]++;
    return _jvm.JVM.koalaClassOf(api, type);
  } catch (e) {
    cov_19kml7auf8.s[13]++;
    throw Error(`API.${api}는 ${type}을 지원하지 않습니다! Cause: ${e}`);
  }
}
/**
 * API의 패키지 이름 반환
 * @param {string} api 분석기 API
 * @return {string} 패키지 이름 접미사
 * @private
 */


function getPackage(api) {
  cov_19kml7auf8.f[1]++;
  cov_19kml7auf8.s[14]++;
  return api.toLowerCase();
}