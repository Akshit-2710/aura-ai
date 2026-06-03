/* -------------------------------------------------------------
   AURA AI — STATE ENGINE & SECURE TEAM DATABASE (HTML ESCAPED)
------------------------------------------------------------- */

// Global Security Sanitizer for XSS Prevention
export const escapeHTML = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
};

const STORAGE_KEYS = {
    version: 'aura_data_version',
    accounts: 'aura_accounts',
    session: 'aura_session'
};

const DATA_VERSION = '5.0.0';
const storedVersion = localStorage.getItem(STORAGE_KEYS.version);
if (storedVersion !== DATA_VERSION) {
    localStorage.setItem(STORAGE_KEYS.version, DATA_VERSION);
}

const loadJSON = (key, fallback) => {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch { return fallback; }
};

const saveJSON = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const findAccount = (email) => {
    const accounts = loadJSON(STORAGE_KEYS.accounts, []);
    return accounts.find(a => a.email === escapeHTML(email));
};

const updateAccount = (account) => {
    const accounts = loadJSON(STORAGE_KEYS.accounts, []);
    const next = accounts.map(a => a.email === account.email ? account : a);
    if (!next.some(a => a.email === account.email)) {
        next.push(account);
    }
    saveJSON(STORAGE_KEYS.accounts, next);
    return account;
};

const defaultIntegrations = {
    slack: false,
    figma: false,
    notion: false,
    jira: false,
    email: false,
    whatsapp: false,
    github: false,
    trello: false,
    zoom: false,
    googledrive: false
};

const profileStoreKey = (base, profileId) => `${base}_${profileId}`;
const getCurrentProfileId = () => {
    const session = loadJSON(STORAGE_KEYS.session, null);
    return session ? session.activeProfileId : null;
};

const getProfileScopedStore = (baseKey, fallback = null) => {
    const profileId = getCurrentProfileId();
    if (!profileId) return fallback;
    return loadJSON(profileStoreKey(baseKey, profileId), fallback);
};

const saveProfileScopedStore = (baseKey, value) => {
    const profileId = getCurrentProfileId();
    if (!profileId) return;
    saveJSON(profileStoreKey(baseKey, profileId), value);
};

const createId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

const seedData = () => {
    if (!localStorage.getItem(STORAGE_KEYS.accounts)) {
        const individualProfileId = 'profile-admin-individual';
        const teamProfileId = 'profile-admin-stark';
        const accounts = [
            {
                email: 'admin@work.ai',
                password: 'password123',
                name: 'Alex Johnson',
                consent: {
                    termsAccepted: true,
                    privacyAccepted: true,
                    termsAcceptedAt: new Date().toISOString(),
                    privacyAcceptedAt: new Date().toISOString()
                },
                profiles: [
                    {
                        id: individualProfileId,
                        type: 'individual',
                        profileName: 'Alex Johnson',
                        teamName: 'Individual Workspace',
                        role: 'Product Lead',
                        bio: 'Strategic product leader focused on AI coordination and team throughput.',
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: teamProfileId,
                        type: 'team',
                        profileName: 'Stark Industries',
                        teamName: 'Stark Industries',
                        role: 'Executive Operations Team',
                        bio: 'High-velocity operations team for mission-critical integration orchestration.',
                        createdAt: new Date().toISOString()
                    }
                ],
                lastActiveProfileId: individualProfileId,
                createdAt: new Date().toISOString()
            }
        ];
        saveJSON(STORAGE_KEYS.accounts, accounts);

        saveJSON(profileStoreKey('aura_integrations', individualProfileId), defaultIntegrations);
        saveJSON(profileStoreKey('aura_integrations', teamProfileId), defaultIntegrations);

        const now = Date.now();
        const initialFeed = [
            {
                id: 'feed-1',
                source: 'figma',
                title: 'New Client Feedback on Checkout Flow',
                snippet: 'Figma comment by Sarah (Client): "We need this checkout form to support Apple Pay directly in the first modal, otherwise we will lose mobile sales. Can we change this before Friday\'s client review?"',
                createdAt: new Date(now - 15 * 60 * 1000).toISOString(),
                priority: 'high',
                resolved: false,
                aiSynthesis: 'Urgent. Affects client sign-off. Cross-referenced with Jira backlog: No billing tickets currently reflect Apple Pay requirement. Resolving this will auto-generate a Jira task and assign it to the checkout team.',
                actionType: 'create_jira_task',
                actionLabel: 'Convert to Jira Task'
            },
            {
                id: 'feed-2',
                source: 'slack',
                title: 'Production Alert: Rate Limit Triggers',
                snippet: 'Slack message in #prod-alerts from @bot-sentry: "API endpoint /v1/bank-sync is throwing 429 Too Many Requests to legacy-partner-bank. Traffic spike observed."',
                createdAt: new Date(now - 60 * 60 * 1000).toISOString(),
                priority: 'high',
                resolved: false,
                aiSynthesis: 'Critical. This matches Tribal Knowledge entry #wiki-1 ("Legacy Partner Bank 3-second Delay Hack"). Dave recently removed the delay. Reverting or applying the delay will fix this.',
                actionType: 'view_wiki_hack',
                actionLabel: 'View Solution Wiki'
            },
            {
                id: 'feed-3',
                source: 'notion',
                title: 'Technical Spec Update: API Authentication',
                snippet: 'Notion Page: "System Architecture v2" updated by Lead Architect: "Moving from API Key authentication to OAuth2 bearer tokens. All sub-teams must deprecate API Key usage by end of June."',
                createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
                priority: 'medium',
                resolved: false,
                aiSynthesis: 'Actionable. Requires updating internal authentication service code. 4 microservices still rely on the old API Key. Aura recommends flagging these tasks in the sprint queue.',
                actionType: 'mark_reviewed',
                actionLabel: 'Acknowledge Spec Change'
            },
            {
                id: 'feed-4',
                source: 'email',
                title: 'Stripe API deprecation warning',
                snippet: 'Email from Stripe Support: "Action Required: Your webhook API version (2019-12-03) will be deprecated on July 1st. Please upgrade to 2024-04-30 to prevent service disruptions."',
                createdAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
                priority: 'medium',
                resolved: false,
                aiSynthesis: 'Technical Debt. Requires webhook endpoint version bumps. Safe to schedule in next sprint. Auto-categorized as medium priority.',
                actionType: 'create_task',
                actionLabel: 'Add to Backlog'
            },
            {
                id: 'feed-5',
                source: 'jira',
                title: 'Jira Issue Blocked: CO-432 - User Profile Cache',
                snippet: 'Jira ticket CO-432 moved to Blocked: "Cache invalidation fails on distributed Redis nodes under high load. Need infrastructure support."',
                createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
                priority: 'low',
                resolved: false,
                aiSynthesis: 'Coordination Gap. Ticket is blocked by Redis caching issues. Infra team has not been tagged. Aura has drafted a Slack notification to the Infrastructure Lead.',
                actionType: 'ping_infra',
                actionLabel: 'Ping Infra Team'
            }
        ];
        saveJSON(profileStoreKey('aura_feed', individualProfileId), initialFeed);
        saveJSON(profileStoreKey('aura_tasks', individualProfileId), []);
        saveJSON(profileStoreKey('aura_meetings', individualProfileId), []);
        saveJSON(profileStoreKey('aura_wiki', individualProfileId), []);
        saveJSON(profileStoreKey('aura_tasks', teamProfileId), []);
        saveJSON(profileStoreKey('aura_meetings', teamProfileId), []);
        saveJSON(profileStoreKey('aura_wiki', teamProfileId), []);

        if (!localStorage.getItem('aura_teams')) {
            saveJSON('aura_teams', [{ id: 'team-stark', name: 'Stark Industries', code: 'STARK456' }]);
        }

        if (!localStorage.getItem('aura_users')) {
            saveJSON('aura_users', [
                { email: 'admin@work.ai', name: 'Alex Johnson', password: 'password123', role: 'Product Lead', teamId: 'team-stark' },
                { email: 'tony@stark.com', name: 'Tony Stark', password: 'simulated_user', role: 'Chief Systems Architect', teamId: 'team-stark' },
                { email: 'sarah@stark.com', name: 'Sarah Connor', password: 'simulated_user', role: 'Senior Security Lead', teamId: 'team-stark' },
                { email: 'dave@stark.com', name: 'Dave K.', password: 'simulated_user', role: 'Fullstack Dev', teamId: 'team-stark' }
            ]);
        }

        if (!localStorage.getItem('aura_messages')) {
            const nowMessages = Date.now();
            saveJSON('aura_messages', [
                { id: 'm-1', roomId: 'team-stark_general', senderEmail: 'tony@stark.com', senderName: 'Tony Stark', text: 'System diagnostics complete. Welcome everyone to the Stark AURA chief of staff cockpit.', createdAt: new Date(nowMessages - 120*60*1000).toISOString() },
                { id: 'm-2', roomId: 'team-stark_general', senderEmail: 'dave@stark.com', senderName: 'Dave K.', text: 'Thanks Tony! Did anyone verify the rate-limit issue on `/v1/bank-sync`?', createdAt: new Date(nowMessages - 90*60*1000).toISOString() },
                { id: 'm-3', roomId: 'team-stark_general', senderEmail: 'sarah@stark.com', senderName: 'Sarah Connor', text: 'Yes Dave. There is a 3-second sleep required. It is documented in the Tribal Wiki. DO NOT remove it.', createdAt: new Date(nowMessages - 70*60*1000).toISOString() },
                { id: 'm-4', roomId: 'team-stark_engineering', senderEmail: 'sarah@stark.com', senderName: 'Sarah Connor', text: 'We need to migrate our API key usage to OAuth2 bearer tokens by Friday.', createdAt: new Date(nowMessages - 240*60*1000).toISOString() },
                { id: 'm-5', roomId: 'team-stark_engineering', senderEmail: 'dave@stark.com', senderName: 'Dave K.', text: 'Got it, tracking that in the Notion Spec document.', createdAt: new Date(nowMessages - 200*60*1000).toISOString() }
            ]);
        }
    }
};

seedData();

// Core Store Operations
export const Store = {
    auth: {
        login(email, password) {
            const account = findAccount(email);
            if (!account || account.password !== password) {
                return { success: false, message: 'Invalid email or password.' };
            }
            const activeProfileId = account.lastActiveProfileId || account.profiles[0]?.id;
            const session = {
                email: account.email,
                activeProfileId,
                lastAuthAt: new Date().toISOString()
            };
            saveJSON(STORAGE_KEYS.session, session);
            return {
                success: true,
                user: this.getCurrentUser(),
                needsConsent: !(account.consent.termsAccepted && account.consent.privacyAccepted)
            };
        },

        register(name, email, password, teamOption, teamValue) {
            const cleanEmail = escapeHTML(email);
            if (findAccount(cleanEmail)) {
                return { success: false, message: 'User already exists.' };
            }
            const account = {
                email: cleanEmail,
                password,
                name: escapeHTML(name),
                createdAt: new Date().toISOString(),
                consent: {
                    termsAccepted: false,
                    privacyAccepted: false
                },
                profiles: [],
                lastActiveProfileId: null
            };

            const createProfile = (profileType, profileName, teamName, role, bio) => ({
                id: createId('profile'),
                type: profileType,
                profileName: escapeHTML(profileName),
                teamName: escapeHTML(teamName),
                role: escapeHTML(role),
                bio: escapeHTML(bio || ''),
                createdAt: new Date().toISOString()
            });

            const personalProfile = createProfile('individual', name, 'Individual Workspace', 'Product Lead', 'Individual profile for personal analytics and task tracking.');
            account.profiles.push(personalProfile);

            if (teamOption === 'create') {
                const teamName = escapeHTML(teamValue || 'Team Workspace');
                account.profiles.push(createProfile('team', teamName, teamName, 'Team Lead', 'Team profile for shared collaboration, approvals, and project delivery.'));
            } else if (teamOption === 'join') {
                const teams = loadJSON('aura_teams', []);
                const matched = teams.find(t => t.code === String(teamValue || '').trim().toUpperCase());
                if (!matched) {
                    return { success: false, message: 'Invalid Team Join Code. Contact your Administrator.' };
                }
                account.profiles.push(createProfile('team', matched.name, matched.name, 'Team Collaborator', 'Joined team profile for shared collaboration and accountability.'));
            }

            account.lastActiveProfileId = personalProfile.id;
            const accounts = loadJSON(STORAGE_KEYS.accounts, []);
            accounts.push(account);
            saveJSON(STORAGE_KEYS.accounts, accounts);

            saveJSON(profileStoreKey('aura_integrations', personalProfile.id), defaultIntegrations);
            saveJSON(profileStoreKey('aura_feed', personalProfile.id), []);
            saveJSON(profileStoreKey('aura_tasks', personalProfile.id), []);
            saveJSON(profileStoreKey('aura_meetings', personalProfile.id), []);
            saveJSON(profileStoreKey('aura_wiki', personalProfile.id), []);

            if (account.profiles.length > 1) {
                const teamProfile = account.profiles[1];
                saveJSON(profileStoreKey('aura_integrations', teamProfile.id), defaultIntegrations);
                saveJSON(profileStoreKey('aura_feed', teamProfile.id), []);
                saveJSON(profileStoreKey('aura_tasks', teamProfile.id), []);
                saveJSON(profileStoreKey('aura_meetings', teamProfile.id), []);
                saveJSON(profileStoreKey('aura_wiki', teamProfile.id), []);
            }

            saveJSON(STORAGE_KEYS.session, {
                email: account.email,
                activeProfileId: account.lastActiveProfileId,
                lastAuthAt: new Date().toISOString()
            });

            return { success: true, user: this.getCurrentUser() };
        },

        logout() {
            localStorage.removeItem(STORAGE_KEYS.session);
            return true;
        },

        getCurrentUser() {
            const session = loadJSON(STORAGE_KEYS.session, null);
            if (!session) return null;
            const account = findAccount(session.email);
            if (!account) return null;
            const profile = account.profiles.find(p => p.id === session.activeProfileId) || account.profiles[0];
            if (!profile) return null;
            return {
                email: account.email,
                name: account.name,
                profileId: profile.id,
                profileName: profile.profileName,
                teamName: profile.teamName,
                role: profile.role,
                bio: profile.bio,
                profileType: profile.type,
                needsConsent: !(account.consent.termsAccepted && account.consent.privacyAccepted)
            };
        },

        getCurrentAccount() {
            const session = loadJSON(STORAGE_KEYS.session, null);
            return session ? findAccount(session.email) : null;
        },

        getProfiles() {
            const account = this.getCurrentAccount();
            return account ? account.profiles : [];
        },

        getActiveProfile() {
            const account = this.getCurrentAccount();
            const session = loadJSON(STORAGE_KEYS.session, null);
            if (!account || !session) return null;
            return account.profiles.find(p => p.id === session.activeProfileId) || account.profiles[0] || null;
        },

        switchProfile(profileId) {
            const account = this.getCurrentAccount();
            if (!account) return false;
            const profile = account.profiles.find(p => p.id === profileId);
            if (!profile) return false;
            saveJSON(STORAGE_KEYS.session, {
                email: account.email,
                activeProfileId: profile.id,
                lastAuthAt: new Date().toISOString()
            });
            account.lastActiveProfileId = profile.id;
            updateAccount(account);
            return true;
        },

        addProfile(profileType, displayName, teamName, role, bio) {
            const account = this.getCurrentAccount();
            if (!account) return { success: false, message: 'No authenticated account.' };
            const newProfile = {
                id: createId('profile'),
                type: profileType,
                profileName: escapeHTML(displayName),
                teamName: escapeHTML(teamName || displayName),
                role: escapeHTML(role),
                bio: escapeHTML(bio || ''),
                createdAt: new Date().toISOString()
            };
            account.profiles.push(newProfile);
            updateAccount(account);
            saveJSON(profileStoreKey('aura_integrations', newProfile.id), defaultIntegrations);
            saveJSON(profileStoreKey('aura_feed', newProfile.id), []);
            saveJSON(profileStoreKey('aura_tasks', newProfile.id), []);
            saveJSON(profileStoreKey('aura_meetings', newProfile.id), []);
            saveJSON(profileStoreKey('aura_wiki', newProfile.id), []);
            return { success: true, profile: newProfile };
        },

        updateProfile(profileId, updates) {
            const account = this.getCurrentAccount();
            if (!account) return false;
            account.profiles = account.profiles.map(p => p.id === profileId ? { ...p, ...updates } : p);
            updateAccount(account);
            return true;
        },

        hasConsent() {
            const account = this.getCurrentAccount();
            return account ? account.consent.termsAccepted && account.consent.privacyAccepted : false;
        },

        recordConsent(termsAccepted, privacyAccepted) {
            const account = this.getCurrentAccount();
            if (!account) return false;
            account.consent = {
                termsAccepted: !!termsAccepted,
                privacyAccepted: !!privacyAccepted,
                termsAcceptedAt: termsAccepted ? new Date().toISOString() : account.consent.termsAcceptedAt,
                privacyAcceptedAt: privacyAccepted ? new Date().toISOString() : account.consent.privacyAcceptedAt
            };
            updateAccount(account);
            return true;
        },

        getTeamMembers() {
            const profile = this.getActiveProfile();
            if (!profile || profile.profileType !== 'team') return [];
            const users = loadJSON('aura_users', []);
            return users.map(u => ({ email: u.email, name: u.name, role: u.role }));
        },

        getTeamCode() {
            const profile = this.getActiveProfile();
            if (!profile) return '';
            const teams = loadJSON('aura_teams', []);
            const team = teams.find(t => t.name === profile.teamName);
            return team ? team.code : '';
        }
    },

    integrations: {
        get() {
            return getProfileScopedStore('aura_integrations', defaultIntegrations);
        },
        toggle(id) {
            const current = this.get();
            current[id] = !current[id];
            saveProfileScopedStore('aura_integrations', current);
            return current;
        }
    },

    feed: {
        get() {
            const items = getProfileScopedStore('aura_feed', []);
            const integrations = Store.integrations.get();
            return items.filter(item => item.source === 'team' || integrations[item.source] === true);
        },
        add(item) {
            const items = getProfileScopedStore('aura_feed', []);
            const user = Store.auth.getCurrentUser();
            const newItem = {
                id: createId('feed'),
                source: item.source || 'team',
                title: item.title,
                snippet: item.snippet,
                createdAt: new Date().toISOString(),
                priority: item.priority || 'low',
                resolved: false,
                aiSynthesis: item.aiSynthesis || 'Broadcasted update.',
                actionType: item.actionType || 'none',
                actionLabel: item.actionLabel || 'Acknowledge',
                profileId: user ? user.profileId : null
            };
            const next = [newItem, ...items];
            saveProfileScopedStore('aura_feed', next);
            return newItem;
        },
        resolve(id) {
            const items = getProfileScopedStore('aura_feed', []);
            const updated = items.map(item => item.id === id ? { ...item, resolved: true } : item);
            saveProfileScopedStore('aura_feed', updated);
            return updated;
        }
    },

    meetings: {
        get() {
            return getProfileScopedStore('aura_meetings', []);
        },
        add(meeting) {
            const current = this.get();
            const user = Store.auth.getCurrentUser();
            const cleanTitle = escapeHTML(meeting.title);
            const cleanSummary = escapeHTML(meeting.summary);
            const cleanDecisions = meeting.decisions.map(d => escapeHTML(d));
            const cleanActions = meeting.actions.map(act => ({
                assignee: escapeHTML(act.assignee),
                task: escapeHTML(act.task)
            }));
            const cleanTranscript = meeting.transcript.map(t => ({
                speaker: escapeHTML(t.speaker),
                text: escapeHTML(t.text)
            }));
            const newMeeting = {
                id: createId('meet'),
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                title: cleanTitle,
                duration: meeting.duration,
                attendees: meeting.attendees,
                summary: cleanSummary,
                decisions: cleanDecisions,
                actions: cleanActions,
                transcript: cleanTranscript,
                profileId: user ? user.profileId : null
            };
            const next = [newMeeting, ...current];
            saveProfileScopedStore('aura_meetings', next);
            if (cleanActions.length > 0) {
                cleanActions.forEach(act => {
                    Store.tasks.add({
                        title: act.task,
                        assignee: act.assignee,
                        source: cleanTitle,
                        dueDate: new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    });
                });
            }
            return newMeeting;
        }
    },

    wiki: {
        get(query = '') {
            const items = getProfileScopedStore('aura_wiki', []);
            if (!query) return items;
            const lowerQuery = query.toLowerCase();
            return items.filter(item =>
                item.title.toLowerCase().includes(lowerQuery) ||
                item.description.toLowerCase().includes(lowerQuery) ||
                item.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
                item.category.toLowerCase().includes(lowerQuery)
            );
        },
        add(card) {
            const items = getProfileScopedStore('aura_wiki', []);
            const user = Store.auth.getCurrentUser() || { profileName: 'You', profileId: null };
            const newCard = {
                id: createId('wiki'),
                updatedAt: `Just now by ${user.profileName}`,
                title: escapeHTML(card.title),
                category: card.category,
                description: escapeHTML(card.description),
                tags: card.tags.map(t => escapeHTML(t)),
                author: user.profileName,
                profileId: user.profileId
            };
            const next = [newCard, ...items];
            saveProfileScopedStore('aura_wiki', next);
            return newCard;
        }
    },

    tasks: {
        get() {
            return getProfileScopedStore('aura_tasks', []);
        },
        add(task) {
            const current = getProfileScopedStore('aura_tasks', []);
            const user = Store.auth.getCurrentUser() || { profileName: 'You', profileId: null };
            const newTask = {
                id: createId('task'),
                status: 'todo',
                createdAt: new Date().toISOString(),
                title: escapeHTML(task.title),
                assignee: escapeHTML(task.assignee),
                source: escapeHTML(task.source),
                dueDate: task.dueDate,
                profileId: user.profileId,
                pings: [
                    { timestamp: new Date().toISOString(), message: `Aura AI Auto-Ping: Task created and assigned to ${escapeHTML(task.assignee)}.` }
                ]
            };
            const next = [newTask, ...current];
            saveProfileScopedStore('aura_tasks', next);
            return newTask;
        },
        updateStatus(id, newStatus) {
            const current = getProfileScopedStore('aura_tasks', []);
            const updated = current.map(t => {
                if (t.id === id) {
                    return { ...t, status: newStatus, pings: [...t.pings, { timestamp: new Date().toISOString(), message: `Task status changed to [${newStatus.toUpperCase()}].` }] };
                }
                return t;
            });
            saveProfileScopedStore('aura_tasks', updated);
            return updated;
        },
        ping(id) {
            const allTasks = getProfileScopedStore('aura_tasks', []);
            let assignee = '';
            let title = '';
            const updated = allTasks.map(t => {
                if (t.id === id) {
                    assignee = t.assignee;
                    title = t.title;
                    const pingMsg = {
                        timestamp: new Date().toISOString(),
                        message: `Aura AI Manual Trigger: Pinged ${assignee} via Slack and Email regarding: "${title}".`
                    };
                    return { ...t, pings: [...t.pings, pingMsg] };
                }
                return t;
            });
            saveProfileScopedStore('aura_tasks', updated);
            return { updated, assignee, title };
        }
    },

    // Team Messages Store
    messages: {
        get(roomId) {
            const allMsgs = JSON.parse(localStorage.getItem('aura_messages') || '[]');
            return allMsgs.filter(msg => msg.roomId === roomId);
        },
        send(roomId, text, senderEmail, senderName) {
            const allMsgs = JSON.parse(localStorage.getItem('aura_messages') || '[]');
            const cleanText = escapeHTML(text);
            const newMsg = {
                id: 'm-' + Date.now(),
                roomId: roomId,
                senderEmail: senderEmail,
                senderName: escapeHTML(senderName),
                text: cleanText,
                createdAt: new Date().toISOString()
            };
            allMsgs.push(newMsg);
            localStorage.setItem('aura_messages', JSON.stringify(allMsgs));

            // Dispatch event to allow real-time UI refresh
            window.dispatchEvent(new CustomEvent('aura_new_message', { detail: { roomId } }));

            // Trigger AI/Teammate response simulation if it's from the user
            if (senderEmail !== 'tony@stark.com' && senderEmail !== 'sarah@stark.com' && senderEmail !== 'dave@stark.com' && !senderEmail.startsWith('sarah.') && !senderEmail.startsWith('dave.') && !senderEmail.startsWith('tony.')) {
                
                // Determine responder based on room
                let responderName = 'JARVIS Agent';
                let responderEmail = 'jarvis@aura.ai';
                let triggerReply = false;
                
                if (roomId === 'jarvis_core') {
                    responderName = 'JARVIS Agent';
                    responderEmail = 'jarvis@aura.ai';
                    triggerReply = true;
                } else if (roomId.endsWith('_general')) {
                    const responders = [
                        { name: 'Tony Stark', email: 'tony@stark.com' },
                        { name: 'Sarah Connor', email: 'sarah@stark.com' },
                        { name: 'Dave K.', email: 'dave@stark.com' }
                    ];
                    // Random pick
                    const pick = responders[Math.floor(Math.random() * responders.length)];
                    responderName = pick.name;
                    responderEmail = pick.email;
                    triggerReply = true;
                } else if (roomId.endsWith('_engineering')) {
                    const responders = [
                        { name: 'Dave K.', email: 'dave@stark.com' },
                        { name: 'Sarah Connor', email: 'sarah@stark.com' }
                    ];
                    const pick = responders[Math.floor(Math.random() * responders.length)];
                    responderName = pick.name;
                    responderEmail = pick.email;
                    triggerReply = true;
                } else if (roomId.includes('_dm_')) {
                    // Direct Message. The target is the teammate whom the user is DMing
                    // RoomId format: userEmail_dm_teammateEmail
                    const parts = roomId.split('_dm_');
                    const targetEmail = parts[0] === senderEmail ? parts[1] : parts[0];
                    
                    const users = JSON.parse(localStorage.getItem('aura_users') || '[]');
                    const targetUser = users.find(u => u.email === targetEmail);
                    if (targetUser) {
                        responderName = targetUser.name;
                        responderEmail = targetUser.email;
                        triggerReply = true;
                    }
                }

                if (triggerReply) {
                    setTimeout(() => {
                        const replyText = getSimulatedReply(responderName, text);
                        const msgs = JSON.parse(localStorage.getItem('aura_messages') || '[]');
                        const replyMsg = {
                            id: 'm-' + Date.now(),
                            roomId: roomId,
                            senderEmail: responderEmail,
                            senderName: responderName,
                            text: escapeHTML(replyText),
                            createdAt: new Date().toISOString()
                        };
                        msgs.push(replyMsg);
                        localStorage.setItem('aura_messages', JSON.stringify(msgs));
                        window.dispatchEvent(new CustomEvent('aura_new_message', { detail: { roomId } }));
                    }, 1500 + Math.random() * 1000);
                }
            }

            return newMsg;
        }
    }
};

// Generates contextual simulated teammate responses for rich feedback
const getSimulatedReply = (name, userText) => {
    const text = userText.toLowerCase();
    const firstName = name.split(' ')[0];

    if (name.includes('Tony Stark')) {
        if (text.includes('reactor') || text.includes('vibranium') || text.includes('power')) {
            return "The Arc Reactor telemetry is stable at 100% load. Ensure the core thermal dampers stay active during high-bandwidth integrations.";
        }
        if (text.includes('gsap') || text.includes('animation') || text.includes('tilt')) {
            return "Animations should feel weightless. I utilized CSS 3D perspectives coupled with GSAP timelines to sync the orbital node sweeps. Check the animations.js file.";
        }
        if (text.includes('status') || text.includes('work')) {
            return "Currently reviewing our technical specs for the next cockpit upgrade. No critical blockages on my side, alex.";
        }
        return "Noted. JARVIS is logging this query. Let's make sure the engineering submodules remain isolated during deployment.";
    }

    if (name.includes('Sarah')) {
        if (text.includes('bank') || text.includes('rate') || text.includes('limit') || text.includes('delay') || text.includes('hack')) {
            return "DO NOT change the 3-second bank rate-limit delay helper in the billing worker files. If you do, partner-bank will silently drop our OAuth keys.";
        }
        if (text.includes('security') || text.includes('sentry') || text.includes('bug') || text.includes('fail')) {
            return "I verified all input sanitization patterns. Input tags are completely escaped, preventing XSS injections. Sentry audits are green.";
        }
        return `Interesting points. I will document this in our Notion Team Wiki workspace. Let me know if you need specific security parameters checked.`;
    }

    if (name.includes('Dave')) {
        if (text.includes('task') || text.includes('ticket') || text.includes('jira') || text.includes('checkout')) {
            return "I am on it. Working on the Apple Pay express form task Sarah assigned. I should have the branch ready for merge tomorrow.";
        }
        if (text.includes('stripe') || text.includes('webhook') || text.includes('deprecated')) {
            return "Starting the Stripe API version upgrade (2024-04-30) now. I will test the webhook signature verifier in staging later.";
        }
        return "I will update the backlog ticket accordingly. Let's jump on a Slack sync if we hit database blockage.";
    }

    return "Message received. Synchronization protocols logged.";
};
