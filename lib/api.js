"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by bydelta on 17. 12. 30.
 */
var java = {};
var conf = {};

/**
 * 분석기 종류
 */
var TYPES = exports.TYPES = require('./koalanlp/const').TYPES;

/**
 * 품사분석기 Wrapper 클래스
 */

var Tagger = exports.Tagger = function () {
    function Tagger() {
        _classCallCheck(this, Tagger);

        var Base = java.import("kr.bydelta.koala." + conf.tagger + ".Tagger");
        this.tagger = new Base();
    }

    /**
     * 문단단위 품사표기
     * @param paragraph 품사표기할 문단.
     * @param callback (optional) 콜백함수 (Object[] => void). 지정된 경우, 결과를 전달받음.
     * @return callback이 없는 경우, 품사표기 결과가 반환됨.
     */


    _createClass(Tagger, [{
        key: "tag",
        value: function tag(paragraph, callback) {
            if (callback) {
                this.tagger.tag(paragraph, function (err, result) {
                    if (err) callback({ error: err });else callback({ error: false, result: converter(result) });
                });
            } else {
                return converter(this.tagger.tagSync(paragraph));
            }
        }

        /**
         * 문장단위 품사표기
         * @param sentence 품사표기할 문장.
         * @param callback (optional) 콜백함수 (Object => void). 지정된 경우, 결과를 전달받음.
         * @return callback이 없는 경우, 품사표기 결과가 반환됨.
         */

    }, {
        key: "tagSentence",
        value: function tagSentence(sentence, callback) {
            if (callback) {
                this.tagger.tagSentence(sentence, function (err, result) {
                    if (err) callback({ error: err });else callback({ error: false, result: [convertSentence(result)] });
                });
            } else {
                return convertSentence(this.tagger.tagSentenceSync(sentence));
            }
        }
    }]);

    return Tagger;
}();

/**
 * 의존구문분석기 Wrapper 클래스
 */


var Parser = exports.Parser = function () {
    function Parser() {
        _classCallCheck(this, Parser);

        var TagBase = java.import("kr.bydelta.koala." + conf.tagger + ".Tagger");
        var ParseBase = java.import("kr.bydelta.koala." + conf.parser + ".Parser");
        this.tagger = new TagBase();
        this.parser = new ParseBase();
    }

    /**
     * 문단단위 분석
     * @param paragraph 분석할 문단.
     * @param callback (optional) 콜백함수 (Object[] => void). 지정된 경우, 결과를 전달받음.
     * @return callback이 없는 경우, 분석 결과가 반환됨.
     */


    _createClass(Parser, [{
        key: "parse",
        value: function parse(paragraph, callback) {
            if (callback) {
                var parser = this.parser;
                this.tagger.tag(paragraph, function (err, result) {
                    if (err) callback({ error: err });else parser.parse(result, function (err2, parsed) {
                        if (err2) callback({ error: err2 });else callback({ error: false, result: converter(parsed) });
                    });
                });
            } else {
                var tagged = this.tagger.tagSync(paragraph);
                var parsed = this.parser.parseSync(tagged);
                return converter(parsed);
            }
        }

        /**
         * 문장단위 분석
         * @param sentence 분석할 문장.
         * @param callback (optional) 콜백함수 (Object => void). 지정된 경우, 결과를 전달받음.
         * @return callback이 없는 경우, 분석 결과가 반환됨.
         */

    }, {
        key: "parseSentence",
        value: function parseSentence(sentence, callback) {
            if (callback) {
                var parser = this.parser;
                this.tagger.tagSentence(sentence, function (err, result) {
                    if (err) callback({ error: err });else parser.parseSentence(result, function (err2, parsed) {
                        if (err2) callback({ error: err2 });else callback({ error: false, result: [convertSentence(parsed)] });
                    });
                });
            } else {
                var tagged = this.tagger.tagSentenceSync(sentence);
                var parsed = this.parser.parseSentenceSync(tagged);
                return convertSentence(parsed);
            }
        }
    }]);

    return Parser;
}();

/**
 * 의존패키지 초기화 및 사전적재 함수
 * @param obj 설정 Object
 * @param callback 콜백 함수 (void => void)
 */


var initialize = exports.initialize = function initialize(obj, callback) {
    conf.version = obj.version || "1.8.4";
    conf.tagger = obj.tagger || TYPES.EUNJEON;
    conf.parser = obj.parser || TYPES.KKMA;
    conf.tempJsonName = obj.tempJsonName || "koalanlp.json";
    conf.debug = obj.debug === true;

    require('./koalanlp/javainit').initializer(conf, function (jvm) {
        java = jvm;
        callback();
    });
};

var convertWord = function convertWord(result) {
    var len = result.lengthSync();
    var buffer = [];
    var surface = result.surfaceSync();

    for (var i = 0; i < len; i++) {
        var morphs = result.applySync(i);
        var morpheme = {
            'id': i,
            'surface': morphs.surfaceSync(),
            'tag': morphs.tagSync().toStringSync()
        };
        morpheme[conf.tagger + "Tag"] = morphs.rawTagSync();
        buffer.push(morpheme);
    }

    var dependents = result.depsSync().toSeqSync();
    var depBuffer = [];
    len = dependents.sizeSync();

    for (var _i = 0; _i < len; _i++) {
        var rel = dependents.applySync(_i);
        var relationship = {
            'headId': rel.headSync(),
            'targetId': rel.targetSync(),
            'relation': rel.relationSync().toStringSync()
        };
        relationship[conf.parser + "Rel"] = rel.rawRelSync();
        depBuffer.push(relationship);
    }

    return {
        'surface': surface,
        'morphemes': buffer,
        'dependents': depBuffer
    };
};

var convertSentence = function convertSentence(result) {
    var len = result.lengthSync();
    var words = [];

    for (var i = 0; i < len; i++) {
        var word = result.applySync(i);
        words.push(convertWord(word));
    }

    var root = convertWord(result.rootSync());

    return {
        'words': words,
        'root': root.dependents
    };
};

var converter = function converter(result) {
    var len = result.sizeSync();
    var buffer = [];

    for (var i = 0; i < len; i++) {
        var sentence = result.applySync(i);
        buffer.push(convertSentence(sentence));
    }
    return buffer;
};