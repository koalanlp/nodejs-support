# NodeJS-KoalaNLP

[![NPM Version](https://img.shields.io/npm/v/koalanlp.svg?style=flat-square)](https://github.com/nearbydelta/nodejs-koalanlp)
[![분석기별 품사비교표](https://img.shields.io/badge/%ED%92%88%EC%82%AC-%EB%B9%84%EA%B5%90%ED%91%9C-blue.svg?style=flat-square)](https://docs.google.com/spreadsheets/d/1OGM4JDdLk6URuegFKXg1huuKWynhg_EQnZYgTmG4h0s/edit?usp=sharing)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://tldrlegal.com/license/mit-license)
[![JS Doc](https://img.shields.io/badge/JS-Doc-blue.svg?style=flat-square)](https://nearbydelta.github.com/nodejs-koalanlp/docs/global.html)
icense)

[![scala-koalanlp](https://img.shields.io/badge/Scala-KoalaNLP-red.svg?style=flat-square)](https://nearbydelta.github.io/KoalaNLP)
[![py-koalanlp](https://img.shields.io/badge/Python-KoalaNLP-blue.svg?style=flat-square)](https://nearbydelta.github.io/py-koalanlp)

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
API 문서는 [![JS Doc](https://img.shields.io/badge/JS-Doc-blue.svg?style=flat-square)](https://nearbydelta.github.com/nodejs-koalanlp/docs/global.html)를 참고하세요.

## Dependency 추가
* `Java` 8 이상이 설치되어 있어야 합니다. 

아래와 같이 `koalanlp`를 추가해주세요.
```shell
$ npm install koalanlp --save 
```

## 간단한 예시
`koalanlp`는, `node-java` 및 `node-java-maven` 패키지의 도움을 받아, 필요한 java dependency를 자동으로 가져옵니다.

> [참고] 최초 사용시 또는, 최신 패키지로 업데이트 되는 경우, dependency를 찾아오는 데 시간이 소요될 수 있습니다.
> 다운로드 진행 중에 취소하시면 다운로드 된 패키지가 corrupt 될 수 있습니다.
> 이 경우, Maven repository 저장 공간인 (`~/.m2`) 폴더에서 오류가 나는 패키지를 삭제하시고 다시 시작하십시오.

다음과 같이 사용합니다. (ES2015 기준으로 작성되었으나, ES5 에서도 유사하게 작성하실 수 있습니다.)
```js
let koalanlp = require('koalanlp'); // Import
let TYPES = koalanlp.util.TYPES; // Tagger/Parser Package 지정을 위한 목록
let POS = koalanlp.util.POS; // 품사 관련 utility

koalanlp.initialize({
    packages: [TYPES.EUNJEON, // 품사분석(POS Tagging)을 위해서, 은전한닢 사용
               TYPES.KKMA], // 의존구문분석(Dependency Parsing)을 위해서, 꼬꼬마 사용
    version: "1.9.0", // 사용하는 KoalaNLP 버전 (1.9.0 사용)
    javaOptions: ["-Xmx4g"],
    debug: true // Debug output 출력여부
}, function(){
    // 품사분석기 이용법
    let tagger = new koalanlp.Tagger(TYPES.EUNJEON);

    // Synchronous POS Tagging
    let tagged = tagger.tag("안녕하세요. 눈이 오는 설날 아침입니다.");
    console.log(JSON.stringify(tagged));

    // Asynchronous POS Tagging
    tagger.tag("안녕하세요. 눈이 오는 설날 아침입니다.", function(taggedAsync){
        if(taggedAsync.error) // Error 발생시
            console.error(taggedAsync.error);
        else // 정상 종료시
            console.log("Async", taggedAsync.result.map(s => s.toString()).join("\n"));
    });

    // 의존구문분석기 이용법
    let parser = new koalanlp.Parser(TYPES.KKMA, TYPES.EUNJEON);

    // Synchronous Dependency Parsing
    let parsed = parser.parse("안녕하세요. 눈이 오는 설날 아침입니다.");
    console.log(JSON.stringify(parsed));

    // Asynchronous Dependency Parsing
    parser.parse("안녕하세요. 눈이 오는 설날 아침입니다.", function(parsedAsync){
        if(parsedAsync.error) // Error 발생시
            console.error(parsedAsync.error);
        else // 정상 종료시
            console.log("Async", parsedAsync.result.map(s => s.toString()).join("\n"));
    });

    // Data classes
    let sentence = parsed[1]; // 두번째 문장인, "눈이 오는 설날 아침입니다."를 선택합니다.

    let wordAt0 = sentence.get(0); // 첫번째 어절을 선택해봅니다.
    console.log(wordAt0.exists(m => POS.isPredicate(m.tag))); // 첫번째 어절에, 용언(동사/형용사)을 포함한 형태소가 있는지 확인합니다.
    console.log(sentence.exists(w => w.exists(m => POS.isNoun(m.tag)))); // 문장 전체에 체언(명사 등)을 포함한 어절이 있는지 확인합니다.
    console.log(sentence.nouns()); // 문장에서 체언만 추출합니다.
    console.log(sentence.verbs()); // 문장에서 용언만 추출합니다.
});
```

## 사용가능한 패키지 목록

|         | 은전한닢(`EUNJEON`) | 꼬꼬마(`KKMA`) | 코모란(`KOMORAN`) | 한나눔(`HANNANUM`) | 오픈한글(`TWITTER`) | 아리랑(`ARIRANG`) | 라이노(`RHINO`) |
|---------|-------------------|---------------|-----------------|------------------|--------------------|-----------------|---------------|
| 품사분석    | v1.4.0 | v2  | v3.3.3 | v1  | v2.1.2 | v1.1.3 | v2.5.4 |
| 의존구문분석 | 지원안함 | 가능 | 지원안함 | 가능 | 지원안함 | 지원안함 | 지원안함 |

# API

## Utilities

### `koalanlp.initialize(option, callback)`
분석기 초기화 함수입니다. (사용 전, 초기화 **필수**)

- `option`: Object (필수). 아래와 같은 설정을 포함합니다.
  - `option.packages`: `TYPES[]` (기본값 `[EUNJEON, KKMA]`). 사용할 분석기 패키지목록.
  - `option.version`: String (기본값 `1.9.0`). 사용할 KoalaNLP 버전 지정. [최신 버전 확인](https://nearbydelta.github.io/KoalaNLP)
  - `option.javaOptions`: String[] (기본값 `["-Xmx4g"]`). 자바 JVM Option.
  - `option.debug`: Boolean (기본값 false). Debug 기록 표시여부
- `callback`: Function (void => void) (필수). 초기화 완료 후 실행할 콜백함수.

### `koalanlp.util.POS`
품사 분석을 도와주는 도구입니다.

- `POS.isNoun(obj)` 주어진 객체가 체언(명사/대명사/수사)인지 확인함.
- `POS.isPredicate(obj)` 주어진 객체가 용언(동사/형용사)인지 확인함.
- `POS.isModifier(obj)` 주어진 객체가 수식언(관형사/부사)인지 확인함.
- `POS.isPostposition(obj)` 주어진 객체가 관계언(조사)인지 확인함.
- `POS.isEnding(obj)` 주어진 객체가 어미(어말어미/선어말어미/...)인지 확인함.
- `POS.isAffix(obj)` 주어진 객체가 접사인지 확인함.
- `POS.isSuffix(obj)` 주어진 객체가 접미사인지 확인함.
- `POS.isSymbol(obj)` 주어진 객체가 기호(문장부호/화폐기호/...)인지 확인함.
- `POS.isUnknown(obj)` 주어진 객체가 품사분석기가 분석하지 못한 내용인지 확인함.

위의 모든 static method가 취하는 argument `obj`는 다음 타입을 가져야 합니다.
- `string`: 이 경우, `obj`는 품사표기(POS tag) 자체로 인식됩니다.
- `Morpheme`: 이 경우, `obj`는 품사가 표기된 형태소 객체(Morpheme)로 인식됩니다.

## `koalanlp.Tagger` 클래스 (품사분석기)
- `constructor(taggerType)` 품사분석기를 생성합니다.
  - `taggerType`: `TYPES` (필수). 사용할 품사분석기의 유형.

아래의 두 method 모두, `callback`이 지정된 경우는 callback에 결과값이 전달되고, 그렇지 않은 경우는 결과값을 직접 반환합니다.

- `Tagger#tag(text, callback)` 문단 단위의 분석.
- `Tagger#tagSentence(text, callback)` 1개 문장으로 강제하여 분석.

위의 method가 취하는 argument는 다음과 같습니다.
- `text`: string (필수). 분석할 문단/문장.
- `callback`: function (Object => void) (선택). 분석 완료 후 결과를 처리할 함수.
  - callback이 받는 object는 `error` 키(오류 발생시 오류를 전송하는 부분)와 `result` 키(결과값 부분)를 포함합니다.
    - `error`는 오류가 없었던 경우 반드시 `false`로 지정됩니다.
    - `result`는 함수에 관계 없이 Sentence의 배열 형태를 취합니다. (`tagSentence`는 문장 1개를 포함한 배열)
  - callback이 없으면, Sentence 1개 또는 Sentence 배열이 반환됩니다.

## `koalanlp.Parser` 클래스 (의존구문분석기)
- `constructor(parserType taggerType)` 의존구문분석기를 생성합니다.
  - `parserType`: `TYPES` (필수). 사용할 의존구문분석기의 유형.
  - `taggerType`: `TYPES` (선택. 기본값 `undefined`). 사용할 품사분석기의 유형. `undefined`일 경우 의존구문분석기의 품사분석결과 사용.
  
아래의 두 method 모두, `callback`이 지정된 경우는 callback에 결과값이 전달되고, 그렇지 않은 경우는 결과값을 직접 반환합니다.

> [참고] Parser가 사용하는 품사분석결과는, tagger로 지정된 분석기를 따릅니다.

- `Parser#parse(text, callback)` 문단 단위의 분석.
- `Parser#parseSentence(text, callback)` 1개 문장으로 강제하여 분석.

위의 method가 취하는 argument는 다음과 같습니다.
- `text`: string (필수). 분석할 문단/문장.
- `callback`: function (Object => void) (선택). 분석 완료 후 결과를 처리할 함수.
  - callback이 받는 object는 `error` 키(오류 발생시 오류를 전송하는 부분)와 `result` 키(결과값 부분)를 포함합니다.
    - `error`는 오류가 없었던 경우 반드시 `false`로 지정됩니다.
    - `result`는 함수에 관계 없이 Sentence의 배열 형태를 취합니다. (`parseSentence`는 문장 1개를 포함한 배열)
  - callback이 없으면, Sentence 1개 또는 Sentence 배열이 반환됩니다.

## Data classes
결과값은, 다음과 같은 Data Class에 담겨 전송됩니다.

### `koalanlp.Morpheme` 클래스 (형태소)
- `Morpheme#surface` (string) 형태소 표면형입니다.
- `Morpheme#tag` (string) 세종 품사 표기로 KoalaNLP가 변환한 결과입니다.
- `Morpheme#rawTag` (string) 사용한 품사 분석기가 명명한 원본 품사입니다. (세종 품사보다 범위가 넓거나 좁을 수 있습니다)
- `Morpheme#id` (number) 어절 내에서의 위치입니다.
- `Morpheme#hasTag(tag)` 주어진 tag가 형태소와 일치하면 true.
  - `tag`가 `string`타입일 때, `Morpheme#tag`가 `tag`로 시작하는지 확인합니다.
  - `tag`가 `string[]`타입일 때, `tag` 중의 하나라도 `Morpheme#tag`의 시작과 일치하는지 확인합니다.
- `Morpheme#hasRawTag(tag)` 주어진 tag가 원본 결과와 일치하면 true.
- `Morpheme#equals(morph)` 형태소가 같은지 확인합니다.
- `Morpheme#equalsWithoutTag(morph)` 형태소의 표면형이 같은지 확인합니다.
- `Morpheme#toString()` 형태소를 string으로 변환합니다.
- `Morpheme#toJson()` 형태소를 JSON 객체로 변환합니다.

### `koalanlp.Relationship` 클래스 (의존관계)
- `Relationship#head` (number) 이 관계의 지배소에 해당하는 어절의, 문장 내에서의 위치입니다.
- `Relationship#target` (number) 이 관계의 피지배소에 해당하는 어절의, 문장 내에서의 위치입니다.
- `Relationship#relation` (string) 두 어절 사이의 관계입니다.
- `Relationship#rawRel` (string) 의존구문분석기가 출력한 원본 관계입니다.
- `Relationship#equals(rel)` 의존관계가 같은지 확인합니다.
- `Relationship#toString()` string으로 변환합니다.
- `Relationship#toJson()` JSON 객체로 변환합니다.

### `koalanlp.Word` 클래스 (어절)
- `Word#surface` (string) 어절의 표면형입니다.
- `Word#morphemes` (Morpheme[]) 어절을 구성하는 형태소의 목록입니다.
- `Word#id` (number) 문장 내에서의 위치입니다.
- `Word#dependents` (Relationship[]) 현재 어절에 의존하는 관계의 목록입니다.
- `Word#length()` 형태소의 개수를 돌려줍니다.
- `Word#get(idx)` 어절 내에서 `idx`번째에 위치한 형태소를 반환합니다.
- `Word#matches(tag)` 주어진 tag 목록이 어절과 순서가 일치하면 true.
  - `tag`가 `string[]` 타입일 때, 어절 내 형태소 품사 목록과 순서가 일치하면 true. (연속하지 않아도 됨)
- `Word#find(fn)` 주어진 조건에 맞는 형태소를 찾습니다.
  - `fn`이 `function` 타입일 때, `fn`이 true인 첫 형태소를 반환.
  - `fn`이 `Morpheme` 타입일 때, `fn`과 `Morpheme#equal()`이 성립하는 첫 형태소를 반환.
- `Word#exists(fn)` 주어진 조건에 맞는 형태소가 있는지 확인합니다. 있다면 true.
  - `fn`이 `function` 타입일 때, `fn`이 하나라도 만족되면 true.
  - `fn`이 `Morpheme` 타입일 때, `fn`과 `Morpheme#equal()`이 성립하는 형태소가 하나라도 있으면 true.
- `Word#equals(word)` 두 어절이 위치와 형태소가 같은지 확인합니다.
- `Word#equalsWithoutTag(word)` 두 어절의 표면형이 같은지 확인합니다.
- `Word#toString()` string으로 변환합니다.
- `Word#toJson()` JSON 객체로 변환합니다.
- `Word#singleLineString()` 형태소 분석 결과를 한 줄로 반환합니다.

### `koalanlp.Sentence` 클래스 (문장)
- `Sentence#words` (Word[]) 문장을 구성하는 어절의 목록입니다.
- `Sentence#root` (Word) 문장의 의존관계를 표시하기 위한, 허상의 최상위 노드입니다. root에 의존하는 단어가 핵심어가 됩니다.
- `Sentence#length()` 어절의 개수를 돌려줍니다.
- `Sentence#get(idx)` 문장 내에서 `idx`번째에 위치한 어절을 반환합니다.
- `Sentence#matches(tag)` 주어진 tag 목록이 문장과 순서가 일치하면 true.
  - `tag`가 `string[][]` 타입일 때, 문장 내 어절과 순서가 일치하면 true. (연속하지 않아도 됨)
- `Sentence#find(fn)` 주어진 조건에 맞는 어절을 찾습니다.
  - `fn`이 `function` 타입일 때, `fn`이 true인 첫 어절을 반환.
  - `fn`이 `Word` 타입일 때, `fn`과 `Word#equal()`이 성립하는 첫 어절을 반환.
- `Sentence#exists(fn)` 주어진 조건에 맞는 어절이 있는지 확인합니다. 있다면 true.
  - `fn`이 `function` 타입일 때, `fn`이 하나라도 만족되면 true.
  - `fn`이 `Word` 타입일 때, `fn`과 `Word#equal()`이 성립하는 형태소가 하나라도 있으면 true.
- `Sentence#nouns()` 문장 내 체언을 포함한 어절의 목록을 반환합니다.
- `Sentence#verbs()` 문장 내 용언을 포함한 어절의 목록을 반환합니다.
- `Sentence#modifiers()` 문장 내 수식언을 포함한 어절의 목록을 반환합니다.
- `Sentence#toString()` string으로 변환합니다.
- `Sentence#surfaceString(delimiter)` 문장 내 어절의 표면형을 모아 원본 문장에 가깝게 구성합니다.
  - `delimiter`는 선택으로, 지정하지 않으면 빈칸으로 어절이 구분됩니다.
- `Sentence#toJson()` JSON 객체로 변환합니다.
- `Sentence#singleLineString()` 형태소 분석 결과를 한 줄로 반환합니다.
