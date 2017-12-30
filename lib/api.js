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

var TYPES = exports.TYPES = require('./koalanlp/const').TYPES;

var Tagger = exports.Tagger = function () {
    function Tagger() {
        _classCallCheck(this, Tagger);

        if (conf.tagger == TYPES.KOMORAN) this.tagger = java.newInstanceSync("kr.bydelta.koala." + conf.tagger + ".Tagger", false);else this.tagger = java.newInstanceSync("kr.bydelta.koala." + conf.tagger + ".Tagger");
    }

    _createClass(Tagger, [{
        key: "tag",
        value: function tag(paragraph, callback) {
            if (callback) {
                this.tagger.tagPromise(paragraph).then(function (result) {
                    callback({ error: false, result: converter(result) });
                }, function (e) {
                    callback({ error: e });
                });
            } else {
                return converter(this.tagger.tagSync(paragraph));
            }
        }
    }, {
        key: "tagSentence",
        value: function tagSentence(sentence, callback) {
            if (callback) {
                this.tagger.tagSentencePromise(sentence).then(function (result) {
                    callback({ error: false, result: convertSentence(result) });
                }, function (e) {
                    callback({ error: e });
                });
            } else {
                return convertSentence(this.tagger.tagSentenceSync(sentence));
            }
        }
    }]);

    return Tagger;
}();

var Parser = exports.Parser = function () {
    function Parser() {
        _classCallCheck(this, Parser);

        this.tagger = java.newInstanceSync("kr.bydelta.koala." + conf.tagger + ".Tagger");
        this.parser = java.newInstanceSync("kr.bydelta.koala." + conf.parser + ".Parser");
    }

    _createClass(Parser, [{
        key: "parse",
        value: function parse(paragraph, callback) {
            if (callback) {
                this.tagger.tagPromise(paragraph).then(function (result) {
                    this.parser.parsePromise(result);
                }).then(function (result) {
                    callback({ error: false, result: converter(result) });
                }, function (e) {
                    callback({ error: e });
                });
            } else {
                var tagged = this.tagger.tagSync(paragraph);
                var parsed = this.parser.parseSync(tagged);
                return converter(parsed);
            }
        }
    }, {
        key: "parseSentence",
        value: function parseSentence(sentence, callback) {
            if (callback) {
                this.tagger.tagSentencePromise(sentence).then(function (result) {
                    this.parser.parsePromise(result);
                }).then(function (result) {
                    callback({ error: false, result: convertSentence(result) });
                }, function (e) {
                    callback({ error: e });
                });
            } else {
                var tagged = this.tagger.tagSentenceSync(sentence);
                var parsed = this.parser.parseSync(tagged);
                return convertSentence(parsed);
            }
        }
    }]);

    return Parser;
}();

var initialize = exports.initialize = function initialize(obj, callback) {
    conf.version = obj.version || "latest.integration";
    conf.tagger = obj.tagger || TYPES.KOMORAN;
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
            'relation': rel.relationSync().toStringSync(),
            'rawRel': rel.rawRelSync()
        };
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