/**
 * MBTI 성격 유형 테스트
 */

class MBTITest {
    constructor() {
        // 화면 요소
        this.startScreen = document.getElementById('startScreen');
        this.testScreen = document.getElementById('testScreen');
        this.resultScreen = document.getElementById('resultScreen');
        
        // 버튼
        this.startTestBtn = document.getElementById('startTestBtn');
        this.retestBtn = document.getElementById('retestBtn');
        this.shareBtn = document.getElementById('shareBtn');
        
        // 테스트 요소
        this.progressFill = document.getElementById('progressFill');
        this.currentQuestion = document.getElementById('currentQuestion');
        this.totalQuestions = document.getElementById('totalQuestions');
        this.questionText = document.getElementById('questionText');
        this.answerA = document.getElementById('answerA');
        this.answerB = document.getElementById('answerB');
        this.answerTextA = document.getElementById('answerTextA');
        this.answerTextB = document.getElementById('answerTextB');
        
        // 결과 요소
        this.mbtiResult = document.getElementById('mbtiResult');
        this.mbtiTitle = document.getElementById('mbtiTitle');
        this.resultDescription = document.getElementById('resultDescription');
        this.traitsList = document.getElementById('traitsList');
        this.jobsList = document.getElementById('jobsList');
        this.compatibilityList = document.getElementById('compatibilityList');
        
        // 테스트 데이터
        this.currentQuestionIndex = 0;
        this.answers = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
        
        this.questions = [
            // E vs I (외향형 vs 내향형)
            {
                question: "주말에 에너지를 충전하는 방법은?",
                answerA: { text: "친구들과 만나서 함께 시간을 보낸다", type: "E" },
                answerB: { text: "집에서 혼자 조용히 시간을 보낸다", type: "I" }
            },
            {
                question: "새로운 사람들을 만날 때 나는?",
                answerA: { text: "먼저 다가가서 말을 건다", type: "E" },
                answerB: { text: "상대방이 먼저 말을 걸기를 기다린다", type: "I" }
            },
            {
                question: "팀 프로젝트를 할 때 나는?",
                answerA: { text: "여러 사람과 의견을 나누며 진행한다", type: "E" },
                answerB: { text: "혼자 생각을 정리한 후 공유한다", type: "I" }
            },
            
            // S vs N (감각형 vs 직관형)
            {
                question: "문제를 해결할 때 나는?",
                answerA: { text: "현재 상황과 실제 데이터에 집중한다", type: "S" },
                answerB: { text: "미래 가능성과 패턴을 찾는다", type: "N" }
            },
            {
                question: "새로운 것을 배울 때 선호하는 방법은?",
                answerA: { text: "구체적인 예시와 실습을 통해 배운다", type: "S" },
                answerB: { text: "전체적인 개념과 이론을 먼저 이해한다", type: "N" }
            },
            {
                question: "대화를 할 때 나는?",
                answerA: { text: "구체적이고 상세한 내용을 말한다", type: "S" },
                answerB: { text: "큰 그림과 아이디어 위주로 말한다", type: "N" }
            },
            
            // T vs F (사고형 vs 감정형)
            {
                question: "친구가 고민을 털어놓을 때 나는?",
                answerA: { text: "논리적인 해결책을 제시한다", type: "T" },
                answerB: { text: "공감하며 위로를 먼저 한다", type: "F" }
            },
            {
                question: "의사 결정을 할 때 중요한 것은?",
                answerA: { text: "객관적인 사실과 효율성", type: "T" },
                answerB: { text: "사람들의 감정과 가치", type: "F" }
            },
            {
                question: "피드백을 줄 때 나는?",
                answerA: { text: "직접적이고 솔직하게 말한다", type: "T" },
                answerB: { text: "상대방 기분을 배려하며 말한다", type: "F" }
            },
            
            // J vs P (판단형 vs 인식형)
            {
                question: "여행을 계획할 때 나는?",
                answerA: { text: "상세한 일정표를 미리 만든다", type: "J" },
                answerB: { text: "즉흥적으로 그때그때 정한다", type: "P" }
            },
            {
                question: "업무를 처리하는 방식은?",
                answerA: { text: "마감일보다 미리 끝낸다", type: "J" },
                answerB: { text: "마감일에 맞춰서 한다", type: "P" }
            },
            {
                question: "일상생활에서 나는?",
                answerA: { text: "계획적이고 규칙적이다", type: "J" },
                answerB: { text: "유연하고 자유롭다", type: "P" }
            }
        ];
        
        this.init();
    }

    init() {
        this.totalQuestions.textContent = this.questions.length;
        
        // 이벤트 리스너
        this.startTestBtn.addEventListener('click', () => this.startTest());
        this.answerA.addEventListener('click', () => this.selectAnswer('A'));
        this.answerB.addEventListener('click', () => this.selectAnswer('B'));
        this.retestBtn.addEventListener('click', () => this.resetTest());
        this.shareBtn.addEventListener('click', () => this.shareResult());
    }

    /**
     * 테스트 시작
     */
    startTest() {
        this.startScreen.style.display = 'none';
        this.testScreen.style.display = 'block';
        this.currentQuestionIndex = 0;
        this.answers = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
        this.showQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * 질문 표시
     */
    showQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        
        this.currentQuestion.textContent = this.currentQuestionIndex + 1;
        this.questionText.textContent = question.question;
        this.answerTextA.textContent = question.answerA.text;
        this.answerTextB.textContent = question.answerB.text;
        
        // 진행률 업데이트
        const progress = ((this.currentQuestionIndex) / this.questions.length) * 100;
        this.progressFill.style.width = progress + '%';
    }

    /**
     * 답변 선택
     */
    selectAnswer(choice) {
        const question = this.questions[this.currentQuestionIndex];
        const selectedAnswer = choice === 'A' ? question.answerA : question.answerB;
        
        // 답변 저장
        this.answers[selectedAnswer.type]++;
        
        // 다음 질문 또는 결과 표시
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.questions.length) {
            this.showQuestion();
        } else {
            this.showResult();
        }
    }

    /**
     * 결과 계산 및 표시
     */
    showResult() {
        // MBTI 유형 계산
        const mbtiType = 
            (this.answers.E >= this.answers.I ? 'E' : 'I') +
            (this.answers.S >= this.answers.N ? 'S' : 'N') +
            (this.answers.T >= this.answers.F ? 'T' : 'F') +
            (this.answers.J >= this.answers.P ? 'J' : 'P');
        
        // 결과 데이터 가져오기
        const result = this.getResultData(mbtiType);
        
        // 화면 전환
        this.testScreen.style.display = 'none';
        this.resultScreen.style.display = 'block';
        
        // 결과 표시
        this.mbtiResult.textContent = mbtiType;
        this.mbtiTitle.textContent = result.title;
        this.resultDescription.textContent = result.description;
        
        // 특징 표시
        this.traitsList.innerHTML = result.traits.map(trait => 
            `<li>${trait}</li>`
        ).join('');
        
        // 추천 직업 표시
        this.jobsList.innerHTML = result.jobs.map(job => 
            `<span class="job-tag">${job}</span>`
        ).join('');
        
        // 궁합 표시
        this.compatibilityList.innerHTML = result.compatibility.map(type => 
            `<span class="compatibility-tag">${type}</span>`
        ).join('');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * MBTI 유형별 결과 데이터
     */
    getResultData(type) {
        const results = {
            'INTJ': {
                title: '전략가',
                description: '상상력이 풍부하고 전략적인 사고를 하는 사람입니다. 모든 일에 계획을 세우는 것을 좋아합니다.',
                traits: ['독립적', '분석적', '혁신적', '목표지향적'],
                jobs: ['과학자', '엔지니어', '프로그래머', '전략 컨설턴트', '건축가'],
                compatibility: ['ENFP', 'ENTP', 'INFJ']
            },
            'INTP': {
                title: '논리술사',
                description: '혁신적인 발명가로, 지식에 대한 끊임없는 갈증을 가지고 있습니다.',
                traits: ['논리적', '분석적', '객관적', '창의적'],
                jobs: ['연구원', '프로그래머', '수학자', '철학자', 'IT 전문가'],
                compatibility: ['ENTJ', 'ENFJ', 'INFJ']
            },
            'ENTJ': {
                title: '통솔자',
                description: '대담하고 상상력이 풍부하며 강한 의지를 가진 지도자입니다.',
                traits: ['리더십', '결단력', '효율성', '전략적'],
                jobs: ['CEO', '변호사', '경영 컨설턴트', '정치인', '군인'],
                compatibility: ['INTP', 'INFP', 'INTJ']
            },
            'ENTP': {
                title: '변론가',
                description: '똑똑하고 호기심 많은 사색가로, 지적 도전을 즐깁니다.',
                traits: ['혁신적', '카리스마', '다재다능', '논쟁 좋아함'],
                jobs: ['기업가', '변호사', '마케터', '발명가', '컨설턴트'],
                compatibility: ['INFJ', 'INTJ', 'ENFJ']
            },
            'INFJ': {
                title: '옹호자',
                description: '선의의 지지자이며, 조용하지만 영감을 주는 이상주의자입니다.',
                traits: ['이상주의적', '통찰력', '공감능력', '헌신적'],
                jobs: ['상담사', '작가', '교사', 'HR 전문가', '심리학자'],
                compatibility: ['ENFP', 'ENTP', 'INTJ']
            },
            'INFP': {
                title: '중재자',
                description: '항상 선을 행할 준비가 되어 있는 이타적이고 부드러운 사람입니다.',
                traits: ['이상주의적', '창의적', '공감적', '열정적'],
                jobs: ['작가', '예술가', '상담사', '사회복지사', '디자이너'],
                compatibility: ['ENFJ', 'ENTJ', 'INFJ']
            },
            'ENFJ': {
                title: '선도자',
                description: '카리스마 있고 영감을 주는 지도자로, 듣는 이들을 사로잡습니다.',
                traits: ['카리스마', '이타적', '설득력', '공감능력'],
                jobs: ['교사', 'HR 관리자', '정치인', '코치', '상담사'],
                compatibility: ['INFP', 'ISFP', 'INTP']
            },
            'ENFP': {
                title: '활동가',
                description: '열정적이고 창의적인 사교적 자유로운 영혼입니다.',
                traits: ['열정적', '창의적', '사교적', '긍정적'],
                jobs: ['배우', '마케터', '기자', '상담사', '이벤트 플래너'],
                compatibility: ['INTJ', 'INFJ', 'ENTJ']
            },
            'ISTJ': {
                title: '현실주의자',
                description: '사실을 중시하는 신뢰할 수 있고 실용적인 사람입니다.',
                traits: ['책임감', '조직적', '신뢰성', '실용적'],
                jobs: ['회계사', '공무원', '은행원', '관리자', '경찰'],
                compatibility: ['ESFP', 'ESTP', 'ISFJ']
            },
            'ISFJ': {
                title: '수호자',
                description: '헌신적이고 따뜻한 수호자로, 언제나 사랑하는 사람을 지킬 준비가 되어 있습니다.',
                traits: ['헌신적', '세심함', '배려심', '책임감'],
                jobs: ['간호사', '교사', '사서', '행정직', '사회복지사'],
                compatibility: ['ESFP', 'ESTP', 'ISTJ']
            },
            'ESTJ': {
                title: '경영자',
                description: '뛰어난 관리자로, 사물이나 사람을 관리하는 데 탁월합니다.',
                traits: ['조직력', '책임감', '현실적', '결단력'],
                jobs: ['경영자', '판사', '군인', '경찰관', '은행 관리자'],
                compatibility: ['ISFP', 'ISTP', 'ISTJ']
            },
            'ESFJ': {
                title: '집정관',
                description: '배려심 깊고 사교적이며 인기가 많은 사람입니다.',
                traits: ['사교적', '배려심', '협조적', '책임감'],
                jobs: ['간호사', '교사', '영업사원', 'HR 담당자', '이벤트 기획자'],
                compatibility: ['ISFP', 'ISTP', 'ISFJ']
            },
            'ISTP': {
                title: '장인',
                description: '대담하고 실용적인 사고를 하는 장인입니다.',
                traits: ['독립적', '실용적', '논리적', '유연함'],
                jobs: ['엔지니어', '정비사', '운동선수', '소방관', '파일럿'],
                compatibility: ['ESFJ', 'ESTJ', 'ISFP']
            },
            'ISFP': {
                title: '모험가',
                description: '유연하고 매력적인 예술가로, 항상 새로운 것을 탐구할 준비가 되어 있습니다.',
                traits: ['예술적', '유연함', '친절함', '낙천적'],
                jobs: ['예술가', '디자이너', '음악가', '사진작가', '요리사'],
                compatibility: ['ENFJ', 'ESFJ', 'ESTJ']
            },
            'ESTP': {
                title: '사업가',
                description: '영리하고 에너지 넘치며 매우 민첩한 사람입니다.',
                traits: ['활동적', '현실적', '대담함', '사교적'],
                jobs: ['영업사원', '기업가', '운동선수', '소방관', '경찰'],
                compatibility: ['ISFJ', 'ISTJ', 'ESFP']
            },
            'ESFP': {
                title: '연예인',
                description: '자발적이고 열정적이며 사교적인 사람입니다.',
                traits: ['사교적', '활발함', '즐거움', '친화력'],
                jobs: ['배우', '이벤트 기획자', '가이드', '영업사원', '코디네이터'],
                compatibility: ['ISTJ', 'ISFJ', 'ESTP']
            }
        };
        
        return results[type] || results['INFP'];
    }

    /**
     * 테스트 재시작
     */
    resetTest() {
        this.resultScreen.style.display = 'none';
        this.startScreen.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * 결과 공유
     */
    shareResult() {
        const mbtiType = this.mbtiResult.textContent;
        const title = this.mbtiTitle.textContent;
        
        if (navigator.share) {
            navigator.share({
                title: `나의 MBTI는 ${mbtiType}`,
                text: `나는 ${mbtiType} - ${title} 유형입니다!`,
                url: window.location.href
            }).catch(err => console.log('공유 실패:', err));
        } else {
            // 폴백: 클립보드에 복사
            const text = `나의 MBTI는 ${mbtiType} - ${title}입니다!`;
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('결과가 복사되었습니다!');
            });
        }
    }

    /**
     * 알림 표시
     */
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new MBTITest();
});
