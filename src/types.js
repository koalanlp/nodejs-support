
/**
 * 세종 품사표기 표준안을 Class로 담았습니다.
 *
 * @since 1.x
 * @property {string} name 세종 품사표기
 */
export class POS {
    /**
     * 품사를 연결합니다.
     * @param {string} name 세종 품사표기
     */
    constructor(name) {
        this.name = name;
        this.reference = java.
    }

    /**
     * 이 값이 체언(NOUNS)인지 확인합니다.
     *
     * @since 1.x
     * @return {boolean} 체언인 경우 True
     */
    isNoun() {
        return this.reference.isNounSync();
    }

    /**
     * 이 값이 용언(PREDICATES)인지 확인합니다.
     *
     * @since 1.x
     * @return {boolean} 용언인 경우 True
     */
    isPredicate() {
        return this.reference.isPredicateSync();
    }

    /**
     * 이 값이 수식언(MODIFIERS)인지 확인합니다.
     *
     * @since 1.x
     * @return {boolean} 수식언인 경우 True
     */
    isModifier() {
        return this.reference.isModifierSync();
    }

    /**
     * 이 값이 관계언(조사; POSTPOSITIONS)인지 확인합니다.
     *
     * @since 1.x
     * @return {boolean} 관계언인 경우 True
     */
    isPostPosition() {
        return this.reference.isPostPositionSync();
    }

    /**
     * 이 값이 어미(ENDINGS)인지 확인합니다.
     *
     * @since 1.x
     * @return {boolean} 어미인 경우 True
     */
    isEnding() {
        return this.reference.isEndingSync();
    }

    /**
     * 이 값이 접사(AFFIXES)인지 확인합니다.
     *
     * @since 1.x
     * @return {boolean} 접사인 경우 True
     */
    isAffix() {
        return this.reference.isAffixSync();
    }

    /**
     * 이 값이 접미사(SUFFIXES)인지 확인합니다.
     *
     * @since 1.x
     * @return {boolean} 접미사인 경우 True
     */
    isSuffix() {
        return this.reference.isSuffixSync();
    }

    /**
     * 이 값이 기호(SYMBOLS)인지 확인합니다.
     *
     * @since 1.x
     * @return {boolean} 기호인 경우 True
     */
    isSymbol() {
        return this.reference.isSymbolSync();
    }

    /**
     * 이 값이 미확인 단어(UNKNOWNS)인지 확인합니다.
     *
     * @since 1.x
     * @return {boolean} 미확인 단어인 경우 True
     */
    isUnknown() {
        return this.reference.isUnknownSync();
    }

    /**
     * 이 값이 주어진 [tag]로 시작하는지 확인합니다.
     *
     * @since 2.0.0
     * @param {string} tag 확인할 문자열
     * @return {boolean} 그러한 경우 True
     */
    startsWith(tag) {
        let xtag = tag.toUpperCase();
        if (xtag === "N") return this.name.startsWith(xtag) && !isUnknown();
        else return this.name.startsWith(xtag);
    }
}

/**
 * 세종 구문구조 표지자를 Enum class로 담았습니다.
 *
 * @since 2.0.0
 */
export class PhraseTag{
    /**
     * 표지자를 연결합니다.
     * @param {*} reference 표지자 Java object
     */
    constructor(reference) {
        this.name = reference.getNameSync();
        this.reference = reference;
    }

    /**
     * 구문구조 표지자: 문장
     */
    static S = new PhraseTag();
    /**
     * 구문구조 표지자: 체언 구
     *
     * 문장에서 주어 따위의 기능을 하는 명사, 대명사, 수사 또는 이 역할을 하는 구
     */
    NP,
    /**
     * 구문구조 표지자: 용언 구
     *
     * 문장에서 서술어의 기능을 하는 동사, 형용사 또는 이 역할을 하는 구
     */
    VP,
    /**
     * 구문구조 표지자: 긍정지정사구
     *
     * 무엇이 무엇이라고 지정하는 단어(이다) 또는 이 역할을 하는 구
     */
    VNP,
    /**
     * 구문구조 표지자: 부사구
     *
     * 용언구 또는 다른 말 앞에 놓여 그 뜻을 분명하게 하는 단어 또는 이 역할을 하는 구
     */
    AP,
    /**
     * 구문구조 표지자: 관형사구
     *
     * 체언구 앞에 놓여서, 그 체언구의 내용을 자세히 꾸며 주는 단어 또는 이 역할을 하는 구
     */
    DP,
    /**
     * 구문구조 표지자: 감탄사구
     *
     * 말하는 이의 본능적인 놀람이나 느낌, 부름, 응답 따위를 나타내는 단어 또는 이 역할을 하는 구
     */
    IP,
    /**
     * 구문구조 표지자: 의사(Pseudo) 구
     *
     * 인용부호와 괄호를 제외한 나머지 부호나, 조사, 어미가 단독으로 어절을 이룰 때 (즉, 구를 보통 이루지 않는 것이 구를 이루는 경우)
     */
    X,
    /**
     * 구문구조 표지자: 왼쪽 인용부호
     *
     * 열림 인용부호
     */
    L,
    /**
     * 구문구조 표지자: 오른쪽 인용부호
     *
     * 닫힘 인용부호
     */
    R,
    /**
     * 구문구조 표지자: 인용절
     *
     * 인용 부호 내부에 있는 인용된 절. 세종 표지에서는 Q, U, W, Y, Z가 사용되나 KoalaNLP에서는 하나로 통일함.
     */
    Q
}

/**
 * 세종 구문구조 표지자를 Enum class로 담았습니다.
 *
 * @since 2.0.0
 */
enum class PhraseTag {
    /**
     * 구문구조 표지자: 문장
     */
    S,
    /**
     * 구문구조 표지자: 체언 구
     *
     * 문장에서 주어 따위의 기능을 하는 명사, 대명사, 수사 또는 이 역할을 하는 구
     */
    NP,
    /**
     * 구문구조 표지자: 용언 구
     *
     * 문장에서 서술어의 기능을 하는 동사, 형용사 또는 이 역할을 하는 구
     */
    VP,
    /**
     * 구문구조 표지자: 긍정지정사구
     *
     * 무엇이 무엇이라고 지정하는 단어(이다) 또는 이 역할을 하는 구
     */
    VNP,
    /**
     * 구문구조 표지자: 부사구
     *
     * 용언구 또는 다른 말 앞에 놓여 그 뜻을 분명하게 하는 단어 또는 이 역할을 하는 구
     */
    AP,
    /**
     * 구문구조 표지자: 관형사구
     *
     * 체언구 앞에 놓여서, 그 체언구의 내용을 자세히 꾸며 주는 단어 또는 이 역할을 하는 구
     */
    DP,
    /**
     * 구문구조 표지자: 감탄사구
     *
     * 말하는 이의 본능적인 놀람이나 느낌, 부름, 응답 따위를 나타내는 단어 또는 이 역할을 하는 구
     */
    IP,
    /**
     * 구문구조 표지자: 의사(Pseudo) 구
     *
     * 인용부호와 괄호를 제외한 나머지 부호나, 조사, 어미가 단독으로 어절을 이룰 때 (즉, 구를 보통 이루지 않는 것이 구를 이루는 경우)
     */
    X,
    /**
     * 구문구조 표지자: 왼쪽 인용부호
     *
     * 열림 인용부호
     */
    L,
    /**
     * 구문구조 표지자: 오른쪽 인용부호
     *
     * 닫힘 인용부호
     */
    R,
    /**
     * 구문구조 표지자: 인용절
     *
     * 인용 부호 내부에 있는 인용된 절. 세종 표지에서는 Q, U, W, Y, Z가 사용되나 KoalaNLP에서는 하나로 통일함.
     */
    Q
}

class Util{
    /**
     * - tag가 [[POS]]라면, 이 str 값으로 주어진 tag가 시작되는지 확인합니다.
     *
     *
     * @since 2.0.0
     * @param {POS} tag 하위 분류인지 확인할 형태소 품사표기 값
     * @param {string} value 문자열 값
     * @return 해당한다면 true
     */
    static contains(tag, value){
        if(tag instanceof POS){
        return tag.startsWith(value)
    }
}

/**
 * (Extension) 주어진 목록에 주어진 구문구조 표지 [tag]가 포함되는지 확인합니다.
 *
 * ## 사용법
 * ### Kotlin
 * ```kotlin
 * PhraseTag.NP in listOf("S", "NP")
 * \\ 또는
 * listOf("S", "NP").contains(PhraseTag.NP)
 * ```
 *
 * ### Scala + [koalanlp-scala](https://koalanlp.github.io/scala-support/)
 * ```scala
 * import kr.bydelta.koala.Implicits._
 * PhraseTag.NP in Seq("S", "NP")
 * \\ 또는
 * Seq("S", "NP").contains(PhraseTag.NP)
 * ```
 *
 * ### Java
 * ```java
 * List<String> list = new LinkedList()
 * list.add("S")
 * list.add("NP")
 * Util.contains(list, PhraseTag.NP)
 * ```
 *
 * @since 2.0.0
 * @param[tag] 속하는지 확인할 구문구조 표지 값
 * @return 목록 중 하나라도 일치한다면 true
 */
operator fun Iterable<String>.contains(tag: PhraseTag): Boolean = this.any { it == tag.name }

/********************************************************/

/**
 * 의존구문구조 기능표지자를 담은 Enum class입니다.
 * (ETRI 표준안)
 *
 * [참고](http://aiopen.etri.re.kr/data/1.%20%EC%9D%98%EC%A1%B4%20%EA%B5%AC%EB%AC%B8%EB%B6%84%EC%84%9D%EC%9D%84%20%EC%9C%84%ED%95%9C%20%ED%95%9C%EA%B5%AD%EC%96%B4%20%EC%9D%98%EC%A1%B4%EA%B4%80%EA%B3%84%20%EA%B0%80%EC%9D%B4%EB%93%9C%EB%9D%BC%EC%9D%B8%20%EB%B0%8F%20%EC%97%91%EC%86%8C%EB%B8%8C%EB%A0%88%EC%9D%B8%20%EC%96%B8%EC%96%B4%EB%B6%84%EC%84%9D%20%EB%A7%90%EB%AD%89%EC%B9%98.pdf)
 *
 * @since 1.x
 */
enum class DependencyTag {
    /** ''주어'': 술어가 나타내는 동작이나 상태의 주체가 되는 말
     *
     * 주격 체언구(NP_SBJ), 명사 전성 용언구(VP_SBJ), 명사절(S_SBJ) */
    SBJ,

    /** ''목적어'': 타동사가 쓰인 문장에서 동작의 대상이 되는 말
     *
     * 목적격 체언구(NP_OBJ), 명사 전성 용언구(VP_OBJ), 명사절(S_OBJ) */
    OBJ,

    /** ''보어'': 주어와 서술어만으로는 뜻이 완전하지 못한 문장에서, 그 불완전한 곳을 보충하여 뜻을 완전하게 하는 수식어.
     *
     * 보격 체언구(NP_CMP), 명사 전성 용언구(VP_CMP), 인용절(S_CMP) */
    CMP,

    /** 체언 수식어(관형격). 관형격 체언구(NP_MOD), 관형형 용언구(VP_MOD), 관형절(S_MOD) */
    MOD,

    /** 용언 수식어(부사격). 부사격 체언구(NP_AJT), 부사격 용언구(VP_AJT) 문말어미+부사격 조사(S_AJT) */
    AJT,

    /** ''접속어'': 단어와 단어, 구절과 구절, 문장과 문장을 이어 주는 구실을 하는 문장 성분.
     *
     * 접속격 체언(NP_CNJ) */
    CNJ,

    /** 정의되지 않음: 기존 PRN(삽입어구) 포함 */
    UNDEF,

    /** ROOT 지시자 */
    ROOT
}

/**
 * (Extension) 주어진 목록에 주어진 의존구문 표지 [tag]가 포함되는지 확인.
 *
 * ## 사용법
 * ### Kotlin
 * ```kotlin
 * DependencyTag.SBJ in listOf("SBJ", "MOD")
 * \\ 또는
 * listOf("SBJ", "MOD").contains(DependencyTag.SBJ)
 * ```
 *
 * ### Scala + [koalanlp-scala](https://koalanlp.github.io/scala-support/)
 * ```scala
 * import kr.bydelta.koala.Implicits._
 * DependencyTag.SBJ in Seq("SBJ", "MOD")
 * \\ 또는
 * Seq("SBJ", "MOD").contains(DependencyTag.SBJ)
 * ```
 *
 * ### Java
 * ```java
 * List<String> list = new LinkedList()
 * list.add("SBJ")
 * list.add("MOD")
 * Util.contains(list, DependencyTag.SBJ)
 * ```
 *
 * @since 2.0.0
 * @param[tag] 속하는지 확인할 의존구조 표지 값
 * @return 목록 중 하나라도 일치한다면 true
 */
operator fun Iterable<String>.contains(tag: DependencyTag): Boolean = this.any { it == tag.name }

/************************************************************/

/**
 * 의미역(Semantic Role) 분석 표지를 담은 Enum class입니다.
 * (ETRI 표준안)
 *
 * @since 2.0.0
 */
enum class RoleType {
    /**
     * (필수격) **행동주, 경험자.** 술어로 기술된 행동을 하거나 경험한 대상.
     *
     * 예: {"진흥왕은" 화랑도를 개편했다.}에서 _<진흥왕은>_, {"쑨원은" 삼민주의를 내세웠다.}에서 _<쑨원은>_
     */
    ARG0,
    /**
     * (필수격) **피동작주, 대상.** 술어로 기술된 행동을 당한 대상 (주로 목적격, 피동작 대상). '이동'에 관한 행동에 의해서 위치의 변화가 되거나, '생성/소멸' 사건의 결과로 존재가 변화하는 대상.
     *
     * 예: {진흥왕은 "화랑도를" 개편했다.}에서 _<화랑도를>_, {"범인은" 사거리에서 발견되었다.}에서 _<범인은>_, {밤거리에는 "인적이" 드물다.}에서 _<인적이>_.
     */
    ARG1,
    /**
     * (필수격) **시작점, 수혜자, 결과.** 술어로 기술된 행동의 시작점, 행동으로 인해 수혜를 받는 대상, 행동을 기술하기 위해 필요한 장소.
     *
     * 예: {영희가 "철수에게서" 그 선물을 받았다.}에서 _<철수에게서>_.
     */
    ARG2,
    /**
     * (필수격) **착점.** 술어로 기술된 행동의 도착점.
     *
     * 예: {연이가 "동창회에" 참석했다.}에서 _<동창회에>_. {근이가 "학교에" 갔다.}에서 _<학교에>_.
     */
    ARG3,

    /**
     * (부가격) **장소.** 술어로 기술된 행동이 발생하는 공간. 주로 술어가 '이동'이 아닌 상태를 나타내고, '~에(서)' 조사와 함께 쓰이는 경우.
     *
     * 예: {친구들이 "서울에" 많이 산다.}에서 _<서울에>_.
     */
    ARGM_LOC,
    /**
     * (부가격) **방향.** 술어가 '이동' 상태를 나타낼 때, '~(으)로' 조사와 함께 쓰이는 경우.
     *
     * 예: {달이 "서쪽으로" 기울었다.}에서 _<서쪽으로>_. */
    ARGM_DIR,
    /**
     * (부가격) **조건.** 술어의 행동이 발생되는 조건이나 인물, 사물 따위의 자격을 나타내는 경우. 주로 '~중에', '~가운데에', '~보다', '~에 대해'
     *
     * 예: {"과세 대상 금액이 많을수록" 높은 세율을 적용한다.}에서 _<많을수록>_. */
    ARGM_CND,
    /**
     * (부가격) **방법.** 술어의 행동을 수행하는 방법. 또는 술어가 특정 언어에 의한 것을 나타낼 때, 그 언어. (구체적인 사물이 등장하는 경우는 [ARGM_INS] 참고)
     *
     * 예: {그는 "큰 소리로" 떠들었다.}에서 _<소리로>_. */
    ARGM_MNR,
    /**
     * (부가격) **시간.** 술어의 행동이 발생한 시간 등과 같이 술어와 관련된 시간. 명확한 날짜, 시기, 시대를 지칭하는 경우.
     *
     * 단, 기간의 범위를 나타내는 경우, 즉 ~에서 ~까지의 경우는 시점([ARG2])과 착점([ARG3])으로 분석함.
     *
     * 예: {진달래는 "이른 봄에" 핀다.}에서 _<봄에>_. */
    ARGM_TMP,
    /**
     * (부가격) **범위.** 크기 또는 높이 등의 수치나 정도를 논하는 경우. '가장', '최고', '매우', '더욱' 등을 나타내는 경우.
     *
     * 예: {그 악기는 "4개의" 현을 가진다.}에서 _<4개의>_. */
    ARGM_EXT,
    /**
     * (부가격) **보조서술.** 대상과 같은 의미이거나 대상의 상태를 나타내면서 술어를 수식하는 것. 주로 '~로서'. 또는 '최초로'와 같이 술어의 정해진 순서를 나타내는 경우.
     *
     * 예: {석회암 지대에서 "깔대기 모양으로" 파인 웅덩이가 생겼다.}에서 _<모양으로>_. */
    ARGM_PRD,
    /**
     * (부가격) **목적.** 술어의 주체가 가진 목표. 또는 행위의 의도. 주로 '~를 위해'. 발생 이유([ARGM_CAU])와 유사함에 주의.
     *
     * 예: {주나라의 백이와 숙제는 "절개를 지키고자" 수양산에 거처했다.}에서 _<지키고자>_. */
    ARGM_PRP,
    /**
     * (부가격) **발생 이유.** 술어가 발생한 이유. '~때문에'를 대신할 수 있는 조사가 붙은 경우. 목적([ARGM_PRP])과 혼동되나, 목적은 아닌 것.
     *
     * 예: {지난 밤 "강풍으로" 가로수가 넘어졌다.}에서 _<강풍으로>_. */
    ARGM_CAU,
    /**
     * (부가격) **담화 연결.** 문장 접속 부사. (그러나, 그리고, 즉 등.)
     *
     * 예: {"하지만" 여기서 동, 서는 중국과 유럽을 뜻한다.}에서 _<하지만>_. */
    ARGM_DIS,
    /**
     * (부가격) **부사적 어구.** ('마치', '물론', '역시' 등)
     *
     * 예: {산의 능선이 "마치" 닭벼슬을 쓴 용의 형상을 닮았다.}에서 _<마치>_. */
    ARGM_ADV,
    /**
     * (부가격) **부정.** 술어에 부정의 의미를 더하는 경우.
     *
     * 예: {산은 불에 타지 "않았다."}에서 _<않았다.>_. */
    ARGM_NEG,
    /**
     * (부가격) **도구.** 술어의 행동을 할 때 사용되는 도구. 방법([ARGM_MNR])보다 구체적인 사물이 등장할 때.
     *
     * 예: {"하얀 천으로" 상자를 덮었다.}에서 _<천으로>_. */
    ARGM_INS
}

/**
 * (Extension) 주어진 목록에 주어진 의미역 표지 [tag]가 포함되는지 확인합니다.
 *
 * ## 사용법
 * ### Kotlin
 * ```kotlin
 * RoleType.ARG0 in listOf("ARG0", "ARGM_LOC")
 * \\ 또는
 * listOf("ARG0", "ARGM_LOC").contains(RoleType.ARG0)
 * ```
 *
 * ### Scala + [koalanlp-scala](https://koalanlp.github.io/scala-support/)
 * ```scala
 * import kr.bydelta.koala.Implicits._
 * RoleType.ARG0 in Seq("ARG0", "ARGM_LOC")
 * \\ 또는
 * Seq("ARG0", "ARGM_LOC").contains(RoleType.ARG0)
 * ```
 *
 * ### Java
 * ```java
 * List<String> list = new LinkedList()
 * list.add("ARG0")
 * list.add("ARGM_LOC")
 * Util.contains(list, RoleType.ARG0)
 * ```
 *
 * @since 2.0.0
 * @param[tag] 속하는지 확인할 의미역 표지 값
 * @return 목록 중 하나라도 일치한다면 true
 */
operator fun Iterable<String>.contains(tag: RoleType): Boolean = this.any { it == tag.name }

/************************************************************/

/**
 * 대분류 개체명(Named Entity) 유형을 담은 Enum class입니다.
 * (ETRI 표준안)
 *
 * @since 2.0.0
 */
enum class CoarseEntityType {
    /**
     * 사람의 이름
     */
    PS,

    /**
     * 장소의 이름
     */
    LC,

    /**
     * 단체의 이름
     */
    OG,

    /**
     * 작품/물품의 이름
     */
    AF,

    /**
     * 기간/날짜의 이름
     */
    DT,

    /**
     * 시간/간격의 이름
     */
    TI,

    /**
     * 문명/문화활동에 사용되는 명칭
     */
    CV,

    /**
     * 동물의 이름
     */
    AM,

    /**
     * 식물의 이름
     */
    PL,

    /**
     * 수량의 값, 서수 또는 이름
     */
    QT,

    /**
     * 학문분야 또는 학파, 예술사조 등의 이름
     */
    FD,

    /**
     * 이론, 법칙, 원리 등의 이름
     */
    TR,

    /**
     * 사회적 활동, 운동, 사건 등의 이름
     */
    EV,

    /**
     * 화학적 구성물의 이름
     */
    MT,

    /**
     * 용어
     */
    TM
}

/**
 * (Extension) 주어진 목록에 주어진 개체명 유형 [tag]가 포함되는지 확인합니다.
 *
 * ## 사용법
 * ### Kotlin
 * ```kotlin
 * CoarseEntityType.PL in listOf("PS", "PL")
 * \\ 또는
 * listOf("PS", "PL").contains(CoarseEntityType.PL)
 * ```
 *
 * ### Scala + [koalanlp-scala](https://koalanlp.github.io/scala-support/)
 * ```scala
 * import kr.bydelta.koala.Implicits._
 * CoarseEntityType.PL in Seq("PS", "PL")
 * \\ 또는
 * Seq("PS", "PL").contains(CoarseEntityType.PL)
 * ```
 *
 * ### Java
 * ```java
 * List<String> list = new LinkedList()
 * list.add("PS")
 * list.add("PL")
 * Util.contains(list, CoarseEntityType.PL)
 * ```
 *
 * @since 2.0.0
 * @param[tag] 속하는지 확인할 개체명 표지 값
 * @return 목록 중 하나라도 일치한다면 true
 */
operator fun Iterable<String>.contains(tag: CoarseEntityType): Boolean = this.any { it == tag.name }
