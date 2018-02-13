"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initialize = exports.Dictionary = exports.SentenceSplitter = exports.Parser = exports.Tagger = exports.POS = exports.API = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /** @module koalanlp **/

require("babel-polyfill");

var _data = require("./data");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @private
 * @type {{import:*, newInstanceSync:*, callStaticMethodSync:*}}
 */
var java = {};

/**
 * Assert method
 *
 * @private
 * @param cond Condition to be checked.
 * @param msg Message to be thrown if condition check is failed.
 * @param reject Function if assert is using inside of a Promise.
 */
var assert = function assert(cond, msg, reject) {
    if (!cond) {
        if (!reject) throw new Error(msg ? msg : "Assertion failed!");else reject(new Error(msg ? msg : "Assertion failed!"));
    }
};

/**
 * 분석기 API 목록.
 * @readonly
 * @property {string} HANNANUM 한나눔 분석기.
 * @property {string} EUNJEON 은전한닢(Mecab) 분석기.
 * @property {string} KOMORAN 코모란 분석기.
 * @property {string} KKMA 꼬꼬마 분석기.
 * @property {string} TWITTER 트위터(OpenKoreanText) 분석기.
 * @property {string} ARIRANG 아리랑 분석기.
 * @property {string} RHINO 라이노 분석기.
 */
var API = exports.API = require('./const').API;

/**
 * 품사분석을 위한 도구. (Shortcut)
 * @example
 * let koalanlp = require('koalanlp');
 * let POS = koalanlp.POS;
 * POS.isNoun(someMorpheme);
 * @readonly
 * @see {@link module:koalanlp/POS}
 */
var POS = exports.POS = require('./POS');

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

var Tagger = exports.Tagger = function () {
    /**
     * 품사분석기를 생성합니다.
     * @param {string} taggerType API 유형
     */
    function Tagger(taggerType) {
        _classCallCheck(this, Tagger);

        var Base = java.import("kr.bydelta.koala." + taggerType + ".Tagger");
        this.tagger = new Base();
    }

    /**
     * 문단단위 품사표기
     * @param {string|string[]} paragraph 품사표기할 문단(string) 또는 문장의 배열(string[])
     * @return {Promise<Sentence[]>} 품사표기 결과가 반환될, promise 객체
     */


    _createClass(Tagger, [{
        key: "tag",
        value: function tag(paragraph) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                if (Array.isArray(paragraph)) {
                    try {
                        var result = paragraph.map(function (sent) {
                            return _this.tagger.tagSentenceSync(sent);
                        });
                        resolve(result);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    _this.tagger.tag(paragraph, function (err, result) {
                        if (err) reject(err);else resolve(converter(result));
                    });
                }
            });
        }

        /**
         * 문장단위 품사표기
         * @param {string} sentence 품사표기할 문장.
         * @return {Promise<Sentence>} 품사표기 결과인 문장 1개를 담을 Promise가 반환됨.
         */

    }, {
        key: "tagSentence",
        value: function tagSentence(sentence) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                _this2.tagger.tagSentence(sentence, function (err, result) {
                    if (err) reject(err);else resolve(convertSentence(result));
                });
            });
        }
    }]);

    return Tagger;
}();

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


var Parser = exports.Parser = function () {
    /**
     * 의존구문분석기를 생성합니다.
     * @param {string} parserType 의존구문분석기 API 패키지.
     * @param {string|undefined} [taggerType=undefined] 품사분석기 API 패키지. 미지정시, 의존구문분석기 패키지 이용.
     */
    function Parser(parserType, taggerType) {
        _classCallCheck(this, Parser);

        assert(parserType == API.KKMA || parserType == API.HANNANUM, "꼬꼬마/한나눔을 제외한 분석기는 의존구문분석을 지원하지 않습니다.");

        if (taggerType) {
            var TagBase = java.import("kr.bydelta.koala." + taggerType + ".Tagger");
            this.tagger = new TagBase();
        }

        var ParseBase = java.import("kr.bydelta.koala." + parserType + ".Parser");
        this.parser = new ParseBase();
    }

    /**
     * 문단단위 분석
     * @param {string|string[]|Sentence|Sentence[]} paragraph 분석할 문단(string, string[], Sentence[]) 또는 문장(Sentence).
     * @return {Promise<Sentence>|Promise<Sentence[]>} 문장(Sentence)의 경우는 분석결과인 문장(Sentence)을, 문단인 경우는 분석 결과(문장 배열)를 담을 Promise가 반환됨.
     */


    _createClass(Parser, [{
        key: "parse",
        value: function parse(paragraph) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                var isList = Array.isArray(paragraph);
                var isSentence = paragraph instanceof _data.Sentence || paragraph[0] instanceof _data.Sentence;

                var target = undefined;
                if (isSentence) {
                    if (isList) {
                        target = paragraph.map(function (sent) {
                            return sent.reference;
                        });
                        target = java.callStaticMethodSync("scala.Predef", "genericArrayOps", target).toSeqSync();
                    } else {
                        target = paragraph.reference;
                    }
                    _this3.parser.parse(target, function (err, parsed) {
                        if (err) reject(err);else resolve(converter(parsed));
                    });
                } else {
                    try {
                        if (isList) {
                            target = [];
                            if (_this3.tagger) {
                                target = paragraph.map(function (sent) {
                                    return _this3.tagger.tagSync(sent);
                                });
                            } else {
                                target = paragraph;
                            }

                            resolve(target.map(function (sent) {
                                return convertSentence(_this3.parser.parseSync(sent));
                            }));
                        } else {
                            if (_this3.tagger) {
                                target = _this3.tagger.tagSync(paragraph);
                            } else {
                                target = paragraph;
                            }

                            _this3.parser.parse(target, function (err, parsed) {
                                if (err) reject(err);else resolve(converter(parsed));
                            });
                        }
                    } catch (e) {
                        reject(e);
                    }
                }
            });
        }

        /**
         * 문장단위 분석
         * @param {string|Sentence} sentence 분석할 문장.
         * @return {Promise<Sentence>} 분석 결과(문장 1개)를 담은 Promise가 반환됨.
         */

    }, {
        key: "parseSentence",
        value: function parseSentence(sentence) {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                var isSentence = sentence instanceof _data.Sentence;

                if (_this4.tagger && !isSentence) {
                    _this4.tagger.tagSentence(sentence, function (taggerErr, result) {
                        if (taggerErr) reject(taggerErr);else _this4.parser.parse(result, function (err, parsed) {
                            if (err) reject(err);else resolve(convertSentence(parsed));
                        });
                    });
                } else if (isSentence) {
                    var target = sentence.reference;
                    _this4.parser.parse(target, function (err, parsed) {
                        if (err) reject(err);else resolve(convertSentence(parsed));
                    });
                } else reject(new Error("A raw string cannot be parsed as a single sentence without a tagger!"));
            });
        }
    }]);

    return Parser;
}();

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


var SentenceSplitter = exports.SentenceSplitter = function () {
    /**
     * 문장분리기를 생성합니다.
     * @param {string} splitterType 문장분리기 API 패키지.
     */
    function SentenceSplitter(splitterType) {
        _classCallCheck(this, SentenceSplitter);

        assert(splitterType === API.TWITTER || splitterType === API.HANNANUM, "오픈한글(트위터)/한나눔을 제외한 분석기는 문장분리를 지원하지 않습니다.");

        var SegBase = java.import("kr.bydelta.koala." + splitterType + ".SentenceSplitter");
        this.splitter = new SegBase();
    }

    /**
     * 문단을 문장으로 분리합니다.
     * @param {string} paragraph 분석할 문단.
     * @return {Promise<string[]>} 분석 결과를 담은 Promise가 반환됨.
     */


    _createClass(SentenceSplitter, [{
        key: "sentences",
        value: function sentences(paragraph) {
            var _this5 = this;

            return new Promise(function (resolve, reject) {
                _this5.splitter.sentences(paragraph, function (err, parsed) {
                    if (err) reject(err);else resolve(convertSentenceStr(parsed));
                });
            });
        }

        /**
         * KoalaNLP가 구현한 문장분리기를 사용하여, 문단을 문장으로 분리합니다.
         * @param {Sentence} paragraph 분석할 문단. (품사표기가 되어있어야 합니다)
         * @return {Promise<Sentence[]>} 분석 결과를 담은 Promise가 반환됨.
         */

    }], [{
        key: "sentences",
        value: function sentences(paragraph) {
            assert(paragraph instanceof _data.Sentence);

            return new Promise(function (resolve, reject) {
                java.callStaticMethod("kr.bydelta.koala.util.SentenceSplitter", "apply", paragraph.reference, function (err, parsed) {
                    if (err) reject(err);else resolve(converter(parsed));
                });
            });
        }
    }]);

    return SentenceSplitter;
}();

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


var Dictionary = exports.Dictionary = function () {
    /**
     * 사용자 정의 사전을 연결합니다.
     * @param {string} dicType 사용자 정의 사전을 연결할 API 패키지.
     */
    function Dictionary(dicType) {
        _classCallCheck(this, Dictionary);

        assert(dicType !== API.RHINO, "라이노 분석기는 사용자 정의 사전을 지원하지 않습니다.");
        this.dict = java.callStaticMethodSync("kr.bydelta.koala." + dicType + ".JavaDictionary", 'get');
    }

    /**
     * 사용자 사전에, 표면형과 그 품사를 추가.
     *
     * @param {string|string[]} morph 표면형.
     * @param {string|string[]} tag   세종 품사.
     * @return {Promise<boolean>} 정상적으로 완료되었는지 여부를 담은 Promise.
     */


    _createClass(Dictionary, [{
        key: "addUserDictionary",
        value: function addUserDictionary(morph, tag) {
            var _this6 = this;

            var isMArray = Array.isArray(morph);
            var isTArray = Array.isArray(tag);

            assert(isMArray == isTArray, "형태소와 품사는 둘 다 같은 길이의 배열이거나 둘 다 string이어야 합니다.");

            return new Promise(function (resolve, reject) {
                if (isMArray) {
                    assert(morph.length == tag.length, "형태소와 품사는 둘 다 같은 길이의 배열이어야 합니다.", reject);
                    var tuples = [];
                    for (var i = 0; i < morph.length; i++) {
                        tuples.push(morphToTuple(morph[i], tag[i]));
                    }
                    tuples = java.callStaticMethodSync("scala.Predef", "genericArrayOps", tuples).toSeqSync();

                    _this6.dict.addUserDictionary(tuples, function (err) {
                        if (err) reject(err);else resolve(true);
                    });
                } else {
                    var posTag = java.callStaticMethodSync("kr.bydelta.koala.POS", "withName", tag);
                    _this6.dict.addUserDictionary(morph, posTag, function (err) {
                        if (err) reject(err);else resolve(true);
                    });
                }
            });
        }

        /**
         * 사전에 등재되어 있는지 확인합니다.
         *
         * @param {string} word   확인할 형태소
         * @param {...string} posTag 세종품사들(기본값: NNP 고유명사, NNG 일반명사)
         * @return {Promise<boolean>} 포함되는지 여부를 담은 Promise
         */

    }, {
        key: "contains",
        value: function contains(word) {
            var _this7 = this;

            for (var _len = arguments.length, posTag = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                posTag[_key - 1] = arguments[_key];
            }

            return new Promise(function (resolve, reject) {
                var tags = posTag || ["NNP", "NNG"];
                var posTags = [];
                for (var i = 0; i < tags.length; i++) {
                    posTags.push(java.callStaticMethodSync("kr.bydelta.koala.POS", "withName", tags[i]));
                }
                var posSet = java.callStaticMethodSync("scala.Predef", "genericArrayOps", posTags).toSetSync();

                _this7.dict.contains(word, posSet, function (err, result) {
                    if (err) reject(err);else resolve(result);
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

    }, {
        key: "getNotExists",
        value: function getNotExists(onlySystemDic) {
            var _this8 = this;

            for (var _len2 = arguments.length, word = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                word[_key2 - 1] = arguments[_key2];
            }

            return new Promise(function (resolve, reject) {
                var wordEntries = [];
                for (var i = 0; i < word.length; i++) {
                    wordEntries.push(morphToTuple(word[i]));
                }
                var wordSeq = java.callStaticMethodSync("scala.Predef", "genericArrayOps", wordEntries).toSeqSync();

                _this8.dict.getNotExists(onlySystemDic, wordSeq, function (err, notExists) {
                    if (err) reject(err);else {
                        var returnValue = [];
                        for (var _i = 0; _i < notExists.sizeSync(); _i++) {
                            var entry = notExists.applySync(_i);
                            returnValue.push({ morph: entry._1, tag: entry._2.toStringSync() });
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

    }, {
        key: "importFrom",
        value: function importFrom(other, filterFn, fastAppend) {
            var _this9 = this;

            var tags = [];
            if (typeof filterFn === 'string') {
                tags = [filterFn];
            } else if (Array.isArray(filterFn) && typeof filterFn[0] === 'string') {
                tags = filterFn;
            } else {
                tags = POS.Tags.filter(filterFn);
            }

            return new Promise(function (resolve, reject) {
                fastAppend = fastAppend || false;

                var tagSet = java.callStaticMethodSync("scala.Predef", "genericArrayOps", tags).toSetSync();

                _this9.dict.importFrom(other.dict, tagSet, fastAppend, function (err) {
                    if (err) reject(err);else resolve(true);
                });
            });
        }

        /**
         * 원본 사전에 등재된 항목 중에서, 지정된 형태소의 항목만을 가져옵니다. (복합 품사 결합 형태는 제외)
         *
         * @param {string|string[]|POSFilter} filterFn 가져올 품사나, 품사의 리스트, 또는 해당 품사인지 판단하는 함수.
         * @return {Promise<MorphemeGenerator>} (형태소, 품사) generator를 담을 Promise.
         */

    }, {
        key: "baseEntriesOf",
        value: function baseEntriesOf(filterFn) {
            var _this10 = this;

            filterFn = filterFn || POS.isNoun;
            var tags = [];
            if (typeof filterFn === 'string') {
                tags = [filterFn];
            } else if (Array.isArray(filterFn) && typeof filterFn[0] === 'string') {
                tags = filterFn;
            } else {
                tags = POS.Tags.filter(filterFn);
            }

            return new Promise(function (resolve, reject) {
                var tagSet = java.callStaticMethodSync("scala.Predef", "genericArrayOps", tags).toSetSync();

                _this10.dict.baseEntriesOf(tagSet, function (err, entries) {
                    if (err) reject(err);else {
                        var generator = /*#__PURE__*/regeneratorRuntime.mark(function generator() {
                            var entry;
                            return regeneratorRuntime.wrap(function generator$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            if (!entries.hasNextSync()) {
                                                _context.next = 6;
                                                break;
                                            }

                                            entry = entries.nextSync();
                                            _context.next = 4;
                                            return { morph: entry._1, tag: entry._2.toStringSync() };

                                        case 4:
                                            _context.next = 0;
                                            break;

                                        case 6:
                                        case "end":
                                            return _context.stop();
                                    }
                                }
                            }, generator, this);
                        });

                        resolve(generator());
                    }
                });
            });
        }
    }]);

    return Dictionary;
}();

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


var initialize = exports.initialize = function initialize(obj) {
    obj.version = obj.version || "1.9.2";
    obj.packages = obj.packages || [API.EUNJEON, API.KKMA];
    obj.tempJsonName = obj.tempJsonName || "koalanlp.json";
    obj.debug = obj.debug === true;
    obj.javaOptions = obj.javaOptions || ["-Xmx4g", "-Dfile.encoding=utf-8"];
    obj.useIvy2 = obj.useIvy2 || false;

    return new Promise(function (resolve, reject) {
        require('./javainit').initializer(obj).catch(reject).then(function (jvm) {
            java = jvm;

            if (obj.debug) console.log("[KoalaNLP] Jar file loading finished.");
            resolve(true);
        });
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

    for (var _i2 = 0; _i2 < len; _i2++) {
        var rel = dependents.applySync(_i2);
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

    var sentence = new _data.Sentence(words, result);
    var dependents = result.rootSync().depsSync().toSeqSync();
    len = dependents.sizeSync();

    for (var _i3 = 0; _i3 < len; _i3++) {
        var rel = dependents.applySync(_i3);
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

var convertSentenceStr = function convertSentenceStr(result) {
    var len = result.sizeSync();
    var buffer = [];

    for (var i = 0; i < len; i++) {
        var sentence = result.applySync(i);
        buffer.push(sentence);
    }
    return buffer;
};

var morphToTuple = function morphToTuple(obj, tag) {
    var morph = typeof tag !== "undefined" ? obj : obj.morph;
    var pos = typeof tag !== "undefined" ? tag : obj.tag;

    var posEntry = java.callStaticMethodSync("kr.bydelta.koala.POS", "withName", pos);
    return java.newInstanceSync("scala.Tuple2", morph, posEntry);
};