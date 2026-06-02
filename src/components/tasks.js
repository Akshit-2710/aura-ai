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

export const TasksComponent = {
    render: (container) => {
        const loadTasks = () => {
            const tasks = Store.tasks.get();

            const columns = {
                'todo': tasks.filter(t => t.status === 'todo'),
                'in-progress': tasks.filter(t => t.status === 'in-progress'),
                'done': tasks.filter(t => t.status === 'done')
            };

            container.innerHTML = `
                <div class="tasks-layout animate-slide-up">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
                        <p style="font-size: 0.9rem; color: #cbd5e1; max-width: 650px;">
                            Closed-Loop Accountability Board. JARVIS Core tracks milestones, schedules automated check-ins, and escalates delayed tickets in workspace channels.
                        </p>
                        <button class="glow-btn" id="btn-add-task" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                            INDEX NEW TASK
                        </button>
                    </div>

                    ${tasks.length === 0 ? `
                        <div class="glass-card" style="padding: 3rem; text-align: center; color: var(--text-secondary); border: 1px dashed rgba(0, 240, 255, 0.2); margin-top: 1.5rem;">
                            <i class="lucide-icon" data-lucide="clipboard-list" style="width: 44px; height: 44px; color: hsla(var(--primary), 0.5); margin-bottom: 1rem;"></i>
                            <h3 style="font-family: 'Orbitron', sans-serif; color: hsla(var(--primary), 1); font-size: 1rem;">NO TASKS INDEXED</h3>
                            <p style="margin-top: 0.5rem; font-size: 0.85rem; max-width: 420px; margin-inline: auto;">Tasks appear here when you take action on Priority Feed alerts, record meetings, or create them manually with <strong>INDEX NEW TASK</strong> above.</p>
                        </div>
                    ` : ''}

                    <!-- Kanban Columns -->
                    <div class="tasks-grid">
                        <!-- TO DO -->
                        <div class="tasks-column">
                            <div class="column-header">
                                <span class="column-title">PENDING TRACKING</span>
                                <span class="task-count">${columns['todo'].length}</span>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 1rem; min-height: 200px;" id="col-todo">
                                ${columns['todo'].map(t => renderTaskCard(t)).join('')}
                            </div>
                        </div>

                        <!-- IN PROGRESS -->
                        <div class="tasks-column">
                            <div class="column-header">
                                <span class="column-title">ACTIVE DEV</span>
                                <span class="task-count">${columns['in-progress'].length}</span>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 1rem; min-height: 200px;" id="col-inprogress">
                                ${columns['in-progress'].map(t => renderTaskCard(t)).join('')}
                            </div>
                        </div>

                        <!-- DONE -->
                        <div class="tasks-column">
                            <div class="column-header">
                                <span class="column-title">ARCHIVED LOGS</span>
                                <span class="task-count">${columns['done'].length}</span>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 1rem; min-height: 200px;" id="col-done">
                                ${columns['done'].map(t => renderTaskCard(t)).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Add Task Modal -->
                <div class="modal-overlay" id="add-task-modal" style="display: none;">
                    <div class="modal-content animate-slide-up">
                        <button class="modal-close" id="task-modal-close-btn">&times;</button>
                        <h3 class="modal-title" style="font-family: 'Orbitron', sans-serif;">DEPLOY CORE TASK</h3>
                        <form id="add-task-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
                            <div class="form-group">
                                <label for="t-title">ACTION ITEM / TASK SPECIFICATION</label>
                                <input type="text" id="t-title" placeholder="e.g. Implement rate limiting code revert" required>
                            </div>
                            <div class="form-group">
                                <label for="t-assignee">ASSIGNEE RESOURCE NAME</label>
                                <input type="text" id="t-assignee" placeholder="e.g. Dave K." required>
                            </div>
                            <div class="form-group">
                                <label for="t-source">ORIGIN CONTEXT</label>
                                <input type="text" id="t-source" placeholder="e.g. Sprint planning transcript" required>
                            </div>
                            <div class="form-group">
                                <label for="t-due">DEADLINE DATE TARGET</label>
                                <input type="date" id="t-due" required style="color-scheme: dark;">
                            </div>
                            <button type="submit" class="glow-btn" style="border: none; margin-top: 1rem;">DEPLOY HUD TASK</button>
                        </form>
                    </div>
                </div>
            `;

            if ((window).lucide) (window).lucide.createIcons();
            setupEventListeners();
        };

        const renderTaskCard = (t) => {
            const isOverdue = new Date(t.dueDate) < new Date() && t.status !== 'done';
            const initials = t.assignee.split(' ').map(n=>n[0]).join('');

            // Escape all variables to guarantee complete XSS protection
            const cleanTitle = escapeHTML(t.title);
            const cleanSource = escapeHTML(t.source);
            const cleanAssignee = escapeHTML(t.assignee);
            const cleanDueDate = escapeHTML(t.dueDate);

            return `
                <div class="glass-card task-card" data-id="${t.id}">
                    <div class="task-card-header">
                        <span class="task-source-icon">
                            <i class="lucide-icon" data-lucide="compass" style="width: 12px; height: 12px; margin-right: 0.25rem;"></i>
                            ${cleanSource}
                        </span>
                        
                        <!-- Status shift controls -->
                        <div>
                            <select class="task-status-select" style="background: rgba(0, 240, 255, 0.02); border: 1px solid var(--border-color); padding: 0.1rem 0.3rem; color: var(--text-muted); font-size: 0.72rem; outline: none; cursor: pointer; font-family: 'Orbitron', sans-serif;">
                                <option value="todo" style="background: #020408;" ${t.status === 'todo' ? 'selected' : ''}>PENDING</option>
                                <option value="in-progress" style="background: #020408;" ${t.status === 'in-progress' ? 'selected' : ''}>ACTIVE</option>
                                <option value="done" style="background: #020408;" ${t.status === 'done' ? 'selected' : ''}>ARCHIVED</option>
                            </select>
                        </div>
                    </div>
                    
                    <h4 style="font-size: 0.88rem; color:#fff;">${cleanTitle}</h4>
                    
                    <div class="task-assignee">
                        <div class="assignee-avatar">${escapeHTML(initials.toUpperCase())}</div>
                        <span class="assignee-name">${cleanAssignee}</span>
                    </div>

                    <!-- Due date indicator -->
                    <div class="task-footer">
                        <span class="task-due ${isOverdue ? 'overdue' : ''}">
                            <i class="lucide-icon" data-lucide="clock" style="width: 12px; height: 12px; margin-right: 0.25rem;"></i>
                            TARGET: ${cleanDueDate} ${isOverdue ? '(OVERDUE)' : ''}
                        </span>
                        ${t.createdAt ? `
                            <span style="font-size: 0.68rem; color: var(--text-muted); margin-top: 0.35rem; display: flex; align-items: center; gap: 0.25rem;">
                                <i class="lucide-icon" data-lucide="calendar-plus" style="width: 10px; height: 10px;"></i>
                                CREATED: ${formatFullDate(t.createdAt)} (${formatTimeAgo(t.createdAt)})
                            </span>
                        ` : ''}
                    </div>

                    <!-- JARVIS check-in log -->
                    ${t.pings.length > 0 ? `
                        <div class="followup-ping-log">
                            <span style="font-family: 'Orbitron', sans-serif; font-size: 0.65rem; font-weight: 700; color: hsla(var(--primary), 1); letter-spacing: 0.05em; margin-bottom: 0.25rem;">NUDGE TELEMETRY LOG</span>
                            ${t.pings.slice(-2).map(p => `
                                <div class="ping-item ${p.escalated ? 'escalated' : ''}">
                                    <i class="lucide-icon" data-lucide="${p.escalated ? 'alert-triangle' : 'message-circle'}" style="width: 10px; height: 10px;"></i>
                                    <span style="flex: 1;">${escapeHTML(p.message)}</span>
                                    <span style="font-size: 0.6rem; color: var(--text-muted); white-space: nowrap; margin-left: 0.5rem;">${formatFullDate(p.timestamp)}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    <!-- Nudge Actions -->
                    ${t.status !== 'done' ? `
                        <button class="btn-action btn-nudge" style="font-size: 0.72rem; padding: 0.35rem 0.65rem; display: flex; align-items: center; justify-content: center; gap: 0.3rem; margin-top: 0.25rem; width:100%;">
                            <i class="lucide-icon" data-lucide="bell" style="width: 12px; height: 12px;"></i> TRIGGER NUDGE NODE
                        </button>
                    ` : ''}
                </div>
            `;
        };

        const setupEventListeners = () => {
            // Status update
            container.querySelectorAll('.task-status-select').forEach(select => {
                select.addEventListener('change', (e) => {
                    const card = (e.target).closest('.task-card');
                    const id = card.dataset.id;
                    const newStatus = (e.target).value;
                    Store.tasks.updateStatus(id, newStatus);
                    loadTasks();
                });
            });

            // Nudge button
            container.querySelectorAll('.btn-nudge').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const card = (e.target).closest('.task-card');
                    const id = card.dataset.id;
                    
                    Store.tasks.ping(id);
                    
                    // Glow pulse animation
                    card.style.transform = 'scale(1.02)';
                    card.style.borderColor = 'rgba(0, 240, 255, 0.8)';
                    card.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.5)';
                    
                    (btn).disabled = true;
                    btn.innerHTML = `<i class="lucide-icon" data-lucide="check" style="width:12px;height:12px;"></i> CHANNEL PING SENT`;
                    if ((window).lucide) (window).lucide.createIcons();

                    setTimeout(() => {
                        loadTasks();
                    }, 1200);
                });
            });

            // Modal
            const modal = document.getElementById('add-task-modal');
            const addBtn = document.getElementById('btn-add-task');
            const closeBtn = document.getElementById('task-modal-close-btn');

            if (addBtn) addBtn.addEventListener('click', () => {
                if(modal) modal.style.display = 'flex';
            });

            if (closeBtn) closeBtn.addEventListener('click', () => {
                if(modal) modal.style.display = 'none';
            });

            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    if(modal) modal.style.display = 'none';
                }
            });

            // Form Submit
            const form = document.getElementById('add-task-form');
            if (form) form.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = (document.getElementById('t-title')).value;
                const assignee = (document.getElementById('t-assignee')).value;
                const source = (document.getElementById('t-source')).value;
                const dueRaw = (document.getElementById('t-due')).value;

                const dateObj = new Date(dueRaw);
                const dueDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

                Store.tasks.add({
                    title,
                    assignee,
                    source,
                    dueDate
                });

                if(modal) modal.style.display = 'none';
                loadTasks();
            });
        };

        loadTasks();
    }
};



