// PromptQuest - Game Engine
// State management, navigation, scoring, and progression

const Game = {
    state: {
        currentScreen: 'screen-map',
        currentZone: null,
        currentLevel: null,
        progress: {}, // { "1-1": { completed: true, stars: 3 }, ... }
        totalStars: 0,
        levelsCompleted: 0
    },

    init() {
        this.loadProgress();
        this.renderMap();
        this.updateStats();
        this.bindEvents();
    },

    // Load progress from localStorage
    loadProgress() {
        try {
            const saved = localStorage.getItem('promptquest_progress');
            if (saved) {
                const data = JSON.parse(saved);
                this.state.progress = data.progress || {};
                this.state.totalStars = data.totalStars || 0;
                this.state.levelsCompleted = data.levelsCompleted || 0;
            }
        } catch (e) {
            console.warn('Could not load progress:', e);
        }
    },

    // Save progress to localStorage
    saveProgress() {
        try {
            localStorage.setItem('promptquest_progress', JSON.stringify({
                progress: this.state.progress,
                totalStars: this.state.totalStars,
                levelsCompleted: this.state.levelsCompleted
            }));
        } catch (e) {
            console.warn('Could not save progress:', e);
        }
    },

    // Reset all progress
    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            this.state.progress = {};
            this.state.totalStars = 0;
            this.state.levelsCompleted = 0;
            localStorage.removeItem('promptquest_progress');
            this.updateStats();
            this.renderMap();
            this.showScreen('screen-map');
        }
    },

    // Update header stats display
    updateStats() {
        document.getElementById('total-stars').textContent = this.state.totalStars;
        document.getElementById('levels-completed').textContent = this.state.levelsCompleted;
    },

    // Show a specific screen
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        this.state.currentScreen = screenId;
        window.scrollTo(0, 0);
    },

    // Render the world map with all 5 zones
    renderMap() {
        const map = document.getElementById('world-map');
        map.innerHTML = '';

        ZONES.forEach(zone => {
            const zoneLevels = LEVELS.filter(l => l.zone === zone.id);
            const completedCount = zoneLevels.filter(l => this.state.progress[l.id]?.completed).length;
            const isCompleted = completedCount === zoneLevels.length;
            const isUnlocked = zone.id === 1 || this.state.progress[`${zone.id - 1}-4`]?.completed;

            const card = document.createElement('div');
            card.className = `zone-card ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`;
            card.dataset.zone = zone.id;

            const badgeClass = isCompleted ? 'completed' : (isUnlocked ? 'available' : 'locked');
            const badgeText = isCompleted ? 'Completed' : (isUnlocked ? 'Available' : 'Locked');

            card.innerHTML = `
                <div class="zone-header">
                    <span class="zone-name">${zone.icon} ${zone.name}</span>
                    <span class="zone-badge ${badgeClass}">${badgeText}</span>
                </div>
                <p class="zone-desc">${zone.description}</p>
                <div class="zone-progress">
                    ${zoneLevels.map((l, i) => {
                        const completed = this.state.progress[l.id]?.completed;
                        const isCurrent = !completed && (i === 0 || this.state.progress[zoneLevels[i-1].id]?.completed);
                        return `<div class="progress-dot ${completed ? 'completed' : ''} ${isCurrent ? 'current' : ''}"></div>`;
                    }).join('')}
                </div>
            `;

            if (isUnlocked) {
                card.addEventListener('click', () => this.showZoneLevels(zone.id));
            }

            map.appendChild(card);
        });
    },

    // Show level select for a zone
    showZoneLevels(zoneId) {
        this.state.currentZone = zoneId;
        const zone = ZONES.find(z => z.id === zoneId);
        const zoneLevels = LEVELS.filter(l => l.zone === zoneId);

        const header = document.getElementById('zone-header');
        header.innerHTML = `<h2>${zone.icon} ${zone.name}</h2><p>${zone.description}</p>`;

        const grid = document.getElementById('level-grid');
        grid.innerHTML = '';

        zoneLevels.forEach((level, index) => {
            const prevLevel = index > 0 ? zoneLevels[index - 1] : null;
            const isUnlocked = !prevLevel || this.state.progress[prevLevel.id]?.completed;
            const progress = this.state.progress[level.id];
            const isCompleted = progress?.completed;

            const card = document.createElement('div');
            card.className = `level-card ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`;
            card.dataset.zone = zoneId;

            const stars = progress ? '★'.repeat(progress.stars) + '☆'.repeat(3 - progress.stars) : '☆☆☆';

            card.innerHTML = `
                <div class="level-number">${level.number}</div>
                <div class="level-title">${level.title}</div>
                <div class="level-stars">${isCompleted ? stars : (!isUnlocked ? '🔒' : '☆☆☆')}</div>
            `;

            if (isUnlocked) {
                card.addEventListener('click', () => this.startLevel(level));
            }

            grid.appendChild(card);
        });

        this.showScreen('screen-levels');
    },

    // Start a level
    startLevel(level) {
        this.state.currentLevel = level;
        Components.hideFeedback();

        document.getElementById('game-title').textContent = `Level ${level.zone}-${level.number}: ${level.title}`;
        document.getElementById('game-stars').textContent = '';

        const body = document.getElementById('game-body');
        body.innerHTML = '';

        // Show scenario
        const scenario = document.createElement('div');
        scenario.className = 'scenario-text';
        scenario.innerHTML = `<strong>Scenario:</strong> ${level.scenario}`;
        body.appendChild(scenario);

        // Render challenge based on type
        const onAnswer = (isCorrect, userAnswer) => {
            this.handleAnswer(level, isCorrect, userAnswer);
        };

        let challengeEl;
        switch (level.type) {
            case 'multiple-choice':
                challengeEl = Components.createMultipleChoice(level, onAnswer);
                break;
            case 'compare-choice':
                challengeEl = Components.createCompareChoice(level, onAnswer);
                break;
            case 'fill-blank':
                challengeEl = Components.createFillBlank(level, onAnswer);
                break;
            case 'drag-drop':
                challengeEl = Components.createDragDrop(level, onAnswer);
                break;
        }

        if (challengeEl) {
            body.appendChild(challengeEl);
        }

        // Show hint button
        const hintBtn = document.createElement('button');
        hintBtn.className = 'btn btn-ghost btn-small';
        hintBtn.textContent = '💡 Hint (-1 star)';
        hintBtn.style.marginTop = '12px';
        hintBtn.addEventListener('click', () => {
            if (!body.querySelector('.hint-box')) {
                body.appendChild(Components.createHint(level.explanation));
                hintBtn.disabled = true;
            }
        });
        body.appendChild(hintBtn);

        this.showScreen('screen-game');
    },

    // Handle answer submission
    handleAnswer(level, isCorrect, userAnswer) {
        const hasHint = document.querySelector('.hint-box') !== null;
        let stars = 0;

        if (isCorrect) {
            stars = hasHint ? 2 : 3;
            Components.showFeedback('success',
                `<strong>Correct!</strong> ${stars === 3 ? 'Perfect -- 3 stars!' : 'Good job -- 2 stars (hint used)'}<br><br>${level.explanation}`
            );
        } else {
            Components.showFeedback('error',
                `<strong>Not quite.</strong><br><br>${level.explanation}`
            );
        }

        // Update progress
        const existing = this.state.progress[level.id];
        if (!existing || stars > existing.stars) {
            this.state.progress[level.id] = {
                completed: isCorrect,
                stars: existing ? Math.max(existing.stars, stars) : stars
            };
        }

        // Recalculate totals
        this.recalculateTotals();
        this.saveProgress();
        this.updateStats();

        // Show action buttons
        const zoneLevels = LEVELS.filter(l => l.zone === level.zone);
        const currentIndex = zoneLevels.findIndex(l => l.id === level.id);
        const nextLevel = zoneLevels[currentIndex + 1];
        const isLastInZone = currentIndex === zoneLevels.length - 1;

        const buttons = [];

        if (!isCorrect) {
            buttons.push({
                label: 'Try Again',
                class: 'btn-secondary',
                onClick: () => this.startLevel(level)
            });
        }

        if (nextLevel) {
            buttons.push({
                label: 'Next Level',
                class: 'btn-primary',
                onClick: () => this.startLevel(nextLevel)
            });
        } else if (isCorrect) {
            buttons.push({
                label: 'Zone Complete!',
                class: 'btn-primary',
                onClick: () => this.showVictory(level.zone)
            });
        }

        buttons.push({
            label: 'Back to Levels',
            class: 'btn-ghost',
            onClick: () => this.showZoneLevels(level.zone)
        });

        Components.createActions(buttons);
    },

    // Recalculate total stars and completed levels
    recalculateTotals() {
        let totalStars = 0;
        let completed = 0;
        Object.values(this.state.progress).forEach(p => {
            totalStars += p.stars || 0;
            if (p.completed) completed++;
        });
        this.state.totalStars = totalStars;
        this.state.levelsCompleted = completed;
    },

    // Show zone victory screen
    showVictory(zoneId) {
        const zone = ZONES.find(z => z.id === zoneId);
        const zoneLevels = LEVELS.filter(l => l.zone === zoneId);
        const zoneStars = zoneLevels.reduce((sum, l) => sum + (this.state.progress[l.id]?.stars || 0), 0);
        const maxStars = zoneLevels.length * 3;

        document.getElementById('victory-stars').textContent = '★'.repeat(zoneStars) + '☆'.repeat(maxStars - zoneStars);
        document.getElementById('victory-message').textContent =
            `You completed ${zone.name}! ${zoneStars}/${maxStars} stars earned.`;

        this.showScreen('screen-victory');
    },

    // Bind global events
    bindEvents() {
        // Back buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('back-btn')) {
                const target = e.target.dataset.target;
                if (target) {
                    if (target === 'screen-levels' && this.state.currentZone) {
                        this.showZoneLevels(this.state.currentZone);
                    } else {
                        this.showScreen(target);
                    }
                }
            }
        });

        // Victory screen button
        document.addEventListener('click', (e) => {
            if (e.target.dataset.target === 'screen-map') {
                this.renderMap();
                this.showScreen('screen-map');
            }
        });

        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => this.resetProgress());
    }
};

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => Game.init());
