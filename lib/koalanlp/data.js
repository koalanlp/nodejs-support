"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _NOUN_SET = ["NNG", "NNP", "NNB", "NR", "NP"];
var _PRED_SET = ["VV", "VA", "VX", "VCP", "VCN"];
var _MODF_SET = ["MM", "MAG", "MAJ"];
var _JOSA_SET = ["JKS", "JKC", "JKG", "JKO", "JKB", "JKV", "JKQ", "JC", "JX"];
var _EOMI_SET = ["EP", "EF", "EC", "ETN", "ETM"];
var _AFFX_SET = ["XPN", "XPV", "XSN", "XSV", "XSM", "XSN", "XSO", "XR"];
var _SUFX_SET = ["XSN", "XSV", "XSM", "XSN", "XSO"];
var _SYMB_SET = ["SF", "SP", "SS", "SE", "SW", "SO"];
var _UNKN_SET = ["NF", "NV", "NA"];

var finder = function finder(set, tag) {
    if (typeof tag === "string") return set.indexOf(tag) >= 0;else if (tag instanceof Morpheme) return set.indexOf(tag.tag) >= 0;else return false;
};

var assert = function assert(cond, msg) {
    if (!cond) throw new Error(msg ? msg : "Assertion failed!");
};

/**
 * 품사분석 도우미
 */

var POS = exports.POS = function () {
    function POS() {
        _classCallCheck(this, POS);
    }

    _createClass(POS, null, [{
        key: "isNoun",

        /**
         * 주어진 tag가 체언(명사,대명사,의존명사,수사)인지 확인.
         * @param tag 확인할 품사표기 또는 형태소.
         */
        value: function isNoun(tag) {
            return finder(_NOUN_SET, tag);
        }

        /**
         * 주어진 tag가 용언(동사,형용사)인지 확인.
         * @param tag 확인할 품사표기 또는 형태소.
         */

    }, {
        key: "isPredicate",
        value: function isPredicate(tag) {
            return finder(_PRED_SET, tag);
        }

        /**
         * 주어진 tag가 수식언(관형사,부사)인지 확인.
         * @param tag 확인할 품사표기 또는 형태소.
         */

    }, {
        key: "isModifier",
        value: function isModifier(tag) {
            return finder(_MODF_SET, tag);
        }

        /**
         * 주어진 tag가 관계언(조사)인지 확인.
         * @param tag 확인할 품사표기 또는 형태소.
         */

    }, {
        key: "isPostposition",
        value: function isPostposition(tag) {
            return finder(_JOSA_SET, tag);
        }

        /**
         * 주어진 tag가 어미인지 확인.
         * @param tag 확인할 품사표기 또는 형태소.
         */

    }, {
        key: "isEnding",
        value: function isEnding(tag) {
            return finder(_EOMI_SET, tag);
        }

        /**
         * 주어진 tag가 접사인지 확인.
         * @param tag 확인할 품사표기 또는 형태소.
         */

    }, {
        key: "isAffix",
        value: function isAffix(tag) {
            return finder(_AFFX_SET, tag);
        }

        /**
         * 주어진 tag가 접미사인지 확인.
         * @param tag 확인할 품사표기 또는 형태소.
         */

    }, {
        key: "isSuffix",
        value: function isSuffix(tag) {
            return finder(_SUFX_SET, tag);
        }

        /**
         * 주어진 tag가 기호인지 확인.
         * @param tag 확인할 품사표기 또는 형태소.
         */

    }, {
        key: "isSymbol",
        value: function isSymbol(tag) {
            return finder(_SYMB_SET, tag);
        }

        /**
         * 주어진 tag가 품사분석에 실패한, 미상의 품사인지 확인.
         * @param tag 확인할 품사표기 또는 형태소.
         */

    }, {
        key: "isUnknown",
        value: function isUnknown(tag) {
            return finder(_UNKN_SET, tag);
        }
    }]);

    return POS;
}();

/**
 * 형태소
 */


var Morpheme = exports.Morpheme = function () {
    /**
     * 형태소 생성자.
     * @param {string} surface 형태소 표면형.
     * @param {string} tag 세종 품사
     * @param {string} rawTag 원본 품사
     * @param {Number} id 어절 내 위치.
     */
    function Morpheme(surface, tag, rawTag, id) {
        _classCallCheck(this, Morpheme);

        assert(typeof surface === "string", "Surface should be a string!");
        assert(typeof tag === "string", "Tag should be a string!");
        assert(typeof rawTag === "string", "RawTag should be a string!");
        assert(typeof id === "number", "Id should be a number!");

        this.surface = surface;
        this.tag = tag;
        this.rawTag = rawTag;
        this.id = id;
    }

    /**
     * 지정된 tag와 형태소가 일치하는지 확인.
     * @param {string} tag 확인할 세종품사.
     * @return {boolean} 일치하거나, 지정된 tag에 포함되는 경우, true.
     */


    _createClass(Morpheme, [{
        key: "hasTag",
        value: function hasTag(tag) {
            if (typeof tag === "string") {
                return this.tag.startsWith(tag);
            } else if (Array.isArray(tag)) {
                var found = tag.find(function (v) {
                    return this.tag.startsWith(v);
                });
                return typeof found !== "undefined";
            } else return false;
        }

        /**
         * 지정된 tag와 형태소가 일치하는지 확인.
         * @param {string} tag 확인할 원본품사.
         * @return {boolean} 일치하거나, 지정된 tag에 포함되는 경우, true.
         */

    }, {
        key: "hasRawTag",
        value: function hasRawTag(tag) {
            if (typeof tag === "string") {
                return this.rawTag.startsWith(tag);
            } else if (Array.isArray(tag)) {
                var found = tag.find(function (v) {
                    return this.rawTag.startsWith(v);
                });
                return typeof found !== "undefined";
            } else return false;
        }

        /**
         * 두 형태소가 같은지 확인.
         * @param {Morpheme} morph 확인할 형태소.
         * @return {boolean} 표면형과 품사가 모두 같으면 true.
         */

    }, {
        key: "equals",
        value: function equals(morph) {
            if (morph instanceof Morpheme) {
                return morph.surface === this.surface && morph.tag === this.tag;
            } else return false;
        }

        /**
         * 두 형태소의 표면형이 같은지 확인.
         * @param {Morpheme} morph 확인할 형태소.
         * @return {boolean} 표면형이 같으면 true.
         */

    }, {
        key: "equalsWithoutTag",
        value: function equalsWithoutTag(morph) {
            if (morph instanceof Morpheme) {
                return morph.surface === this.surface;
            } else return false;
        }

        /**
         * 문자열로 변환.
         * @return {string} 표면형/세종(원본) 형태의 문자열.
         */

    }, {
        key: "toString",
        value: function toString() {
            return this.surface + "/" + this.tag + "(" + this.rawTag + ")";
        }

        /**
         * JSON으로 변환.
         * @return {{surface: string, tag: string, rawTag: string}} 표면형, 세종품사, 원본품사를 담고있는 Json Object.
         */

    }, {
        key: "toJson",
        value: function toJson() {
            return {
                surface: this.surface,
                tag: this.tag,
                rawTag: this.tag
            };
        }
    }]);

    return Morpheme;
}();

/**
 * 의존관계
 */


var Relationship = exports.Relationship = function () {
    /**
     * 의존관계 객체생성
     * @param {Number} head 지배소 위치.
     * @param {string} relation 관계
     * @param {string} rawRel 원본관계.
     * @param {Number} target 피지배소 위치.
     */
    function Relationship(head, relation, rawRel, target) {
        _classCallCheck(this, Relationship);

        assert(typeof head === "number");
        assert(typeof relation === "string");
        assert(typeof rawRel === "string");
        assert(typeof target === "number");

        this.head = head;
        this.relation = relation;
        this.rawRel = rawRel;
        this.target = target;
    }

    /**
     * 두 의존관계가 같은지 확인.
     * @param {Relationship} obj 비교할 의존관계.
     * @return {boolean} 지배소, 피지배소, 관계 모두 일치하면, true
     */


    _createClass(Relationship, [{
        key: "equals",
        value: function equals(obj) {
            if (obj instanceof Relationship) return this.head === obj.head && this.relation === obj.relation && this.target === obj.target;else return false;
        }

        /**
         * 문자열로 변환.
         * @return {string} 관계 (지배소-피지배소) 형태의 문자열.
         */

    }, {
        key: "toString",
        value: function toString() {
            return "Rel:" + this.relation + " (ID:" + this.head + " \u2192 ID:" + this.target + ")";
        }

        /**
         * JSON 객체로 변환.
         * @return {{headId: number, targetId: number, relation: string, rawRel: string}} 지배소, 피지배소, 관계, 원본관계를 포함한 JSON 객체.
         */

    }, {
        key: "toJson",
        value: function toJson() {
            return {
                headId: this.head,
                targetId: this.target,
                relation: this.relation,
                rawRel: this.rawRel
            };
        }
    }]);

    return Relationship;
}();

/**
 * 어절
 */


var Word = exports.Word = function () {
    /**
     * 어절 객체 생성.
     * @param {string} [surface=undefined] 어절의 표면형.
     * @param {Morpheme[]} [morphemes=undefined] 어절의 형태소 목록.
     * @param {Number} [id=undefined] 어절의 문장 내 위치.
     */
    function Word(surface, morphemes, id) {
        _classCallCheck(this, Word);

        if (typeof surface !== "undefined") {
            assert(typeof surface === "string", "Surface should be a string!");
            assert(Array.isArray(morphemes) && morphemes[0] instanceof Morpheme, "Morphemes are not an array: " + morphemes + " && isMorpheme=" + (morphemes[0] instanceof Morpheme));
            assert(typeof id === "number", "Id is not a number: " + id);

            this.surface = surface;
            this.morphemes = morphemes;
            this.id = id;
        } else {
            this.surface = "##ROOT##";
            this.morphemes = [];
            this.id = -1;
        }
        this.dependents = [];
    }

    /**
     * 어절 내 형태소의 수
     * @return {Number} 형태소의 수
     */


    _createClass(Word, [{
        key: "length",
        value: function length() {
            return this.morphemes.length;
        }

        /**
         * 지정된 위치에 있는 형태소 반환.
         * @param {Number} idx 형태소를 찾을 위치.
         * @return {Morpheme} 형태소.
         */

    }, {
        key: "get",
        value: function get(idx) {
            return this.morphemes[idx];
        }

        /**
         * 주어진 형태소 형태를 포함하는지 확인.
         * @param {string[]} tag 확인할 형태소 순서.
         * @return {boolean} 주어진 순서대로 어절에 포함되어 있다면 true. (연속할 필요는 없음)
         */

    }, {
        key: "matches",
        value: function matches(tag) {
            if (Array.isArray(tag)) {
                var list = tag.reverse();
                for (var i = 0; i < this.morphemes.length; i++) {
                    if (list.length > 0 && this.morphemes[i].tag.startsWith(list[list.length - 1])) list.pop();
                }
                return list.length == 0;
            } else return false;
        }

        /**
         * 형태소가 조건을 만족하는지 확인하는 함수.
         * @callback morphMatcher
         * @param {Morpheme} morpheme
         * @return {boolean}
         */

        /**
         * 주어진 형태소/조건을 만족하는 형태소 반환.
         * @param {Morpheme|morphMatcher} fn 확인할 형태소 또는 조건.
         * @return {Morpheme|undefined} 만족하는 형태소.
         */

    }, {
        key: "find",
        value: function find(fn) {
            if (typeof fn === "function") {
                return this.morphemes.find(fn);
            } else if (fn instanceof Morpheme) {
                return this.morphemes.find(function (m) {
                    return m.equals(fn);
                });
            } else return undefined;
        }

        /**
         * 주어진 형태소/조건을 만족하는 형태소가 있는지 확인.
         * @param {Morpheme|morphMatcher} fn 확인할 형태소 또는 조건.
         * @return {boolean} 만족하는 형태소가 있으면 true.
         */

    }, {
        key: "exists",
        value: function exists(fn) {
            var found = this.find(fn);
            return typeof found !== "undefined";
        }

        /**
         * 두 어절의 표면형이 일치하는지 확인.
         * @param {Word} another 비교할 어절.
         * @return {boolean} 표면형이 일치하면, true
         */

    }, {
        key: "equalsWithoutTag",
        value: function equalsWithoutTag(another) {
            if (another instanceof Word) {
                return another.surface === this.surface;
            } else return false;
        }

        /**
         * 두 어절이 같은지 확인.
         * @param {Word} another 비교할 어절 
         * @return {boolean} 표면형과 문장 내 위치가 일치하면, true.
         */

    }, {
        key: "equals",
        value: function equals(another) {
            if (another instanceof Word) {
                var isEqual = another.id === this.id && this.length() === another.length();
                for (var i = 0; i < this.length() && isEqual; i++) {
                    isEqual = isEqual && this.get(i) === another.get(i);
                }
                return isEqual;
            } else return false;
        }

        /**
         * 문자열로 변환.
         * @return {string} 변환된 문자열.
         */

    }, {
        key: "toString",
        value: function toString() {
            var morphStr = this.morphemes.map(function (m) {
                return m.toString();
            }).join("+");
            var buffer = this.surface + "\t= " + morphStr;
            if (this.dependents.length > 0) {
                buffer += "\n";
                buffer += this.dependents.map(function (r) {
                    return ".... \uC774 \uC5B4\uC808\uC758 " + r.relation + ": \uC5B4\uC808 [#" + r.target + "]";
                }).join("\n");
            }
            return buffer;
        }

        /**
         * 형태소 목록을 한 줄짜리 문자열로 변환.
         * @return {string} "형태소1/품사1+형태소2/품사2..." 형태의 문자열.
         */

    }, {
        key: "singleLineString",
        value: function singleLineString() {
            return this.morphemes.map(function (m) {
                return m.surface + "/" + m.tag;
            }).join("+");
        }

        /**
         * 어절을 JSON 객체로 변환.
         * @return {{surface: string, morphemes: Array, dependents: Array}} 표면형, 형태소, 의존소를 갖는 Json Object.
         */

    }, {
        key: "toJson",
        value: function toJson() {
            return {
                surface: this.surface,
                morphemes: this.morphemes.map(function (m) {
                    return m.toJson();
                }),
                dependents: this.dependents.map(function (r) {
                    return r.toJson();
                })
            };
        }
    }]);

    return Word;
}();

/**
 * 문장.
 */


var Sentence = exports.Sentence = function () {
    /**
     * 문장 객체 생성.
     * @param {Word[]} words 문장에 포함될 어절 목록.
     * @param {*} reference KoalaNLP(Java) 분석결과.
     */
    function Sentence(words, reference) {
        _classCallCheck(this, Sentence);

        assert(Array.isArray(words) && words[0] instanceof Word);

        this.words = words;
        this.reference = reference;
        this.root = new Word();
    }

    /**
     * 주어진 형태소 형태를 포함하는지 확인.
     * @param {string[][]} tag 확인할 형태소 순서. 형태소의 묶음(어절단위)의 묶음. 
     * @return {boolean} 주어진 순서대로 어절에 포함되어 있다면 true. (연속할 필요는 없음)
     */


    _createClass(Sentence, [{
        key: "matches",
        value: function matches(tag) {
            if (Array.isArray(tag)) {
                var list = tag.reverse();
                for (var i = 0; i < this.words.length; i++) {
                    if (list.length > 0 && this.words[i].matches(list[list.length - 1])) list.pop();
                }
                return list.length == 0;
            } else return false;
        }

        /**
         * 어절이 조건을 만족하는지 확인하는 함수.
         * @callback wordMatcher
         * @param {Word} word
         * @return {boolean}
         */

        /**
         * 주어진 어절/조건을 만족하는 어절 반환.
         * @param {Word|wordMatcher} fn 확인할 어절 또는 조건.
         * @return {Word|undefined} 만족하는 어절.
         */

    }, {
        key: "find",
        value: function find(fn) {
            if (typeof fn === "function") {
                return this.words.find(fn);
            } else if (fn instanceof Word) {
                return this.words.find(function (w) {
                    return w.equals(fn);
                });
            } else return undefined;
        }

        /**
         * 주어진 어절/조건을 만족하는 어절이 있는지 확인.
         * @param {Word|wordMatcher} fn 확인할 어절 또는 조건.
         * @return {Word|undefined} 만족하는 어절이 있으면 true.
         */

    }, {
        key: "exists",
        value: function exists(fn) {
            var found = this.find(fn);
            return typeof found !== "undefined";
        }

        /**
         * 문장 내 체언(명사,대명사,의존명사,수사)을 포함한 어절의 목록.
         * @return {Word[]} 체언 목록
         */

    }, {
        key: "nouns",
        value: function nouns() {
            return this.words.filter(function (w) {
                return w.exists(POS.isNoun);
            });
        }

        /**
         * 문장 내 용언(동사,형용사)을 포함한 어절의 목록.
         * @return {Word[]} 용언 목록
         */

    }, {
        key: "verbs",
        value: function verbs() {
            return this.words.filter(function (w) {
                return w.exists(POS.isPredicate);
            });
        }

        /**
         * 문장 내 수식언(관형사,부사)을 포함한 어절의 목록.
         * @return {Word[]} 수식언 목록
         */

    }, {
        key: "modifiers",
        value: function modifiers() {
            return this.words.filter(function (w) {
                return w.exists(POS.isModifier);
            });
        }

        /**
         * 주어진 위치의 어절 반환.
         * @param {Number} idx 어절을 찾을 위치.
         * @return {Word} 해당하는 어절.
         */

    }, {
        key: "get",
        value: function get(idx) {
            return this.words[idx];
        }

        /**
         * 문장 내 어절의 수
         * @return {Number} 어절의 수.
         */

    }, {
        key: "length",
        value: function length() {
            return this.words.length;
        }

        /**
         * 문자열로 변환.
         * @return {string} 변환된 문자열.
         */

    }, {
        key: "toString",
        value: function toString() {
            var _this = this;

            var buffer = this.surfaceString() + "\n";

            var _loop = function _loop(i) {
                var w = _this.words[i];
                buffer += "[#" + i + "] " + w.toString();
                if (_this.root.dependents.find(function (r) {
                    return r.target == w.id;
                })) {
                    buffer += "\n.... 이 어절이 ROOT 입니다";
                }
                buffer += "\n";
            };

            for (var i = 0; i < this.words.length; i++) {
                _loop(i);
            }
            return buffer;
        }

        /**
         * 표면형 문자열.
         * @param {string} [delimiter=space] 어절을 구분할 구분자.
         * @return {string} 구분자로 어절이 구분된 문자열.
         */

    }, {
        key: "surfaceString",
        value: function surfaceString(delimiter) {
            delimiter = delimiter || " ";
            return this.words.map(function (w) {
                return w.surface;
            }).join(delimiter);
        }

        /**
         * 한 줄짜리 형태소분석 결과.
         * @return {string} "형태소1/품사1+형태소2/품사2..." 형태의 어절이 띄어쓰기로 분리된 문장.
         */

    }, {
        key: "singleLineString",
        value: function singleLineString() {
            return this.words.map(function (w) {
                return w.singleLineString();
            }).join(" ");
        }

        /**
         * 문장의 JSON 객체.
         * @return {{words: Array, root: Array}} 어절과 root를 포함한 Json Object.
         */

    }, {
        key: "toJson",
        value: function toJson() {
            return {
                words: this.words.map(function (m) {
                    return m.toJson();
                }),
                root: this.root.dependents.map(function (r) {
                    return r.toJson();
                })
            };
        }
    }]);

    return Sentence;
}();