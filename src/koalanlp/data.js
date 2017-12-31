/**
 * Created by bydelta on 17. 12. 31.
 */
let _NOUN_SET = ["NNG", "NNP", "NNB", "NR", "NP"];
let _PRED_SET = ["VV", "VA", "VX", "VCP", "VCN"];
let _MODF_SET = ["MM", "MAG", "MAJ"];
let _JOSA_SET = ["JKS", "JKC", "JKG", "JKO", "JKB", "JKV", "JKQ", "JC", "JX"];
let _EOMI_SET = ["EP", "EF", "EC", "ETN", "ETM"];
let _AFFX_SET = ["XPN", "XPV", "XSN", "XSV", "XSM", "XSN", "XSO", "XR"];
let _SUFX_SET = ["XSN", "XSV", "XSM", "XSN", "XSO"];
let _SYMB_SET = ["SF", "SP", "SS", "SE", "SW", "SO"];
let _UNKN_SET = ["NF", "NV", "NA"];

let finder = function(set, tag){
    return set.indexOf(tag) >= 0;
};

let assert = function(cond, msg){
    if(!cond)
        throw new Error(msg ? msg : "Assertion failed!");
};

export class POS{
    static isNoun(tag){
        return finder(_NOUN_SET, tag);
    }

    static isPredicate(tag){
        return finder(_PRED_SET, tag);
    }

    static isModifier(tag){
        return finder(_MODF_SET, tag);
    }

    static isPostposition(tag){
        return finder(_JOSA_SET, tag);
    }

    static isEnding(tag){
        return finder(_EOMI_SET, tag);
    }

    static isAffix(tag){
        return finder(_AFFX_SET, tag);
    }

    static isSuffix(tag){
        return finder(_SUFX_SET, tag);
    }

    static isSymbol(tag){
        return finder(_SYMB_SET, tag);
    }

    static isUnknown(tag){
        return finder(_UNKN_SET, tag);
    }
}

export class Morpheme{
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

    equals(morph){
        if (morph instanceof Morpheme){
            return morph.surface === this.surface && morph.tag === this.tag;
        }else
            return false;
    }

    equalsWithoutTag(morph){
        if (morph instanceof Morpheme){
            return morph.surface === this.surface;
        }else
            return false;
    }

    toString(){
        return `${this.surface}/${this.tag}(${this.rawTag})`
    }

    toJson(){
        return {
            surface: this.surface,
            tag: this.tag,
            rawTag: this.tag
        }
    }
}

export class Relationship{
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

    equals(obj){
        if(obj instanceof Relationship)
            return this.head === obj.head && this.relation === obj.relation && this.target === obj.target;
        else
            return false;
    }

    toString() {
        return `Rel:${this.relation} (ID:${this.head} → ID:${this.target})`;
    }

    toJson(){
        return {
            headId: this.head,
            targetId: this.target,
            relation: this.relation,
            rawRel: this.rawRel
        }
    }
}

export class Word{
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

    length() {
        return this.morphemes.length;
    }

    get(idx) {
        return this.morphemes[idx];
    }

    matches(tag){ //TODO fix bug in scala version
        if(Array.isArray(tag)){
            let list = tag.reverse();
            for(let i = 0; i < this.morphemes.length; i++){
                if (list.length > 0 && this.morphemes[i].matches(list[list.length - 1]))
                    list.pop();
            }
            return list.length == 0;
        }else return false;
    }

    find(fn){
        if(typeof fn === "function"){
            return this.morphemes.find(fn);
        }else if(fn instanceof Morpheme){
            return this.morphemes.find(m => m.equals(fn));
        }else
            return undefined;
    }

    exists(fn){
        let found = find(fn);
        return typeof found !== "undefined";
    }

    equalsWithoutTag(another){
        if (another instanceof Word){
            return another.surface === this.surface;
        }else return false;
    }

    equals(another){
        if (another instanceof Word){
            let isEqual = another.id === this.id && this.length() === another.length();
            for(let i = 0; i < this.length() && isEqual; i++){
                isEqual = this.get(i) === another.get(i);
            }
            return isEqual;
        }else return false;
    }

    toString(){
        let morphStr = this.morphemes.map(m => m.toString()).join("");
        let buffer = `${this.surface}\t= ${morphStr}`;
        if(this.dependents.length > 0){
            buffer += "\n";
            buffer += this.dependents.map(function(r){
                return `.... 이 어절의 ${r.tag}: 어절 [#${r.target}]`;
            }).join("\n");
        }
        return buffer;
    }

    singleLineString(){
        return this.morphemes.map(function(m){
            return `${m.surface}/${m.tag}`;
        }).join("+");
    }

    toJson(){
        return {
            surface: this.surface,
            morphemes: this.morphemes.map(m => m.toJson()),
            dependents: this.dependents.map(r => r.toJson())
        }
    }
}

export class Sentence{
    constructor(words){
        assert(Array.isArray(words) && words[0] instanceof Word);

        this.words = words;
        this.root = new Word();
    }

    matches(tag){ //TODO fix bug in scala version
        if(Array.isArray(tag)){
            let list = tag.reverse();
            for(let i = 0; i < this.words.length; i++){
                if (list.length > 0 && this.words[i].matches(list[list.length - 1]))
                    list.pop();
            }
            return list.length == 0;
        }else return false;
    }

    nouns(){
        return this.words.filter(m => m.exists(POS.isNoun))
    }

    verbs(){
        return this.words.filter(m => m.exists(POS.isPredicate))
    }

    modifiers(){
        return this.words.filter(m => m.exists(POS.isModifier))
    }

    get(idx){
        return this.words[idx];
    }

    length(){
        return this.words.length;
    }

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

    surfaceString(delimiter){
        delimiter = delimiter || " ";
        return this.words.map(w => w.surface).join(delimiter);
    }

    singleLineString(){
        return this.words.map(w => w.singleLineString()).join(" ");
    }

    toJson(){
        return {
            words: this.words.map(m => m.toJson()),
            root: this.root.map(r => r.toJson())
        }
    }
}

