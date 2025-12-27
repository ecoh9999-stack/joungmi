/**
 * 프로필 생성기
 */

class ProfileGenerator {
    constructor() {
        this.form = document.getElementById('profileForm');
        this.preview = document.getElementById('profilePreview');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.downloadImageBtn = document.getElementById('downloadImageBtn');
        this.shareBtn = document.getElementById('shareBtn');
        this.qrBtn = document.getElementById('qrBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // QR 모달 요소
        this.qrModal = document.getElementById('qrModal');
        this.closeModal = document.getElementById('closeModal');
        this.downloadQrBtn = document.getElementById('downloadQrBtn');
        this.copyQrUrlBtn = document.getElementById('copyQrUrlBtn');
        this.qrUrlInput = document.getElementById('qrUrl');
        
        this.profileData = {};
        this.currentTheme = 'default';
        this.qrCodeInstance = null;
        
        this.init();
    }

    init() {
        // 폼 제출
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateProfile();
        });

        // 실시간 미리보기
        this.form.addEventListener('input', () => {
            this.updatePreview();
        });

        // 테마 변경
        document.querySelectorAll('input[name="theme"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentTheme = e.target.value;
                this.updatePreview();
            });
        });

        // 초기화
        this.resetBtn.addEventListener('click', () => this.reset());

        // 다운로드
        this.downloadBtn.addEventListener('click', () => this.downloadProfile());

        // 이미지 다운로드
        this.downloadImageBtn.addEventListener('click', () => this.downloadAsImage());

        // QR코드 생성
        this.qrBtn.addEventListener('click', () => this.showQRCode());

        // QR 모달 관련
        this.closeModal.addEventListener('click', () => this.closeQRModal());
        this.downloadQrBtn.addEventListener('click', () => this.downloadQRCode());
        this.copyQrUrlBtn.addEventListener('click', () => this.copyQRUrl());
        
        // 모달 외부 클릭시 닫기
        this.qrModal.addEventListener('click', (e) => {
            if (e.target === this.qrModal) {
                this.closeQRModal();
            }
        });

        // 공유
        this.shareBtn.addEventListener('click', () => this.shareProfile());

        // 초기 미리보기
        this.updatePreview();
    }

    /**
     * 폼 데이터 수집
     */
    collectFormData() {
        return {
            name: document.getElementById('profileName').value,
            age: document.getElementById('profileAge').value,
            gender: document.querySelector('input[name="gender"]:checked').value,
            job: document.getElementById('profileJob').value,
            location: document.getElementById('profileLocation').value,
            email: document.getElementById('profileEmail').value,
            phone: document.getElementById('profilePhone').value,
            website: document.getElementById('profileWebsite').value,
            bio: document.getElementById('profileBio').value,
            description: document.getElementById('profileDescription').value,
            skills: document.getElementById('profileSkills').value,
            interests: document.getElementById('profileInterests').value
        };
    }

    /**
     * 프로필 생성
     */
    generateProfile() {
        this.profileData = this.collectFormData();
        
        if (!this.profileData.name) {
            alert('이름은 필수 입력 항목입니다.');
            return;
        }

        this.updatePreview();
        this.downloadBtn.style.display = 'inline-block';
        this.downloadImageBtn.style.display = 'inline-block';
        this.shareBtn.style.display = 'inline-block';
        this.qrBtn.style.display = 'inline-block';
        
        this.showNotification('프로필이 생성되었습니다!');
    }

    /**
     * 미리보기 업데이트
     */
    updatePreview() {
        const data = this.collectFormData();
        
        if (!data.name) {
            this.preview.innerHTML = `
                <div class="empty-preview">
                    <span class="empty-icon">👤</span>
                    <p>정보를 입력하면 프로필이 표시됩니다</p>
                </div>
            `;
            return;
        }

        this.preview.innerHTML = this.generateProfileHTML(data);
    }

    /**
     * 프로필 HTML 생성
     */
    generateProfileHTML(data) {
        const skills = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
        const interests = data.interests ? data.interests.split(',').map(s => s.trim()).filter(s => s) : [];

        return `
            <div class="profile-card theme-${this.currentTheme}">
                <div class="profile-header">
                    <div class="profile-avatar">
                        ${data.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="profile-basic">
                        <h2 class="profile-name">${data.name}</h2>
                        ${data.job ? `<p class="profile-job">${data.job}</p>` : ''}
                        ${data.bio ? `<p class="profile-bio">${data.bio}</p>` : ''}
                    </div>
                </div>

                <div class="profile-body">
                    ${this.generateInfoSection(data)}
                    ${data.description ? this.generateDescriptionSection(data.description) : ''}
                    ${skills.length > 0 ? this.generateTagsSection('스킬', skills) : ''}
                    ${interests.length > 0 ? this.generateTagsSection('관심사', interests) : ''}
                </div>

                <div class="profile-footer">
                    ${this.generateContactSection(data)}
                </div>
            </div>
        `;
    }

    /**
     * 정보 섹션 생성
     */
    generateInfoSection(data) {
        const info = [];
        if (data.age) info.push({ icon: '🎂', label: '나이', value: `${data.age}세` });
        if (data.gender) info.push({ icon: data.gender === '남성' ? '👨' : '👩', label: '성별', value: data.gender });
        if (data.location) info.push({ icon: '📍', label: '지역', value: data.location });

        if (info.length === 0) return '';

        return `
            <div class="profile-info">
                ${info.map(item => `
                    <div class="info-item">
                        <span class="info-icon">${item.icon}</span>
                        <span class="info-text">${item.value}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * 설명 섹션 생성
     */
    generateDescriptionSection(description) {
        return `
            <div class="profile-description">
                <h3>소개</h3>
                <p>${description.replace(/\n/g, '<br>')}</p>
            </div>
        `;
    }

    /**
     * 태그 섹션 생성
     */
    generateTagsSection(title, tags) {
        return `
            <div class="profile-tags">
                <h3>${title}</h3>
                <div class="tags-list">
                    ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
    }

    /**
     * 연락처 섹션 생성
     */
    generateContactSection(data) {
        const contacts = [];
        if (data.email) contacts.push({ icon: '📧', value: data.email, type: 'email' });
        if (data.phone) contacts.push({ icon: '📱', value: data.phone, type: 'tel' });
        if (data.website) contacts.push({ icon: '🌐', value: data.website, type: 'url' });

        if (contacts.length === 0) return '';

        return `
            <div class="contact-list">
                ${contacts.map(contact => {
                    const href = contact.type === 'email' ? `mailto:${contact.value}` :
                                contact.type === 'tel' ? `tel:${contact.value}` :
                                contact.value;
                    return `
                        <a href="${href}" class="contact-item" target="_blank" rel="noopener">
                            <span class="contact-icon">${contact.icon}</span>
                            <span class="contact-text">${contact.value}</span>
                        </a>
                    `;
                }).join('')}
            </div>
        `;
    }

    /**
     * 프로필 이미지로 다운로드
     */
    async downloadAsImage() {
        const profileCard = document.querySelector('.profile-card');
        if (!profileCard) {
            alert('프로필을 먼저 생성해주세요.');
            return;
        }

        try {
            const canvas = await html2canvas(profileCard, {
                backgroundColor: null,
                scale: 2,
                logging: false
            });
            
            const link = document.createElement('a');
            link.download = `profile_${this.profileData.name}_${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            this.showNotification('이미지가 다운로드되었습니다!');
        } catch (error) {
            console.error('이미지 생성 실패:', error);
            alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
        }
    }

    /**
     * QR코드 표시
     */
    showQRCode() {
        if (!this.profileData.name) {
            alert('프로필을 먼저 생성해주세요.');
            return;
        }

        // QR코드에 담을 데이터 (JSON)
        const qrData = {
            name: this.profileData.name,
            job: this.profileData.job || '',
            email: this.profileData.email || '',
            phone: this.profileData.phone || '',
            website: this.profileData.website || '',
            bio: this.profileData.bio || ''
        };

        const qrText = JSON.stringify(qrData);
        
        // 기존 QR코드 제거
        const qrContainer = document.getElementById('qrcode');
        qrContainer.innerHTML = '';
        
        // 새 QR코드 생성
        this.qrCodeInstance = new QRCode(qrContainer, {
            text: qrText,
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });

        // URL 표시 (데이터 요약)
        this.qrUrlInput.value = `프로필: ${this.profileData.name}${this.profileData.job ? ' - ' + this.profileData.job : ''}`;
        
        // 모달 표시
        this.qrModal.style.display = 'flex';
    }

    /**
     * QR 모달 닫기
     */
    closeQRModal() {
        this.qrModal.style.display = 'none';
    }

    /**
     * QR코드 다운로드
     */
    downloadQRCode() {
        const qrCanvas = document.querySelector('#qrcode canvas');
        if (!qrCanvas) {
            alert('QR코드를 먼저 생성해주세요.');
            return;
        }

        const link = document.createElement('a');
        link.download = `qrcode_${this.profileData.name}_${Date.now()}.png`;
        link.href = qrCanvas.toDataURL('image/png');
        link.click();
        
        this.showNotification('QR코드가 다운로드되었습니다!');
    }

    /**
     * QR URL 복사
     */
    copyQRUrl() {
        this.qrUrlInput.select();
        document.execCommand('copy');
        
        this.showNotification('프로필 정보가 복사되었습니다!');
    }

    /**
     * 프로필 다운로드 (이미지로)
     */
    async downloadProfile() {
        // HTML2Canvas 라이브러리가 필요합니다
        // 여기서는 간단히 텍스트로 다운로드
        const data = this.collectFormData();
        const text = this.generateTextProfile(data);
        
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `profile_${data.name}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('프로필이 다운로드되었습니다!');
    }

    /**
     * 텍스트 프로필 생성
     */
    generateTextProfile(data) {
        let text = `=================================\n`;
        text += `   ${data.name}의 프로필\n`;
        text += `=================================\n\n`;
        
        if (data.job) text += `직업: ${data.job}\n`;
        if (data.age) text += `나이: ${data.age}세\n`;
        if (data.gender) text += `성별: ${data.gender}\n`;
        if (data.location) text += `지역: ${data.location}\n`;
        
        if (data.bio) {
            text += `\n한줄소개:\n${data.bio}\n`;
        }
        
        if (data.description) {
            text += `\n자기소개:\n${data.description}\n`;
        }
        
        if (data.skills) {
            text += `\n스킬:\n${data.skills}\n`;
        }
        
        if (data.interests) {
            text += `\n관심사:\n${data.interests}\n`;
        }
        
        text += `\n연락처:\n`;
        if (data.email) text += `이메일: ${data.email}\n`;
        if (data.phone) text += `전화: ${data.phone}\n`;
        if (data.website) text += `웹사이트: ${data.website}\n`;
        
        return text;
    }

    /**
     * 프로필 공유
     */
    shareProfile() {
        const data = this.collectFormData();
        const text = `${data.name}${data.job ? ` - ${data.job}` : ''}\n${data.bio || ''}`;
        
        if (navigator.share) {
            navigator.share({
                title: `${data.name}의 프로필`,
                text: text,
                url: window.location.href
            }).catch(err => console.log('공유 실패:', err));
        } else {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('프로필 정보가 복사되었습니다!');
            });
        }
    }

    /**
     * 초기화
     */
    reset() {
        if (!confirm('모든 입력 내용을 초기화하시겠습니까?')) {
            return;
        }

        this.form.reset();
        this.updatePreview();
        this.downloadBtn.style.display = 'none';
        this.downloadImageBtn.style.display = 'none';
        this.shareBtn.style.display = 'none';
        this.qrBtn.style.display = 'none';
        
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
    new ProfileGenerator();
});
