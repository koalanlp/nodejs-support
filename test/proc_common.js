import {DepEdge, Entity, Morpheme, RoleEdge, Sentence, SyntaxTree, Word} from "../src/data";
import _ from "underscore";
import {POS} from "../src/types";
import {getOrUndefined} from "../src/common";

export let EXAMPLES =
    `01 1+1은 2이고, 3*3은 9이다.
01 RHINO는 말줄임표를... 확인해야함... ^^ 이것도 확인해야.
03 식사함은 식사에서부터인지 식사에서부터이었는지 살펴봄. 보기에는 살펴봄이 아리랑을 위한 시험임을 지나쳤음에. 사랑하였음은 사랑해봄은 보고싶기에 써보기에 써보았기에.
03 먹음이니. 먹음이었으니. 사면되어보았기에.
01 a/b는 분수이다.
01 | 기호는 분리기호이다.
02 ▶ 오늘의 날씨입니다. ◆ 기온 23도는 낮부터임.
01 【그】가 졸음이다. 사랑스러웠기에.
01 [Dr.브레인 - 마루투자자문 조인갑 대표]
01 [결 마감특징주 - 유진투자증권 갤러리아지점 나현진 대리]
01 진경복 한기대 산학협력단장은 "이번 협약 체결로 우수한 현장 기능 인력에 대한 대기업-중소기업간 수급 불균형 문제와 중소·중견기업들에 대한 취업 기피 현상을 해결할 것"이라며 "특성화 및 마이스터고 학생들을 대학에 진학시켜 자기계발 기회를 제공하는 국내 최초의 상생협력 모델이라는 점에 의미가 있다"고 강조했다.
01 [결 마감특징주 - 신한금융투자 명품PB강남센터 남경표 대리]
01 [Dr.브레인 - 마루투자자문 조인갑 대표]
01 '플라이 아웃'은 타자가 친 공이 땅에 닿기 전에 상대팀 야수(투수와 포수를 제외한 야수들-1·2·3루수, 좌익수, 중견수, 우익수, 유격수)가 잡는 것, '삼진 아웃'은 스트라이크가 세 개가 되어 아웃되는 것을 말한다.
01 대선 출마를 선언한 민주통합당 손학규 상임고문이 5일 오후 서울 세종문화회관 세종홀에서 열린 '저녁이 있는 삶-손학규의 민생경제론'출판기념회에서 행사장으로 들어서며 손을 들어 인사하고 있다.2012.7.5/뉴스1

# Example 1: JTBC, 2017.04.22
03 북한이 도발을 멈추지 않으면 미국이 북핵 시설을 타격해도 군사개입을 하지 않겠다. 중국 관영 환구시보가 밝힌 내용인데요. 중국이 여태껏 제시한 북한에 대한 압박 수단 가운데 가장 이례적이고, 수위가 높은 것으로 보입니다.
01 이한주 기자입니다.
02 중국 관영매체 환구시보가 북핵문제에 대해 제시한 중국의 마지노선입니다. 북핵 억제를 위해 외교적 노력이 우선해야 하지만 북한이 도발을 지속하면 핵시설 타격은 용인할 수 있다는 뜻을 내비친 겁니다.
02 그러나 한국과 미국이 38선을 넘어 북한 정권 전복에 나서면 중국이 즉각 군사개입에 나서야 한다는 점을 분명히 하였습니다. 북한에 대한 압박수위도 한층 높였습니다.
02 핵실험을 강행하면 트럼프 대통령이 북한의 생명줄로 지칭한 중국의 원유공급을 대폭 축소할 거라고 경고하였습니다. 축소 규모에 대해서도 '인도주의적 재앙이 일어나지 않는 수준'이라는 기준까지 제시하며 안보리 결정을 따르겠다고 못 박았습니다.
02 중국 관영매체가 그동안 북한에 자제를 요구한 적은 있지만, 군사지원 의무제공 포기 가능성과 함께 유엔 안보리 제재안을 먼저 제시한 것은 이례적입니다. 미·중 빅딜에 따른 대북압박 공조 가능성이 제기되는 가운데 북한이 어떤 반응을 보일지 관심이 쏠립니다.

# Example 3. 허핑턴포스트, 17.04.22
01 박근혜 전 대통령이 거주하던 서울 삼성동 자택은 홍성열 마리오아울렛 회장(63)이 67억5000만원에 매입한 것으로 확인되었다.
01 홍 회장은 21일 뉴스1과의 통화에서 "값이 싸게 나오고 위치가 좋아서 삼성동 자택을 사게 되었다"고 밝혔다.
01 홍 회장은 "제가 강남에 집이나 땅이 하나도 없어서 알아보던 중에 부동산에 아는 사람을 통해서 삼성동 자택이 매물로 나온 걸 알게 되었다"며 "처음에는 조금 부담되었지만 집사람도 크게 문제가 없다고 해서 매입하였다"고 말하였다.
01 이어 "조만간 이사를 할 생각이지만 난방이나 이런게 다 망가졌다기에 보고나서 이사를 하려한다"며 "집부터 먼저 봐야될 것 같다"고 하였다.
01 홍 회장은 한때 자택 앞에서 박 전 대통령 지지자들의 집회로 주민들이 큰 불편을 겪었던 것과 관련 "주인이 바뀌면 그런 일을 할 이유가 없을 것이라 생각한다"고 밝혔다.
01 박 전 대통령과의 인연 등에 대해선 "정치에 전혀 관심이 없고 그런(인연) 건 전혀 없다"며 "박 전 대통령 측이나 친박계 의원 측과의 접촉도 전혀 없었다"고 전하였다.
01 홍 회장은 일부 언론보도로 알려진 박지만 EG회장과의 친분설도 "사실과 다르다"며 "박 전 대통령 사돈의 팔촌과도 인연이 없다"고 거듭 강조하였다.
02 홍 회장에 따르면 자택 매입가는 67억5000만원이다. 홍 회장은 주택을 매입하면서 2억3600만원의 취득세를 납부하였다고 밝혔다.
01 홍 회장은 1980년 마리오상사를 설립한 뒤 2001년 마리오아울렛을 오픈하며 의류 판매업 등으로 국내 최대급 아울렛으로 성장시켰다.
01 한편 박 전 대통령은 최근 삼성동 자택을 매각하고 내곡동에 새 집을 장만한 것으로 확인되었으며 이달 중 내곡동으로 이삿짐을 옮길 것으로 알려졌다.`
        .trim().split('\n').filter((line) => line.length > 0 && !line.startsWith('#')).map((line) => {
        line = line.trim();
        return [parseInt(line.substring(0, 2)), line.substring(3)];
    });

function isDefined(obj) {
    return typeof obj !== 'undefined' && obj !== null;
}

function isUndefined(obj) {
    return typeof obj === 'undefined';
}

function compareMorphemes(jsmorph, opts) {
    expect(jsmorph).toBeInstanceOf(Morpheme);
    expect(jsmorph.getId()).toBe(jsmorph.reference.getId());
    expect(jsmorph.getTag().tagname).toBe(jsmorph.reference.getTag().name());
    expect(jsmorph.getOriginalTag()).toBe(jsmorph.reference.getOriginalTag());
    expect(jsmorph.getSurface()).toBe(jsmorph.reference.getSurface());
    expect(jsmorph.getWord().reference.equals(jsmorph.reference.getWord())).toBe(true);

    expect(jsmorph.getId()).toBe(jsmorph.id);
    expect(jsmorph.getTag()).toBe(jsmorph.tag);
    expect(jsmorph.getOriginalTag()).toBe(jsmorph.originalTag);
    expect(jsmorph.getSurface()).toBe(jsmorph.surface);
    expect(jsmorph.getWord()).toBe(jsmorph.word);
    expect(jsmorph.getWord().equals(jsmorph.word)).toBe(true);

    if (opts.NER && isDefined(jsmorph.reference.getEntities())) {
        let jsents = jsmorph.getEntities().map((e) => e.reference);
        let jents = jsmorph.reference.getEntities();
        expect(jsents.every((e) => jents.contains(e))).toBe(true);
    } else {
        expect(jsmorph.getEntities()).toHaveLength(0);
    }

    expect(jsmorph.getEntities()).toEqual(jsmorph.entities);

    if (opts.WSD) {
        expect(jsmorph.getWordSense()).toBe(getOrUndefined(jsmorph.reference.getWordSense()));
        expect(jsmorph.getWordSense()).toBe(getOrUndefined(jsmorph.wordSense));
    } else {
        expect(isUndefined(jsmorph.getWordSense())).toBe(true);
        expect(isUndefined(jsmorph.wordSense)).toBe(true);
    }

    expect(jsmorph.isJosa()).toBe(jsmorph.reference.isJosa());
    expect(jsmorph.isModifier()).toBe(jsmorph.reference.isModifier());
    expect(jsmorph.isNoun()).toBe(jsmorph.reference.isNoun());
    expect(jsmorph.isPredicate()).toBe(jsmorph.reference.isPredicate());

    expect(
        POS.values().every((tag) => jsmorph.hasTag(tag.tagname) === jsmorph.reference.hasTag(tag.tagname))
    ).toBe(true);

    let sampled = _.sample(POS.values(), 3).map((x) => x.tagname);
    expect(jsmorph.hasTagOneOf(...sampled)).toBe(jsmorph.reference.hasTagOneOf(...sampled));

    expect(jsmorph.toString()).toBe(jsmorph.reference.toString());
}

function compareWords(jsword, opts) {
    expect(jsword).toBeInstanceOf(Word);

    for (const morph of jsword) {
        expect(jsword.reference.contains(morph.reference)).toBe(true);
        compareMorphemes(morph, opts);
    }

    expect(jsword.getSurface()).toBe(jsword.reference.getSurface());
    expect(jsword.getId()).toBe(jsword.reference.getId());
    expect(jsword.singleLineString()).toBe(jsword.reference.singleLineString());

    expect(jsword.getSurface()).toBe(jsword.surface);
    expect(jsword.getId()).toBe(jsword.id);

    if (opts.NER && isDefined(jsword.reference.getEntities())) {
        let jsents = jsword.getEntities().map((e) => e.reference);
        let jents = jsword.reference.getEntities();
        expect(jsents.every((e) => jents.contains(e))).toBe(true);
    } else {
        expect(jsword.getEntities()).toHaveLength(0);
    }

    expect(jsword.getEntities()).toEqual(jsword.entities);

    if (opts.SRL) {
        if (isDefined(jsword.reference.getPredicateRoles())) {
            let jsents = jsword.getPredicateRoles().map((e) => e.reference);
            let jents = jsword.reference.getPredicateRoles();
            expect(jsents.every((e) => jents.contains(e))).toBe(true);
        }

        if (isDefined(jsword.reference.getArgumentRoles())) {
            let jsents = jsword.getArgumentRoles().map((e) => e.reference);
            let jents = jsword.reference.getArgumentRoles();
            expect(jsents.every((e) => jents.contains(e))).toBe(true);
        }
    } else {
        expect(jsword.getPredicateRoles()).toHaveLength(0);
        expect(jsword.getArgumentRoles()).toHaveLength(0);
    }

    expect(jsword.getPredicateRoles()).toEqual(jsword.predicateRoles);
    expect(jsword.getArgumentRoles()).toEqual(jsword.argumentRoles);

    if (opts.DEP) {
        if (isDefined(jsword.reference.getGovernorEdge())) {
            expect(
                jsword.getGovernorEdge().reference.equals(jsword.reference.getGovernorEdge())
            ).toBe(true);
            expect(jsword.getGovernorEdge()).toBe(jsword.governorEdge);
        }

        if (isDefined(jsword.reference.getDependentEdges())) {
            let jsents = jsword.getDependentEdges().map((e) => e.reference);
            let jents = jsword.reference.getDependentEdges();
            expect(jsents.every((e) => jents.contains(e))).toBe(true);
        }
    } else {
        expect(isUndefined(jsword.getGovernorEdge())).toBe(true);
        expect(jsword.getDependentEdges()).toHaveLength(0);
    }

    expect(jsword.getDependentEdges()).toEqual(jsword.dependentEdges);

    if (opts.SYN) {
        expect(jsword.getPhrase().reference.equals(jsword.reference.getPhrase())).toBe(true);
        expect(jsword.getPhrase()).toEqual(jsword.phrase);
    } else {
        expect(isUndefined(jsword.getPhrase())).toBe(true);
        expect(isUndefined(jsword.phrase)).toBe(true);
    }

    expect(jsword.toString()).toBe(jsword.reference.toString());
}

function comparePhrase(jstree) {
    expect(jstree).toBeInstanceOf(SyntaxTree);
    expect(jstree.getLabel().tagname).toBe(jstree.reference.getLabel().name());
    expect(jstree.hasNonTerminals()).toBe(jstree.reference.hasNonTerminals());
    expect(jstree.isRoot()).toBe(jstree.reference.isRoot());
    expect(jstree.getOriginalLabel()).toBe(jstree.reference.getOriginalLabel());
    expect(jstree.getTreeString()).toBe(jstree.reference.getTreeString().toString());

    expect(jstree.getLabel()).toBe(jstree.label);
    expect(jstree.getOriginalLabel()).toBe(jstree.originalLabel);

    let jsterms = jstree.getTerminals().map((t) => t.reference);
    let jterms = jstree.reference.getTerminals();
    expect(jsterms.every((e) => jterms.contains(e))).toBe(true);

    let jsnterms = jstree.getNonTerminals().map((t) => t.reference);
    let jnterms = jstree.reference.getNonTerminals();
    expect(jsnterms.every((e) => jnterms.contains(e))).toBe(true);

    if (!jstree.reference.isRoot()) {
        expect(jstree.getParent().reference.equals(jstree.reference.getParent())).toBe(true);
        expect(jstree.getParent()).toEqual(jstree.parent);
    } else {
        expect(isUndefined(jstree.getParent())).toBe(true);
        expect(isUndefined(jstree.parent)).toBe(true);
    }

    for (const nonterm of jstree) {
        expect(jstree.reference.contains(nonterm.reference)).toBe(true);
        comparePhrase(nonterm);
    }

    expect(jstree.toString()).toBe(jstree.reference.toString());
}

function compareDepEdge(jsedge) {
    expect(jsedge).toBeInstanceOf(DepEdge);
    expect(jsedge.getOriginalLabel()).toBe(jsedge.reference.getOriginalLabel());
    expect(jsedge.getType().tagname).toBe(jsedge.reference.getType().name());

    expect(jsedge.getOriginalLabel()).toBe(jsedge.originalLabel);
    expect(jsedge.getType()).toBe(jsedge.type);

    let gov = jsedge.getGovernor();
    if (isDefined(jsedge.reference.getGovernor())) {
        expect(gov).toBeDefined();
        expect(gov.reference.equals(jsedge.reference.getGovernor())).toBe(true);
        expect(jsedge.getSrc().reference.equals(jsedge.reference.getSrc())).toBe(true);
        expect(gov).toBe(jsedge.getSrc());
        expect(gov).toBe(jsedge.governor);
        expect(jsedge.getSrc()).toBe(jsedge.src);
    } else {
        expect(isDefined(jsedge.reference.getGovernor())).toBe(false);
        expect(isDefined(jsedge.reference.getSrc())).toBe(false);
        expect(isUndefined(jsedge.getGovernor())).toBe(true);
        expect(isUndefined(jsedge.getSrc())).toBe(true);
        expect(isUndefined(jsedge.governor)).toBe(true);
        expect(isUndefined(jsedge.src)).toBe(true);
    }

    expect(jsedge.getDependent().reference.equals(jsedge.reference.getDependent())).toBe(true)
    expect(jsedge.getDest().reference.equals(jsedge.reference.getDest())).toBe(true);
    expect(jsedge.getDependent()).toBe(jsedge.getDest());
    expect(jsedge.getDependent()).toBe(jsedge.dependent);
    expect(jsedge.getDest()).toBe(jsedge.dest);

    if (isDefined(jsedge.reference.getDepType())) {
        expect(jsedge.getDepType().tagname).toBe(jsedge.reference.getDepType().name());
        expect(jsedge.getLabel().tagname).toBe(jsedge.reference.getLabel().name());
        expect(jsedge.getDepType()).toBe(jsedge.getLabel());
        expect(jsedge.getDepType()).toBe(jsedge.depType);
        expect(jsedge.getLabel()).toBe(jsedge.label);
    } else {
        expect(isDefined(jsedge.reference.getDepType())).toBe(false);
        expect(isDefined(jsedge.reference.getLabel())).toBe(false);
        expect(isUndefined(jsedge.getLabel())).toBe(true);
        expect(isUndefined(jsedge.getDepType())).toBe(true);
        expect(isUndefined(jsedge.label)).toBe(true);
        expect(isUndefined(jsedge.depType)).toBe(true);
    }

    expect(jsedge.toString()).toBe(jsedge.reference.toString());
}

function compareRoleEdge(jsedge) {
    expect(jsedge).toBeInstanceOf(RoleEdge);
    expect(jsedge.getOriginalLabel()).toBe(jsedge.reference.getOriginalLabel());
    expect(jsedge.getLabel().tagname).toBe(jsedge.reference.getLabel().name());
    expect(jsedge.getOriginalLabel()).toBe(jsedge.originalLabel);
    expect(jsedge.getLabel()).toBe(jsedge.label);

    let gov = jsedge.getPredicate();
    if (isDefined(jsedge.reference.getPredicate())) {
        expect(gov.reference.equals(jsedge.reference.getPredicate())).toBe(true);
        expect(jsedge.getSrc().reference.equals(jsedge.reference.getSrc())).toBe(true);
        expect(gov).toBe(jsedge.getSrc());
        expect(gov).toBe(jsedge.predicate);
        expect(jsedge.getSrc()).toBe(jsedge.src);
    } else {
        expect(isDefined(jsedge.reference.getPredicate())).toBe(false);
        expect(isDefined(jsedge.reference.getSrc())).toBe(false);
        expect(isUndefined(jsedge.getPredicate())).toBe(true);
        expect(isUndefined(jsedge.getSrc())).toBe(true);
        expect(isUndefined(jsedge.predicate)).toBe(true);
        expect(isUndefined(jsedge.src)).toBe(true);
    }

    expect(jsedge.getArgument().reference.equals(jsedge.reference.getArgument())).toBe(true);
    expect(jsedge.getDest().reference.equals(jsedge.reference.getDest())).toBe(true);
    expect(jsedge.getArgument()).toBe(jsedge.getDest());
    expect(jsedge.getArgument()).toBe(jsedge.argument);
    expect(jsedge.getDest()).toBe(jsedge.dest);

    expect(jsedge.toString()).toBe(jsedge.reference.toString());
}

function compareEntity(jsentity) {
    expect(jsentity).toBeInstanceOf(Entity);
    expect(jsentity.getLabel().tagname).toBe(jsentity.reference.getLabel().name());
    expect(jsentity.getOriginalLabel()).toBe(jsentity.reference.getOriginalLabel());
    expect(jsentity.getSurface()).toBe(jsentity.reference.getSurface());
    expect(jsentity.getFineLabel()).toBe(jsentity.reference.getFineLabel());
    expect(jsentity.getLabel()).toBe(jsentity.label);
    expect(jsentity.getOriginalLabel()).toBe(jsentity.originalLabel);
    expect(jsentity.getSurface()).toBe(jsentity.surface);
    expect(jsentity.getFineLabel()).toBe(jsentity.fineLabel);
    // jsentity.getCorefGroup().reference.equals(jsentity.referecnce.getCorefGroup()).should.be.true()

    for (const i of _.range(jsentity.length)) {
        let morph = jsentity[i];
        expect(morph).toBeInstanceOf(Morpheme);
        expect(jsentity.reference.contains(morph.reference)).toBe(true);
        expect(jsentity.reference.get(i).equals(morph.reference)).toBe(true);
    }

    expect(jsentity.toString()).toBe(jsentity.reference.toString());
}

export function compareSentence(jssent, opts = {}) {
    expect(jssent).toBeInstanceOf(Sentence);
    expect(jssent.toString()).toBe(jssent.reference.toString());
    expect(jssent.singleLineString()).toBe(jssent.reference.singleLineString());

    expect(jssent.surfaceString()).toBe(jssent.reference.surfaceString());
    expect(jssent.surfaceString('//')).toBe(jssent.reference.surfaceString('//'));

    if (opts.NER) {
        for (const e of jssent.getEntities()) {
            expect(jssent.reference.getEntities().contains(e.reference)).toBe(true);
            compareEntity(e);
        }
    } else {
        expect(jssent.getEntities()).toHaveLength(0);
    }
    expect(jssent.getEntities()).toEqual(jssent.entities);

    if (opts.DEP) {
        for (const e of jssent.getDependencies()) {
            expect(jssent.reference.getDependencies().contains(e.reference)).toBe(true);
            compareDepEdge(e);
        }
    } else {
        expect(jssent.getDependencies()).toHaveLength(0);
    }
    expect(jssent.getDependencies()).toEqual(jssent.dependencies);

    if (opts.SRL) {
        for (const e of jssent.getRoles()) {
            expect(jssent.reference.getRoles().contains(e.reference)).toBe(true);
            compareRoleEdge(e);
        }
    } else {
        expect(jssent.getRoles()).toHaveLength(0);
    }
    expect(jssent.getRoles()).toEqual(jssent.roles);

    if (opts.SYN) {
        comparePhrase(jssent.getSyntaxTree());
        expect(jssent.getSyntaxTree()).toEqual(jssent.syntaxTree);
    } else {
        expect(isUndefined(jssent.getSyntaxTree())).toBe(true);
        expect(isUndefined(jssent.syntaxTree)).toBe(true);
    }

    for (const word of jssent.getNouns()) {
        expect(word).toBeInstanceOf(Word);
        expect(jssent.reference.getNouns().contains(word.reference)).toBe(true);
    }

    for (const word of jssent.getVerbs()) {
        expect(word).toBeInstanceOf(Word);
        expect(jssent.reference.getVerbs().contains(word.reference)).toBe(true);
    }

    for (const word of jssent.getModifiers()) {
        expect(word).toBeInstanceOf(Word);
        //jssent.reference.getModifiers().contains(word.reference).should.be.true();
    }

    for (const word of jssent) {
        expect(jssent.reference.contains(word.reference)).toBe(true);
        compareWords(word, opts);
    }
}

export const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));