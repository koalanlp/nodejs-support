"use strict";

var koalanlp = require('./api'); // Import
var API = koalanlp.API; // Tagger/Parser Package 지정을 위한 목록
var POS = koalanlp.POS;

koalanlp.initialize({
    packages: [API.EUNJEON, // 품사분석(POS Tagging)을 위해서, 은전한닢 사용
    API.KKMA], // 의존구문분석(Dependency Parsing)을 위해서, 꼬꼬마 사용
    version: "1.9.1", // 사용하는 KoalaNLP 버전 (1.9.0 사용)
    useIvy2: true,
    debug: true // Debug output 출력여부
}, function () {
    // 품사분석기 이용법
    var tagger = new koalanlp.Tagger(API.EUNJEON);

    // Synchronous POS Tagging
    var tagged = tagger.tag("안녕하세요. 눈이 오는 설날 아침입니다.");
    console.log(JSON.stringify(tagged));

    // Asynchronous POS Tagging
    tagger.tag("안녕하세요. 눈이 오는 설날 아침입니다.", function (taggedAsync) {
        if (taggedAsync.error) console.error(taggedAsync.error);else console.log("Async", taggedAsync.result.map(function (s) {
            return s.toString();
        }).join("\n"));
    });

    // 의존구문분석기 이용법
    var parser = new koalanlp.Parser(API.KKMA, API.EUNJEON);

    // Synchronous Dependency Parsing
    var parsed = parser.parse("안녕하세요. 눈이 오는 설날 아침입니다.");
    console.log(JSON.stringify(parsed));

    // Asynchronous Dependency Parsing
    parser.parse("안녕하세요. 눈이 오는 설날 아침입니다.", function (parsedAsync) {
        console.log("Async", JSON.stringify(parsedAsync));
    });

    // Data classes
    var sentence = parsed[1];

    var wordAt0 = sentence.get(0);
    console.log(wordAt0.exists(function (m) {
        return POS.isPredicate(m.tag);
    }));

    console.log(sentence.exists(function (w) {
        return w.exists(function (m) {
            return POS.isNoun(m.tag);
        });
    }));

    console.log(sentence.nouns());

    console.log(sentence.verbs());
});