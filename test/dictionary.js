import 'init';

import {KKMA, OKT} from '../src/API';
import {Dictionary} from '../src/proc';
import {POS} from '../src/types';

describe('Dictionary', () => {
    let dict1, dict2;

    beforeAll(async() => {
        dict1 = new Dictionary(KKMA);
        dict2 = new Dictionary(OKT);
    });

    describe('#addUserDictionary()', () => {
        it('correctly adds an entry', async () => {
            (() => dict1.addUserDictionary({surface: '설빙', tag: POS.NNP})).should.not.throw();
            dict1.contains('설빙', POS.NNP).should.be.true();

            (() => dict1.addUserDictionary({surface: "설국열차", tag: POS.NNP}, {
                surface: "안드로이드",
                tag: POS.NNP
            })).should.not.throw();

            dict1.contains("안드로이드", POS.NNP).should.be.true();
            dict1.contains("설국열차", POS.NNP).should.be.true();

            dict1.addUserDictionary({surface:"하동균", tag:POS.NNP});
            dict1.addUserDictionary({surface:"나비야", tag:POS.NNP});

            dict1.contains("하동균", POS.NNP, POS.NNG).should.be.true();
            (await dict1.getItems()).should.have.length(5);
        });
    });

    describe('#getNotExists()', () => {
        it('can filter only non-existing entries', async ()=>{
            let items = await dict2.getNotExists(true, {surface: '쓰국', tag: POS.NNP}, {surface:'일', tag: POS.NNG});
            items.should.have.length(1);
        })
    });

    describe('#getBaseEntries()', () => {
        it('can obtain entries correctly', async () => {
            let gen = await dict1.getBaseEntries((t) => t.isNoun());
            gen.next().done.should.be.false();

            let gen2 = await dict1.getBaseEntries((t) => t.isAffix());
            gen2.next().done.should.be.false();
            let gen2Array = [];
            for (const item of gen2)
                gen2Array.push(item);
            gen2Array.should.not.be.empty();

            let counter = 0;
            for(const entry of gen){
                counter += gen2Array.includes(entry);
            }
            counter.should.be.equal(0);
        });
    });

    describe('#importFrom()', () => {
        it('can import from other dict', async () =>{
            let itemSizePrev = (await dict2.getItems()).length;
            await dict2.importFrom(dict1, true, (t) => t.isNoun());
            itemSizePrev.should.be.lessThan((await dict2.getItems()).length);
        });
    });

    after(() => true);
});
