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
                    <div class="modal-content animate-slide-up" style="max-width: 420px; text-align: center;">
                        <div class="logo-container" style="justify-content: center; margin-bottom: 1rem;">
                            <div class="logo-icon" id="oauth-app-logo"></div>
                            <span style="font-size: 1.1rem;">Permission & Account Check</span>
                        </div>
                        <h3 id="oauth-title" style="font-size: 1.15rem; margin-bottom: 0.4rem;">Aura requests access</h3>
                        <p id="oauth-description" style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
                            Choose the account to connect and confirm the permission request before Aura can sync any workspace activity.
                        </p>

                        <label for="oauth-account-input" id="oauth-account-label" style="display:block; text-align:left; font-size: 0.82rem; color: #dfe7ff; margin-bottom: 0.35rem;">Target account</label>
                        <input id="oauth-account-input" type="text" placeholder="e.g. ops@acme.com, +1 555 0100, or github-user" style="width:100%; border:1px solid var(--border-color); background: rgba(255,255,255,0.04); color: #fff; border-radius: 10px; padding: 0.7rem 0.8rem; margin-bottom: 0.8rem; font-size: 0.88rem;" />

                        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); padding: 0.9rem; border-radius: 10px; margin-bottom: 1rem; text-align: left; font-size: 0.8rem; display: flex; flex-direction: column; gap: 0.35rem;">
                            <span style="font-weight: 700; color: #fff;">Permission summary</span>
                            <span id="oauth-permission-list">• Read the account profile and workspace activity</span>
                            <span>• Ask for explicit approval before any sync starts</span>
                            <span>• Surface updates in your Aura dashboard only after you confirm</span>
                        </div>

                        <div style="display: flex; gap: 0.75rem;">
                            <button class="btn-secondary" id="oauth-cancel-btn" style="flex: 1; padding: 0.6rem;">Cancel</button>
                            <button class="glow-btn" id="oauth-authorize-btn" style="flex: 1; padding: 0.6rem; border: none;">Approve Connection</button>
                        </div>
                    </div>
                </div>
            `;

            if ((window as any).lucide) (window as any).lucide.createIcons();
            setupEventListeners();
        };

        const renderIntegrationCard = (id, name, color, desc, isConnected) => {
            const internalId = id === 'gmail' ? 'email' : id;
            const connectionDetail = integrations?.connections?.[internalId];
            const accountLabel = connectionDetail?.account || 'Approved workspace account';
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
                        ${isConnected ? `<p style="font-size: 0.78rem; color: #9ec5ff; margin-top: 0.35rem;">Approved account: ${accountLabel}</p>` : ''}
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
            const accountInput = document.getElementById('oauth-account-input') as HTMLInputElement | null;
            const accountLabel = document.getElementById('oauth-account-label');
            const permissionList = document.getElementById('oauth-permission-list');
            const description = document.getElementById('oauth-description');
            const title = document.getElementById('oauth-title');
            let pendingIntegrationId = null;

            const providerConfig = {
                slack: {
                    name: 'Slack Workspace',
                    label: 'Slack workspace or channel',
                    placeholder: 'e.g. #prod-alerts or acme.slack.com',
                    summary: ['Read channel activity and alert history', 'Ask before syncing logs or messages']
                },
                figma: {
                    name: 'Figma Design Files',
                    label: 'Figma file or team',
                    placeholder: 'e.g. design-team / figma-project',
                    summary: ['Review file comments and design notes', 'Prompt for permission before sharing updates']
                },
                notion: {
                    name: 'Notion Team Wiki',
                    label: 'Notion workspace or page',
                    placeholder: 'e.g. Product Wiki / Engineering',
                    summary: ['Read wiki and doc changes', 'Confirm access before syncing note updates']
                },
                jira: {
                    name: 'Jira Projects',
                    label: 'Jira board or project key',
                    placeholder: 'e.g. OPS-42 or Product Board',
                    summary: ['Review tickets and blockers', 'Ask before copying task updates to Aura']
                },
                email: {
                    name: 'Google Workspace',
                    label: 'Gmail account or team inbox',
                    placeholder: 'e.g. ops@acme.com or support@acme.com',
                    summary: ['Read inbox alerts and client requests', 'Require approval before external syncs start']
                },
                whatsapp: {
                    name: 'WhatsApp Business',
                    label: 'WhatsApp number or group',
                    placeholder: 'e.g. +1 555 0100 or support group',
                    summary: ['Review alerts and group summaries', 'Confirm access before any message sync']
                },
                github: {
                    name: 'GitHub Account',
                    label: 'GitHub username or org',
                    placeholder: 'e.g. octocat or acme-ops',
                    summary: ['Read pull requests and issue updates', 'Ask before importing repo activity']
                },
                trello: {
                    name: 'Trello Boards',
                    label: 'Trello board or workspace',
                    placeholder: 'e.g. Launch Board or Operations',
                    summary: ['Review card movement and due dates', 'Confirm access before board sync starts']
                },
                zoom: {
                    name: 'Zoom Meetings',
                    label: 'Zoom account or meeting host',
                    placeholder: 'e.g. team@acme.com or Product Lead',
                    summary: ['Summarize meeting notes and action items', 'Prompt for approval before transcript sync']
                },
                googledrive: {
                    name: 'Google Drive',
                    label: 'Drive folder or shared workspace',
                    placeholder: 'e.g. Shared Ops Docs or Marketing Folder',
                    summary: ['Review shared file updates', 'Confirm access before document sync starts']
                }
            };

            container.querySelectorAll('.integration-button').forEach((btn: any) => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.id;
                    const isConnected = integrations[id];

                    if (isConnected) {
                        Store.integrations.toggle(id);
                        loadIntegrations();
                        onUpdate();
                    } else {
                        pendingIntegrationId = id;
                        const config = providerConfig[id] || providerConfig.email;
                        if (title) title.textContent = `Connect to ${config.name}`;
                        if (description) description.textContent = `Aura will ask for permission to sync ${config.name.toLowerCase()} activity only after you approve the target account below.`;
                        if (accountLabel) accountLabel.textContent = `${config.label} to connect`;
                        if (accountInput) {
                            accountInput.value = '';
                            accountInput.placeholder = config.placeholder;
                        }
                        if (permissionList) {
                            permissionList.innerHTML = config.summary.map(item => `• ${item}`).join('<br/>');
                        }
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
                        const accountValue = accountInput?.value?.trim() || 'Approved workspace account';
                        Store.integrations.toggle(pendingIntegrationId, {
                            account: accountValue,
                            approvedAt: new Date().toISOString(),
                            provider: pendingIntegrationId
                        });
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
