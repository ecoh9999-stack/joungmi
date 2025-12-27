/**
 * 글자수세기 기능 구현
 * 실시간 글자수, 단어수, 줄수 계산 및 중복 단어 분석
 */

class CharacterCounter {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.includeSpaces = document.getElementById('includeSpaces');
        this.includeLineBreaks = document.getElementById('includeLineBreaks');
        this.clearBtn = document.getElementById('clearBtn');
        
        // 통계 요소
        this.totalChars = document.getElementById('totalChars');
        this.charsNoSpaces = document.getElementById('charsNoSpaces');
        this.wordCount = document.getElementById('wordCount');
        this.lineCount = document.getElementById('lineCount');
        this.duplicateWords = document.getElementById('duplicateWords');
        
        this.init();
    }

    init() {
        // 이벤트 리스너 등록
        this.textInput.addEventListener('input', () => this.updateStats());
        this.includeSpaces.addEventListener('change', () => this.updateStats());
        this.includeLineBreaks.addEventListener('change', () => this.updateStats());
        this.clearBtn.addEventListener('click', () => this.clearText());
        
        // 초기 통계 업데이트
        this.updateStats();
        
        // localStorage에서 마지막 텍스트 불러오기 (선택사항)
        this.loadSavedText();
    }

    /**
     * 모든 통계 업데이트
     */
    updateStats() {
        const text = this.textInput.value;
        
        // 각 통계 계산
        const stats = {
            totalChars: this.calculateTotalChars(text),
            charsNoSpaces: this.calculateCharsNoSpaces(text),
            wordCount: this.calculateWordCount(text),
            lineCount: this.calculateLineCount(text)
        };
        
        // UI 업데이트
        this.totalChars.textContent = stats.totalChars.toLocaleString();
        this.charsNoSpaces.textContent = stats.charsNoSpaces.toLocaleString();
        this.wordCount.textContent = stats.wordCount.toLocaleString();
        this.lineCount.textContent = stats.lineCount.toLocaleString();
        
        // 중복 단어 분석
        this.analyzeDuplicateWords(text);
        
        // 자동 저장 (선택사항)
        this.autoSave(text);
    }

    /**
     * 총 글자수 계산 (옵션에 따라)
     */
    calculateTotalChars(text) {
        let result = text.length;
        
        if (!this.includeSpaces.checked) {
            result = text.replace(/\s/g, '').length;
        }
        
        if (!this.includeLineBreaks.checked) {
            result = text.replace(/\n/g, '').length;
            if (!this.includeSpaces.checked) {
                result = text.replace(/[\s\n]/g, '').length;
            }
        }
        
        return result;
    }

    /**
     * 공백 제외 글자수 계산
     */
    calculateCharsNoSpaces(text) {
        return text.replace(/\s/g, '').length;
    }

    /**
     * 단어수 계산
     */
    calculateWordCount(text) {
        if (!text.trim()) return 0;
        
        // 공백으로 분리하여 단어 계산
        const words = text.trim().split(/\s+/);
        return words.filter(word => word.length > 0).length;
    }

    /**
     * 줄수 계산
     */
    calculateLineCount(text) {
        if (!text) return 0;
        
        // 줄바꿈으로 분리
        const lines = text.split('\n');
        return lines.length;
    }

    /**
     * 중복 단어 분석
     */
    analyzeDuplicateWords(text) {
        if (!text.trim()) {
            this.duplicateWords.innerHTML = '<p class="text-center">중복된 단어가 없습니다.</p>';
            return;
        }

        // 단어 추출 (2글자 이상만)
        const words = text.toLowerCase()
            .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '')
            .split(/\s+/)
            .filter(word => word.length >= 2);

        // 단어 빈도수 계산
        const wordFrequency = {};
        words.forEach(word => {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        });

        // 중복 단어 필터링 (2회 이상)
        const duplicates = Object.entries(wordFrequency)
            .filter(([word, count]) => count > 1)
            .sort((a, b) => b[1] - a[1]); // 빈도순 정렬

        // UI 업데이트
        if (duplicates.length === 0) {
            this.duplicateWords.innerHTML = '<p class="text-center">중복된 단어가 없습니다.</p>';
        } else {
            const duplicateHTML = `
                <div class="duplicate-list">
                    ${duplicates.map(([word, count]) => `
                        <div class="duplicate-item">
                            <span class="duplicate-word">${word}</span>
                            <span class="duplicate-count">${count}회</span>
                        </div>
                    `).join('')}
                </div>
            `;
            this.duplicateWords.innerHTML = duplicateHTML;
        }
    }

    /**
     * 텍스트 지우기
     */
    clearText() {
        if (this.textInput.value && !confirm('텍스트를 모두 지우시겠습니까?')) {
            return;
        }
        
        this.textInput.value = '';
        this.updateStats();
        this.textInput.focus();
        
        // localStorage 클리어
        localStorage.removeItem('savedText');
    }

    /**
     * 자동 저장 (localStorage)
     */
    autoSave(text) {
        try {
            localStorage.setItem('savedText', text);
            localStorage.setItem('savedTime', new Date().toISOString());
        } catch (e) {
            console.warn('자동 저장 실패:', e);
        }
    }

    /**
     * 저장된 텍스트 불러오기
     */
    loadSavedText() {
        try {
            const savedText = localStorage.getItem('savedText');
            const savedTime = localStorage.getItem('savedTime');
            
            if (savedText && savedTime) {
                const timeDiff = Date.now() - new Date(savedTime).getTime();
                const hoursDiff = timeDiff / (1000 * 60 * 60);
                
                // 24시간 이내의 데이터만 복원
                if (hoursDiff < 24) {
                    this.textInput.value = savedText;
                    this.updateStats();
                }
            }
        } catch (e) {
            console.warn('저장된 텍스트 불러오기 실패:', e);
        }
    }

    /**
     * 텍스트 복사 기능 (추가 기능)
     */
    copyText() {
        this.textInput.select();
        document.execCommand('copy');
        this.showNotification('텍스트가 복사되었습니다.');
    }

    /**
     * 알림 표시
     */
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
}

/**
 * 다국어 번역 기능
 */
class TextTranslator {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.translateEN = document.getElementById('translateEN');
        this.translateJA = document.getElementById('translateJA');
        this.translateZH = document.getElementById('translateZH');
        this.translateES = document.getElementById('translateES');
        this.translateFR = document.getElementById('translateFR');
        this.translateDE = document.getElementById('translateDE');
        this.translateRU = document.getElementById('translateRU');
        this.translateVI = document.getElementById('translateVI');
        this.translationResult = document.getElementById('translationResult');
        this.translatedText = document.getElementById('translatedText');
        this.translationLang = document.getElementById('translationLang');
        this.copyTranslation = document.getElementById('copyTranslation');
        this.translationLoading = document.getElementById('translationLoading');
        
        this.init();
    }

    init() {
        if (this.translateEN) {
            this.translateEN.addEventListener('click', () => this.translate('en', '영어'));
        }
        if (this.translateJA) {
            this.translateJA.addEventListener('click', () => this.translate('ja', '일본어'));
        }
        if (this.translateZH) {
            this.translateZH.addEventListener('click', () => this.translate('zh-CN', '중국어'));
        }
        if (this.translateES) {
            this.translateES.addEventListener('click', () => this.translate('es', '스페인어'));
        }
        if (this.translateFR) {
            this.translateFR.addEventListener('click', () => this.translate('fr', '프랑스어'));
        }
        if (this.translateDE) {
            this.translateDE.addEventListener('click', () => this.translate('de', '독일어'));
        }
        if (this.translateRU) {
            this.translateRU.addEventListener('click', () => this.translate('ru', '러시아어'));
        }
        if (this.translateVI) {
            this.translateVI.addEventListener('click', () => this.translate('vi', '베트남어'));
        }
        if (this.copyTranslation) {
            this.copyTranslation.addEventListener('click', () => this.copyTranslatedText());
        }
    }

    async translate(targetLang, langName) {
        const text = this.textInput.value.trim();
        
        if (!text) {
            alert('번역할 텍스트를 입력해주세요.');
            return;
        }

        // 로딩 표시
        this.translationLoading.style.display = 'block';
        this.translationResult.style.display = 'none';

        try {
            // Google Translate API 무료 엔드포인트 사용
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            // 번역 결과 추출
            let translatedText = '';
            if (data && data[0]) {
                translatedText = data[0].map(item => item[0]).join('');
            }

            // 결과 표시
            this.translationLang.textContent = `번역 결과 (${langName}):`;
            this.translatedText.textContent = translatedText;
            this.translationLoading.style.display = 'none';
            this.translationResult.style.display = 'block';
            
            // 결과로 스크롤
            this.translationResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        } catch (error) {
            console.error('번역 오류:', error);
            this.translationLoading.style.display = 'none';
            alert('번역 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    }

    copyTranslatedText() {
        const text = this.translatedText.textContent;
        
        // 클립보드에 복사
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        this.showNotification('번역된 텍스트가 복사되었습니다!');
    }

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
    new CharacterCounter();
    new TextTranslator();
});

// 페이지 벗어나기 전 경고 (텍스트가 있을 때)
window.addEventListener('beforeunload', (e) => {
    const textInput = document.getElementById('textInput');
    if (textInput && textInput.value.trim().length > 100) {
        e.preventDefault();
        e.returnValue = '';
    }
});
