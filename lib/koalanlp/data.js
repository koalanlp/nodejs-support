"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by bydelta on 17. 12. 31.
 */
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

var POS = exports.POS = function () {
    function POS() {
        _classCallCheck(this, POS);
    }

    _createClass(POS, null, [{
        key: "isNoun",
        value: function isNoun(tag) {
            return finder(_NOUN_SET, tag);
        }
    }, {
        key: "isPredicate",
        value: function isPredicate(tag) {
            return finder(_PRED_SET, tag);
        }
    }, {
        key: "isModifier",
        value: function isModifier(tag) {
            return finder(_MODF_SET, tag);
        }
    }, {
        key: "isPostposition",
        value: function isPostposition(tag) {
            return finder(_JOSA_SET, tag);
        }
    }, {
        key: "isEnding",
        value: function isEnding(tag) {
            return finder(_EOMI_SET, tag);
        }
    }, {
        key: "isAffix",
        value: function isAffix(tag) {
            return finder(_AFFX_SET, tag);
        }
    }, {
        key: "isSuffix",
        value: function isSuffix(tag) {
            return finder(_SUFX_SET, tag);
        }
    }, {
        key: "isSymbol",
        value: function isSymbol(tag) {
            return finder(_SYMB_SET, tag);
        }
    }, {
        key: "isUnknown",
        value: function isUnknown(tag) {
            return finder(_UNKN_SET, tag);
        }
    }]);

    return POS;
}();

var Morpheme = exports.Morpheme = function () {
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
    }, {
        key: "equals",
        value: function equals(morph) {
            if (morph instanceof Morpheme) {
                return morph.surface === this.surface && morph.tag === this.tag;
            } else return false;
        }
    }, {
        key: "equalsWithoutTag",
        value: function equalsWithoutTag(morph) {
            if (morph instanceof Morpheme) {
                return morph.surface === this.surface;
            } else return false;
        }
    }, {
        key: "toString",
        value: function toString() {
            return this.surface + "/" + this.tag + "(" + this.rawTag + ")";
        }
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

var Relationship = exports.Relationship = function () {
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

    _createClass(Relationship, [{
        key: "equals",
        value: function equals(obj) {
            if (obj instanceof Relationship) return this.head === obj.head && this.relation === obj.relation && this.target === obj.target;else return false;
        }
    }, {
        key: "toString",
        value: function toString() {
            return "Rel:" + this.relation + " (ID:" + this.head + " \u2192 ID:" + this.target + ")";
        }
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

var Word = exports.Word = function () {
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

    _createClass(Word, [{
        key: "length",
        value: function length() {
            return this.morphemes.length;
        }
    }, {
        key: "get",
        value: function get(idx) {
            return this.morphemes[idx];
        }
    }, {
        key: "matches",
        value: function matches(tag) {
            //TODO fix bug in scala version
            if (Array.isArray(tag)) {
                var list = tag.reverse();
                for (var i = 0; i < this.morphemes.length; i++) {
                    if (list.length > 0 && this.morphemes[i].matches(list[list.length - 1])) list.pop();
                }
                return list.length == 0;
            } else return false;
        }
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
    }, {
        key: "exists",
        value: function exists(fn) {
            var found = this.find(fn);
            return typeof found !== "undefined";
        }
    }, {
        key: "equalsWithoutTag",
        value: function equalsWithoutTag(another) {
            if (another instanceof Word) {
                return another.surface === this.surface;
            } else return false;
        }
    }, {
        key: "equals",
        value: function equals(another) {
            if (another instanceof Word) {
                var isEqual = another.id === this.id && this.length() === another.length();
                for (var i = 0; i < this.length() && isEqual; i++) {
                    isEqual = this.get(i) === another.get(i);
                }
                return isEqual;
            } else return false;
        }
    }, {
        key: "toString",
        value: function toString() {
            var morphStr = this.morphemes.map(function (m) {
                return m.toString();
            }).join("");
            var buffer = this.surface + "\t= " + morphStr;
            if (this.dependents.length > 0) {
                buffer += "\n";
                buffer += this.dependents.map(function (r) {
                    return ".... \uC774 \uC5B4\uC808\uC758 " + r.tag + ": \uC5B4\uC808 [#" + r.target + "]";
                }).join("\n");
            }
            return buffer;
        }
    }, {
        key: "singleLineString",
        value: function singleLineString() {
            return this.morphemes.map(function (m) {
                return m.surface + "/" + m.tag;
            }).join("+");
        }
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

var Sentence = exports.Sentence = function () {
    function Sentence(words) {
        _classCallCheck(this, Sentence);

        assert(Array.isArray(words) && words[0] instanceof Word);

        this.words = words;
        this.root = new Word();
    }

    _createClass(Sentence, [{
        key: "matches",
        value: function matches(tag) {
            //TODO fix bug in scala version
            if (Array.isArray(tag)) {
                var list = tag.reverse();
                for (var i = 0; i < this.words.length; i++) {
                    if (list.length > 0 && this.words[i].matches(list[list.length - 1])) list.pop();
                }
                return list.length == 0;
            } else return false;
        }
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
    }, {
        key: "exists",
        value: function exists(fn) {
            var found = this.find(fn);
            return typeof found !== "undefined";
        }
    }, {
        key: "nouns",
        value: function nouns() {
            return this.words.filter(function (w) {
                return w.exists(POS.isNoun);
            });
        }
    }, {
        key: "verbs",
        value: function verbs() {
            return this.words.filter(function (w) {
                return w.exists(POS.isPredicate);
            });
        }
    }, {
        key: "modifiers",
        value: function modifiers() {
            return this.words.filter(function (w) {
                return w.exists(POS.isModifier);
            });
        }
    }, {
        key: "get",
        value: function get(idx) {
            return this.words[idx];
        }
    }, {
        key: "length",
        value: function length() {
            return this.words.length;
        }
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
    }, {
        key: "surfaceString",
        value: function surfaceString(delimiter) {
            delimiter = delimiter || " ";
            return this.words.map(function (w) {
                return w.surface;
            }).join(delimiter);
        }
    }, {
        key: "singleLineString",
        value: function singleLineString() {
            return this.words.map(function (w) {
                return w.singleLineString();
            }).join(" ");
        }
    }, {
        key: "toJson",
        value: function toJson() {
            return {
                words: this.words.map(function (m) {
                    return m.toJson();
                }),
                root: this.root.map(function (r) {
                    return r.toJson();
                })
            };
        }
    }]);

    return Sentence;
}();