import Morpheme from './data'

/* Noun tags */
export let NNG = "NNG";
export let NNP = "NNP";
export let NNB = "NNB";
export let NR = "NR";
export let NP = "NP";

/* Verb tags */
export let VV = "VV";
export let VA = "VA";
export let VX = "VX";
export let VCP = "VCP";
export let VCN = "VCN";

/* Modifier Tags */
export let MM = "MM";
export let MAG = "MAG";
export let MAJ = "MAJ";

/* Josa Tags */
export let JKS = "JKS";
export let JKC = "JKC";
export let JKG = "JKG";
export let JKO = "JKO";
export let JKB = "JKB";
export let JKV = "JKV";
export let JKQ = "JKQ";
export let JC = "JC";
export let JX = "JX";

/* Eomi Tags */
export let EP = "EP";
export let EF = "EF";
export let EC = "EC";
export let ETN = "ETN";
export let ETM = "ETM";

/* Affix tags */
export let XPN = "XPN";
export let XPV = "XPV";
export let XSN = "XSN";
export let XSV = "XSV";
export let XSM = "XSM";
export let XSO = "XSO";
export let XR = "XR";

/* Symbol tags */
export let SF = "SF";
export let SP = "SP";
export let SS = "SS";
export let SE = "SE";
export let SW = "SW";
export let SO = "SO";

/* Undefined tags */
export let NF = "NF";
export let NV = "NV";
export let NA = "NA";

let _NOUN_SET = [NNG, NNP, NNB, NR, NP];
let _PRED_SET = [VV, VA, VX, VCP, VCN];
let _MODF_SET = [MM, MAG, MAJ];
let _JOSA_SET = [JKS, JKC, JKG, JKO, JKB, JKV, JKQ, JC, JX];
let _EOMI_SET = [EP, EF, EC, ETN, ETM];
let _AFFX_SET = [XPN, XPV, XSN, XSV, XSM, XSN, XSO, XR];
let _SUFX_SET = [XSN, XSV, XSM, XSN, XSO];
let _SYMB_SET = [SF, SP, SS, SE, SW, SO];
let _UNKN_SET = [NF, NV, NA];

export let TAGS = [].concat([_NOUN_SET, _PRED_SET, _MODF_SET, _JOSA_SET, _EOMI_SET, _AFFX_SET, _SYMB_SET, _UNKN_SET]);

let finder = function(set, tag){
    if(typeof tag === "string")
        return set.indexOf(tag) >= 0;
    else if(tag instanceof Morpheme)
        return set.indexOf(tag.tag) >= 0;
    else return false;
};

/**
 * 주어진 tag가 체언(명사,대명사,의존명사,수사)인지 확인.
 * @param tag 확인할 품사표기 또는 형태소.
 */
export let isNoun = function(tag){
    return finder(_NOUN_SET, tag);
};

/**
 * 주어진 tag가 용언(동사,형용사)인지 확인.
 * @param tag 확인할 품사표기 또는 형태소.
 */
export let isPredicate = function(tag){
    return finder(_PRED_SET, tag);
};

/**
 * 주어진 tag가 수식언(관형사,부사)인지 확인.
 * @param tag 확인할 품사표기 또는 형태소.
 */
export let isModifier = function(tag){
    return finder(_MODF_SET, tag);
};

/**
 * 주어진 tag가 관계언(조사)인지 확인.
 * @param tag 확인할 품사표기 또는 형태소.
 */
export let isPostposition = function(tag){
    return finder(_JOSA_SET, tag);
};

/**
 * 주어진 tag가 어미인지 확인.
 * @param tag 확인할 품사표기 또는 형태소.
 */
export let isEnding = function(tag){
    return finder(_EOMI_SET, tag);
};

/**
 * 주어진 tag가 접사인지 확인.
 * @param tag 확인할 품사표기 또는 형태소.
 */
export let isAffix = function(tag){
    return finder(_AFFX_SET, tag);
};

/**
 * 주어진 tag가 접미사인지 확인.
 * @param tag 확인할 품사표기 또는 형태소.
 */
export let isSuffix = function(tag){
    return finder(_SUFX_SET, tag);
};

/**
 * 주어진 tag가 기호인지 확인.
 * @param tag 확인할 품사표기 또는 형태소.
 */
export let isSymbol = function(tag){
    return finder(_SYMB_SET, tag);
};

/**
 * 주어진 tag가 품사분석에 실패한, 미상의 품사인지 확인.
 * @param tag 확인할 품사표기 또는 형태소.
 */
export let isUnknown = function(tag){
    return finder(_UNKN_SET, tag);
};