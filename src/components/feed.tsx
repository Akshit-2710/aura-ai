import { Store, escapeHTML } from '../utils/store.js';

// ── Timestamp Helpers ──────────────────────────────────────────
const formatTimeAgo = (isoString) => {
    if (!isoString) return '';
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatFullDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true
    });
};

export const FeedComponent = {
    render: (container, navigateToTab) => {
        let activePriorityFilter = 'all';
        const user = Store.auth.getCurrentUser();
        if (!user) return;

        const loadFeed = (priorityFilter = 'all') => {
            activePriorityFilter = priorityFilter;
            const integrations = Store.integrations.get();
            const feedItems = Store.feed.get();
            
            const filteredItems = priorityFilter === 'all' 
                ? feedItems 
                : feedItems.filter(item => item.priority === priorityFilter);

            const activeItems = filteredItems.filter(item => !item.resolved);
            const resolvedItems = filteredItems.filter(item => item.resolved);

            // Compute active nodes for telemetry
            const connectedCount = Object.values(integrations).filter(v => v === true).length;
            const noAppsConnected = connectedCount === 0;
            const threatStatus = activeItems.some(i => i.priority === 'high') ? 'CRITICAL BLOCKS DETECTED' : 'STABLE';

            container.innerHTML = `
                <div class="feed-layout animate-slide-up">
                    
                    <div class="feed-sidebar">
                        <!-- JARVIS Holographic Core Panel -->
                        <div class="glass-card" style="padding: 1.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: visible;">
                            <span style="font-family: 'Orbitron', sans-serif; font-size: 0.75rem; letter-spacing: 0.1em; color: hsla(var(--primary), 1); margin-bottom: 0.5rem;">JARVIS INTEGRATION GRID</span>
                            
                            <!-- 3D Viewport inside Feed -->
                            <div class="orbit-viewport" style="height: 320px; margin: 0.5rem 0;">
                                <div class="hud-telemetry tl">SYS STATUS: SCANNING</div>
                                <div class="hud-telemetry tr">ACTIVE NODES: ${connectedCount}/10</div>
                                <div class="hud-telemetry bl">THREAT: ${threatStatus}</div>
                                <div class="hud-telemetry br">CORE SYNC: ${Math.round(connectedCount / 10 * 100)}%</div>

                                <!-- Central Pulsing Core -->
                                <div class="jarvis-orb">
                                    <div class="orb-core"></div>
                                    <div class="orb-ring-1"></div>
                                    <div class="orb-ring-2"></div>
                                    <div class="orb-ring-3"></div>
                                </div>

                                <!-- Atomic Orbit Rings (3D Electron Orbits) -->
                                <div id="feed-orbit-carousel">
                                    <!-- RING 1 -->
                                    <div class="electron-ring ring-1">
                                        <div class="electron-node orbit-node slack ${integrations.slack ? 'connected' : 'disconnected'}" style="--orbit-speed: 10s; --delay: 0s;" data-id="slack">
                                            <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/slack/4A154B" alt="Slack"></div>
                                        </div>
                                        <div class="electron-node orbit-node figma ${integrations.figma ? 'connected' : 'disconnected'}" style="--orbit-speed: 10s; --delay: -2.5s;" data-id="figma">
                                            <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/figma/F24E1E" alt="Figma"></div>
                                        </div>
                                        <div class="electron-node orbit-node notion ${integrations.notion ? 'connected' : 'disconnected'}" style="--orbit-speed: 10s; --delay: -5s;" data-id="notion">
                                            <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/notion/FFFFFF" alt="Notion"></div>
                                        </div>
                                        <div class="electron-node orbit-node jira ${integrations.jira ? 'connected' : 'disconnected'}" style="--orbit-speed: 10s; --delay: -7.5s;" data-id="jira">
                                            <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/jira/0052CC" alt="Jira"></div>
                                        </div>
                                    </div>

                                    <!-- RING 2 -->
                                    <div class="electron-ring ring-2">
                                        <div class="electron-node orbit-node email ${integrations.email ? 'connected' : 'disconnected'}" style="--orbit-speed: 14s; --delay: 0s;" data-id="email">
                                            <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/gmail/EA4335" alt="Gmail"></div>
                                        </div>
                                        <div class="electron-node orbit-node whatsapp ${integrations.whatsapp ? 'connected' : 'disconnected'}" style="--orbit-speed: 14s; --delay: -4.67s;" data-id="whatsapp">
                                            <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/whatsapp/25D366" alt="WhatsApp"></div>
                                        </div>
                                        <div class="electron-node orbit-node github ${integrations.github ? 'connected' : 'disconnected'}" style="--orbit-speed: 14s; --delay: -9.33s;" data-id="github">
                                            <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/github/FFFFFF" alt="GitHub"></div>
                                        </div>
                                    </div>

                                    <!-- RING 3 -->
                                    <div class="electron-ring ring-3">
                                        <div class="electron-node orbit-node trello ${integrations.trello ? 'connected' : 'disconnected'}" style="--orbit-speed: 18s; --delay: 0s;" data-id="trello">
                                            <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/trello/0052CC" alt="Trello"></div>
                                        </div>
                                        <div class="electron-node orbit-node zoom ${integrations.zoom ? 'connected' : 'disconnected'}" style="--orbit-speed: 18s; --delay: -6s;" data-id="zoom">
                                            <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/zoom/2D8CFF" alt="Zoom"></div>
                                        </div>
                                        <div class="electron-node orbit-node googledrive ${integrations.googledrive ? 'connected' : 'disconnected'}" style="--orbit-speed: 18s; --delay: -12s;" data-id="googledrive">
                                            <div class="orbit-node-inner"><img src="https://cdn.simpleicons.org/googledrive/FFFFFF" alt="Google Drive"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="font-size: 0.78rem; font-family: 'Orbitron', sans-serif; color: var(--text-muted); text-align: center; margin-top: 0.25rem;">
                                Click orbit nodes to manage authorization parameters in the Integrations grid.
                            </div>
                        </div>
                    </div>

                    <div class="feed-main-content">
                        <!-- Post Team Update Composer -->
                        <div class="glass-card" style="padding: 1.5rem;">
                            <h4 style="font-family: 'Orbitron', sans-serif; font-size: 0.85rem; color: #fff; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="lucide-icon" data-lucide="share-2" style="width: 14px; height: 14px; color: hsla(var(--primary), 1);"></i>
                                BROADCAST WORK UPDATE
                            </h4>
                            <form id="form-share-update" style="display: flex; gap: 0.75rem;">
                                <input type="text" id="input-update-text" placeholder="Share completed tasks, blockers, or design links with your team..." required style="flex-grow: 1; background: rgba(0, 240, 255, 0.02); border: 1px solid var(--border-color); padding: 0.6rem 1rem; color: #fff; outline: none; font-family: var(--font-primary); font-size: 0.85rem;">
                                <button type="submit" class="glow-btn" style="padding: 0.6rem 1.25rem; font-size: 0.8rem; border: none; flex-shrink: 0;">Broadcast</button>
                            </form>
                        </div>

                        <!-- Filters & Stats -->
                        <div class="feed-filters" style="margin-top: 1rem;">
                            <div class="filter-pills">
                                <button class="filter-btn ${priorityFilter === 'all' ? 'active' : ''}" data-filter="all">All Diagnostics</button>
                                <button class="filter-btn ${priorityFilter === 'high' ? 'active' : ''}" data-filter="high">High Blocks</button>
                                <button class="filter-btn ${priorityFilter === 'medium' ? 'active' : ''}" data-filter="medium">Medium Advisories</button>
                                <button class="filter-btn ${priorityFilter === 'low' ? 'active' : ''}" data-filter="low">Low Logs</button>
                            </div>
                            <div style="font-family: 'Orbitron', sans-serif; font-size: 0.78rem; color: var(--text-muted);">
                                SYS_ALERTS: ${activeItems.length} ACTIVE // ${resolvedItems.length} ARCHIVED
                            </div>
                        </div>

                        <!-- Feed List -->
                        <div class="feed-cards-list">
                            ${noAppsConnected && activeItems.length === 0 ? `
                                <div class="glass-card" style="padding: 3rem; text-align: center; color: var(--text-secondary); border: 1px dashed rgba(0, 240, 255, 0.25);">
                                    <i class="lucide-icon" data-lucide="plug-zap" style="width: 44px; height: 44px; color: hsla(var(--primary), 0.6); margin-bottom: 1rem;"></i>
                                    <h3 style="font-family: 'Orbitron', sans-serif; color: hsla(var(--primary), 1); font-size: 1rem;">NO INTEGRATIONS ONLINE</h3>
                                    <p style="margin-top: 0.5rem; font-size: 0.85rem; max-width: 400px; margin-inline: auto;">Connect your workplace apps in the <strong>Integrations</strong> panel to activate the JARVIS Priority Feed. No data will be shown until you authorize at least one source.</p>
                                    <button class="glow-btn" id="btn-go-integrations" style="margin-top: 1.25rem; padding: 0.5rem 1.25rem; font-size: 0.78rem; border: none;">OPEN INTEGRATIONS</button>
                                </div>
                            ` : activeItems.length === 0 && resolvedItems.length === 0 ? `
                                <div class="glass-card" style="padding: 3rem; text-align: center; color: var(--text-secondary);">
                                    <i class="lucide-icon" data-lucide="check-circle" style="width: 40px; height: 40px; color: hsla(var(--success), 1); margin-bottom: 1rem;"></i>
                                    <h3 style="font-family: 'Orbitron', sans-serif;">INTEGRITY COCKPIT STABLE</h3>
                                    <p style="margin-top: 0.5rem; font-size: 0.9rem;">All connected streams are clean. 0 warnings logged.</p>
                                </div>
                            ` : ''}

                            <!-- Active items -->
                            ${activeItems.map(item => renderFeedCard(item)).join('')}

                            <!-- Resolved items separator -->
                            ${resolvedItems.length > 0 ? `
                                <div style="margin: 2rem 0 1rem 0; border-bottom: 1px solid rgba(0, 240, 255, 0.1); padding-bottom: 0.5rem;">
                                    <span style="font-family: 'Orbitron', sans-serif; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em;">SYSTEM LOG ARCHIVE</span>
                                </div>
                                ${resolvedItems.map(item => renderFeedCard(item)).join('')}
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;

            if ((window as any).lucide) (window as any).lucide.createIcons();
            setupEventListeners();
        };

        const renderFeedCard = (item) => {
            const iconMap = {
                slack: 'message-square',
                figma: 'figma',
                notion: 'file-text',
                jira: 'git-pull-request',
                email: 'mail',
                whatsapp: 'message-circle',
                team: 'share-2'
            };

            // escape text fields to guarantee complete security against XSS
            const cleanTitle = escapeHTML(item.title);
            const cleanSnippet = escapeHTML(item.snippet);
            const cleanSynthesis = escapeHTML(item.aiSynthesis);
            const cleanActionLabel = escapeHTML(item.actionLabel);

            return `
                <div class="glass-card feed-item-card ${item.source} ${item.resolved ? 'resolved' : ''}" data-id="${item.id}">
                    <div class="feed-item-source">
                        <i class="lucide-icon" data-lucide="${iconMap[item.source] || 'bell'}"></i>
                    </div>
                    <div class="feed-item-content">
                        <div class="feed-item-meta">
                            <span class="source-label">${item.source}</span>
                            <span class="time-label" title="${formatFullDate(item.createdAt)}">
                                <i class="lucide-icon" data-lucide="clock" style="width:10px;height:10px;margin-right:3px;vertical-align:-1px;"></i>${formatTimeAgo(item.createdAt)}
                            </span>
                            <span class="priority-badge ${item.priority}">${item.priority}</span>
                        </div>
                        <h4 class="feed-item-title">${cleanTitle}</h4>
                        <p class="feed-item-snippet">${cleanSnippet}</p>
                        
                        ${!item.resolved ? `
                            <div class="ai-synthesis-box">
                                <h5><i class="lucide-icon" data-lucide="sparkles" style="width: 12px; height: 12px;"></i> JARVIS Core Synthesis</h5>
                                <p>${cleanSynthesis}</p>
                            </div>
                        ` : ''}

                        <div class="feed-actions">
                            ${cleanActionLabel && cleanActionLabel !== 'none' ? `<button class="btn-action primary btn-special" data-type="${item.actionType}">${cleanActionLabel}</button>` : ''}
                            <button class="btn-action btn-resolve">Dismiss Alert</button>
                        </div>
                    </div>
                </div>
            `;
        };

        const setupEventListeners = () => {
            // Broadcast Form submit
            const broadcastForm = document.getElementById('form-share-update');
            if (broadcastForm) {
                broadcastForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const text = (document.getElementById('input-update-text') as any).value;
                    if (!text.trim()) return;

                    Store.feed.add({
                        title: `${escapeHTML(user.name)} shared an update`,
                        snippet: text,
                        priority: 'low',
                        aiSynthesis: 'Broadcasted telemetry status directly to teammate dashboards.',
                        actionType: 'none',
                        actionLabel: 'none'
                    });

                    (document.getElementById('input-update-text') as any).value = '';
                    loadFeed(activePriorityFilter);
                });
            }

            // Filters
            container.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    loadFeed((btn as any).dataset.filter);
                });
            });

            // "Open Integrations" CTA button in empty state
            const goIntBtn = container.querySelector('#btn-go-integrations');
            if (goIntBtn) {
                goIntBtn.addEventListener('click', () => navigateToTab('integrations'));
            }

            // Orbit Node clicks navigate to Integrations if disconnected, or filter feed if connected
            container.querySelectorAll('.orbit-node').forEach((node: any) => {
                node.addEventListener('click', () => {
                    const source = node.dataset.id;
                    const integrations = Store.integrations.get();
                    
                    if (!integrations[source]) {
                        navigateToTab('integrations');
                    } else {
                        // Filter the feed by the selected integration source
                        document.querySelectorAll('.feed-item-card').forEach((card: any) => {
                            if(card.classList.contains(source)) {
                                card.style.display = 'flex';
                            } else {
                                card.style.display = 'none';
                            }
                        });
                        
                        // Highlight the active node visually
                        container.querySelectorAll('.orbit-node').forEach((n: any) => n.style.opacity = '0.3');
                        node.style.opacity = '1';
                    }
                });
            });
            
            // Clicking any main filter button resets the orb source filter
            container.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    container.querySelectorAll('.orbit-node').forEach((n: any) => n.style.opacity = '1');
                    // loadFeed handles the rest
                });
            });

            // Dismiss alert Action
            container.querySelectorAll('.btn-resolve').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = (e.target as any).closest('.feed-item-card').dataset.id;
                    Store.feed.resolve(id);
                    loadFeed(activePriorityFilter);
                });
            });

            // Dedicated target Actions
            container.querySelectorAll('.btn-special').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const card = (e.target as any).closest('.feed-item-card');
                    const id = card.dataset.id;
                    const type = (btn as any).dataset.type;

                    if (type === 'create_jira_task') {
                        Store.tasks.add({
                            title: 'Implement Checkout Screen Apple Pay express integration',
                            assignee: 'Sarah M.',
                            source: 'Figma Feedback Alert',
                            dueDate: 'June 5, 2026'
                        });
                        Store.feed.resolve(id);
                        navigateToTab('tasks');
                    } 
                    else if (type === 'view_wiki_hack') {
                        navigateToTab('wiki', 'legacy partner bank');
                    }
                    else if (type === 'create_task') {
                        Store.tasks.add({
                            title: 'Upgrade Stripe Webhook API version to 2024-04-30',
                            assignee: 'Dave K.',
                            source: 'Stripe API Email warning',
                            dueDate: 'June 30, 2026'
                        });
                        Store.feed.resolve(id);
                        navigateToTab('tasks');
                    }
                    else if (type === 'ping_infra') {
                        Store.tasks.ping('task-3');
                        Store.feed.resolve(id);
                        navigateToTab('tasks');
                    }
                    else {
                        Store.feed.resolve(id);
                        loadFeed(activePriorityFilter);
                    }
                });
            });
        };

        loadFeed('all');
    }
};
