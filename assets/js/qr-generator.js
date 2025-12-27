/**
 * QR 코드 생성기 기능 구현
 */

class QRGenerator {
    constructor() {
        this.qrType = document.getElementById('qrType');
        this.qrInput = document.getElementById('qrInput');
        this.qrSize = document.getElementById('qrSize');
        this.sizeValue = document.getElementById('sizeValue');
        this.generateBtn = document.getElementById('generateQR');
        this.downloadBtn = document.getElementById('downloadQR');
        this.qrResult = document.getElementById('qrResult');
        this.qrCanvas = document.getElementById('qrCanvas');
        
        this.init();
    }

    init() {
        this.qrType.addEventListener('change', () => this.updateInputPlaceholder());
        this.qrSize.addEventListener('input', (e) => {
            this.sizeValue.textContent = e.target.value;
        });
        this.generateBtn.addEventListener('click', () => this.generateQRCode());
        this.downloadBtn.addEventListener('click', () => this.downloadQRCode());
        
        this.updateInputPlaceholder();
    }

    updateInputPlaceholder() {
        const placeholders = {
            url: 'https://example.com',
            text: '여기에 텍스트를 입력하세요',
            email: 'example@email.com',
            phone: '010-1234-5678'
        };
        
        const types = {
            url: 'url',
            text: 'text',
            email: 'email',
            phone: 'tel'
        };
        
        const type = this.qrType.value;
        this.qrInput.placeholder = placeholders[type];
        this.qrInput.type = types[type];
    }

    formatInput(type, value) {
        switch(type) {
            case 'email':
                return `mailto:${value}`;
            case 'phone':
                return `tel:${value.replace(/[^0-9]/g, '')}`;
            case 'url':
                if (!value.startsWith('http://') && !value.startsWith('https://')) {
                    return 'https://' + value;
                }
                return value;
            default:
                return value;
        }
    }

    async generateQRCode() {
        const value = this.qrInput.value.trim();
        
        if (!value) {
            alert('내용을 입력해주세요.');
            return;
        }
        
        const type = this.qrType.value;
        const formattedValue = this.formatInput(type, value);
        const size = parseInt(this.qrSize.value);
        
        try {
            // QR 코드 생성
            await QRCode.toCanvas(this.qrCanvas, formattedValue, {
                width: size,
                margin: 2,
                color: {
                    dark: '#1B7F79',
                    light: '#FFFFFF'
                },
                errorCorrectionLevel: 'M'
            });
            
            this.qrResult.style.display = 'block';
            this.qrResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
        } catch (error) {
            console.error('QR 코드 생성 오류:', error);
            alert('QR 코드 생성 중 오류가 발생했습니다.');
        }
    }

    downloadQRCode() {
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = this.qrCanvas.toDataURL();
        link.click();
        
        this.showNotification('QR 코드가 다운로드되었습니다!');
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

document.addEventListener('DOMContentLoaded', () => {
    new QRGenerator();
});
