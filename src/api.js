/**
 * Created by bydelta on 17. 12. 30.
 */
let java = {};
let conf = {};

/**
 * 분석기 종류
 */
export let TYPES = require('./koalanlp/const').TYPES;

/**
 * 품사분석기 Wrapper 클래스
 */
export class Tagger{
    constructor(){
        this.tagger = java.newInstanceSync(`kr.bydelta.koala.${conf.tagger}.Tagger`);
    }

    /**
     * 문단단위 품사표기
     * @param paragraph 품사표기할 문단.
     * @param callback (optional) 콜백함수 (Object[] => void). 지정된 경우, 결과를 전달받음.
     * @return callback이 없는 경우, 품사표기 결과가 반환됨.
     */
    tag(paragraph, callback){
        if(callback){
            this.tagger.tagPromise(paragraph)
                .then(function(result){
                    callback({error: false, result: converter(result)});
                }, function(e){
                    callback({error: e});
                })
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
            this.tagger.tagSentencePromise(sentence)
                .then(function(result){
                    callback({error: false, result: [convertSentence(result)]});
                }, function(e){
                    callback({error: e});
                })
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
        this.tagger = java.newInstanceSync(`kr.bydelta.koala.${conf.tagger}.Tagger`);
        this.parser = java.newInstanceSync(`kr.bydelta.koala.${conf.parser}.Parser`);
    }


    /**
     * 문단단위 분석
     * @param paragraph 분석할 문단.
     * @param callback (optional) 콜백함수 (Object[] => void). 지정된 경우, 결과를 전달받음.
     * @return callback이 없는 경우, 분석 결과가 반환됨.
     */
    parse(paragraph, callback){
        if(callback){
            this.tagger.tagPromise(paragraph)
                .then(function(result){
                    this.parser.parsePromise(result)
                }).then(function(result) {
                    callback({error: false, result: converter(result)});
                }, function(e){
                    callback({error: e});
                })
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
            this.tagger.tagSentencePromise(sentence)
                .then(function(result){
                    this.parser.parsePromise(result)
                }).then(function(result) {
                callback({error: false, result: [convertSentence(result)]});
            }, function(e){
                callback({error: e});
            })
        }else{
            let tagged = this.tagger.tagSentenceSync(sentence);
            let parsed = this.parser.parseSync(tagged);
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
    conf.version = obj.version || "1.8.4";
    conf.tagger = obj.tagger || TYPES.EUNJEON;
    conf.parser = obj.parser || TYPES.KKMA;
    conf.tempJsonName = obj.tempJsonName || "koalanlp.json";
    conf.debug = obj.debug === true;

    require('./koalanlp/javainit').initializer(conf, function(jvm){
        java = jvm;
        callback();
    });
};

let convertWord = function(result){
    let len = result.lengthSync();
    let buffer = [];
    let surface = result.surfaceSync();

    for(let i = 0; i < len; i ++){
        let morphs = result.applySync(i);
        let morpheme = {
            'id': i,
            'surface': morphs.surfaceSync(),
            'tag': morphs.tagSync().toStringSync()
        };
        morpheme[`${conf.tagger}Tag`] = morphs.rawTagSync();
        buffer.push(morpheme);
    }

    let dependents = result.depsSync().toSeqSync();
    let depBuffer = [];
    len = dependents.sizeSync();

    for(let i = 0; i < len; i ++){
        let rel = dependents.applySync(i);
        let relationship = {
            'headId': rel.headSync(),
            'targetId': rel.targetSync(),
            'relation': rel.relationSync().toStringSync()
        };
        relationship[`${conf.parser}Rel`] = rel.rawRelSync();
        depBuffer.push(relationship);
    }

    return {
        'surface': surface,
        'morphemes': buffer,
        'dependents': depBuffer
    };
};

let convertSentence = function(result){
    let len = result.lengthSync();
    let words = [];

    for(let i = 0; i < len; i ++){
        let word = result.applySync(i);
        words.push(convertWord(word));
    }

    let root = convertWord(result.rootSync());

    return {
        'words': words,
        'root': root.dependents
    };
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