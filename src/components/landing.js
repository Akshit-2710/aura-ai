import { Store } from '../utils/store.js';

export const LandingComponent = {
    render: (container, navigateToLogin, navigateToRegister) => {
        const integrations = Store.integrations.get();
        const diagnosticsData = [
            {
                icon: 'message-square-warning',
                title: 'Scattered Work Signals',
                desc: 'Decisions, blockers, and ownership changes are spread across chat, docs, meetings, tickets, and design comments.',
                tag: 'Drawback: teams rebuild context before acting'
            },
            {
                icon: 'list-todo',
                title: 'Follow-Ups Go Dark',
                desc: 'Action items are mentioned once, then disappear unless someone manually converts them into tasks and reminders.',
                tag: 'Drawback: accountability depends on memory'
            },
            {
                icon: 'route-off',
                title: 'Blocked Work Is Invisible',
                desc: 'A Jira delay, Slack concern, or Figma review can block the same delivery path without any shared priority signal.',
                tag: 'Drawback: leaders discover risk too late'
            },
            {
                icon: 'brain-circuit',
                title: 'Tribal Knowledge Decays',
                desc: 'Useful explanations stay buried in transcripts and threads instead of becoming searchable team memory.',
                tag: 'Drawback: every handoff starts from zero'
            }
        ];
        const solutionsData = [
            {
                icon: 'radar',
                title: 'Scope The Workspace',
                desc: 'Aura connects only to approved tools and channels, then watches for decisions, blockers, tasks, and ownership changes.',
                tag: 'Step 01 // consented signal intake'
            },
            {
                icon: 'scan-search',
                title: 'Extract Context',
                desc: 'Specialized agents classify each signal, link it to related projects, and discard noise that is not actionable.',
                tag: 'Step 02 // decision and blocker parsing'
            },
            {
                icon: 'git-merge',
                title: 'Fuse The Threads',
                desc: 'Related chat, ticket, file, and meeting signals are merged into one explainable context card with source attribution.',
                tag: 'Step 03 // cross-tool synthesis'
            },
            {
                icon: 'bell-ring',
                title: 'Route The Next Move',
                desc: 'Aura turns the synthesized context into feed alerts, wiki entries, task drafts, and reminders for the right owner.',
                tag: 'Step 04 // action routing'
            }
        ];
        const connectedCount = Object.values(integrations).filter(Boolean).length;
        const noIntegrations = connectedCount === 0;
        const telemetryStatus = noIntegrations ? 'STANDBY' : 'ONLINE';
        const syncRate = noIntegrations ? 'N/A' : `${Math.round((connectedCount / 10) * 100)}%`;
        const threatStatus = diagnosticsData.length > 0 ? 'EVALUATING' : 'NONE';
        const coreTemp = noIntegrations ? 'IDLE' : '32 C';
        const sourceTelemetry = {
            slack: {
                title: 'Slack Signal Capture',
                desc: 'Aura scans approved channels for decisions, blockers, owners, and follow-up language without interrupting the thread.',
                name: 'SLACK CONTEXT',
                priority: integrations.slack ? 'LIVE SIGNAL' : 'READY TO CONNECT',
                body: 'Example: a launch-channel message says QA is blocked by a stale API key. Aura links it to the release task and drafts a follow-up for the backend owner.',
                footer: integrations.slack ? 'SOURCE: CONNECTED SLACK CHANNELS' : 'CONNECT SLACK TO ENABLE LIVE THREAD SYNTHESIS'
            },
            figma: {
                title: 'Figma Review Context',
                desc: 'Aura turns design comments into accountable product feedback instead of letting review notes vanish inside files.',
                name: 'FIGMA CONTEXT',
                priority: integrations.figma ? 'LIVE SIGNAL' : 'READY TO CONNECT',
                body: 'Example: three unresolved checkout comments are grouped with the related sprint ticket, then surfaced as a Priority Feed risk.',
                footer: integrations.figma ? 'SOURCE: CONNECTED FIGMA FILES' : 'CONNECT FIGMA TO TRACK DESIGN DECISIONS'
            },
            notion: {
                title: 'Notion Knowledge Sync',
                desc: 'Aura keeps decisions and working notes discoverable by linking documents to meetings, tasks, and owner changes.',
                name: 'NOTION CONTEXT',
                priority: integrations.notion ? 'LIVE SIGNAL' : 'READY TO CONNECT',
                body: 'Example: a roadmap note changes the billing milestone. Aura tags the affected task list and adds the rationale to the Tribal Wiki.',
                footer: integrations.notion ? 'SOURCE: CONNECTED NOTION WORKSPACE' : 'CONNECT NOTION TO BUILD TEAM MEMORY'
            },
            jira: {
                title: 'Jira Blocker Radar',
                desc: 'Aura compares ticket status with chat and meeting signals so hidden blockers are visible before delivery slips.',
                name: 'JIRA CONTEXT',
                priority: integrations.jira ? 'LIVE SIGNAL' : 'BLOCKER WATCH',
                body: 'Example: a ticket is still marked in progress while Slack says Redis is blocking checkout. Aura flags the mismatch and suggests an infra ping.',
                footer: integrations.jira ? 'SOURCE: CONNECTED JIRA PROJECTS' : 'CONNECT JIRA TO RESOLVE DELIVERY GAPS'
            },
            email: {
                title: 'Gmail Decision Intake',
                desc: 'Aura captures commitments and customer-facing promises from email without making users manually copy them into tasks.',
                name: 'GMAIL CONTEXT',
                priority: integrations.email ? 'LIVE SIGNAL' : 'READY TO CONNECT',
                body: 'Example: a customer email asks for a security update by Friday. Aura creates a follow-up draft and links it to the account handoff.',
                footer: integrations.email ? 'SOURCE: CONNECTED GMAIL THREADS' : 'CONNECT GMAIL TO TRACK EXTERNAL COMMITMENTS'
            },
            whatsapp: {
                title: 'WhatsApp Field Updates',
                desc: 'Aura can pull lightweight field coordination into the same operating picture as the rest of the team stack.',
                name: 'WHATSAPP CONTEXT',
                priority: integrations.whatsapp ? 'LIVE SIGNAL' : 'READY TO CONNECT',
                body: 'Example: an operations lead confirms a dependency in WhatsApp. Aura associates it with the matching task and records the owner.',
                footer: integrations.whatsapp ? 'SOURCE: CONNECTED WHATSAPP CHANNELS' : 'CONNECT WHATSAPP TO CAPTURE FIELD SIGNALS'
            },
            github: {
                title: 'GitHub Delivery Signals',
                desc: 'Aura connects pull requests, reviews, and commit activity to the work items and decisions they affect.',
                name: 'GITHUB CONTEXT',
                priority: integrations.github ? 'LIVE SIGNAL' : 'READY TO CONNECT',
                body: 'Example: a PR review requests auth changes. Aura links the request to the migration ticket and marks downstream tasks at risk.',
                footer: integrations.github ? 'SOURCE: CONNECTED GITHUB REPOS' : 'CONNECT GITHUB TO MAP CODE REVIEW IMPACT'
            },
            trello: {
                title: 'Trello Board Alignment',
                desc: 'Aura watches board movement and card comments for work that needs escalation, clarification, or a next owner.',
                name: 'TRELLO CONTEXT',
                priority: integrations.trello ? 'LIVE SIGNAL' : 'READY TO CONNECT',
                body: 'Example: a launch card moves backward after a comment about missing copy. Aura routes the issue to the content owner.',
                footer: integrations.trello ? 'SOURCE: CONNECTED TRELLO BOARDS' : 'CONNECT TRELLO TO TRACK BOARD MOVEMENT'
            },
            zoom: {
                title: 'Zoom Meeting Memory',
                desc: 'Aura converts meeting transcripts into decisions, action items, and wiki entries that teams can search later.',
                name: 'ZOOM CONTEXT',
                priority: integrations.zoom ? 'LIVE SIGNAL' : 'READY TO CONNECT',
                body: 'Example: the team agrees to defer analytics work. Aura records the decision, creates a task note, and updates the meeting summary.',
                footer: integrations.zoom ? 'SOURCE: CONNECTED ZOOM TRANSCRIPTS' : 'CONNECT ZOOM TO CAPTURE MEETING OUTCOMES'
            },
            googledrive: {
                title: 'Google Drive File Context',
                desc: 'Aura ties docs, briefs, and assets to active projects so important source material is not lost in folders.',
                name: 'DRIVE CONTEXT',
                priority: integrations.googledrive ? 'LIVE SIGNAL' : 'READY TO CONNECT',
                body: 'Example: a new launch brief appears in Drive. Aura links it to open tasks and extracts the decisions that affect the timeline.',
                footer: integrations.googledrive ? 'SOURCE: CONNECTED DRIVE FILES' : 'CONNECT DRIVE TO MAP FILE CONTEXT'
            }
        };

        const showDiagnosticsLink = diagnosticsData.length > 0;

        container.innerHTML = `
            <!-- Navigation -->
            <nav class="landing-navbar">
                <div class="logo-container" id="landing-logo-home" style="cursor: pointer;">
                    <div class="logo-icon"></div>
                    <span>AURA AI</span>
                </div>
                <div class="landing-nav-links">
                    <a href="#cockpit">Holographic Core</a>
                    ${showDiagnosticsLink ? `<a href="#problems">HUD Diagnostics</a>` : ''}
                    <a href="#solutions">How Aura Does It</a>
                    <button class="btn-secondary" id="nav-back-btn">Back</button>
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
                    Aura turns scattered Slack, Notion, Jira, Figma, and Gmail signals into one calm command center — so teams spend less time chasing context and more time moving work forward.
                </p>
                <div class="hero-ctas">
                    <button class="glow-btn" id="hero-get-started">Launch the Cockpit</button>
                    <button class="btn-secondary" id="hero-learn-more" onclick="document.getElementById('cockpit').scrollIntoView({behavior: 'smooth'})">See the Workflow</button>
                </div>
                <div class="trust-strip" aria-label="Aura trust signals">
                    <span>Secure OAuth 2.0</span>
                    <span>Slack • Notion • Jira • Gmail</span>
                    <span>Clear decisions, owners, next steps</span>
                </div>
                <div class="landing-page-links">
                    <button class="btn-secondary" id="page-link-feed">Priority Feed</button>
                    <button class="btn-secondary" id="page-link-meetings">Meeting Decisions</button>
                    <button class="btn-secondary" id="page-link-wiki">Tribal Wiki</button>
                    <button class="btn-secondary" id="page-link-integrations">Integrations</button>
                </div>
            </section>

            <!-- Holographic Interactive 3D Orbiting Core (The JARVIS Reactor) -->
            <section class="landing-section" id="cockpit" style="border-top: 1px solid var(--border-color); padding-top: 4rem;">
                <div class="section-header">
                    <h2>From scattered updates to one calm command center</h2>
                    <p>Click any orbiting node to preview how Aura synthesizes context from your connected tools and surfaces the next action clearly.</p>
                </div>

                <div class="orbit-viewport">
                    <!-- Telemetry Float Labels -->
                    <div class="hud-telemetry tl">SYS STATUS: ${telemetryStatus}</div>
                    <div class="hud-telemetry tr">SYNC RATE: ${syncRate}</div>
                    <div class="hud-telemetry bl">THREAT: ${threatStatus}</div>
                    <div class="hud-telemetry br">CORE TEMP: ${coreTemp}</div>

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
                            <div class="electron-node orbit-node slack ${integrations.slack ? 'connected' : 'disconnected'}" style="--orbit-speed: 10s; --delay: 0s;" data-source="slack">
                                <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/slack/4A154B" alt="Slack"></div>
                            </div>
                            <div class="electron-node orbit-node figma ${integrations.figma ? 'connected' : 'disconnected'}" style="--orbit-speed: 10s; --delay: -2.5s;" data-source="figma">
                                <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/figma/F24E1E" alt="Figma"></div>
                            </div>
                            <div class="electron-node orbit-node notion ${integrations.notion ? 'connected' : 'disconnected'}" style="--orbit-speed: 10s; --delay: -5s;" data-source="notion">
                                <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/notion/FFFFFF" alt="Notion"></div>
                            </div>
                            <div class="electron-node orbit-node jira ${integrations.jira ? 'connected' : 'disconnected'}" style="--orbit-speed: 10s; --delay: -7.5s;" data-source="jira">
                                <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/jira/0052CC" alt="Jira"></div>
                            </div>
                        </div>

                        <!-- RING 2: 3 electrons -->
                        <div class="electron-ring ring-2">
                            <div class="electron-node orbit-node email ${integrations.email ? 'connected' : 'disconnected'}" style="--orbit-speed: 14s; --delay: 0s;" data-source="email">
                                <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/gmail/EA4335" alt="Gmail"></div>
                            </div>
                            <div class="electron-node orbit-node whatsapp ${integrations.whatsapp ? 'connected' : 'disconnected'}" style="--orbit-speed: 14s; --delay: -4.67s;" data-source="whatsapp">
                                <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/whatsapp/25D366" alt="WhatsApp"></div>
                            </div>
                            <div class="electron-node orbit-node github ${integrations.github ? 'connected' : 'disconnected'}" style="--orbit-speed: 14s; --delay: -9.33s;" data-source="github">
                                <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/github/FFFFFF" alt="GitHub"></div>
                            </div>
                        </div>

                        <!-- RING 3: 3 electrons -->
                        <div class="electron-ring ring-3">
                            <div class="electron-node orbit-node trello ${integrations.trello ? 'connected' : 'disconnected'}" style="--orbit-speed: 18s; --delay: 0s;" data-source="trello">
                                <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/trello/0052CC" alt="Trello"></div>
                            </div>
                            <div class="electron-node orbit-node zoom ${integrations.zoom ? 'connected' : 'disconnected'}" style="--orbit-speed: 18s; --delay: -6s;" data-source="zoom">
                                <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/zoom/2D8CFF" alt="Zoom"></div>
                            </div>
                            <div class="electron-node orbit-node googledrive ${integrations.googledrive ? 'connected' : 'disconnected'}" style="--orbit-speed: 18s; --delay: -12s;" data-source="googledrive">
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
                                <span class="priority-badge" id="demo-source-priority" style="background: rgba(0, 240, 255, 0.1); color: #00f0ff; border-color: rgba(0, 240, 255, 0.3);">${noIntegrations ? 'STANDBY MODE' : 'ACTIVE SCAN'}</span>
                            </div>
                            <div class="demo-body" id="demo-source-body">
                                <p style="color: #94a3b8; font-style: italic; line-height: 1.6;">${noIntegrations ? 'No live telemetry is connected yet. Connect integrations to reveal the AURA cockpit feed, or choose a node to preview the context Aura will synthesize.' : 'Awaiting telemetry targeting. Choose a revolving node to inspect the context Aura synthesizes from that source.'}</p>
                            </div>
                            <div class="demo-footer" id="demo-source-footer">
                                ${noIntegrations ? 'CONNECTION REQUIRED' : 'SECURE COCKPIT CONNECTIVITY'}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            ${diagnosticsData.length > 0 ? `
            <section class="landing-section" id="problems">
                <div class="section-header">
                    <h2>HUD DIAGNOSTICS: OPERATIONAL GAPS</h2>
                    <p>Aura identifies the coordination gaps that slow execution: scattered context, unclear ownership, delayed escalation, and knowledge that is difficult to retrieve.</p>
                </div>

                <div class="section-context-grid">
                    <div class="section-context-card danger">
                        <span>DIAGNOSTIC INPUTS</span>
                        <p>Aura reviews approved activity across communication, project, design, and documentation tools to locate decisions, blockers, and ownership changes.</p>
                    </div>
                    <div class="section-context-card warning">
                        <span>BUSINESS IMPACT</span>
                        <p>When these signals are not connected, teams spend more time reconstructing context and less time moving work forward.</p>
                    </div>
                    <div class="section-context-card">
                        <span>PRIORITY INDICATORS</span>
                        <p>The diagnostic layer highlights unresolved action items, cross-tool status mismatches, stale knowledge paths, and dependencies that need attention.</p>
                    </div>
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

            ${solutionsData.length > 0 ? `
            <section class="landing-section" id="solutions">
                <div class="section-header">
                    <h2>HOW AURA DOES IT</h2>
                    <p>Aura converts approved workspace activity into structured context and routes the resulting insight to the appropriate workflow.</p>
                </div>

                <div class="section-context-grid aura-flow">
                    <div class="section-context-card">
                        <span>INGEST</span>
                        <p>Approved integrations provide workspace activity such as conversations, tickets, files, comments, meeting transcripts, and task updates.</p>
                    </div>
                    <div class="section-context-card">
                        <span>ANALYZE</span>
                        <p>Aura classifies decisions, risks, owners, due dates, and dependencies while preserving source attribution for review.</p>
                    </div>
                    <div class="section-context-card">
                        <span>ORCHESTRATE</span>
                        <p>The output becomes a HUD card, Priority Feed alert, task draft, meeting summary, or Tribal Wiki entry with clear next steps.</p>
                    </div>
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

        if ((window).lucide) (window).lucide.createIcons();

        const nodes = container.querySelectorAll('.orbit-node');
        const orbitRing = document.getElementById('landing-orbit-ring');
        const synthesizeBtn = document.getElementById('activate-hologram-btn');
        const demoTitle = document.getElementById('demo-source-title');
        const demoDesc = document.getElementById('demo-source-desc');
        const demoName = document.getElementById('demo-source-name');
        const demoPriority = document.getElementById('demo-source-priority');
        const demoBody = document.getElementById('demo-source-body');
        const demoFooter = document.getElementById('demo-source-footer');

        // Nav click listeners
        const navBackBtn = document.getElementById('nav-back-btn');
        if (navBackBtn) {
            navBackBtn.addEventListener('click', () => window.history.back());
        }
        document.getElementById('nav-login-btn').addEventListener('click', navigateToLogin);
        document.getElementById('nav-register-btn').addEventListener('click', navigateToRegister);
        const logoHome = document.getElementById('landing-logo-home');
        if (logoHome) {
            logoHome.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        }

        const pageFeedBtn = document.getElementById('page-link-feed');
        const pageMeetingsBtn = document.getElementById('page-link-meetings');
        const pageWikiBtn = document.getElementById('page-link-wiki');
        const pageIntegrationsBtn = document.getElementById('page-link-integrations');

        if (pageFeedBtn) pageFeedBtn.addEventListener('click', navigateToLogin);
        if (pageMeetingsBtn) pageMeetingsBtn.addEventListener('click', navigateToLogin);
        if (pageWikiBtn) pageWikiBtn.addEventListener('click', navigateToLogin);
        if (pageIntegrationsBtn) pageIntegrationsBtn.addEventListener('click', navigateToLogin);

        const heroRegisterBtn = document.getElementById('hero-get-started');
        const handleDeployClick = (btnElement) => {
            if (!btnElement) return;
            btnElement.innerHTML = 'DEPLOYING...';
            btnElement.classList.add('loading');
            
            setTimeout(() => {
                btnElement.classList.remove('loading');
                btnElement.classList.add('success');
                btnElement.innerHTML = `<i class="lucide-icon" data-lucide="check-circle"></i> CORE DEPLOYED`;
                if ((window).lucide) (window).lucide.createIcons();
                
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

        const updateTelemetryPanel = (sourceKey) => {
            const telemetry = sourceTelemetry[sourceKey];
            if (!telemetry) return;

            nodes.forEach((item) => item.classList.remove('selected'));
            const selectedNode = container.querySelector(`.orbit-node[data-source="${sourceKey}"]`);
            if (selectedNode) selectedNode.classList.add('selected');

            if (demoTitle) demoTitle.textContent = telemetry.title;
            if (demoDesc) demoDesc.textContent = telemetry.desc;
            if (demoName) demoName.textContent = telemetry.name;
            if (demoPriority) demoPriority.textContent = telemetry.priority;
            if (demoBody) {
                demoBody.innerHTML = `
                    <p style="color: #cbd5e1; line-height: 1.65;">${telemetry.body}</p>
                    <p style="color: #94a3b8; line-height: 1.6; margin-top: 0.8rem;">Aura displays this as a contextual HUD card: source, urgency, related work, and the recommended next move.</p>
                `;
            }
            if (demoFooter) demoFooter.textContent = telemetry.footer;
        };

        nodes.forEach((node) => {
            const sourceKey = node.getAttribute('data-source');
            node.setAttribute('role', 'button');
            node.setAttribute('tabindex', '0');
            node.setAttribute('aria-label', `Inspect ${sourceKey} telemetry context`);

            // Hover pauses the 3D rotating carousel
            node.addEventListener('mouseenter', () => {
                if(orbitRing) orbitRing.classList.add('paused');
            });
            node.addEventListener('mouseleave', () => {
                if(orbitRing) orbitRing.classList.remove('paused');
            });

            // Click updates the live HUD panel with source-specific context.
            node.addEventListener('click', () => {
                updateTelemetryPanel(sourceKey);
            });
            node.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    updateTelemetryPanel(sourceKey);
                }
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
