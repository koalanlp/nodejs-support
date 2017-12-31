'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initialize = exports.Parser = exports.Tagger = exports.util = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by bydelta on 17. 12. 30.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _data = require('./koalanlp/data');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var java = {};
var conf = {};

var util = exports.util = {
    POS: _data.POS,
    TYPES: require('./koalanlp/const').TYPES
};

/**
 * 품사분석기 Wrapper 클래스
 */

var Tagger = exports.Tagger = function () {
    function Tagger() {
        _classCallCheck(this, Tagger);

        var Base = java.import('kr.bydelta.koala.' + conf.tagger + '.Tagger');
        this.tagger = new Base();
    }

    /**
     * 문단단위 품사표기
     * @param paragraph 품사표기할 문단.
     * @param callback (optional) 콜백함수 (Object[] => void). 지정된 경우, 결과를 전달받음.
     * @return callback이 없는 경우, 품사표기 결과가 반환됨.
     */


    _createClass(Tagger, [{
        key: 'tag',
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
        key: 'tagSentence',
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

        var TagBase = java.import('kr.bydelta.koala.' + conf.tagger + '.Tagger');
        var ParseBase = java.import('kr.bydelta.koala.' + conf.parser + '.Parser');
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
        key: 'parse',
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
        key: 'parseSentence',
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
    conf.version = obj.version || "1.9.0";
    conf.tagger = obj.tagger || util.TYPES.EUNJEON;
    conf.parser = obj.parser || util.TYPES.KKMA;
    conf.tempJsonName = obj.tempJsonName || "koalanlp.json";
    conf.debug = obj.debug === true;

    require('./koalanlp/javainit').initializer(conf, function (jvm) {
        java = jvm;
        callback();
    });
};

var convertWord = function convertWord(result, widx) {
    var len = result.lengthSync();
    var buffer = [];
    var surface = result.surfaceSync();

    for (var i = 0; i < len; i++) {
        var morphs = result.applySync(i);
        var morpheme = new _data.Morpheme(morphs.surfaceSync(), morphs.tagSync().toStringSync(), morphs.rawTagSync(), i);
        buffer.push(morpheme);
    }

    var word = new _data.Word(surface, buffer, widx);
    var dependents = result.depsSync().toSeqSync();
    len = dependents.sizeSync();

    for (var _i = 0; _i < len; _i++) {
        var rel = dependents.applySync(_i);
        var relationship = new _data.Relationship(rel.headSync(), rel.relationSync().toStringSync(), rel.rawRelSync(), rel.targetSync());
        word.dependents.push(relationship);
    }

    return word;
};

var convertSentence = function convertSentence(result) {
    var len = result.lengthSync();
    var words = [];

    for (var i = 0; i < len; i++) {
        var word = result.applySync(i);
        words.push(convertWord(word, i));
    }

    var sentence = new _data.Sentence(words);
    var dependents = result.rootSync().depsSync().toSeqSync();
    len = dependents.sizeSync();

    for (var _i2 = 0; _i2 < len; _i2++) {
        var rel = dependents.applySync(_i2);
        var relationship = new _data.Relationship(rel.headSync(), rel.relationSync().toStringSync(), rel.rawRelSync(), rel.targetSync());
        sentence.root.dependents.push(relationship);
    }

    return sentence;
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