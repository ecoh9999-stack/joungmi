/**
 * 주식/코인 수익률 계산기
 */

class StockCalculator {
    constructor() {
        // 입력 요소
        this.feeRate = document.getElementById('feeRate');
        this.taxRate = document.getElementById('taxRate');
        this.buyPrice = document.getElementById('buyPrice');
        this.quantity = document.getElementById('quantity');
        this.sellPrice = document.getElementById('sellPrice');
        
        // 결과 요소
        this.buyTotal = document.getElementById('buyTotal');
        this.sellTotal = document.getElementById('sellTotal');
        this.totalProfit = document.getElementById('totalProfit');
        this.profitRate = document.getElementById('profitRate');
        
        // 상세 결과
        this.detailBuy = document.getElementById('detailBuy');
        this.detailSell = document.getElementById('detailSell');
        this.detailFee = document.getElementById('detailFee');
        this.detailTax = document.getElementById('detailTax');
        
        // 초기화 버튼
        this.resetBtn = document.getElementById('resetBtn');
        
        this.init();
    }

    init() {
        // 저장된 수수료/거래세 불러오기
        this.loadSettings();
        
        // 이벤트 리스너 등록
        this.feeRate.addEventListener('input', () => {
            this.saveSettings();
            this.calculate();
        });
        
        this.taxRate.addEventListener('input', () => {
            this.saveSettings();
            this.calculate();
        });
        
        this.buyPrice.addEventListener('input', () => this.calculate());
        this.quantity.addEventListener('input', () => this.calculate());
        this.sellPrice.addEventListener('input', () => this.calculate());
        
        // 키보드 이벤트
        this.attachKeyboardEvents();
        
        // 초기화 버튼
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // 초기 계산
        this.calculate();
    }

    /**
     * 키보드 이벤트 등록 (방향키, ESC)
     */
    attachKeyboardEvents() {
        const inputs = document.querySelectorAll('.stock-input');
        
        inputs.forEach(input => {
            input.addEventListener('keydown', (e) => {
                const step = parseFloat(input.step) || 1;
                const currentValue = parseFloat(input.value) || 0;
                
                switch(e.key) {
                    case 'ArrowUp':
                        e.preventDefault();
                        input.value = currentValue + step;
                        this.calculate();
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        const newValue = currentValue - step;
                        input.value = newValue > 0 ? newValue : 0;
                        this.calculate();
                        break;
                    case 'Escape':
                        e.preventDefault();
                        input.value = '';
                        this.calculate();
                        break;
                }
            });
        });
    }

    /**
     * 수익률 계산
     */
    calculate() {
        const feeRate = parseFloat(this.feeRate.value) || 0;
        const taxRate = parseFloat(this.taxRate.value) || 0;
        const buyPrice = parseFloat(this.buyPrice.value) || 0;
        const quantity = parseFloat(this.quantity.value) || 0;
        const sellPrice = parseFloat(this.sellPrice.value) || 0;

        // 매수금액
        const buyTotal = buyPrice * quantity;
        
        // 매도금액
        const sellTotal = sellPrice * quantity;
        
        // 수수료 계산 (매수 + 매도)
        const buyFee = buyTotal * (feeRate / 100);
        const sellFee = sellTotal * (feeRate / 100);
        const totalFee = buyFee + sellFee;
        
        // 거래세 (매도시만)
        const tax = sellTotal * (taxRate / 100);
        
        // 총손익
        const profit = sellTotal - buyTotal - totalFee - tax;
        
        // 수익률
        const profitRateValue = buyTotal > 0 ? (profit / buyTotal) * 100 : 0;

        // UI 업데이트
        this.buyTotal.textContent = this.formatNumber(buyTotal) + ' 원';
        this.sellTotal.textContent = this.formatNumber(sellTotal) + ' 원';
        
        this.detailBuy.textContent = this.formatNumber(buyTotal) + ' 원';
        this.detailSell.textContent = this.formatNumber(sellTotal) + ' 원';
        this.detailFee.textContent = this.formatNumber(totalFee) + ' 원';
        this.detailTax.textContent = this.formatNumber(tax) + ' 원';
        
        // 손익 표시 (색상 변경)
        this.totalProfit.textContent = this.formatNumber(profit) + ' 원';
        this.profitRate.textContent = profitRateValue.toFixed(2) + ' %';
        
        // 손익에 따른 색상 변경
        const profitClass = profit > 0 ? 'profit-positive' : profit < 0 ? 'profit-negative' : 'profit-zero';
        this.totalProfit.className = 'profit-value ' + profitClass;
        this.profitRate.className = 'profit-value ' + profitClass;
    }

    /**
     * 숫자 포맷팅 (천단위 콤마)
     */
    formatNumber(num) {
        return Math.round(num).toLocaleString('ko-KR');
    }

    /**
     * 설정 저장 (localStorage)
     */
    saveSettings() {
        try {
            localStorage.setItem('stockFeeRate', this.feeRate.value);
            localStorage.setItem('stockTaxRate', this.taxRate.value);
        } catch (e) {
            console.warn('설정 저장 실패:', e);
        }
    }

    /**
     * 설정 불러오기
     */
    loadSettings() {
        try {
            const savedFeeRate = localStorage.getItem('stockFeeRate');
            const savedTaxRate = localStorage.getItem('stockTaxRate');
            
            if (savedFeeRate !== null) {
                this.feeRate.value = savedFeeRate;
            }
            if (savedTaxRate !== null) {
                this.taxRate.value = savedTaxRate;
            }
        } catch (e) {
            console.warn('설정 불러오기 실패:', e);
        }
    }

    /**
     * 초기화
     */
    reset() {
        if (!confirm('모든 입력값을 초기화하시겠습니까?')) {
            return;
        }
        
        this.buyPrice.value = '';
        this.quantity.value = '';
        this.sellPrice.value = '';
        this.calculate();
        
        this.showNotification('입력값이 초기화되었습니다.');
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
    new StockCalculator();
});
