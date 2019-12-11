import {UTagger, Tagger} from '../src/proc';
import {UTAGGER} from '../src/API';
import _ from 'underscore';
import * as os from 'os';
import * as path from 'path';
import {compareSentence, EXAMPLES} from "./proc_common";


export default function () {
    describe('utagger Module', () => {
        let tagger;

        beforeAll(async() => {
            let utaggerPath = path.normalize(path.join(process.env['HOME'], 'utagger'));
            let binPath = path.join(utaggerPath, 'bin');
            let libPath = path.join(binPath, 'utagger-ubuntu1804.so');

            let configPath = path.join(utaggerPath, "Hlxcfg.txt");
            UTagger.setPath(libPath, configPath);

            tagger = new Tagger(UTAGGER);
        });

        afterAll(async() => {
            tagger = null;
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
                        compareSentence(sent, {'WSD': true});

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
    });
}
