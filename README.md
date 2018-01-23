# NodeJS-KoalaNLP

[![NPM Version](https://img.shields.io/npm/v/koalanlp.svg?style=flat-square)](https://github.com/nearbydelta/nodejs-koalanlp)
[![분석기별 품사비교표](https://img.shields.io/badge/%ED%92%88%EC%82%AC-%EB%B9%84%EA%B5%90%ED%91%9C-blue.svg?style=flat-square)](https://docs.google.com/spreadsheets/d/1OGM4JDdLk6URuegFKXg1huuKWynhg_EQnZYgTmG4h0s/edit?usp=sharing)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://tldrlegal.com/license/mit-license)
[![JS Doc](https://img.shields.io/badge/JS-Doc-blue.svg?style=flat-square)](https://nearbydelta.github.com/nodejs-koalanlp/docs/global.html)

[![scala-koalanlp](https://img.shields.io/badge/Scala-KoalaNLP-red.svg?style=flat-square)](https://nearbydelta.github.io/KoalaNLP)
[![py-koalanlp](https://img.shields.io/badge/Python-KoalaNLP-blue.svg?style=flat-square)](https://nearbydelta.github.io/py-koalanlp)

# 소개
한국어 형태소 및 구문 분석기의 모음인, [KoalaNLP](https://github.com/nearbydelta/koalanlp)의 Javascript (Node.js) Wrapper입니다.

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
API 문서는 [![JS Doc](https://img.shields.io/badge/JS-Doc-blue.svg?style=flat-square)](https://nearbydelta.github.com/nodejs-koalanlp/docs/global.html)에서, 간단한 사용법은 [Wiki](https://github.com/nearbydelta/nodejs-koalanlp/wiki)에서 확인하시면 됩니다.

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

# License 조항
이 프로젝트 자체(nodejs-KoalaNLP)와 인터페이스 통합을 위한 Java/Scala 코드는 [*MIT License*](https://tldrlegal.com/license/mit-license)을 따르며,
각 분석기의 License와 저작권은 각 프로젝트에서 지정한 바를 따릅니다.
* Hannanum: [GPL v3](https://tldrlegal.com/license/gnu-general-public-license-v3-(gpl-3))
* KKMA: [GPL v2](https://tldrlegal.com/license/gnu-general-public-license-v2) (GPL v2를 따르지 않더라도, 상업적 이용시 별도 협의 가능)
* KOMORAN: [Apache License 2.0](https://tldrlegal.com/license/apache-license-2.0-(apache-2.0))
* Twitter: [Apache License 2.0](https://tldrlegal.com/license/apache-license-2.0-(apache-2.0))
* Eunjeon: [Apache License 2.0](https://tldrlegal.com/license/apache-license-2.0-(apache-2.0))
* Arirang: [Apache License 2.0](https://tldrlegal.com/license/apache-license-2.0-(apache-2.0))
* RHINO: 비상업적 용도 사용가능.

# 결과 비교
[Java/Scala Version KoalaNLP의 Wiki:결과비교](https://github.com/nearbydelta/KoalaNLP/wiki/4.-결과-비교)를 참조해주세요.
