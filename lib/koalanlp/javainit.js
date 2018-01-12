"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initializer = initializer;
var TYPES = require('./const').TYPES;

var makeDependencyItem = function makeDependencyItem(type, version) {
    var artifactName = "";
    var isAssembly = false;
    switch (type) {
        case TYPES.HANNANUM:
            artifactName = "hannanum";
            isAssembly = true;
            break;
        case TYPES.KOMORAN:
            artifactName = "komoran";
            break;
        case TYPES.KKMA:
            artifactName = "kkma";
            isAssembly = true;
            break;
        case TYPES.EUNJEON:
            artifactName = "eunjeon";
            break;
        case TYPES.ARIRANG:
            artifactName = "arirang";
            isAssembly = true;
            break;
        case TYPES.RHINO:
            artifactName = "rhino";
            isAssembly = true;
            break;
        case TYPES.TWITTER:
            artifactName = "twitter";
            isAssembly = false;
            break;
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
 * @private
 * 자바 및 의존패키지 초기화
 * @param conf 초기화에 사용할 조건
 * @param callback 콜백함수
 */
function initializer(conf, callback) {
    if (!callback) throw new Error("Callback은 반드시 필요합니다!");

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
    console.info("Writing java dependency informations into " + packPath);

    fs.writeFile(packPath, JSON.stringify({
        java: {
            dependencies: dependencies,
            exclusions: [{
                groupId: "com.jsuereth",
                artifactId: "sbt-pgp"
            }]
        }
    }), function () {
        console.info("Start to fetch dependencies of koalaNLP using Maven.");

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
                return console.error('could not resolve maven dependencies', err);
            }
            mvnResults.classpath.forEach(function (c) {
                console.info('adding ' + c + ' to classpath');
                java.classpath.push(path.resolve(c));
            });

            callback(java);
        });
    });
}