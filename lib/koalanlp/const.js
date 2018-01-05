'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 분석기 종류
 * @property {string} HANNANUM 한나눔 분석기 API
 * @property {string} KOMORAN 코모란 분석기 API.
 * @property {string} KKMA 꼬꼬마 분석기 API.
 * @property {string} EUNJEON 은전한닢 분석기 API.
 * @property {string} ARIRANG 아리랑 분석기 API.
 * @property {string} RHINO 라이노 분석기 API.
 * @property {string} TWITTER 오픈한글 분석기 API.
 * @type {Object}
 */
var TYPES = exports.TYPES = Object.seal({
  HANNANUM: 'hnn',
  KOMORAN: 'kmr',
  KKMA: 'kkma',
  EUNJEON: 'eunjeon',
  ARIRANG: 'arirang',
  RHINO: 'rhino',
  TWITTER: 'twt'
});