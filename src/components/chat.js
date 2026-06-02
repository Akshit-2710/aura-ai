import { Store, escapeHTML } from '../utils/store.js';

export const ChatComponent = {
    render: (container, initialInput = '') => {
        let activeRoom = localStorage.getItem('aura_active_room') || 'jarvis_core';
        const user = Store.auth.getCurrentUser();
        if (!user) return;

        const getDMId = (email1, email2) => {
            return [email1, email2].sort().join('_dm_');
        };

        const renderChat = () => {
            const teammates = Store.auth.getTeamMembers();
            const teamCode = Store.auth.getTeamCode();
            const messages = Store.messages.get(activeRoom);

            // Determine active room header details
            let roomTitle = 'JARVIS Core';
            let roomSubtitle = 'SYS STATUS: STANDBY';
            let isJarvis = activeRoom === 'jarvis_core';

            if (!isJarvis) {
                if (activeRoom.endsWith('_general')) {
                    roomTitle = '# general';
                    roomSubtitle = 'TEAM DISCUSSIONS CHANNEL';
                } else if (activeRoom.endsWith('_engineering')) {
                    roomTitle = '# engineering';
                    roomSubtitle = 'DEVELOPMENT & LOGS ARCHIVE';
                } else {
                    // DM
                    const parts = activeRoom.split('_dm_');
                    const targetEmail = parts[0] === user.email ? parts[1] : parts[0];
                    const teammate = teammates.find(t => t.email === targetEmail);
                    roomTitle = teammate ? teammate.name : 'Teammate';
                    roomSubtitle = teammate ? teammate.role.toUpperCase() : 'MEMBER';
                }
            }

            container.innerHTML = `
                <div class="chat-layout animate-slide-up" style="border-color: rgba(0, 240, 255, 0.15);">
                    <!-- Sidebar Column -->
                    <div class="chat-sidebar" style="border-right: 1px solid rgba(0, 240, 255, 0.15); display: flex; flex-direction: column; width: 240px; background: rgba(2, 4, 10, 0.5); flex-shrink: 0;">
                        <!-- Team Header -->
                        <div style="padding: 1.25rem 1rem; border-bottom: 1px solid rgba(0, 240, 255, 0.15); display: flex; flex-direction: column; gap: 0.25rem;">
                            <span style="font-family: 'Orbitron', sans-serif; font-size: 0.85rem; font-weight: 700; color: #fff; text-shadow: 0 0 10px rgba(0, 240, 255, 0.3); text-transform: uppercase;">\${escapeHTML(user.teamName)}</span>
                            <span style="font-family: 'Orbitron', sans-serif; font-size: 0.65rem; color: var(--text-muted); letter-spacing: 0.05em;">JOIN CODE: \${escapeHTML(teamCode)}</span>
                        </div>

                        <!-- Sidebar Navigation Items -->
                        <div class="chat-sidebar-sections" style="flex-grow: 1; overflow-y: auto; padding: 1rem 0.5rem; display: flex; flex-direction: column; gap: 1.25rem;">
                            <!-- AI core -->
                            <div>
                                <div class="chat-sidebar-section-title" style="font-family: 'Orbitron', sans-serif; font-size: 0.65rem; color: var(--text-muted); padding: 0.25rem 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.4rem;">Aura Intelligence</div>
                                <div class="sidebar-item \${activeRoom === 'jarvis_core' ? 'active' : ''}" data-room="jarvis_core" style="padding: 0.6rem 0.75rem; display: flex; align-items: center; gap: 0.6rem; cursor: pointer; border-radius: 0; font-family: var(--font-title); font-size: 0.82rem; transition: all 0.2s;">
                                    <i class="lucide-icon" data-lucide="sparkles" style="width: 14px; height: 14px;"></i>
                                    <span>JARVIS Core (AI)</span>
                                </div>
                            </div>

                            <!-- Team channels -->
                            <div>
                                <div class="chat-sidebar-section-title" style="font-family: 'Orbitron', sans-serif; font-size: 0.65rem; color: var(--text-muted); padding: 0.25rem 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.4rem;">Team Groups</div>
                                <div class="sidebar-item \${activeRoom === \`\${user.teamId}_general\` ? 'active' : ''}" data-room="\${user.teamId}_general" style="padding: 0.6rem 0.75rem; display: flex; align-items: center; gap: 0.6rem; cursor: pointer; border-radius: 0; font-family: var(--font-title); font-size: 0.82rem; transition: all 0.2s; margin-bottom: 0.25rem;">
                                    <i class="lucide-icon" data-lucide="hash" style="width: 14px; height: 14px;"></i>
                                    <span>general</span>
                                </div>
                                <div class="sidebar-item \${activeRoom === \`\${user.teamId}_engineering\` ? 'active' : ''}" data-room="\${user.teamId}_engineering" style="padding: 0.6rem 0.75rem; display: flex; align-items: center; gap: 0.6rem; cursor: pointer; border-radius: 0; font-family: var(--font-title); font-size: 0.82rem; transition: all 0.2s;">
                                    <i class="lucide-icon" data-lucide="hash" style="width: 14px; height: 14px;"></i>
                                    <span>engineering</span>
                                </div>
                            </div>

                            <!-- Direct messages -->
                            <div>
                                <div class="chat-sidebar-section-title" style="font-family: 'Orbitron', sans-serif; font-size: 0.65rem; color: var(--text-muted); padding: 0.25rem 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.4rem;">Private DMs</div>
                                \${teammates.length === 0 ? \`
                                    <div style="font-size: 0.75rem; color: var(--text-muted); padding: 0.5rem; font-style: italic;">No other team members. Share code to join.</div>
                                \` : teammates.map(m => {
                                    const dmId = getDMId(user.email, m.email);
                                    return \`
                                        <div class="sidebar-item \${activeRoom === dmId ? 'active' : ''}" data-room="\${dmId}" style="padding: 0.6rem 0.75rem; display: flex; align-items: center; gap: 0.6rem; cursor: pointer; border-radius: 0; font-family: var(--font-primary); font-size: 0.82rem; transition: all 0.2s; margin-bottom: 0.25rem;">
                                            <span style="width: 6px; height: 6px; border-radius: 50%; background: #22c55e; display: inline-block; box-shadow: 0 0 5px #22c55e;"></span>
                                            <span style="color: #cbd5e1;">\${escapeHTML(m.name)}</span>
                                        </div>
                                    \`;
                                }).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Chat Main Console -->
                    <div class="chat-main" style="flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; background: transparent;">
                        <!-- Chat Header -->
                        <div class="chat-header">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <div class="chat-agent-avatar">
                                    <i class="lucide-icon" data-lucide="\${isJarvis ? 'sparkles' : 'users'}" style="width: 16px; height: 16px; color: #fff;"></i>
                                </div>
                                <div class="chat-agent-info">
                                    <h3>\${escapeHTML(roomTitle)}</h3>
                                    <p style="color: hsla(var(--primary), 1); font-family: 'Orbitron', sans-serif; font-size: 0.7rem; letter-spacing: 0.05em;">\${escapeHTML(roomSubtitle)}</p>
                                </div>
                            </div>
                            
                            <!-- Sci-Fi Pulsing Sound Wave -->
                            <div class="sound-wave">
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                            </div>
                        </div>

                        <!-- Messages Box -->
                        <div class="chat-messages" id="chat-messages-container">
                            <!-- Special Welcome Bubble for Jarvis/Room if empty -->
                            \${messages.length === 0 ? \`
                                <div class="message-bubble aura">
                                    <div class="msg-avatar"><i class="lucide-icon" data-lucide="sparkles" style="width: 14px; height: 14px;"></i></div>
                                    <div class="msg-content-wrapper">
                                        <span class="msg-sender-name">JARVIS Core</span>
                                        <div class="msg-text">Secure link established. Send a message to initiate tracking, update sync blocks, or query tribal knowledge notes.</div>
                                    </div>
                                </div>
                            \` : ''}

                            \${messages.map(msg => {
                                const isMe = msg.senderEmail === user.email;
                                return \`
                                    <div class="message-bubble \${isMe ? 'user' : 'aura'}">
                                        <div class="msg-avatar">
                                            \${isMe ? 'U' : '<i class="lucide-icon" data-lucide="sparkles" style="width: 14px; height: 14px;"></i>'}
                                        </div>
                                        <div class="msg-content-wrapper">
                                            <span class="msg-sender-name">\${escapeHTML(msg.senderName)}</span>
                                            <div class="msg-text">\${msg.text}</div>
                                        </div>
                                    </div>
                                \`;
                            }).join('')}

                            <!-- Typing Indicator -->
                            <div class="message-bubble aura" id="chat-typing-loader" style="display: none;">
                                <div class="msg-avatar"><i class="lucide-icon" data-lucide="sparkles" style="width: 14px; height: 14px;"></i></div>
                                <div class="msg-content-wrapper">
                                    <span class="msg-sender-name">Typing...</span>
                                    <div class="msg-text" style="padding: 0.5rem 1rem;">
                                        <div class="chat-typing-indicator">
                                            <div class="typing-dot"></div>
                                            <div class="typing-dot"></div>
                                            <div class="typing-dot"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Chat Inputs -->
                        <div class="chat-input-area" style="background: rgba(2, 4, 10, 0.95); border-top: 1px solid rgba(0, 240, 255, 0.15);">
                            \${isJarvis ? \`
                                <div class="suggestion-chips">
                                    <button class="chip-btn" data-query="Summarize my active priorities">Summarize priorities</button>
                                    <button class="chip-btn" data-query="What decisions were made recently?">Recent decisions</button>
                                    <button class="chip-btn" data-query="Tell me about the bank rate limit delay hack">Explain bank delay hack</button>
                                    <button class="chip-btn" data-query="Check overdue tasks">Check overdue tasks</button>
                                </div>
                            \` : ''}
                            
                            <form class="chat-form" id="chat-submit-form">
                                <div class="chat-input-wrapper">
                                    <input type="text" id="chat-user-input" placeholder="\${isJarvis ? 'Ask JARVIS to search specs, trace alerts, or summarize wiki...' : 'Send secure message to room teammates...'}" autocomplete="off">
                                </div>
                                <button type="submit" class="btn-send">
                                    <i class="lucide-icon" data-lucide="send" style="width: 18px; height: 18px;"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            `;

            // eslint-disable-next-line
            if (window.lucide) window.lucide.createIcons();
            setupEventListeners();
            scrollToBottom();
        };

        const scrollToBottom = () => {
            const scrollContainer = document.getElementById('chat-messages-container');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        };

        const handleUserMessage = (text) => {
            if (!text.trim()) return;

            // Send message to store
            Store.messages.send(activeRoom, text, user.email, user.name);

            // Pulse wave bars dramatically
            const waveBars = container.querySelectorAll('.wave-bar');
            waveBars.forEach(bar => {
                bar.style.animationDuration = '0.4s';
            });

            // Show typing indicator for response simulation
            const loader = document.getElementById('chat-typing-loader');
            if (loader) loader.style.display = 'flex';
            scrollToBottom();
        };

        const setupEventListeners = () => {
            const form = document.getElementById('chat-submit-form');
            const input = document.getElementById('chat-user-input');

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                handleUserMessage(input.value);
                input.value = '';
            });

            // Suggestion chips inside Jarvis core
            container.querySelectorAll('.chip-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    handleUserMessage(btn.dataset.query);
                });
            });

            // Sidebar item selectors to switch channels/rooms
            container.querySelectorAll('.sidebar-item').forEach(item => {
                item.addEventListener('click', () => {
                    activeRoom = item.dataset.room;
                    localStorage.setItem('aura_active_room', activeRoom);
                    renderChat();
                });
            });
        };

        // Listen for new messages (simulated replies) and re-render if visible
        const onNewMessage = (e) => {
            if (e.detail.roomId === activeRoom) {
                // Re-render
                renderChat();
            }
        };
        window.addEventListener('aura_new_message', onNewMessage as any);

        // Save cleanup callback to avoid memory leaks
        container.addEventListener('DOMNodeRemovedFromDocument', () => {
            window.removeEventListener('aura_new_message', onNewMessage as any);
        });

        renderChat();

        if (initialInput) {
            handleUserMessage(initialInput);
        }
    }
};
