"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initializer = initializer;
var API = require('./const').API;

var makeDependencyItem = function makeDependencyItem(type, version) {
    var artifactName = "";
    var isAssembly = false;
    switch (type) {
        case API.HANNANUM:
            artifactName = "hannanum";
            isAssembly = true;
            break;
        case API.KOMORAN:
            artifactName = "komoran";
            break;
        case API.KKMA:
            artifactName = "kkma";
            isAssembly = true;
            break;
        case API.EUNJEON:
            artifactName = "eunjeon";
            break;
        case API.ARIRANG:
            artifactName = "arirang";
            isAssembly = true;
            break;
        case API.RHINO:
            artifactName = "rhino";
            isAssembly = true;
            break;
        case API.TWITTER:
            artifactName = "twitter";
            isAssembly = false;
            break;
    }

    if (version >= "2.0.0") {
        throw new Error("Nodejs-Koalanlp 1.3.x\uB294 Java KoalaNLP 2.x\uC5D0\uC11C \uBCC0\uACBD\uB41C API\uB97C \uB530\uB974\uC9C0 \uC54A\uAE30 \uB54C\uBB38\uC5D0, " + version + "\uC740 \uC0AC\uC6A9\uD558\uC2E4 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. " + "상세한 사항은 https://github.com/koalanlp/nodejs-koalanlp 에서 확인해주세요.");
    }

    var obj = {
        "groupId": "kr.bydelta",
        "artifactId": "koalanlp-" + artifactName + "_2.12",
        "version": version
    };
    if (isAssembly) {
        obj.classifier = "assembly";
    }

    return obj;
};

/**
 * 자바 및 의존패키지 초기화
 *
 * @private
 * @param conf 초기화에 사용할 조건
 * @return {Promise} 초기화 종료 Promise
 */
function initializer(conf) {
    var java = require('java');
    var mvn = require('node-java-maven');

    if (!Array.isArray(conf.javaOptions)) conf.javaOptions = [conf.javaOptions];
    for (var i = 0; i < conf.javaOptions.length; i++) {
        java.options.push(conf.javaOptions[i]);
    }

    var fs = require('fs');
    var path = require('path');
    var os = require('os');

    var getUserHome = function getUserHome() {
        return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    };

    // Write dependencies as new package.json
    var dependencies = [];
    if (!Array.isArray(conf.packages)) conf.packages = [conf.packages];
    for (var _i = 0; _i < conf.packages.length; _i++) {
        dependencies.push(makeDependencyItem(conf.packages[_i], conf.version));
    }

    var packPath = path.join(os.tmpdir(), conf.tempJsonName);

    return new Promise(function (resolve, reject) {
        fs.writeFileSync(packPath, JSON.stringify({
            java: {
                dependencies: dependencies,
                exclusions: [{
                    groupId: "com.jsuereth",
                    artifactId: "sbt-pgp"
                }]
            }
        }));

        if (conf.debug) console.info("Start to fetch dependencies of koalaNLP using Maven.");

        var localRepo = "";
        if (conf.useIvy2 && fs.existsSync(path.join(getUserHome(), '.ivy2'))) {
            localRepo = path.join(getUserHome(), '.ivy2', 'cache');
        }

        mvn({
            packageJsonPath: packPath,
            debug: conf.debug,
            repositories: [{
                id: 'sonatype',
                url: 'https://oss.sonatype.org/content/repositories/public/'
            }, {
                id: 'maven-central-1',
                url: 'http://repo1.maven.org/maven2/'
            }, {
                id: 'maven-central-2',
                url: 'http://central.maven.org/maven2/'
            }, {
                id: "jitpack.io",
                url: "https://jitpack.io/"
            }],
            localRepository: localRepo
        }, function (err, mvnResults) {
            if (err) {
                if (conf.debug) console.error('cannot resolve required dependencies');
                reject(err);
            } else {
                mvnResults.classpath.forEach(function (c) {
                    if (conf.debug) console.info('adding ' + c + ' to classpath');
                    java.classpath.push(path.resolve(c));
                });

                resolve(java);
            }
        });
    });
}