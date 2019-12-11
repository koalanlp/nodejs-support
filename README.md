# NodeJS-KoalaNLP

[![NPM Version](https://img.shields.io/npm/v/koalanlp.svg?style=flat-square)](https://github.com/koalanlp/nodejs-koalanlp)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://tldrlegal.com/license/mit-license)
[![JS Doc](https://img.shields.io/badge/JS-Doc-blue.svg?style=flat-square)](https://koalanlp.github.io/nodejs-support/)

[![Build Status](https://img.shields.io/travis/koalanlp/nodejs-support.svg?style=flat-square&branch=master)](https://travis-ci.org/koalanlp/nodejs-koalanlp)
[![Known Vulnerabilities](https://snyk.io/test/github/koalanlp/nodejs-support/badge.svg?style=flat-square)](https://snyk.io/test/github/koalanlp/nodejs-support)
[![codecov](https://codecov.io/gh/koalanlp/nodejs-support/branch/master/graph/badge.svg)](https://codecov.io/gh/koalanlp/nodejs-support)

[![분석기별 품사비교표](https://img.shields.io/badge/%ED%92%88%EC%82%AC-%EB%B9%84%EA%B5%90%ED%91%9C-blue.svg?style=flat-square)](https://docs.google.com/spreadsheets/d/1OGM4JDdLk6URuegFKXg1huuKWynhg_EQnZYgTmG4h0s/edit?usp=sharing)
[![KoalaNLP](https://img.shields.io/badge/Java-KoalaNLP-blue.svg?style=flat-square)](https://koalanlp.github.io/koalanlp)
[![python](https://img.shields.io/badge/Python-Supprt-blue.svg?style=flat-square)](https://koalanlp.github.io/python-support)
[![scala](https://img.shields.io/badge/Scala-Support-blue.svg?style=flat-square)](https://koalanlp.github.io/scala-support)

# 소개

이 프로젝트는 __서로 다른 형태의 형태소 분석기를__ 모아,
__동일한 인터페이스__ 아래에서 사용할 수 있도록 하는 것이 목적입니다.

* 김상준님의 [Daon 분석기](https://github.com/rasoio/daon/tree/master/daon-core)
* Shineware의 [코모란 v3.3.8](https://github.com/shin285/KOMORAN)
* 서울대의 [꼬꼬마 형태소/구문 분석기 v2.1](http://kkma.snu.ac.kr/documents/index.jsp)
* ETRI의 [공공 인공지능 Open API](http://aiopen.etri.re.kr/)
* OpenKoreanText의 [오픈 소스 한국어 처리기 v2.3.1](http://openkoreantext.org) (구 Twitter 한국어 분석기)
* 은전한닢 프로젝트의 [SEunjeon(S은전) v1.5.0](https://bitbucket.org/eunjeon/seunjeon) (Mecab-ko의 Scala/Java 판본)
* 이수명님의 [Arirang Morpheme Analyzer](http://cafe.naver.com/korlucene) <sup>1-1</sup>
* 최석재님의 [RHINO v2.5.4](https://github.com/SukjaeChoi/RHINO)
* KAIST의 [한나눔 형태소 분석기](http://kldp.net/projects/hannanum/)와 [NLP_HUB 구문분석기](http://semanticweb.kaist.ac.kr/home/index.php/NLP_HUB)
* Kakao의 [카이(Khaiii) v0.4](https://github.com/kakao/khaiii) <sup>(별도설치 필요: [설치법](https://github.com/kakao/khaiii/wiki/빌드-및-설치))</sup>
* 울산대학교의 [UTagger 2018년 10월 31일자](http://nlplab.ulsan.ac.kr/doku.php?id=start) <sup>1-2, (별도설치 필요: [설치법](https://koalanlp.github.io/usage/Install-UTagger.md))</sup>

> <sup>주1-1</sup> Arirang 분석기의 출력을 형태소분석에 적합하게 조금 다듬었으므로, 원본과 약간 다른 결과를 낼 수도 있습니다.
>
> <sup>주1-2</sup> UTagger의 2019-7 버전도 공개되어 있지만, 리눅스 개발환경을 위한 라이브러리 파일이 공개되어있지 않아 지원하지 않습니다.

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
* Khaiii: [Apache License 2.0](https://tldrlegal.com/license/apache-license-2.0-(apache-2.0))
* UTagger: 교육 및 연구용으로 사용시 제한 없음. 상업용인 경우 울산대와 기술이전 등의 유료 협약 필요

# 사용법

상세한 사항은 [Usage](https://koalanlp.github.io/koalanlp/usage/) 또는 [![JS Doc](https://img.shields.io/badge/JS-Doc-blue.svg?style=flat-square)](https://koalanlp.github.com/nodejs-koalanlp/)을 참고하십시오.

## Dependency 추가
우선 Java 8 및 NodeJS 8 이상을 설치하고, `JAVA_HOME`을 환경변수에 등록해주십시오.
그런 다음, 아래와 같이 설치하십시오. (현재 nodejs-koalanlp 버전은 [![NPM Version](https://img.shields.io/npm/v/koalanlp.svg?style=flat-square)](https://github.com/koalanlp/nodejs-koalanlp)입니다.)

```bash
$ npm install koalanlp --save 
```

### Packages
각 형태소 분석기는 별도의 패키지로 나뉘어 있습니다.

| 패키지명            | 설명                                                                 |  사용 가능 버전    | License (원본)     |
| ------------------ | ------------------------------------------------------------------ | ---------------- | ----------------- |
| API.KMR          | 코모란 Wrapper, 분석범위: 형태소                                       | [![Ver-KMR](https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-kmr.svg?style=flat-square&label=r)](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22koalanlp-kmr%22)         | Apache 2.0 |
| API.EUNJEON      | 은전한닢 Wrapper, 분석범위: 형태소                                     | [![Ver-EJN](https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-eunjeon.svg?style=flat-square&label=r)](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22koalanlp-eunjeon%22) | Apache 2.0 |
| API.ARIRANG      | 아리랑 Wrapper, 분석범위: 형태소                                       | [![Ver-ARR](https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-arirang.svg?style=flat-square&label=r)](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22koalanlp-arirang%22) | Apache 2.0 |
| API.RHINO        | RHINO Wrapper, 분석범위: 형태소                                       | [![Ver-RHI](https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-rhino.svg?style=flat-square&label=r)](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22koalanlp-rhino%22)     | GPL v3 |
| API.DAON         | Daon Wrapper, 분석범위: 형태소                                        | [![Ver-DAN](https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-daon.svg?style=flat-square&label=r)](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22koalanlp-daon%22)       | MIT(별도 지정 없음) |
| API.KHAIII       | Khaiii Wrapper, 분석범위: 형태소 <sup>주2-3</sup>                                      | [![Ver-KHA](https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-khaiii.svg?style=flat-square&label=r)](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22koalanlp-khaiii%22)       | Apache 2.0 |
| API.UTAGGER      | 울산대 UTagger Wrapper / 분석범위: 형태소 <sup>2-4</sup>                                | [![Ver-UTA](https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-utagger.svg?style=flat-square&label=r)](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22koalanlp-utagger%22)       | 교육/연구용 무료, 상업용 별도협약 |
| API.OKT          | Open Korean Text Wrapper, 분석범위: 문장분리, 형태소                    | [![Ver-OKT](https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-okt.svg?style=flat-square&label=r)](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22koalanlp-okt%22)        | Apache 2.0  |
| API.KKMA         | 꼬꼬마 Wrapper, 분석범위: 형태소, 의존구문                               | [![Ver-KKM](https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-kkma.svg?style=flat-square&label=r)](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22koalanlp-kkma%22)       | GPL v2    |
| API.HNN          | 한나눔 Wrapper, 분석범위: 문장분리, 형태소, 구문분석, 의존구문               | [![Ver-HNN](https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-hnn.svg?style=flat-square&label=r)](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22koalanlp-hnn%22)        | GPL v3    |
| API.ETRI         | ETRI Open API Wrapper, 분석범위: 형태소, 구문분석, 의존구문, 개체명, 의미역 <sup>2-2</sup> | [![Ver-ETR](https://img.shields.io/maven-central/v/kr.bydelta/koalanlp-etri.svg?style=flat-square&label=r)](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22koalanlp-etri%22)      | MIT<sup>2-2</sup> |

> <sup>주2-2</sup> ETRI의 경우 Open API를 접근하기 위한 코드 부분은 KoalaNLP의 License 정책에 귀속되지만, Open API 접근 이후의 사용권에 관한 조항은 ETRI에서 별도로 정한 바를 따릅니다.
> 따라서, ETRI의 사용권 조항에 동의하시고 키를 발급하셔야 하며, 다음 위치에서 발급을 신청할 수 있습니다: [키 발급 신청](http://aiopen.etri.re.kr/key_main.php)
>
> <sup>주2-3</sup> Khaiii 분석기의 경우는 Java가 아닌 C++로 구현되어 사용 전 분석기의 설치가 필요합니다. Python3.6 및 CMake 3.10+만 설치되어 있다면 설치 자체가 복잡한 편은 아니니 [여기](https://github.com/kakao/khaiii/blob/v0.1/doc/setup.md)를 참조하여 설치해보세요. (단, v0.1에서는 빌드시 'python3' 호출시 'python3.6'이 연결되어야 합니다.) 참고로, KoalaNLP가 Travis CI에서 패키지를 자동 테스트하기 위해 구현된 bash script는 [여기](https://github.com/koalanlp/koalanlp/blob/master/khaiii/install.sh)에 있습니다.
>
> <sup>주2-4</sup> UTagger 분석기의 경우에도 C/C++로 구현되어, 사용 전 분석기의 설치가 필요합니다. 윈도우와 리눅스(우분투, CentOS)용 라이브러리 파일만 제공되며, 설치 방법은 [여기](https://koalanlp.github.io/usage/Install-UTagger.md)를 참조하십시오.

## 간단한 예시
`koalanlp`는, `node-java` 및 `node-java-maven` 패키지의 도움을 받아, 필요한 java dependency를 자동으로 가져옵니다.

> [참고] 최초 사용시 또는, 최신 패키지로 업데이트 되는 경우, dependency를 찾아오는 데 시간이 소요될 수 있습니다.
> 다운로드 진행 중에 취소하시면 다운로드 된 패키지가 corrupt 될 수 있습니다.
> 이 경우, Maven repository 저장 공간인 (`~/.m2`) 폴더에서 오류가 나는 패키지를 삭제하시고 다시 시작하십시오.

다음과 같이 사용합니다. (Node > 8, ECMAScript2017 기준)

### Async/Await 방식으로 사용할 때 (권장)

```js
const {KMR, KKMA} = require('koalanlp/API');
const {initialize} = require('koalanlp/Util');
const {Tagger, Parser} = require('koalanlp/proc');

async function executor(){
    await initialize({packages: {KMR: '2.0.4', KKMA: '2.0.4'}, verbose: true});

    let tagger = new Tagger(KMR);
    let tagged = await tagger("안녕하세요. 눈이 오는 설날 아침입니다.");
    for(const sent of tagged) {
        console.log(sent.toString());
    }

    let parser = new Parser(KKMA);
    let parsed = await parser("안녕하세요. 눈이 오는 설날 아침입니다.");
    for(const sent of parsed){
        console.log(sent.toString());
        for(const dep of sent.dependencies){
            console.log(dep.toString());
        }
    }
}

executor().then(
    () => console.log('finished!'), 
    (error) => console.error('Error Occurred!', error)
);
```

### Promise 방식으로 사용할 때

```js
const {KMR, KKMA} = require('koalanlp/API');
const {initialize} = require('koalanlp/Util');
const {Tagger, Parser} = require('koalanlp/proc');

initialize({packages: {KMR: '2.0.4', KKMA: '2.0.4'}, verbose: true})
    .then(() => {
        let tagger = new Tagger(KMR);
        tagger("안녕하세요. 눈이 오는 설날 아침입니다.").then((tagged) => {
            for (const sent of tagged) {
                console.log(sent.toString());
            }
        }, (error) => console.error('Error Occurred', error));

        let parser = new Parser(KKMA);
        parser("안녕하세요. 눈이 오는 설날 아침입니다.").then((parsed) => {
            for (const sent of parsed) {
                console.log(sent.toString());
                for (const dep of sent.dependencies) {
                    console.log(dep.toString());
                }
            }
        }, (error) => console.error('Error Occurred', error));

        console.log('finished!');
    }, (error) => console.error('Error Occurred!', error));
```

### Synchronous 방식으로 사용할 때

```js
const {KMR, KKMA} = require('koalanlp/API');
const {initialize} = require('koalanlp/Util');
const {Tagger, Parser} = require('koalanlp/proc');

// initialize 함수는 asynchronous만 지원합니다.
initialize({packages: {KMR: '2.0.4', KKMA: '2.0.4'}, verbose: true})
  .then(() => {
    let tagger = new Tagger(KMR);
    let tagged = tagger.tagSync("안녕하세요. 눈이 오는 설날 아침입니다.");
    for(const sent of tagged) {
        console.log(sent.toString());
    }

    let parser = new Parser(KKMA);
    let parsed = parser.analyzeSync("안녕하세요. 눈이 오는 설날 아침입니다.");
    for(const sent of parsed){
        console.log(sent.toString());
        for(const dep of sent.dependencies){
            console.log(dep.toString());
        }
    }
  });
```

# 결과 비교
[Sample:결과비교](https://koalanlp.github.io/sample/comparison)를 참조해주세요.
