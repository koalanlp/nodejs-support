"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UTagger = exports.Dictionary = exports.RoleLabeler = exports.EntityRecognizer = exports.Parser = exports.Tagger = exports.SentenceSplitter = void 0;

var _jvm = require("./jvm");

var API = _interopRequireWildcard(require("./API"));

var _types = require("./types");

var _data = require("./data");

var _common = require("./common");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * POSFilter 함수
 * @callback POSFilter
 * @param {!POS} tag 검사할 품사 태그
 * @return {boolean} 해당하면 true.
 */

/**
 * 형태소 사전 항목. {'surface':형태소, 'tag':품사}
 * @typedef {Object} DicEntry
 * @property {!string} surface 형태소 표면형
 * @property {!POS} tag 형태소 품사
 */

/**
 * Build a Function Proxy object
 * @param {Object} thisObj
 * @param {!string} method
 * @returns {Object}
 * @private
 */
function assignProxy(thisObj, method) {
  if (method.endsWith('Sync')) return new Proxy(thisObj, {
    apply: function (target, thisArg, argArray) {
      return target[method](...argArray);
    }
  });else return new Proxy(thisObj, {
    apply: async function (target, thisArg, argArray) {
      return await target[method](...argArray);
    }
  });
}
/**
 * 문장분리기 Wrapper입니다.
 * @example
 * import { SentenceSplitter } from 'koalanlp/proc';
 * import { OKT } from 'koalanlp/API';
 *
 * let splitter = new SentenceSplitter(OKT);
 * splitter("문장을 분리해봅니다. 이렇게요.");
 */


class SentenceSplitter extends Function {
  /**
   * Java API Object
   * @type {Object}
   * @private
   */

  /**
   * 문장분리기를 생성합니다.
   *
   * @param {!API} api 문장분리기 API 패키지.
   * @param {Object} [options={}] 기타 설정
   * @param {boolean} [options.isAsyncDefault=true] 객체를 함수처럼 사용할 때, 즉 processor("문장")과 같이 사용할 때, 기본 호출을 async로 할 지 선택합니다. 기본값은 Asynchronous 호출입니다.
   */
  constructor(api, options = {}) {
    super();

    _defineProperty(this, "_api", null);

    this._api = API.query(api, this.constructor.name)();
    options.isAsyncDefault = (0, _common.isDefined)(options.isAsyncDefault) ? options.isAsyncDefault : true;
    return assignProxy(this, options.isAsyncDefault ? 'sentences' : 'sentencesSync');
  }
  /**
   * 문단을 문장으로 분리합니다. (Asynchronous)
   * @param {...!string} text 분석할 문단들 (가변인자)
   * @returns {string[]} 분리한 문장들.
   */


  async sentences(...text) {
    let result = [];

    for (let paragraph of text) {
      if (Array.isArray(paragraph)) {
        result.push(...(await this.sentences(...paragraph)));
      } else {
        if (paragraph.trim().length == 0) continue;
        let promiseResult = await this._api.sentencesPromise(paragraph);
        result.push(..._jvm.JVM.toJsArray(promiseResult));
      }
    }

    return result;
  }
  /**
   * 문단을 문장으로 분리합니다. (Synchronous)
   * @param {...!string} text 분석할 문단들 (가변인자)
   * @returns {string[]} 분리한 문장들.
   */


  sentencesSync(...text) {
    let result = [];

    for (let paragraph of text) {
      if (Array.isArray(paragraph)) {
        result.push(...this.sentencesSync(...paragraph));
      } else {
        if (paragraph.trim().length == 0) continue;
        result.push(..._jvm.JVM.toJsArray(this._api.sentences(paragraph)));
      }
    }

    return result;
  }
  /**
   * KoalaNLP가 구현한 문장분리기를 사용하여, 문단을 문장으로 분리합니다. (Asynchronous)
   * @param {Word[]} paragraph 분석할 문단. (품사표기가 되어있어야 합니다)
   * @returns {Sentence} 분리된 문장
   */


  static async sentences(paragraph) {
    let sent = [];

    for (let word of paragraph) {
      sent.push(word.getReference());
    }

    let promiseResult = await _jvm.JVM.koalaClassOf('proc', 'SentenceSplitter').INSTANCE.sentencesPromise(sent);
    return _jvm.JVM.toJsArray(promiseResult, x => new _data.Sentence(x));
  }
  /**
   * KoalaNLP가 구현한 문장분리기를 사용하여, 문단을 문장으로 분리합니다. (Synchronous)
   * @param {Word[]} paragraph 분석할 문단. (품사표기가 되어있어야 합니다)
   * @returns {Sentence} 분리된 문장
   */


  static sentencesSync(paragraph) {
    let sent = [];

    for (let word of paragraph) {
      sent.push(word.getReference());
    }

    return _jvm.JVM.toJsArray(_jvm.JVM.koalaClassOf('proc', 'SentenceSplitter').INSTANCE.sentences(sent), x => new _data.Sentence(x));
  }

}
/**
 * 형태소 분석기
 *
 * ## 참고
 *
 * **형태소** 는 의미를 가지는 요소로서는 더 이상 분석할 수 없는 가장 작은 말의 단위로 정의됩니다.
 *
 * **형태소 분석** 은 문장을 형태소의 단위로 나누는 작업을 의미합니다.
 *
 * 예) '문장을 형태소로 나눠봅시다'의 경우,
 *
 * * 문장/일반명사, -을/조사,
 * * 형태소/일반명사, -로/조사,
 * * 나누-(다)/동사, -어-/어미, 보-(다)/동사, -ㅂ시다/어미
 *
 * 로 대략 나눌 수 있습니다.
 *
 * 아래를 참고해보세요.
 *
 * * {@link module:koalanlp/data.Morpheme|Morpheme} 형태소를 저장하는 형태.
 * * {@link module:koalanlp/types.POS|POS} 형태소의 분류를 담은 Enum class
 *
 * @example
 * import { Tagger } from 'koalanlp/proc';
 * import { KMR } from 'koalanlp/API';
 *
 * let tagger = new Tagger(KMR);
 * tagger("문장을 분석해봅니다. 이렇게요.");
 */


exports.SentenceSplitter = SentenceSplitter;

class Tagger extends Function {
  /**
   * Java API Object
   * @type {Object}
   * @private
   */

  /**
   * 품사분석기를 초기화합니다.
   *
   * @param {!API} api 사용할 품사분석기의 유형.
   * @param {Object} [options={}]
   * @param {string} [options.apiKey=''] ETRI 분석기의 경우, ETRI에서 발급받은 API Key (2.2.0에서 삭제 예정)
   * @param {string} [options.etriKey=''] ETRI 분석기의 경우, ETRI에서 발급받은 API Key
   * @param {boolean} [options.useLightTagger=false] 코모란(KMR) 분석기의 경우, 경량 분석기를 사용할 것인지의 여부. (2.2.0에서 삭제 예정)
   * @param {boolean} [options.kmrLight=false] 코모란(KMR) 분석기의 경우, 경량 분석기를 사용할 것인지의 여부.
   * @param {string} [options.khaResource=''] Khaiii 분석기의 경우, 리소스 파일이 위치한 폴더.
   * @param {string} [options.khaPreanal=true] Khaiii 분석기의 경우, 기분석 사전을 사용할지의 여부.
   * @param {string} [options.khaErrorpatch=true] Khaiii 분석기의 경우, 오분석 사전 사용 여부
   * @param {string} [options.khaRestore=true] Khaiii 분석기의 경우, 형태소 재구성 여부
   * @param {boolean} [options.isAsyncDefault=true] 객체를 함수처럼 사용할 때, 즉 processor("문장")과 같이 사용할 때, 기본 호출을 async로 할 지 선택합니다. 기본값은 Asynchronous 호출입니다.
   */
  constructor(api, options = {}) {
    super();

    _defineProperty(this, "_api", null);

    if (api === API.ETRI) {
      if (options.apiKey) {
        console.warn(`2.2.0부터 ${this.constructor.name}의 키워드 인자 "apiKey"가 삭제될 예정입니다. 2.1.0부터 추가된 인자인 "etriKey"를 사용해주세요.`);
        options.etriKey = options.apiKey;
      }

      let etriKey = options.etriKey || '';

      if (!options.etriKey) {
        console.error(`${this.constructor.name}(API.ETRI)는 키워드 인자 "etriKey"가 필요합니다. ETRI OpenAI hub에서 키를 발급받으세요.`);
        throw Error('etriKey 값이 비어있음');
      }

      this._api = API.query(api, this.constructor.name)(etriKey);
    } else if (api === API.KMR) {
      if (options.useLightTagger) {
        console.warn(`2.2.0부터 ${this.constructor.name}의 키워드 인자 "useLightTagger"가 삭제될 예정입니다. 2.1.0부터 추가된 인자인 "kmrLight"를 사용해주세요.`);
        options.kmrLight = options.useLightTagger;
      }

      let useLightTagger = options.kmrLight || false;
      this._api = API.query(api, this.constructor.name)(useLightTagger);
    } else if (api === API.KHAIII) {
      let config = _jvm.JVM.koalaClassOf('khaiii', 'KhaiiiConfig')(options.khaPreanal || true, options.khaErrorpatch || true, options.khaRestore || true);

      let rsc = options.khaResource || '';

      if (!options.khaResource) {
        console.error(`${this.constructor.name}(API.KHAIII)는 키워드 인자 "khaResource"가 필요합니다. 리소스 파일 위치를 지정해주세요.`);
        throw Error('khaResource 값이 비어있음');
      }

      this._api = API.query(api, this.constructor.name)(rsc, config);
    } else {
      this._api = API.query(api, this.constructor.name)();
    }

    options.isAsyncDefault = (0, _common.isDefined)(options.isAsyncDefault) ? options.isAsyncDefault : true;
    return assignProxy(this, options.isAsyncDefault ? 'tag' : 'tagSync');
  }
  /**
   * 문단(들)을 품사분석합니다. (Asynchronous)
   * @param {...(string|string[])} text 분석할 문단들. 텍스트와 string 리스트 혼용 가능. (가변인자)
   * @returns {Sentence[]} 분석된 결과 (Flattened list)
   */


  async tag(...text) {
    let result = [];

    for (let paragraph of text) {
      let promiseResult;

      if (Array.isArray(paragraph)) {
        promiseResult = await this.tag(...paragraph);
        result.push(...promiseResult);
      } else {
        if (paragraph.trim().length == 0) continue;
        promiseResult = await this._api.tagPromise(paragraph);
        result.push(..._jvm.JVM.toJsArray(promiseResult, x => new _data.Sentence(x)));
      }
    }

    return result;
  }
  /**
   * 문단(들)을 품사분석합니다. (Synchronous)
   * @param {...(string|string[])} text 분석할 문단들. 텍스트와 string 리스트 혼용 가능. (가변인자)
   * @returns {Sentence[]} 분석된 결과 (Flattened list)
   */


  tagSync(...text) {
    let result = [];

    for (let paragraph of text) {
      if (Array.isArray(paragraph)) {
        result.push(...this.tagSync(...paragraph));
      } else {
        if (paragraph.trim().length == 0) continue;
        result.push(..._jvm.JVM.toJsArray(this._api.tag(paragraph), x => new _data.Sentence(x)));
      }
    }

    return result;
  }
  /**
   * 문장을 품사분석합니다. 각 인자 하나를 하나의 문장으로 간주합니다. (Asynchronous)
   *
   * @param {...!string} text 분석할 문장(들). (가변인자)
   * @returns {Sentence[]} 분석된 결과.
   */


  async tagSentence(...text) {
    let result = [];

    for (let sentence of text) {
      let promiseResult;

      if (Array.isArray(sentence)) {
        promiseResult = await this.tagSentence(...sentence);
        result.push(...promiseResult);
      } else {
        if (sentence.trim().length == 0) continue;
        promiseResult = await this._api.tagSentencePromise(sentence);
        result.push(new _data.Sentence(promiseResult));
      }
    }

    return result;
  }
  /**
   * 문장을 품사분석합니다. 각 인자 하나를 하나의 문장으로 간주합니다. (Synchronous)
   *
   * @param {...!string} text 분석할 문장(들). (가변인자)
   * @returns {Sentence[]} 분석된 결과.
   */


  tagSentenceSync(...text) {
    let result = [];

    for (let sentence of text) {
      if (Array.isArray(sentence)) {
        result.push(...this.tagSentenceSync(...sentence));
      } else {
        if (sentence.trim().length == 0) continue;
        result.push(new _data.Sentence(this._api.tagSentence(sentence)));
      }
    }

    return result;
  }

}
/**
 * 문장 속성 부착기 Wrapper
 * @private
 */


exports.Tagger = Tagger;

class CanAnalyzeProperty extends Function {
  /**
   * Java API Object
   * @type {Object}
   * @private
   */

  /**
   * 특성 부착형 분석기를 초기화합니다.
   *
   * @param {!API} api 사용할 분석기의 유형.
   * @param {!string} cls 사용할 클래스 유형.
   * @param {Object=} options
   * @param {string} options.apiKey ETRI 분석기의 경우, ETRI에서 발급받은 API Key (2.2.0에서 삭제 예정)
   * @param {string} options.etriKey ETRI 분석기의 경우, ETRI에서 발급받은 API Key
   * @param {boolean} [options.isAsyncDefault=true] 객체를 함수처럼 사용할 때, 즉 processor("문장")과 같이 사용할 때, 기본 호출을 async로 할 지 선택합니다. 기본값은 Asynchronous 호출입니다.
   */
  constructor(api, cls, options = {}) {
    super();

    _defineProperty(this, "_api", null);

    if (api === API.ETRI) {
      if (options.apiKey) {
        console.warn(`2.2.0부터 ${this.constructor.name}의 키워드 인자 "apiKey"가 삭제될 예정입니다. 2.1.0부터 추가된 인자인 "etriKey"를 사용해주세요.`);
        options.etriKey = options.apiKey;
      }

      let etriKey = options.etriKey || '';

      if (!options.etriKey) {
        console.error(`${this.constructor.name}(API.ETRI)는 키워드 인자 "etriKey"가 필요합니다. ETRI OpenAI hub에서 키를 발급받으세요.`);
        throw Error('etriKey 값이 비어있음');
      }

      this._api = API.query(api, cls)(etriKey);
    } else {
      this._api = API.query(api, cls)();
    }

    options.isAsyncDefault = (0, _common.isDefined)(options.isAsyncDefault) ? options.isAsyncDefault : true;
    return assignProxy(this, options.isAsyncDefault ? 'analyze' : 'analyzeSync');
  }
  /**
   * 문단(들)을 분석합니다. (Asynchronous)
   *
   * @param {...(string|Sentence|string[]|Sentence[])} text 분석할 문단(들).
   * 각 인자는 텍스트(str), 문장 객체(Sentence), 텍스트의 리스트, 문장 객체의 리스트 혼용 가능 (가변인자)
   * @returns {Sentence[]} 분석된 결과 (Flattened list)
   */


  async analyze(...text) {
    let result = [];

    for (let paragraph of text) {
      let promiseResult;

      if (paragraph instanceof _data.Sentence) {
        promiseResult = await this._api.analyzePromise(paragraph.reference);
        result.push(new _data.Sentence(promiseResult));
      } else if (Array.isArray(paragraph)) {
        promiseResult = await this.analyze(...paragraph);
        result.push(...promiseResult);
      } else {
        if (paragraph.trim().length == 0) continue;
        promiseResult = await this._api.analyzePromise(paragraph);
        result.push(..._jvm.JVM.toJsArray(promiseResult, x => new _data.Sentence(x)));
      }
    }

    return result;
  }
  /**
   * 문단(들)을 분석합니다. (Synchronous)
   *
   * @param {...(string|Sentence|string[]|Sentence[])} text 분석할 문단(들).
   * 각 인자는 텍스트(str), 문장 객체(Sentence), 텍스트의 리스트, 문장 객체의 리스트 혼용 가능 (가변인자)
   * @returns {Sentence[]} 분석된 결과 (Flattened list)
   */


  analyzeSync(...text) {
    let result = [];

    for (let paragraph of text) {
      if (paragraph instanceof _data.Sentence) {
        result.push(new _data.Sentence(this._api.analyze(paragraph.reference)));
      } else if (Array.isArray(paragraph)) {
        result.push(...this.analyzeSync(...paragraph));
      } else {
        if (paragraph.trim().length == 0) continue;
        result.push(..._jvm.JVM.toJsArray(this._api.analyze(paragraph), x => new _data.Sentence(x)));
      }
    }

    return result;
  }

}
/**
 * 구문구조/의존구조 분석기 Wrapper
 *
 * ## 참고
 *
 * **구문구조 분석** 은 문장의 구성요소들(어절, 구, 절)이 이루는 문법적 구조를 분석하는 방법입니다.
 *
 * 예) '나는 밥을 먹었고, 영희는 짐을 쌌다'라는 문장에는 2개의 절이 있습니다
 *
 * * 나는 밥을 먹었고
 * * 영희는 짐을 쌌다
 *
 * 각 절은 3개의 구를 포함합니다
 *
 * * 나는, 밥을, 영희는, 짐을: 체언구
 * * 먹었고, 쌌다: 용언구
 *
 * **의존구조 분석** 은 문장의 구성 어절들이 의존 또는 기능하는 관계를 분석하는 방법입니다.
 *
 * 예) '나는 밥을 먹었고, 영희는 짐을 쌌다'라는 문장에는
 *
 * 가장 마지막 단어인 '쌌다'가 핵심 어구가 되며,
 *
 * * '먹었고'가 '쌌다'와 대등하게 연결되고
 * * '나는'은 '먹었고'의 주어로 기능하며
 * * '밥을'은 '먹었고'의 목적어로 기능합니다.
 * * '영희는'은 '쌌다'의 주어로 기능하고,
 * * '짐을'은 '쌌다'의 목적어로 기능합니다.
 *
 * 아래를 참고해보세요.
 *
 * * {@link module:koalanlp/data.Word#phrase|Word#phrase} 어절이 속한 직속 상위 구구조(Phrase)를 돌려주는 API.
 * * {@link module:koalanlp/data.Word#governorEdge|Word#governorEdge} 어절이 지배당하는 상위 의존구조 [DepEdge]를 가져오는 API
 * * {@link module:koalanlp/data.Word#dependentEdges|Word#dependentEdges} 어절이 직접 지배하는 하위 의존구조 [DepEdge]의 목록를 가져오는 API
 * * {@link module:koalanlp/data.Sentence#syntaxTree|Sentence#syntaxTree} 전체 문장을 분석한 [SyntaxTree]를 가져오는 API
 * * {@link module:koalanlp/data.Sentence#dependencies|Sentence#dependencies} 전체 문장을 분석한 의존구조 [DepEdge]의 목록을 가져오는 API
 * * {@link module:koalanlp/data.SyntaxTree|SyntaxTree} 구문구조를 저장하는 형태
 * * {@link module:koalanlp/data.DepEdge|DepEdge} 의존구문구조의 저장형태
 * * {@link module:koalanlp/types.PhraseTag|PhraseTag} 의존구조의 형태 분류를 갖는 Enum 값 (구구조 분류와 같음)
 * * {@link module:koalanlp/types.DependencyTag|DependencyTag} 의존구조의 기능 분류를 갖는 Enum 값
 *
 * @inheritDoc
 * @example
 * import { Parser } from 'koalanlp/proc';
 * import { HNN } from 'koalanlp/API';
 *
 * let parser = new Parser(HNN);
 * parser("문장을 분석해봅니다. 이렇게요.");
 */


class Parser extends CanAnalyzeProperty {
  /**
   * 구문구조/의존구조분석기를 초기화합니다.
   *
   * @param {!API} api 사용할 분석기의 유형.
   * @param {Object=} options
   * @param {string} options.apiKey ETRI 분석기의 경우, ETRI에서 발급받은 API Key (2.2.0에서 삭제 예정)
   * @param {string} options.etriKey ETRI 분석기의 경우, ETRI에서 발급받은 API Key
   * @param {boolean} [options.isAsyncDefault=true] 객체를 함수처럼 사용할 때, 즉 processor("문장")과 같이 사용할 때, 기본 호출을 async로 할 지 선택합니다. 기본값은 Asynchronous 호출입니다.
   */
  constructor(api, options = {}) {
    super(api, 'Parser', options);
  }

}
/**
 * 개체명 인식기 Wrapper
 *
 * ## 참고
 *
 * **개체명 인식** 은 문장에서 인물, 장소, 기관, 대상 등을 인식하는 기술입니다.
 *
 * 예) '철저한 진상 조사를 촉구하는 국제사회의 목소리가 커지고 있는 가운데, 트럼프 미국 대통령은 되레 사우디를 감싸고 나섰습니다.'에서, 다음을 인식하는 기술입니다.
 *
 * * '트럼프': 인물
 * * '미국' : 국가
 * * '대통령' : 직위
 * * '사우디' : 국가
 *
 * 아래를 참고해보세요.
 *
 * * {@link module:koalanlp/data.Morpheme#entities|Morpheme#entities} 형태소를 포함하는 모든 [Entity]를 가져오는 API
 * * {@link module:koalanlp/data.Word#entities|Word#entities} 어절을 포함하는 모든 [Entity]를 가져오는 API
 * * {@link module:koalanlp/data.Sentence#entities|Sentence#entities} 문장에 포함된 모든 [Entity]를 가져오는 API
 * * {@link module:koalanlp/data.Entity|Entity} 개체명을 저장하는 형태
 * * {@link module:koalanlp/types.CoarseEntityType|CoarseEntityType} [Entity]의 대분류 개체명 분류구조 Enum 값
 *
 * @inheritDoc
 * @example
 * import { EntityRecognizer } from 'koalanlp/proc';
 * import { ETRI } from 'koalanlp/API';
 *
 * let parser = new EntityRecognizer(ETRI);
 * parser("문장을 분석해봅니다. 이렇게요.");
 */


exports.Parser = Parser;

class EntityRecognizer extends CanAnalyzeProperty {
  /**
   * 개체명 인식기를 초기화합니다.
   *
   * @param {!API} api 사용할 분석기의 유형.
   * @param {Object=} options
   * @param {string} options.apiKey ETRI 분석기의 경우, ETRI에서 발급받은 API Key (2.2.0에서 삭제 예정)
   * @param {string} options.etriKey ETRI 분석기의 경우, ETRI에서 발급받은 API Key
   * @param {boolean} [options.isAsyncDefault=true] 객체를 함수처럼 사용할 때, 즉 processor("문장")과 같이 사용할 때, 기본 호출을 async로 할 지 선택합니다. 기본값은 Asynchronous 호출입니다.
   */
  constructor(api, options = {}) {
    super(api, 'EntityRecognizer', options);
    return assignProxy(this, 'analyze');
  }

}
/**
 * 의미역 분석기 Wrapper
 *
 * ## 참고
 *
 * **의미역 결정** 은 문장의 구성 어절들의 역할/기능을 분석하는 방법입니다.
 *
 * 예) '나는 밥을 어제 집에서 먹었다'라는 문장에는
 *
 * 동사 '먹었다'를 중심으로
 *
 * * '나는'은 동작의 주체를,
 * * '밥을'은 동작의 대상을,
 * * '어제'는 동작의 시점을
 * * '집에서'는 동작의 장소를 나타냅니다.
 *
 * 아래를 참고해보세요.
 *
 * * {@link module:koalanlp/data.Word#predicateRoles|Word#predicateRoles} 어절이 논항인 [RoleEdge]의 술어를 가져오는 API
 * * {@link module:koalanlp/data.Word#argumentRoles|Word#argumentRoles} 어절이 술어인 [RoleEdge]의 논항들을 가져오는 API
 * * {@link module:koalanlp/data.Sentence#roles|Sentence#roles} 전체 문장을 분석한 의미역 구조 [RoleEdge]를 가져오는 API
 * * {@link module:koalanlp/data.RoleEdge|RoleEdge} 의미역 구조를 저장하는 형태
 * * {@link module:koalanlp/types.RoleType|RoleType} 의미역 분류를 갖는 Enum 값
 *
 * @inheritDoc
 * @example
 * import { RoleLabeler } from 'koalanlp/proc';
 * import { ETRI } from 'koalanlp/API';
 *
 * let parser = new RoleLabeler(ETRI);
 * parser("문장을 분석해봅니다. 이렇게요.");
 */


exports.EntityRecognizer = EntityRecognizer;

class RoleLabeler extends CanAnalyzeProperty {
  /**
   * 의미역 분석기를 초기화합니다.
   *
   * @param {!API} api 사용할 분석기의 유형.
   * @param {Object=} options
   * @param {string} options.apiKey ETRI 분석기의 경우, ETRI에서 발급받은 API Key (2.2.0에서 삭제 예정)
   * @param {string} options.etriKey ETRI 분석기의 경우, ETRI에서 발급받은 API Key
   * @param {boolean} [options.isAsyncDefault=true] 객체를 함수처럼 사용할 때, 즉 processor("문장")과 같이 사용할 때, 기본 호출을 async로 할 지 선택합니다. 기본값은 Asynchronous 호출입니다.
   */
  constructor(api, options = {}) {
    super(api, 'RoleLabeler', options);
    return assignProxy(this, 'analyze');
  }

}
/**
 * Java 사전 항목을 JS 사전 항목으로 변환.
 * @param entry Java 사전 항목
 * @return {DicEntry} JS 사전 항목
 * @private
 */


exports.RoleLabeler = RoleLabeler;

function readDicEntry(entry) {
  return {
    'surface': entry.getFirst(),
    'tag': _types.POS.withName(entry.getSecond().name())
  };
}
/**
 * 사전 Wrapper
 * @example
 * import { Dictionary } from 'koalanlp/proc';
 * import { KKMA } from 'koalanlp/API';
 *
 * let dict = Dictionary(KKMA);
 * dict.addUserDictionary({'surface': "하림"});
 */


class Dictionary {
  /**
   * Java API Object
   * @type {Object}
   * @private
   */

  /**
   * 사용자 정의 사전을 연결합니다.
   *
   * @param {!API} api 사용자 정의 사전을 연결할 API 패키지.
   */
  constructor(api) {
    _defineProperty(this, "_api", null);

    this._api = API.query(api, 'Dictionary').INSTANCE;
  }
  /**
   * 사용자 사전에, 표면형과 그 품사를 추가.
   * @param {...DicEntry} pairs 추가할 형태소와 품사들. (가변인자)
   */


  addUserDictionary(...pairs) {
    let surfaceList = [];
    let tagList = [];

    for (let pair of pairs) {
      surfaceList.push(pair.surface);
      let tag = pair.tag ? pair.tag.reference : _types.POS.NNP.reference;
      tagList.push(tag);
    }

    this._api.addUserDictionary(_jvm.JVM.listOf(surfaceList), _jvm.JVM.listOf(tagList));
  }
  /**
   * 사전에 등재되어 있는지 확인합니다.
   * @param {string} word 확인할 형태소
   * @param {POS} posTags 세종품사들(기본값: NNP 고유명사, NNG 일반명사)
   * @returns {boolean} 사전에 포함된다면 True 아니면 False.
   */


  contains(word, ...posTags) {
    let tags = posTags.length > 0 ? posTags : [_types.POS.NNP, _types.POS.NNG];

    if (tags.length === 1) {
      let tag = tags[0];
      return this._api.contains(_jvm.JVM.pair(word, tag.reference));
    } else {
      let tagsRef = tags.map(tag => tag.reference);
      return this._api.contains(word, _jvm.JVM.setOf(tagsRef));
    }
  }
  /**
   * 다른 사전을 참조하여, 선택된 사전에 없는 단어를 사용자사전으로 추가합니다.
   *
   * @param {Dictionary} other 참조할 사전
   * @param {boolean} [fastAppend=false] 선택된 사전에 존재하는지를 검사하지 않고 빠르게 추가하고자 할 때.
   * @param {POSFilter} [filter=(x) => x.isNoun()] 가져올 품사나, 품사의 리스트, 또는 해당 품사인지 판단하는 함수.
   */


  async importFrom(other, fastAppend = false, filter = x => x.isNoun()) {
    let tags = [];

    if (filter instanceof Function) {
      for (let tag of _types.POS.values()) {
        if (filter(tag)) tags.push(tag.tagname);
      }
    } else {
      for (let tag of filter) {
        tags.push(tag.tagname);
      }
    }

    await this._api.importFromPromise(other._api, fastAppend, _jvm.JVM.posFilter(tags));
  }
  /**
   * 원본 사전에 등재된 항목 중에서, 지정된 형태소의 항목만을 가져옵니다. (복합 품사 결합 형태는 제외)
   *
   * @param {POSFilter} [filter=(x) => x.isNoun()] 가져올 품사나, 품사의 리스트, 또는 해당 품사인지 판단하는 함수.
   * @return {Iterator.<DicEntry>} {'surface':형태소, 'tag':품사}의 generator
   */


  async getBaseEntries(filter = x => x.isNoun()) {
    let tags = [];

    if (filter instanceof Function) {
      for (let tag of _types.POS.values()) {
        if (filter(tag)) tags.push(tag.tagname);
      }
    } else {
      for (let tag of filter) {
        tags.push(tag.tagname);
      }
    }

    let entries = await this._api.getBaseEntriesPromise(_jvm.JVM.posFilter(tags));
    return function* () {
      while (entries.hasNext()) {
        yield readDicEntry(entries.next());
      }
    }();
  }
  /**
   * 사용자 사전에 등재된 모든 항목을 가져옵니다.
   * @return {DicEntry[]} {'surface':형태소, 'tag':품사}의 list
   */


  async getItems() {
    return _jvm.JVM.toJsArray((await this._api.getItemsPromise()), readDicEntry, true);
  }
  /**
   * 사전에 등재되어 있는지 확인하고, 사전에 없는단어만 반환합니다.
   * @param {boolean} onlySystemDic 시스템 사전에서만 검색할지 결정합니다.
   * @param {DicEntry} word {'surface':형태소, 'tag':품사}들. (가변인자)
   * @return {DicEntry[]} 사전에 없는 단어들
   */


  async getNotExists(onlySystemDic, ...word) {
    let zipped = word.map(pair => _jvm.JVM.pair(pair.surface, pair.tag.reference));
    return _jvm.JVM.toJsArray((await this._api.getNotExistsPromise(onlySystemDic, ...zipped)), readDicEntry);
  }

}
/**
 * 울산대 UTagger 라이브러리 연결용 Static class
 */


exports.Dictionary = Dictionary;

class UTagger {
  /**
   * UTagger의 라이브러리와 설정파일의 위치를 지정합니다.
   *
   * @param libPath 라이브러리 파일의 위치
   * @param confPath 설정 파일의 위치
   */
  static setPath(libPath, confPath) {
    _jvm.JVM.koalaClassOf('utagger', 'UTagger').setPath(libPath, confPath);
  }

}

exports.UTagger = UTagger;