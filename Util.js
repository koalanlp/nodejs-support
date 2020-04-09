"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialize = initialize;
exports.contains = contains;

require("core-js/modules/es6.array.sort");

var API = _interopRequireWildcard(require("./API"));

var _jvm = require("./jvm");

var _types = require("./types");

var _underscore = _interopRequireDefault(require("underscore"));

var _common = require("./common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * 초기화 및 기타 작업에 필요한 함수를 제공합니다.
 *
 * @module koalanlp/Util
 * @example
 * import * as Util from 'koalanlp/Util';
 */

/**
 * @private
 * @param api
 */
async function queryVersion(api) {
  const request = require('request');

  let url = `https://repo1.maven.org/maven2/kr/bydelta/koalanlp-${api}/`;
  let result = await new Promise((resolve, reject) => {
    request(url, {
      headers: {
        'User-Agent': 'curl/7.58.0'
      }
    }, // Query as if CURL did.
    (error, res, body) => {
      if (error) reject(error);else resolve(body);
    });
  });
  let matches = result.match(new RegExp('href="(\\d+\\.\\d+\\.\\d+(-[A-Za-z]+(\\.\\d+)?)?)/"', 'g'));
  matches = matches.map(line => line.substring(6, line.length - 2));
  let version = matches.sort().reverse()[0];
  console.info(`[INFO] Latest version of kr.bydelta:koalanlp-${api} (${version}) will be used`);
  return version;
}
/**
 * API와 버전을 받아 Artifact 객체 구성
 * @param {API} api 분석기 패키지 이름
 * @param {!string} version 버전 또는 LATEST
 * @return {{groupId: string, artifactId: string, version: string}} Artifact 객체
 * @private
 */


async function makeDependencyItem(api, version) {
  let isAssembly = API.PACKAGE_REQUIRE_ASSEMBLY.includes(api);

  if (typeof version === 'undefined' || version.toUpperCase() === 'LATEST') {
    version = await queryVersion(api);
  }

  let obj = {
    "groupId": "kr.bydelta",
    "artifactId": `koalanlp-${api}`,
    "version": version
  };

  if (isAssembly) {
    obj.classifier = "assembly";
  }

  return obj;
}
/**
 * Remote Maven Repository list
 * @type {Object[]}
 * @private
 */


let remoteRepos = [{
  id: 'sonatype',
  url: 'https://oss.sonatype.org/content/repositories/public/'
}, {
  id: "jitpack.io",
  url: "https://jitpack.io/"
}, {
  id: 'jcenter',
  url: 'https://jcenter.bintray.com/'
}, {
  id: 'maven-central-1',
  url: 'https://repo1.maven.org/maven2/'
}, {
  id: 'maven-central-2',
  url: 'http://insecure.repo1.maven.org/maven2/'
}, {
  id: 'kotlin-dev',
  url: 'https://dl.bintray.com/kotlin/kotlin-dev/'
}];

function versionSplit(ver) {
  let dashAt = ver.indexOf('-');

  if (dashAt !== -1) {
    let semver = ver.substr(0, dashAt).split('\\.');
    let tag = ver.substr(dashAt + 1);
    semver = semver.map(parseInt);
    semver.push(tag);
    return semver;
  } else {
    let semver = ver.split('\\.');
    return semver.map(parseInt);
  }
}
/** @private */


function isRightNewer(ver1, ver2) {
  let semver1 = versionSplit(ver1);
  let semver2 = versionSplit(ver2);
  let length = Math.max(semver1.length, semver2.length);

  for (let i of _underscore.default.range(length)) {
    let comp1 = semver1[i];
    let comp2 = semver2[i];
    if (!(0, _common.isDefined)(comp2)) return true; // 왼쪽은 Tag가 있지만 오른쪽은 없는 상태. (오른쪽이 더 최신)

    if (!(0, _common.isDefined)(comp1)) return false; // 반대: 왼쪽이 더 최신

    if (comp1 !== comp2) return comp1 < comp2; // comp2 가 더 높으면 최신.
  }

  return false;
}
/**
 * 자바 및 의존패키지를 Maven Repository에서 다운받고, 자바 환경을 실행합니다.
 *
 * @param {Object} options
 * @param {Object.<string, string>} options.packages 사용할 패키지와 그 버전들.
 * @param {string[]} [options.javaOptions=["-Xmx4g", "-Dfile.encoding=utf-8"]] JVM 초기화 조건
 * @param {boolean} [options.verbose=true] 더 상세히 초기화 과정을 보여줄 것인지의 여부.
 * @param {!string} [options.tempJsonName='koalanlp.json'] Maven 실행을 위해 임시로 작성할 파일의 이름.
 * @example
 * import {initialize} from 'koalanlp/Util';
 * import {ETRI} from 'koalanlp/API';
 *
 * // Promise 방식
 * let promise = initialize({'packages': {ETRI: '2.0.4'}});
 * promise.then(...);
 *
 * // Async/Await 방식 (async function 내부에서)
 * await initialize({ETRI: '2.0.4'});
 * ...
 */


async function initialize(options) {
  (0, _common.assert)(options.packages, "packages는 설정되어야 하는 값입니다.");
  let packages = options.packages;
  let verbose = (0, _common.isDefined)(options.verbose) ? options.verbose : false;
  let javaOptions = options.javaOptions || ["-Xmx4g", "-Dfile.encoding=utf-8"];
  let tempJsonName = options.tempJsonName || 'koalanlp.json';
  /***** 자바 초기화 ******/

  let java = require('java');

  if (!_jvm.JVM.canLoadPackages(packages)) {
    throw Error(`JVM은 두번 이상 초기화될 수 없습니다. ${packages}를 불러오려고 시도했지만 이미 ${_jvm.JVM.PACKAGES}를 불러온 상태입니다.`);
  }

  java.options.push(...javaOptions);
  java.asyncOptions = {
    asyncSuffix: undefined,
    // Async Callback 무력화
    syncSuffix: '',
    // Synchronized call은 접미사 없음
    promiseSuffix: 'Promise',
    // Promise Callback 설정
    promisify: require('util').promisify
  };
  /***** Maven 설정 *****/

  const os = require('os');

  const fs = require('fs');

  const path = require('path');

  const mvn = require('node-java-maven'); // 의존 패키지 목록을 JSON으로 작성하기


  let dependencies = await Promise.all(Object.keys(packages).map(pack => makeDependencyItem(API.getPackage(pack), packages[pack]))); // Package 버전 업데이트 (Compatiblity check 위함)

  for (const pack of dependencies) {
    packages[pack.artifactId.replace('koalanlp-', '').toUpperCase()] = pack.version;
  } // 저장하기


  let packPath = path.join(os.tmpdir(), tempJsonName);
  fs.writeFileSync(packPath, JSON.stringify({
    java: {
      dependencies: dependencies,
      exclusions: [{
        groupId: "com.jsuereth",
        artifactId: "sbt-pgp"
      }]
    }
  }));

  let threads = require('os').cpus().length;

  threads = Math.max(threads - 1, 1);
  let promise = new Promise((resolve, reject) => {
    mvn({
      packageJsonPath: packPath,
      debug: verbose,
      repositories: remoteRepos,
      concurrency: threads
    }, function (err, mvnResults) {
      if (err) {
        console.error('필요한 의존패키지를 전부 다 가져오지는 못했습니다.');
        reject(err);
      } else {
        let cleanClasspath = {};

        for (const dependency of Object.values(mvnResults.dependencies)) {
          let group = dependency.groupId;
          let artifact = dependency.artifactId;
          let version = dependency.version;
          let key = `${group}:${artifact}`;

          if (!(0, _common.isDefined)(cleanClasspath[key]) || isRightNewer(cleanClasspath[key].version, version)) {
            cleanClasspath[key] = {
              version: version,
              path: dependency.jarPath
            };
          }
        }

        for (const dependency of Object.values(cleanClasspath)) {
          if (!(0, _common.isDefined)(dependency.path)) continue;
          if (verbose) console.debug(`Classpath에 ${dependency.path} 추가`);
          java.classpath.push(path.resolve(dependency.path));
        }

        _jvm.JVM.init(java, packages); // Enum 초기화.


        _types.POS.values();

        _types.PhraseTag.values();

        _types.DependencyTag.values();

        _types.RoleType.values();

        _types.CoarseEntityType.values();

        resolve();
      }
    });
  });
  return await promise;
}
/**
 * 주어진 문자열 리스트에 구문분석 표지자/의존구문 표지자/의미역 표지/개체명 분류가 포함되는지 확인합니다.
 * @param {string[]} stringList 분류가 포함되는지 확인할 문자열 목록
 * @param {(POS|PhraseTag|DependencyTag|CoarseEntityType|RoleType)} tag 포함되는지 확인할 구문분석 표지자/의존구문 표지자/의미역 표지/개체명 분류
 * @return {boolean} 포함되면 true.
 * @example
 * import { contains } from 'koalanlp/Util';
 * contains(['S', 'NP'], PhraseTag.NP);
 */


function contains(stringList, tag) {
  if (tag instanceof _types.POS || tag instanceof _types.PhraseTag || tag instanceof _types.DependencyTag || tag instanceof _types.RoleType || tag instanceof _types.CoarseEntityType) {
    return _jvm.JVM.koalaClassOf('Util').contains(_jvm.JVM.listOf(stringList), tag.reference);
  } else {
    return false;
  }
}