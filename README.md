# NodeJS-KoalaNLP

[![NPM Version](https://img.shields.io/npm/v/koalanlp.svg)](https://github.com/nearbydelta/nodejs-koalanlp)
[![분석기별 품사비교표](https://img.shields.io/badge/%ED%92%88%EC%82%AC-%EB%B9%84%EA%B5%90%ED%91%9C-blue.svg?style=flat-square)](https://docs.google.com/spreadsheets/d/1OGM4JDdLk6URuegFKXg1huuKWynhg_EQnZYgTmG4h0s/edit?usp=sharing)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://tldrlegal.com/license/mit-license)
[![Gitter](https://img.shields.io/gitter/room/nearbydelta/KoalaNLP.svg?style=flat-square)](https://gitter.im/nearbydelta/KoalaNLP?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# 소개
한국어 형태소 및 구문 분석기의 모음인, [KoalaNLP](https://github.com/nearbydelta/koalanlp)의 Node.js 판본입니다.

이 프로젝트는 __서로 다른 형태의 형태소 분석기를__ 모아,
__동일한 인터페이스__ 아래에서 사용할 수 있도록 하는 것이 목적입니다.
* Hannanum: KAIST의 [한나눔 형태소 분석기](http://kldp.net/projects/hannanum/)와 [NLP_HUB 구문분석기](http://semanticweb.kaist.ac.kr/home/index.php/NLP_HUB)
* KKMA: 서울대의 [꼬꼬마 형태소/구문 분석기](http://kkma.snu.ac.kr/documents/index.jsp)
* KOMORAN: Junsoo Shin님의 [코모란 v3.x](https://github.com/shin285/KOMORAN)
* Twitter: OpenKoreanText의 [오픈 소스 한국어 처리기](http://openkoreantext.org) (구 Twitter 한국어 분석기)<sup>1-1</sup>
* Eunjeon: 은전한닢 프로젝트의 [SEunjeon(S은전)](https://bitbucket.org/eunjeon/seunjeon)
* Arirang: 이수명님의 [Arirang Morpheme Analyzer](http://cafe.naver.com/korlucene) <sup>1-2</sup>
* RHINO: 최석재님의 [RHINO v2.5.4](https://github.com/SukjaeChoi/RHINO)

> <sup>주1-1</sup> 이전 코드와의 연속성을 위해서, OpenKoreanText의 패키지 명칭은 twitter로 유지합니다.
>
> <sup>주1-2</sup> Arirang 분석기의 출력을 형태소분석에 적합하게 조금 다듬었으므로, 원본과 약간 다른 결과를 낼 수도 있습니다.

KoalaNLP의 Contributor가 되고 싶으시다면, 언제든지 Issue에 등록해주십시오.
또한, 추가하고자 하는 새로운 프로젝트가 있으시면, Issue에 등록해주십시오.

# 사용법

## Dependency 추가
먼저, `koalanlp`를 추가해주세요.
```shell
$ npm install koalanlp --save 
```

## 간단한 예시
`koalanlp`는, `node-java` 및 `node-java-maven` 패키지의 도움을 받아, 필요한 java dependency를 자동으로 가져옵니다.

> [참고] 최초 사용시 또는, 최신 패키지로 업데이트 되는 경우, dependency를 찾아오는 데 시간이 소요될 수 있습니다.

다음과 같이 사용합니다. (ES2015 기준으로 작성되었으나, ES5 에서도 유사하게 작성하실 수 있습니다.)
```js
let koalanlp = require('koalanlp'); // Import
let TYPES = koalanlp.TYPES; // Tagger/Parser Package 지정을 위한 목록

koalanlp.initialize({
    tagger: TYPES.EUNJEON, // 품사분석(POS Tagging)을 위해서, 은전한닢 사용
    parser: TYPES.KKMA, // 의존구문분석(Dependency Parsing)을 위해서, 꼬꼬마 사용
    version: "1.8.4", // 사용하는 KoalaNLP 버전 (1.8.4)
    debug: true // Debug output 출력여부
}, function(){
    // 품사분석기 이용법
    let tagger = new koalanlp.Tagger();
    
    // Synchronous POS Tagging
    let tagged = tagger.tag("안녕하세요. 눈이 오는 설날 아침입니다.");
    console.log(JSON.stringify(tagged));
    
    // Asynchronous POS Tagging
    tagger.tag("안녕하세요. 눈이 오는 설날 아침입니다.", function(taggedAsync){
       console.log("Async", JSON.stringify(taggedAsync)); 
    });

    // 의존구문분석기 이용법
    let parser = new koalanlp.Parser();
    
    // Synchronous Dependency Parsing
    let parsed = parser.parse("안녕하세요. 눈이 오는 설날 아침입니다.");
    console.log(JSON.stringify(parsed));
    
    // Asynchronous Dependency Parsing
    parser.parse("안녕하세요. 눈이 오는 설날 아침입니다.", function(parsedAsync){
        console.log("Async", JSON.stringify(parsedAsync));
    });
});
```

## 사용가능한 패키지 목록

|         | 은전한닢(`EUNJEON`) | 꼬꼬마(`KKMA`) | 코모란(`KOMORAN`) | 한나눔(`HANNANUM`) | 오픈한글(`TWITTER`) | 아리랑(`ARIRANG`) | 라이노(`RHINO`) |
|---------|-------------------|---------------|-----------------|------------------|--------------------|-----------------|---------------|
| 품사분석    | v1.4.0 | v2  | v3.3.3 | v1  | v2.1.2 | v1.1.3 | v2.5.4 |
| 의존구문분석 | 지원안함 | 가능 | 지원안함 | 가능 | 지원안함 | 지원안함 | 지원안함 |

## API

### `koalanlp.initialize(option, callback)`
분석기 초기화 함수. (사용 전, 초기화 *필수*)

- `option`: Object (필수). 아래와 같은 설정이 가능함.
  - `option.tagger`: `TYPES` (기본값 `EUNJEON`). 품사분석기 지정.
  - `option.parser`: `TYPES` (기본값 `KKMA`). 의존구문분석기 지정.
  - `option.version`: String (기본값 `1.8.4`). 사용할 KoalaNLP 버전 지정. [최신 버전 확인](https://nearbydelta.github.io/KoalaNLP)
  - `option.debug`: Boolean (기본값 false). Debug 기록 표시여부
- `callback`: Function (void => void) (필수). 초기화 완료 후 실행할 콜백함수.

### `koalanlp.Tagger` 클래스 (품사분석기)
아래의 두 method 모두, `callback`이 지정된 경우는 callback에 결과값이 전달되고, 그렇지 않은 경우는 결과값을 직접 반환합니다.

#### `Tagger.tag(text, callback)`
- `text`: String (필수). 분석할 문단.
- `callback`: Function (Object => void) (선택). 분석 완료 후 결과를 처리할 함수.

#### `Tagger.tagSentence(text, callback)`
- `text`: String (필수). 분석할 문장.
- `callback`: Function (Object => void) (선택). 분석 완료 후 결과를 처리할 함수.

### `koalanlp.Parser` 클래스 (의존구문분석기)
아래의 두 method 모두, `callback`이 지정된 경우는 callback에 결과값이 전달되고, 그렇지 않은 경우는 결과값을 직접 반환합니다.

> [참고] Parser가 사용하는 품사분석결과는, tagger로 지정된 분석기를 따릅니다.

#### `Parser.parse(text, callback)`
- `text`: String (필수). 분석할 문단.
- `callback`: Function (Object => void) (선택). 분석 완료 후 결과를 처리할 함수.

#### `Parser.parseSentence(text, callback)`
- `text`: String (필수). 분석할 문장.
- `callback`: Function (Object => void) (선택). 분석 완료 후 결과를 처리할 함수.


## 결과의 형태

아래와 같은 구조를 따릅니다.
```js
{
  error: Error|Boolean, // Error 발생시, error object. 아닌 경우는 false.
  result: [ // 문장의 배열.
    {
      word: [ // 문장 내, 어절의 배열.
        {
          id: Number, // 어절 순서.
          surface: String, //표면형.
          morphemes: [ // 문장 내, 형태소의 배열.
            {
              surface: String, //형태소 표면형.
              tag: String, //세종 품사표기 
              `${tagger}Tag`: String // 사용중인 품사분석기(${tagger})가 내보낸 결과.
            },
            ...
          ],
          dependents: [ // 이 단어에 의존하는 어절의 목록.
            {
              headId: Number, // 지배소의 문장 내 위치 (현재 어절 자신)
              targetId: Number, // 지배받는 어절의 위치
              relation: String, // 관계
              `${parser}`Rel: String // 사용중인 의존분석기(${parser})가 내보낸 결과.
            },
            ...
          ]
        }
      ],
      root: [ // 문장 전체의 지배소
        {
          headId: Number, // 지배소의 문장 내 위치 (현재 어절 자신)
          targetId: Number, // 지배받는 어절의 위치
          relation: String, // 관계
          `${parser}Rel`: String // 사용중인 의존분석기(${parser})가 내보낸 결과.
        },
        ...
      ]
    }
  ]
}
```

callback 없이 호출한 경우는, `result`에 해당하는 부분만 전달됩니다.