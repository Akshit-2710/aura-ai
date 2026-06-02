import { Store } from '../utils/store.js';

export const IntegrationsComponent = {
    render: (container, onUpdate) => {
        let integrations = Store.integrations.get();

        const loadIntegrations = () => {
            integrations = Store.integrations.get();

            container.innerHTML = `
                <div class="integrations-layout animate-slide-up">
                    <p style="font-size: 0.95rem; color: var(--text-secondary); max-width: 650px; margin-bottom: 1rem;">
                        Connect your daily communication and collaboration tools. Aura operates ambiently, extracting context, decisions, and follow-ups without interrupting your focus.
                    </p>
                    
                    <div class="integrations-grid">
                        <!-- SLACK -->
                        ${renderIntegrationCard(
                            'slack',
                            'Slack',
                            'E01E5A',
                            'Monitors public channels for production logs, Sentry notices, and explicit action requests.',
                            integrations.slack
                        )}
                        
                        <!-- FIGMA -->
                        ${renderIntegrationCard(
                            'figma',
                            'Figma',
                            'F24E1E',
                            'Observes document canvas comments, design changes, and client feedback markers.',
                            integrations.figma
                        )}
                        
                        <!-- NOTION -->
                        ${renderIntegrationCard(
                            'notion',
                            'Notion',
                            'FFFFFF',
                            'Scans team wiki revisions, technical specification updates, and project task backlogs.',
                            integrations.notion
                        )}
                        
                        <!-- JIRA -->
                        ${renderIntegrationCard(
                            'jira',
                            'Jira',
                            '0052CC',
                            'Tracks sprint tickets, blocked items, assignee changes, and development epics.',
                            integrations.jira
                        )}
                        
                        <!-- GMAIL -->
                        ${renderIntegrationCard(
                            'gmail',
                            'Google Workspace',
                            'EA4335',
                            'Triages inbound client requests, webhook warning flags, and third-party API deprecations.',
                            integrations.email
                        )}
                        
                        <!-- WHATSAPP -->
                        ${renderIntegrationCard(
                            'whatsapp',
                            'WhatsApp',
                            '25D366',
                            'Syncs notification indicators, group alerts, and remote standups.',
                            integrations.whatsapp
                        )}
                        
                        <!-- GITHUB -->
                        ${renderIntegrationCard(
                            'github',
                            'GitHub',
                            'FFFFFF',
                            'Tracks pull requests, code reviews, and repository issues natively.',
                            integrations.github
                        )}
                        
                        <!-- TRELLO -->
                        ${renderIntegrationCard(
                            'trello',
                            'Trello',
                            '0052CC',
                            'Watches card movements, attachments, and due date changes across boards.',
                            integrations.trello
                        )}
                        
                        <!-- ZOOM -->
                        ${renderIntegrationCard(
                            'zoom',
                            'Zoom',
                            '2D8CFF',
                            'Transcribes cloud meetings and summarizes action items directly to tasks.',
                            integrations.zoom
                        )}
                        
                        <!-- GOOGLE DRIVE -->
                        ${renderIntegrationCard(
                            'googledrive',
                            'Google Drive',
                            'FFFFFF',
                            'Scans shared folders for document edits and slide presentation updates.',
                            integrations.googledrive
                        )}
                    </div>
                </div>

                <!-- OAuth Consent Simulator Modal -->
                <div class="modal-overlay" id="oauth-modal" style="display: none;">
                    <div class="modal-content animate-slide-up" style="max-width: 400px; text-align: center;">
                        <div class="logo-container" style="justify-content: center; margin-bottom: 1.5rem;">
                            <div class="logo-icon" id="oauth-app-logo"></div>
                            <span style="font-size: 1.25rem;">Authorize Connection</span>
                        </div>
                        <h3 id="oauth-title" style="font-size: 1.25rem; margin-bottom: 0.75rem;">Aura requests access</h3>
                        <p id="oauth-description" style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
                            By authorizing, you permit Aura AI to sync messages, files, comments, and task logs to compile your ambient dashboard.
                        </p>
                        
                        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; text-align: left; font-size: 0.8rem; display: flex; flex-direction: column; gap: 0.5rem;">
                            <span style="font-weight: 700; color: #fff;">Requested Permissions:</span>
                            <span>• Read profile and channel history</span>
                            <span>• Sync document comments and annotations</span>
                            <span>• Edit webhook event logs</span>
                        </div>

                        <div style="display: flex; gap: 0.75rem;">
                            <button class="btn-secondary" id="oauth-cancel-btn" style="flex: 1; padding: 0.6rem;">Cancel</button>
                            <button class="glow-btn" id="oauth-authorize-btn" style="flex: 1; padding: 0.6rem; border: none;">Authorize Access</button>
                        </div>
                    </div>
                </div>
            `;

            if ((window as any).lucide) (window as any).lucide.createIcons();
            setupEventListeners();
        };

        const renderIntegrationCard = (id, name, color, desc, isConnected) => {
            // handle the mapping for 'email' to 'gmail' icon
            const internalId = id === 'gmail' ? 'email' : id;
            return `
                <div class="glass-card integration-card ${internalId}">
                    <div class="integration-card-header">
                        <div class="integration-icon">
                            <img src="https://cdn.simpleicons.org/${id}/${color}" width="22" height="22" style="filter: drop-shadow(0 0 5px #${color}50);" />
                        </div>
                        <span class="integration-status-pill ${isConnected ? 'connected' : 'disconnected'}">
                            ${isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                        </span>
                    </div>
                    <div class="integration-info">
                        <h4>${name}</h4>
                        <p>${desc}</p>
                    </div>
                    <button class="integration-button ${isConnected ? 'disconnect' : 'connect'}" data-id="${internalId}">
                        ${isConnected ? 'Disconnect Integration' : 'Connect Workspace'}
                    </button>
                </div>
            `;
        };

        const setupEventListeners = () => {
            const modal = document.getElementById('oauth-modal');
            const authBtn = document.getElementById('oauth-authorize-btn');
            const cancelBtn = document.getElementById('oauth-cancel-btn');
            let pendingIntegrationId = null;

            container.querySelectorAll('.integration-button').forEach((btn: any) => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.id;
                    const isConnected = integrations[id];

                    if (isConnected) {
                        // Directly disconnect
                        Store.integrations.toggle(id);
                        loadIntegrations();
                        onUpdate();
                    } else {
                        // Show consent dialog
                        pendingIntegrationId = id;
                        
                        // Customizing modal title based on selected integration
                        const names = {
                            slack: 'Slack API Workspace',
                            figma: 'Figma Design Files',
                            notion: 'Notion Team Wiki',
                            jira: 'Jira Software Projects',
                            email: 'Google Workspace Cloud',
                            whatsapp: 'WhatsApp Business / Groups',
                            github: 'GitHub Organizations',
                            trello: 'Trello Boards',
                            zoom: 'Zoom Video Communications',
                            googledrive: 'Google Drive Files'
                        };
                        document.getElementById('oauth-title').textContent = `Connect to ${names[id] || id}`;
                        
                        if (modal) modal.style.display = 'flex';
                    }
                });
            });

            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    if (modal) modal.style.display = 'none';
                    pendingIntegrationId = null;
                });
            }

            if (authBtn) {
                authBtn.addEventListener('click', () => {
                    if (pendingIntegrationId) {
                        Store.integrations.toggle(pendingIntegrationId);
                        if (modal) modal.style.display = 'none';
                        pendingIntegrationId = null;
                        loadIntegrations();
                        onUpdate();
                    }
                });
            }

            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    if (modal) modal.style.display = 'none';
                    pendingIntegrationId = null;
                }
            });
        };

        loadIntegrations();
    }
};
