let TYPES = require('./const').TYPES;

let makeDependencyItem = function(type, version){
    let artifactName = "";
    let isAssembly = false;
    switch (type){
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

    let obj = {
        "groupId": "kr.bydelta",
        "artifactId": `koalanlp-${artifactName}_2.12`,
        "version": version
    };
    if(isAssembly){
        obj.classifier = "assembly"
    }

    return obj;
};

/**
 * @private
 * 자바 및 의존패키지 초기화
 * @param conf 초기화에 사용할 조건
 * @param callback 콜백함수
 */
export function initializer(conf, callback) {
    if(!callback)
        throw new Error("Callback은 반드시 필요합니다!");

    let java = require('java');
    let mvn = require('node-java-maven');

    if(!Array.isArray(conf.javaOptions))
        conf.javaOptions = [conf.javaOptions];
    for(let i = 0; i < conf.javaOptions.length; i ++){
        java.options.push(conf.javaOptions[i]);
    }

    let fs = require('fs');
    let path = require('path');
    let os = require('os');

    // Write dependencies as new package.json
    let dependencies = [];
    if(!Array.isArray(conf.packages))
        conf.packages = [conf.packages];
    for(let i = 0; i < conf.packages.length; i ++){
        dependencies.push(makeDependencyItem(conf.packages[i], conf.version))
    }

    let packPath = path.join(os.tmpdir(), conf.tempJsonName);
    console.info(`Writing java dependency informations into ${packPath}`);

    fs.writeFile(packPath, JSON.stringify({
        java: {
            dependencies: dependencies,
            exclusions: [
                {
                    groupId: "com.jsuereth",
                    artifactId: "sbt-pgp"
                }
            ]
        }
    }), function(){
        console.info("Start to fetch dependencies of koalaNLP using Maven.");

        mvn({
            packageJsonPath: packPath,
            debug: conf.debug,
            repositories: [
                {
                    id: 'maven-central',
                    url: 'http://central.maven.org/maven2/'
                },
                {
                    id: "jitpack.io",
                    url: "https://jitpack.io/"
                }
            ]
        }, function(err, mvnResults) {
            if (err) {
                return console.error('could not resolve maven dependencies', err);
            }
            mvnResults.classpath.forEach(function(c) {
                console.info('adding ' + c + ' to classpath');
                java.classpath.push(path.resolve(c));
            });

            callback(java);
        });
    });
}