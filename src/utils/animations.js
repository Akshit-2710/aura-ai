export const AuraAnimations = {
    initLanding() {
        if (typeof gsap === 'undefined') return;

        // Intro Hero animations
        gsap.from('.hero-pill', { opacity: 0, y: -25, duration: 0.8, delay: 0.1, ease: 'power2.out' });
        gsap.from('.hero-title', { opacity: 0, y: 35, duration: 0.9, delay: 0.2, ease: 'power2.out' });
        gsap.from('.hero-subtitle', { opacity: 0, y: 25, duration: 0.8, delay: 0.4, ease: 'power2.out' });
        gsap.from('.hero-ctas button', { opacity: 0, y: 20, duration: 0.7, delay: 0.5, stagger: 0.12, ease: 'power2.out' });

        // Concentric rings initialization
        gsap.from('.jarvis-orb', { scale: 0, opacity: 0, duration: 1.2, ease: 'back.out(1.5)', delay: 0.7 });
        gsap.from('.electron-node', { scale: 0, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'back.out(1.3)', delay: 0.9 });

        // ScrollTrigger staggered 3D Flip in for HUD Diagnostics System Collapse cards
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            gsap.from('.problem-card', {
                scrollTrigger: {
                    trigger: '#problems',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 50,
                rotationX: 45,
                transformOrigin: 'top center',
                stagger: 0.15,
                duration: 0.85,
                ease: 'power3.out'
            });
        }

        // 3D Orbit Viewport mouse tilt
        const orbitViewports = document.querySelectorAll('.orbit-viewport');
        orbitViewports.forEach(vp => {
            const orb = vp.querySelector('.jarvis-orb');
            const ring1 = vp.querySelector('.ring-1');
            const ring2 = vp.querySelector('.ring-2');
            const ring3 = vp.querySelector('.ring-3');
            
            vp.addEventListener('mousemove', (e) => {
                const rect = vp.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const angleX = -y / 15;
                const angleY = x / 15;
                
                gsap.to(orb, {
                    rotateX: angleX,
                    rotateY: angleY,
                    transformPerspective: 800,
                    duration: 0.4,
                    ease: 'power1.out'
                });
            });

            vp.addEventListener('mouseleave', () => {
                gsap.to(orb, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.7,
                    ease: 'power2.out'
                });
            });
        });

        this.bindButtons();
    },

    initAuth() {
        if (typeof gsap === 'undefined') return;

        // Auth card 3D skew
        const authCard = document.querySelector('.auth-card');
        if (authCard) {
            gsap.from(authCard, { opacity: 0, scale: 0.93, y: 25, duration: 0.75, ease: 'back.out(1.3)' });

            authCard.parentElement.addEventListener('mousemove', (e) => {
                const rect = authCard.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                const skewX = -y / 15;
                const skewY = x / 15;

                gsap.to(authCard, {
                    transformPerspective: 800,
                    rotateX: skewX,
                    rotateY: skewY,
                    duration: 0.4,
                    ease: 'power1.out'
                });
            });

            authCard.parentElement.addEventListener('mouseleave', () => {
                gsap.to(authCard, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.7,
                    ease: 'power1.out'
                });
            });
        }

        this.bindButtons();
    },

    initDashboard() {
        if (typeof gsap === 'undefined') return;

        // Sidebar tabs stagger in
        gsap.from('.menu-item', {
            opacity: 0,
            x: -20,
            stagger: 0.06,
            duration: 0.5,
            ease: 'power2.out'
        });

        // 3D viewport mouse tilt inside dashboard panels
        const viewports = document.querySelectorAll('.orbit-viewport');
        viewports.forEach(vp => {
            const orb = vp.querySelector('.jarvis-orb');
            
            vp.addEventListener('mousemove', (e) => {
                const rect = vp.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const angleX = -y / 8;
                const angleY = x / 8;
                
                gsap.to(orb, {
                    rotateX: angleX,
                    rotateY: angleY,
                    transformPerspective: 800,
                    duration: 0.4,
                    ease: 'power1.out'
                });
            });

            vp.addEventListener('mouseleave', () => {
                gsap.to(orb, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.7,
                    ease: 'power2.out'
                });
            });
        });

        this.bindButtons();
    },

    bindButtons() {
        if (typeof gsap === 'undefined') return;

        const btns = document.querySelectorAll('.glow-btn, .btn-secondary, .btn-action, .filter-btn, .sidebar-item, .menu-item');
        btns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Magnetic hover translations (max 6px)
                const pullX = (x - rect.width / 2) * 0.12;
                const pullY = (y - rect.height / 2) * 0.12;

                gsap.to(btn, {
                    x: pullX,
                    y: pullY,
                    duration: 0.25,
                    ease: 'power2.out'
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.45,
                    ease: 'elastic.out(1.1, 0.4)'
                });
            });

            // Physics click trigger scale shifts
            btn.addEventListener('mousedown', () => {
                gsap.to(btn, { scale: 0.95, duration: 0.08 });
            });

            btn.addEventListener('mouseup', () => {
                gsap.to(btn, { scale: 1, duration: 0.18, ease: 'back.out(2)' });
            });
        });
    }
};
