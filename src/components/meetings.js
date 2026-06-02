import { Store } from '../utils/store.js';

export const MeetingsComponent = {
    render: (container) => {
        let meetings = Store.meetings.get();
        let selectedMeetingId = meetings[0]?.id || null;

        const loadMeetings = () => {
            meetings = Store.meetings.get();
            const selectedMeeting = meetings.find(m => m.id === selectedMeetingId) || meetings[0];
            selectedMeetingId = selectedMeeting?.id || null;

            container.innerHTML = `
                <div class="meetings-layout animate-slide-up">
                    <!-- Left: Meeting List -->
                    <div style="display: flex; flex-direction: column; gap: 1rem; height: 100%;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h3 style="font-size: 1rem; color: var(--text-muted); text-transform: uppercase;">Recent Synchronizations</h3>
                            <button class="glow-btn" id="btn-add-meeting" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; display: flex; align-items: center; gap: 0.3rem;">
                                <i class="lucide-icon" data-lucide="plus" style="width: 14px; height: 14px;"></i> Ingest Audio
                            </button>
                        </div>
                        <div class="meetings-list-container" id="meetings-list">
                            \${meetings.length === 0 ? \`
                                <div class="glass-card" style="padding: 2rem; text-align: center; color: var(--text-secondary); border: 1px dashed rgba(0, 240, 255, 0.2);">
                                    <i class="lucide-icon" data-lucide="mic-off" style="width: 36px; height: 36px; color: hsla(var(--primary), 0.5); margin-bottom: 0.75rem;"></i>
                                    <h4 style="font-family: 'Orbitron', sans-serif; font-size: 0.85rem; color: hsla(var(--primary), 1); margin-bottom: 0.5rem;">NO SYNCS RECORDED</h4>
                                    <p style="font-size: 0.8rem; max-width: 280px; margin-inline: auto;">Click <strong>Ingest Audio</strong> above to record your first meeting. JARVIS will extract decisions, action items, and assignments automatically.</p>
                                </div>
                            \` : meetings.map(m => \`
                                <div class="glass-card meeting-list-card \${m.id === selectedMeetingId ? 'active' : ''}" data-id="\${m.id}">
                                    <span class="meeting-date">\${m.date} • \${m.duration}</span>
                                    <h4 class="meeting-title">\${m.title}</h4>
                                    <div class="meeting-attendees">
                                        \${m.attendees.map(a => \`<div class="attendee-avatar">\${a}</div>\`).join('')}
                                    </div>
                                </div>
                            \`).join('')}
                        </div>
                    </div>

                    <!-- Right: Meeting Details -->
                    <div class="glass-card" style="padding: 2rem; overflow: hidden;" id="meeting-details-panel">
                        \${selectedMeeting ? renderMeetingDetails(selectedMeeting) : \`
                            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-secondary);">
                                Select a meeting to view transcripts and automated decisions.
                            </div>
                        \`}
                    </div>
                </div>

                <!-- Add Meeting Modal -->
                <div class="modal-overlay" id="add-meeting-modal" style="display: none;">
                    <div class="modal-content animate-slide-up">
                        <button class="modal-close" id="modal-close-btn">&times;</button>
                        <h3 class="modal-title">Ingest Audio / Transcript</h3>
                        <form id="add-meeting-form" style="display: flex; flex-direction: column; gap: 1rem;">
                            <div class="form-group">
                                <label for="m-title">Meeting Title</label>
                                <input type="text" id="m-title" placeholder="Client Check-In / Sprint Alignment" required>
                            </div>
                            <div class="form-group">
                                <label for="m-attendees">Attendees (Initials comma-separated)</label>
                                <input type="text" id="m-attendees" placeholder="AJ, SM, DK" required>
                            </div>
                            <div class="form-group">
                                <label for="m-transcript">Raw Transcript (AI will extract decisions and actions)</label>
                                <textarea id="m-transcript" rows="6" style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem; color: white; outline: none; font-family: var(--font-primary); resize: vertical;" placeholder="Paste meeting transcript here..." required></textarea>
                            </div>
                            <button type="submit" class="glow-btn" style="border: none; margin-top: 1rem;">Process Audio Track</button>
                        </form>
                    </div>
                </div>
            `;

            if ((window as any).lucide) (window as any).lucide.createIcons();
            setupEventListeners();
        };

        const renderMeetingDetails = (m) => {
            return `
                <div class="meeting-detail-container">
                    <div class="meeting-detail-header">
                        <h2>\${m.title}</h2>
                        <div class="meeting-meta-grid">
                            <span><i class="lucide-icon" data-lucide="calendar" style="width: 16px; height: 16px;"></i> \${m.date}</span>
                            <span><i class="lucide-icon" data-lucide="clock" style="width: 16px; height: 16px;"></i> \${m.duration}</span>
                            <span><i class="lucide-icon" data-lucide="users" style="width: 16px; height: 16px;"></i> \${m.attendees.length} Attendees</span>
                        </div>
                    </div>
                    
                    <div class="meeting-detail-body">
                        <!-- AI Executive Summary -->
                        <div class="detail-section">
                            <h4><span style="color: hsla(var(--primary), 1);"><i class="lucide-icon" data-lucide="sparkles" style="width: 14px; height: 14px; margin-right: 0.25rem;"></i> Executive Summary</span></h4>
                            <p style="font-size: 0.95rem; line-height: 1.6;">\${m.summary}</p>
                        </div>
                        
                        <!-- Decisions -->
                        <div class="detail-section">
                            <h4>Decisions Documented</h4>
                            <ul class="bullet-list decisions">
                                \${m.decisions.map(dec => \`<li>\${dec}</li>\`).join('')}
                            </ul>
                        </div>
                        
                        <!-- Accountability Assignments -->
                        <div class="detail-section">
                            <h4>Accountability Loop (Synced to Board)</h4>
                            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
                                \${m.actions.map(act => \`
                                    <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); padding: 0.6rem 1rem; border-radius: 6px; border: 1px solid var(--border-color);">
                                        <span style="font-size: 0.9rem; color: #fff;">\${act.task}</span>
                                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                                            <span style="font-size: 0.75rem; background: rgba(99, 102, 241, 0.1); color: hsla(var(--primary), 1); padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 600;">ASSIGNED</span>
                                            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">\${act.assignee}</span>
                                        </div>
                                    </div>
                                \`).join('')}
                            </div>
                        </div>
                        
                        <!-- Transcript timeline -->
                        <div class="detail-section" style="padding-bottom: 2rem;">
                            <h4>Highlighted Transcript</h4>
                            <div class="transcript-timeline">
                                \${m.transcript.map(t => \`
                                    <div class="transcript-message">
                                        <div class="transcript-speaker">\${t.speaker}</div>
                                        <div class="transcript-text">\${t.text}</div>
                                    </div>
                                \`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        };

        const setupEventListeners = () => {
            // Meeting select handlers
            container.querySelectorAll('.meeting-list-card').forEach((card: any) => {
                card.addEventListener('click', () => {
                    selectedMeetingId = card.dataset.id;
                    loadMeetings();
                });
            });

            // Modal Handlers
            const modal = document.getElementById('add-meeting-modal');
            const addBtn = document.getElementById('btn-add-meeting');
            const closeBtn = document.getElementById('modal-close-btn');

            if (addBtn) addBtn.addEventListener('click', () => {
                if (modal) modal.style.display = 'flex';
            });

            if (closeBtn) closeBtn.addEventListener('click', () => {
                if (modal) modal.style.display = 'none';
            });

            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    if (modal) modal.style.display = 'none';
                }
            });

            // Form Submit
            const form = document.getElementById('add-meeting-form');
            if (form) form.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = (document.getElementById('m-title') as any).value;
                const attendeesRaw = (document.getElementById('m-attendees') as any).value;
                const transcriptRaw = (document.getElementById('m-transcript') as any).value;

                // Process input transcript into Decisions & Actions
                const attendees = attendeesRaw.split(',').map(s => s.trim().toUpperCase());
                
                // Mocking Aura AI's transcript extraction capability
                const summary = \`Discussed points in the session regarding "\${title}". The sync aligns with team priorities and outlines direct tasks for team execution.\`;
                const decisions = [
                    \`APPROVED implementation timelines outlined during the \${title} sync.\`,
                    \`DEFERRED secondary task dependencies to avoid context switching.\`
                ];
                
                // Simple regex or fallback parser to extract mentions
                // Find potential action items
                const actions = [];
                let assignee = attendees[0] || 'Team';
                
                // Very simple simulated parser
                if (transcriptRaw.toLowerCase().includes('dave') || transcriptRaw.toLowerCase().includes('dk')) {
                    actions.push({ assignee: 'Dave K.', task: \`Execute engineering requirements for \${title}\` });
                }
                if (transcriptRaw.toLowerCase().includes('sarah') || transcriptRaw.toLowerCase().includes('sm')) {
                    actions.push({ assignee: 'Sarah M.', task: \`Resolve design dependencies for \${title}\` });
                }
                
                if (actions.length === 0) {
                    actions.push({ assignee: 'Sarah M.', task: \`Review discussions and action parameters for \${title}\` });
                }

                // Parse transcript lines for display
                const lines = transcriptRaw.split('\\n').filter(l => l.trim() !== '');
                const transcript = lines.map(line => {
                    const parts = line.split(':');
                    if (parts.length > 1) {
                        return { speaker: parts[0].trim(), text: parts.slice(1).join(':').trim() };
                    }
                    return { speaker: 'Speaker', text: line.trim() };
                });

                const newMeeting = Store.meetings.add({
                    title,
                    duration: '20 mins',
                    attendees,
                    summary,
                    decisions,
                    actions,
                    transcript
                });

                selectedMeetingId = newMeeting.id;
                if (modal) modal.style.display = 'none';
                loadMeetings();
            });
        };

        loadMeetings();
    }
};
