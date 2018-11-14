/** @module koalanlp **/

import "babel-polyfill";
import {Sentence, Word, Morpheme, Relationship} from './data';

/**
 * @private
 * @type {{import:*, newInstanceSync:*, callStaticMethodSync:*}}
 */
let java = {};


/**
 * 품사분석을 위한 도구. (Shortcut)
 * @example
 * let koalanlp = require('koalanlp');
 * let POS = koalanlp.POS;
 * POS.isNoun(someMorpheme);
 * @readonly
 * @see {@link module:koalanlp/POS}
 */
export const POS = require('./POS');

/**
 * 품사분석기 Wrapper 클래스
 * @example
 * let API = koalanlp.API;
 * let Tagger = koalanlp.Tagger;
 * let eunjeonTagger = new Tagger(API.EUNJEON);
 * let promise = eunjeonTagger.tag("이렇게 사용하면 문단을 분석합니다. 간단하지 않나요?");
 * // 분석 결과는 Promise 객체에 담겨있습니다.
 * promise.then(console.log);
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
     * @param {string|string[]} paragraph 품사표기할 문단(string) 또는 문장의 배열(string[])
     * @return {Promise<Sentence[]>} 품사표기 결과가 반환될, promise 객체
     */
    tag(paragraph){
        return new Promise((resolve, reject) => {
            if(Array.isArray(paragraph)) {
                try {
                    let result = paragraph.map(sent => this.tagger.tagSentenceSync(sent));
                    resolve(result);
                }catch(e){
                    reject(e);
                }
            }else {
                this.tagger.tag(paragraph, function (err, result) {
                    if (err) reject(err);
                    else resolve(converter(result));
                });
            }
        });
    }

    /**
     * (Synchronized) 문단단위 품사표기
     * @param {string|string[]} paragraph 품사표기할 문단(string) 또는 문장의 배열(string[])
     * @return {Sentence[]} 품사표기 결과
     */
    tagSync(paragraph){
        if(Array.isArray(paragraph)) {
            return paragraph.map(sent => this.tagger.tagSentenceSync(sent));
        }else {
            return converter(this.tagger.tagSync(paragraph));
        }
    }

    /**
     * 문장단위 품사표기
     * @param {string} sentence 품사표기할 문장.
     * @return {Promise<Sentence>} 품사표기 결과인 문장 1개를 담을 Promise가 반환됨.
     */
    tagSentence(sentence){
        return new Promise((resolve, reject) => {
            this.tagger.tagSentence(sentence, function(err, result){
                if(err) reject(err);
                else resolve(convertSentence(result));
            });
        });
    }

    /**
     * (Synchronized) 문장단위 품사표기
     * @param {string} sentence 품사표기할 문장.
     * @return {Sentence} 품사표기 결과인 문장 1개
     */
    tagSentenceSync(sentence){
        return convertSentence(this.tagger.tagSentenceSync(sentence));
    }
}

/**
 * 의존구문분석기 Wrapper 클래스
 * @example
 * let API = koalanlp.API;
 * let Parser = koalanlp.Parser;
 * let kkmaParser = new Parser(API.KKMA);
 * let promise = kkmaParser.parse("이렇게 사용하면 문단을 분석합니다. 간단하지 않나요?");
 * // 분석 결과는 Promise 객체에 담겨있습니다.
 * promise.then(console.log);
 */
export class Parser{
    /**
     * 의존구문분석기를 생성합니다.
     * @param {string} parserType 의존구문분석기 API 패키지.
     * @param {string|undefined} [taggerType=undefined] 품사분석기 API 패키지. 미지정시, 의존구문분석기 패키지 이용.
     */
    constructor(parserType, taggerType){
        assert(parserType == API.KKMA || parserType == API.HANNANUM,
            "꼬꼬마/한나눔을 제외한 분석기는 의존구문분석을 지원하지 않습니다.");

        if(taggerType) {
            let TagBase = java.import(`kr.bydelta.koala.${taggerType}.Tagger`);
            this.tagger = new TagBase();
        }

        let ParseBase = java.import(`kr.bydelta.koala.${parserType}.Parser`);
        this.parser = new ParseBase();
    }

    /**
     * 문단단위 분석
     * @param {string|string[]|Sentence|Sentence[]} paragraph 분석할 문단(string, string[], Sentence[]) 또는 문장(Sentence).
     * @return {Promise<Sentence>|Promise<Sentence[]>} 문장(Sentence)의 경우는 분석결과인 문장(Sentence)을, 문단인 경우는 분석 결과(문장 배열)를 담을 Promise가 반환됨.
     */
    parse(paragraph){
        return new Promise((resolve, reject) => {
            let isList = Array.isArray(paragraph);
            let isSentence = paragraph instanceof Sentence || paragraph[0] instanceof Sentence;

            let target = undefined;
            if(isSentence){
                if(isList){
                    target = paragraph.map(sent => sent.reference);
                    target = java.callStaticMethodSync("scala.Predef", "genericArrayOps", target).toSeqSync();
                }else{
                    target = paragraph.reference;
                }
                this.parser.parse(target, function (err, parsed) {
                    if (err) reject(err);
                    else resolve(converter(parsed));
                });
            }else{
                try {
                    if(isList){
                        target = [];
                        if (this.tagger) {
                            target = paragraph.map(sent => this.tagger.tagSync(sent));
                        } else {
                            target = paragraph;
                        }

                        resolve(target.map(sent => convertSentence(this.parser.parseSync(sent))));
                    }else{
                        if(this.tagger){
                            target = this.tagger.tagSync(paragraph);
                        }else{
                            target = paragraph;
                        }

                        this.parser.parse(target, function (err, parsed) {
                            if (err) reject(err);
                            else resolve(converter(parsed));
                        });
                    }
                }catch(e){
                    reject(e)
                }
            }
        });
    }

    /**
     * 문장단위 분석
     * @param {string|Sentence} sentence 분석할 문장.
     * @return {Promise<Sentence>} 분석 결과(문장 1개)를 담은 Promise가 반환됨.
     */
    parseSentence(sentence){
        return new Promise((resolve, reject) => {
            let isSentence = sentence instanceof Sentence;

            if(this.tagger && !isSentence) {
                this.tagger.tagSentence(sentence, (taggerErr, result) => {
                    if (taggerErr) reject(taggerErr);
                    else this.parser.parse(result, function (err, parsed) {
                        if (err) reject(err);
                        else resolve(convertSentence(parsed));
                    });
                });
            }else if(isSentence){
                let target = sentence.reference;
                this.parser.parse(target, function (err, parsed) {
                    if (err) reject(err);
                    else resolve(convertSentence(parsed));
                });
            }else
                reject(new Error("A raw string cannot be parsed as a single sentence without a tagger!"))
        });
    }

    /**
     * (Synchronized) 문단단위 분석
     * @param {string|string[]|Sentence|Sentence[]} paragraph 분석할 문단(string, string[], Sentence[]) 또는 문장(Sentence).
     * @return {Sentence|Sentence[]} 문장(Sentence)의 경우는 분석결과인 문장(Sentence), 문단인 경우는 분석 결과(문장 배열)
     */
    parseSync(paragraph){
        let isList = Array.isArray(paragraph);
        let isSentence = paragraph instanceof Sentence || paragraph[0] instanceof Sentence;

        let target = undefined;
        if(isSentence){
            if(isList){
                target = paragraph.map(sent => sent.reference);
                target = java.callStaticMethodSync("scala.Predef", "genericArrayOps", target).toSeqSync();
            }else{
                target = paragraph.reference;
            }

            return converter(this.parser.parseSync(target));
        }else{
            if(isList){
                target = [];
                if (this.tagger) {
                    target = paragraph.map(sent => this.tagger.tagSync(sent));
                } else {
                    target = paragraph;
                }

                return target.map(sent => convertSentence(this.parser.parseSync(sent)));
            }else{
                if(this.tagger){
                    target = this.tagger.tagSync(paragraph);
                }else{
                    target = paragraph;
                }

                return converter(this.parser.parseSync(target));
            }
        }
    }

    /**
     * (Synchronized) 문장단위 분석
     * @param {string|Sentence} sentence 분석할 문장.
     * @return {Sentence} 분석 결과(문장 1개)
     */
    parseSentenceSync(sentence){
        let isSentence = sentence instanceof Sentence;

        if(this.tagger && !isSentence) {
            return convertSentence(this.parser.parseSync(this.tagger.tagSentenceSync(sentence)));
        }else if(isSentence){
            let target = sentence.reference;
            return convertSentence(this.parser.parseSync(target));
        }else
            throw new Error("A raw string cannot be parsed as a single sentence without a tagger!")
    }
}

/**
 * 문장분리기 클래스
 *
 * @example
 * let API = koalanlp.API;
 * let SentenceSplitter = koalanlp.SentenceSplitter;
 * let splitter = new SentenceSplitter(API.HANNANUM);
 * let promise = splitter.sentences("이렇게 사용하면 문단을 분리합니다. 간단하지 않나요?");
 * // 분석 결과는 Promise 객체에 담겨있습니다.
 * promise.then(console.log);
 */
export class SentenceSplitter{
    /**
     * 문장분리기를 생성합니다.
     * @param {string} splitterType 문장분리기 API 패키지.
     */
    constructor(splitterType){
        assert(splitterType === API.TWITTER || splitterType === API.HANNANUM,
            "오픈한글(트위터)/한나눔을 제외한 분석기는 문장분리를 지원하지 않습니다.");

        let SegBase = java.import(`kr.bydelta.koala.${splitterType}.SentenceSplitter`);
        this.splitter = new SegBase();
    }

    /**
     * 문단을 문장으로 분리합니다.
     * @param {string} paragraph 분석할 문단.
     * @return {Promise<string[]>} 분석 결과를 담은 Promise가 반환됨.
     */
    sentences(paragraph){
        return new Promise((resolve, reject) => {
            this.splitter.sentences(paragraph, function (err, parsed) {
                if (err) reject(err);
                else resolve(convertSentenceStr(parsed));
            });
        });
    }

    /**
     * (Synchronized) 문단을 문장으로 분리합니다.
     * @param {string} paragraph 분석할 문단.
     * @return {string[]} 분석 결과
     */
    sentencesSync(paragraph){
        return convertSentenceStr(this.splitter.sentencesSync(paragraph));
    }

    /**
     * KoalaNLP가 구현한 문장분리기를 사용하여, 문단을 문장으로 분리합니다.
     * @param {Sentence} paragraph 분석할 문단. (품사표기가 되어있어야 합니다)
     * @return {Promise<Sentence[]>} 분석 결과를 담은 Promise가 반환됨.
     */
    static sentences(paragraph){
        assert(paragraph instanceof Sentence);

        return new Promise((resolve, reject) => {
            java.callStaticMethod("kr.bydelta.koala.util.SentenceSplitter", "apply",
                paragraph.reference, function (err, parsed) {
                    if (err) reject(err);
                    else resolve(converter(parsed));
                });
        });
    }

    /**
     * (Synchronized) KoalaNLP가 구현한 문장분리기를 사용하여, 문단을 문장으로 분리합니다.
     * @param {Sentence} paragraph 분석할 문단. (품사표기가 되어있어야 합니다)
     * @return {Sentence[]} 분석 결과
     */
    static sentencesSync(paragraph){
        assert(paragraph instanceof Sentence);

        return converter(
            java.callStaticMethodSync("kr.bydelta.koala.util.SentenceSplitter", "apply",
                paragraph.reference)
        );
    }
}

/**
 * 품사 필터링 함수
 * @function POSFilter
 * @param {string} POS 품사
 * @return {boolean} 품사가 포함 되는지의 여부.
 */

/**
 * (형태소, 품사) 묶음.
 * @name MorphInterface
 * @property {string} morph 형태소 표면형
 * @property {string} tag 세종 품사 태그
 */

/**
 * (형태소, 품사) 순환 generator.
 *
 * @generator
 * @function MorphemeGenerator
 * @yields {MorphInterface} (형태소, 품사) 객체.
 */

/**
 * 사용자 정의 사전 클래스
 *
 * @example
 * let API = koalanlp.API;
 * let POS = koalanlp.POS;
 * let Dictionary = koalanlp.Dictionary;
 * let EDict = new Dicionary(API.EUNJEON);
 * let promise = EDict.addUserDictionary("설빙",POS.NNP);
 * // 삽입 결과는 Promise 객체에 담겨있습니다.
 * promise.then(console.log);
 */
export class Dictionary{
    /**
     * 사용자 정의 사전을 연결합니다.
     * @param {string} dicType 사용자 정의 사전을 연결할 API 패키지.
     */
    constructor(dicType){
        assert(dicType !== API.RHINO,
            "라이노 분석기는 사용자 정의 사전을 지원하지 않습니다.");
        this.dict = java.callStaticMethodSync(`kr.bydelta.koala.${dicType}.JavaDictionary`, 'get')
    }

    /**
     * 사용자 사전에, 표면형과 그 품사를 추가.
     *
     * @param {string|string[]} morph 표면형.
     * @param {string|string[]} tag   세종 품사.
     * @return {Promise<boolean>} 정상적으로 완료되었는지 여부를 담은 Promise.
     */
    addUserDictionary(morph, tag){
        let isMArray = Array.isArray(morph);
        let isTArray = Array.isArray(tag);

        assert(isMArray == isTArray,
            "형태소와 품사는 둘 다 같은 길이의 배열이거나 둘 다 string이어야 합니다.");

        return new Promise((resolve, reject) => {
            if(isMArray){
                assert(morph.length == tag.length,
                    "형태소와 품사는 둘 다 같은 길이의 배열이어야 합니다.", reject);
                let tuples = [];
                for(let i = 0; i < morph.length; i ++){
                    tuples.push(morphToTuple(morph[i], tag[i]));
                }
                tuples = java.callStaticMethodSync("scala.Predef", "genericArrayOps", tuples).toSeqSync();

                this.dict.addUserDictionary(tuples, function(err){
                    if(err) reject(err);
                    else resolve(true);
                });
            }else {
                let posTag = java.callStaticMethodSync("kr.bydelta.koala.POS", "withName", tag);
                this.dict.addUserDictionary(morph, posTag, function(err){
                    if(err) reject(err);
                    else resolve(true);
                });
            }
        });
    }

    /**
     * (Synchronized) 사용자 사전에, 표면형과 그 품사를 추가.
     *
     * @param {string|string[]} morph 표면형.
     * @param {string|string[]} tag   세종 품사.
     * @return {boolean} 정상적으로 완료되었는지 여부
     */
    addUserDictionarySync(morph, tag){
        let isMArray = Array.isArray(morph);
        let isTArray = Array.isArray(tag);

        assert(isMArray == isTArray,
            "형태소와 품사는 둘 다 같은 길이의 배열이거나 둘 다 string이어야 합니다.");

        if(isMArray){
            assert(morph.length == tag.length,
                "형태소와 품사는 둘 다 같은 길이의 배열이어야 합니다.");
            let tuples = [];
            for(let i = 0; i < morph.length; i ++){
                tuples.push(morphToTuple(morph[i], tag[i]));
            }
            tuples = java.callStaticMethodSync("scala.Predef", "genericArrayOps", tuples).toSeqSync();

            this.dict.addUserDictionarySync(tuples);
            return true;
        }else {
            let posTag = java.callStaticMethodSync("kr.bydelta.koala.POS", "withName", tag);
            this.dict.addUserDictionarySync(morph, posTag);
            return true;
        }
    }

    /**
     * 사전에 등재되어 있는지 확인합니다.
     *
     * @param {string} word   확인할 형태소
     * @param {...string} posTag 세종품사들(기본값: NNP 고유명사, NNG 일반명사)
     * @return {Promise<boolean>} 포함되는지 여부를 담은 Promise
     */
    contains(word, ...posTag){
        return new Promise((resolve, reject) => {
            let tags = posTag || ["NNP", "NNG"];
            let posTags = [];
            for(let i = 0; i < tags.length; i ++){
                posTags.push(java.callStaticMethodSync("kr.bydelta.koala.POS", "withName", tags[i]));
            }
            let posSet = java.callStaticMethodSync("scala.Predef", "genericArrayOps", posTags).toSetSync();

            this.dict.contains(word, posSet, function(err, result){
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    /**
     * 사전에 등재되어 있는지 확인하고, 사전에 없는단어만 반환합니다.
     *
     * @param {boolean} onlySystemDic 시스템 사전에서만 검색할지 결정합니다.
     * @param {...MorphInterface} word 확인할 (형태소, 품사)들.
     * @return {Promise<MorphInterface>} 사전에 없는 단어들을 담을 Promise.
     */
    getNotExists(onlySystemDic, ...word){
        return new Promise((resolve, reject) => {
            let wordEntries = [];
            for(let i = 0; i < word.length; i ++){
                wordEntries.push(morphToTuple(word[i]));
            }
            let wordSeq = java.callStaticMethodSync("scala.Predef", "genericArrayOps", wordEntries).toSeqSync();

            this.dict.getNotExists(onlySystemDic, wordSeq, function(err, notExists){
                if (err) reject(err);
                else {
                    let returnValue = [];
                    for (let i = 0; i < notExists.sizeSync(); i++) {
                        let entry = notExists.applySync(i);
                        returnValue.push({morph: entry._1, tag: entry._2.toStringSync()});
                    }
                    resolve(returnValue);
                }
            });
        });
    }

    /**
     * 다른 사전을 참조하여, 선택된 사전에 없는 단어를 사용자사전으로 추가합니다.
     *
     * @param {Dictionary} other 참조할 사전
     * @param {string|string[]|POSFilter} filterFn 가져올 품사나, 품사의 리스트, 또는 해당 품사인지 판단하는 함수.
     * @param {boolean} fastAppend 선택된 사전에 존재하는지를 검사하지 않고 빠르게 추가하고자 할 때. (기본값 false)
     * @return {Promise<boolean>} 사전 import가 완료되었는지 여부를 담을, Promise.
     */
    importFrom(other, filterFn, fastAppend){
        let tags = [];
        if (typeof filterFn === 'string'){
            tags = [filterFn];
        }else if(Array.isArray(filterFn) && typeof filterFn[0] === 'string'){
            tags = filterFn;
        }else{
            tags = POS.Tags.filter(filterFn);
        }

        return new Promise((resolve, reject) => {
            fastAppend = fastAppend || false;

            let tagSet = java.callStaticMethodSync("scala.Predef", "genericArrayOps", tags).toSetSync();

            this.dict.importFrom(other.dict, tagSet, fastAppend, function(err){
                if (err) reject(err);
                else resolve(true);
            });
        });
    }

    /**
     * 원본 사전에 등재된 항목 중에서, 지정된 형태소의 항목만을 가져옵니다. (복합 품사 결합 형태는 제외)
     *
     * @param {string|string[]|POSFilter} filterFn 가져올 품사나, 품사의 리스트, 또는 해당 품사인지 판단하는 함수.
     * @return {Promise<MorphemeGenerator>} (형태소, 품사) generator를 담을 Promise.
     */
    baseEntriesOf(filterFn){
        filterFn = filterFn || POS.isNoun;
        let tags = [];
        if (typeof filterFn === 'string'){
            tags = [filterFn];
        }else if(Array.isArray(filterFn) && typeof filterFn[0] === 'string'){
            tags = filterFn;
        }else{
            tags = POS.Tags.filter(filterFn);
        }

        return new Promise((resolve, reject) => {
            let tagSet = java.callStaticMethodSync("scala.Predef", "genericArrayOps", tags).toSetSync();

            this.dict.baseEntriesOf(tagSet, function(err, entries){
                if (err) reject(err);
                else{
                    let generator = function*(){
                        while (entries.hasNextSync()){
                            let entry = entries.nextSync();
                            yield {morph: entry._1, tag: entry._2.toStringSync()};
                        }
                    };

                    resolve(generator());
                }
            });
        });
    }
}

/**
 * 초기화 Option
 * @name InitOption
 * @property {string[]} [packages=[API.EUNJEON,API.KKMA]] 사용할 분석기의 목록
 * @property {string} [version="1.9.2"] 사용할 분석기의 KoalaNLP wrapper Version
 * @property {string} [tempJsonName="koalanlp.json"] 사용중인 분석기 파일을 불러오기 위한 Json을 저장할 임시 경로 (임시폴더 내).
 * @property {boolean} [debug=false] 분석기 적재 과정을 모두 출력할 것인지의 여부
 * @property {string[]} [javaOptions=["-Xmx4g","-Dfile.encoding=utf-8"]] JVM 실행시 필요한 옵션 지정
 * @property {boolean} [useIvy2=false] Maven local repository(.m2) 대신 Ivy local repository(.ivy2)를 사용할 지의 여부.
 */

/**
 * 의존패키지 초기화 및 사전적재 함수
 *
 * @function
 * @param {InitOption} obj 설정 Object
 * @return {Promise<boolean>} 설정 완료되면 종료될 Promise
 */
export let initialize = function(obj){
    obj.version = obj.version || "1.9.2";
    obj.packages = obj.packages || [API.EUNJEON, API.KKMA];
    obj.tempJsonName = obj.tempJsonName || "koalanlp.json";
    obj.debug = obj.debug === true;
    obj.javaOptions = obj.javaOptions || ["-Xmx4g", "-Dfile.encoding=utf-8"];
    obj.useIvy2 = obj.useIvy2 || false;

    return new Promise((resolve, reject) => {
        require('./javainit').initializer(obj)
            .catch(reject)
            .then(function(jvm){
                java = jvm;

                if (obj.debug)
                    console.log("[KoalaNLP] Jar file loading finished.");
                resolve(true);
            });
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

    let sentence = new Sentence(words, result);
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

let convertSentenceStr = function(result){
    let len = result.sizeSync();
    let buffer = [];

    for(let i = 0; i < len; i ++){
        let sentence = result.applySync(i);
        buffer.push(sentence);
    }
    return buffer;
};

let morphToTuple = function(obj, tag){
    let morph = (typeof tag !== "undefined")? obj : obj.morph;
    let pos = (typeof tag !== "undefined")? tag : obj.tag;

    let posEntry = java.callStaticMethodSync("kr.bydelta.koala.POS", "withName", pos);
    return java.newInstanceSync("scala.Tuple2", morph, posEntry);
};