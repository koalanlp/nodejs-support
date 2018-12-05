"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alphaToHangul = alphaToHangul;
exports.hangulToAlpha = hangulToAlpha;
exports.isAlphaPronounced = isAlphaPronounced;
exports.isHanja = isHanja;
exports.isCJKHanja = isCJKHanja;
exports.hanjaToHangul = hanjaToHangul;
exports.isCompleteHangul = isCompleteHangul;
exports.isIncompleteHangul = isIncompleteHangul;
exports.isHangul = isHangul;
exports.isHangulEnding = isHangulEnding;
exports.isChosungJamo = isChosungJamo;
exports.isJungsungJamo = isJungsungJamo;
exports.isJongsungJamo = isJongsungJamo;
exports.isJongsungEnding = isJongsungEnding;
exports.getChosung = getChosung;
exports.getJungsung = getJungsung;
exports.getJongsung = getJongsung;
exports.dissembleHangul = dissembleHangul;
exports.assembleHangulTriple = assembleHangulTriple;
exports.assembleHangul = assembleHangul;
exports.correctVerbApply = correctVerbApply;
exports.ChoToJong = exports.HanLastList = exports.HanSecondList = exports.HanFirstList = void 0;

var _jvm = require("./jvm");

var _underscore = _interopRequireDefault(require("underscore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 여러 편의기능을 모아놓은 Module입니다.
 * @module koalanlp/ExtUtil
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 **/

/**
 * 초성 조합형 문자열 리스트 (UNICODE 순서)
 *
 * 'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
 *
 * @type {ReadonlyArray<string>}
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.HanFirstList[0]);
 */
const HanFirstList = Object.freeze(_underscore.default.range(0x1100, 0x1112 + 1).map(x => String.fromCharCode(x)));
/**
 * 중성 조합형 문자열 리스트 (UNICODE 순서)
 *
 * 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
 *
 * @type {ReadonlyArray<string>}
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.HanSecondList[0]);
 */

exports.HanFirstList = HanFirstList;
const HanSecondList = Object.freeze(_underscore.default.range(0x1161, 0x1175 + 1).map(x => String.fromCharCode(x)));
/**
 * 종성 조합형 문자열 리스트 (UNICODE 순서). 가장 첫번째는 null (받침 없음)
 *
 * undefined, 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ',
 * 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
 *
 * @type {ReadonlyArray<string>}
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.HanLastList[0]);
 */

exports.HanSecondList = HanSecondList;
const HanLastList = Object.freeze(_underscore.default.range(0x11A7, 0x11C2 + 1).map(x => {
  if (x === 0x11A7) return undefined;else return String.fromCharCode(x);
}));
/**
 * 초성 문자를 종성 조합형 문자로 변경할 수 있는 map
 * @type {Readonly<Map<string, string>>}
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.ChoToJong.get('ㄵ'));
 */

exports.HanLastList = HanLastList;
const ChoToJong = Object.freeze(new Map([['\u1100', '\u11A8'], // ㄱ
['\u1101', '\u11A9'], // ㄲ
['\u1102', '\u11AB'], // ㄴ
['\u1103', '\u11AE'], // ㄷ
['\u1105', '\u11AF'], // ㄹ
['\u1106', '\u11B7'], // ㅁ
['\u1107', '\u11B8'], // ㅂ
['\u1109', '\u11BA'], // ㅅ
['\u110A', '\u11BB'], // ㅆ
['\u110B', '\u11BC'], // ㅇ
['\u110C', '\u11BD'], // ㅈ
['\u110E', '\u11BE'], // ㅊ
['\u110F', '\u11BF'], // ㅋ
['\u1110', '\u11C0'], // ㅌ
['\u1111', '\u11C1'], // ㅍ
['\u1112', '\u11C2'], // ㅎ
// 아래는 완성형 문자
['ㄱ', '\u11A8'], // ㄱ
['ㄲ', '\u11A9'], ['ㄳ', '\u11AA'], ['ㄴ', '\u11AB'], // ㄴ
['ㄵ', '\u11AC'], ['ㄶ', '\u11AD'], ['ㄷ', '\u11AE'], // ㄷ
['ㄹ', '\u11AF'], // ㄹ
['ㄺ', '\u11B0'], ['ㄻ', '\u11B1'], ['ㄼ', '\u11B2'], ['ㄽ', '\u11B3'], ['ㄾ', '\u11B4'], ['ㄿ', '\u11B5'], ['ㅀ', '\u11B6'], ['ㅁ', '\u11B7'], // ㅁ
['ㅂ', '\u11B8'], // ㅂ
['ㅄ', '\u11B9'], ['ㅅ', '\u11BA'], // ㅅ
['ㅆ', '\u11BB'], // ㅆ
['ㅇ', '\u11BC'], // ㅇ
['ㅈ', '\u11BD'], // ㅈ
['ㅊ', '\u11BE'], // ㅊ
['ㅋ', '\u11BF'], // ㅋ
['ㅌ', '\u11C0'], // ㅌ
['ㅍ', '\u11C1'], // ㅍ
['ㅎ', '\u11C2'] // ㅎ
]));
/**
 * 주어진 문자열에서 알파벳이 발음되는 대로 국문 문자열로 표기하여 값으로 돌려줍니다.
 *
 * @param {!string} text 알파벳을 발음할 문자열
 * @returns {string} 국문 발음 표기된 문자열
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.alphaToHangul("갤럭시S"));
 */

exports.ChoToJong = ChoToJong;

function alphaToHangul(text) {
  return _jvm.JVM.koalaClassOf('ExtUtil').alphaToHangul(text).toString();
}
/**
 * 주어진 문자열에 적힌 알파벳 발음을 알파벳으로 변환하여 문자열로 반환합니다.
 * @param {!string} text 국문 발음 표기된 문자열
 * @returns {string} 영문 변환된 문자열
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.hangulToAlpah("갤럭시에스"));
 */


function hangulToAlpha(text) {
  return _jvm.JVM.koalaClassOf('ExtUtil').hangulToAlpha(text).toString();
}
/**
 * 주어진 문자열이 알파벳이 발음되는 대로 표기된 문자열인지 확인합니다.
 * @param {!string} text 확인할 문자열
 * @returns {boolean} 영문 발음으로만 구성되었다면 true
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.isAlphaPronounced("갤럭시에스"));
 */


function isAlphaPronounced(text) {
  return _jvm.JVM.koalaClassOf('ExtUtil').isAlphaPronounced(text);
}
/**
 * 문자열을 순회하면서 charFunction을 실행합니다.
 * @param {!string} text 순회할 문자열
 * @param charFunction 문자별로 실행할 함수
 * @returns {Array} 문자별 결과.
 * @private
 */


function stringRepeat(text, charFunction) {
  let result = [];

  for (let ch of text) {
    let res = charFunction(_jvm.JVM.char(ch));
    res = res === null ? undefined : res;
    result.push(res);
  }

  return result;
}
/**
 * 문자열의 각 문자가 한자 범위인지 확인합니다.
 * @param {!string} text 확인할 문자열
 * @returns {boolean[]} 문자열 문자의 위치마다 한자인지 아닌지를 표기한 리스트. 한자라면 True.
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.isHanja("貝波通水"));
 */


function isHanja(text) {
  return stringRepeat(text, _jvm.JVM.koalaClassOf('ExtUtil').isHanja);
}
/**
 * 현재 문자가 한중일 통합한자, 통합한자 확장 - A, 호환용 한자 범위인지 확인합니다.
 * (국사편찬위원회 한자음가사전은 해당 범위에서만 정의되어 있어, 별도 확인합니다.)
 *
 * @param {!string} text 확인할 문자열
 * @returns {boolean[]} 문자열 문자의 위치마다 한자인지 아닌지를 표기한 리스트. 한자라면 True.
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.isCJKHanja("貝波通水"));
 */


function isCJKHanja(text) {
  return stringRepeat(text, _jvm.JVM.koalaClassOf('ExtUtil').isCJKHanja);
}
/**
 * 국사편찬위원회 한자음가사전에 따라 한자 표기된 내용을 국문 표기로 전환합니다.
 *
 * 참고:
 *
 * * [headCorrection] 값이 true인 경우, whitespace에 따라오는 문자에 두음법칙을 자동 적용함. (기본값 true)
 * * 단, 다음 의존명사는 예외: 냥(兩), 년(年), 리(里), 리(理), 량(輛)
 * * 다음 두음법칙은 사전을 조회하지 않기 때문에 적용되지 않음에 유의
 *   - 한자 파생어나 합성어에서 원 단어의 두음법칙: 예) "신여성"이 옳은 표기이나 "신녀성"으로 표기됨
 *   - 외자가 아닌 이름: 예) "허난설헌"이 옳은 표기이나 "허란설헌"으로 표기됨
 *
 * @param {!string} text 국문 표기로 전환할 문자열
 * @param {boolean} [headCorrection=true] 두음법칙 적용 여부
 * @returns {string} 국문 표기로 전환된 문자열
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.hanjaToHangul("貝波通水"));
 */


function hanjaToHangul(text, headCorrection = true) {
  return _jvm.JVM.koalaClassOf('ExtUtil').hanjaToHangul(text, headCorrection).toString();
}
/**
 * 현재 문자가 초성, 중성, 종성(선택적)을 다 갖춘 문자인지 확인합니다.
 *
 * @param {!string} text 확인할 문자열
 * @returns {boolean[]} 문자열 문자의 위치마다 확인여부를 표기한 리스트. 맞다면 True.
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.isCompleteHangul("Sing! 노래하라"));
 */


function isCompleteHangul(text) {
  return stringRepeat(text, _jvm.JVM.koalaClassOf('ExtUtil').isCompleteHangul);
}
/**
 * 현재 문자가 불완전한 한글 문자인지 확인합니다.
 *
 * @param {!string} text 확인할 문자열
 * @returns {boolean[]} 문자열 문자의 위치마다 확인여부를 표기한 리스트. 맞다면 True.
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.isIncompleteHangul("Sing! 노래하라"));
 */


function isIncompleteHangul(text) {
  return stringRepeat(text, _jvm.JVM.koalaClassOf('ExtUtil').isIncompleteHangul);
}
/**
 * 현재 문자가 한글 완성형 또는 조합용 문자인지 확인합니다.
 *
 * @param {!string} text 확인할 문자열
 * @returns {boolean[]} 문자열 문자의 위치마다 확인여부를 표기한 리스트. 맞다면 True.
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.isHangul("Sing! 노래하라"));
 */


function isHangul(text) {
  return stringRepeat(text, _jvm.JVM.koalaClassOf('ExtUtil').isHangul);
}
/**
 * 현재 문자열이 한글 (완성/조합)로 끝나는지 확인합니다.
 *
 * @param {!string} text 확인할 문자열
 * @returns {boolean} 맞다면 True.
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.isHangulEnding("Sing! 노래하라"));
 */


function isHangulEnding(text) {
  return _jvm.JVM.koalaClassOf('ExtUtil').isHangulEnding(text);
}
/**
 * 현재 문자가 현대 한글 초성 자음 문자인지 확인합니다.
 *
 * @param {!string} text 확인할 문자열
 * @returns {boolean[]} 문자열 문자의 위치마다 확인여부를 표기한 리스트. 맞다면 True.
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.isChosungJamo("\u1100"));
 */


function isChosungJamo(text) {
  return stringRepeat(text, _jvm.JVM.koalaClassOf('ExtUtil').isChosungJamo);
}
/**
 * 현재 문자가 현대 한글 중성 모음 문자인지 확인합니다.
 *
 * @param {!string} text 확인할 문자열
 * @returns {boolean[]} 문자열 문자의 위치마다 확인여부를 표기한 리스트. 맞다면 True.
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.isJungsungJamo("\u1161"));
 */


function isJungsungJamo(text) {
  return stringRepeat(text, _jvm.JVM.koalaClassOf('ExtUtil').isJungsungJamo);
}
/**
 * 현재 문자가 현대 한글 종성 자음 문자인지 확인합니다.
 *
 * @param {!string} text 확인할 문자열
 * @returns {boolean[]} 문자열 문자의 위치마다 확인여부를 표기한 리스트. 맞다면 True.
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.isJungsungJamo("\u11A8"));
 */


function isJongsungJamo(text) {
  return stringRepeat(text, _jvm.JVM.koalaClassOf('ExtUtil').isJongsungJamo);
}
/**
 * 현재 문자열이 종성으로 끝인지 확인합니다.
 *
 * @param {!string} text 확인할 문자열
 * @returns {boolean} 맞다면 True.
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.isJongsungEnding("Sing! 노래하라"));
 */


function isJongsungEnding(text) {
  return _jvm.JVM.koalaClassOf('ExtUtil').isJongsungEnding(text);
}
/**
 * 현재 문자에서 초성 자음문자를 분리합니다. 초성이 없으면 None.
 * @param {!string} text 분리할 문자열
 * @returns {string[]} 분리된 각 초성이 들어간 리스트.
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.getChosung("제주도의 푸른 밤"));
 */


function getChosung(text) {
  return stringRepeat(text, _jvm.JVM.koalaClassOf('ExtUtil').getChosung);
}
/**
 * 현재 문자에서 중성 모음문자를 분리합니다. 중성이 없으면 None.
 * @param {!string} text 분리할 문자열
 * @returns {string[]} 분리된 각 중성이 들어간 리스트.
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.getJungsung("제주도의 푸른 밤"));
 */


function getJungsung(text) {
  return stringRepeat(text, _jvm.JVM.koalaClassOf('ExtUtil').getJungsung);
}
/**
 * 현재 문자에서 종성 자음문자를 분리합니다. 종성이 없으면 None.
 * @param {!string} text 분리할 문자열
 * @returns {string[]} 분리된 각 종성이 들어간 리스트.
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.getJongsung("제주도의 푸른 밤"));
 */


function getJongsung(text) {
  return stringRepeat(text, _jvm.JVM.koalaClassOf('ExtUtil').getJongsung);
}
/**
 * 현재 문자열을 초성, 중성, 종성 자음문자로 분리하여 새 문자열을 만듭니다. 종성이 없으면 종성은 쓰지 않습니다.
 * @param {string} text 분해할 문자열
 * @returns {string} 분해된 문자열
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.dissembleHangul("제주도의 푸른 밤"));
 */


function dissembleHangul(text) {
  return _jvm.JVM.koalaClassOf('ExtUtil').dissembleHangul(text).toString();
}
/**
 * 초성을 [cho] 문자로, 중성을 [jung] 문자로, 종성을 [jong] 문자로 갖는 한글 문자를 재구성합니다.
 *
 * @param {string} [cho=undefined] 초성 문자. (0x1100-1112) 기본값 ㅇ 자모
 * @param {string} [jung=undefined] 중성 문자, (0x1161-1175) 기본값 ㅡ 자모
 * @param {string} [jong=undefined] 종성 문자, (0x11a8-11c2) 기본값 종성 없음
 * @returns {string} 초성, 중성, 종성을 조합하여 문자를 만듭니다.
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.assembleHangulTriple('\u1100', '\u1161', '\u11A8'));
 */


function assembleHangulTriple(cho = undefined, jung = undefined, jong = undefined) {
  return _jvm.JVM.koalaClassOf('ExtUtil').assembleHangul(_jvm.JVM.char(cho), _jvm.JVM.char(jung), _jvm.JVM.char(jong));
}
/**
 * 주어진 문자열에서 초성, 중성, 종성이 연달아 나오는 경우 이를 조합하여 한글 문자를 재구성합니다.
 *
 * @param {string} text 조합할 문자열
 * @returns {string} 조합형 문자들이 조합된 문자열. 조합이 불가능한 문자는 그대로 남습니다.
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.assembleHangul("제주도의 푸른 밤인 \u1100\u1161\u11A8"));
 */


function assembleHangul(text) {
  return _jvm.JVM.koalaClassOf('ExtUtil').assembleHangulString(text).toString();
}
/**
 * 주어진 용언의 원형 [verb]이 뒷 부분 [rest]와 같이 어미가 붙어 활용될 때, 불규칙 활용 용언과 모음조화를 교정합니다.
 *
 * @param {string} verb 용언 원형인 어근을 표현한 String. '-다.' 와 같은 어미는 없는 어근 상태입니다.
 * @param {boolean} isVerb 동사인지 형용사인지 나타내는 지시자. 동사이면 true.
 * @param {string} rest 어근에 붙일 어미를 표현한 String.
 * @returns {string} 모음조화나 불규칙 활용이 교정된 원형+어미 결합
 * @example
 * import * as ExtUtil from 'koalanlp/ExtUtil';
 * console.log(ExtUtil.correctVerbApply("밀리",true,"어"));
 */


function correctVerbApply(verb, isVerb, rest) {
  return _jvm.JVM.koalaClassOf('ExtUtil').correctVerbApply(verb, isVerb, rest);
}