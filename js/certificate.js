// PromptQuest - Certificate Generator
// Simple approach: render a printable certificate, use browser Print to PDF

const Certificate = {
    playerName: '',
    totalStars: 0,
    percentage: 0,
    grade: '',
    title: '',
    date: '',

    // Show certificate screen
    show(playerName) {
        // If no name provided, show name entry form first
        if (!playerName) {
            this.showNameEntry();
            return;
        }

        this.playerName = playerName;
        this.totalStars = Game.state.totalStars;
        this.percentage = Math.round((this.totalStars / 60) * 100);
        this.grade = this.getGrade(this.percentage);
        this.title = this.getTitle(this.percentage);
        this.date = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        this.renderCertificate();
    },

    showNameEntry() {
        const screen = document.getElementById('screen-certificate');
        screen.innerHTML = `
            <div class="cert-name-entry">
                <h2>Get Your Certificate</h2>
                <p>Enter your name to generate your completion certificate.</p>
                <div class="cert-form">
                    <input type="text" id="cert-name-input" class="blank-input" placeholder="Your full name" maxlength="50" autocomplete="off">
                    <div class="cert-form-actions">
                        <button class="btn btn-primary" id="cert-generate-btn">Generate Certificate</button>
                        <button class="btn btn-ghost" data-target="screen-map">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        const input = document.getElementById('cert-name-input');
        const btn = document.getElementById('cert-generate-btn');

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') btn.click();
        });

        btn.addEventListener('click', () => {
            const name = input.value.trim();
            if (!name) {
                input.focus();
                input.style.borderColor = 'var(--accent-red)';
                setTimeout(() => { input.style.borderColor = ''; }, 2000);
                return;
            }
            this.show(name);
        });

        // Auto-focus input
        setTimeout(() => input.focus(), 100);

        Game.showScreen('screen-certificate');
    },

    renderCertificate() {
        const screen = document.getElementById('screen-certificate');
        screen.innerHTML = `
            <div class="certificate-container">
                <div class="cert-actions">
                    <button class="btn btn-secondary" id="cert-print-btn">&#128424; Print / Save as PDF</button>
                    <button class="btn btn-ghost" id="cert-rename-btn">&#9998; Change Name</button>
                    <button class="btn btn-ghost" data-target="screen-map">Back to Game</button>
                </div>

                <div class="certificate-print-area" id="certificate-print-area">
                    <div class="cert-border">
                        <div class="cert-inner">
                            <div class="cert-header">
                                <div class="cert-logo">PromptQuest</div>
                                <div class="cert-subtitle">The Prompt Engineering Dojo</div>
                            </div>

                            <div class="cert-title">Certificate of Completion</div>

                            <div class="cert-body">
                                <p class="cert-presented">This is to certify that</p>
                                <p class="cert-name">${this.escapeHtml(this.playerName)}</p>
                                <p class="cert-earned">has earned the title of</p>
                                <p class="cert-title-text">${this.title}</p>
                                <p class="cert-description">by completing all 20 levels of PromptQuest, demonstrating proficiency in professional prompt engineering.</p>
                            </div>

                            <div class="cert-scores">
                                <div class="cert-score-item">
                                    <span class="cert-score-value">${this.totalStars}/60</span>
                                    <span class="cert-score-label">Stars</span>
                                </div>
                                <div class="cert-score-item">
                                    <span class="cert-score-value">${this.percentage}%</span>
                                    <span class="cert-score-label">Score</span>
                                </div>
                                <div class="cert-score-item">
                                    <span class="cert-score-value">${this.grade}</span>
                                    <span class="cert-score-label">Grade</span>
                                </div>
                            </div>

                            <div class="cert-zones">
                                ${this.getZoneResults().map(z => `
                                    <div class="cert-zone">
                                        <span class="cert-zone-name">${z.icon} ${z.name}</span>
                                        <span class="cert-zone-stars">${'★'.repeat(z.stars)}${'☆'.repeat(z.max - z.stars)}</span>
                                    </div>
                                `).join('')}
                            </div>

                            <div class="cert-footer">
                                <span class="cert-date">${this.date}</span>
                                <span class="cert-issuer">Bharath Kumar | SWAI</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('cert-print-btn').addEventListener('click', () => {
            window.print();
        });

        document.getElementById('cert-rename-btn').addEventListener('click', () => {
            this.showNameEntry();
        });

        Game.showScreen('screen-certificate');
    },

    getZoneResults() {
        return ZONES.map(zone => {
            const zoneLevels = LEVELS.filter(l => l.zone === zone.id);
            const stars = zoneLevels.reduce((sum, l) => sum + (Game.state.progress[l.id]?.stars || 0), 0);
            return { name: zone.name, icon: zone.icon, stars, max: zoneLevels.length * 3 };
        });
    },

    getGrade(percentage) {
        if (percentage >= 95) return 'S';
        if (percentage >= 85) return 'A+';
        if (percentage >= 75) return 'A';
        if (percentage >= 65) return 'B+';
        if (percentage >= 55) return 'B';
        if (percentage >= 45) return 'C';
        return 'D';
    },

    getTitle(percentage) {
        if (percentage >= 95) return 'Grandmaster Prompt Engineer';
        if (percentage >= 85) return 'Expert Prompt Engineer';
        if (percentage >= 75) return 'Advanced Prompt Engineer';
        if (percentage >= 65) return 'Proficient Prompt Engineer';
        if (percentage >= 55) return 'Skilled Prompt Practitioner';
        if (percentage >= 45) return 'Prompt Engineering Apprentice';
        return 'Prompt Engineering Beginner';
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};
