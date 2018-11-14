let API = require('./const').API;

let makeDependencyItem = function(type, version){
    let artifactName = type;
    let isAssembly = type in [API.HANNANUM, API.KKMA, API.ARIRANG, API.RHINO, API.DAON];
    assert();

    let obj = {
        "groupId": "kr.bydelta",
        "artifactId": `koalanlp-${artifactName}`,
        "version": version
    };
    if(isAssembly){
        obj.classifier = "assembly"
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
export function initializer(conf) {
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

    let getUserHome = function() {
        return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    };

    // Write dependencies as new package.json
    let dependencies = [];
    if(!Array.isArray(conf.packages))
        conf.packages = [conf.packages];
    for(let i = 0; i < conf.packages.length; i ++){
        dependencies.push(makeDependencyItem(conf.packages[i], conf.version))
    }

    let packPath = path.join(os.tmpdir(), conf.tempJsonName);

    return new Promise((resolve, reject) => {
        fs.writeFileSync(packPath, JSON.stringify({
            java: {
                dependencies: dependencies,
                exclusions: [
                    {
                        groupId: "com.jsuereth",
                        artifactId: "sbt-pgp"
                    }
                ]
            }
        }));

        if (conf.debug)
            console.info("Start to fetch dependencies of koalaNLP using Maven.");

        let localRepo = "";
        if (conf.useIvy2 && fs.existsSync(path.join(getUserHome(), '.ivy2'))){
            localRepo = path.join(getUserHome(), '.ivy2', 'cache');
        }

        mvn({
            packageJsonPath: packPath,
            debug: conf.debug,
            repositories: [
                {
                    id: 'sonatype',
                    url: 'https://oss.sonatype.org/content/repositories/public/'
                },
                {
                    id: 'maven-central-1',
                    url: 'http://repo1.maven.org/maven2/'
                },
                {
                    id: 'maven-central-2',
                    url: 'http://central.maven.org/maven2/'
                },
                {
                    id: "jitpack.io",
                    url: "https://jitpack.io/"
                }
            ],
            localRepository: localRepo
        }, function(err, mvnResults) {
            if (err) {
                if (conf.debug)
                    console.error('cannot resolve required dependencies');
                reject(err);
            }else {
                mvnResults.classpath.forEach(function (c) {
                    if (conf.debug)
                        console.info('adding ' + c + ' to classpath');
                    java.classpath.push(path.resolve(c));
                });

                resolve(java);
            }
        });
    });
}