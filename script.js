// DOM 로드 후 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function() {
    // 테마 초기화
    initTheme();

    // 모바일 메뉴 초기화
    initMobileMenu();

    // 스크롤 애니메이션 초기화
    initScrollAnimation();

    // 네비게이션 활성 상태 초기화
    initNavigationActiveState();

    // 스무스 스크롤 초기화
    initSmoothScroll();
});

// 테마 관련 기능
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const html = document.documentElement;

    // localStorage에서 저장된 테마 불러오기
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // 테마 적용 함수
    function applyTheme(isDark) {
        if (isDark) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }

    // 초기 테마 설정
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        applyTheme(true);
    } else {
        applyTheme(false);
    }

    // 테마 토글 함수
    function toggleTheme() {
        const isDark = html.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // 데스크톱 테마 토글 버튼 이벤트
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // 모바일 테마 토글 버튼 이벤트
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }
}

// 모바일 메뉴 관련 기능
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = mobileMenu.querySelectorAll('.nav-link');

    // 모바일 메뉴 토글 함수
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('show');
    }

    // 모바일 메뉴 버튼 클릭 이벤트
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // 네비게이션 링크 클릭 시 모바일 메뉴 닫기
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('show');
        });
    });

    // 모바일 메뉴 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('show');
        }
    });
}

// 스크롤 애니메이션 관련 기능
function initScrollAnimation() {
    const sections = document.querySelectorAll('section');

    // Intersection Observer 설정
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // 각 섹션에 scroll-animate 클래스 추가 및 관찰 시작
    sections.forEach(section => {
        section.classList.add('scroll-animate');
        observer.observe(section);
    });
}

// 네비게이션 활성 상태 관련 기능
function initNavigationActiveState() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    // 스크롤 시 현재 섹션 감지
    function updateActiveNavLink() {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const scrollPosition = window.scrollY + 100;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // 활성 링크 업데이트
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', updateActiveNavLink);

    // 초기 상태 업데이트
    updateActiveNavLink();
}

// 스무스 스크롤 관련 기능
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const targetPosition = targetSection.offsetTop - 80; // 헤더 높이 고려

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 페이지 로드 완료 후 추가 초기화
window.addEventListener('load', function() {
    // 페이지 로딩 완료 후 로딩 애니메이션 제거 (필요시)
    document.body.classList.remove('loading');
});

// 윈도우 리사이즈 시 추가 처리
window.addEventListener('resize', function() {
    // 모바일 메뉴가 열려있는 경우 데스크톱 사이즈로 변경 시 닫기
    const mobileMenu = document.getElementById('mobile-menu');
    if (window.innerWidth >= 768 && mobileMenu.classList.contains('show')) {
        mobileMenu.classList.remove('show');
    }
});

// 키보드 접근성 개선
document.addEventListener('keydown', function(e) {
    // ESC 키로 모바일 메뉴 닫기
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu.classList.contains('show')) {
            mobileMenu.classList.remove('show');
        }
    }
});

// 포커스 트랩 (모바일 메뉴가 열려있을 때)
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
        const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

        if (!isTabPressed) {
            return;
        }

        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    });
}

// 모바일 메뉴에 포커스 트랩 적용
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenu) {
    trapFocus(mobileMenu);
}

// 성능 최적화: 스크롤 이벤트 디바운싱
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 디바운스된 스크롤 핸들러
const debouncedScrollHandler = debounce(() => {
    // 스크롤 관련 추가 로직이 필요한 경우 여기에 작성
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// 이미지 지연 로딩 (Lazy Loading)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// 웹페이지 성능 모니터링
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            console.log('[Performance]', entry.name, entry.duration);
        }
    });

    perfObserver.observe({ entryTypes: ['measure'] });
}

// 사용자 행동 추적 (선택적)
function trackUserAction(action, details = {}) {
    console.log('[User Action]', action, details);
    // 실제 구현에서는 분석 서비스로 전송
}

// 링크 클릭 추적
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        trackUserAction('link_click', {
            href: link.href,
            text: link.textContent.trim()
        });
    });
});

// 버튼 클릭 추적
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        trackUserAction('button_click', {
            id: button.id,
            text: button.textContent.trim()
        });
    });
});

// 페이지 가시성 변경 감지
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        trackUserAction('page_hidden');
    } else {
        trackUserAction('page_visible');
    }
});

// 에러 핸들링
window.addEventListener('error', (e) => {
    console.error('[Global Error]', e.message, e.filename, e.lineno);
    trackUserAction('error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno
    });
});

// 언로드 이벤트 (페이지 leaving)
window.addEventListener('beforeunload', () => {
    trackUserAction('page_leaving');
});