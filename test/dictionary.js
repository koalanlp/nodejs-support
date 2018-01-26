var koalanlp = require('../lib/api');
var API = koalanlp.API;
var POS = koalanlp.POS;

describe('Dictionary', function () {
    let dict1, dict2;

    before(function (done) {
        koalanlp.initialize({
            packages: [API.TWITTER, API.EUNJEON, API.KKMA],
            version: "1.9.2",
            debug: false
        }).catch(err => done(err))
            .then(() => done());
    });

    describe('#constructor()', function(){
        it('is initializable', function(){
            (function(){
                dict1 = new koalanlp.Dictionary(API.TWITTER);
                dict2 = new koalanlp.Dictionary(API.EUNJEON);
            }).should.not.throw();
        })
    });

    describe('#addUserDictionary(), #contains()', function () {
        it('appends a single item', function(){
            dict1.addUserDictionary("설빙", POS.NNP);
            return dict1.contains("설빙", POS.NNP).then(res => res.should.be.true());
        });

        it('appends list of items', function(){
            dict1.addUserDictionary(["설국열차", "안드로이드"], [POS.NNP, POS.NNP]);
            return dict1.contains("안드로이드", POS.NNP)
                .then(res => {
                    res.should.be.true();
                    dict1.contains("설국열차", POS.NNP).should.finally.be.true();
                });
        });
    });

    describe('#getNotExists()', function () {
        it('distinguishes non-exist items', function(){
            return dict2.getNotExists(true,
                {morph: "설빙", tag: POS.NNP},
                {morph: "일", tag:POS.NNG}
            ).then(res => res.should.have.length(1));
        });
    });

    describe('#baseEntriesOf()', function () {
        it('build an item generator', function () {
            return dict1.baseEntriesOf(POS.isNoun)
                .then(gen => {
                    gen.next().should.not.be.undefined();
                });
        });
    });

    describe('#importFrom()', function () {
        it('ends without error', function () {
            return dict2.importFrom(dict1, POS.isNoun, true);
        });
    });

    after(function(){
        return true;
    });
});
