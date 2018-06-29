var koalanlp = require('../lib/api');
var _ = require('lodash');
var API = koalanlp.API;

describe('Parser', function () {
    let parser1, parser2, tagger;

    before(function (done) {
        koalanlp.initialize({
            packages: [API.EUNJEON, API.KKMA],
            version: "1.9.2",
            debug: false
        }).catch(err => done(err))
            .then(() => done());
    });

    describe('#constructor()', function(){
        it('is initializable only with parser name', function(){
            (function(){
                parser1 = new koalanlp.Parser(API.KKMA);
            }).should.not.throw();
        })
        it('is initializable also with tagger name', function(){
            (function(){
                tagger = new koalanlp.Tagger(API.EUNJEON);
                parser2 = new koalanlp.Parser(API.KKMA, API.EUNJEON);
            }).should.not.throw();
        })
    });

    describe('#parseSentence(string)', function(){
        it('should throw exception', function(){
            return parser1.parseSentence("안녕하세요.")
                .then(res => {throw new Error(res)}, err => {true.should.be.true()})
        });

        it('handles paragraph as a single sentence', function(){
            return parser1.parseSentence("안녕하세요. 눈이 오는 설날 아침입니다.")
                .then(res => {throw new Error(res)}, err => {true.should.be.true()})
        });
    });

    describe('#parse(string)', function(){
        it('correctly parse a paragraph', function(){
            return parser1.parse("안녕하세요. 눈이 오는 설날 아침입니다.")
                .then(result => {
                    result.should.have.length(2);

                    result[0].length().should.equals(1);
                    result[0].surfaceString().should.equal("안녕하세요."); //KKMA
                    result[0].get(0).surface.should.equal("안녕하세요.");

                    result[1].length().should.equals(4);
                    result[1].root.dependents.should.not.be.empty();
                    result[1].root.dependents[0].target.should.be.equal(3);
                    result[1].surfaceString().should.equal("눈이 오는 설날 아침입니다."); //KKMA
                    result[1].get(0).surface.should.equal("눈이");
                    result[1].get(0).get(0).surface.should.equal("눈");
                    result[1].get(0).get(0).tag.should.equal("NNG");
                    result[1].get(0).get(0).rawTag.should.equal("NNG");
                    result[1].get(0).get(1).surface.should.equal("이");
                    result[1].get(0).get(1).rawTag.should.equal("JKS");
                    result[1].get(3).surface.should.equal("아침입니다.");
                    result[1].get(3).get(2).surface.should.equal("ㅂ니다"); //KKMA (받침아님)
                    result[1].get(3).get(2).tag.should.equal("EF");
                });
        });
    });

    describe('#parseSentence(Relay)', function(){
        it('correctly parse a sentence', function(){
            return parser2.parseSentence("안녕하세요.")
                .then(result => {
                    result.should.not.be.an.Array();

                    result.length().should.equals(2);
                    result.root.dependents.should.not.be.empty();
                    result.root.dependents[0].target.should.be.equal(0);
                    result.surfaceString().should.equal("안녕하세요 ."); //EUNJEON
                    result.get(0).surface.should.equal("안녕하세요");
                    result.get(0).length().should.equals(4);
                    result.get(0).get(0).surface.should.equal("안녕");
                });
        });

        it('handles paragraph as a single sentence', function(){
            return parser2.parseSentence("안녕하세요. 눈이 오는 설날 아침입니다.")
                .then(result => {
                    result.should.not.be.an.Array();
                    result.length().should.be.equal(7);
                    result.root.dependents.should.not.be.empty();
                    result.root.dependents[0].target.should.be.equal(1);
                });
        });

        it('must be same with the result of tagger-parser', function(){
            return tagger.tagSentence("안녕하세요. 눈이 오는 설날 아침입니다.")
                .then(tagged => {
                    parser1.parseSentence(tagged.reference)
                        .then(parsed1 => {
                            parser2.parseSentence("안녕하세요. 눈이 오는 설날 아침입니다.")
                                .then(parsed2 => {
                                    parsed1.should.be.deepEqual(parsed2);
                                })
                        })
                });
        });
    });

    describe('#parseSync(string)', function(){
        it('correctly parse a paragraph', function(){
            return parser1.parse("안녕하세요. 눈이 오는 설날 아침입니다.")
                .then(result => {
                    let result2 = parser1.parseSync("안녕하세요. 눈이 오는 설날 아침입니다.");
                    result[0].reference = null;
                    result[1].reference = null;
                    result2[0].reference = null;
                    result2[1].reference = null;

                    _.isEqual(result, result2).should.be.true()
                });
        });
    });

    describe('#parseSentenceSync(Relay)', function(){
        it('correctly parse a sentence', function(){
            return parser2.parseSentence("안녕하세요.")
                .then(result => {
                    let result2 = parser2.parseSentenceSync("안녕하세요.");
                    result.reference = null;
                    result2.reference = null;
                    _.isEqual(result, result2).should.be.true()
                });
        });

        it('handles paragraph as a single sentence', function(){
            return parser2.parseSentence("안녕하세요. 눈이 오는 설날 아침입니다.")
                .then(result => {
                    let result2 = parser2.parseSentenceSync("안녕하세요. 눈이 오는 설날 아침입니다.");
                    result.reference = null;
                    result2.reference = null;

                    _.isEqual(result, result2).should.be.true()
                });
        });
    });

    after(function(){
        return true;
    });
});