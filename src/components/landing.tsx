export const LandingComponent = {
    render: (container, navigateToLogin, navigateToRegister) => {
        const diagnosticsData: any[] = [];
        const solutionsData: any[] = [];

        container.innerHTML = `
            <!-- Navigation -->
            <nav class="landing-navbar">
                <div class="logo-container">
                    <div class="logo-icon"></div>
                    <span>AURA AI</span>
                </div>
                <div class="landing-nav-links">
                    <a href="#cockpit">Holographic Core</a>
                    ${diagnosticsData.length > 0 ? `<a href="#problems">HUD Diagnostics</a>` : ''}
                    <button class="btn-secondary" id="nav-login-btn">Secure Login</button>
                    <button class="glow-btn" id="nav-register-btn">Initialize Aura</button>
                </div>
            </nav>

            <!-- Hero Section -->
            <section class="hero-section">
                <div class="hero-pill">
                    <span></span>
                    Aura HUD 2.0 // Ambient Intelligence System
                </div>
                <h1 class="hero-title">
                    PRODUCTIVITY & TEAMWORK<br>
                    <span class="glow-text">REIMAGINED AS JARVIS</span>
                </h1>
                <p class="hero-subtitle">
                    Observe, prioritize, and capture team coordination ambiently. A secure, zero-friction cockpit that unifies Slack, Notion, Figma, Jira, and Gmail into a single holographic workspace.
                </p>
                <div class="hero-ctas">
                    <button class="glow-btn" id="hero-get-started">Start HUD Deployment</button>
                    <button class="btn-secondary" id="hero-learn-more" onclick="document.getElementById('cockpit').scrollIntoView({behavior: 'smooth'})">Access Core Reactor</button>
                </div>
            </section>

            <!-- Holographic Interactive 3D Orbiting Core (The JARVIS Reactor) -->
            <section class="landing-section" id="cockpit" style="border-top: 1px solid var(--border-color); padding-top: 4rem;">
                <div class="section-header">
                    <h2>The JARVIS Integration Core</h2>
                    <p>Click on any orbiting application node to pause telemetry and inspect its active workspace alerts.</p>
                </div>

                <div class="orbit-viewport">
                    <!-- Telemetry Float Labels -->
                    <div class="hud-telemetry tl">SYS STATUS: SCANNING</div>
                    <div class="hud-telemetry tr">SYNC RATE: 99.84%</div>
                    <div class="hud-telemetry bl">THREAT: MINIMAL</div>
                    <div class="hud-telemetry br">CORE TEMP: 32 C</div>

                    <!-- JARVIS Reactor Core -->
                    <div class="jarvis-orb">
                        <div class="orb-core"></div>
                        <div class="orb-ring-1"></div>
                        <div class="orb-ring-2"></div>
                        <div class="orb-ring-3"></div>
                    </div>

                    <!-- Atomic Orbit Rings (3D Electron Orbits) -->
                    <div id="landing-orbit-ring">
                        <!-- RING 1: 4 electrons -->
                        <div class="electron-ring ring-1">
                            <div class="electron-node orbit-node slack connected" style="--orbit-speed: 10s; --delay: 0s;" data-source="slack">
                                <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/slack/E01E5A" alt="Slack"></div>
                            </div>
                            <div class="electron-node orbit-node figma connected" style="--orbit-speed: 10s; --delay: -2.5s;" data-source="figma">
                                <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/figma/F24E1E" alt="Figma"></div>
                            </div>
                            <div class="electron-node orbit-node notion connected" style="--orbit-speed: 10s; --delay: -5s;" data-source="notion">
                                <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/notion/FFFFFF" alt="Notion"></div>
                            </div>
                            <div class="electron-node orbit-node jira disconnected" style="--orbit-speed: 10s; --delay: -7.5s;" data-source="jira">
                                <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/jira/0052CC" alt="Jira"></div>
                            </div>
                        </div>

                        <!-- RING 2: 3 electrons -->
                        <div class="electron-ring ring-2">
                            <div class="electron-node orbit-node email connected" style="--orbit-speed: 14s; --delay: 0s;" data-source="email">
                                <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/gmail/EA4335" alt="Gmail"></div>
                            </div>
                            <div class="electron-node orbit-node whatsapp connected" style="--orbit-speed: 14s; --delay: -4.67s;" data-source="whatsapp">
                                <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/whatsapp/25D366" alt="WhatsApp"></div>
                            </div>
                            <div class="electron-node orbit-node github connected" style="--orbit-speed: 14s; --delay: -9.33s;" data-source="github">
                                <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/github/FFFFFF" alt="GitHub"></div>
                            </div>
                        </div>

                        <!-- RING 3: 3 electrons -->
                        <div class="electron-ring ring-3">
                            <div class="electron-node orbit-node trello connected" style="--orbit-speed: 18s; --delay: 0s;" data-source="trello">
                                <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/trello/0052CC" alt="Trello"></div>
                            </div>
                            <div class="electron-node orbit-node zoom connected" style="--orbit-speed: 18s; --delay: -6s;" data-source="zoom">
                                <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/zoom/2D8CFF" alt="Zoom"></div>
                            </div>
                            <div class="electron-node orbit-node googledrive connected" style="--orbit-speed: 18s; --delay: -12s;" data-source="googledrive">
                                <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/googledrive/4285F4" alt="Google Drive"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Selected Item Telemetry and Unified Actions -->
                <div class="landing-demo-container" style="margin-top: 1rem;">
                    <div class="demo-grid">
                        <div class="demo-left">
                            <h3 id="demo-source-title">AURA Core</h3>
                            <p id="demo-source-desc">Hover or click any revolving node inside the reactor fields to focus tracking sensors. Disconnected streams are marked red.</p>
                            <button class="glow-btn" id="activate-hologram-btn" style="width: 100%; margin-top: 1.5rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                                <i class="lucide-icon" data-lucide="sparkles"></i>
                                Activate HUD Synthesis
                            </button>
                        </div>
                        
                        <div class="demo-preview-card" id="landing-telemetry-panel">
                            <div class="demo-header">
                                <span style="font-weight: 700; color: #fff;" id="demo-source-name">SYSTEM ENGAGEMENT</span>
                                <span class="priority-badge" id="demo-source-priority" style="background: rgba(0, 240, 255, 0.1); color: #00f0ff; border-color: rgba(0, 240, 255, 0.3);">ACTIVE SCAN</span>
                            </div>
                            <div class="demo-body" id="demo-source-body">
                                <p style="color: #94a3b8; font-style: italic; line-height: 1.6;">Awaiting telemetry targeting. The revolving ring demonstrates the spatial 3D model connecting workspace feeds directly to the central Aura intelligence core.</p>
                            </div>
                            <div class="demo-footer" id="demo-source-footer">
                                SECURE COCKPIT CONNECTIVITY
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Diagnosed Problems section will only render if there are items -->
            ${diagnosticsData.length > 0 ? `
            <section class="landing-section" id="problems">
                <div class="section-header">
                    <h2>HUD DIAGNOSTICS: SYSTEM COLLAPSE</h2>
                    <p>Knowledge work is leaking 57% efficiency across four core structural failures.</p>
                </div>
                
                <div class="problems-grid">
                    ${diagnosticsData.map(item => `
                        <div class="glass-card problem-card">
                            <div class="icon-wrap">
                                <i class="lucide-icon" data-lucide="${item.icon}"></i>
                            </div>
                            <h3>${item.title}</h3>
                            <p>${item.desc}</p>
                            <div class="example-tag">${item.tag}</div>
                        </div>
                    `).join('')}
                </div>
            </section>
            ` : ''}

            <!-- How AURA Solves It will only render if there are items -->
            ${solutionsData.length > 0 ? `
            <section class="landing-section" id="solutions">
                <div class="section-header">
                    <h2>HOW AURA SOLVES IT</h2>
                    <p>An ambient AI Chief of Staff that works silently in the background, so you never have to.</p>
                </div>

                <div class="problems-grid">
                    ${solutionsData.map(item => `
                        <div class="glass-card problem-card">
                            <div class="icon-wrap" style="background: rgba(0, 240, 255, 0.1);">
                                <i class="lucide-icon" data-lucide="${item.icon}"></i>
                            </div>
                            <h3>${item.title}</h3>
                            <p>${item.desc}</p>
                            <div class="example-tag" style="border-color: rgba(0, 240, 255, 0.2); color: rgba(0, 240, 255, 0.8);">${item.tag}</div>
                        </div>
                    `).join('')}
                </div>
            </section>
            ` : ''}

            <!-- EXTRA CONTEXT SECTION -->
            <section class="landing-section" id="how-it-works" style="background: rgba(0, 240, 255, 0.02); border-top: 1px solid rgba(0, 240, 255, 0.1); border-bottom: 1px solid rgba(0, 240, 255, 0.1);">
                <div class="section-header">
                    <h2>SECURE BY DESIGN, AMBIENT BY NATURE</h2>
                    <p>Aura connects directly using strict OAuth 2.0 minimal scopes. We never store your raw chat data — we only index actionable decisions and synthesize context.</p>
                </div>
                <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 850px; margin: 0 auto;">
                    <div class="glass-card" style="display: flex; gap: 1.5rem; align-items: flex-start; text-align: left;">
                        <i class="lucide-icon" data-lucide="lock" style="width: 32px; height: 32px; color: hsla(var(--primary), 1); flex-shrink: 0; margin-top: 5px;"></i>
                        <div>
                            <h3 style="font-size: 1.15rem; margin-bottom: 0.5rem;">End-to-End Encryption</h3>
                            <p style="font-size: 0.95rem; line-height: 1.6;">Our ingestion pipelines utilize AES-256 encryption. Action items and tribal knowledge are encrypted at rest and in transit. Your intellectual property never trains our foundational models.</p>
                        </div>
                    </div>
                    <div class="glass-card" style="display: flex; gap: 1.5rem; align-items: flex-start; text-align: left;">
                        <i class="lucide-icon" data-lucide="zap" style="width: 32px; height: 32px; color: hsla(var(--primary), 1); flex-shrink: 0; margin-top: 5px;"></i>
                        <div>
                            <h3 style="font-size: 1.15rem; margin-bottom: 0.5rem;">Real-Time Context Synthesis</h3>
                            <p style="font-size: 0.95rem; line-height: 1.6;">Aura uses specialized agents to detect task dependencies. If an engineer mentions a delay on Slack that blocks a Jira ticket, Aura automatically triggers an alert on your Priority Feed.</p>
                        </div>
                    </div>
                    <div class="glass-card" style="display: flex; gap: 1.5rem; align-items: flex-start; text-align: left;">
                        <i class="lucide-icon" data-lucide="globe" style="width: 32px; height: 32px; color: hsla(var(--primary), 1); flex-shrink: 0; margin-top: 5px;"></i>
                        <div>
                            <h3 style="font-size: 1.15rem; margin-bottom: 0.5rem;">Cross-Platform Integration Grid</h3>
                            <p style="font-size: 0.95rem; line-height: 1.6;">Whether your team relies on Figma comments, Zoom calls, or GitHub PRs, Aura harmonizes isolated data streams into a single source of truth for the entire organization.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Call to Action -->
            <section class="landing-section" style="text-align: center; padding: 4rem 2rem;">
                <h2 style="font-family: 'Orbitron', sans-serif; font-size: 2rem; margin-bottom: 1rem;">Ready to Deploy Your AI Chief of Staff?</h2>
                <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 2rem auto; line-height: 1.7;">Join teams already using AURA to eliminate coordination overhead, capture tribal knowledge, and ensure 100% follow-through on every action item.</p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button class="glow-btn" id="cta-get-started" style="padding: 0.85rem 2.5rem; font-size: 1rem;">Start Free Deployment</button>
                    <button class="btn-secondary" id="cta-login" style="padding: 0.85rem 2.5rem; font-size: 1rem;">Sign In to Cockpit</button>
                </div>
            </section>

            <!-- Footer -->
            <footer style="border-top: 1px solid rgba(0, 240, 255, 0.15); padding: 3rem 2rem; margin-top: 2rem; text-align: center; color: var(--text-muted); font-family: 'Orbitron', sans-serif; font-size: 0.8rem;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                    <div class="logo-container">
                        <div class="logo-icon" style="width: 24px; height: 24px;"></div>
                        <span style="color: #fff; font-size: 1rem;">AURA AI</span>
                    </div>
                    <p>Ambient Intelligence System // JARVIS Core</p>
                    <div style="display: flex; gap: 1.5rem; justify-content: center; margin-top: 1rem;">
                        <a href="#" id="link-terms" style="color: hsla(var(--primary), 1); text-decoration: none; transition: color 0.3s;">Terms of Service</a>
                        <a href="#" id="link-privacy" style="color: hsla(var(--primary), 1); text-decoration: none; transition: color 0.3s;">Privacy Policy</a>
                    </div>
                    <div style="display: flex; gap: 1.5rem; justify-content: center; margin-top: 0.5rem; flex-wrap: wrap;">
                        <span style="color: var(--text-muted);"><strong style="color: #fff;">Mobile:</strong> 8168086817</span>
                        <span style="color: var(--text-muted);"><strong style="color: #fff;">Email:</strong> akshit.2007.07@gmail.com</span>
                        <span style="color: var(--text-muted);"><strong style="color: #fff;">Instagram:</strong> Akshit_0.1</span>
                    </div>
                    <p style="margin-top: 2rem; opacity: 0.5;">&copy; 2026 Aura AI Systems. All rights reserved.</p>
                </div>
            </footer>
        `;

        if ((window as any).lucide) (window as any).lucide.createIcons();

        const nodes = container.querySelectorAll('.orbit-node');
        const orbitRing = document.getElementById('landing-orbit-ring');
        const synthesizeBtn = document.getElementById('activate-hologram-btn');

        // Nav click listeners
        document.getElementById('nav-login-btn').addEventListener('click', navigateToLogin);
        document.getElementById('nav-register-btn').addEventListener('click', navigateToRegister);
        const heroRegisterBtn = document.getElementById('hero-get-started');
        const handleDeployClick = (btnElement) => {
            if (!btnElement) return;
            btnElement.innerHTML = 'DEPLOYING...';
            btnElement.classList.add('loading');
            
            setTimeout(() => {
                btnElement.classList.remove('loading');
                btnElement.classList.add('success');
                btnElement.innerHTML = `<i class="lucide-icon" data-lucide="check-circle"></i> CORE DEPLOYED`;
                if ((window as any).lucide) (window as any).lucide.createIcons();
                
                setTimeout(() => {
                    navigateToRegister();
                }, 800);
            }, 1500);
        };

        if (heroRegisterBtn) heroRegisterBtn.addEventListener('click', () => handleDeployClick(heroRegisterBtn));
        
        const ctaLoginBtn = document.getElementById('cta-login');
        if (ctaLoginBtn) ctaLoginBtn.addEventListener('click', navigateToLogin);
        
        const ctaRegisterBtn = document.getElementById('cta-get-started');
        if (ctaRegisterBtn) {
            ctaRegisterBtn.addEventListener('click', () => handleDeployClick(ctaRegisterBtn));
        }

        nodes.forEach((node: any) => {
            // Hover pauses the 3D rotating carousel
            node.addEventListener('mouseenter', () => {
                if(orbitRing) orbitRing.classList.add('paused');
            });
            node.addEventListener('mouseleave', () => {
                if(orbitRing) orbitRing.classList.remove('paused');
            });

            // Click navigates to login as requested for fully functional site
            node.addEventListener('click', () => {
                navigateToLogin();
            });
        });

        // Activate HUD Synthesis Click (also navigate to login)
        if(synthesizeBtn) {
            synthesizeBtn.addEventListener('click', () => {
                navigateToLogin();
            });
        }

        // Functional Terms and Privacy Policy Links
        const showPolicyModal = (title) => {
            const modalOverlay = document.createElement('div');
            modalOverlay.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(2, 4, 10, 0.95); backdrop-filter: blur(10px);
                z-index: 99999; display: flex; align-items: center; justify-content: center;
            `;
            modalOverlay.innerHTML = `
                <div class="glass-card" style="max-width: 600px; width: 90%; padding: 2.5rem; border: 1px solid rgba(0, 240, 255, 0.2); text-align: center;">
                    <div class="logo-icon" style="margin: 0 auto 1.5rem auto; width: 48px; height: 48px;"></div>
                    <h2 style="font-family: 'Orbitron', sans-serif; margin-bottom: 1rem; color: #fff;">${title}</h2>
                    <div style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; text-align: left; margin-bottom: 2rem; max-height: 250px; overflow-y: auto; padding-right: 1rem;">
                        <p style="margin-bottom: 1rem;">Welcome to Aura AI (JARVIS). By accessing or using our platform, you agree to be bound by these Terms of Service and our Privacy Policy.</p>
                        <p style="margin-bottom: 1rem;"><strong>1. Data Usage:</strong> We securely process telemetry data from your connected integrations (Slack, Figma, Notion, etc.) to synthesize actionable intelligence. All data remains encrypted at rest and in transit.</p>
                        <p style="margin-bottom: 1rem;"><strong>2. Privacy:</strong> We do not sell your personal data. You retain ownership of all team-generated content. You may disconnect integrations and purge your team workspace at any time.</p>
                        <p style="margin-bottom: 1rem;"><strong>3. Acceptable Use:</strong> You agree not to reverse-engineer the JARVIS core or use the service to transmit malicious payloads. We reserve the right to terminate access for violations.</p>
                        <p><strong>Contact us:</strong><br>Mobile: 8168086817<br>Email: akshit.2007.07@gmail.com<br>Instagram: Akshit_0.1</p>
                    </div>
                    <button class="glow-btn" id="btn-close-policy" style="width: 140px;">Close</button>
                </div>
            `;
            document.body.appendChild(modalOverlay);
            document.getElementById('btn-close-policy').addEventListener('click', () => {
                document.body.removeChild(modalOverlay);
            });
        };

        const linkTerms = document.getElementById('link-terms');
        const linkPrivacy = document.getElementById('link-privacy');
        
        if (linkTerms) {
            linkTerms.addEventListener('click', (e) => {
                e.preventDefault();
                showPolicyModal('Terms of Service');
            });
        }
        if (linkPrivacy) {
            linkPrivacy.addEventListener('click', (e) => {
                e.preventDefault();
                showPolicyModal('Privacy Policy');
            });
        }
    }
};
