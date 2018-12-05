import * as ExtUtil from '../src/ExtUtil';
import _ from 'underscore';

export default function () {
    describe('ExtUtil Module', () => {
        describe('Alphabet Reading', () => {
            let examples = [
                ["A", "에이"],
                ["B", "비"],
                ["C", "씨"],
                ["D", "디"],
                ["E", "이"],
                ["F", "에프"],
                ["G", "지"],
                ["H", "에이치"],
                ["I", "아이"],
                ["J", "제이"],
                ["K", "케이"],
                ["L", "엘"],
                ["M", "엠"],
                ["N", "엔"],
                ["O", "오"],
                ["P", "피"],
                ["Q", "큐"],
                ["R", "알"],
                ["S", "에스"],
                ["T", "티"],
                ["U", "유"],
                ["V", "브이"],
                ["W", "더블유"],
                ["X", "엑스"],
                ["Y", "와이"],
                ["Z", "제트"]
            ];

            it('can read/write alphabet', () => {
                _.range(50).forEach(() => {
                    let sample = _.sample(examples, 6);
                    let original = sample.map((t) => t[0]);
                    let korean = sample.map((t) => t[1]);
                    let originalStr = original.join('');
                    let koreanStr = korean.join('');

                    expect(ExtUtil.alphaToHangul(originalStr)).toBe(koreanStr);
                    expect(ExtUtil.hangulToAlpha(koreanStr)).toBe(originalStr);
                    expect(ExtUtil.isAlphaPronounced(koreanStr)).toBe(true);
                });

                expect(ExtUtil.alphaToHangul("삼성 갤럭시 S9")).toBe("삼성 갤럭시 에스9");
                expect(ExtUtil.hangulToAlpha("이마트")).toBe("E마트");
                expect(ExtUtil.isAlphaPronounced('E마트')).toBe(false);
            });
        });

        describe('Hanja Reading', () => {
            let sample = [["可高可下", "가고가하"],
                ["家道和平", "가도화평"],
                ["家傳忠孝", "가전충효"],
                ["家和泰祥", "가화태상"],
                ["竭力盡忠", "갈력진충"],
                ["江深水靜", "강심수정"],
                ["康和器務", "강화기무"],
                ["居安思危", "거안사위"],
                ["擧案齊眉", "거안제미"],
                ["健和誠最", "건화성최"],
                ["格物致知", "격물치지"],
                ["見利思義", "견리사의"],
                ["見月忘指", "견월망지"],
                ["堅忍不拔", "견인불발"],
                ["堅忍不敗", "견인불패"],
                ["敬事而信", "경사이신"],
                ["敬愛和樂", "경애화락"],
                ["敬天乃孝", "경천내효"],
                ["敬天愛人", "경천애인"],
                ["苦盡甘來", "고진감래"],
                ["恭謙克讓", "공겸극양"],
                ["過猶不及", "과유불급"],
                ["寬仁厚德", "관인후덕"],
                ["光風霽月", "광풍제월"],
                ["敎學相長", "교학상장"],
                ["口傳心授", "구전심수"],
                ["君子九思", "군자구사"],
                ["君子不器", "군자불기"],
                ["捲土重來", "권토중래"],
                ["克己復禮", "극기부례"], //극기복례가 맞으나, 음가사전의 대표음 표기는 극기부례로 되어있음
                ["克己常進", "극기상진"],
                ["勤儉和順", "근검화순"],
                ["根深枝茂", "근심지무"],
                ["勤者必成", "근자필성"],
                ["金玉滿堂", "금옥만당"],
                ["氣山心海", "기산심해"],
                ["樂在人和", "낙재인화"],
                ["樂天知命", "낙천지명"],
                ["囊中之錐", "낭중지추"],
                ["駑馬十駕", "노마십가"],
                ["農者之心", "농자지심"],
                ["訥言敏行", "눌언민행"],
                ["能忍自安", "능인자안"],
                ["多情佛心", "다정불심"],
                ["膽大心小", "담대심소"],
                ["大器晩成", "대기만성"],
                ["大道無門", "대도무문"],
                ["大象無形", "대상무형"],
                ["大人君子", "대인군자"],
                ["大人無己", "대인무기"],
                ["大志遠望", "대지원망"],
                ["大中至正", "대중지정"],
                ["達人大觀", "달인대관"],
                ["德盛禮恭", "덕성예공"],
                ["德在人先", "덕재인선"],
                ["德知體技", "덕지체기"],
                ["德必有隣", "덕필유린"],
                ["韜光養晦", "도광양회"],
                ["道法自然", "도법자연"],
                ["道常無名", "도상무명"],
                ["磨斧作針", "마부작침"],
                ["萬古常靑", "만고상청"],
                ["萬事亨通", "만사형통"],
                ["梅經寒苦", "매경한고"],
                ["每事盡善", "매사진선"],
                ["明鏡止水", "명경지수"],
                ["名實相符", "명실상부"],
                ["無愧我心", "무괴아심"],
                ["無愧於天", "무괴어천"],
                ["無念積善", "무념적선"],
                ["無信不立", "무신불립"],
                ["務實力行", "무실력행"], //무실역행이 맞는 발음이나 두음법칙 적용이 되지 않음
                ["無言實踐", "무언실천"],
                ["無忍不勝", "무인불승"],
                ["無慾淸淨", "무욕청정"],
                ["無爲而和", "무위이화"],
                ["無爲自然", "무위자연"],
                ["無意無技", "무의무기"],
                ["無汗不得", "무한부득"],
                ["無汗不成", "무한불성"],
                ["美悳傳家", "미덕전가"],
                ["敏事愼言", "민사신언"],
                ["拍掌大笑", "박장대소"],
                ["博學篤志", "박학독지"],
                ["反哺之孝", "반포지효"],
                ["百世淸風", "백세청풍"],
                ["百忍三思", "백인삼사"],
                ["報本之心", "보본지심"],
                ["福緣善慶", "복연선경"],
                ["本立道生", "본립도생"],
                ["俯仰無愧", "부앙무괴"],
                ["父慈子孝", "부자자효"],
                ["不狂不及", "불광불급"],
                ["不撓不屈", "불뇨불굴"], //불요불굴이 맞는 발음이나 두음법칙 적용이 되지 않음
                ["鵬夢蟻生", "붕몽의생"],
                ["非禮勿動", "비례물동"],
                ["邪不犯正", "사불범정"],
                ["射石飮羽", "사석음우"],
                ["思始觀終", "사시관종"],
                ["事人如天", "사인여천"],
                ["思判行省", "사판행성"],
                ["事必歸正", "사필귀정"],
                ["山高水長", "산고수장"],
                ["殺身成仁", "살신성인"],
                ["三思一言", "삼사일언"],
                ["三省吾身", "삼성오신"],
                ["三忍九思", "삼인구사"],
                ["上敬下愛", "상경하애"],
                ["塞翁之馬", "새옹지마"],
                ["瑞氣雲集", "서기운집"],
                ["瑞氣集門", "서기집문"],
                ["先公後私", "선공후사"],
                ["先事後得", "선사후득"],
                ["先手必勝", "선수필승"],
                ["善始善終", "선시선종"],
                ["先憂後樂", "선우후락"],
                ["先正其心", "선정기심"],
                ["先行後言", "선행후언"],
                ["誠勤是寶", "성근시보"],
                ["成實在勤", "성실재근"],
                ["誠心誠意", "성심성의"],
                ["誠意正心", "성의정심"],
                ["少言多行", "소언다행"],
                ["少慾知足", "소욕지족"],
                ["首邱初心", "수구초심"],
                ["修己治人", "수기치인"],
                ["壽福康寧", "수복강녕"],
                ["壽山福海", "수산복해"],
                ["修身齊家", "수신제가"],
                ["水滴石穿", "수적석천"],
                ["水滴成川", "수적성천"],
                ["熟慮斷行", "숙려단행"],
                ["夙興夜寐", "숙흥야매"],
                ["崇德廣業", "숭덕광업"],
                ["崇祖愛族", "숭조애족"],
                ["習勤忘勞", "습근망로"],
                ["始終如一", "시종여일"],
                ["始終一貫", "시종일관"],
                ["信心直行", "신심직행"],
                ["信愛忍和", "신애인화"],
                ["實事求是", "실사구시"],
                ["心安如海", "심안여해"],
                ["身言書判", "신언서판"],
                ["深思高擧", "심사고거"],
                ["深思敏行", "심사민행"],
                ["心身健康", "심신건강"],
                ["心淸高志", "심청고지"],
                ["心淸事達", "심청사달"],
                ["心平氣和", "심평기화"],
                ["安分知足", "안분지족"],
                ["安貧樂道", "안빈낙도"],
                ["愛之實踐", "애지실천"],
                ["養德遠害", "양덕원해"],
                ["語愛顔慈", "어애안자"],
                ["抑强扶弱", "억강부약"],
                ["言辭安定", "언사안정"],
                ["言行一致", "언행일치"],
                ["易地思之", "역지사지"],
                ["吾唯知足", "오유지족"],
                ["溫故知新", "온고지신"],
                ["外柔內剛", "외유내강"],
                ["愚公移山", "우공이산"],
                ["運數大通", "운수대통"],
                ["元亨利貞", "원형이정"],
                ["有備無患", "유비무환"],
                ["流水不腐", "유수불부"],
                ["有始有終", "유시유종"],
                ["唯我獨尊", "유아독존"],
                ["悠悠自適", "유유자적"],
                ["有志竟成", "유지경성"],
                ["殷鑑不遠", "은감불원"],
                ["陰德陽報", "음덕양보"],
                ["里仁爲美", "이인위미"],
                ["仁德智交", "인덕지교"],
                ["仁愛恭儉", "인애공검"],
                ["仁義禮智", "인의예지"],
                ["人一己百", "인일기백"],
                ["仁者無敵", "인자무적"],
                ["忍中有和", "인중유화"],
                ["忍之爲德", "인지위덕"],
                ["一刻千金", "일각천금"],
                ["一諾千金", "일낙천금"],
                ["一念通天", "일념통천"],
                ["一忍百樂", "일인백락"],
                ["一日三省", "일일삼성"],
                ["一心同體", "일심동체"],
                ["一生懸命", "일생현명"],
                ["日善日創", "일선일창"],
                ["一水四見", "일수사견"],
                ["一心萬能", "일심만능"],
                ["一心正念", "일심정념"],
                ["一日一善", "일일일선"],
                ["一以貫之", "일이관지"],
                ["日進月步", "일진월보"],
                ["日就月將", "일취월장"],
                ["一行三昧", "일행삼매"],
                ["立身揚名", "입신양명"],
                ["自彊不息", "자강불식"],
                ["自求多福", "자구다복"],
                ["慈悲無敵", "자비무적"],
                ["自勝者强", "자승자강"],
                ["慈顔愛語", "자안애어"],
                ["自重自愛", "자중자애"],
                ["積德爲福", "적덕위복"],
                ["積德種善", "적덕종선"],
                ["積小成大", "적소성대"],
                ["正道無憂", "정도무우"],
                ["正道無敵", "정도무적"],
                ["正道正行", "정도정행"],
                ["正善如流", "정선여류"],
                ["正心大道", "정심대도"],
                ["正心修己", "정심수기"],
                ["正心修德", "정심수덕"],
                ["正心正行", "정심정행"],
                ["正正堂堂", "정정당당"],
                ["諸行無常", "제행무상"],
                ["切磋琢磨", "절차탁마"],
                ["中正仁義", "중정인의"],
                ["志石心鏡", "지석심경"],
                ["至誠感天", "지성감천"],
                ["至誠無息", "지성무식"],
                ["止於至善", "지어지선"],
                ["至仁無親", "지인무친"],
                ["知足不辱", "지족불욕"],
                ["知足常樂", "지족상락"],
                ["知足者富", "지족자부"],
                ["知行合一", "지행합일"],
                ["眞心盡力", "진심진력"],
                ["眞心出死", "진심출사"],
                ["責任完遂", "책임완수"],
                ["處變不驚", "처변불경"],
                ["處染常淨", "처염상정"],
                ["天道無親", "천도무친"],
                ["川流不息", "천류불식"],
                ["天長地久", "천장지구"],
                ["天天想新", "천천상신"],
                ["天下泰平", "천하태평"],
                ["淸廉潔白", "청렴결백"],
                ["淸心正行", "청심정행"],
                ["淸香滿堂", "청향만당"],
                ["初志一貫", "초지일관"],
                ["寵辱不驚", "총욕불경"],
                ["春華秋實", "춘화추실"],
                ["忠信篤敬", "충신독경"],
                ["忠禮傳家", "충예전가"],
                ["忠孝敬睦", "충효경목"],
                ["他山之石", "타산지석"],
                ["擇善固執", "택선고집"],
                ["擇言篤志", "택언독지"],
                ["破邪顯正", "파사현정"],
                ["庖丁解牛", "포정해우"],
                ["被褐懷玉", "피갈회옥"],
                ["學行一致", "학행일치"],
                ["恒産恒心", "항산항심"],
                ["香遠益淸", "향원익청"],
                ["向學立志", "향학립지"], //향학입지가 맞는 발음이나, 두음법칙이 적용되지 않음.
                ["虛心平意", "허심평의"],
                ["虛心合道", "허심합도"],
                ["螢雪之功", "형설지공"],
                ["虎視牛行", "호시우행"],
                ["浩然之氣", "호연지기"],
                ["弘益人間", "홍익인간"],
                ["和氣滿堂", "화기만당"],
                ["禍福無門", "화복무문"],
                ["和信家樂", "화신가락"],
                ["和義淸正", "화의청정"],
                ["和而不同", "화이부동"],
                ["孝友文行", "효우문행"],
                ["孝忍知愛", "효인지애"],
                ["孝悌忠信", "효제충신"],
                ["斅學相長", "효학상장"],
                ["雷雨", "뇌우"],
                ["老人恭敬", "노인공경"],
                ["300 兩, 閑兩", "300 냥, 한량"],
                [" 兩班", " 양반"],
                ["1492 年에", "1492 년에"],
                ["年月日", "연월일"],
                ["30 里를 운행한 2 輛의 기차", "30 리를 운행한 2 량의 기차"],
                ["百分率 發付率 知刻率", "백분율 발부율 지각률"],
                ["一列", "일렬"],
                ["戰列", "전열"],
                ["金吉東 金天動 入金額", "김길동 김천동 입금액"],
                ["不實 不동의 不견", "부실 부동의 불견"]];

            it('can read Hanja', () => {
                for (const [hanja, hangul] of sample) {
                    expect(ExtUtil.hanjaToHangul(hanja)).toBe(hangul);
                }

                expect(ExtUtil.hanjaToHangul("한 女人이 길을 건넜다", false)).toBe("한 녀인이 길을 건넜다");
                expect(ExtUtil.hanjaToHangul("한 女人이 길을 건넜다", true)).toBe("한 여인이 길을 건넜다");
            });

            it('can recognize Hanja', () => {
                expect(ExtUtil.isHanja('金')).toEqual([true]);
                expect(ExtUtil.isHanja('㹤')).toEqual([true]);

                expect(ExtUtil.isHanja('김')).toEqual([false]);
                expect(ExtUtil.isHanja("⺀⺁⺂⻱⻲⻳").every((x) => x)).toBe(true)
            });
        });

        describe('Hangul Processor', () => {
            it('identifies hangul character', () => {
                expect(ExtUtil.isCompleteHangul('k')).toEqual([false]);
                expect(ExtUtil.isCompleteHangul('車')).toEqual([false]);
                expect(ExtUtil.isCompleteHangul('\u1161')).toEqual([false]);
                expect(ExtUtil.isJungsungJamo('\u1161')).toEqual([true]);

                let hangulSentence = "무조건 한글로 말하라니 이거 참 난감하군";
                let recognized = ExtUtil.isCompleteHangul(hangulSentence);

                for (const [ch, rec] of _.zip(hangulSentence, recognized)) {
                    expect(ch !== ' ').toBe(rec);
                }

                let mixedSentence = "SNS '인플루엔서' 쇼핑 피해 심각... 법적 안전장치 미비: ㄱ씨는 요즘 ㄴ SNS에서 갤럭시S";
                let isCompleteHangul = ExtUtil.isCompleteHangul(mixedSentence);
                let isHangul = ExtUtil.isHangul(mixedSentence);
                let isIncompleteHangul = ExtUtil.isIncompleteHangul(mixedSentence);
                let isChosungJamo = ExtUtil.isChosungJamo(mixedSentence);
                let isJungsungJamo = ExtUtil.isJungsungJamo(mixedSentence);
                let isJongsungJamo = ExtUtil.isJongsungJamo(mixedSentence);

                for (const [ch, a, h, ih, j1, j2, j3] of _.zip(mixedSentence, isCompleteHangul, isHangul, isIncompleteHangul, isChosungJamo, isJungsungJamo, isJongsungJamo)) {
                    let je = ExtUtil.isJongsungEnding(ch);

                    if ("SN '.:".includes(ch)) {
                        expect(a).toBe(false);
                        expect(h).toBe(false);
                        expect(ih).toBe(false);
                        expect(j1).toBe(false);
                        expect(j2).toBe(false);
                        expect(j3).toBe(false);
                        expect(je).toBe(false);
                    } else if ("ㄱㄴ".includes(ch)) {
                        expect(a).toBe(false);
                        expect(h).toBe(true);
                        expect(ih).toBe(true);
                        expect(j1).toBe(false);
                        expect(j2).toBe(false);
                        expect(j3).toBe(false);
                        expect(je).toBe(false);
                    } else {
                        expect(a).toBe(true);
                        expect(h).toBe(true);
                        expect(ih).toBe(false);
                        expect(j1).toBe(false);
                        expect(j2).toBe(false);
                        expect(j3).toBe(false);
                        expect(je).toBe("인플엔핑심각법적안전장는즘갤럭".includes(ch));
                    }
                }

                let fragments = mixedSentence.split(" ");
                for (const fragment of fragments) {
                    expect(ExtUtil.isHangulEnding(fragment)).toBe(!["SNS", "'인플루엔서'", "심각...", "미비:", "갤럭시S"].includes(fragment));
                    expect(ExtUtil.isJongsungEnding(fragment)).toBe(["쇼핑", "법적", "ㄱ씨는", "요즘"].includes(fragment));
                }
            });

            it('dissembles hangul', () => {
                let sent = "SNS '인플루엔서' 쇼핑 피해 심각... 법적 안전장치 미비: ㄱ씨는 요즘 ㄴ SNS에서 갤럭시S";
                let completeHangul = ExtUtil.isCompleteHangul(sent);
                let chosung = ExtUtil.getChosung(sent);
                let jungsung = ExtUtil.getJungsung(sent);
                let jongsung = ExtUtil.getJongsung(sent);

                for (const [a, j1, j2, j3] of _.zip(completeHangul, chosung, jungsung, jongsung)) {
                    if (a) {
                        expect(ExtUtil.isChosungJamo(j1).every((x) => x)).toBe(true);
                        expect(ExtUtil.isJungsungJamo(j1).some((x) => x)).toBe(false);
                        expect(ExtUtil.isJongsungJamo(j1).some((x) => x)).toBe(false);

                        expect(ExtUtil.getChosung(j1)[0]).toBe(j1);
                        expect(typeof ExtUtil.getJungsung(j1)[0] === 'undefined').toBe(true);
                        expect(typeof ExtUtil.getJongsung(j1)[0] === 'undefined').toBe(true);

                        expect(ExtUtil.isChosungJamo(j2).some((x) => x)).toBe(false);
                        expect(ExtUtil.isJungsungJamo(j2).every((x) => x)).toBe(true);
                        expect(ExtUtil.isJongsungJamo(j2).some((x) => x)).toBe(false);

                        expect(typeof ExtUtil.getChosung(j2)[0] === 'undefined').toBe(true);
                        expect(ExtUtil.getJungsung(j2)[0]).toBe(j2);
                        expect(typeof ExtUtil.getJongsung(j2)[0] === 'undefined').toBe(true);

                        if (typeof j3 !== 'undefined') {
                            expect(ExtUtil.isChosungJamo(j3).some((x) => x)).toBe(false);
                            expect(ExtUtil.isJungsungJamo(j3).some((x) => x)).toBe(false);
                            expect(ExtUtil.isJongsungJamo(j3).every((x) => x)).toBe(true);

                            expect(typeof ExtUtil.getChosung(j3)[0] === 'undefined').toBe(true);
                            expect(typeof ExtUtil.getJungsung(j3)[0] === 'undefined').toBe(true);
                            expect(ExtUtil.getJongsung(j3)[0]).toBe(j3);
                        }
                    } else {
                        expect(typeof j1 === 'undefined').toBe(true);
                        expect(typeof j2 === 'undefined').toBe(true);
                        expect(typeof j3 === 'undefined').toBe(true);
                    }
                }
            });

            it('assembles hangul', () => {
                _.range(100).forEach(() => {
                    let code = _.range(4).map(() => [
                        String.fromCharCode(0x1100 + _.random(0, 17)),
                        String.fromCharCode(0x1161 + _.random(0, 19)),
                        (_.random(0, 27) == 0) ? undefined : String.fromCharCode(0x11A8 + _.random(0, 26))
                    ]);
                    let codestr = code.map((c) => c.filter((x) => typeof x !== 'undefined').join('')).join('');
                    let triplestr = code.map((c) => ExtUtil.assembleHangulTriple(c[0], c[1], c[2])).join('');
                    let str = ExtUtil.assembleHangul(codestr);

                    expect(triplestr).toBe(str);
                    expect(ExtUtil.isJongsungEnding(str)).toBe(ExtUtil.isJongsungJamo(codestr).reverse()[0]);
                    expect(ExtUtil.isJongsungEnding(str)).toBe(typeof code.reverse()[0][2] !== 'undefined');
                    code.reverse();

                    expect(ExtUtil.getChosung(str)).toEqual(code.map((x) => x[0]));
                    expect(ExtUtil.getJungsung(str)).toEqual(code.map((x) => x[1]));
                    expect(ExtUtil.getJongsung(str)).toEqual(code.map((x) => x[2]));

                    expect(ExtUtil.dissembleHangul(str)).toBe(codestr)
                });

                let sampleString = "SNS '인플루엔서' 쇼핑 피해 심각... 법적 안전장치 미비: ㄱ씨는 요즘 ㄴ SNS에서 갤럭시S \u1100\u1100 \u11A8\u11A8";
                expect(ExtUtil.assembleHangul(ExtUtil.dissembleHangul(sampleString))).toBe(sampleString);
            });
        });

        describe('Verb Application Correction', () => {
            let map = `
        V 벗 아/어/ㅏ/ㅓ 벗어 자 벗자
        V 솟 아/어/ㅏ/ㅓ 솟아 니 솟니 자 솟자
        V 씻 아/어/ㅏ/ㅓ 씻어 니 씻니 자 씻자
        V 뺏 아/어/ㅏ/ㅓ 뺏어 니 뺏니 자 뺏자
        A 낫 아/어/ㅏ/ㅓ 나아 니 낫니 자 낫자
        V 젓 아/어/ㅏ/ㅓ 저어 는 젓는 자 젓자
        V 긋 아/어/ㅏ/ㅓ 그어 기 긋기 니 긋니
        V 앗 아/어/ㅏ/ㅓ 앗아 기 앗기 니 앗니 ㄴ 앗은
        V 빼앗 아/어/ㅏ/ㅓ 빼앗아 기 빼앗기 으니 빼앗으니
        V 잣 아/어/ㅏ/ㅓ 자아 으니 자으니 소 잣소
        V 듣 아/어/ㅏ/ㅓ 들어 소 듣소 기 듣기 니 듣니
        V 깨닫 아/어/ㅏ/ㅓ 깨달아 니 깨닫니
        A 붇 아/어/ㅏ/ㅓ 불어 은 불은 ㅁ 불음 네 붇네
        V 뜯 아/어/ㅏ/ㅓ 뜯어 은 뜯은 ㅁ 뜯음 네 뜯네
        A 눋 아/어/ㅏ/ㅓ 눌어 은 눌은 ㅁ 눌음 네 눋네
        V 겯 아/어/ㅏ/ㅓ 결어
        V 싣 아/어/ㅏ/ㅓ 실어
        V 일컫 아/어/ㅏ/ㅓ 일컬어
        V 묻 아/어/ㅏ/ㅓ 묻어
        V 걷 아/어/ㅏ/ㅓ 걸어
        V 돕 아/어/ㅏ/ㅓ 도와 은 도운 ㅁ 도움
        A 곱 아/어/ㅏ/ㅓ 고와 은 고운 ㅁ 고움
        A 굽 아/어/ㅏ/ㅓ 굽어 은 굽은 ㅁ 굽음
        V 뽑 아/어/ㅏ/ㅓ 뽑아 은 뽑은 ㅁ 뽑음
        V 씹 아/어/ㅏ/ㅓ 씹어 은 씹은 ㅁ 씹음
        V 업 아/어/ㅏ/ㅓ 업어 은 업은 ㅁ 업음
        V 입 아/어/ㅏ/ㅓ 입어 은 입은 ㅁ 입음
        V 잡 아/어/ㅏ/ㅓ 잡아 은 잡은 ㅁ 잡음
        V 접 아/어/ㅏ/ㅓ 접어 은 접은 ㅁ 접음
        A 좁 아/어/ㅏ/ㅓ 좁아 은 좁은 ㅁ 좁음
        V 집 아/어/ㅏ/ㅓ 집어 은 집은 ㅁ 집음
        A 덥 아/어/ㅏ/ㅓ 더워 은 더운 ㅁ 더움
        A 우습 아/어/ㅏ/ㅓ 우스워 은 우스운 ㅁ 우스움
        V 줍 아/어/ㅏ/ㅓ 주워 은 주운 ㅁ 주움
        A 더럽 아/어/ㅏ/ㅓ 더러워 은 더러운 ㅁ 더러움
        A 무섭 아/어/ㅏ/ㅓ 무서워 은 무서운 ㅁ 무서움
        A 귀엽 아/어/ㅏ/ㅓ 귀여워 은 귀여운 ㅁ 귀여움
        A 안쓰럽 아/어/ㅏ/ㅓ 안쓰러워 은 안쓰러운 ㅁ 안쓰러움
        A 아름답 아/어/ㅏ/ㅓ 아름다워 은 아름다운
        A 아니꼽 아/어/ㅏ/ㅓ 아니꼬워 은 아니꼬운
        A 아깝 아/어/ㅏ/ㅓ 아까워 은 아까운
        A 감미롭 아/어/ㅏ/ㅓ 감미로워 은 감미로운
        V 구르 아/어/ㅏ/ㅓ 굴러 은 구른
        V 모르 아/어/ㅏ/ㅓ 몰라 은 모른
        V 벼르 아/어/ㅏ/ㅓ 별러 은 벼른
        V 마르 아/어/ㅏ/ㅓ 말라 은 마른
        V 무르 아/어/ㅏ/ㅓ 물러 은 무른
        V 누르 아/어/ㅏ/ㅓ 눌러 은 누른
        V 다르 아/어/ㅏ/ㅓ 달라 은 다른
        V 사르 아/어/ㅏ/ㅓ 살라 은 사른
        V 바르 아/어/ㅏ/ㅓ 발라 은 바른
        V 가르 아/어/ㅏ/ㅓ 갈라 은 가른
        V 나르 아/어/ㅏ/ㅓ 날라 은 나른
        V 자르 아/어/ㅏ/ㅓ 잘라 은 자른
        V 치르 아/어/ㅏ/ㅓ 치러 은 치른
        V 따르 아/어/ㅏ/ㅓ 따라 은 따른
        V 다다르 아/어/ㅏ/ㅓ 다다라 은 다다른
        V 우러르 아/어/ㅏ/ㅓ 우러러 은 우러른
        V 들르 아/어/ㅏ/ㅓ 들러
        A 푸르 아/어/ㅏ/ㅓ 푸르러 은 푸른
        V 이르 아/어/ㅏ/ㅓ 이르러 은 이른
        A 노르 아/어/ㅏ/ㅓ 노르러 은 노른
        V 푸 아/어/ㅏ/ㅓ 퍼 ㄴ 푼
        V 끄 아/어/ㅏ/ㅓ 꺼 ㄴ 끈
        V 부수 아/어/ㅏ/ㅓ 부숴
        V 주 아/어/ㅏ/ㅓ 줘
        V 누 아/어/ㅏ/ㅓ 눠
        V 주 어지다 주어지다
        V 붓 아/어/ㅏ/ㅓ 부어
        V 따르 아/어/ㅏ/ㅓ 따라
        V 모으 아/어/ㅏ/ㅓ 모아
        V 쓰 이다 쓰이다
        V 아니하 았다/었다 아니하였다
        V 영원하 아/어 영원하여 았다/었다 영원하였다 ㄴ 영원한 ㄹ 영원할
        V 달 아라/어라 다오 았네 달았네
        V 다 아 다오
        A 파랗 으면 파라면 은 파란 았/었 파랬 니 파랗니 네 파랗네 ㅂ니다 파랗습니다
        A 동그랗 으면 동그라면 은 동그란 았/었 동그랬 니 동그랗니 네 동그랗네 ㅂ니다 동그랗습니다
        A 그렇 으면 그러면 은 그런 았/었 그랬 아/어 그래 네 그렇네
        A 시퍼렇 으면 시퍼러면 은 시퍼런 아/어 시퍼레 네 시퍼렇네
        A 좋 으면 좋으면 아 좋아 네 좋네
        V 낳 으면 낳으면 아 낳아 네 낳네
        A 않 으면 않으면 아 않아 네 않네
        V 불 으면 불으면 아 불어 래 불래
        V 주장하 면 주장하면 었다/았다 주장하였다
        V 연결지 었 연결졌
        V 갚 - 갚- 다 갚다 은/ㄴ 갚은
        V 쌓 으면 쌓으면 자고 쌓자고 오 쌓으오 시 쌓으시 며 쌓으며
        V 좇 으니 좇으니 ㄴ 좇은 오 좇으오 시 좇으시 며 좇으며
        V 갖 ㄴ 갖은 ㄹ 갖을 오 갖으오 시 갖으시 며 갖으며
        V 불 니 부니 오 부오 시 부시
        V 끌 오 끄오 니 끄니 ㅂ니다 끕니다 시 끄시 네 끄네
        V 알 오 아오 니 아니 네 아네 ㅂ니다 압니다 시 아시
        V 사 ㄴ 산
        V 기 다 기다 어 겨 기 기기
        V google ㅂ니다 google습니다 ㄹ google을 하 google하
        V 하 ㅂ니다 합니다 다 하다 시 하시
        V 박 았다 박았다
        V 사 았다/었다 샀다 ㄴ 산 ㄹ 살
        V 서 았다/었다 섰다 ㄴ 선 ㄹ 설
        V 갚 ㄹ 갚을 았다 갚았다
        V 울 ㅁ 울음
        `.trim().split("\n").map((line) => line.trim().split(" "));

            it('corrects surface form', () => {
                for (const splits of map) {
                    let isVerb = splits[0] === 'V';
                    let root = splits[1];
                    let testcases = [];

                    _.range(2, splits.length, 2).forEach((i) => {
                        let eomi = splits[i];
                        let result = splits[i + 1];

                        for (const str of eomi.split('/')) {
                            if ("ㄴㅂㄹㅁ".includes(str[0])) {
                                testcases.push([root, isVerb, str, result]);
                                testcases.push([root, isVerb, ExtUtil.ChoToJong.get(str[0]) + str.substr(1), result]);
                            } else if (str[0] === 'ㅏ') {
                                testcases.push([root, isVerb, '아' + str.substr(1), result])
                            } else if (str[0] === 'ㅓ') {
                                testcases.push([root, isVerb, '어' + str.substr(1), result]);
                            } else {
                                testcases.push([root, isVerb, str, result]);
                            }
                        }
                    });

                    for (const [verb, isVerb, rest, result] of testcases) {
                        expect(ExtUtil.correctVerbApply(verb, isVerb, rest)).toBe(result);
                    }
                }
            })
        })
    });
}