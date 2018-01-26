let POS = require('./POS');

let assert = function(cond, msg){
    if(!cond)
        throw new Error(msg ? msg : "Assertion failed!");
};

/**
 * 형태소
 */
export class Morpheme{
    /**
     * 형태소 생성자.
     * @param {string} surface 형태소 표면형.
     * @param {string} tag 세종 품사
     * @param {string} rawTag 원본 품사
     * @param {Number} id 어절 내 위치.
     */
    constructor(surface, tag, rawTag, id){
        assert(typeof surface === "string",
            "Surface should be a string!");
        assert(typeof tag === "string",
            "Tag should be a string!");
        assert(typeof rawTag === "string",
            "RawTag should be a string!");
        assert(typeof id === "number",
            "Id should be a number!");

        this.surface = surface;
        this.tag = tag;
        this.rawTag = rawTag;
        this.id = id;
    }

    /**
     * 지정된 tag와 형태소가 일치하는지 확인.
     * @param {string} tag 확인할 세종품사.
     * @return {boolean} 일치하거나, 지정된 tag에 포함되는 경우, true.
     */
    hasTag(tag){
        if (typeof tag === "string") {
            return this.tag.startsWith(tag);
        }else if (Array.isArray(tag)){
            let found = tag.find(function(v){
                return this.tag.startsWith(v);
            });
            return typeof found !== "undefined";
        }else
            return false;
    }

    /**
     * 지정된 tag와 형태소가 일치하는지 확인.
     * @param {string} tag 확인할 원본품사.
     * @return {boolean} 일치하거나, 지정된 tag에 포함되는 경우, true.
     */
    hasRawTag(tag){
        if (typeof tag === "string") {
            return this.rawTag.startsWith(tag);
        }else if (Array.isArray(tag)){
            let found = tag.find(function(v){
                return this.rawTag.startsWith(v);
            });
            return typeof found !== "undefined";
        }else
            return false;
    }

    /**
     * 두 형태소가 같은지 확인.
     * @param {Morpheme} morph 확인할 형태소.
     * @return {boolean} 표면형과 품사가 모두 같으면 true.
     */
    equals(morph){
        if (morph instanceof Morpheme){
            return morph.surface === this.surface && morph.tag === this.tag;
        }else
            return false;
    }

    /**
     * 두 형태소의 표면형이 같은지 확인.
     * @param {Morpheme} morph 확인할 형태소.
     * @return {boolean} 표면형이 같으면 true.
     */
    equalsWithoutTag(morph){
        if (morph instanceof Morpheme){
            return morph.surface === this.surface;
        }else
            return false;
    }

    /**
     * 문자열로 변환.
     * @return {string} 표면형/세종(원본) 형태의 문자열.
     */
    toString(){
        return `${this.surface}/${this.tag}(${this.rawTag})`
    }

    /**
     * JSON으로 변환.
     * @return {{surface: string, tag: string, rawTag: string}} 표면형, 세종품사, 원본품사를 담고있는 Json Object.
     */
    toJson(){
        return {
            surface: this.surface,
            tag: this.tag,
            rawTag: this.tag
        }
    }
}

/**
 * 의존관계
 */
export class Relationship{
    /**
     * 의존관계 객체생성
     * @param {Number} head 지배소 위치.
     * @param {string} relation 관계
     * @param {string} rawRel 원본관계.
     * @param {Number} target 피지배소 위치.
     */
    constructor(head, relation, rawRel, target) {
        assert(typeof head === "number");
        assert(typeof relation === "string");
        assert(typeof rawRel === "string");
        assert(typeof target === "number");

        this.head = head;
        this.relation = relation;
        this.rawRel = rawRel;
        this.target = target;
    }

    /**
     * 두 의존관계가 같은지 확인.
     * @param {Relationship} obj 비교할 의존관계.
     * @return {boolean} 지배소, 피지배소, 관계 모두 일치하면, true
     */
    equals(obj){
        if(obj instanceof Relationship)
            return this.head === obj.head && this.relation === obj.relation && this.target === obj.target;
        else
            return false;
    }

    /**
     * 문자열로 변환.
     * @return {string} 관계 (지배소-피지배소) 형태의 문자열.
     */
    toString() {
        return `Rel:${this.relation} (ID:${this.head} → ID:${this.target})`;
    }

    /**
     * JSON 객체로 변환.
     * @return {{headId: number, targetId: number, relation: string, rawRel: string}} 지배소, 피지배소, 관계, 원본관계를 포함한 JSON 객체.
     */
    toJson(){
        return {
            headId: this.head,
            targetId: this.target,
            relation: this.relation,
            rawRel: this.rawRel
        }
    }
}

/**
 * 어절
 */
export class Word{
    /**
     * 어절 객체 생성.
     * @param {string} [surface=undefined] 어절의 표면형.
     * @param {Morpheme[]} [morphemes=undefined] 어절의 형태소 목록.
     * @param {Number} [id=undefined] 어절의 문장 내 위치.
     */
    constructor(surface, morphemes, id){
        if(typeof surface !== "undefined") {
            assert(typeof surface === "string",
                "Surface should be a string!");
            assert(Array.isArray(morphemes) && morphemes[0] instanceof Morpheme,
                `Morphemes are not an array: ${morphemes} && isMorpheme=${morphemes[0] instanceof Morpheme}`);
            assert(typeof id === "number",
                `Id is not a number: ${id}`);

            this.surface = surface;
            this.morphemes = morphemes;
            this.id = id;
        }else{
            this.surface = "##ROOT##";
            this.morphemes = [];
            this.id = -1;
        }
        this.dependents = [];
    }

    /**
     * 어절 내 형태소의 수
     * @return {Number} 형태소의 수
     */
    length() {
        return this.morphemes.length;
    }

    /**
     * 지정된 위치에 있는 형태소 반환.
     * @param {Number} idx 형태소를 찾을 위치.
     * @return {Morpheme} 형태소.
     */
    get(idx) {
        return this.morphemes[idx];
    }

    /**
     * 주어진 형태소 형태를 포함하는지 확인.
     * @param {string[]} tag 확인할 형태소 순서.
     * @return {boolean} 주어진 순서대로 어절에 포함되어 있다면 true. (연속할 필요는 없음)
     */
    matches(tag){
        if(Array.isArray(tag)){
            let list = tag.reverse();
            for(let i = 0; i < this.morphemes.length; i++){
                if (list.length > 0 && this.morphemes[i].tag.startsWith(list[list.length - 1]))
                    list.pop();
            }
            return list.length == 0;
        }else return false;
    }

    /**
     * 형태소가 조건을 만족하는지 확인하는 함수.
     * @callback morphMatcher
     * @param {Morpheme} morpheme
     * @return {boolean}
     */

    /**
     * 주어진 형태소/조건을 만족하는 형태소 반환.
     * @param {Morpheme|morphMatcher} fn 확인할 형태소 또는 조건.
     * @return {Morpheme|undefined} 만족하는 형태소.
     */
    find(fn){
        if(typeof fn === "function"){
            return this.morphemes.find(fn);
        }else if(fn instanceof Morpheme){
            return this.morphemes.find(m => m.equals(fn));
        }else
            return undefined;
    }

    /**
     * 주어진 형태소/조건을 만족하는 형태소가 있는지 확인.
     * @param {Morpheme|morphMatcher} fn 확인할 형태소 또는 조건.
     * @return {boolean} 만족하는 형태소가 있으면 true.
     */
    exists(fn){
        let found = this.find(fn);
        return typeof found !== "undefined";
    }

    /**
     * 두 어절의 표면형이 일치하는지 확인.
     * @param {Word} another 비교할 어절.
     * @return {boolean} 표면형이 일치하면, true
     */
    equalsWithoutTag(another){
        if (another instanceof Word){
            return another.surface === this.surface;
        }else return false;
    }

    /**
     * 두 어절이 같은지 확인.
     * @param {Word} another 비교할 어절 
     * @return {boolean} 표면형과 문장 내 위치가 일치하면, true.
     */
    equals(another){
        if (another instanceof Word){
            let isEqual = another.id === this.id && this.length() === another.length();
            for(let i = 0; i < this.length() && isEqual; i++){
                isEqual = isEqual && this.get(i) === another.get(i);
            }
            return isEqual;
        }else return false;
    }

    /**
     * 문자열로 변환.
     * @return {string} 변환된 문자열.
     */
    toString(){
        let morphStr = this.morphemes.map(m => m.toString()).join("+");
        let buffer = `${this.surface}\t= ${morphStr}`;
        if(this.dependents.length > 0){
            buffer += "\n";
            buffer += this.dependents.map(function(r){
                return `.... 이 어절의 ${r.relation}: 어절 [#${r.target}]`;
            }).join("\n");
        }
        return buffer;
    }

    /**
     * 형태소 목록을 한 줄짜리 문자열로 변환.
     * @return {string} "형태소1/품사1+형태소2/품사2..." 형태의 문자열.
     */
    singleLineString(){
        return this.morphemes.map(function(m){
            return `${m.surface}/${m.tag}`;
        }).join("+");
    }

    /**
     * 어절을 JSON 객체로 변환.
     * @return {{surface: string, morphemes: Array, dependents: Array}} 표면형, 형태소, 의존소를 갖는 Json Object.
     */
    toJson(){
        return {
            surface: this.surface,
            morphemes: this.morphemes.map(m => m.toJson()),
            dependents: this.dependents.map(r => r.toJson())
        }
    }
}

/**
 * 문장.
 */
export class Sentence{
    /**
     * 문장 객체 생성.
     * @param {Word[]} words 문장에 포함될 어절 목록.
     * @param {*} reference KoalaNLP(Java) 분석결과.
     */
    constructor(words, reference){
        assert(Array.isArray(words) && words[0] instanceof Word);

        this.words = words;
        this.reference = reference;
        this.root = new Word();
    }

    /**
     * 주어진 형태소 형태를 포함하는지 확인.
     * @param {string[][]} tag 확인할 형태소 순서. 형태소의 묶음(어절단위)의 묶음. 
     * @return {boolean} 주어진 순서대로 어절에 포함되어 있다면 true. (연속할 필요는 없음)
     */
    matches(tag){
        if(Array.isArray(tag)){
            let list = tag.reverse();
            for(let i = 0; i < this.words.length; i++){
                if (list.length > 0 && this.words[i].matches(list[list.length - 1]))
                    list.pop();
            }
            return list.length == 0;
        }else return false;
    }

    /**
     * 어절이 조건을 만족하는지 확인하는 함수.
     * @callback wordMatcher
     * @param {Word} word
     * @return {boolean}
     */

    /**
     * 주어진 어절/조건을 만족하는 어절 반환.
     * @param {Word|wordMatcher} fn 확인할 어절 또는 조건.
     * @return {Word|undefined} 만족하는 어절.
     */
    find(fn){
        if(typeof fn === "function"){
            return this.words.find(fn);
        }else if(fn instanceof Word){
            return this.words.find(w => w.equals(fn));
        }else
            return undefined;
    }

    /**
     * 주어진 어절/조건을 만족하는 어절이 있는지 확인.
     * @param {Word|wordMatcher} fn 확인할 어절 또는 조건.
     * @return {Word|undefined} 만족하는 어절이 있으면 true.
     */
    exists(fn){
        let found = this.find(fn);
        return typeof found !== "undefined";
    }

    /**
     * 문장 내 체언(명사,대명사,의존명사,수사)을 포함한 어절의 목록.
     * @return {Word[]} 체언 목록
     */
    nouns(){
        return this.words.filter(w => w.exists(POS.isNoun))
    }

    /**
     * 문장 내 용언(동사,형용사)을 포함한 어절의 목록.
     * @return {Word[]} 용언 목록
     */
    verbs(){
        return this.words.filter(w => w.exists(POS.isPredicate))
    }

    /**
     * 문장 내 수식언(관형사,부사)을 포함한 어절의 목록.
     * @return {Word[]} 수식언 목록
     */
    modifiers(){
        return this.words.filter(w => w.exists(POS.isModifier))
    }

    /**
     * 주어진 위치의 어절 반환.
     * @param {Number} idx 어절을 찾을 위치.
     * @return {Word} 해당하는 어절.
     */
    get(idx){
        return this.words[idx];
    }

    /**
     * 문장 내 어절의 수
     * @return {Number} 어절의 수.
     */
    length(){
        return this.words.length;
    }

    /**
     * 문자열로 변환.
     * @return {string} 변환된 문자열.
     */
    toString(){
        let buffer = this.surfaceString() + "\n";
        for(let i = 0; i < this.words.length; i++){
            let w = this.words[i];
            buffer += `[#${i}] ${w.toString()}`;
            if(this.root.dependents.find(r => r.target == w.id)){
                buffer += "\n.... 이 어절이 ROOT 입니다";
            }
            buffer += "\n";
        }
        return buffer;
    }

    /**
     * 표면형 문자열.
     * @param {string} [delimiter=space] 어절을 구분할 구분자.
     * @return {string} 구분자로 어절이 구분된 문자열.
     */
    surfaceString(delimiter){
        delimiter = delimiter || " ";
        return this.words.map(w => w.surface).join(delimiter);
    }

    /**
     * 한 줄짜리 형태소분석 결과.
     * @return {string} "형태소1/품사1+형태소2/품사2..." 형태의 어절이 띄어쓰기로 분리된 문장.
     */
    singleLineString(){
        return this.words.map(w => w.singleLineString()).join(" ");
    }

    /**
     * 문장의 JSON 객체.
     * @return {{words: Array, root: Array}} 어절과 root를 포함한 Json Object.
     */
    toJson(){
        return {
            words: this.words.map(m => m.toJson()),
            root: this.root.dependents.map(r => r.toJson())
        }
    }
}

