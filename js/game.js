// PromptQuest - Game Engine
// State management, navigation, scoring, progression, learn mode, and quiz summary

const Game = {
    state: {
        currentScreen: 'screen-map',
        currentZone: null,
        currentLevel: null,
        progress: {}, // { "1-1": { completed: true, stars: 3, learned: true }, ... }
        totalStars: 0,
        levelsCompleted: 0,
        learnedLevels: new Set(), // track which levels the user has studied
        quizHistory: [], // track answers for summary: [{ levelId, correct, concept }]
        playerName: '' // locked name for certificate -- reset to change
    },

    init() {
        this.loadProgress();
        this.renderMap();
        this.updateStats();
        this.bindEvents();
        this._checkNameOnStart();
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
                this.state.learnedLevels = new Set(data.learnedLevels || []);
                this.state.quizHistory = data.quizHistory || [];
                this.state.playerName = data.playerName || '';
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
                levelsCompleted: this.state.levelsCompleted,
                learnedLevels: Array.from(this.state.learnedLevels),
                quizHistory: this.state.quizHistory,
                playerName: this.state.playerName
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
            this.state.learnedLevels = new Set();
            this.state.quizHistory = [];
            this.state.playerName = '';
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

        // Check if all levels completed - show completion banner
        const allCompleted = ZONES.every(z => {
            const lvls = LEVELS.filter(l => l.zone === z.id);
            return lvls.every(l => this.state.progress[l.id]?.completed);
        });

        const banner = document.getElementById('completion-banner');
        if (allCompleted && this.state.levelsCompleted === 20) {
            const totalStars = this.state.totalStars;
            const percentage = Math.round((totalStars / 60) * 100);
            banner.classList.remove('hidden');
            banner.innerHTML = `
                <h3>All 20 Levels Completed!</h3>
                <p>Final Score: ${totalStars}/60 stars (${percentage}%)</p>
                <button class="btn btn-primary" id="banner-cert-btn">Get Your Certificate</button>
            `;
            document.getElementById('banner-cert-btn').addEventListener('click', () => {
                if (!Game.state.playerName) {
                    Game._promptForName(() => {
                        Certificate.show(Game.state.playerName);
                    });
                } else {
                    Certificate.show(Game.state.playerName);
                }
            });
        } else {
            banner.classList.add('hidden');
        }

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
            const hasLearned = this.state.learnedLevels.has(level.id);

            const card = document.createElement('div');
            card.className = `level-card ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`;
            card.dataset.zone = zoneId;

            const stars = progress ? '★'.repeat(progress.stars) + '☆'.repeat(3 - progress.stars) : '☆☆☆';

            card.innerHTML = `
                <div class="level-number">${level.number}</div>
                <div class="level-title">${level.title}</div>
                <div class="level-stars">${isCompleted ? stars : (!isUnlocked ? '🔒' : '☆☆☆')}</div>
                ${hasLearned && !isCompleted ? '<div class="learned-badge">📖 Studied</div>' : ''}
            `;

            if (isUnlocked) {
                card.addEventListener('click', () => this.showLevelMenu(level));
            }

            grid.appendChild(card);
        });

        this.showScreen('screen-levels');
    },

    // Show level menu (Learn or Quiz)
    showLevelMenu(level) {
        this.state.currentLevel = level;
        const hasLearned = this.state.learnedLevels.has(level.id);
        const progress = this.state.progress[level.id];
        const isCompleted = progress?.completed;

        document.getElementById('game-title').textContent = `Level ${level.zone}-${level.number}: ${level.title}`;
        document.getElementById('game-stars').textContent = '';

        const body = document.getElementById('game-body');
        body.innerHTML = '';

        // Level menu card
        const menu = document.createElement('div');
        menu.className = 'level-menu';

        let statusHtml = '';
        if (isCompleted) {
            const stars = '★'.repeat(progress.stars) + '☆'.repeat(3 - progress.stars);
            statusHtml = `<div class="level-status completed">Completed: ${stars}</div>`;
        } else if (hasLearned) {
            statusHtml = `<div class="level-status studied">You have studied this lesson</div>`;
        } else {
            statusHtml = `<div class="level-status new">New -- start by learning the concept</div>`;
        }

        menu.innerHTML = `
            <div class="level-menu-header">
                <h3>${level.title}</h3>
                <p class="level-type">${this._formatType(level.type)}</p>
                ${statusHtml}
            </div>
            <div class="level-menu-actions">
                <button class="btn btn-secondary btn-learn" id="menu-learn-btn">
                    📖 ${hasLearned ? 'Review Lesson' : 'Learn First'}
                </button>
                <button class="btn btn-primary btn-quiz" id="menu-quiz-btn">
                    ⚡ ${isCompleted ? 'Retake Quiz' : 'Take Quiz'}
                </button>
            </div>
            ${!hasLearned ? '<p class="menu-tip">Tip: Study the lesson first to get a better score.</p>' : ''}
        `;

        body.appendChild(menu);

        document.getElementById('menu-learn-btn').addEventListener('click', () => {
            this.showLearn(level);
        });

        document.getElementById('menu-quiz-btn').addEventListener('click', () => {
            this.startLevel(level);
        });

        this.showScreen('screen-game');
    },

    // Show learn screen for a level
    showLearn(level) {
        this.state.currentLevel = level;
        this.state.learnedLevels.add(level.id);
        this.saveProgress();

        document.getElementById('game-title').textContent = `Learn: ${level.title}`;
        document.getElementById('game-stars').textContent = '';

        const body = document.getElementById('game-body');
        body.innerHTML = '';

        const lesson = level.lesson;
        if (!lesson) {
            body.innerHTML = '<p>No lesson content available for this level.</p>';
            this.showScreen('screen-game');
            return;
        }

        // Concept card
        const conceptCard = document.createElement('div');
        conceptCard.className = 'learn-concept';
        conceptCard.innerHTML = `
            <h3>💡 Key Concept</h3>
            <p>${lesson.concept}</p>
        `;
        body.appendChild(conceptCard);

        // Key points
        const pointsCard = document.createElement('div');
        pointsCard.className = 'learn-points';
        pointsCard.innerHTML = `
            <h3>📌 What to Remember</h3>
            <ul>
                ${lesson.keyPoints.map(p => `<li>${p}</li>`).join('')}
            </ul>
        `;
        body.appendChild(pointsCard);

        // Example comparison
        const exampleCard = document.createElement('div');
        exampleCard.className = 'learn-example';
        exampleCard.innerHTML = `
            <h3>📝 Example</h3>
            <div class="example-comparison">
                <div class="example-bad">
                    <span class="example-label">❌ Weak Prompt</span>
                    <code>${lesson.example.bad}</code>
                </div>
                <div class="example-good">
                    <span class="example-label">✅ Strong Prompt</span>
                    <code>${lesson.example.good}</code>
                </div>
            </div>
            <p class="example-why"><strong>Why it works:</strong> ${lesson.example.why}</p>
        `;
        body.appendChild(exampleCard);

        // Common mistake
        const mistakeCard = document.createElement('div');
        mistakeCard.className = 'learn-mistake';
        mistakeCard.innerHTML = `
            <h3>⚠️ Common Mistake</h3>
            <p>${lesson.commonMistake}</p>
        `;
        body.appendChild(mistakeCard);

        // Action buttons
        const actions = document.createElement('div');
        actions.className = 'learn-actions';
        actions.innerHTML = `
            <button class="btn btn-secondary" id="learn-back-btn">← Back</button>
            <button class="btn btn-primary" id="learn-quiz-btn">Take the Quiz →</button>
        `;
        body.appendChild(actions);

        document.getElementById('learn-back-btn').addEventListener('click', () => {
            this.showZoneLevels(level.zone);
        });

        document.getElementById('learn-quiz-btn').addEventListener('click', () => {
            this.startLevel(level);
        });

        this.showScreen('screen-game');
    },

    // Start a level (quiz mode)
    startLevel(level) {
        this.state.currentLevel = level;
        Components.hideFeedback();

        // Clear previous buttons
        document.getElementById('game-actions').innerHTML = '';

        // Notify gamification system
        if (window.GameIntegration) {
            GameIntegration.onLevelStart(level);
        }

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
        }

        // Track quiz history for summary
        this.state.quizHistory.push({
            levelId: level.id,
            correct: isCorrect,
            concept: level.lesson ? level.lesson.concept : level.title,
            explanation: level.explanation
        });
        // Keep only last 50 entries
        if (this.state.quizHistory.length > 50) {
            this.state.quizHistory = this.state.quizHistory.slice(-50);
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

        // Notify gamification system about the answer
        if (window.GameIntegration) {
            GameIntegration.onAnswerSubmitted(level, isCorrect, userAnswer);

            // Trigger gamification level completion when answer is correct
            if (isCorrect) {
                GameIntegration.onLevelComplete(level, stars);
            }
        }

        // Build feedback with learning summary
        this._showAnswerFeedback(level, isCorrect, stars, hasHint);
    },

    // Show answer feedback with learning summary
    _showAnswerFeedback(level, isCorrect, stars, hasHint) {
        const zoneLevels = LEVELS.filter(l => l.zone === level.zone);
        const currentIndex = zoneLevels.findIndex(l => l.id === level.id);
        const nextLevel = zoneLevels[currentIndex + 1];
        const isLastInZone = currentIndex === zoneLevels.length - 1;

        // Build the summary panel
        let summaryHtml = '';
        if (level.lesson) {
            summaryHtml = `
                <div class="answer-summary">
                    <h4>📚 What You ${isCorrect ? 'Got Right' : 'Should Know'}</h4>
                    <p class="summary-concept">${level.lesson.concept}</p>
                    <div class="summary-points">
                        ${level.lesson.keyPoints.slice(0, 2).map(p => `<span class="summary-point">• ${p}</span>`).join('')}
                    </div>
                </div>
            `;
        }

        if (isCorrect) {
            const starText = stars === 3 ? 'Perfect -- 3 stars!' : 'Good job -- 2 stars (hint used)';
            Components.showFeedback('success',
                `<strong>Correct!</strong> ${starText}<br><br>${level.explanation}${summaryHtml}`
            );
        } else {
            Components.showFeedback('error',
                `<strong>Not quite.</strong><br><br>${level.explanation}${summaryHtml}`
            );
        }

        // Show action buttons
        const buttons = [];

        if (!isCorrect) {
            buttons.push({
                label: 'Try Again',
                class: 'btn-secondary',
                onClick: () => this.startLevel(level)
            });
            if (level.lesson) {
                buttons.push({
                    label: '📖 Review Lesson',
                    class: 'btn-ghost',
                    onClick: () => this.showLearn(level)
                });
            }
            // Show answer and allow moving on
            buttons.push({
                label: 'Show Answer & Continue →',
                class: 'btn-ghost',
                onClick: () => this._showAnswerAndContinue(level, isLastInZone, nextLevel)
            });
        } else if (isCorrect) {
            // Show next button for correct answers
            if (isLastInZone) {
                buttons.push({
                    label: 'See Zone Result →',
                    class: 'btn-primary',
                    onClick: () => this.showVictory(level.zone)
                });
            } else {
                buttons.push({
                    label: 'Next Challenge →',
                    class: 'btn-primary',
                    onClick: () => this.startLevel(nextLevel)
                });
            }
        }

        buttons.push({
            label: 'Back to Levels',
            class: 'btn-ghost',
            onClick: () => this.showZoneLevels(level.zone)
        });

        Components.createActions(buttons);
    },

    // Show the correct answer and allow user to continue
    _showAnswerAndContinue(level, isLastInZone, nextLevel) {
        const body = document.getElementById('game-body');

        // Build answer display
        let answerHtml = `
            <div class="show-answer-panel">
                <h4>📖 The Correct Answer</h4>
                <p class="show-answer-text">${level.explanation}</p>
                ${level.lesson ? `<p class="show-answer-concept"><strong>Key concept:</strong> ${level.lesson.concept}</p>` : ''}
            </div>
        `;

        body.insertAdjacentHTML('beforeend', answerHtml);

        // Replace action buttons with just Continue
        const actions = document.getElementById('game-actions');
        actions.innerHTML = '';

        if (isLastInZone) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'btn btn-primary';
            nextBtn.textContent = 'See Zone Result →';
            nextBtn.addEventListener('click', () => this.showVictory(level.zone));
            actions.appendChild(nextBtn);
        } else {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'btn btn-primary';
            nextBtn.textContent = 'Next Level →';
            nextBtn.addEventListener('click', () => this.startLevel(nextLevel));
            actions.appendChild(nextBtn);
        }

        const backBtn = document.createElement('button');
        backBtn.className = 'btn btn-ghost';
        backBtn.textContent = 'Back to Levels';
        backBtn.addEventListener('click', () => this.showZoneLevels(level.zone));
        actions.appendChild(backBtn);
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

        // Check if all zones completed
        const allCompleted = ZONES.every(z => {
            const lvls = LEVELS.filter(l => l.zone === z.id);
            return lvls.every(l => this.state.progress[l.id]?.completed);
        });

        // Build victory message fresh each time (not appending)
        let msg = `You completed ${zone.name}! ${zoneStars}/${maxStars} stars earned.`;

        // Add learning summary for the zone
        const zoneConcepts = zoneLevels
            .filter(l => this.state.progress[l.id]?.completed && l.lesson)
            .map(l => `<li>${l.lesson.concept}</li>`)
            .join('');

        if (zoneConcepts) {
            msg += `<div class="victory-summary"><h4>What you learned in this zone:</h4><ul>${zoneConcepts}</ul></div>`;
        }

        if (allCompleted) {
            msg += '<br><br><strong>Congratulations! You have mastered all 5 zones!</strong>';
        }
        document.getElementById('victory-message').innerHTML = msg;

        // Remove any previously added certificate button
        const existingCertBtn = document.querySelector('#victory-cert-btn');
        if (existingCertBtn) existingCertBtn.remove();

        if (allCompleted) {
            const certBtn = document.createElement('button');
            certBtn.id = 'victory-cert-btn';
            certBtn.className = 'btn btn-primary';
            certBtn.textContent = 'Get Your Certificate';
            certBtn.style.marginTop = '16px';
            certBtn.addEventListener('click', () => {
                if (!Game.state.playerName) {
                    Game._promptForName(() => {
                        Certificate.show(Game.state.playerName);
                    });
                } else {
                    Certificate.show(Game.state.playerName);
                }
            });
            document.querySelector('.victory-content').appendChild(certBtn);
        }

        // Update the continue button text
        const continueBtn = document.querySelector('.victory-content .btn-primary[data-target="screen-map"]');
        if (continueBtn) continueBtn.textContent = allCompleted ? 'Back to Map' : 'Continue Journey';

        this.showScreen('screen-victory');
    },

    // Helper: format question type for display
    _formatType(type) {
        const labels = {
            'multiple-choice': 'Multiple Choice',
            'compare-choice': 'Compare Two Options',
            'fill-blank': 'Fill in the Blank',
            'drag-drop': 'Put in Order'
        };
        return labels[type] || type;
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

        // Gallery button
        document.getElementById('gallery-btn').addEventListener('click', () => {
            Gallery.init();
            this.showScreen('screen-gallery');
        });

        // Certificate button
        document.getElementById('cert-btn').addEventListener('click', () => {
            const allCompleted = ZONES.every(z => {
                const lvls = LEVELS.filter(l => l.zone === z.id);
                return lvls.every(l => Game.state.progress[l.id]?.completed);
            });
            if (!allCompleted) {
                const remaining = LEVELS.filter(l => !Game.state.progress[l.id]?.completed).length;
                alert(`Complete all levels first! You have ${remaining} level(s) remaining.`);
                return;
            }
            // If name not set, prompt for it first
            if (!Game.state.playerName) {
                Game._promptForName(() => {
                    Certificate.show(Game.state.playerName);
                });
            } else {
                Certificate.show(Game.state.playerName);
            }
        });
    },

    // Check if we need to ask for name on start (if they have progress but no name)
    _checkNameOnStart() {
        // If they have completed levels but no name stored, prompt for name
        if (this.state.levelsCompleted > 0 && !this.state.playerName) {
            this._promptForName();
        }
    },

    // Prompt user for their name (non-blocking callback version)
    _promptForName(callback) {
        const name = prompt('Enter your name for the certificate:');
        if (name && name.trim()) {
            this.state.playerName = name.trim();
            this.saveProgress();
            if (callback) callback();
        }
    }
};

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => Game.init());
