# NodeJS-KoalaNLP

[![NPM Version](https://img.shields.io/npm/v/koalanlp.svg?style=flat-square)](https://github.com/koalanlp/nodejs-koalanlp)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://tldrlegal.com/license/mit-license)
[![JS Doc](https://img.shields.io/badge/JS-Doc-blue.svg?style=flat-square)](https://koalanlp.github.com/nodejs-koalanlp/docs/module-koalanlp.html)

[![Build Status](https://img.shields.io/travis/koalanlp/nodejs-support.svg?style=flat-square&branch=master)](https://travis-ci.org/koalanlp/nodejs-koalanlp)
[![Known Vulnerabilities](https://snyk.io/test/github/koalanlp/nodejs-support/badge.svg?style=flat-square)](https://snyk.io/test/github/koalanlp/nodejs-support)

[![분석기별 품사비교표](https://img.shields.io/badge/%ED%92%88%EC%82%AC-%EB%B9%84%EA%B5%90%ED%91%9C-blue.svg?style=flat-square)](https://docs.google.com/spreadsheets/d/1OGM4JDdLk6URuegFKXg1huuKWynhg_EQnZYgTmG4h0s/edit?usp=sharing)
[![KoalaNLP](https://img.shields.io/badge/Java-KoalaNLP-blue.svg?style=flat-square)](https://koalanlp.github.io/koalanlp)
[![python](https://img.shields.io/badge/Python-Supprt-blue.svg?style=flat-square)](https://koalanlp.github.io/python-support)
[![scala](https://img.shields.io/badge/Scala-Support-blue.svg?style=flat-square)](https://koalanlp.github.io/scala-support)

# 소개

이 프로젝트는 __서로 다른 형태의 형태소 분석기를__ 모아,
__동일한 인터페이스__ 아래에서 사용할 수 있도록 하는 것이 목적입니다.
* KAIST의 [한나눔 형태소 분석기](http://kldp.net/projects/hannanum/)와 [NLP_HUB 구문분석기](http://semanticweb.kaist.ac.kr/home/index.php/NLP_HUB)
* 서울대의 [꼬꼬마 형태소/구문 분석기 v2.1](http://kkma.snu.ac.kr/documents/index.jsp)
* Shineware의 [코모란 v3.3.4](https://github.com/shin285/KOMORAN)
* OpenKoreanText의 [오픈 소스 한국어 처리기 v2.2.0](http://openkoreantext.org) (구 Twitter 한국어 분석기)
* 은전한닢 프로젝트의 [SEunjeon(S은전)](https://bitbucket.org/eunjeon/seunjeon) (Mecab-ko의 Scala/Java 판본)
* 이수명님의 [Arirang Morpheme Analyzer](http://cafe.naver.com/korlucene) <sup>1-1</sup>
* 최석재님의 [RHINO v2.5.4](https://github.com/SukjaeChoi/RHINO)
* 김상준님의 [Daon 분석기](https://github.com/rasoio/daon/tree/master/daon-core)
* ETRI의 [공공 인공지능 Open API](http://aiopen.etri.re.kr/doc_language.php)

> <sup>주1-1</sup> Arirang 분석기의 출력을 형태소분석에 적합하게 조금 다듬었으므로, 원본과 약간 다른 결과를 낼 수도 있습니다.

분석기의 개선이나 추가 등을 하고 싶으시다면,
* 개발이 직접 가능하시다면 pull request를 보내주세요. 테스트 후 반영할 수 있도록 하겠습니다.
* 개발이 어렵다면 issue tracker에 등록해주세요. 검토 후 답변해드리겠습니다.

## 특징

KoalaNLP는 다음과 같은 특징을 가지고 있습니다.

1. 복잡한 설정이 필요없는 텍스트 분석:

   모델은 자동으로 Maven으로 배포되기 때문에, 각 모델을 별도로 설치할 필요가 없습니다.

2. 코드 2~3 줄로 수행하는 텍스트 처리:

   모델마다 다른 복잡한 설정 과정, 초기화 과정은 필요하지 않습니다. Dependency에 추가하고, 객체를 생성하고, 분석 메소드를 호출하는 3줄이면 끝납니다.

3. 모델에 상관 없는 동일한 코드, 동일한 결과:

   모델마다 실행 방법, 실행 결과를 표현하는 형태가 다릅니다. KoalaNLP는 이를 정부 및 관계기관의 표준안에 따라 표준화합니다. 따라서 모델에 독립적으로 응용 프로그램 개발이 가능합니다.

4. [Java, Kotlin](https://koalanlp.github.io/koalanlp), [Scala](https://koalanlp.github.io/scala-support), [Python 3](https://koalanlp.github.io/python-support), [NodeJS](https://koalanlp.github.io/nodejs-support)에서 크게 다르지 않은 코드:

   KoalaNLP는 여러 프로그래밍 언어에서 사용할 수 있습니다. 어디서 개발을 하더라도 크게 코드가 다르지 않습니다. 

# License 조항

KoalaNLP의 프로젝트와 인터페이스 통합을 위한 코드는
소스코드에 저작권 귀속에 대한 별도 지시사항이 없는 한 [*MIT License*](https://tldrlegal.com/license/mit-license)을 따르며,
원본 분석기의 License와 저작권은 각 저작권자가 지정한 바를 따릅니다.

단, GPL의 저작권 조항에 따라, GPL 하에서 이용이 허가되는 패키지들의 저작권은 해당 저작권 규정을 따릅니다.

* Hannanum 및 NLP_HUB: [GPL v3](https://tldrlegal.com/license/gnu-general-public-license-v3-(gpl-3))
* KKMA: [GPL v2](https://tldrlegal.com/license/gnu-general-public-license-v2) (GPL v2를 따르지 않더라도, 상업적 이용시 별도 협의 가능)
* KOMORAN 3.x: [Apache License 2.0](https://tldrlegal.com/license/apache-license-2.0-(apache-2.0))
* Open Korean Text: [Apache License 2.0](https://tldrlegal.com/license/apache-license-2.0-(apache-2.0))
* SEunjeon: [Apache License 2.0](https://tldrlegal.com/license/apache-license-2.0-(apache-2.0))
* 아리랑: [Apache License 2.0](https://tldrlegal.com/license/apache-license-2.0-(apache-2.0))
* RHINO: [GPL v3](https://tldrlegal.com/license/gnu-general-public-license-v3-(gpl-3)) (참고: 다운로드 위치별로 조항 상이함)
* Daon: 지정된 조항 없음
* ETRI: 별도 API 키 발급 동의 필요

# Dependency 추가
* `Java` 8 이상이 설치되어 있어야 합니다. 

아래와 같이 `koalanlp`를 추가해주세요.
```shell
$ npm install koalanlp --save 
```

# 사용법

상세한 사항은 [Usage](https://koalanlp.github.io/koalanlp/usage/) 또는 [![JS Doc](https://img.shields.io/badge/JS-Doc-blue.svg?style=flat-square)](https://koalanlp.github.com/nodejs-koalanlp/docs/module-koalanlp.html)을 참고하십시오.

## 간단한 예시
`koalanlp`는, `node-java` 및 `node-java-maven` 패키지의 도움을 받아, 필요한 java dependency를 자동으로 가져옵니다.

> [참고] 최초 사용시 또는, 최신 패키지로 업데이트 되는 경우, dependency를 찾아오는 데 시간이 소요될 수 있습니다.
> 다운로드 진행 중에 취소하시면 다운로드 된 패키지가 corrupt 될 수 있습니다.
> 이 경우, Maven repository 저장 공간인 (`~/.m2`) 폴더에서 오류가 나는 패키지를 삭제하시고 다시 시작하십시오.

다음과 같이 사용합니다. (ES2015 기준으로 작성되었으나, ES5 에서도 유사하게 작성하실 수 있습니다.)
```js
let koalanlp = require('koalanlp'); // Import
let API = koalanlp.API; // Tagger/Parser Package 지정을 위한 목록
let POS = koalanlp.POS; // 품사 관련 utility

koalanlp.initialize({
    packages: [API.EUNJEON, // 품사분석(POS Tagging)을 위해서, 은전한닢 사용
               API.KKMA], // 의존구문분석(Dependency Parsing)을 위해서, 꼬꼬마 사용
    version: "2.0.0", // 사용하는 KoalaNLP 버전 (2.0.0 사용)
    javaOptions: ["-Xmx4g"],
    debug: true // Debug output 출력여부
}).then(function(){
    // 품사분석기 이용법
    let tagger = new koalanlp.Tagger(API.EUNJEON);

    // POS Tagging
    tagger.tag("안녕하세요. 눈이 오는 설날 아침입니다.")
        .catch(function(error){
            console.error(error);            
        }).then(function(taggedAsync){
            console.log("Async", taggedAsync.result.map(s => s.toString()).join("\n"));
        });

    // 의존구문분석기 이용법
    let parser = new koalanlp.Parser(API.KKMA, API.EUNJEON);

    // Dependency Parsing
    parser.parse("안녕하세요. 눈이 오는 설날 아침입니다."
        .catch(function(error){
            console.error(error);            
        }).then(function(parsed){
            console.log("Async", parsed.result.map(s => s.toString()).join("\n"));
            
            // Data classes
            let sentence = parsed[1]; // 두번째 문장인, "눈이 오는 설날 아침입니다."를 선택합니다.
        
            let wordAt0 = sentence.get(0); // 첫번째 어절을 선택해봅니다.
            console.log(wordAt0.exists(m => POS.isPredicate(m.tag))); // 첫번째 어절에, 용언(동사/형용사)을 포함한 형태소가 있는지 확인합니다.
            console.log(sentence.exists(w => w.exists(m => POS.isNoun(m.tag)))); // 문장 전체에 체언(명사 등)을 포함한 어절이 있는지 확인합니다.
            console.log(sentence.nouns()); // 문장에서 체언만 추출합니다.
            console.log(sentence.verbs()); // 문장에서 용언만 추출합니다.
        });
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
[Java/Scala Version KoalaNLP의 Wiki:결과비교](https://github.com/koalanlp/KoalaNLP-core/wiki/4.-결과-비교)를 참조해주세요.
