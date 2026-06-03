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

            if ((window).lucide) (window).lucide.createIcons();
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
            const accountInput = document.getElementById('oauth-account-input');
            const accountLabel = document.getElementById('oauth-account-label');
            const permissionList = document.getElementById('oauth-permission-list');
            const description = document.getElementById('oauth-description');
            const title = document.getElementById('oauth-title');
            let pendingIntegrationId = null;
            const messageKey = '__auraIntegrationApprovalBound__';

            if (!window[messageKey]) {
                window[messageKey] = true;
                window.addEventListener('message', (event) => {
                    if (event.data?.type !== 'aura-integration-approval') return;
                    Store.integrations.toggle(event.data.id, {
                        account: event.data.account || 'Approved workspace account',
                        approvedAt: event.data.approvedAt || new Date().toISOString(),
                        provider: event.data.id
                    });
                    loadIntegrations();
                    onUpdate();
                });
            }

            const providerConfig = {
                slack: { name: 'Slack Workspace', label: 'Slack workspace or channel', placeholder: 'e.g. #prod-alerts or acme.slack.com', summary: ['Read channel activity and alert history', 'Ask before syncing logs or messages'] },
                figma: { name: 'Figma Design Files', label: 'Figma file or team', placeholder: 'e.g. design-team / figma-project', summary: ['Review file comments and design notes', 'Prompt for permission before sharing updates'] },
                notion: { name: 'Notion Team Wiki', label: 'Notion workspace or page', placeholder: 'e.g. Product Wiki / Engineering', summary: ['Read wiki and doc changes', 'Confirm access before syncing note updates'] },
                jira: { name: 'Jira Projects', label: 'Jira board or project key', placeholder: 'e.g. OPS-42 or Product Board', summary: ['Review tickets and blockers', 'Ask before copying task updates to Aura'] },
                email: { name: 'Google Workspace', label: 'Gmail account or team inbox', placeholder: 'e.g. ops@acme.com or support@acme.com', summary: ['Read inbox alerts and client requests', 'Require approval before external syncs start'] },
                whatsapp: { name: 'WhatsApp Business', label: 'WhatsApp number or group', placeholder: 'e.g. +1 555 0100 or support group', summary: ['Review alerts and group summaries', 'Confirm access before any message sync'] },
                github: { name: 'GitHub Account', label: 'GitHub username or org', placeholder: 'e.g. octocat or acme-ops', summary: ['Read pull requests and issue updates', 'Ask before importing repo activity'] },
                trello: { name: 'Trello Boards', label: 'Trello board or workspace', placeholder: 'e.g. Launch Board or Operations', summary: ['Review card movement and due dates', 'Confirm access before board sync starts'] },
                zoom: { name: 'Zoom Meetings', label: 'Zoom account or meeting host', placeholder: 'e.g. team@acme.com or Product Lead', summary: ['Summarize meeting notes and action items', 'Prompt for approval before transcript sync'] },
                googledrive: { name: 'Google Drive', label: 'Drive folder or shared workspace', placeholder: 'e.g. Shared Ops Docs or Marketing Folder', summary: ['Review shared file updates', 'Confirm access before document sync starts'] }
            };

            container.querySelectorAll('.integration-button').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.id;
                    const isConnected = integrations[id];

                    if (isConnected) {
                        Store.integrations.toggle(id);
                        loadIntegrations();
                        onUpdate();
                    } else {
                        const config = providerConfig[id] || providerConfig.email;
                        const popup = window.open('', 'aura-provider-approval', 'width=460,height=560,resizable=yes,scrollbars=yes');
                        if (!popup) {
                            alert('Please allow pop-ups to approve the provider connection.');
                            return;
                        }
                        popup.document.title = `Approve ${config.name}`;
                        popup.document.write(`
                            <!doctype html>
                            <html lang="en">
                            <head>
                              <meta charset="UTF-8" />
                              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                              <title>Approve ${config.name}</title>
                              <style>
                                body { font-family: Arial, sans-serif; margin: 0; background: linear-gradient(135deg,#07131d,#0e1e2f); color: #eff6ff; }
                                .shell { padding: 18px; display: flex; flex-direction: column; gap: 14px; }
                                .badge { display:inline-flex; align-items:center; gap:8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1.4px; color:#8ec5ff; }
                                h1 { margin: 0; font-size: 20px; line-height: 1.2; }
                                p { margin: 0; color: #dfe7ff; font-size: 13px; line-height: 1.4; }
                                label { font-size: 12px; color: #dfe7ff; font-weight: 600; }
                                input { width: 100%; box-sizing: border-box; border: 1px solid #284161; background: rgba(255,255,255,0.05); color: #fff; border-radius: 10px; padding: 10px; font-size: 13px; }
                                .card { border: 1px solid #284161; background: rgba(255,255,255,0.04); border-radius: 12px; padding: 12px; }
                                .row { display:flex; gap:10px; }
                                button { flex: 1; border-radius: 10px; padding: 10px; border: none; cursor: pointer; font-weight: 700; font-size: 13px; }
                                .secondary { background: #182738; color: #dfe7ff; }
                                .primary { background: linear-gradient(135deg,#00d4ff,#6f8cff); color:#04101b; }
                              </style>
                            </head>
                            <body>
                              <div class="shell">
                                <div class="badge">Provider approval</div>
                                <h1>Approve ${config.name} access</h1>
                                <p>This permission request comes from your provider app, not Aura, so the approval appears where you usually confirm external workspace access.</p>
                                <div class="card">
                                  <label for="provider-account">Target account</label>
                                  <input id="provider-account" placeholder="${config.placeholder}" />
                                </div>
                                <div class="card">
                                  <strong style="display:block; font-size:13px; margin-bottom:6px;">Requested permissions</strong>
                                  <div style="font-size:12px; color:#dfe7ff; line-height:1.45;">${config.summary.map(item => `• ${item}`).join('<br />')}</div>
                                </div>
                                <div class="row">
                                  <button class="secondary" id="cancel-btn" type="button">Cancel</button>
                                  <button class="primary" id="approve-btn" type="button">Allow Access</button>
                                </div>
                              </div>
                              <script>
                                const approveBtn = document.getElementById('approve-btn');
                                const cancelBtn = document.getElementById('cancel-btn');
                                approveBtn.addEventListener('click', () => {
                                  const account = document.getElementById('provider-account').value.trim() || 'Approved workspace account';
                                  window.opener.postMessage({ type: 'aura-integration-approval', id: '${id}', account, approvedAt: new Date().toISOString() }, '*');
                                  window.close();
                                });
                                cancelBtn.addEventListener('click', () => window.close());
                              </script>
                            </body>
                            </html>
                        `);
                        popup.document.close();
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




