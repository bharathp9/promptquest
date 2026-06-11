// PromptQuest - Certificate Generator
// Generates a downloadable completion certificate using Canvas API

const Certificate = {
    // Show certificate screen
    show(playerName) {
        const screen = document.getElementById('screen-certificate');
        if (!screen) return;

        const zoneStars = this.calculateZoneStars();
        const totalStars = Game.state.totalStars;
        const maxStars = 60;
        const percentage = Math.round((totalStars / maxStars) * 100);
        const grade = this.getGrade(percentage);
        const date = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        screen.innerHTML = `
            <div class="certificate-container">
                <div class="certificate-actions-top">
                    <button class="btn btn-secondary" id="cert-download-btn">&#128229; Download as Image</button>
                    <button class="btn btn-ghost" id="cert-share-btn">&#128227; Copy Share Text</button>
                </div>
                <div class="certificate-frame" id="certificate-frame">
                    <div class="certificate-border">
                        <div class="certificate-inner">
                            <div class="cert-header">
                                <div class="cert-logo">PromptQuest</div>
                                <div class="cert-subtitle">The Prompt Engineering Dojo</div>
                            </div>
                            <div class="cert-title">Certificate of Completion</div>
                            <div class="cert-body">
                                <p class="cert-presented">This certificate is presented to</p>
                                <p class="cert-name">${this.escapeHtml(playerName || 'Prompt Engineer')}</p>
                                <p class="cert-description">for successfully completing all 20 levels of PromptQuest,</p>
                                <p class="cert-description">demonstrating proficiency in professional prompt engineering.</p>
                            </div>
                            <div class="cert-stats">
                                <div class="cert-stat">
                                    <span class="cert-stat-value">${totalStars}/${maxStars}</span>
                                    <span class="cert-stat-label">Stars Earned</span>
                                </div>
                                <div class="cert-stat">
                                    <span class="cert-stat-value">${percentage}%</span>
                                    <span class="cert-stat-label">Score</span>
                                </div>
                                <div class="cert-stat">
                                    <span class="cert-stat-value">${grade}</span>
                                    <span class="cert-stat-label">Grade</span>
                                </div>
                            </div>
                            <div class="cert-zones">
                                ${zoneStars.map(z => `
                                    <div class="cert-zone">
                                        <span class="cert-zone-name">${z.name}</span>
                                        <span class="cert-zone-stars">${'★'.repeat(z.stars)}${'☆'.repeat(z.max - z.stars)}</span>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="cert-footer">
                                <div class="cert-date">${date}</div>
                                <div class="cert-creator">Created by Bharath Kumar | SWAI</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="certificate-actions-bottom">
                    <button class="btn btn-primary" data-target="screen-map">Back to Game</button>
                </div>
            </div>
        `;

        // Download as image
        document.getElementById('cert-download-btn').addEventListener('click', () => {
            this.downloadAsImage(playerName || 'Prompt Engineer');
        });

        // Copy share text
        document.getElementById('cert-share-btn').addEventListener('click', () => {
            const text = `I completed PromptQuest: The Prompt Engineering Dojo! ${totalStars}/${maxStars} stars (${percentage}%) - Grade: ${grade}. Train your prompt engineering skills at https://bharathp9.github.io/promptquest`;
            navigator.clipboard.writeText(text).then(() => {
                const btn = document.getElementById('cert-share-btn');
                btn.textContent = 'Copied!';
                setTimeout(() => { btn.innerHTML = '&#128227; Copy Share Text'; }, 2000);
            });
        });

        Game.showScreen('screen-certificate');
    },

    calculateZoneStars() {
        return ZONES.map(zone => {
            const zoneLevels = LEVELS.filter(l => l.zone === zone.id);
            const stars = zoneLevels.reduce((sum, l) => sum + (Game.state.progress[l.id]?.stars || 0), 0);
            return { name: zone.name, stars, max: zoneLevels.length * 3 };
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

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    downloadAsImage(playerName) {
        const frame = document.getElementById('certificate-frame');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const scale = 2; // High DPI

        canvas.width = 800 * scale;
        canvas.height = 600 * scale;
        ctx.scale(scale, scale);

        // Background
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, 800, 600);

        // Border
        ctx.strokeStyle = '#4a9eff';
        ctx.lineWidth = 3;
        ctx.strokeRect(20, 20, 760, 560);

        // Inner border
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 1;
        ctx.strokeRect(30, 30, 740, 540);

        // Header
        ctx.fillStyle = '#4a9eff';
        ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PROMPTQUEST', 400, 70);

        ctx.fillStyle = '#a0a0b8';
        ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText('The Prompt Engineering Dojo', 400, 95);

        // Title
        ctx.fillStyle = '#e8e8f0';
        ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText('Certificate of Completion', 400, 150);

        // Body
        ctx.fillStyle = '#a0a0b8';
        ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText('This certificate is presented to', 400, 200);

        ctx.fillStyle = '#e8e8f0';
        ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(playerName || 'Prompt Engineer', 400, 245);

        ctx.fillStyle = '#a0a0b8';
        ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText('for successfully completing all 20 levels of PromptQuest,', 400, 290);
        ctx.fillText('demonstrating proficiency in professional prompt engineering.', 400, 315);

        // Stats
        const totalStars = Game.state.totalStars;
        const maxStars = 60;
        const percentage = Math.round((totalStars / maxStars) * 100);
        const grade = this.getGrade(percentage);

        ctx.fillStyle = '#4a9eff';
        ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(`${totalStars}/${maxStars} Stars`, 250, 380);
        ctx.fillText(`${percentage}% Score`, 400, 380);
        ctx.fillText(`Grade: ${grade}`, 550, 380);

        // Zone breakdown
        const zoneStars = this.calculateZoneStars();
        ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
        let yPos = 420;
        zoneStars.forEach(z => {
            ctx.fillStyle = '#6a6a80';
            ctx.textAlign = 'left';
            ctx.fillText(`${z.name}: ${'★'.repeat(z.stars)}${'☆'.repeat(z.max - z.stars)}`, 100, yPos);
            yPos += 20;
        });

        // Footer
        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        ctx.fillStyle = '#6a6a80';
        ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(date, 250, 540);
        ctx.fillText('Created by Bharath Kumar | SWAI', 550, 540);

        // Download
        const link = document.createElement('a');
        link.download = `promptquest-certificate-${(playerName || 'student').replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Show toast
        if (Gallery) Gallery.showToast('Certificate downloaded!');
    }
};
