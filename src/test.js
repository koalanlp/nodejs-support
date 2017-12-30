/**
 * Created by bydelta on 17. 12. 30.
 */
let koalanlp = require('./api');
let TYPES = koalanlp.TYPES;

koalanlp.initialize({
    tagger: TYPES.KOMORAN,
    parser: TYPES.HANNANUM,
    version: "1.8.4",
    debug: true
}, function(){
    let tagger = new koalanlp.Tagger();
    console.log(
        JSON.stringify(tagger.tag("안녕하세요. 눈이 오는 설날 아침입니다."))
    );

    let parser = new koalanlp.Parser();
    console.log(
        JSON.stringify(parser.parse("안녕하세요. 눈이 오는 설날 아침입니다."))
    );
});