/**
 * 반응형 네비게이션 메뉴 컴포넌트
 * 모든 페이지에서 공통으로 사용되는 메뉴 시스템
 */

class NavigationMenu {
    constructor() {
        this.menuData = [
            {
                title: '글자수세기',
                url: 'index.html',
                icon: '📝'
            },
            {
                title: '프로필 생성기',
                url: 'profile-generator.html',
                icon: '👤'
            },
            {
                title: 'MBTI 테스트',
                url: 'mbti-test.html',
                icon: '🧠'
            },
            {
                title: 'MBTI 궁합',
                url: 'mbti-compatibility.html',
                icon: '💕'
            },
            {
                title: '오늘의 운세',
                url: 'fortune-teller.html',
                icon: '🔮'
            },
            {
                title: '로또 생성기',
                url: 'lotto-generator.html',
                icon: '🎰'
            }
        ];
        
        this.init();
    }

    init() {
        this.createMenu();
        this.attachEventListeners();
        this.setActiveMenu();
    }

    createMenu() {
        const nav = document.querySelector('nav') || this.createNavElement();
        
        const menuHTML = `
            <div class="nav-container">
                <div class="nav-brand">
                    <a href="index.html">
                        <span class="logo-icon">🛠️</span>
                        <span class="logo-text">온라인 도구</span>
                    </a>
                </div>
                
                <button class="menu-toggle" aria-label="메뉴 열기/닫기">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <ul class="nav-menu">
                    ${this.menuData.map(item => this.createMenuItem(item)).join('')}
                </ul>
            </div>
        `;
        
        nav.innerHTML = menuHTML;
    }

    createNavElement() {
        const nav = document.createElement('nav');
        nav.className = 'main-nav';
        document.body.insertBefore(nav, document.body.firstChild);
        return nav;
    }

    createMenuItem(item) {
        if (item.submenu) {
            return `
                <li class="nav-item has-submenu">
                    <a href="${item.url}" class="nav-link">
                        <span class="nav-icon">${item.icon}</span>
                        <span class="nav-text">${item.title}</span>
                        <span class="dropdown-arrow">▼</span>
                    </a>
                    <ul class="submenu">
                        ${item.submenu.map(subitem => `
                            <li><a href="${subitem.url}">${subitem.title}</a></li>
                        `).join('')}
                    </ul>
                </li>
            `;
        }
        
        return `
            <li class="nav-item">
                <a href="${item.url}" class="nav-link">
                    <span class="nav-icon">${item.icon}</span>
                    <span class="nav-text">${item.title}</span>
                </a>
            </li>
        `;
    }

    attachEventListeners() {
        // 모바일 메뉴 토글
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
        }

        // 서브메뉴 토글 (모바일)
        const submenuItems = document.querySelectorAll('.has-submenu > .nav-link');
        submenuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const parent = item.parentElement;
                    parent.classList.toggle('active');
                }
            });
        });

        // 메뉴 외부 클릭시 닫기
        document.addEventListener('click', (e) => {
            if (!e.target.closest('nav') && navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });

        // 반응형 처리
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    setActiveMenu() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
}

// 페이지 로드 시 메뉴 초기화
document.addEventListener('DOMContentLoaded', () => {
    new NavigationMenu();
});
