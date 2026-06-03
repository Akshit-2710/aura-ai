import { Store } from '../utils/store.js';

export const AuthComponent = {
    renderLogin: (container, onLoginSuccess, navigateToRegister, navigateToLanding) => {
        container.innerHTML = `
            <div class="auth-container animate-slide-up">
                <div class="glass-card auth-card">
                    <div class="auth-header">
                        <div class="logo-container" id="logo-home" style="cursor: pointer;">
                            <div class="logo-icon"></div>
                            <span>AURA AI</span>
                        </div>
                        <button type="button" class="btn-secondary" id="login-back-btn" style="margin-top: 0.75rem;">Back</button>
                        <h2>Welcome Back</h2>
                        <p>Sign in to access your ambient workspace</p>
                    </div>
                    
                    <div class="auth-error" id="login-error"></div>
                    
                    <form class="auth-form" id="login-form">
                        <div class="form-group">
                            <label for="login-email">Work Email</label>
                            <input type="email" id="login-email" placeholder="you@company.com" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">Password</label>
                            <input type="password" id="login-password" placeholder="••••••••" required>
                        </div>
                        <button type="submit" class="glow-btn" style="margin-top: 1rem; border: none; width: 100%;">Sign In</button>
                    </form>
                    
                    <div class="auth-footer">
                        Don't have an account? <a href="#" id="link-to-register">Create one</a>
                    </div>
                </div>
            </div>
        `;

        // Event Listeners
        document.getElementById('logo-home').addEventListener('click', navigateToLanding);
        document.getElementById('login-back-btn').addEventListener('click', navigateToLanding);
        document.getElementById('link-to-register').addEventListener('click', (e) => {
            e.preventDefault();
            navigateToRegister();
        });

        const form = document.getElementById('login-form');
        const errorDiv = document.getElementById('login-error');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const res = Store.auth.login(email, password);
            if (res.success) {
                onLoginSuccess(res.user);
            } else {
                errorDiv.textContent = res.message;
                errorDiv.style.display = 'block';
            }
        });
    },

    renderRegister: (container, onRegisterSuccess, navigateToLogin, navigateToLanding) => {
        container.innerHTML = `
            <div class="auth-container animate-slide-up">
                <div class="glass-card auth-card">
                    <div class="auth-header">
                        <div class="logo-container" id="logo-home-reg" style="cursor: pointer;">
                            <div class="logo-icon"></div>
                            <span>AURA AI</span>
                        </div>
                        <button type="button" class="btn-secondary" id="register-back-btn" style="margin-top: 0.75rem;">Back</button>
                        <h2>Create Account</h2>
                        <p>Get started with the AI Chief of Staff</p>
                    </div>
                    
                    <div class="auth-error" id="register-error"></div>
                    
                    <form class="auth-form" id="register-form">
                        <div class="form-group">
                            <label for="reg-name">Full Name</label>
                            <input type="text" id="reg-name" placeholder="Alex Johnson" required>
                        </div>
                        <div class="form-group">
                            <label for="reg-email">Work Email</label>
                            <input type="email" id="reg-email" placeholder="you@company.com" required>
                        </div>
                        <div class="form-group">
                            <label for="reg-password">Password</label>
                            <input type="password" id="reg-password" placeholder="Min. 8 characters" minlength="8" required>
                        </div>
                        
                        <!-- Account Setup Selection -->
                        <div class="form-group">
                            <label for="reg-team-option">Account Setup</label>
                            <select id="reg-team-option" required style="background: rgba(0, 240, 255, 0.02); color: #fff; border: 1px solid var(--border-color); padding: 0.6rem; border-radius: 0; outline: none; font-family: var(--font-primary);">
                                <option value="create" style="background:#02050c; color:#fff;">Create a New Team</option>
                                <option value="join" style="background:#02050c; color:#fff;">Join an Existing Team</option>
                                <option value="individual" style="background:#02050c; color:#fff;">Work as Individual</option>
                            </select>
                        </div>
                        <div class="form-group" id="group-team-name">
                            <label for="reg-team-name">New Team Name</label>
                            <input type="text" id="reg-team-name" placeholder="e.g. Your Team Name">
                        </div>
                        <div class="form-group" id="group-team-code" style="display: none;">
                            <label for="reg-team-code">Team Join Code</label>
                            <input type="text" id="reg-team-code" placeholder="e.g. STARK456">
                        </div>

                        <button type="submit" class="glow-btn" style="margin-top: 1rem; border: none; width: 100%;">Get Started</button>
                    </form>
                    
                    <div class="auth-footer">
                        Already have an account? <a href="#" id="link-to-login">Sign in</a>
                    </div>
                </div>
            </div>
        `;

        // Event Listeners
        document.getElementById('logo-home-reg').addEventListener('click', navigateToLanding);
        document.getElementById('register-back-btn').addEventListener('click', navigateToLanding);
        document.getElementById('link-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            navigateToLogin();
        });

        // Dynamic Toggle between Create, Join, and Individual
        const teamOption = document.getElementById('reg-team-option');
        const teamNameGroup = document.getElementById('group-team-name');
        const teamCodeGroup = document.getElementById('group-team-code');
        const teamNameInput = document.getElementById('reg-team-name');
        const teamCodeInput = document.getElementById('reg-team-code');

        teamOption.addEventListener('change', () => {
            if (teamOption.value === 'create') {
                teamNameGroup.style.display = 'flex';
                teamCodeGroup.style.display = 'none';
                teamNameInput.required = true;
                teamCodeInput.required = false;
            } else if (teamOption.value === 'join') {
                teamNameGroup.style.display = 'none';
                teamCodeGroup.style.display = 'flex';
                teamNameInput.required = false;
                teamCodeInput.required = true;
            } else if (teamOption.value === 'individual') {
                teamNameGroup.style.display = 'none';
                teamCodeGroup.style.display = 'none';
                teamNameInput.required = false;
                teamCodeInput.required = false;
            }
        });

        const form = document.getElementById('register-form');
        const errorDiv = document.getElementById('register-error');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const option = teamOption.value;
            const teamValue = option === 'create' ? teamNameInput.value : teamCodeInput.value;

            const res = Store.auth.register(name, email, password, option, teamValue);
            if (res.success) {
                // Show in-app notification for team creation
                const user = Store.auth.getCurrentUser();
                const code = Store.auth.getTeamCode();
                if (option === 'create' && code) {
                    errorDiv.style.background = 'rgba(0, 255, 136, 0.08)';
                    errorDiv.style.border = '1px solid rgba(0, 255, 136, 0.3)';
                    errorDiv.style.color = 'hsla(145, 100%, 52%, 1)';
                    errorDiv.textContent = `✓ Team Created! Join Code: ${code} — Share with teammates`;
                    errorDiv.style.display = 'block';
                    setTimeout(() => {
                        onRegisterSuccess(res.user);
                    }, 1500);
                } else {
                    onRegisterSuccess(res.user);
                }
            } else {
                errorDiv.textContent = res.message;
                errorDiv.style.display = 'block';
                errorDiv.style.background = '';
                errorDiv.style.border = '';
                errorDiv.style.color = '';
            }
        });
    }
};
