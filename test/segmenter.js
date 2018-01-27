var koalanlp = require('../lib/api');
var API = koalanlp.API;

describe('SentenceSplitter', function () {
    let tagger, segmenter;

    before(function (done) {
        koalanlp.initialize({
            packages: [API.TWITTER, API.EUNJEON],
            version: "1.9.2",
            debug: false
        }).catch(err => done(err))
            .then(() => done());
    });

    describe('#constructor()', function(){
        it('is initializable', function(){
            (function(){
                tagger = new koalanlp.Tagger(API.EUNJEON);
                segmenter = new koalanlp.SentenceSplitter(API.TWITTER);
            }).should.not.throw();
        })
    });

    describe('#sentences()', function(){
        it('correctly preserves a single sentence', function(){
            return segmenter.sentences("안녕하세요.")
                .then(result => {
                    result.should.have.length(1);
                    result[0].should.equal("안녕하세요.");
                });
        });

        it('correctly segments sentences', function(){
            return segmenter.sentences("안녕하세요. 눈이 오는 설날 아침입니다.")
                .then(result => {
                    result.should.have.length(2);
                    result[0].should.equal("안녕하세요.");
                    result[1].should.equal("눈이 오는 설날 아침입니다.");
                });
        });
    });

    describe('.sentences()', function(){
        it('correctly segments Sentence object', function(){
            return tagger.tagSentence("안녕하세요. 눈이 오는 설날 아침입니다.")
                .then(res => {
                    koalanlp.SentenceSplitter.sentences(res)
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
    });

    after(function(){
        return true;
    });
});