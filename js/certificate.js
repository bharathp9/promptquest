// PromptQuest - Certificate Generator
// Professional certificate design with Print-to-PDF support

const Certificate = {
    playerName: '',
    totalStars: 0,
    percentage: 0,
    grade: '',
    title: '',
    date: '',

    show(playerName) {
        this.playerName = playerName;
        this.totalStars = Game.state.totalStars;
        this.percentage = Math.round((this.totalStars / 60) * 100);
        this.grade = this.getGrade(this.percentage);
        this.title = this.getTitle(this.percentage);
        this.date = new Date().toLocaleDateString('en-GB', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        this.renderCertificate();
    },

    renderCertificate() {
        const screen = document.getElementById('screen-certificate');
        screen.innerHTML = `
            <div class="certificate-page">
                <div class="cert-actions-top">
                    <button class="btn btn-secondary" id="cert-print-btn">&#128424; Print / Save as PDF</button>
                    <button class="btn btn-ghost" data-target="screen-map">Back to Game</button>
                </div>

                <div class="certificate-print-area" id="certificate-print-area">
                    <div class="cert-outer-border">
                        <div class="cert-inner-border">
                            <div class="cert-content">

                                <div class="cert-top-accent"></div>

                                <div class="cert-header">
                                    <div class="cert-logo-row">
                                        <span class="cert-logo-icon">&#9889;</span>
                                        <span class="cert-logo-text">PromptQuest</span>
                                    </div>
                                    <div class="cert-subtitle">The Prompt Engineering Dojo</div>
                                </div>

                                <div class="cert-divider">
                                    <span class="cert-divider-dot">&#11044;</span>
                                </div>

                                <div class="cert-title">Certificate of Completion</div>

                                <div class="cert-body">
                                    <p class="cert-presented">This certificate is proudly presented to</p>
                                    <p class="cert-name">${this.escapeHtml(this.playerName)}</p>
                                    <p class="cert-earned">for successfully completing all 20 levels and earning the title of</p>
                                    <p class="cert-title-text">${this.title}</p>
                                </div>

                                <div class="cert-divider">
                                    <span class="cert-divider-dot">&#11044;</span>
                                </div>

                                <div class="cert-scores-row">
                                    <div class="cert-score-item">
                                        <span class="cert-score-value">${this.totalStars}/60</span>
                                        <span class="cert-score-label">Stars Earned</span>
                                    </div>
                                    <div class="cert-score-item">
                                        <span class="cert-score-value">${this.percentage}%</span>
                                        <span class="cert-score-label">Final Score</span>
                                    </div>
                                    <div class="cert-score-item">
                                        <span class="cert-score-value">${this.grade}</span>
                                        <span class="cert-score-label">Grade</span>
                                    </div>
                                </div>

                                <div class="cert-zones-row">
                                    ${this.getZoneResults().map(z => `
                                        <div class="cert-zone-pill">
                                            <span class="cert-zone-stars"><span class="filled">${'&#9733;'.repeat(z.stars)}</span><span class="empty">${'&#9734;'.repeat(z.max - z.stars)}</span></span>
                                            <span class="cert-zone-name">${z.name}</span>
                                        </div>
                                    `).join('')}
                                </div>

                                <div class="cert-divider">
                                    <span class="cert-divider-dot">&#11044;</span>
                                </div>

                                <div class="cert-footer-row">
                                    <div class="cert-footer-left">
                                        <span class="cert-date">${this.date}</span>
                                        <span class="cert-date-label">Date of Completion</span>
                                    </div>
                                    <div class="cert-footer-right">
                                        <span class="cert-issuer">Bharath Kumar</span>
                                        <span class="cert-issuer-label">AWAI | Automate Work with AI</span>
                                    </div>
                                </div>

                                <div class="cert-bottom-accent"></div>

                            </div>
                        </div>
                    </div>
                </div>

                <p class="cert-disclaimer">This certificate verifies completion of PromptQuest: The Prompt Engineering Dojo, created by Bharath Kumar for AWAI.</p>
            </div>
        `;

        document.getElementById('cert-print-btn').addEventListener('click', () => {
            window.print();
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
