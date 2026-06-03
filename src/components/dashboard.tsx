import { Store } from '../utils/store.js';
import { AuraAnimations } from '../utils/animations.js';
import { FeedComponent } from './feed.js';
import { MeetingsComponent } from './meetings.js';
import { WikiComponent } from './wiki.js';
import { TasksComponent } from './tasks.js';
import { IntegrationsComponent } from './integrations.js';
import { ChatComponent } from './chat.js';

export const DashboardComponent = {
    render: (container, onLogout) => {
        const user = Store.auth.getCurrentUser();
        if (!user) {
            onLogout(); // Guard redirect
            return;
        }

        container.innerHTML = `
            <div class="dashboard-root">
                <!-- Sidebar -->
                <aside class="dashboard-sidebar" style="border-right: 1px solid rgba(0, 240, 255, 0.15);">
                    <div class="sidebar-top">
                        <div class="logo-container">
                            <div class="logo-icon"></div>
                            <span>AURA AI</span>
                        </div>
                        
                        <nav class="sidebar-menu">
                            <button class="menu-item active" data-tab="feed">
                                <i class="lucide-icon" data-lucide="layers"></i>
                                <span>Priority Feed</span>
                            </button>
                            <button class="menu-item" data-tab="meetings">
                                <i class="lucide-icon" data-lucide="users"></i>
                                <span>Meeting Decisions</span>
                            </button>
                            <button class="menu-item" data-tab="wiki">
                                <i class="lucide-icon" data-lucide="brain"></i>
                                <span>Tribal Wiki</span>
                            </button>
                            <button class="menu-item" data-tab="tasks">
                                <i class="lucide-icon" data-lucide="check-square"></i>
                                <span>Accountability Board</span>
                            </button>
                            <button class="menu-item" data-tab="integrations">
                                <i class="lucide-icon" data-lucide="link"></i>
                                <span>Integrations</span>
                            </button>
                            <button class="menu-item" data-tab="chat">
                                <i class="lucide-icon" data-lucide="sparkles"></i>
                                <span>Aura CoS Agent</span>
                            </button>
                        </nav>
                    </div>
                    
                    <div class="sidebar-bottom">
                        <div class="user-badge" style="border-color: rgba(0, 240, 255, 0.15);">
                            <div class="user-avatar">${user.name.split(' ').map((n)=>n[0]).join('')}</div>
                            <div class="user-info">
                                <span class="user-name">${user.name}</span>
                                <span class="user-role">${user.role}</span>
                            </div>
                        </div>
                        <button class="btn-logout" id="dashboard-logout-btn">
                            <i class="lucide-icon" data-lucide="log-out"></i>
                            <span>Deactivate Cockpit</span>
                        </button>
                    </div>
                </aside>

                <!-- Main Viewport -->
                <main class="dashboard-main">
                    <header class="dashboard-header" style="border-bottom: 1px solid rgba(0, 240, 255, 0.15);">
                        <div class="header-title-area">
                            <h2 id="viewport-title" style="font-size: 1.1rem; color: #fff; text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);">Priority Feed</h2>
                        </div>
                        
                        <!-- Telemetry Grid for HUD cockpit feel -->
                        <div style="display: flex; gap: 2rem; font-family: 'Orbitron', sans-serif; font-size: 0.72rem; color: var(--text-muted); align-items: center;" class="hud-header-telemetry">
                            <span>SYS_SYNC: <strong style="color: #fff;">SECURE</strong></span>
                            <span>CORE_GRID: <strong style="color: #fff;">14.2%</strong></span>
                            <span>MEM_BUFF: <strong style="color: #fff;">8.2 GB</strong></span>
                        </div>

                        <div class="header-status">
                            <div class="status-indicator" id="live-refresh-badge">
                                <span class="status-dot"></span>
                                <span>JARVIS PROTOCOL ACTIVE</span>
                            </div>
                        </div>
                    </header>
                    
                    <div class="dashboard-viewport" id="viewport-content">
                        <!-- Subview Injected Here -->
                    </div>
                </main>
            </div>
        `;

        if ((window as any).lucide) (window as any).lucide.createIcons();

        // Subview dispatcher
        const viewPort = document.getElementById('viewport-content');
        const viewTitle = document.getElementById('viewport-title');
        const menuItems = document.querySelectorAll('.menu-item');
        let currentTabId = 'feed';
        let currentTabContext = null;

        const activeSubviews = {
            feed: {
                title: 'PRIORITY COCKPIT',
                render: () => FeedComponent.render(viewPort, loadTab)
            },
            meetings: {
                title: 'SYNC MINUTES',
                render: () => MeetingsComponent.render(viewPort)
            },
            wiki: {
                title: 'TRIBAL INDEX',
                render: (context) => WikiComponent.render(viewPort, context)
            },
            tasks: {
                title: 'ACCOUNTABILITY LOOP',
                render: () => TasksComponent.render(viewPort)
            },
            integrations: {
                title: 'INTEGRATIONS',
                render: () => IntegrationsComponent.render(viewPort, () => {
                    // callback on integrations updated
                })
            },
            chat: {
                title: 'JARVIS INTELLIGENCE AGENT',
                render: (context) => ChatComponent.render(viewPort, context)
            }
        };

        const loadTab = (tabId, context = null) => {
            currentTabId = tabId;
            currentTabContext = context;
            menuItems.forEach((item: any) => {
                if (item.dataset.tab === tabId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            const subview = activeSubviews[tabId];
            if (subview) {
                viewTitle.textContent = subview.title;
                subview.render(context);
                AuraAnimations.initDashboard();
            }
        };

        // Tab Navigation click handlers
        menuItems.forEach((item: any) => {
            item.addEventListener('click', () => {
                loadTab(item.dataset.tab);
            });
        });

        // Logout
        document.getElementById('dashboard-logout-btn').addEventListener('click', () => {
            if ((window as any).dashboardRefreshInterval) {
                clearInterval((window as any).dashboardRefreshInterval);
            }
            Store.auth.logout();
            onLogout();
        });

        // 30-sec Auto-Refresh Hook
        if ((window as any).dashboardRefreshInterval) {
            clearInterval((window as any).dashboardRefreshInterval);
        }
        
        (window as any).dashboardRefreshInterval = setInterval(() => {
            const badge = document.getElementById('live-refresh-badge');
            if (badge) {
                badge.classList.add('live-pulse');
                setTimeout(() => badge.classList.remove('live-pulse'), 1500);
            }

            // Only refresh if user is not actively interacting with inputs or modals
            const modalOpen = document.querySelector('.modal-overlay[style*="display: flex"]');
            const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
            if (!modalOpen && activeTag !== 'input' && activeTag !== 'textarea') {
                loadTab(currentTabId, currentTabContext);
            }
        }, 30000);

        // Load Default View
        loadTab('feed');
    }
};
