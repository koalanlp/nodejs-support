/**
 * Created by bydelta on 17. 12. 30.
 */
let koalanlp = require('./api'); // Import
let TYPES = koalanlp.util.TYPES; // Tagger/Parser Package 지정을 위한 목록
let POS = koalanlp.util.POS;

koalanlp.initialize({
    tagger: TYPES.EUNJEON, // 품사분석(POS Tagging)을 위해서, 은전한닢 사용
    parser: TYPES.KKMA, // 의존구문분석(Dependency Parsing)을 위해서, 꼬꼬마 사용
    version: "1.9.0", // 사용하는 KoalaNLP 버전 (1.9.0 사용)
    debug: true // Debug output 출력여부
}, function(){
    // 품사분석기 이용법
    let tagger = new koalanlp.Tagger();

    // Synchronous POS Tagging
    let tagged = tagger.tag("안녕하세요. 눈이 오는 설날 아침입니다.");
    console.log(JSON.stringify(tagged));

    // Asynchronous POS Tagging
    tagger.tag("안녕하세요. 눈이 오는 설날 아침입니다.", function(taggedAsync){
        if(taggedAsync.error)
            console.error(taggedAsync.error);
        else
            console.log("Async", taggedAsync.result.map(s => s.toString()).join("\n"));
    });

    // 의존구문분석기 이용법
    let parser = new koalanlp.Parser();

    // Synchronous Dependency Parsing
    let parsed = parser.parse("안녕하세요. 눈이 오는 설날 아침입니다.");
    console.log(JSON.stringify(parsed));

    // Asynchronous Dependency Parsing
    parser.parse("안녕하세요. 눈이 오는 설날 아침입니다.", function(parsedAsync){
        console.log("Async", JSON.stringify(parsedAsync));
    });

    // Data classes
    let sentence = parsed[1];

    let wordAt0 = sentence.get(0);
    console.log(wordAt0.exists(m => POS.isPredicate(m.tag)));

    console.log(sentence.exists(w => w.exists(m => POS.isNoun(m.tag))));

    console.log(sentence.nouns());

    console.log(sentence.verbs());
});