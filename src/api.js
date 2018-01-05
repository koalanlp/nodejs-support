/**
 * Created by bydelta on 17. 12. 30.
 */
import {Sentence, Word, Morpheme, Relationship, POS} from './koalanlp/data';

let java = {};
let conf = {};

/**
 * Utility methods
 * @type {{POS: POS, TYPES}}
 */
export let util = {
    POS: POS,
    TYPES: require('./koalanlp/const').TYPES
};

/**
 * 분석결과 Callback
 * @callback parseCallback
 * @param {{error: *, result: Sentence[]}} result
 * @return *
 */

/**
 * 품사분석기 Wrapper 클래스
 */
export class Tagger{
    /**
     * 품사분석기를 생성합니다.
     * @param {string} taggerType API 유형
     */
    constructor(taggerType){
        let Base = java.import(`kr.bydelta.koala.${taggerType}.Tagger`);
        this.tagger = new Base();
    }

    /**
     * 문단단위 품사표기
     * @param {string} paragraph 품사표기할 문단.
     * @param {parseCallback=} callback 콜백함수 (Object[] => void). 지정된 경우, 결과를 전달받음.
     * @return {Sentence[]|undefined} callback이 없는 경우, 품사표기 결과가 반환됨.
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
     * @param {string} sentence 품사표기할 문장.
     * @param {parseCallback=} callback 콜백함수 (Object => void). 지정된 경우, 결과를 전달받음.
     * @return {Sentence[]|undefined} callback이 없는 경우, 품사표기 결과가 반환됨.
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
    /**
     * 의존구문분석기를 생성합니다.
     * @param {string} parserType 의존구문분석기 API 패키지.
     * @param {string|undefined} [taggerType=undefined] 품사분석기 API 패키지. 미지정시, 의존구문분석기 패키지 이용.
     */
    constructor(parserType, taggerType){
        if(taggerType) {
            let TagBase = java.import(`kr.bydelta.koala.${taggerType}.Tagger`);
            this.tagger = new TagBase();
        }

        let ParseBase = java.import(`kr.bydelta.koala.${parserType}.Parser`);
        this.parser = new ParseBase();
    }

    /**
     * 문단단위 분석
     * @param {string} paragraph 분석할 문단.
     * @param {parseCallback=} callback 콜백함수 (Object[] => void). 지정된 경우, 결과를 전달받음.
     * @return {Sentence[]|undefined} callback이 없는 경우, 분석 결과가 반환됨.
     */
    parse(paragraph, callback){
        if(this.tagger) {
            if (callback) {
                let parser = this.parser;
                this.tagger.tag(paragraph, function (err, result) {
                    if (err) callback({error: err});
                    else parser.parse(result, function (err2, parsed) {
                        if (err2) callback({error: err2});
                        else callback({error: false, result: converter(parsed)});
                    });
                });
            } else {
                let tagged = this.tagger.tagSync(paragraph);
                let parsed = this.parser.parseSync(tagged);
                return converter(parsed);
            }
        }else{
            if (callback) {
                this.parser.parse(paragraph, function (err, parsed) {
                    if (err) callback({error: err});
                    else callback({error: false, result: converter(parsed)});
                });
            } else {
                let parsed = this.parser.parseSync(paragraph);
                return converter(parsed);
            }
        }
    }

    /**
     * 문장단위 분석
     * @param {string} sentence 분석할 문장.
     * @param {parseCallback=} callback 콜백함수 (Object => void). 지정된 경우, 결과를 전달받음.
     * @return {Sentence[]|undefined} callback이 없는 경우, 분석 결과가 반환됨.
     */
    parseSentence(sentence, callback){
        if(this.tagger) {
            if (callback) {
                let parser = this.parser;
                this.tagger.tagSentence(sentence, function (err, result) {
                    if (err) callback({error: err});
                    else parser.parseSentence(result, function (err2, parsed) {
                        if (err2) callback({error: err2});
                        else callback({error: false, result: [convertSentence(parsed)]});
                    });
                });
            } else {
                let tagged = this.tagger.tagSentenceSync(sentence);
                let parsed = this.parser.parseSentenceSync(tagged);
                return convertSentence(parsed);
            }
        }else{
            if (callback) {
                this.parser.parseSentence(sentence, function (err, parsed) {
                    if (err) callback({error: err});
                    else callback({error: false, result: [convertSentence(parsed)]});
                });
            } else {
                let parsed = this.parser.parseSentenceSync(sentence);
                return convertSentence(parsed);
            }
        }
    }
}

/**
 * 초기화 Callback
 * @callback initCallback
 * @return *
 */

/**
 * 의존패키지 초기화 및 사전적재 함수
 * @param {{version: string|undefined, packages: string[]|undefined,
 * tempJsonName: string|undefined, debug: boolean|undefined, javaOptions: string[]|undefined}} obj 설정 Object
 * @param {initCallback} callback 콜백 함수 (void => void)
 */
export let initialize = function(obj, callback){
    conf.version = obj.version || "1.9.0";
    conf.packages = obj.packages || [util.TYPES.EUNJEON, util.TYPES.KKMA];
    conf.tempJsonName = obj.tempJsonName || "koalanlp.json";
    conf.debug = obj.debug === true;
    conf.javaOptions = obj.javaOptions || ["-Xmx4g"];

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