import {Sentence, Word, Morpheme, SyntaxTree, DepEdge, RoleEdge, Entity, CoreferenceGroup} from '../src/data';
import {POS, CoarseEntityType, DependencyTag, PhraseTag, RoleType} from '../src/types';
import _ from 'underscore';

export default function () {
    let sent, sent2, sent3, sent4;
    beforeEach(() => {
        sent =
            new Sentence([
                new Word({
                    surface: "나는", morphemes: [
                        new Morpheme({surface: "나", tag: POS.NP, originalTag: "NP"}),
                        new Morpheme({surface: "는", tag: POS.JX, originalTag: "JX"})
                    ]
                }),
                new Word({
                    surface: "밥을", morphemes: [
                        new Morpheme({surface: "밥", tag: POS.NNG, originalTag: "NNG"}),
                        new Morpheme({surface: "을", tag: POS.JKO, originalTag: "JKO"})
                    ]
                })
            ]);

        sent2 =
            new Sentence([
                new Word({
                    surface: "흰", morphemes: [
                        new Morpheme({surface: "희", tag: POS.VA, originalTag: "VA"}),
                        new Morpheme({surface: "ㄴ", tag: POS.ETM, originalTag: "ETM"})
                    ]
                }),
                new Word({
                    surface: "밥을", morphemes: [
                        new Morpheme({surface: "밥", tag: POS.NNG, originalTag: "NNG"}),
                        new Morpheme({surface: "을", tag: POS.JKO, originalTag: "JKO"})
                    ]
                }),
                new Word({
                    surface: "나는", morphemes: [
                        new Morpheme({surface: "나", tag: POS.NP, originalTag: "NP"}),
                        new Morpheme({surface: "는", tag: POS.JX, originalTag: "JX"})
                    ]
                }),
                new Word({
                    surface: "먹었다", morphemes: [
                        new Morpheme({surface: "먹", tag: POS.VV, originalTag: "VV"}),
                        new Morpheme({surface: "었", tag: POS.EP, originalTag: "EP"}),
                        new Morpheme({surface: "다", tag: POS.EF, originalTag: "EF"})
                    ]
                })
            ]);

        sent3 =
            new Sentence([
                new Word({
                    surface: "흰", morphemes: [
                        new Morpheme({surface: "희", tag: POS.VA, originalTag: "VA"}),
                        new Morpheme({surface: "ㄴ", tag: POS.ETM, originalTag: "ETM"})
                    ]
                }),
                new Word({
                    surface: "밥을", morphemes: [
                        new Morpheme({surface: "밥", tag: POS.NNG, originalTag: "NNG"}),
                        new Morpheme({surface: "을", tag: POS.JKO, originalTag: "JKO"})
                    ]
                }),
                new Word({
                    surface: "나는", morphemes: [
                        new Morpheme({surface: "나", tag: POS.NP, originalTag: "NP"}),
                        new Morpheme({surface: "는", tag: POS.JX, originalTag: "JX"})
                    ]
                }),
                new Word({
                    surface: "먹었다", morphemes: [
                        new Morpheme({surface: "먹", tag: POS.VV, originalTag: "VV"}),
                        new Morpheme({surface: "었", tag: POS.EP, originalTag: "EP"}),
                        new Morpheme({surface: "다", tag: POS.EF, originalTag: "EF"})
                    ]
                })
            ]);

        sent4 =
            new Sentence([
                new Word({
                    surface: "칠한", morphemes: [
                        new Morpheme({surface: "칠", tag: POS.NNG, originalTag: "NN"}),
                        new Morpheme({surface: "하", tag: POS.XSV, originalTag: "XSV"}),
                        new Morpheme({surface: "ㄴ", tag: POS.ETM, originalTag: "ETM"})
                    ]
                }),
                new Word({
                    surface: "밥을", morphemes: [
                        new Morpheme({surface: "밥", tag: POS.NNG, originalTag: "NNG"}),
                        new Morpheme({surface: "을", tag: POS.JKO, originalTag: "JKO"})
                    ]
                }),
                new Word({
                    surface: "너는", morphemes: [
                        new Morpheme({surface: "너", tag: POS.NP, originalTag: "NP"}),
                        new Morpheme({surface: "는", tag: POS.JX, originalTag: "JX"})
                    ]
                }),
                new Word({
                    surface: "먹음", morphemes: [
                        new Morpheme({surface: "먹", tag: POS.VV, originalTag: "VV"}),
                        new Morpheme({surface: "음", tag: POS.ETN, originalTag: "ETN"})
                    ]
                })
            ]);
    });

    describe('Morpheme', () => {
        let dummy1, dummy2, unknown;

        beforeEach(() => {
            dummy1 = new Morpheme({surface: "밥", tag: POS.NNP, originalTag: "NNP"});
            dummy2 = new Morpheme({surface: "밥", tag: POS.NNG, originalTag: "ncn"});
            unknown = new Morpheme({surface: "??", tag: POS.NA});
        });

        // id, surface, tag, originalTag,
        it('should have correct ID', () => {
            expect(dummy1.id).toEqual(-1);
            expect(dummy2.id).toEqual(-1);

            // The ID can be set initially.
            expect(() => {
                dummy1.id = 5
            }).not.toThrowError();
            expect(dummy1.id).toEqual(5);

            // After initializing id, it cannot be modified.
            expect(() => {
                dummy1.id = 7
            }).toThrowError();
            expect(() => {
                sent[0][1].id = 8
            }).toThrowError();

            for (const word of sent2) {
                for (const index of _.range(word.length)) {
                    let morpheme = word[index];
                    expect(morpheme.id).toEqual(index);
                }
            }
        });

        it('should have correct surface', () => {
            expect(dummy1.surface).toEqual("밥");
            expect(dummy2.surface).toEqual("밥");
        });

        it('should have correct tag', () => {
            expect(dummy1.tag).toEqual(POS.NNP);
            expect(dummy2.tag).toEqual(POS.NNG);
        });

        it('should have correct original tag', () => {
            expect(dummy1.originalTag).toEqual("NNP");
            expect(dummy2.originalTag).toEqual("ncn");
        });

        // getWordSense, setProperty(T), setProperty(K, T),
        it('can save WordSense property', () => {
            expect(() => {
                dummy1.wordSense = 1;
            }).not.toThrowError();
            expect(() => {
                dummy2.wordSense = 2;
            }).not.toThrowError();

            expect(sent2[0][0].getWordSense()).toBeUndefined();
            expect(dummy1.getWordSense()).toEqual(1);
            expect(dummy2.getWordSense()).toEqual(2);
        });

        // isNoun, isPredicate, isModifier, isJosa,
        it('can check whether it is a noun', () => {
            expect(dummy1.isNoun()).toBe(true);
            expect(dummy2.isNoun()).toBe(true);
            expect(unknown.isNoun()).not.toBe(true);
        });

        it('can check whether it is a verb', () => {
            expect(dummy1.isPredicate()).not.toBe(true);
            expect(dummy2.isPredicate()).not.toBe(true);
            expect(unknown.isPredicate()).not.toBe(true);
        });

        it('can check whether it is a modifier', () => {
            expect(dummy1.isModifier()).not.toBe(true);
            expect(dummy2.isModifier()).not.toBe(true);
            expect(unknown.isModifier()).not.toBe(true);
        });

        it('can check whether it is a josa', () => {
            expect(dummy1.isJosa()).not.toBe(true);
            expect(dummy2.isJosa()).not.toBe(true);
            expect(unknown.isJosa()).not.toBe(true);
        });

        // hasTag, hasTagOneOf, hasOriginalTag,
        it('can verify whether it has a tag under the given category', () => {
            expect(dummy1.hasTag("N")).toBe(true);
            expect(dummy1.hasTag("V")).toBe(false);

            expect(unknown.hasTag("N")).toBe(false);
            expect(unknown.hasTag("NA")).toBe(true);
        });

        it('can verify whether it has a tag under one of given category', () => {
            expect(dummy1.hasTagOneOf("N", "V")).toBe(true);
            expect(dummy1.hasTagOneOf("V", "E")).toBe(false);

            expect(unknown.hasTagOneOf("NN", "NP")).toBe(false);
            expect(unknown.hasTagOneOf("NA", "NN")).toBe(true);
        });

        it('can verify whether its original tag was under the given category', () => {
            expect(dummy1.hasOriginalTag("NN")).toBe(true);
            expect(dummy1.hasOriginalTag("nn")).toBe(true);
            expect(dummy1.hasOriginalTag("nc")).toBe(false);

            expect(dummy2.hasOriginalTag("NC")).toBe(true);
            expect(dummy2.hasOriginalTag("nc")).toBe(true);
            expect(dummy2.hasOriginalTag("NN")).toBe(false);

            expect(unknown.hasOriginalTag("NA")).toBe(false);
        });

        // equals, equalsWithoutTag, hashcode,
        it('can discriminate each other', () => {
            // Reflexive
            expect(dummy1).toEqual(dummy1);
            expect(dummy1.equals(dummy1)).toBe(true);
            // Symmetry
            expect(dummy1.equals(dummy2)).not.toBe(true);
            expect(dummy2.equals(dummy1)).not.toBe(true);

            expect(dummy2.equals(sent2[1][0])).toBe(true);
            expect(sent2[1][0].equals(dummy2)).toBe(true);
            // Transitivity
            expect(dummy2.equals(sent[1][0])).toBe(true);
            expect(sent[1][0].equals(sent2[1][0])).toBe(true);

            expect(dummy1.equals(unknown)).not.toBe(true);
            expect(dummy1.equals(1)).not.toBe(true);
        });

        it('can verify whether they have the same surface', () => {
            expect(dummy1.equalsWithoutTag(dummy2)).toBe(true);
            expect(dummy2.equalsWithoutTag(unknown)).toBe(false);
        });

        // toString, component1, component2, toJSON
        it('should provide the correct string representation', () => {
            expect(dummy1.toString()).toEqual("밥/NNP(NNP)");
            expect(dummy2.toString()).toEqual("밥/NNG(ncn)");
            expect(unknown.toString()).toEqual("??/NA");
        });
    });

    describe('Word', () => {
        let dummy1, dummy2;

        beforeEach(() => {
            dummy1 = new Word({
                surface: "밥을", morphemes: [
                    new Morpheme({surface: "밥", tag: POS.NNG, originalTag: "NNG"}),
                    new Morpheme({surface: "을", tag: POS.JKO, originalTag: "JKO"})
                ]
            });

            dummy2 = new Word({
                surface: "밥을", morphemes: [
                    new Morpheme({surface: "밥", tag: POS.NNP}),
                    new Morpheme({surface: "을", tag: POS.NNP})
                ]
            });
        });

        // id, surface
        it('should have correct ID', () => {
            expect(dummy1.id).toEqual(-1);

            // The ID can be set initially.
            expect(() => {
                dummy1.id = 5
            }).not.toThrowError();
            expect(dummy1.id).toEqual(5);

            for (const index of _.range(sent2.length)) {
                let word = sent2[index];
                expect(word.id).toEqual(index);
            }
        });

        it('should have correct surface', () => {
            expect(dummy1.surface).toEqual("밥을");
            expect(sent[0].surface).toEqual("나는");
        });

        // [Inherited] List<Morpheme>
        it('can access its morphemes using []', () => {
            expect(dummy1[0].equals(new Morpheme({surface: "밥", tag: POS.NNG}))).toBe(true);
            expect(dummy1[1].equals(new Morpheme({surface: "을", tag: POS.JKO}))).toBe(true);
        });

        it('should find index of given morpheme', () => {
            expect(dummy1.indexOf(dummy1[0])).toEqual(0);
            expect(dummy1.indexOf(dummy1[1])).toEqual(1);

            expect(dummy1.indexOfValue(new Morpheme({surface: "밥", tag: POS.NNG}))).toEqual(0);
            expect(dummy1.indexOfValue(new Morpheme({surface: "을", tag: POS.JKO}))).toEqual(1);

            expect(dummy1.lastIndexOf(dummy1[0])).toEqual(0);
            expect(dummy1.lastIndexOf(dummy1[1])).toEqual(1);

            expect(dummy1.lastIndexOfValue(new Morpheme({surface: "밥", tag: POS.NNG}))).toEqual(0);
            expect(dummy1.lastIndexOfValue(new Morpheme({surface: "을", tag: POS.JKO}))).toEqual(1);

            expect(dummy1.includes(dummy1[0])).toBe(true);
            expect(dummy1.includes(new Morpheme({surface: "밥", tag: POS.NNP}))).toBe(false);
            expect(dummy1.includesValue(new Morpheme({surface: "밥", tag: POS.NNG}))).toBe(true);
            expect(dummy1.includesValue(new Morpheme({surface: "밥", tag: POS.NNP}))).toBe(false);
        });

        // setProperty, getEntity, getPhrase, getDependency, getRole
        it('should provide proper way to set a property', () => {
            expect(dummy1.getEntities().length).toBe(0);
            expect(dummy1.getPhrase()).toBeUndefined();
            expect(dummy1.getArgumentRoles().length).toBe(0);
            expect(dummy1.getPredicateRoles().length).toBe(0);
            expect(dummy1.getDependentEdges().length).toBe(0);
            expect(dummy1.getGovernorEdge()).toBeUndefined();

            // All these trees automatically set pointers on the words.
            new Entity({surface: "밥", label: CoarseEntityType.PS, fineLabel: "PS_OTHER", morphemes: [dummy1[0]]});
            new Entity({surface: "밥", label: CoarseEntityType.PS, fineLabel: "PS_SOME", morphemes: [dummy1[0]]});
            new Entity({surface: "밥", label: CoarseEntityType.PS, fineLabel: "PS_ANOTHER", morphemes: [dummy1[0]]});

            let tree = new SyntaxTree({label: PhraseTag.NP, terminal: dummy1});
            let dep = new DepEdge({
                governor: dummy1,
                dependent: dummy2,
                type: PhraseTag.NP,
                depType: DependencyTag.SBJ
            });
            let role = new RoleEdge({predicate: dummy1, argument: dummy2, label: RoleType.ARG0});

            expect(dummy1.getEntities().length).not.toEqual(0);
            expect(dummy1.getEntities().map((it) => it.fineLabel).includes("PS_OTHER")).toBe(true);
            expect(dummy1.getPhrase()).toEqual(tree);
            expect(dummy1.getArgumentRoles()[0]).toEqual(role);
            expect(dummy2.getPredicateRoles()[0]).toEqual(role);
            expect(dummy1.getDependentEdges()[0]).toEqual(dep);
            expect(dummy2.getGovernorEdge()).toEqual(dep);
        });

        // equals, hashcode, equalsWithoutTag
        it('can discriminate each other', () => {
            // Reflexive
            expect(dummy1.equals(dummy1)).toBe(true);
            // Symmetry
            expect(dummy1.equals(dummy2)).toBe(false);
            expect(dummy2.equals(dummy1)).toBe(false);

            expect(dummy1.equals(sent[1])).toBe(true);
            expect(sent[1].equals(dummy1)).toBe(true);

            expect(dummy1[0].getWord().equals(dummy1)).toBe(true);
            expect(dummy2[0].getWord().equals(dummy2)).toBe(true);

            expect(dummy1.equals(dummy1[0])).toBe(false);
            expect(sent.map((it) => it.equals(dummy1) ? 1 : 0).reduce((acc, x) => acc + x, 0)).toBe(1);
            expect(sent2.map((it) => it.equals(dummy1) ? 1 : 0).reduce((acc, x) => acc + x, 0)).toBe(1);

            expect(dummy1.equals(dummy1[0])).toBe(false);
        });

        it('can verify whether they have the same surface', () => {
            expect(dummy1.equalsWithoutTag(dummy2)).toBe(true);
            expect(dummy2.equalsWithoutTag(sent[0])).toBe(false);
        });

        // toString, singleLineString
        it('should provide the correct string representation', () => {
            expect(dummy1.toString()).toEqual("밥을 = 밥/NNG+을/JKO");
            expect(dummy2.toString()).toEqual("밥을 = 밥/NNP+을/NNP");
        });

        it('should provide proper string representing its morphemes', () => {
            expect(dummy1.singleLineString()).toEqual("밥/NNG+을/JKO");
            expect(dummy2.singleLineString()).toEqual("밥/NNP+을/NNP");
        });
    });

    describe('Sentence', () => {
        // [Inherited] List<Word>
        it('can access its morphemes using []', () => {
            expect(sent[0].surface).toEqual("나는");
            expect(sent[1].surface).toEqual("밥을");
        });

        it('should find index of given morpheme', () => {
            expect(sent.indexOf(sent[0])).toEqual(0);
            expect(sent.indexOf(sent[1])).toEqual(1);

            expect(sent2.indexOfValue(sent[0])).toEqual(2);
            expect(sent2.indexOfValue(sent[1])).toEqual(1);

            expect(sent.lastIndexOf(sent[0])).toEqual(0);
            expect(sent.lastIndexOf(sent[1])).toEqual(1);

            expect(sent2.lastIndexOfValue(sent[0])).toEqual(2);
            expect(sent2.lastIndexOfValue(sent[1])).toEqual(1);

            expect(sent.includes(sent[0])).toBe(true);
            expect(sent.includes(sent[1])).toBe(true);
            expect(sent.includesValue(sent2[0])).toBe(false);
            expect(sent.includesValue(sent2[1])).toBe(true);
        });

        // setProperty, getSyntaxTree, getDependencyTree, getRoleTree, getEntities
        it('should provide proper way to set a property', () => {
            expect(sent.getCorefGroups().length).toBe(0);
            expect(sent.getEntities().length).toBe(0);
            expect(sent.getSyntaxTree()).toBeUndefined();
            expect(sent.getDependencies().length).toBe(0);
            expect(sent.getRoles().length).toBe(0);

            // All these trees automatically set pointers on the words.
            sent.entities = [new Entity({
                surface: "나",
                label: CoarseEntityType.PS,
                fineLabel: "PS_OTHER",
                morphemes: [sent[0][0]]
            })];
            sent.corefGroups = [new CoreferenceGroup([sent.getEntities()[0]])];
            sent.syntaxTree = new SyntaxTree({
                label: PhraseTag.S, children: [
                    new SyntaxTree({label: PhraseTag.NP, terminal: sent[0]}),
                    new SyntaxTree({label: PhraseTag.NP, terminal: sent[1]})
                ]
            });
            sent.dependencies = [
                new DepEdge({dependent: sent[1], type: PhraseTag.S, depType: DependencyTag.ROOT}),
                new DepEdge({governor: sent[1], dependent: sent[0], type: PhraseTag.S, depType: DependencyTag.ROOT})
            ];
            sent.roles = [
                new RoleEdge({predicate: sent[1], argument: sent[0], label: RoleType.ARG0})
            ];

            expect(sent.getCorefGroups()[0][0]).toEqual(sent.getEntities()[0]);
            expect(sent.getEntities()[0].fineLabel).toEqual("PS_OTHER");
            expect(sent.getSyntaxTree().label).toEqual(PhraseTag.S);
            expect(sent.getDependencies()[0].depType).toEqual(DependencyTag.ROOT);
            expect(sent.getRoles()[0].label).toEqual(RoleType.ARG0);
        });

        // getNouns, getModifiers, getVerbs
        it('should provide proper list of nouns', () => {
            expect(sent2.getNouns()).toEqual(expect.arrayContaining(sent2.slice(1, 3)));
            expect(sent4.getNouns()).toEqual(expect.arrayContaining(sent4.slice(1, 4)));
        });

        it('should provide proper list of verbs', () => {
            expect(sent2.getVerbs()).toEqual(expect.arrayContaining([sent2[3]]));
            expect(sent4.getVerbs().length).toBe(0);
        });

        it('should provide proper list of modifiers', () => {
            expect(sent2.getModifiers()).toEqual(expect.arrayContaining([sent2[0]]));
            expect(sent4.getModifiers()).toEqual(expect.arrayContaining([sent4[0]]));
        });

        // toString, surfaceString, singleLineString
        it('should provide the correct string representation', () => {
            expect(sent.toString()).toEqual("나는 밥을");
            expect(sent2.toString()).toEqual("흰 밥을 나는 먹었다");

            expect(sent.toString()).toEqual(sent.surfaceString());
            expect(sent2.toString()).toEqual(sent2.surfaceString());

            expect(sent.surfaceString("/")).toEqual("나는/밥을");
            expect(sent2.surfaceString("/")).toEqual("흰/밥을/나는/먹었다");
        });

        it('should provide proper string representing its morphemes', () => {
            expect(sent.singleLineString()).toEqual("나/NP+는/JX 밥/NNG+을/JKO");
            expect(sent2.singleLineString()).toEqual("희/VA+ㄴ/ETM 밥/NNG+을/JKO 나/NP+는/JX 먹/VV+었/EP+다/EF");
        });

        // equal, hashcode
        it('can discriminate each other', () => {
            // Reflexive
            expect(sent2.equals(sent2)).toBe(true);
            // Symmetry
            expect(sent.equals(sent2)).toBe(false);
            expect(sent2.equals(sent4)).toBe(false);

            expect(sent2.equals(sent3)).toBe(true);
            expect(sent3.equals(sent2)).toBe(true);

            expect(sent.equals(sent[0])).toBe(false);
        });

        it('should build correct reference', () => {
            let reference = sent.reference;
            let byReference = new Sentence(reference);

            expect(byReference.equals(sent)).toBe(true);
        });
    });

    describe('SyntaxTree', () => {
        let dummy1, dummy2;

        beforeEach(() => {
            dummy1 = new SyntaxTree({
                label: PhraseTag.S,
                children: [
                    new SyntaxTree({
                        label: PhraseTag.NP, children: [
                            new SyntaxTree({label: PhraseTag.DP, terminal: sent2[0], originalLabel: "DP"}),
                            new SyntaxTree({label: PhraseTag.NP, terminal: sent2[1], originalLabel: "NP"})
                        ]
                    }),
                    new SyntaxTree({
                        label: PhraseTag.VP, children: [
                            new SyntaxTree({label: PhraseTag.NP, terminal: sent2[2]}),
                            new SyntaxTree({label: PhraseTag.VP, terminal: sent2[3]})
                        ]
                    })
                ]
            });

            dummy2 = new SyntaxTree({
                label: PhraseTag.S,
                children: [
                    new SyntaxTree({
                        label: PhraseTag.NP, children: [
                            new SyntaxTree({label: PhraseTag.DP, terminal: sent3[0], originalLabel: "dp"}),
                            new SyntaxTree({label: PhraseTag.NP, terminal: sent3[1], originalLabel: "np"})
                        ]
                    }),
                    new SyntaxTree({
                        label: PhraseTag.VP, children: [
                            new SyntaxTree({label: PhraseTag.NP, terminal: sent3[2]}),
                            new SyntaxTree({label: PhraseTag.VP, terminal: sent3[3]})
                        ]
                    })
                ]
            });
        });

        // getChildren, getParent, isRoot, hasNonTerminals, getTerminals
        it('should provide ways to access its children', () => {
            expect(dummy1[0].label).toEqual(PhraseTag.NP);
            expect(dummy1[1].label).toEqual(PhraseTag.VP);
            expect(dummy1[0][0].label).toEqual(PhraseTag.DP);

            expect(dummy1[0][0].originalLabel).toEqual("DP");
            expect(dummy1[0][1].originalLabel).toEqual("NP");
            expect(dummy2[0][0].originalLabel).toEqual("dp");
            expect(dummy2[0][1].originalLabel).toEqual("np");
            expect(dummy1[0].originalLabel).toBeUndefined();

            expect(dummy1[0].hasNonTerminals()).toBe(true);
            expect(dummy1[0][0].hasNonTerminals()).toBe(false);
        });

        it('should provide ways to access its parents', () => {
            expect(dummy1.isRoot()).toBe(true);
            expect(dummy1[0].isRoot()).toBe(false);
            expect(dummy1[0][0].isRoot()).toBe(false);

            expect(dummy1[0].getParent()).toEqual(dummy1);
            expect(dummy1[0][0].getParent()).toEqual(dummy1[0]);
            expect(dummy1[0][1].getParent()).toEqual(dummy1[0]);
        });

        it('provide ways to access terminal nodes, i.e. words', () => {
            expect(dummy1.getTerminals()).toEqual(expect.arrayContaining(sent2.toArray()));
            expect(dummy1[0].getTerminals()).toEqual(expect.arrayContaining(sent2.slice(0, 2)));
            expect(dummy1[1].getTerminals()).toEqual(expect.arrayContaining([sent2[2], sent2[3]]));
            expect(dummy1[0][0].getTerminals()).toEqual(expect.arrayContaining([sent2[0]]));
        });

        // equal, hashcode
        it('can discriminate each other', () => {
            // Reflexive
            expect(dummy1.equals(dummy1)).toBe(true);
            expect(dummy1.toArray()).toEqual(expect.arrayContaining(dummy1.getNonTerminals()));

            // Symmetry
            expect(dummy1.equals(dummy2)).toBe(true);
            expect(dummy2.equals(dummy1)).toBe(true);

            expect(dummy1.equals(dummy1[0])).toBe(false);
            expect(dummy1[0].equals(dummy1[1])).toBe(false);
            expect(dummy1.equals(sent2[0])).toBe(false);
        });

        // List<SyntaxTree>
        it('should find index of given tree', () => {
            expect(dummy1.indexOf(dummy1[0])).toEqual(0);
            expect(dummy1.indexOf(dummy1[1])).toEqual(1);

            expect(dummy1.indexOfValue(dummy2[0])).toEqual(0);
            expect(dummy1.indexOfValue(dummy2[1])).toEqual(1);

            expect(dummy1.lastIndexOf(dummy1[0])).toEqual(0);
            expect(dummy1.lastIndexOf(dummy1[1])).toEqual(1);

            expect(dummy1.lastIndexOfValue(dummy2[0])).toEqual(0);
            expect(dummy1.lastIndexOfValue(dummy2[1])).toEqual(1);

            expect(dummy1.includes(dummy1[0])).toBe(true);
            expect(dummy1.includes(dummy1[0][1])).toBe(false);
            expect(dummy1.includesValue(dummy2[0])).toBe(true);
            expect(dummy1.includesValue(dummy2[0][1])).toBe(false);
        });

        // toString, getTreeString
        it('should provide the correct string representation', () => {
            expect(dummy1.toString()).toEqual("S-Node()");
            expect(dummy1[0].toString()).toEqual("NP-Node()");
            expect(dummy1[0][0].toString()).toEqual("DP-Node(흰 = 희/VA+ㄴ/ETM)");
        });

        it('should provide tree representation', () => {
            expect(dummy1.getTreeString().toString()).toEqual(`
            >S-Node()
            >| NP-Node()
            >| | DP-Node(흰 = 희/VA+ㄴ/ETM)
            >| | NP-Node(밥을 = 밥/NNG+을/JKO)
            >| VP-Node()
            >| | NP-Node(나는 = 나/NP+는/JX)
            >| | VP-Node(먹었다 = 먹/VV+었/EP+다/EF)
            `.replace(/ +>/g, '').trim());

            expect(dummy1[0].getTreeString().toString()).toEqual(`
            >NP-Node()
            >| DP-Node(흰 = 희/VA+ㄴ/ETM)
            >| NP-Node(밥을 = 밥/NNG+을/JKO)
            `.replace(/ +>/g, '').trim());
        });

        // type, leaf
        it('should have correct information', () => {
            expect(dummy1.label).toEqual(PhraseTag.S);

            expect(dummy1.terminal).toEqual(undefined);
            expect(dummy1[0].terminal).toEqual(undefined);
            expect(dummy1[0][0].terminal).toEqual(sent2[0]);
        });

        it('should build correct reference', () => {
            sent2.syntaxTree = dummy1;
            let reference = sent2.reference;
            let byReference = new Sentence(reference);

            expect(byReference.getSyntaxTree().equals(sent2.getSyntaxTree())).toBe(true);
        });
    });

    describe('DepEdge', () => {
        let dummy1, dummy2, dummy3, dummy4, dummy5;
        beforeEach(() => {
            dummy1 = new DepEdge({
                governor: sent2[3],
                dependent: sent2[1],
                type: PhraseTag.NP,
                depType: DependencyTag.OBJ
            });
            dummy2 = new DepEdge({
                governor: sent3[3],
                dependent: sent3[1],
                type: PhraseTag.NP,
                depType: DependencyTag.OBJ,
                originalLabel: "NPobj"
            });
            dummy3 = new DepEdge({
                governor: sent3[3],
                dependent: sent3[2],
                type: PhraseTag.NP,
                depType: DependencyTag.SBJ
            });
            dummy4 = new DepEdge({governor: sent3[1], dependent: sent3[0], type: PhraseTag.DP});
            dummy5 = new DepEdge({dependent: sent3[3], type: PhraseTag.VP, depType: DependencyTag.ROOT});
        });

        // governor, dependent, type, depTag
        // label, src, dest
        it('should handle its property', () => {
            expect(dummy1.src).toEqual(sent2[3]);
            expect(dummy1.governor).toEqual(dummy1.src);

            expect(dummy1.dest).toEqual(sent2[1]);
            expect(dummy1.dependent).toEqual(dummy1.dest);

            expect(dummy1.type).toEqual(PhraseTag.NP);
            expect(dummy1.depType).toEqual(DependencyTag.OBJ);
            expect(dummy1.label).toEqual(DependencyTag.OBJ);

            expect(dummy1.originalLabel).toBeUndefined();
            expect(dummy2.originalLabel).toEqual("NPobj");
        });

        // toString
        it('should provide the correct string representation', () => {
            expect(dummy1.toString()).toEqual("NPOBJ('먹었다 = 먹/VV+었/EP+다/EF' → '밥을 = 밥/NNG+을/JKO')");
            expect(dummy3.toString()).toEqual("NPSBJ('먹었다 = 먹/VV+었/EP+다/EF' → '나는 = 나/NP+는/JX')");
            expect(dummy4.toString()).toEqual("DP('밥을 = 밥/NNG+을/JKO' → '흰 = 희/VA+ㄴ/ETM')");
            expect(dummy5.toString()).toEqual("VPROOT('ROOT' → '먹었다 = 먹/VV+었/EP+다/EF')");
        });

        // equal, hashcode
        it('can discriminate each other', () => {
            // Reflexive
            expect(dummy1.equals(dummy1)).toBe(true);

            // Symmetry
            expect(dummy1.equals(dummy2)).toBe(true);
            expect(dummy2.equals(dummy1)).toBe(true);

            expect(dummy1.equals(dummy3)).toBe(false);
            expect(dummy1.equals(dummy4)).toBe(false);
            expect(dummy1.equals(dummy1.src)).toBe(false);
        });

        it('should build correct reference', () => {
            sent2.dependencies = [dummy1];
            let reference = sent2.reference;
            expect(reference.getDependencies().size()).toBeGreaterThan(0);

            let byReference = new Sentence(reference);

            expect(_.zip(sent2.getDependencies(), byReference.getDependencies()).every((tuple) => tuple[0].equals(tuple[1]))).toBe(true);
        });
    });

    describe('RoleEdge', () => {
        let dummy1, dummy2, dummy3, dummy4;
        beforeEach(() => {
            dummy1 = new RoleEdge({
                predicate: sent2[3],
                argument: sent2[1],
                label: RoleType.ARG1,
                modifiers: [sent2[0]]
            });
            dummy2 = new RoleEdge({
                predicate: sent3[3],
                argument: sent3[1],
                label: RoleType.ARG1,
                originalLabel: "ARG-1"
            });
            dummy3 = new RoleEdge({predicate: sent3[3], argument: sent3[2], label: RoleType.ARG0});
            dummy4 = new RoleEdge({predicate: sent3[1], argument: sent3[0], label: RoleType.ARGM_PRD});
        });

        // predicate, argument, label
        // label, src, dest
        it('should handle its property', () => {
            expect(dummy1.src).toEqual(sent2[3]);
            expect(dummy1.predicate).toEqual(dummy1.src);

            expect(dummy1.dest).toEqual(sent2[1]);
            expect(dummy1.argument).toEqual(dummy1.dest);

            expect(dummy1.label).toEqual(RoleType.ARG1);

            expect(dummy1.modifiers[0]).toEqual(sent2[0]);

            expect(dummy1.originalLabel).toBeUndefined();
            expect(dummy2.originalLabel).toEqual("ARG-1");
        });

        // toString
        it('should provide the correct string representation', () => {
            expect(dummy1.toString()).toEqual("ARG1('먹었다' → '밥을/흰')");
            expect(dummy3.toString()).toEqual("ARG0('먹었다' → '나는/')");
            expect(dummy4.toString()).toEqual("ARGM_PRD('밥을' → '흰/')");
        });

        // equal, hashcode
        it('can discriminate each other', () => {
            // Reflexive
            expect(dummy1.equals(dummy1)).toBe(true);

            // Symmetry
            expect(dummy1.equals(dummy2)).toBe(true);
            expect(dummy2.equals(dummy1)).toBe(true);

            expect(dummy1.equals(dummy3)).toBe(false);
            expect(dummy1.equals(dummy4)).toBe(false);
            expect(dummy1.equals(dummy1.src)).toBe(false);
        });

        it('should build correct reference', () => {
            sent2.roles = [dummy1];
            let reference = sent2.reference;
            let byReference = new Sentence(reference);

            expect(_.zip(sent2.getRoles(), byReference.getRoles()).every((tuple) => tuple[0].equals(tuple[1]))).toBe(true);
        });
    });

    describe('Entity', () => {
        let dummy1, dummy2, dummy3, dummy4;
        beforeEach(() => {
            dummy1 = new Entity({
                surface: "나",
                label: CoarseEntityType.PS,
                fineLabel: "PS_OTHER",
                morphemes: [sent3[2][0]]
            });
            dummy2 = new Entity({
                surface: "나",
                label: CoarseEntityType.PS,
                fineLabel: "PS_OTHER",
                morphemes: [sent3[2][0]]
            });
            dummy3 = new Entity({
                surface: "나",
                label: CoarseEntityType.PS,
                fineLabel: "PS_DIFF",
                morphemes: [sent3[2][0]]
            });
            dummy4 = new Entity({
                surface: "흰 밥",
                label: CoarseEntityType.PS,
                fineLabel: "PS_OTHER",
                morphemes: [].concat(sent3[0].toArray(), sent3[1].toArray())
            });
        });

        //type, fineType
        //words
        //surface
        it('has correct property', () => {
            expect(dummy1.label).toEqual(CoarseEntityType.PS);
            expect(dummy1.fineLabel).toEqual("PS_OTHER");
            expect(dummy1[0]).toEqual(sent3[2][0]);

            expect(dummy1.surface).toEqual("나");
            expect(dummy4.surface).toEqual("흰 밥");

            expect(dummy1.includes(sent3[2][0])).toBe(true);
            expect(dummy1.includes(sent3[1][0])).toBe(false);

            expect(dummy1.getCorefGroup()).toBeUndefined();
        });

        // equal, hashcode
        it('can discriminate each other', () => {
            // Reflexive
            expect(dummy1.equals(dummy1)).toBe(true);

            // Symmetry
            expect(dummy1.equals(dummy2)).toBe(true);
            expect(dummy2.equals(dummy1)).toBe(true);

            expect(dummy1.equals(dummy3)).toBe(false);
            expect(dummy1.equals(dummy4)).toBe(false);
            expect(dummy1.equals(dummy1[0])).toBe(false);
        });

        it('should build correct reference', () => {
            sent3.entities = [dummy1, dummy2, dummy3, dummy4];
            let reference = sent3.reference;
            let byReference = new Sentence(reference);

            expect(_.zip(sent3.getEntities(), byReference.getEntities()).every((tuple) => tuple[0].equals(tuple[1]))).toBe(true);
        });
    });

    describe('CorefrerenceGroup', () => {
        let dummy1, dummy2, dummy3, dummy4;
        beforeEach(() => {
            dummy1 = new CoreferenceGroup([new Entity({
                surface: "나",
                label: CoarseEntityType.PS,
                fineLabel: "PS_OTHER",
                morphemes: [sent3[2][0]]
            })]);
            dummy2 = new CoreferenceGroup([new Entity({
                surface: "나",
                label: CoarseEntityType.PS,
                fineLabel: "PS_OTHER",
                morphemes: [sent3[2][0]]
            })]);
            dummy3 = new CoreferenceGroup([new Entity({
                surface: "나",
                label: CoarseEntityType.PS,
                fineLabel: "PS_DIFF",
                morphemes: [sent3[2][0]]
            })]);
            dummy4 = new CoreferenceGroup([new Entity({
                surface: "흰 밥",
                label: CoarseEntityType.PS,
                fineLabel: "PS_OTHER",
                morphemes: [].concat(sent3[0].toArray(), sent3[1].toArray())
            })]);
        });

        it('should inherit list', () => {
            expect(dummy1.includes(dummy1[0])).toBe(true);
            expect(dummy1.includes(dummy3[0])).toBe(false);
            expect(dummy1.indexOf(dummy1[0])).toEqual(0);
            expect(dummy1.lastIndexOf(dummy1[0])).toEqual(0);
        });

        // equal, hashcode
        it('can discriminate each other', () => {
            // Reflexive
            expect(dummy1.equals(dummy1)).toBe(true);

            // Symmetry
            expect(dummy1.equals(dummy2)).toBe(true);
            expect(dummy2.equals(dummy1)).toBe(true);

            expect(dummy1.equals(dummy3)).toBe(false);
            expect(dummy1.equals(dummy4)).toBe(false);
            expect(dummy1.equals(dummy1[0])).toBe(false);

            expect(dummy1[0].getCorefGroup().equals(dummy1)).toBe(true);
            expect(dummy1[0].getCorefGroup().equals(dummy2)).toBe(true);
        });

        it('should build correct reference', () => {
            sent3.entities = [dummy1[0], dummy3[0], dummy4[0]];
            sent3.corefGroups = [dummy1, dummy3, dummy4];
            let reference = sent3.reference;
            let byReference = new Sentence(reference);

            expect(_.zip(sent3.getCorefGroups(), byReference.getCorefGroups()).every((tuple) => tuple[0].equals(tuple[1]))).toBe(true);
        });
    });
}
