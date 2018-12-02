"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialize = initialize;
exports.contains = contains;

var API = _interopRequireWildcard(require("./API"));

var _jvm = require("./jvm");

var _types = require("./types");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * 초기화 및 기타 작업에 필요한 함수를 제공합니다.
 *
 * @module koalanlp/Util
 * @example
 * import * as Util from 'koalanlp/Util';
 */

/**
 * API와 버전을 받아 Artifact 객체 구성
 * @param {API} api 분석기 패키지 이름
 * @param {!string} version 버전 또는 LATEST
 * @return {{groupId: string, artifactId: string, version: string}} Artifact 객체
 * @private
 */
function makeDependencyItem(api, version) {
  let isAssembly = API.PACKAGE_REQUIRE_ASSEMBLY.includes(api);
  version = version ? version : "[2.0.0,)";
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
  url: 'http://jcenter.bintray.com/'
}, {
  id: 'maven-central-1',
  url: 'http://repo1.maven.org/maven2/'
}, {
  id: 'maven-central-2',
  url: 'http://central.maven.org/maven2/'
}];
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
  console.assert(options.packages, "packages는 설정되어야 하는 값입니다.");
  let packages = options.packages;
  let verbose = options.verbose || true;
  let javaOptions = options.javaOptions || ["-Xmx4g", "-Dfile.encoding=utf-8"];
  let tempJsonName = options.tempJsonName || 'koalanlp.json';
  /***** 자바 초기화 ******/

  let java = require('java');

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


  let dependencies = [];

  for (let pack of Object.keys(packages)) {
    dependencies.push(makeDependencyItem(API.getPackage(pack), packages[pack]));
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
  let promise = new Promise((resolve, reject) => {
    mvn({
      packageJsonPath: packPath,
      debug: verbose,
      repositories: remoteRepos
    }, function (err, mvnResults) {
      if (err) {
        console.error('필요한 의존패키지를 전부 다 가져오지는 못했습니다.');
        reject(err);
      } else {
        mvnResults.classpath.forEach(function (c) {
          if (verbose) console.debug('Classpath에 ' + c + ' 추가');
          java.classpath.push(path.resolve(c));
        });
        resolve(_jvm.JVM.init(java));
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
  if (tag instanceof POS || tag instanceof _types.PhraseTag || tag instanceof _types.DependencyTag || tag instanceof _types.RoleType || tag instanceof _types.CoarseEntityType) {
    return _jvm.JVM.koalaClassOf('Util').contains(_jvm.JVM.listOf(stringList), tag.reference);
  } else {
    return false;
  }
}