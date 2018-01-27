"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** @module koalanlp/POS **/

/** [체언] ''일반명사'': 일반 개념을 표시하는 명사. **/
var NNG = exports.NNG = "NNG";
/** [체언] ''고유명사'' : 낱낱의 특정한 사물이나 사람을 다른 것들과 구별하여 부르기 위하여 고유의 기호를 붙인 이름. **/
var NNP = exports.NNP = "NNP";
/** [체언] ''일반 의존명사'' : 의미가 형식적이어서 다른 말 아래에 기대어 쓰이는 명사.
 * ‘것1’, ‘따름1’, ‘뿐1’, ‘데1’ 따위가 있다.
 * */
var NNB = exports.NNB = "NNB";
/** [체언] ''단위성 의존명사'' : 수효나 분량 따위의 단위를 나타내는 의존 명사.
 * ‘쌀 한 말, 쇠고기 한 근, 굴비 한 두름, 북어 한 쾌, 고무신 한 켤레, 광목 한 필’에서 ‘말3’, ‘근3’, ‘두름1’, ‘쾌1’, ‘켤레2’, ‘필2’
 * */
var NNM = exports.NNM = "NNM";
/** [체언] ''수사'' : 사물의 수량이나 순서를 나타내는 품사. 양수사와 서수사가 있다. **/
var NR = exports.NR = "NR";
/** [체언] ''대명사'' : 사람이나 사물의 이름을 대신 나타내는 말. 또는 그런 말들을 지칭하는 품사 **/
var NP = exports.NP = "NP";

/** [용언] ''동사'' : 사물의 동작이나 작용을 나타내는 품사. **/
var VV = exports.VV = "VV";
/** [용언] ''형용사'' : 사물의 성질이나 상태를 나타내는 품사. **/
var VA = exports.VA = "VA";
/** [용언] ''보조용언'' : 본용언과 연결되어 그것의 뜻을 보충하는 역할을 하는 용언. 보조 동사, 보조 형용사가 있다.
 * ‘ 가지고 싶다’의 ‘싶다’, ‘먹어 보다’의 ‘보다1’ 따위이다.
 * */
var VX = exports.VX = "VX";
/** [용언] ''긍정지정사(이다)'': 무엇이 무엇이라고 지정하는 단어. (이다) **/
var VCP = exports.VCP = "VCP";
/** [용언] ''부정지정사(아니다)'': 무엇이 무엇이 아니라고 지정하는 단어. (아니다) **/
var VCN = exports.VCN = "VCN";

/** [수식언] ''관형사'' : 체언 앞에 놓여서, 그 체언의 내용을 자세히 꾸며 주는 품사. **/
var MM = exports.MM = "MM";
/** [수식언] ''부사'' : 용언 또는 다른 말 앞에 놓여 그 뜻을 분명하게 하는 품사. **/
var MAG = exports.MAG = "MAG";
/** [수식언] ''접속부사'' : 앞의 체언이나 문장의 뜻을 뒤의 체언이나 문장에 이어 주면서 뒤의 말을 꾸며 주는 부사.
 * ‘ 그러나’, ‘그런데’, ‘그리고’, ‘하지만’ 따위가 있다.
 * */
var MAJ = exports.MAJ = "MAJ";

/** [독립언] ''감탄사'' : 말하는 이의 본능적인 놀람이나 느낌, 부름, 응답 따위를 나타내는 말의 부류이다. **/
var IC = exports.IC = "IC";

/** [관계언] ''주격 조사'' :
 * 문장 안에서, 체언이 서술어의 주어임을 표시하는 격 조사. ‘이/가’, ‘께서’, ‘에서2’ 따위가 있다.
 * */
var JKS = exports.JKS = "JKS";
/** [관계언] ''보격 조사'' :
 * 문장 안에서, 체언이 보어임을 표시하는 격 조사.
 * ‘철수는 위대한 학자가 되었다.’에서의 ‘가11’, ‘그는 보통 인물이 아니다.’에서의 ‘이27’ 따위이다.
 * */
var JKC = exports.JKC = "JKC";
/** [관계언] ''관형격 조사'' : 문장 안에서, 앞에 오는 체언이 뒤에 오는 체언의 관형어임을 보이는 조사. **/
var JKG = exports.JKG = "JKG";
/** [관계언] ''목적격 조사'' : 문장 안에서, 체언이 서술어의 목적어임을 표시하는 격 조사. ‘을/를’이 있다. **/
var JKO = exports.JKO = "JKO";
/** [관계언] ''부사격 조사'' : 문장 안에서, 체언이 부사어임을 보이는 조사.
 * ‘ 에4’, ‘에서2’, ‘(으)로’, ‘와/과’, ‘보다4’ 따위가 있다. **/
var JKB = exports.JKB = "JKB";
/** [관계언] ''호격 조사'' :
 * 문장 안에서, 체언이 부름의 자리에 놓이게 하여 독립어가 되게 하는 조사.
 * ‘영숙아’의 ‘아9’, ‘철수야’의 ‘야12’ 따위가 있다. **/
var JKV = exports.JKV = "JKV";
/** [관계언] ''인용격 조사'': 앞의 말이 인용됨을 나타내는 조사. **/
var JKQ = exports.JKQ = "JKQ";
/** [관계언] ''접속 조사'' :
 * 둘 이상의 단어나 구 따위를 같은 자격으로 이어 주는 구실을 하는 조사.
 * ‘와4’, ‘과12’, ‘하고5’, ‘(이)나’, ‘(이)랑’ 따위가 있다. **/
var JC = exports.JC = "JC";
/** [관계언] ''보조사'' :
 * 체언, 부사, 활용 어미 따위에 붙어서 어떤 특별한 의미를 더해 주는 조사.
 * ‘은5’, ‘는1’, ‘도15’, ‘만14’, ‘까지3’, ‘마저’, ‘조차8’, ‘부터’ 따위가 있다.
 * */
var JX = exports.JX = "JX";

/** ''선어말 어미'' :
 * 어말 어미 앞에 나타나는 어미.
 * ‘-시-23’, ‘-옵-1’ 따위와 같이 높임법에 관한 것과
 * ‘-았-’, ‘-는-2’, ‘-더-2’, ‘-겠-’ 따위와 같이 시상(時相)에 관한 것이 있다.
 * */
var EP = exports.EP = "EP";
/** ''종결 어미'' :
 * 한 문장을 종결되게 하는 어말 어미.
 * 동사에는 평서형ㆍ감탄형ㆍ의문형ㆍ명령형ㆍ청유형이 있고, 형용사에는 평서형ㆍ감탄형ㆍ의문형이 있다.
 * */
var EF = exports.EF = "EF";
/** ''연결 어미''
 * 어간에 붙어 다음 말에 연결하는 구실을 하는 어미.
 * ‘-게10’, ‘-고25’, ‘-(으)며’, ‘-(으)면’, ‘-(으)니’, ‘-아/어’, ‘-지23’ 따위가 있다.
 * */
var EC = exports.EC = "EC";
/** ''명사형 전성어미'': 용언의 어간에 붙어 명사의 기능을 수행하게 하는 어미. **/
var ETN = exports.ETN = "ETN";
/** ''관형형 전성어미'': 용언의 어간에 붙어 관형사의 기능을 수행하게 하는 어미. **/
var ETM = exports.ETM = "ETM";

/** ''체언 접두사'' : 파생어를 만드는 접사로, 어근이나 단어의 앞에 붙어 새로운 단어가 되게 하는 말. **/
var XPN = exports.XPN = "XPN";
/** ''용언 접두사'' : 파생어를 만드는 접사로, 어근이나 단어의 앞에 붙어 새로운 단어가 되게 하는 말. **/
var XPV = exports.XPV = "XPV";
/** ''명사 파생 접미사'':
 * 파생어를 만드는 접사로, 어근이나 단어의 뒤에 붙어 새로운 명사가 되게 하는 말.
 * */
var XSN = exports.XSN = "XSN";
/** ''동사 파생 접미사'':
 * 파생어를 만드는 접사로, 어근이나 단어의 뒤에 붙어 새로운 동사가 되게 하는 말.
 * */
var XSV = exports.XSV = "XSV";
/** ''형용사 파생 접미사'':
 * 파생어를 만드는 접사로, 어근이나 단어의 뒤에 붙어 새로운 형용사가 되게 하는 말.
 * */
var XSA = exports.XSA = "XSA";
/** ''부사 파생 접미사'':
 * 파생어를 만드는 접사로, 어근이나 단어의 뒤에 붙어 새로운 부사가 되게 하는 말.
 * */
var XSM = exports.XSM = "XSM";
/** ''기타 접미사'':
 * 파생어를 만드는 접사로, 어근이나 단어의 뒤에 붙어 새로운 단어가 되게 하는 말.
 * */
var XSO = exports.XSO = "XSO";
/** ''어근'' :
 * 단어를 분석할 때, 실질적 의미를 나타내는 중심이 되는 부분. ‘덮개’의 ‘덮-’, ‘어른스럽다’의 ‘어른1’ 따위이다.
 * */
var XR = exports.XR = "XR";

/** 종결기호: 마침/물음/느낌표 **/
var SF = exports.SF = "SF";
/** 연결기호: 쉼표/가운뎃점/빗금 **/
var SP = exports.SP = "SP";
/** 묶음기호: 괄호/묶음표/따옴표 **/
var SS = exports.SS = "SS";
/** 생략기호: 줄임표 **/
var SE = exports.SE = "SE";
/** 붙임기호: 물결표/줄임표/빠짐표 **/
var SO = exports.SO = "SO";
/** 기타기호 **/
var SW = exports.SW = "SW";

/** 명사 추정 범주 **/
var NF = exports.NF = "NF";
/** 동사 추정 범주 **/
var NV = exports.NV = "NV";
/** 분석 불능 범주 **/
var NA = exports.NA = "NA";

/**
 * 모든 품사 표기 목록
 * @type {string[]}
 */
var Tags = exports.Tags = Object.keys(module.exports).filter(function (x) {
  return x.toUpperCase() === x;
});

var _NOUN_SET = [NNG, NNP, NNB, NNM, NR, NP];
var _PRED_SET = [VV, VA, VX, VCP, VCN];
var _MODF_SET = [MM, MAG, MAJ];
var _JOSA_SET = [JKS, JKC, JKG, JKO, JKB, JKV, JKQ, JC, JX];
var _EOMI_SET = [EP, EF, EC, ETN, ETM];
var _AFFX_SET = [XPN, XPV, XSN, XSV, XSM, XSA, XSO, XR];
var _SUFX_SET = [XSN, XSV, XSM, XSA, XSO];
var _SYMB_SET = [SF, SP, SS, SE, SW, SO];
var _UNKN_SET = [NF, NV, NA];

var finder = function finder(set, tag) {
  if (typeof tag === "string") return set.indexOf(tag) >= 0;else if (Object.keys(tag).indexOf("tag") >= 0) return set.indexOf(tag.tag) >= 0;else return false;
};

/**
 * 주어진 tag가 체언(명사,대명사,의존명사,수사)인지 확인.
 * @function
 * @param {string|Morpheme} tag 확인할 품사표기 또는 형태소.
 */
var isNoun = exports.isNoun = function isNoun(tag) {
  return finder(_NOUN_SET, tag);
};

/**
 * 주어진 tag가 용언(동사,형용사)인지 확인.
 * @function
 * @param {string|Morpheme} tag 확인할 품사표기 또는 형태소.
 */
var isPredicate = exports.isPredicate = function isPredicate(tag) {
  return finder(_PRED_SET, tag);
};

/**
 * 주어진 tag가 수식언(관형사,부사)인지 확인.
 * @function
 * @param {string|Morpheme} tag 확인할 품사표기 또는 형태소.
 */
var isModifier = exports.isModifier = function isModifier(tag) {
  return finder(_MODF_SET, tag);
};

/**
 * 주어진 tag가 관계언(조사)인지 확인.
 * @function
 * @param {string|Morpheme} tag 확인할 품사표기 또는 형태소.
 */
var isPostposition = exports.isPostposition = function isPostposition(tag) {
  return finder(_JOSA_SET, tag);
};

/**
 * 주어진 tag가 어미인지 확인.
 * @function
 * @param {string|Morpheme} tag 확인할 품사표기 또는 형태소.
 */
var isEnding = exports.isEnding = function isEnding(tag) {
  return finder(_EOMI_SET, tag);
};

/**
 * 주어진 tag가 접사인지 확인.
 * @function
 * @param {string|Morpheme} tag 확인할 품사표기 또는 형태소.
 */
var isAffix = exports.isAffix = function isAffix(tag) {
  return finder(_AFFX_SET, tag);
};

/**
 * 주어진 tag가 접미사인지 확인.
 * @function
 * @param {string|Morpheme} tag 확인할 품사표기 또는 형태소.
 */
var isSuffix = exports.isSuffix = function isSuffix(tag) {
  return finder(_SUFX_SET, tag);
};

/**
 * 주어진 tag가 기호인지 확인.
 * @function
 * @param {string|Morpheme} tag 확인할 품사표기 또는 형태소.
 */
var isSymbol = exports.isSymbol = function isSymbol(tag) {
  return finder(_SYMB_SET, tag);
};

/**
 * 주어진 tag가 품사분석에 실패한, 미상의 품사인지 확인.
 * @function
 * @param {string|Morpheme} tag 확인할 품사표기 또는 형태소.
 */
var isUnknown = exports.isUnknown = function isUnknown(tag) {
  return finder(_UNKN_SET, tag);
};