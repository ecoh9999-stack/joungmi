/**
 * MBTI 궁합 테스트
 */

class MBTICompatibility {
    constructor() {
        this.myMbti = null;
        this.partnerMbti = null;
        
        this.myMbtiDisplay = document.getElementById('myMbti');
        this.partnerMbtiDisplay = document.getElementById('partnerMbti');
        this.checkBtn = document.getElementById('checkCompatibility');
        this.result = document.getElementById('compatibilityResult');
        this.resetBtn = document.getElementById('resetBtn');
        this.shareBtn = document.getElementById('shareBtn');
        
        this.compatibilityData = this.initCompatibilityData();
        
        this.init();
    }

    init() {
        // MBTI 버튼 클릭
        document.querySelectorAll('.mbti-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectMBTI(e));
        });

        // 궁합 확인
        this.checkBtn.addEventListener('click', () => this.checkCompatibility());

        // 재시작
        this.resetBtn.addEventListener('click', () => this.reset());

        // 공유
        this.shareBtn.addEventListener('click', () => this.share());
    }

    /**
     * MBTI 선택
     */
    selectMBTI(e) {
        const btn = e.target;
        const type = btn.dataset.type;
        const mbti = btn.dataset.mbti;

        // 같은 타입의 다른 버튼들 비활성화
        document.querySelectorAll(`.mbti-btn[data-type="${type}"]`).forEach(b => {
            b.classList.remove('active');
        });

        // 현재 버튼 활성화
        btn.classList.add('active');

        // 값 저장
        if (type === 'my') {
            this.myMbti = mbti;
            this.myMbtiDisplay.textContent = mbti;
        } else {
            this.partnerMbti = mbti;
            this.partnerMbtiDisplay.textContent = mbti;
        }
    }

    /**
     * 궁합 확인
     */
    checkCompatibility() {
        if (!this.myMbti || !this.partnerMbti) {
            alert('나의 MBTI와 상대방의 MBTI를 모두 선택해주세요.');
            return;
        }

        // 궁합 데이터 가져오기
        const compatibility = this.getCompatibility(this.myMbti, this.partnerMbti);

        // 결과 표시
        this.displayResult(compatibility);

        // 결과 섹션으로 스크롤
        this.result.style.display = 'block';
        setTimeout(() => {
            this.result.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    /**
     * 궁합 데이터 가져오기
     */
    getCompatibility(mbti1, mbti2) {
        const key = `${mbti1}-${mbti2}`;
        const reverseKey = `${mbti2}-${mbti1}`;

        // 직접 매칭
        if (this.compatibilityData[key]) {
            return this.compatibilityData[key];
        }

        // 역순 매칭
        if (this.compatibilityData[reverseKey]) {
            return this.compatibilityData[reverseKey];
        }

        // 기본 궁합 계산
        return this.calculateDefaultCompatibility(mbti1, mbti2);
    }

    /**
     * 기본 궁합 계산 (매칭 데이터가 없을 경우)
     */
    calculateDefaultCompatibility(mbti1, mbti2) {
        let score = 50; // 기본 점수
        
        // 같은 MBTI인 경우
        if (mbti1 === mbti2) {
            score = 85;
            return {
                score: score,
                rating: '매우 좋음',
                overall: '같은 성격 유형으로 서로를 잘 이해할 수 있습니다. 비슷한 가치관과 사고방식을 공유하여 편안한 관계를 유지할 수 있습니다.',
                strengths: [
                    '서로의 생각과 감정을 쉽게 이해할 수 있습니다',
                    '비슷한 관심사와 취미를 공유할 수 있습니다',
                    '의사소통이 원활하고 갈등이 적습니다'
                ],
                weaknesses: [
                    '같은 약점을 가지고 있어 서로 보완하기 어려울 수 있습니다',
                    '새로운 관점이나 다양성이 부족할 수 있습니다'
                ],
                advice: '서로의 유사성을 장점으로 활용하되, 각자의 개성과 성장을 존중해주세요. 때로는 다른 시각을 가진 사람들과의 교류도 도움이 됩니다.',
                communication: 90,
                emotion: 85,
                value: 90,
                cooperation: 80
            };
        }

        // E/I 호환성
        const ei1 = mbti1[0];
        const ei2 = mbti2[0];
        if (ei1 !== ei2) score += 10; // 외향/내향 보완
        
        // S/N 호환성
        const sn1 = mbti1[1];
        const sn2 = mbti2[1];
        if (sn1 === sn2) score += 15; // 같은 인식 기능
        
        // T/F 호환성
        const tf1 = mbti1[2];
        const tf2 = mbti2[2];
        if (tf1 !== tf2) score += 10; // 사고/감정 보완
        
        // J/P 호환성
        const jp1 = mbti1[3];
        const jp2 = mbti2[3];
        if (jp1 !== jp2) score += 10; // 계획/즉흥 보완

        // 점수에 따른 등급
        let rating = '보통';
        if (score >= 85) rating = '매우 좋음';
        else if (score >= 70) rating = '좋음';
        else if (score >= 55) rating = '보통';
        else rating = '노력 필요';

        return {
            score: Math.min(score, 100),
            rating: rating,
            overall: this.getDefaultOverall(mbti1, mbti2),
            strengths: this.getDefaultStrengths(mbti1, mbti2),
            weaknesses: this.getDefaultWeaknesses(mbti1, mbti2),
            advice: this.getDefaultAdvice(mbti1, mbti2),
            communication: Math.min(score + Math.random() * 10 - 5, 100),
            emotion: Math.min(score + Math.random() * 10 - 5, 100),
            value: Math.min(score + Math.random() * 10 - 5, 100),
            cooperation: Math.min(score + Math.random() * 10 - 5, 100)
        };
    }

    /**
     * 기본 전체 평가
     */
    getDefaultOverall(mbti1, mbti2) {
        return `${mbti1}과 ${mbti2}의 조합은 서로 다른 강점을 가지고 있어 보완적인 관계를 만들 수 있습니다. 서로의 차이를 이해하고 존중한다면 좋은 관계를 유지할 수 있습니다.`;
    }

    /**
     * 기본 장점
     */
    getDefaultStrengths(mbti1, mbti2) {
        return [
            '서로 다른 관점을 통해 새로운 것을 배울 수 있습니다',
            '각자의 강점으로 서로를 보완할 수 있습니다',
            '다양한 경험과 성장의 기회를 제공합니다'
        ];
    }

    /**
     * 기본 주의점
     */
    getDefaultWeaknesses(mbti1, mbti2) {
        return [
            '의사소통 방식의 차이로 오해가 생길 수 있습니다',
            '우선순위나 가치관의 차이를 조율해야 합니다',
            '서로의 성격 차이를 이해하는 노력이 필요합니다'
        ];
    }

    /**
     * 기본 조언
     */
    getDefaultAdvice(mbti1, mbti2) {
        return '서로의 차이를 단점이 아닌 다양성으로 받아들이세요. 열린 마음으로 대화하고, 상대방의 입장에서 생각해보는 노력이 관계를 더욱 돈독하게 만들 것입니다.';
    }

    /**
     * 결과 표시
     */
    displayResult(data) {
        // MBTI 표시
        document.getElementById('resultMyMbti').textContent = this.myMbti;
        document.getElementById('resultPartnerMbti').textContent = this.partnerMbti;

        // 점수
        document.getElementById('scoreValue').textContent = Math.round(data.score);
        document.getElementById('compatibilityRating').textContent = data.rating;

        // 점수 바
        const scoreFill = document.getElementById('scoreFill');
        scoreFill.style.width = `${data.score}%`;
        scoreFill.className = 'score-fill ' + this.getScoreClass(data.score);

        // 전체 평가
        document.getElementById('overallAnalysis').textContent = data.overall;

        // 장점
        const strengthsList = document.getElementById('strengthsList');
        strengthsList.innerHTML = data.strengths.map(s => `<li>${s}</li>`).join('');

        // 주의점
        const weaknessesList = document.getElementById('weaknessesList');
        weaknessesList.innerHTML = data.weaknesses.map(w => `<li>${w}</li>`).join('');

        // 조언
        document.getElementById('adviceText').textContent = data.advice;

        // 상세 궁합
        this.updateDetailBar('communicationBar', 'communicationScore', data.communication);
        this.updateDetailBar('emotionBar', 'emotionScore', data.emotion);
        this.updateDetailBar('valueBar', 'valueScore', data.value);
        this.updateDetailBar('cooperationBar', 'cooperationScore', data.cooperation);
    }

    /**
     * 상세 바 업데이트
     */
    updateDetailBar(barId, scoreId, value) {
        const bar = document.getElementById(barId);
        const score = document.getElementById(scoreId);
        
        const roundedValue = Math.round(value);
        bar.style.width = `${roundedValue}%`;
        bar.className = 'detail-fill ' + this.getScoreClass(roundedValue);
        score.textContent = `${roundedValue}점`;
    }

    /**
     * 점수별 클래스
     */
    getScoreClass(score) {
        if (score >= 85) return 'excellent';
        if (score >= 70) return 'good';
        if (score >= 55) return 'normal';
        return 'bad';
    }

    /**
     * 초기화
     */
    reset() {
        this.myMbti = null;
        this.partnerMbti = null;
        
        this.myMbtiDisplay.textContent = '-';
        this.partnerMbtiDisplay.textContent = '-';
        
        document.querySelectorAll('.mbti-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        this.result.style.display = 'none';
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * 공유하기
     */
    share() {
        const text = `${this.myMbti} ❤️ ${this.partnerMbti} 궁합 테스트 결과를 확인해보세요!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'MBTI 궁합 테스트',
                text: text,
                url: window.location.href
            }).catch(err => console.log('공유 실패:', err));
        } else {
            navigator.clipboard.writeText(text + '\n' + window.location.href).then(() => {
                this.showNotification('링크가 복사되었습니다!');
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

    /**
     * 궁합 데이터 초기화 (주요 조합만)
     */
    initCompatibilityData() {
        return {
            // 완벽한 궁합 (천생연분)
            'ENFP-INTJ': {
                score: 95,
                rating: '천생연분',
                overall: 'ENFP와 INTJ는 서로를 완벽하게 보완하는 이상적인 조합입니다. ENFP의 창의성과 열정이 INTJ의 전략적 사고와 만나 시너지를 발휘합니다.',
                strengths: [
                    'ENFP의 창의력과 INTJ의 논리력이 완벽한 조화를 이룹니다',
                    '서로의 약점을 보완하며 함께 성장할 수 있습니다',
                    'ENFP가 INTJ의 감성을, INTJ가 ENFP의 이성을 깨워줍니다'
                ],
                weaknesses: [
                    'ENFP의 즉흥성과 INTJ의 계획성이 충돌할 수 있습니다',
                    '감정 표현 방식의 차이로 오해가 생길 수 있습니다'
                ],
                advice: 'ENFP는 INTJ에게 더 많은 감정 표현을, INTJ는 ENFP에게 구체적인 계획을 제시해주세요. 서로의 차이를 매력으로 받아들이면 완벽한 파트너가 될 수 있습니다.',
                communication: 92,
                emotion: 88,
                value: 95,
                cooperation: 90
            },
            'INFP-ENFJ': {
                score: 93,
                rating: '천생연분',
                overall: 'INFP와 ENFJ는 깊은 감정적 교감과 이상주의를 공유하는 환상의 조합입니다. 서로를 깊이 이해하고 지지할 수 있습니다.',
                strengths: [
                    '깊은 감정적 유대감을 형성할 수 있습니다',
                    '이상과 가치관을 공유하며 함께 꿈을 이룰 수 있습니다',
                    'ENFJ의 리더십과 INFP의 창의력이 조화롭습니다'
                ],
                weaknesses: [
                    '둘 다 감정적이어서 객관성이 부족할 수 있습니다',
                    '현실적인 문제에서 어려움을 겪을 수 있습니다'
                ],
                advice: '감정을 공유하되 때로는 객관적인 시각도 필요합니다. 서로의 감성을 존중하며 현실적인 목표도 함께 세워보세요.',
                communication: 95,
                emotion: 98,
                value: 92,
                cooperation: 88
            },
            'ESTP-ISFJ': {
                score: 88,
                rating: '매우 좋음',
                overall: 'ESTP의 활동적인 에너지와 ISFJ의 안정적인 지원이 균형을 이루는 조합입니다.',
                strengths: [
                    'ESTP의 모험심과 ISFJ의 신중함이 균형을 이룹니다',
                    'ISFJ가 ESTP에게 안정감을, ESTP가 ISFJ에게 활력을 줍니다',
                    '서로 다른 강점으로 보완적인 관계를 만듭니다'
                ],
                weaknesses: [
                    '생활 방식과 우선순위가 다를 수 있습니다',
                    'ESTP의 즉흥성과 ISFJ의 계획성이 충돌할 수 있습니다'
                ],
                advice: 'ESTP는 ISFJ의 배려를 존중하고, ISFJ는 ESTP의 도전정신을 응원해주세요. 중간 지점을 찾는 노력이 필요합니다.',
                communication: 85,
                emotion: 82,
                value: 88,
                cooperation: 90
            }
        };
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new MBTICompatibility();
});
