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

// Data schema version — bump this to force a reseed when schema changes
const DATA_VERSION = '4.1.0';
const storedVersion = localStorage.getItem('aura_data_version');
if (storedVersion !== DATA_VERSION) {
    // Clear all stores to ensure clean migration to team-based schema
    [
        'aura_integrations', 'aura_feed', 'aura_meetings', 
        'aura_wiki', 'aura_tasks', 'aura_messages', 
        'aura_teams', 'aura_users', 'aura_session'
    ].forEach(k => localStorage.removeItem(k));
    localStorage.setItem('aura_data_version', DATA_VERSION);
}

// Helper to seed localStorage if empty
const seedData = () => {
    // 1. Teams Seeding
    if (!localStorage.getItem('aura_teams')) {
        localStorage.setItem('aura_teams', JSON.stringify([
            { id: 'team-stark', name: 'Stark Industries', code: 'STARK456' }
        ]));
    }

    // 2. Users Seeding (linked to Stark Industries)
    if (!localStorage.getItem('aura_users')) {
        localStorage.setItem('aura_users', JSON.stringify([
            { email: 'admin@work.ai', name: 'Alex Johnson', password: 'password123', role: 'Product Lead', teamId: 'team-stark' },
            { email: 'tony@stark.com', name: 'Tony Stark', password: 'simulated_user', role: 'Chief Systems Architect', teamId: 'team-stark' },
            { email: 'sarah@stark.com', name: 'Sarah Connor', password: 'simulated_user', role: 'Senior Security Lead', teamId: 'team-stark' },
            { email: 'dave@stark.com', name: 'Dave K.', password: 'simulated_user', role: 'Fullstack Dev', teamId: 'team-stark' }
        ]));
    }

    // 3. Integrations Seeding — ALL start disconnected
    if (!localStorage.getItem('aura_integrations')) {
        localStorage.setItem('aura_integrations', JSON.stringify({
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
        }));
    }

    // 4. Default Feed Items
    if (!localStorage.getItem('aura_feed')) {
        const now = Date.now();
        localStorage.setItem('aura_feed', JSON.stringify([
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
        ]));
    }

    // 5. Default Messages (linked to channels)
    if (!localStorage.getItem('aura_messages')) {
        const now = Date.now();
        localStorage.setItem('aura_messages', JSON.stringify([
            // #general
            { id: 'm-1', roomId: 'team-stark_general', senderEmail: 'tony@stark.com', senderName: 'Tony Stark', text: 'System diagnostics complete. Welcome everyone to the Stark AURA chief of staff cockpit.', createdAt: new Date(now - 120*60*1000).toISOString() },
            { id: 'm-2', roomId: 'team-stark_general', senderEmail: 'dave@stark.com', senderName: 'Dave K.', text: 'Thanks Tony! Did anyone verify the rate-limit issue on `/v1/bank-sync`?', createdAt: new Date(now - 90*60*1000).toISOString() },
            { id: 'm-3', roomId: 'team-stark_general', senderEmail: 'sarah@stark.com', senderName: 'Sarah Connor', text: 'Yes Dave. There is a 3-second sleep required. It is documented in the Tribal Wiki. DO NOT remove it.', createdAt: new Date(now - 70*60*1000).toISOString() },
            
            // #engineering
            { id: 'm-4', roomId: 'team-stark_engineering', senderEmail: 'sarah@stark.com', senderName: 'Sarah Connor', text: 'We need to migrate our API key usage to OAuth2 bearer tokens by Friday.', createdAt: new Date(now - 240*60*1000).toISOString() },
            { id: 'm-5', roomId: 'team-stark_engineering', senderEmail: 'dave@stark.com', senderName: 'Dave K.', text: 'Got it, tracking that in the Notion Spec document.', createdAt: new Date(now - 200*60*1000).toISOString() }
        ]));
    }

    // 6. Meetings — start EMPTY
    if (!localStorage.getItem('aura_meetings')) {
        localStorage.setItem('aura_meetings', JSON.stringify([]));
    }

    // 7. Wiki Cards (linked to team-stark)
    if (!localStorage.getItem('aura_wiki')) {
        localStorage.setItem('aura_wiki', JSON.stringify([
            {
                id: 'wiki-1',
                title: 'Legacy Partner Bank 3-second Delay Hack',
                category: 'Infrastructure',
                description: 'The partner bank integration API (endpoint `/v1/bank-sync`) has strict rate limits (max 20 calls/min) and will silently drop requests if calls are spaced under 3 seconds. To prevent transaction drops, we implemented a mandatory 3-second delay between thread executions in our sync worker back in 2021. DO NOT optimize this delay out of the code, as the bank will block our API access key.',
                tags: ['integration', 'banking', 'rate-limit', 'legacy'],
                updatedAt: '12 months ago by Sarah M.',
                author: 'Sarah M. (Senior Engineer)',
                teamId: 'team-stark'
            },
            {
                id: 'wiki-2',
                title: 'Stripe Webhook Verification Config',
                category: 'Billing',
                description: 'Stripe webhooks are configured with signing secrets. In development and staging, you must set `STRIPE_WEBHOOK_SECRET` in your `.env` file. Failure to verify signatures will lead to transactions appearing successful locally but not triggering database updates. Staging secret is rotated monthly.',
                tags: ['stripe', 'billing', 'security', 'webhooks'],
                updatedAt: '2 months ago by Alex J.',
                author: 'Alex J. (Product Lead)',
                teamId: 'team-stark'
            },
            {
                id: 'wiki-3',
                title: 'OAuth2 Token Expiration & Refresh Flow',
                category: 'Security',
                description: 'Our mobile clients request refresh tokens every 7 days. If a client receives a 401 Unauthorized status code, it must attempt to hit `/api/auth/refresh` before redirecting the user to the login screen. If this refresh fails, clear secure storage and log out.',
                tags: ['auth', 'oauth2', 'jwt', 'mobile'],
                updatedAt: '3 weeks ago by Dave K.',
                author: 'Dave K. (Engineer)',
                teamId: 'team-stark'
            }
        ]));
    }

    // 8. Tasks
    if (!localStorage.getItem('aura_tasks')) {
        localStorage.setItem('aura_tasks', JSON.stringify([]));
    }
};

// Initialize seeding
seedData();

// Core Store Operations
export const Store = {
    // Auth Store
    auth: {
        login(email, password) {
            const users = JSON.parse(localStorage.getItem('aura_users') || '[]');
            const user = users.find(u => u.email === escapeHTML(email) && u.password === password);
            if (user) {
                const teams = JSON.parse(localStorage.getItem('aura_teams') || '[]');
                const team = teams.find(t => t.id === user.teamId);
                const sessionUser = { 
                    email: user.email, 
                    name: user.name, 
                    role: user.role, 
                    teamId: user.teamId, 
                    teamName: team ? team.name : 'Individual Sandbox' 
                };
                localStorage.setItem('aura_session', JSON.stringify(sessionUser));
                return { success: true, user: sessionUser };
            }
            return { success: false, message: 'Invalid email or password.' };
        },

        register(name, email, password, teamOption, teamValue) {
            const users = JSON.parse(localStorage.getItem('aura_users') || '[]');
            const cleanEmail = escapeHTML(email);
            if (users.some(u => u.email === cleanEmail)) {
                return { success: false, message: 'User already exists.' };
            }

            const teams = JSON.parse(localStorage.getItem('aura_teams') || '[]');
            let teamId = '';
            let teamName = '';

            if (teamOption === 'create') {
                // Create new team
                const cleanTeamName = escapeHTML(teamValue || 'My Team');
                // Alphanumeric code
                const cleanCode = (cleanTeamName.replace(/\\s+/g, '').toUpperCase() + Math.floor(100 + Math.random() * 900)).substring(0, 10);
                teamId = 'team-' + Date.now();
                const newTeam = { id: teamId, name: cleanTeamName, code: cleanCode };
                teams.push(newTeam);
                localStorage.setItem('aura_teams', JSON.stringify(teams));
                teamName = cleanTeamName;

                // Seed new team members
                const newUserList = [
                    { email: `sarah.${teamId}@work.ai`, name: 'Sarah M.', password: 'simulated_user', role: 'Senior Engineer', teamId: teamId },
                    { email: `dave.${teamId}@work.ai`, name: 'Dave K.', password: 'simulated_user', role: 'Fullstack Dev', teamId: teamId },
                    { email: `tony.${teamId}@work.ai`, name: 'Tony Stark', password: 'simulated_user', role: 'Systems Architect', teamId: teamId }
                ];
                localStorage.setItem('aura_users', JSON.stringify([...users, ...newUserList]));
                
                // Seed some messages
                const now = Date.now();
                const defaultMsgs = [
                    { id: `msg-${Date.now()}-1`, roomId: `${teamId}_general`, senderEmail: `tony.${teamId}@work.ai`, senderName: 'Tony Stark', text: `Welcome to the ${cleanTeamName} team! AURA is fully online.`, createdAt: new Date(now - 10*60*1000).toISOString() },
                    { id: `msg-${Date.now()}-2`, roomId: `${teamId}_general`, senderEmail: `sarah.${teamId}@work.ai`, senderName: 'Sarah M.', text: 'Hello everyone! Ask JARVIS about our wiki or tasks.', createdAt: new Date(now - 5*60*1000).toISOString() }
                ];
                const allMsgs = JSON.parse(localStorage.getItem('aura_messages') || '[]');
                localStorage.setItem('aura_messages', JSON.stringify([...allMsgs, ...defaultMsgs]));
            } else if (teamOption === 'join') {
                // Join existing team by code
                const targetCode = (teamValue || '').trim().toUpperCase();
                const matchedTeam = teams.find(t => t.code === targetCode);
                if (!matchedTeam) {
                    return { success: false, message: 'Invalid Team Join Code. Contact your Administrator.' };
                }
                teamId = matchedTeam.id;
                teamName = matchedTeam.name;
            } else {
                // Individual Account
                teamId = 'individual-' + Date.now();
                teamName = 'Individual Account';
                const newTeam = { id: teamId, name: teamName, code: 'INDIVIDUAL' };
                teams.push(newTeam);
                localStorage.setItem('aura_teams', JSON.stringify(teams));
            }

            const cleanName = escapeHTML(name);
            const newUser = { name: cleanName, email: cleanEmail, password, role: 'Software Engineer', teamId: teamId };
            
            // Reload user records
            const currentUsers = JSON.parse(localStorage.getItem('aura_users') || '[]');
            currentUsers.push(newUser);
            localStorage.setItem('aura_users', JSON.stringify(currentUsers));
            
            // Auto login after signup
            const sessionUser = { email: newUser.email, name: newUser.name, role: newUser.role, teamId: newUser.teamId, teamName: teamName };
            localStorage.setItem('aura_session', JSON.stringify(sessionUser));
            return { success: true, user: sessionUser };
        },

        logout() {
            localStorage.removeItem('aura_session');
            return true;
        },

        getCurrentUser() {
            const session = localStorage.getItem('aura_session');
            return session ? JSON.parse(session) : null;
        },

        getTeamMembers() {
            const currentUser = this.getCurrentUser();
            if (!currentUser) return [];
            const users = JSON.parse(localStorage.getItem('aura_users') || '[]');
            return users
                .filter(u => u.teamId === currentUser.teamId && u.email !== currentUser.email)
                .map(u => ({ email: u.email, name: u.name, role: u.role }));
        },

        getTeamCode() {
            const currentUser = this.getCurrentUser();
            if (!currentUser) return '';
            const teams = JSON.parse(localStorage.getItem('aura_teams') || '[]');
            const team = teams.find(t => t.id === currentUser.teamId);
            return team ? team.code : '';
        }
    },

    // Integrations Store
    integrations: {
        get() {
            return JSON.parse(localStorage.getItem('aura_integrations') || '{}');
        },
        toggle(id) {
            const current = this.get();
            current[id] = !current[id];
            localStorage.setItem('aura_integrations', JSON.stringify(current));
            return current;
        }
    },

    // Feed Store
    feed: {
        get() {
            const items = JSON.parse(localStorage.getItem('aura_feed') || '[]');
            const integrations = Store.integrations.get();
            // Bypass app check if the item is a team update/broadcast
            return items.filter(item => item.source === 'team' || integrations[item.source] === true);
        },
        add(item) {
            const items = JSON.parse(localStorage.getItem('aura_feed') || '[]');
            const user = Store.auth.getCurrentUser();
            const newItem = {
                id: 'feed-' + Date.now(),
                source: item.source || 'team',
                title: item.title,
                snippet: item.snippet,
                createdAt: new Date().toISOString(),
                priority: item.priority || 'low',
                resolved: false,
                aiSynthesis: item.aiSynthesis || 'Broadcasted update.',
                actionType: item.actionType || 'none',
                actionLabel: item.actionLabel || 'Acknowledge',
                teamId: user ? user.teamId : 'team-stark'
            };
            items.unshift(newItem);
            localStorage.setItem('aura_feed', JSON.stringify(items));
            return newItem;
        },
        resolve(id) {
            const items = JSON.parse(localStorage.getItem('aura_feed') || '[]');
            const updated = items.map(item => {
                if (item.id === id) {
                    return { ...item, resolved: true };
                }
                return item;
            });
            localStorage.setItem('aura_feed', JSON.stringify(updated));
            return updated;
        }
    },

    // Meetings Store
    meetings: {
        get() {
            return JSON.parse(localStorage.getItem('aura_meetings') || '[]');
        },
        add(meeting) {
            const current = this.get();
            const user = Store.auth.getCurrentUser();
            
            // Sanitize strings
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
                id: 'meet-' + (current.length + 1),
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                title: cleanTitle,
                duration: meeting.duration,
                attendees: meeting.attendees,
                summary: cleanSummary,
                decisions: cleanDecisions,
                actions: cleanActions,
                transcript: cleanTranscript,
                teamId: user ? user.teamId : 'team-stark'
            };
            current.unshift(newMeeting);
            localStorage.setItem('aura_meetings', JSON.stringify(current));
            
            // Side effect: Automatically generate tasks from action items
            if (cleanActions && cleanActions.length > 0) {
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

    // Tribal Knowledge Wiki Store
    wiki: {
        get(query = '') {
            const items = JSON.parse(localStorage.getItem('aura_wiki') || '[]');
            const user = Store.auth.getCurrentUser();
            if (!user) return [];

            const teamWiki = items.filter(item => item.teamId === user.teamId || !item.teamId);
            if (!query) return teamWiki;
            
            const lowerQuery = query.toLowerCase();
            return teamWiki.filter(item => 
                item.title.toLowerCase().includes(lowerQuery) ||
                item.description.toLowerCase().includes(lowerQuery) ||
                item.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
                item.category.toLowerCase().includes(lowerQuery)
            );
        },
        add(card) {
            const items = JSON.parse(localStorage.getItem('aura_wiki') || '[]');
            const user = Store.auth.getCurrentUser() || { email: 'admin@work.ai', name: 'Alex Johnson', role: 'Product Lead', teamId: 'team-stark' };

            // Sanitize Wiki contents
            const cleanTitle = escapeHTML(card.title);
            const cleanDescription = escapeHTML(card.description);
            const cleanTags = card.tags.map(t => escapeHTML(t));

            const newCard = {
                id: 'wiki-' + Date.now(),
                updatedAt: 'Just now by you',
                title: cleanTitle,
                category: card.category,
                description: cleanDescription,
                tags: cleanTags,
                author: card.author,
                teamId: user.teamId
            };
            items.unshift(newCard);
            localStorage.setItem('aura_wiki', JSON.stringify(items));
            return newCard;
        }
    },

    // Accountability Tasks Store
    tasks: {
        get() {
            const allTasks = JSON.parse(localStorage.getItem('aura_tasks') || '[]');
            const user = Store.auth.getCurrentUser();
            if (!user) return [];
            return allTasks.filter(t => t.teamId === user.teamId);
        },
        add(task) {
            const current = JSON.parse(localStorage.getItem('aura_tasks') || '[]');
            const user = Store.auth.getCurrentUser() || { email: 'admin@work.ai', name: 'Alex Johnson', teamId: 'team-stark' };

            // Sanitize Task parameters
            const cleanTitle = escapeHTML(task.title);
            const cleanAssignee = escapeHTML(task.assignee);
            const cleanSource = escapeHTML(task.source);

            const newTask = {
                id: 'task-' + Date.now(),
                status: 'todo',
                createdAt: new Date().toISOString(),
                title: cleanTitle,
                assignee: cleanAssignee,
                source: cleanSource,
                dueDate: task.dueDate,
                teamId: user.teamId,
                pings: [
                    { timestamp: new Date().toISOString(), message: `Aura AI Auto-Ping: Task created and assigned to ${cleanAssignee}.` }
                ]
            };
            current.push(newTask);
            localStorage.setItem('aura_tasks', JSON.stringify(current));
            return newTask;
        },
        updateStatus(id, newStatus) {
            const allTasks = JSON.parse(localStorage.getItem('aura_tasks') || '[]');
            const updated = allTasks.map(t => {
                if (t.id === id) {
                    const statusChangeMsg = {
                        timestamp: new Date().toISOString(),
                        message: `Task status changed to [${newStatus.toUpperCase()}] by user.`
                    };
                    return { ...t, status: newStatus, pings: [...t.pings, statusChangeMsg] };
                }
                return t;
            });
            localStorage.setItem('aura_tasks', JSON.stringify(updated));
            return updated;
        },
        ping(id) {
            const allTasks = JSON.parse(localStorage.getItem('aura_tasks') || '[]');
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
            localStorage.setItem('aura_tasks', JSON.stringify(updated));
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
