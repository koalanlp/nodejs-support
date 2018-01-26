'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initialize = exports.Dictionary = exports.SentenceSplitter = exports.Parser = exports.Tagger = exports.POS = exports.API = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _data = require('./koalanlp/data');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @private
 * @type {{import:*, newInstanceSync:*, callStaticMethodSync:*}}
 */
var java = {};

/**
 * Assert method
 * @param cond Condition to be checked.
 * @param msg Message to be thrown if condition check is failed.
 */
var assert = function assert(cond, msg) {
    if (!cond) throw new Error(msg ? msg : "Assertion failed!");
};

/**
 * 분석기 API 목록.
 */
var API = exports.API = require('./koalanlp/const').API;

/**
 * 품사분석을 위한 도구.
 * @type {POS}
 */
var POS = exports.POS = require('./koalanlp/POS');

/**
 * 분석결과 Callback
 * @callback parseCallback
 * @param {{error: *, result: Sentence[]}} result
 * @return *
 */

/**
 * 품사분석기 Wrapper 클래스
 */

var Tagger = exports.Tagger = function () {
    /**
     * 품사분석기를 생성합니다.
     * @param {string} taggerType API 유형
     */
    function Tagger(taggerType) {
        _classCallCheck(this, Tagger);

        var Base = java.import('kr.bydelta.koala.' + taggerType + '.Tagger');
        this.tagger = new Base();
    }

    /**
     * 문단단위 품사표기
     * @param {string} paragraph 품사표기할 문단.
     * @param {parseCallback=} callback 콜백함수 (Object[] => void). 지정된 경우, 결과를 전달받음.
     * @return {Sentence[]|undefined} callback이 없는 경우, 품사표기 결과가 반환됨.
     */


    _createClass(Tagger, [{
        key: 'tag',
        value: function tag(paragraph, callback) {
            if (callback) {
                this.tagger.tag(paragraph, function (err, result) {
                    if (err) callback({ error: err, result: [] });else callback({ error: false, result: converter(result) });
                });
            } else {
                return converter(this.tagger.tagSync(paragraph));
            }
        }

        /**
         * 문장단위 품사표기
         * @param {string} sentence 품사표기할 문장.
         * @param {parseCallback=} callback 콜백함수 (Object => void). 지정된 경우, 결과를 전달받음.
         * @return {Sentence[]|undefined} callback이 없는 경우, 품사표기 결과가 반환됨.
         */

    }, {
        key: 'tagSentence',
        value: function tagSentence(sentence, callback) {
            if (callback) {
                this.tagger.tagSentence(sentence, function (err, result) {
                    if (err) callback({ error: err, result: [] });else callback({ error: false, result: [convertSentence(result)] });
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
    /**
     * 의존구문분석기를 생성합니다.
     * @param {string} parserType 의존구문분석기 API 패키지.
     * @param {string|undefined} [taggerType=undefined] 품사분석기 API 패키지. 미지정시, 의존구문분석기 패키지 이용.
     */
    function Parser(parserType, taggerType) {
        _classCallCheck(this, Parser);

        assert(parserType == util.TYPES.KKMA || parserType == util.TYPES.HANNANUM, "꼬꼬마/한나눔을 제외한 분석기는 의존구문분석을 지원하지 않습니다.");

        if (taggerType) {
            var TagBase = java.import('kr.bydelta.koala.' + taggerType + '.Tagger');
            this.tagger = new TagBase();
        }

        var ParseBase = java.import('kr.bydelta.koala.' + parserType + '.Parser');
        this.parser = new ParseBase();
    }

    /**
     * 문단단위 분석
     * @param {string|Sentence[]} paragraph 분석할 문단.
     * @param {parseCallback=} callback 콜백함수 (Object[] => void). 지정된 경우, 결과를 전달받음.
     * @return {Sentence[]|undefined} callback이 없는 경우, 분석 결과가 반환됨.
     */


    _createClass(Parser, [{
        key: 'parse',
        value: function parse(paragraph, callback) {
            var isSentences = Array.isArray(paragraph) && paragraph[0] instanceof _data.Sentence;

            if (this.tagger && !isSentences) {
                if (callback) {
                    var parser = this.parser;
                    this.tagger.tag(paragraph, function (err, result) {
                        if (err) callback({ error: err, result: [] });else parser.parse(result, function (err2, parsed) {
                            if (err2) callback({ error: err2, result: [] });else callback({ error: false, result: converter(parsed) });
                        });
                    });
                } else {
                    var tagged = this.tagger.tagSync(paragraph);
                    var parsed = this.parser.parseSync(tagged);
                    return converter(parsed);
                }
            } else {
                var target = paragraph;
                if (isSentences) {
                    target = [];
                    for (var i = 0; i < paragraph.length; i++) {
                        target.push(paragraph[i].reference);
                    }
                }

                if (callback) {
                    this.parser.parse(target, function (err, parsed) {
                        if (err) callback({ error: err, result: [] });else callback({ error: false, result: converter(parsed) });
                    });
                } else {
                    var _parsed = this.parser.parseSync(target);
                    return converter(_parsed);
                }
            }
        }

        /**
         * 문장단위 분석
         * @param {string|Sentence} sentence 분석할 문장.
         * @param {parseCallback=} callback 콜백함수 (Object => void). 지정된 경우, 결과를 전달받음.
         * @return {Sentence[]|undefined} callback이 없는 경우, 분석 결과가 반환됨.
         */

    }, {
        key: 'parseSentence',
        value: function parseSentence(sentence, callback) {
            var isSentence = sentence instanceof _data.Sentence;

            if (this.tagger && !isSentence) {
                if (callback) {
                    var parser = this.parser;
                    this.tagger.tagSentence(sentence, function (err, result) {
                        if (err) callback({ error: err, result: [] });else parser.parse(result, function (err2, parsed) {
                            if (err2) callback({ error: err2, result: [] });else callback({ error: false, result: [convertSentence(parsed)] });
                        });
                    });
                } else {
                    var tagged = this.tagger.tagSentenceSync(sentence);
                    var parsed = this.parser.parseSync(tagged);
                    return convertSentence(parsed);
                }
            } else {
                var target = isSentence ? sentence.reference : sentence;
                if (callback) {
                    this.parser.parse(target, function (err, parsed) {
                        if (err) callback({ error: err, result: [] });else callback({ error: false, result: [convertSentence(parsed)] });
                    });
                } else {
                    var _parsed2 = this.parser.parseSync(target);
                    return convertSentence(_parsed2);
                }
            }
        }
    }]);

    return Parser;
}();

/**
 * 문장분리기 클래스
 */


var SentenceSplitter = exports.SentenceSplitter = function () {
    /**
     * 문장분리기를 생성합니다.
     * @param {string} splitterType 문장분리기 API 패키지.
     */
    function SentenceSplitter(splitterType) {
        _classCallCheck(this, SentenceSplitter);

        assert(splitterType === util.TYPES.TWITTER || splitterType === util.TYPES.HANNANUM, "오픈한글(트위터)/한나눔을 제외한 분석기는 문장분리를 지원하지 않습니다.");

        var SegBase = java.import('kr.bydelta.koala.' + splitterType + '.SentenceSplitter');
        this.splitter = new SegBase();
    }

    /**
     * 문단을 문장으로 분리합니다.
     * @param {string} paragraph 분석할 문단.
     * @param {parseCallback=} callback 콜백함수 (Object[] => void). 지정된 경우, 결과를 전달받음.
     * @return {Sentence[]|undefined} callback이 없는 경우, 분석 결과가 반환됨.
     */


    _createClass(SentenceSplitter, [{
        key: 'sentences',
        value: function sentences(paragraph, callback) {
            if (callback) {
                this.splitter.sentences(paragraph, function (err, parsed) {
                    if (err) callback({ error: err, result: [] });else callback({ error: false, result: convertSentenceStr(parsed) });
                });
            } else {
                var parsed = this.splitter.sentencesSync(paragraph);
                return convertSentenceStr(parsed);
            }
        }

        /**
         * KoalaNLP가 구현한 문장분리기를 사용하여, 문단을 문장으로 분리합니다.
         * @param {Sentence} paragraph 분석할 문단. (품사표기가 되어있어야 합니다)
         * @param {parseCallback=} callback 콜백함수 (Object[] => void). 지정된 경우, 결과를 전달받음.
         * @return {Sentence[]|undefined} callback이 없는 경우, 분석 결과가 반환됨.
         */

    }], [{
        key: 'sentencesByKoala',
        value: function sentencesByKoala(paragraph, callback) {
            assert(paragraph instanceof _data.Sentence);
            if (callback) {
                java.callStaticMethod("kr.bydelta.koala.util.SentenceSplitter", "apply", paragraph.reference, function (err, parsed) {
                    if (err) callback({ error: err, result: [] });else callback({ error: false, result: converter(parsed) });
                });
            } else {
                var parsed = java.callStaticMethodSync("kr.bydelta.koala.util.SentenceSplitter", "apply", paragraph.reference);
                return converter(parsed);
            }
        }
    }]);

    return SentenceSplitter;
}();

/**
 * 품사 필터링 함수
 * @callback POSFilter
 * @param {string} POS 품사
 * @return {boolean} 품사가 포함 되는지의 여부.
 */

/**
 * 사전 import 콜백 함수.
 * @callback DictImportCallback
 * @return *
 */

/**
 * 사용자 정의 사전 클래스
 */


var Dictionary = exports.Dictionary = function () {
    /**
     * 사용자 정의 사전을 연결합니다.
     * @param {string} dicType 사용자 정의 사전을 연결할 API 패키지.
     */
    function Dictionary(dicType) {
        _classCallCheck(this, Dictionary);

        assert(dicType !== util.TYPES.RHINO, "라이노 분석기는 사용자 정의 사전을 지원하지 않습니다.");
        this.dict = java.callStaticMethodSync('kr.bydelta.koala.' + dicType + '.JavaDictionary', 'get');
    }

    /**
     * 사용자 사전에, 표면형과 그 품사를 추가.
     *
     * @param {string|string[]} morph 표면형.
     * @param {string|string[]} tag   세종 품사.
     */


    _createClass(Dictionary, [{
        key: 'addUserDictionary',
        value: function addUserDictionary(morph, tag) {
            var isMArray = Array.isArray(morph);
            var isTArray = Array.isArray(tag);

            assert(isMArray == isTArray, "형태소와 품사는 둘 다 같은 길이의 배열이거나 둘 다 string이어야 합니다.");

            if (isMArray) {
                assert(morph.length == tag.length, "형태소와 품사는 둘 다 같은 길이의 배열이어야 합니다.");
                var tuples = [];
                for (var i = 0; i < morph.length; i++) {
                    tuples.push(morphToTuple(morph[i], tag[i]));
                }
                this.dict.addUserDictionarySync(morph, tuples);
            } else {
                var posTag = java.callStaticMethodSync("kr.bydelta.koala.POS", "withName", tag);
                this.dict.addUserDictionarySync(morph, posTag);
            }
        }

        /**
         * 사전에 등재되어 있는지 확인합니다.
         *
         * @param {string} word   확인할 형태소
         * @param {...string} posTag 세종품사들(기본값: NNP 고유명사, NNG 일반명사)
         */

    }, {
        key: 'contains',
        value: function contains(word) {
            for (var _len = arguments.length, posTag = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                posTag[_key - 1] = arguments[_key];
            }

            var tags = posTag || ["NNP", "NNG"];
            var posTags = [];
            for (var i = 0; i < tags.length; i++) {
                posTags.push(java.callStaticMethodSync("kr.bydelta.koala.POS", "withName", tags[i]));
            }
            var posSet = java.callStaticMethodSync("scala.Predef", "genericArrayOps", posTags).toSetSync();

            return this.dict.containsSync(word, posSet);
        }

        /**
         * 사전에 등재되어 있는지 확인하고, 사전에 없는단어만 반환합니다.
         *
         * @param {boolean} onlySystemDic 시스템 사전에서만 검색할지 결정합니다.
         * @param {...{morph:string, pos:string}} word 확인할 (형태소, 품사)들.
         * @return 사전에 없는 단어들.
         */

    }, {
        key: 'getNotExists',
        value: function getNotExists(onlySystemDic) {
            var wordEntries = [];

            for (var _len2 = arguments.length, word = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                word[_key2 - 1] = arguments[_key2];
            }

            for (var i = 0; i < word.length; i++) {
                wordEntries.push(morphToTuple(word[i]));
            }
            var wordSeq = java.callStaticMethodSync("scala.Predef", "genericArrayOps", wordEntries).toSeqSync();

            var notExists = this.dict.getNotExistsSync(onlySystemDic, wordSeq);
            var returnValue = [];
            for (var _i = 0; _i < notExists.sizeSync(); _i++) {
                var entry = notExists.applySync(_i);
                returnValue.push({ morph: entry._1, tag: entry._2.toStringSync() });
            }

            return returnValue;
        }

        /**
         * 다른 사전을 참조하여, 선택된 사전에 없는 단어를 사용자사전으로 추가합니다.
         *
         * @param {Dictionary} other 참조할 사전
         * @param {POSFilter} filterFn 추가할 품사를 지정하는 함수.
         * @param {boolean} fastAppend 선택된 사전에 존재하는지를 검사하지 않고 빠르게 추가하고자 할 때. (기본값 false)
         * @param {DictImportCallback} callback 사전 import가 종료된 다음 호출될 Callback 함수
         */

    }, {
        key: 'importFrom',
        value: function importFrom(other, filterFn, fastAppend, callback) {
            assert(typeof callback !== "undefined", "Callback should be defined.");
            fastAppend = fastAppend || false;

            var tags = POS.TAGS.filter(filterFn);
            var tagSet = java.callStaticMethodSync("scala.Predef", "genericArrayOps", tags).toSetSync();

            this.dict.importFrom(other.dict, filterFn, fastAppend, callback);
        }

        /**
         * 원본 사전에 등재된 항목 중에서, 지정된 형태소의 항목만을 가져옵니다. (복합 품사 결합 형태는 제외)
         *
         * @param {POSFilter} filterFn 가져올 품사인지 판단하는 함수.
         * @return {{morph: string, tag: string}} (형태소, 품사) generator.
         */

    }, {
        key: 'baseEntriesOf',
        value: function baseEntriesOf(filterFn) {
            filterFn = filterFn || POS.isNoun;

            var tags = POS.TAGS.filter(filterFn);
            var tagSet = java.callStaticMethodSync("scala.Predef", "genericArrayOps", tags).toSetSync();

            var entries = this.dict.baseEntriesOfSync(tagSet);
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
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, generator, this);
            });

            return generator();
        }
    }]);

    return Dictionary;
}();

/**
 * 초기화 Callback
 * @callback initCallback
 * @return *
 */

/**
 * 의존패키지 초기화 및 사전적재 함수
 * @param {{version: string|undefined, packages: string[]|undefined,
 * tempJsonName: string|undefined, debug: boolean|undefined, javaOptions: string[]|undefined,
 * useIvy2: boolean}} obj 설정 Object
 * @param {initCallback} callback 콜백 함수 (void => void)
 */


var initialize = exports.initialize = function initialize(obj, callback) {
    if (typeof obj === "function") {
        callback = obj;
        obj = {};
    } else if (typeof obj === "undefined") {
        obj = {};
    }

    obj.version = obj.version || "1.9.0";
    obj.packages = obj.packages || [util.TYPES.EUNJEON, util.TYPES.KKMA];
    obj.tempJsonName = obj.tempJsonName || "koalanlp.json";
    obj.debug = obj.debug === true;
    obj.javaOptions = obj.javaOptions || ["-Xmx4g"];
    obj.useIvy2 = obj.useIvy2 || false;

    require('./koalanlp/javainit').initializer(obj, function (jvm) {
        java = jvm;
        console.log("[KoalaNLP] Jar file loading finished.");
        if (callback) callback();
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
    var morph = tag ? obj : obj.morph;
    var pos = tag ? tag : obj.tag;

    var posEntry = java.callStaticMethodSync("kr.bydelta.koala.POS", "withName", pos);
    return java.newInstanceSync("scala.Tuple2", morph, posEntry);
};