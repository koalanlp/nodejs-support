/**
 * Created by bydelta on 17. 12. 30.
 */
import {Sentence, Word, Morpheme, Relationship, POS} from './koalanlp/data';

let java = {};
let conf = {};

export let util = {
    POS: POS,
    TYPES: require('./koalanlp/const').TYPES
};

/**
 * 품사분석기 Wrapper 클래스
 */
export class Tagger{
    constructor(){
        let Base = java.import(`kr.bydelta.koala.${conf.tagger}.Tagger`);
        this.tagger = new Base();
    }

    /**
     * 문단단위 품사표기
     * @param paragraph 품사표기할 문단.
     * @param callback (optional) 콜백함수 (Object[] => void). 지정된 경우, 결과를 전달받음.
     * @return callback이 없는 경우, 품사표기 결과가 반환됨.
     */
    tag(paragraph, callback){
        if(callback){
            this.tagger.tag(paragraph, function(err, result){
                if(err) callback({error: err});
                else callback({error: false, result: converter(result)});
            });
        }else{
            return converter(this.tagger.tagSync(paragraph))
        }
    }

    /**
     * 문장단위 품사표기
     * @param sentence 품사표기할 문장.
     * @param callback (optional) 콜백함수 (Object => void). 지정된 경우, 결과를 전달받음.
     * @return callback이 없는 경우, 품사표기 결과가 반환됨.
     */
    tagSentence(sentence, callback){
        if(callback){
            this.tagger.tagSentence(sentence, function(err, result){
                if(err) callback({error: err});
                else callback({error: false, result: [convertSentence(result)]});
            });
        }else{
            return convertSentence(this.tagger.tagSentenceSync(sentence))
        }
    }
}

/**
 * 의존구문분석기 Wrapper 클래스
 */
export class Parser{
    constructor(){
        let TagBase = java.import(`kr.bydelta.koala.${conf.tagger}.Tagger`);
        let ParseBase = java.import(`kr.bydelta.koala.${conf.parser}.Parser`);
        this.tagger = new TagBase();
        this.parser = new ParseBase();
    }

    /**
     * 문단단위 분석
     * @param paragraph 분석할 문단.
     * @param callback (optional) 콜백함수 (Object[] => void). 지정된 경우, 결과를 전달받음.
     * @return callback이 없는 경우, 분석 결과가 반환됨.
     */
    parse(paragraph, callback){
        if(callback){
            let parser = this.parser;
            this.tagger.tag(paragraph, function(err, result){
                if(err) callback({error: err});
                else parser.parse(result, function(err2, parsed){
                    if(err2) callback({error: err2});
                    else callback({error: false, result: converter(parsed)});
                });
            });
        }else{
            let tagged = this.tagger.tagSync(paragraph);
            let parsed = this.parser.parseSync(tagged);
            return converter(parsed);
        }
    }

    /**
     * 문장단위 분석
     * @param sentence 분석할 문장.
     * @param callback (optional) 콜백함수 (Object => void). 지정된 경우, 결과를 전달받음.
     * @return callback이 없는 경우, 분석 결과가 반환됨.
     */
    parseSentence(sentence, callback){
        if(callback){
            let parser = this.parser;
            this.tagger.tagSentence(sentence, function(err, result){
                if(err) callback({error: err});
                else parser.parseSentence(result, function(err2, parsed){
                    if(err2) callback({error: err2});
                    else callback({error: false, result: [convertSentence(parsed)]});
                });
            });
        }else{
            let tagged = this.tagger.tagSentenceSync(sentence);
            let parsed = this.parser.parseSentenceSync(tagged);
            return convertSentence(parsed);
        }
    }
}

/**
 * 의존패키지 초기화 및 사전적재 함수
 * @param obj 설정 Object
 * @param callback 콜백 함수 (void => void)
 */
export let initialize = function(obj, callback){
    conf.version = obj.version || "1.9.0";
    conf.tagger = obj.tagger || util.TYPES.EUNJEON;
    conf.parser = obj.parser || util.TYPES.KKMA;
    conf.tempJsonName = obj.tempJsonName || "koalanlp.json";
    conf.debug = obj.debug === true;

    require('./koalanlp/javainit').initializer(conf, function(jvm){
        java = jvm;
        callback();
    });
};

let convertWord = function(result, widx){
    let len = result.lengthSync();
    let buffer = [];
    let surface = result.surfaceSync();

    for(let i = 0; i < len; i ++){
        let morphs = result.applySync(i);
        let morpheme =
            new Morpheme(
                morphs.surfaceSync(),
                morphs.tagSync().toStringSync(),
                morphs.rawTagSync(),
                i
            );
        buffer.push(morpheme);
    }

    let word = new Word(surface, buffer, widx);
    let dependents = result.depsSync().toSeqSync();
    len = dependents.sizeSync();

    for(let i = 0; i < len; i ++){
        let rel = dependents.applySync(i);
        let relationship =
            new Relationship(
                rel.headSync(),
                rel.relationSync().toStringSync(),
                rel.rawRelSync(),
                rel.targetSync()
            );
        word.dependents.push(relationship);
    }

    return word;
};

let convertSentence = function(result){
    let len = result.lengthSync();
    let words = [];

    for(let i = 0; i < len; i ++){
        let word = result.applySync(i);
        words.push(convertWord(word, i));
    }

    let sentence = new Sentence(words);
    let dependents = result.rootSync().depsSync().toSeqSync();
    len = dependents.sizeSync();

    for(let i = 0; i < len; i ++){
        let rel = dependents.applySync(i);
        let relationship =
            new Relationship(
                rel.headSync(),
                rel.relationSync().toStringSync(),
                rel.rawRelSync(),
                rel.targetSync()
            );
        sentence.root.dependents.push(relationship);
    }

    return sentence;
};

let converter = function(result){
    let len = result.sizeSync();
    let buffer = [];

    for(let i = 0; i < len; i ++){
        let sentence = result.applySync(i);
        buffer.push(convertSentence(sentence));
    }
    return buffer;
};