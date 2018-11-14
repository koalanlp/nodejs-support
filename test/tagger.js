var koalanlp = require('../lib/api');
var _ = require('lodash');
var API = koalanlp.API;

describe('Tagger', function () {
    let tagger;

    before(function (done) {
        koalanlp.initialize({
            packages: [API.EUNJEON],
            version: "1.9.4",
            debug: false
        }).then(() => done());
    });

    describe('#constructor()', function(){
        it('is initializable', function(){
            (function(){
                tagger = new koalanlp.Tagger(API.EUNJEON);
            }).should.not.throw();
        })
    });

    describe('#tagSentence()', function(){
        it('correctly tag a sentence', function(){
            return tagger.tagSentence("안녕하세요.")
                .then(result => {
                    result.should.not.be.an.Array();

                    result.length().should.equals(2);
                    result.surfaceString().should.equal("안녕하세요 .");
                    result.get(0).surface.should.equal("안녕하세요");
                    result.get(0).length().should.equals(4);
                    result.get(0).get(0).surface.should.equal("안녕");
                });
        });

        it('handles paragraph as a single sentence', function(){
            return tagger.tagSentence("안녕하세요. 눈이 오는 설날 아침입니다.")
                .then(result => {
                    result.should.not.be.an.Array();
                    result.length().should.be.equal(7);
                });
        });
    });

    describe('#tag()', function(){
        it('correctly tag a paragraph', function(){
            return tagger.tag("안녕하세요. 눈이 오는 설날 아침입니다.")
                .then(result => {
                    result.should.have.length(2);

                    result[0].length().should.equals(2);
                    result[0].surfaceString().should.equal("안녕하세요 .");
                    result[0].get(0).surface.should.equal("안녕하세요");

                    result[1].length().should.equals(5);
                    result[1].surfaceString().should.equal("눈이 오는 설날 아침입니다 .");
                    result[1].get(0).surface.should.equal("눈이");
                    result[1].get(0).get(0).surface.should.equal("눈");
                    result[1].get(0).get(0).tag.should.equal("NNG");
                    result[1].get(0).get(0).rawTag.should.equal("NNG");
                    result[1].get(0).get(1).surface.should.equal("이");
                    result[1].get(0).get(1).rawTag.should.equal("JKS");
                    result[1].get(3).surface.should.equal("아침입니다");
                    result[1].get(3).get(2).surface.should.equal("ᄇ니다");
                    result[1].get(3).get(2).tag.should.equal("EF");
                });
        });
    });

    describe('#tagSentenceSync()', function(){
        it('correctly tag a sentence', function(){
            return tagger.tagSentence("안녕하세요.")
                .then(result => {
                    let result2 = tagger.tagSentenceSync("안녕하세요.");
                    result.reference = null;
                    result2.reference = null;

                    _.isEqual(result, result2).should.be.true();
                });
        });

        it('handles paragraph as a single sentence', function(){
            return tagger.tagSentence("안녕하세요. 눈이 오는 설날 아침입니다.")
                .then(result => {
                    let result2 = tagger.tagSentenceSync("안녕하세요. 눈이 오는 설날 아침입니다.");
                    result.reference = null;
                    result2.reference = null;

                    _.isEqual(result, result2).should.be.true();
                });
        });
    });

    describe('#tagSync()', function(){
        it('correctly tag a paragraph', function(){
            return tagger.tag("안녕하세요. 눈이 오는 설날 아침입니다.")
                .then(result => {
                    let result2 = tagger.tagSync("안녕하세요. 눈이 오는 설날 아침입니다.");
                    result[0].reference = null;
                    result2[0].reference = null;
                    result[1].reference = null;
                    result2[1].reference = null;

                    _.isEqual(result, result2).should.be.true();
                });
        });
    });

    after(function(){
        return true;
    });
});