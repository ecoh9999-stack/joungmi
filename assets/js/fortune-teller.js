/**
 * 오늘의 운세 생성기
 */

class FortuneTeller {
    constructor() {
        this.form = document.getElementById('fortuneForm');
        this.result = document.getElementById('fortuneResult');
        this.resetBtn = document.getElementById('resetBtn');
        this.shareBtn = document.getElementById('shareBtn');
        this.monthSelect = document.getElementById('birthMonth');
        this.daySelect = document.getElementById('birthDay');
        
        this.fortuneData = null;
        
        this.init();
    }

    init() {
        // 일자 선택 초기화
        this.updateDayOptions();
        
        // 월 변경시 일자 업데이트
        this.monthSelect.addEventListener('change', () => this.updateDayOptions());
        
        // 폼 제출
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateFortune();
        });

        // 초기화
        this.resetBtn.addEventListener('click', () => this.reset());

        // 공유
        this.shareBtn.addEventListener('click', () => this.shareFortune());
    }

    /**
     * 일자 옵션 업데이트
     */
    updateDayOptions() {
        const month = parseInt(this.monthSelect.value);
        const year = parseInt(document.getElementById('birthYear').value) || 2000;
        
        this.daySelect.innerHTML = '<option value="">선택</option>';
        
        if (!month) return;
        
        const daysInMonth = new Date(year, month, 0).getDate();
        
        for (let i = 1; i <= daysInMonth; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i}일`;
            this.daySelect.appendChild(option);
        }
    }

    /**
     * 운세 생성
     */
    generateFortune() {
        const year = parseInt(document.getElementById('birthYear').value);
        const month = parseInt(this.monthSelect.value);
        const day = parseInt(this.daySelect.value);
        const gender = document.querySelector('input[name="gender"]:checked').value;

        if (!year || !month || !day) {
            alert('생년월일을 모두 입력해주세요.');
            return;
        }

        // 운세 데이터 생성
        this.fortuneData = this.calculateFortune(year, month, day, gender);
        
        // 결과 표시
        this.displayFortune();
        
        // 결과 섹션으로 스크롤
        this.result.style.display = 'block';
        setTimeout(() => {
            this.result.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    /**
     * 운세 계산 (생년월일 + 오늘 날짜 기반 시드)
     */
    calculateFortune(year, month, day, gender) {
        const today = new Date();
        const birthDate = new Date(year, month - 1, day);
        
        // 시드값 생성 (생년월일 + 오늘 날짜)
        const seed = year + month * 100 + day * 10000 + 
                     today.getFullYear() + today.getMonth() * 100 + today.getDate() * 10000 +
                     (gender === 'male' ? 1 : 2);
        
        // 점수 생성 (50-100)
        const score = 50 + (this.seededRandom(seed) * 50);
        
        return {
            date: today,
            birthDate: birthDate,
            gender: gender,
            score: Math.round(score),
            overall: this.generateOverallFortune(seed, score),
            love: this.generateLoveFortune(seed + 1, score, gender),
            money: this.generateMoneyFortune(seed + 2, score),
            health: this.generateHealthFortune(seed + 3, score),
            career: this.generateCareerFortune(seed + 4, score),
            lucky: this.generateLuckyItems(seed + 5)
        };
    }

    /**
     * 시드 기반 랜덤 생성기
     */
    seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    /**
     * 배열에서 시드 기반 선택
     */
    seededChoice(array, seed) {
        const index = Math.floor(this.seededRandom(seed) * array.length);
        return array[index];
    }

    /**
     * 종합운 생성
     */
    generateOverallFortune(seed, score) {
        const fortunes = [
            {
                min: 90,
                text: '오늘은 매우 좋은 하루가 될 것입니다. 모든 일이 순조롭게 풀리고, 예상치 못한 행운이 찾아올 수 있습니다. 긍정적인 마음가짐으로 하루를 시작하세요.',
                keywords: ['행운', '성공', '기쁨', '만남']
            },
            {
                min: 75,
                text: '전반적으로 좋은 운세입니다. 주변 사람들과의 관계가 원만하고, 하던 일이 잘 풀릴 것입니다. 새로운 시도를 해보기에도 좋은 날입니다.',
                keywords: ['안정', '화합', '발전', '소통']
            },
            {
                min: 60,
                text: '평범하지만 안정적인 하루가 예상됩니다. 무리하지 않고 차분하게 하루를 보내는 것이 좋겠습니다. 작은 행복을 찾아보세요.',
                keywords: ['평온', '휴식', '성찰', '균형']
            },
            {
                min: 0,
                text: '조금은 주의가 필요한 날입니다. 서두르거나 무리하지 말고, 신중하게 행동하세요. 어려움이 있더라도 긍정적으로 극복할 수 있습니다.',
                keywords: ['인내', '신중', '극복', '성장']
            }
        ];

        const fortune = fortunes.find(f => score >= f.min);
        return {
            text: fortune.text,
            keywords: fortune.keywords,
            rating: this.getStarRating(score)
        };
    }

    /**
     * 애정운 생성
     */
    generateLoveFortune(seed, score, gender) {
        const fortunes = [
            {
                min: 85,
                text: gender === 'male' 
                    ? '이성에게 호감을 살 수 있는 날입니다. 용기를 내어 마음을 표현해보세요. 솔로라면 새로운 만남의 기회가 있을 수 있습니다.'
                    : '매력이 빛나는 날입니다. 주변 사람들에게 좋은 인상을 남길 수 있습니다. 커플이라면 더욱 깊은 유대감을 느낄 수 있습니다.',
                tip: '진심을 담은 대화를 나눠보세요'
            },
            {
                min: 70,
                text: '연인과의 관계가 안정적입니다. 작은 선물이나 따뜻한 말 한마디가 관계를 더욱 돈독하게 만들어줄 것입니다.',
                tip: '함께하는 시간을 소중히 여기세요'
            },
            {
                min: 55,
                text: '감정의 기복이 있을 수 있습니다. 서로를 이해하려는 노력이 필요한 시기입니다. 인내심을 가지고 대화하세요.',
                tip: '상대방의 입장에서 생각해보세요'
            },
            {
                min: 0,
                text: '오해가 생길 수 있으니 신중한 언행이 필요합니다. 감정적으로 대응하기보다는 이성적으로 접근하세요.',
                tip: '차분하게 마음을 가라앉히고 대화하세요'
            }
        ];

        const fortune = fortunes.find(f => score >= f.min);
        return {
            text: fortune.text,
            tip: fortune.tip,
            rating: this.getStarRating(score + this.seededRandom(seed) * 10)
        };
    }

    /**
     * 금전운 생성
     */
    generateMoneyFortune(seed, score) {
        const fortunes = [
            {
                min: 85,
                text: '금전적으로 좋은 소식이 있을 수 있습니다. 투자나 재테크에 관심을 가져보세요. 다만 신중한 판단은 필수입니다.',
                tip: '여유 자금으로 장기적인 투자를 고려해보세요'
            },
            {
                min: 70,
                text: '수입과 지출의 균형이 잘 맞는 시기입니다. 계획적인 소비가 미래의 재정 안정을 가져다줄 것입니다.',
                tip: '가계부를 작성하며 지출을 체크해보세요'
            },
            {
                min: 55,
                text: '예상치 못한 지출이 있을 수 있습니다. 충동구매를 자제하고 필요한 것만 구입하세요.',
                tip: '불필요한 구독 서비스를 정리해보세요'
            },
            {
                min: 0,
                text: '금전 관리에 각별히 신경 써야 하는 시기입니다. 큰 지출은 미루고, 저축을 우선시하세요.',
                tip: '현금 사용을 늘려 지출을 줄여보세요'
            }
        ];

        const fortune = fortunes.find(f => score >= f.min);
        return {
            text: fortune.text,
            tip: fortune.tip,
            rating: this.getStarRating(score + this.seededRandom(seed) * 10)
        };
    }

    /**
     * 건강운 생성
     */
    generateHealthFortune(seed, score) {
        const fortunes = [
            {
                min: 85,
                text: '컨디션이 최상입니다. 활력이 넘치는 하루가 될 것입니다. 운동이나 야외 활동을 즐기기에 좋은 날입니다.',
                tip: '새로운 운동을 시작해보세요'
            },
            {
                min: 70,
                text: '전반적으로 건강 상태가 양호합니다. 규칙적인 생활 습관을 유지하면 더욱 좋은 컨디션을 유지할 수 있습니다.',
                tip: '충분한 수분 섭취를 하세요'
            },
            {
                min: 55,
                text: '피로가 쌓일 수 있습니다. 충분한 휴식과 수면이 필요한 시기입니다. 무리하지 마세요.',
                tip: '스트레칭으로 몸을 풀어주세요'
            },
            {
                min: 0,
                text: '건강 관리에 신경 써야 합니다. 작은 증상도 방치하지 말고 적절히 대처하세요. 충분한 휴식이 필요합니다.',
                tip: '불편한 증상이 있다면 병원을 방문하세요'
            }
        ];

        const fortune = fortunes.find(f => score >= f.min);
        return {
            text: fortune.text,
            tip: fortune.tip,
            rating: this.getStarRating(score + this.seededRandom(seed) * 10)
        };
    }

    /**
     * 직업운 생성
     */
    generateCareerFortune(seed, score) {
        const fortunes = [
            {
                min: 85,
                text: '업무에서 좋은 성과를 낼 수 있는 날입니다. 적극적으로 의견을 제시하고 새로운 프로젝트에 도전해보세요.',
                tip: '상사나 동료와 적극적으로 소통하세요'
            },
            {
                min: 70,
                text: '업무가 순조롭게 진행될 것입니다. 동료들과의 협업이 좋은 결과를 가져다줄 것입니다.',
                tip: '팀워크를 강화할 수 있는 시간을 가져보세요'
            },
            {
                min: 55,
                text: '일이 계획대로 풀리지 않을 수 있습니다. 인내심을 가지고 차근차근 해결해나가세요.',
                tip: '우선순위를 정하고 중요한 일부터 처리하세요'
            },
            {
                min: 0,
                text: '업무상 어려움이 있을 수 있습니다. 혼자 해결하려 하지 말고 동료나 상사에게 조언을 구하세요.',
                tip: '문제를 정확히 파악하고 도움을 요청하세요'
            }
        ];

        const fortune = fortunes.find(f => score >= f.min);
        return {
            text: fortune.text,
            tip: fortune.tip,
            rating: this.getStarRating(score + this.seededRandom(seed) * 10)
        };
    }

    /**
     * 행운 아이템 생성
     */
    generateLuckyItems(seed) {
        const colors = [
            { name: '빨강', hex: '#FF4858' },
            { name: '파랑', hex: '#4facfe' },
            { name: '노랑', hex: '#FFD700' },
            { name: '초록', hex: '#4CAF50' },
            { name: '보라', hex: '#9C27B0' },
            { name: '분홍', hex: '#E91E63' },
            { name: '주황', hex: '#FF9800' },
            { name: '하늘색', hex: '#72F2EB' }
        ];

        const directions = ['동쪽', '서쪽', '남쪽', '북쪽', '북동쪽', '남서쪽', '북서쪽', '남동쪽'];
        const times = ['오전 6-9시', '오전 9-12시', '오후 12-3시', '오후 3-6시', '오후 6-9시', '오후 9-12시'];

        return {
            color: this.seededChoice(colors, seed),
            number: Math.floor(this.seededRandom(seed + 1) * 100) + 1,
            direction: this.seededChoice(directions, seed + 2),
            time: this.seededChoice(times, seed + 3)
        };
    }

    /**
     * 별점 생성
     */
    getStarRating(score) {
        const stars = Math.round((score / 100) * 5);
        return '★'.repeat(stars) + '☆'.repeat(5 - stars);
    }

    /**
     * 운세 표시
     */
    displayFortune() {
        const data = this.fortuneData;
        
        // 날짜 및 사용자 정보
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        document.getElementById('todayDate').textContent = data.date.toLocaleDateString('ko-KR', dateOptions);
        
        const birthYear = data.birthDate.getFullYear();
        const birthMonth = data.birthDate.getMonth() + 1;
        const birthDay = data.birthDate.getDate();
        const age = data.date.getFullYear() - birthYear;
        const genderText = data.gender === 'male' ? '남성' : '여성';
        
        document.getElementById('userInfo').textContent = 
            `${birthYear}년 ${birthMonth}월 ${birthDay}일생 (만 ${age}세) · ${genderText}`;
        
        // 점수 및 바
        document.getElementById('fortuneScore').textContent = `${data.score}점`;
        const luckBar = document.getElementById('luckBar');
        luckBar.style.width = `${data.score}%`;
        luckBar.className = 'luck-fill ' + this.getScoreClass(data.score);
        
        // 종합운
        document.getElementById('overallRating').textContent = data.overall.rating;
        document.getElementById('overallFortune').textContent = data.overall.text;
        document.getElementById('overallKeywords').innerHTML = 
            data.overall.keywords.map(k => `<span class="keyword">${k}</span>`).join('');
        
        // 애정운
        document.getElementById('loveRating').textContent = data.love.rating;
        document.getElementById('loveFortune').textContent = data.love.text;
        document.getElementById('loveTip').textContent = data.love.tip;
        
        // 금전운
        document.getElementById('moneyRating').textContent = data.money.rating;
        document.getElementById('moneyFortune').textContent = data.money.text;
        document.getElementById('moneyTip').textContent = data.money.tip;
        
        // 건강운
        document.getElementById('healthRating').textContent = data.health.rating;
        document.getElementById('healthFortune').textContent = data.health.text;
        document.getElementById('healthTip').textContent = data.health.tip;
        
        // 직업운
        document.getElementById('careerRating').textContent = data.career.rating;
        document.getElementById('careerFortune').textContent = data.career.text;
        document.getElementById('careerTip').textContent = data.career.tip;
        
        // 행운 아이템
        document.getElementById('luckyColor').textContent = data.lucky.color.name;
        document.getElementById('colorPreview').style.backgroundColor = data.lucky.color.hex;
        document.getElementById('luckyNumber').textContent = data.lucky.number;
        document.getElementById('luckyDirection').textContent = data.lucky.direction;
        document.getElementById('luckyTime').textContent = data.lucky.time;
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
        this.form.reset();
        this.result.style.display = 'none';
        this.updateDayOptions();
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * 공유하기
     */
    shareFortune() {
        const score = this.fortuneData.score;
        const text = `오늘의 운세 점수: ${score}점\n\n${this.fortuneData.overall.text}`;
        
        if (navigator.share) {
            navigator.share({
                title: '오늘의 운세',
                text: text,
                url: window.location.href
            }).catch(err => console.log('공유 실패:', err));
        } else {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('운세가 클립보드에 복사되었습니다!');
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
    new FortuneTeller();
});
