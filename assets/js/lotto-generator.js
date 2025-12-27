/**
 * 로또 번호 생성기
 */

class LottoGenerator {
    constructor() {
        // DOM 요소
        this.numberGrid = document.getElementById('numberGrid');
        this.includeNumbers = document.getElementById('includeNumbers');
        this.excludeNumbers = document.getElementById('excludeNumbers');
        this.gameCount = document.getElementById('gameCount');
        this.gameCountValue = document.getElementById('gameCountValue');
        this.generateBtn = document.getElementById('generateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.lottoResults = document.getElementById('lottoResults');
        this.resultSection = document.getElementById('resultSection');
        this.numberStats = document.getElementById('numberStats');
        this.copyResultBtn = document.getElementById('copyResultBtn');
        
        // 데이터
        this.selectedMode = 'include'; // include or exclude
        this.includedNumbers = new Set();
        this.excludedNumbers = new Set();
        this.generatedGames = [];
        
        this.init();
    }

    init() {
        this.createNumberBoard();
        this.attachEventListeners();
    }

    /**
     * 번호판 생성 (1~45)
     */
    createNumberBoard() {
        for (let i = 1; i <= 45; i++) {
            const button = document.createElement('button');
            button.className = 'number-ball';
            button.textContent = i;
            button.dataset.number = i;
            
            button.addEventListener('click', () => this.toggleNumber(i, button));
            
            this.numberGrid.appendChild(button);
        }
    }

    /**
     * 이벤트 리스너 등록
     */
    attachEventListeners() {
        // 선택 모드 변경
        document.querySelectorAll('input[name="selectMode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.selectedMode = e.target.value;
            });
        });

        // 게임 수 슬라이더
        this.gameCount.addEventListener('input', (e) => {
            this.gameCountValue.textContent = e.target.value;
        });

        // 번호 생성 버튼
        this.generateBtn.addEventListener('click', () => this.generateNumbers());

        // 초기화 버튼
        this.clearBtn.addEventListener('click', () => this.clearAll());

        // 결과 복사 버튼
        this.copyResultBtn.addEventListener('click', () => this.copyResults());
    }

    /**
     * 번호 선택/해제 토글
     */
    toggleNumber(number, button) {
        if (this.selectedMode === 'include') {
            if (this.includedNumbers.has(number)) {
                this.includedNumbers.delete(number);
                button.classList.remove('selected-include');
            } else {
                // 제외 목록에서 제거
                if (this.excludedNumbers.has(number)) {
                    this.excludedNumbers.delete(number);
                    button.classList.remove('selected-exclude');
                }
                this.includedNumbers.add(number);
                button.classList.add('selected-include');
            }
        } else {
            if (this.excludedNumbers.has(number)) {
                this.excludedNumbers.delete(number);
                button.classList.remove('selected-exclude');
            } else {
                // 포함 목록에서 제거
                if (this.includedNumbers.has(number)) {
                    this.includedNumbers.delete(number);
                    button.classList.remove('selected-include');
                }
                this.excludedNumbers.add(number);
                button.classList.add('selected-exclude');
            }
        }
        
        this.updateSelectedDisplay();
    }

    /**
     * 선택된 번호 표시 업데이트
     */
    updateSelectedDisplay() {
        // 포함 번호 표시
        if (this.includedNumbers.size === 0) {
            this.includeNumbers.innerHTML = '<span class="empty-tag">선택된 번호 없음</span>';
        } else {
            const numbers = Array.from(this.includedNumbers).sort((a, b) => a - b);
            this.includeNumbers.innerHTML = numbers.map(num => 
                `<span class="number-tag include">${num}</span>`
            ).join('');
        }

        // 제외 번호 표시
        if (this.excludedNumbers.size === 0) {
            this.excludeNumbers.innerHTML = '<span class="empty-tag">선택된 번호 없음</span>';
        } else {
            const numbers = Array.from(this.excludedNumbers).sort((a, b) => a - b);
            this.excludeNumbers.innerHTML = numbers.map(num => 
                `<span class="number-tag exclude">${num}</span>`
            ).join('');
        }
    }

    /**
     * 로또 번호 생성
     */
    generateNumbers() {
        const count = parseInt(this.gameCount.value);
        
        // 유효성 검사
        if (this.includedNumbers.size > 6) {
            alert('포함 번호는 최대 6개까지 선택할 수 있습니다.');
            return;
        }

        if (this.excludedNumbers.size >= 40) {
            alert('제외 번호가 너무 많습니다. 번호 생성이 불가능합니다.');
            return;
        }

        // 사용 가능한 번호 풀 생성
        const availableNumbers = [];
        for (let i = 1; i <= 45; i++) {
            if (!this.excludedNumbers.has(i)) {
                availableNumbers.push(i);
            }
        }

        if (availableNumbers.length < 6) {
            alert('생성 가능한 번호가 부족합니다.');
            return;
        }

        // 게임 생성
        this.generatedGames = [];
        for (let i = 0; i < count; i++) {
            const game = this.generateSingleGame(availableNumbers);
            this.generatedGames.push(game);
        }

        this.displayResults();
    }

    /**
     * 단일 게임 번호 생성
     */
    generateSingleGame(availableNumbers) {
        const numbers = new Set();
        
        // 포함 번호 먼저 추가
        this.includedNumbers.forEach(num => numbers.add(num));
        
        // 나머지 번호 랜덤 선택
        const remainingPool = availableNumbers.filter(num => !numbers.has(num));
        
        while (numbers.size < 6) {
            const randomIndex = Math.floor(Math.random() * remainingPool.length);
            numbers.add(remainingPool[randomIndex]);
        }
        
        return Array.from(numbers).sort((a, b) => a - b);
    }

    /**
     * 결과 표시
     */
    displayResults() {
        this.resultSection.style.display = 'block';
        
        // 게임 결과 표시
        this.lottoResults.innerHTML = this.generatedGames.map((game, index) => {
            return `
                <div class="lotto-game">
                    <div class="game-label">${String.fromCharCode(65 + index)}게임</div>
                    <div class="lotto-balls">
                        ${game.map(num => `
                            <span class="lotto-ball ${this.getBallColor(num)}">
                                ${num}
                            </span>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        // 통계 표시
        this.displayStats();

        // 결과로 스크롤
        this.resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * 번호 색상 클래스 반환
     */
    getBallColor(number) {
        if (number <= 10) return 'yellow';
        if (number <= 20) return 'blue';
        if (number <= 30) return 'red';
        if (number <= 40) return 'gray';
        return 'green';
    }

    /**
     * 번호 통계 표시
     */
    displayStats() {
        const allNumbers = this.generatedGames.flat();
        const frequency = {};
        
        allNumbers.forEach(num => {
            frequency[num] = (frequency[num] || 0) + 1;
        });

        const sortedFrequency = Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        this.numberStats.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <strong>총 게임 수</strong>
                    <span>${this.generatedGames.length}게임</span>
                </div>
                <div class="stat-item">
                    <strong>사용된 번호</strong>
                    <span>${Object.keys(frequency).length}개</span>
                </div>
            </div>
            <div class="frequency-list">
                <h4>많이 나온 번호 (Top 10)</h4>
                <div class="frequency-items">
                    ${sortedFrequency.map(([num, count]) => `
                        <div class="frequency-item">
                            <span class="lotto-ball ${this.getBallColor(parseInt(num))}">${num}</span>
                            <span class="frequency-count">${count}회</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * 결과 복사
     */
    copyResults() {
        const text = this.generatedGames.map((game, index) => {
            const label = String.fromCharCode(65 + index);
            return `${label}게임: ${game.join(', ')}`;
        }).join('\n');

        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('결과가 복사되었습니다!');
        }).catch(() => {
            alert('복사에 실패했습니다.');
        });
    }

    /**
     * 전체 초기화
     */
    clearAll() {
        if (!confirm('모든 선택을 초기화하시겠습니까?')) {
            return;
        }

        this.includedNumbers.clear();
        this.excludedNumbers.clear();
        
        // 번호판 초기화
        document.querySelectorAll('.number-ball').forEach(button => {
            button.classList.remove('selected-include', 'selected-exclude');
        });

        this.updateSelectedDisplay();
        this.showNotification('초기화되었습니다.');
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
    new LottoGenerator();
});
