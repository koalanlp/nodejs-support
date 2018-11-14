/**
 * 분석기 API 목록.
 * @readonly
 * @property {string} HNN 한나눔 분석기.
 * @property {string} EUNJEON 은전한닢(Mecab) 분석기.
 * @property {string} KMR 코모란 분석기.
 * @property {string} KKMA 꼬꼬마 분석기.
 * @property {string} OKT OpenKoreanText 분석기.
 * @property {string} ARIRANG 아리랑 분석기.
 * @property {string} RHINO 라이노 분석기.
 * @property {string} ETRI ETRI open API 분석기
 * @property {string} DAON 다온 분석기.
 */
export const API = Object.seal({
    HNN: 'hnn',
    KMR: 'kmr',
    KKMA: 'kkma',
    EUNJEON: 'eunjeon',
    ARIRANG: 'arirang',
    RHINO: 'rhino',
    OKT: 'okt',
    ETRI: 'etri',
    DAON: 'daon'
});

/**
 * Assert method
 *
 * @private
 * @param cond Condition to be checked.
 * @param msg Message to be thrown if condition check is failed.
 * @param reject Function if assert is using inside of a Promise.
 */
export let _assert = function(cond, msg, reject){
    if(!cond) {
        if (!reject) throw new Error(msg ? msg : "Assertion failed!");
        else reject(new Error(msg ? msg : "Assertion failed!"));
    }
};