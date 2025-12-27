/**
 * 비밀번호 생성기 기능 구현
 */

class PasswordGenerator {
    constructor() {
        this.passwordResult = document.getElementById('passwordResult');
        this.passwordLength = document.getElementById('passwordLength');
        this.lengthValue = document.getElementById('lengthValue');
        this.generateBtn = document.getElementById('generateBtn');
        this.copyBtn = document.getElementById('copyBtn');
        
        this.includeUppercase = document.getElementById('includeUppercase');
        this.includeLowercase = document.getElementById('includeLowercase');
        this.includeNumbers = document.getElementById('includeNumbers');
        this.includeSymbols = document.getElementById('includeSymbols');
        
        this.strengthMeter = document.getElementById('strengthMeter');
        this.strengthFill = document.getElementById('strengthFill');
        this.strengthText = document.getElementById('strengthText');
        
        // 문자 세트
        this.charsets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };
        
        this.init();
    }

    init() {
        this.passwordLength.addEventListener('input', (e) => {
            this.lengthValue.textContent = e.target.value;
        });
        
        this.generateBtn.addEventListener('click', () => this.generatePassword());
        this.copyBtn.addEventListener('click', () => this.copyPassword());
        
        // 엔터키로 생성
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.generatePassword();
            }
        });
        
        // 초기 비밀번호 생성
        this.generatePassword();
    }

    generatePassword() {
        const length = parseInt(this.passwordLength.value);
        let charset = '';
        
        if (this.includeUppercase.checked) charset += this.charsets.uppercase;
        if (this.includeLowercase.checked) charset += this.charsets.lowercase;
        if (this.includeNumbers.checked) charset += this.charsets.numbers;
        if (this.includeSymbols.checked) charset += this.charsets.symbols;
        
        if (charset === '') {
            alert('최소 하나의 문자 유형을 선택해주세요.');
            return;
        }
        
        let password = '';
        const cryptoObj = window.crypto || window.msCrypto;
        
        if (cryptoObj) {
            // 암호학적으로 안전한 난수 생성
            const randomValues = new Uint32Array(length);
            cryptoObj.getRandomValues(randomValues);
            
            for (let i = 0; i < length; i++) {
                password += charset[randomValues[i] % charset.length];
            }
        } else {
            // 폴백: Math.random() 사용
            for (let i = 0; i < length; i++) {
                password += charset[Math.floor(Math.random() * charset.length)];
            }
        }
        
        this.passwordResult.value = password;
        this.checkPasswordStrength(password);
    }

    checkPasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (password.length >= 16) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        
        const percentage = (strength / 7) * 100;
        let strengthText = '';
        let strengthColor = '';
        
        if (percentage < 40) {
            strengthText = '약함';
            strengthColor = '#FF4858';
        } else if (percentage < 70) {
            strengthText = '보통';
            strengthColor = '#FFA500';
        } else {
            strengthText = '강함';
            strengthColor = '#1B7F79';
        }
        
        this.strengthMeter.style.display = 'block';
        this.strengthFill.style.width = percentage + '%';
        this.strengthFill.style.backgroundColor = strengthColor;
        this.strengthText.textContent = strengthText;
        this.strengthText.style.color = strengthColor;
    }

    copyPassword() {
        if (!this.passwordResult.value) {
            alert('먼저 비밀번호를 생성해주세요.');
            return;
        }
        
        this.passwordResult.select();
        document.execCommand('copy');
        
        this.showNotification('비밀번호가 복사되었습니다!');
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
    new PasswordGenerator();
});
