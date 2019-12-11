import {EntityRecognizer, Parser, RoleLabeler, SentenceSplitter, Tagger} from '../src/proc';
import {ETRI, HNN, OKT} from '../src/API';
import _ from 'underscore';
import {compareSentence, EXAMPLES, snooze} from "./proc_common";


export default function () {
    describe('proc Module', () => {
        let splitter;
        let tagger;
        let parser;
        let entityRecog;
        let roleLabeler;

        beforeAll(async() => {
            splitter = new SentenceSplitter(OKT);
            tagger = new Tagger(OKT);
            parser = new Parser(HNN);
            entityRecog = new EntityRecognizer(ETRI, {etriKey: process.env['API_KEY']});
            roleLabeler = new RoleLabeler(ETRI, {etriKey: process.env['API_KEY']});
        });

        describe('SentenceSplitter', () => {
            it('can handle empty sentence', async() => {
                expect(await splitter('')).toHaveLength(0);
                expect(splitter.sentencesSync('')).toHaveLength(0);
            });

            it('can convert Java output correctly', async() => {
                for (const [dummy, line] of EXAMPLES) {
                    let res = await splitter(line);
                    expect(res).toBeInstanceOf(Array);
                    expect(res[0]).toEqual(expect.arrayContaining([]));

                    let resSync = splitter.sentencesSync(line);
                    expect(res).toEqual(resSync);

                    let res2 = await splitter([line]);
                    expect(res).toEqual(res2);

                    let resSync2 = splitter.sentencesSync([line]);
                    expect(res2).toEqual(resSync2);
                }
            });
        });

        describe('Tagger', () => {
            it('can handle empty sentence', async() => {
                expect(await tagger('')).toHaveLength(0);
                expect(tagger.tagSync('')).toHaveLength(0);
            });

            it('can convert Java output correctly', async() => {
                for (const [cnt, line] of EXAMPLES) {
                    process.stdout.write('.');
                    let para = await tagger(line);
                    expect(para).toBeInstanceOf(Array);
                    for (const sent of para)
                        compareSentence(sent);

                    let paraSync = tagger.tagSync(line);
                    expect(_.zip(para, paraSync).every((tuple) => tuple[0].equals(tuple[1]))).toBe(true);

                    let single = await tagger.tagSentence(line);
                    expect(single).toBeInstanceOf(Array);
                    expect(single).toHaveLength(1);

                    let singleSync = tagger.tagSentenceSync(line);
                    expect(_.zip(single, singleSync).every((tuple) => tuple[0].equals(tuple[1]))).toBe(true);

                    let singles = await tagger.tagSentence(para.map((x) => x.surfaceString()));
                    expect(para).toHaveLength(singles.length);

                    let singlesSync = tagger.tagSentenceSync(para.map((x) => x.surfaceString()));
                    expect(_.zip(singles, singlesSync).every((tuple) => tuple[0].equals(tuple[1]))).toBe(true);
                }
            });
        });

        describe('Parser', () => {
            it('can handle empty sentence', async() => {
                expect(await parser('')).toHaveLength(0);
                expect(parser.analyzeSync('')).toHaveLength(0);
            });

            it('can convert Java output correctly', async() => {
                for (const [cnt, line] of EXAMPLES) {
                    process.stdout.write('.');
                    let para = await parser(line);
                    expect(para).toBeInstanceOf(Array);
                    for (const sent of para)
                        compareSentence(sent, {SYN: true, DEP: true});

                    let paraSync = parser.analyzeSync(line);
                    expect(_.zip(para, paraSync).every((tuple) => tuple[0].equals(tuple[1]))).toBe(true);

                    let singles = await parser(...para.map((x) => x.surfaceString()));
                    expect(para).toHaveLength(singles.length);

                    let singlesSync = parser.analyzeSync(...para.map((x) => x.surfaceString()));
                    expect(_.zip(singles, singlesSync).every((tuple) => tuple[0].equals(tuple[1]))).toBe(true);
                }
            });

            it('can relay outputs', async() => {
                for (const [cnt, line] of EXAMPLES) {
                    process.stdout.write('.');
                    let splits = await splitter(line);
                    let tagged = await tagger.tagSentence(splits);
                    expect(tagged).toHaveLength(splits.length);

                    let taggedSync = tagger.tagSentenceSync(splits);
                    expect(_.zip(tagged, taggedSync).every((tuple) => tuple[0].equals(tuple[1]))).toBe(true);

                    let para = await parser(tagged);
                    expect(para).toHaveLength(tagged.length);

                    let paraSync = parser.analyzeSync(tagged);
                    expect(_.zip(para, paraSync).every((tuple) => tuple[0].equals(tuple[1]))).toBe(true);

                    expect(para).toBeInstanceOf(Array);
                    for (const sent of para)
                        compareSentence(sent, {SYN: true, DEP: true});
                }
            });
        });

        describe('RoleLabeler', () => {
            it('can handle empty sentence', async() => {
                expect(await roleLabeler('')).toHaveLength(0);
                expect(roleLabeler.analyzeSync('')).toHaveLength(0);
            });

            it('can convert Java output correctly', async() => {
                for (const [cnt, line] of _.sample(EXAMPLES, 5)) {
                    await snooze(_.random(5000, 10000));

                    let para = await roleLabeler(line);
                    expect(para).toBeInstanceOf(Array);
                    for (const sent of para)
                        compareSentence(sent, {SRL: true, DEP: true, NER: true, WSD: true});

                    let paraSync = roleLabeler.analyzeSync(line);
                    expect(_.zip(para, paraSync).every((tuple) => tuple[0].equals(tuple[1]))).toBe(true);

                    let singles = await roleLabeler(...para.map((x) => x.surfaceString()));
                    expect(para).toHaveLength(singles.length);

                    let singlesSync = roleLabeler.analyzeSync(...para.map((x) => x.surfaceString()));
                    expect(_.zip(singles, singlesSync).every((tuple) => tuple[0].equals(tuple[1]))).toBe(true);
                }
            });
        });

        describe('EntityRecognizer', () => {
            it('can handle empty sentence', async() => {
                expect(await entityRecog('')).toHaveLength(0);
            });

            it('can convert Java output correctly', async() => {
                for (const [cnt, line] of _.sample(EXAMPLES, 5)) {
                    await snooze(_.random(5000, 10000));

                    let para = await entityRecog(line);
                    expect(para).toBeInstanceOf(Array);
                    for (const sent of para)
                        compareSentence(sent, {NER: true, WSD: true});

                    let paraSync = entityRecog.analyzeSync(line);
                    expect(_.zip(para, paraSync).every((tuple) => tuple[0].equals(tuple[1]))).toBe(true);

                    let singles = await entityRecog(...para.map((x) => x.surfaceString()));
                    expect(para).toHaveLength(singles.length);

                    let singlesSync = entityRecog.analyzeSync(...para.map((x) => x.surfaceString()));
                    expect(_.zip(singles, singlesSync).every((tuple) => tuple[0].equals(tuple[1]))).toBe(true);
                }
            });
        });
    });
}