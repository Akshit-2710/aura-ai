import { Store, escapeHTML } from '../utils/store.js';

export const WikiComponent = {
    render: (container, initialQuery = '') => {
        let searchQuery = initialQuery;
        let selectedCategory = 'all';

        const loadWiki = () => {
            const cards = Store.wiki.get(searchQuery);
            const allItems = Store.wiki.get();
            const categories = ['all', ...new Set(allItems.map(c => c.category))];
            
            const filteredCards = selectedCategory === 'all' 
                ? cards 
                : cards.filter(c => c.category === selectedCategory);

            container.innerHTML = `
                <div class="wiki-layout animate-slide-up">
                    <!-- Wiki Header Tools -->
                    <div class="wiki-header-bar">
                        <!-- XSS Protection: Escape searchQuery inside input tag attributes -->
                        <div class="wiki-search-box" style="border-color: rgba(0, 240, 255, 0.15); background: rgba(0, 240, 255, 0.02);">
                            <i class="lucide-icon" data-lucide="search" style="width: 18px; height: 18px; color: var(--text-muted);"></i>
                            <input type="text" id="wiki-search-input" placeholder="Query banking partner rate limits, auth flows, stripe, or hacks..." value="\${escapeHTML(searchQuery as any)}">
                        </div>
                        
                        <button class="glow-btn" id="btn-add-wiki" style="display: flex; align-items: center; gap: 0.5rem;">
                            <i class="lucide-icon" data-lucide="plus" style="width: 16px; height: 16px;"></i> Index New Hack
                        </button>
                    </div>

                    <!-- Category Tabs -->
                    <div class="feed-filters" style="margin-top: 0.5rem;">
                        <div class="filter-pills">
                            \${categories.map(cat => \`
                                <button class="filter-btn wiki-cat-btn \${cat === selectedCategory ? 'active' : ''}" data-category="\${cat as any}">
                                    \${escapeHTML((cat as any).toUpperCase())}
                                </button>
                            \`).join('')}
                        </div>
                    </div>

                    <!-- Wiki Grid -->
                    <div class="wiki-grid" id="wiki-grid-cards">
                        \${filteredCards.length === 0 ? \`
                            <div class="glass-card" style="grid-column: 1 / -1; padding: 4rem; text-align: center; color: var(--text-secondary);">
                                <i class="lucide-icon" data-lucide="alert-triangle" style="width: 48px; height: 48px; color: hsla(var(--warning), 1); margin-bottom: 1rem;"></i>
                                <h3 style="font-family: 'Orbitron', sans-serif;">QUERY RESULT DEVOID</h3>
                                <p style="margin-top: 0.5rem; font-size: 0.9rem;">No indexed knowledge cards match the targeting coordinates.</p>
                            </div>
                        \` : filteredCards.map(c => \`
                            <div class="glass-card wiki-card">
                                <div class="wiki-card-header">
                                    <span class="wiki-category-tag">\${escapeHTML(c.category)}</span>
                                </div>
                                <h4 style="font-family: 'Orbitron', sans-serif; font-size: 0.95rem; color:#fff;">\${escapeHTML(c.title)}</h4>
                                <p style="color: #94a3b8; font-size: 0.85rem; line-height: 1.6; margin-bottom: 1rem;">\${escapeHTML(c.description)}</p>
                                <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem;">
                                    \${c.tags.map(t => \`<span style="font-size: 0.72rem; background: rgba(0, 240, 255, 0.05); border: 1px solid rgba(0, 240, 255, 0.15); color: var(--text-muted); padding: 0.15rem 0.4rem; border-radius: 0;">#\${escapeHTML(t)}</span>\`).join('')}
                                </div>
                                <div class="wiki-card-footer">
                                    <span>UPDATED \${escapeHTML(c.updatedAt.toUpperCase())}</span>
                                    <span>BY \${escapeHTML(c.author.split(' ')[0].toUpperCase())}</span>
                                </div>
                            </div>
                        \`).join('')}
                    </div>
                </div>

                <!-- Add Wiki Modal -->
                <div class="modal-overlay" id="add-wiki-modal" style="display: none;">
                    <div class="modal-content animate-slide-up">
                        <button class="modal-close" id="wiki-modal-close-btn">&times;</button>
                        <h3 class="modal-title" style="font-family: 'Orbitron', sans-serif;">RECORD TRIBAL KNOWLEDGE</h3>
                        <form id="add-wiki-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
                            <div class="form-group">
                                <label for="w-title">SUBJECT / INDEX TITLE</label>
                                <input type="text" id="w-title" placeholder="e.g. Legacy Partner Rate Limit Delay Hack" required>
                            </div>
                            <div class="form-group">
                                <label for="w-category">CATEGORY REFERENCE</label>
                                <select id="w-category" style="background: #02050c; border: 1px solid var(--border-color); padding: 0.75rem; color: white; outline: none; font-family: var(--font-primary);">
                                    <option value="Infrastructure">Infrastructure</option>
                                    <option value="Billing">Billing</option>
                                    <option value="Security">Security</option>
                                    <option value="Product">Product</option>
                                    <option value="Onboarding">Onboarding</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="w-description">LEGACY DETAILS & WORKAROUNDS</label>
                                <textarea id="w-description" rows="5" style="background: rgba(0, 240, 255, 0.02); border: 1px solid var(--border-color); padding: 0.75rem 1rem; color: white; outline: none; font-family: var(--font-primary); resize: vertical;" placeholder="Explain the hack, why we implemented it, and what fails if modified..." required></textarea>
                            </div>
                            <div class="form-group">
                                <label for="w-tags">TAG INDEX (Comma-separated)</label>
                                <input type="text" id="w-tags" placeholder="banking, legacy, rate-limit">
                            </div>
                            <button type="submit" class="glow-btn" style="border: none; margin-top: 1rem;">PUBLISH KNOWLEDGE CARD</button>
                        </form>
                    </div>
                </div>
            `;

            if ((window as any).lucide) (window as any).lucide.createIcons();
            setupEventListeners();
        };

        const setupEventListeners = () => {
            const searchInput = document.getElementById('wiki-search-input');
            if (searchInput) searchInput.addEventListener('input', (e) => {
                searchQuery = (e.target as any).value;
                
                // Real-time filtering search query
                const cards = Store.wiki.get(searchQuery as any);
                const filteredCards = selectedCategory === 'all' 
                    ? cards 
                    : cards.filter(c => c.category === selectedCategory);
                
                const grid = document.getElementById('wiki-grid-cards');
                if (grid && filteredCards.length === 0) {
                    grid.innerHTML = `
                        <div class="glass-card" style="grid-column: 1 / -1; padding: 4rem; text-align: center; color: var(--text-secondary);">
                            <i class="lucide-icon" data-lucide="alert-triangle" style="width: 48px; height: 48px; color: hsla(var(--warning), 1); margin-bottom: 1rem;"></i>
                            <h3 style="font-family: 'Orbitron', sans-serif;">QUERY RESULT DEVOID</h3>
                            <p style="margin-top: 0.5rem; font-size: 0.9rem;">No indexed knowledge cards match the targeting coordinates.</p>
                        </div>
                    `;
                } else if (grid) {
                    grid.innerHTML = filteredCards.map(c => `
                        <div class="glass-card wiki-card">
                            <div class="wiki-card-header">
                                <span class="wiki-category-tag">\${escapeHTML(c.category)}</span>
                            </div>
                            <h4 style="font-family: 'Orbitron', sans-serif; font-size: 0.95rem; color:#fff;">\${escapeHTML(c.title)}</h4>
                            <p style="color: #94a3b8; font-size: 0.85rem; line-height: 1.6; margin-bottom: 1rem;">\${escapeHTML(c.description)}</p>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem;">
                                \${c.tags.map(t => \`<span style="font-size: 0.72rem; background: rgba(0, 240, 255, 0.05); border: 1px solid rgba(0, 240, 255, 0.15); color: var(--text-muted); padding: 0.15rem 0.4rem; border-radius: 0;">#\${escapeHTML(t)}</span>\`).join('')}
                            </div>
                            <div class="wiki-card-footer">
                                <span>UPDATED \${escapeHTML(c.updatedAt.toUpperCase())}</span>
                                <span>BY \${escapeHTML(c.author.split(' ')[0].toUpperCase())}</span>
                            </div>
                        </div>
                    `).join('');
                }
                if ((window as any).lucide) (window as any).lucide.createIcons();
            });

            // Category select
            container.querySelectorAll('.wiki-cat-btn').forEach((btn: any) => {
                btn.addEventListener('click', () => {
                    selectedCategory = btn.dataset.category;
                    loadWiki();
                });
            });

            // Modal
            const modal = document.getElementById('add-wiki-modal');
            const addBtn = document.getElementById('btn-add-wiki');
            const closeBtn = document.getElementById('wiki-modal-close-btn');

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
            const form = document.getElementById('add-wiki-form');
            if (form) form.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = (document.getElementById('w-title') as any).value;
                const category = (document.getElementById('w-category') as any).value;
                const description = (document.getElementById('w-description') as any).value;
                const tagsRaw = (document.getElementById('w-tags') as any).value;
                const tags = tagsRaw ? tagsRaw.split(',').map(s => s.trim().toLowerCase()) : [];

                const user = Store.auth.getCurrentUser();

                // Values sanitized inside Store.wiki.add via escapeHTML
                Store.wiki.add({
                    title,
                    category,
                    description,
                    tags,
                    author: \`\${user.name} (\${user.role})\`
                });

                if (modal) modal.style.display = 'none';
                loadWiki();
            });
        };

        loadWiki();
    }
};
