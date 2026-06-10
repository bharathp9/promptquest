// PromptQuest Game Engine
// Handles state, navigation, scoring, and UI rendering

const Game = {
  state: {
    currentScreen: 'map', // 'map' | 'levels' | 'game' | 'result'
    currentZone: null,
    currentLevel: null,
    progress: {}, // { '1-1': { completed: true, stars: 3 }, ... }
    totalStars: 0,
    totalLevels: 20
  },

  init() {
    this.loadProgress();
    this.render();
  },

  // ---- STATE MANAGEMENT ----
  loadProgress() {
    try {
      const saved = localStorage.getItem('promptquest_progress');
      if (saved) {
        this.state.progress = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load progress:', e);
    }
    this.calculateTotalStars();
  },

  saveProgress() {
    try {
      localStorage.setItem('promptquest_progress', JSON.stringify(this.state.progress));
    } catch (e) {
      console.warn('Could not save progress:', e);
    }
    this.calculateTotalStars();
  },

  calculateTotalStars() {
    let total = 0;
    for (const key in this.state.progress) {
      if (this.state.progress[key].completed) {
        total += this.state.progress[key].stars || 0;
      }
    }
    this.state.totalStars = total;
  },

  getLevelProgress(levelId) {
    return this.state.progress[levelId] || { completed: false, stars: 0 };
  },

  completeLevel(levelId, stars) {
    const existing = this.state.progress[levelId];
    if (!existing || stars > existing.stars) {
      this.state.progress[levelId] = { completed: true, stars: stars };
    }
    this.saveProgress();
  },

  isZoneUnlocked(zoneId) {
    if (zoneId === 1) return true;
    // Zone N is unlocked when all levels in zone N-1 are completed
    const prevZoneLevels = LEVELS.filter(l => l.zone === zoneId - 1);
    return prevZoneLevels.every(l => this.getLevelProgress(l.id).completed);
  },

  isLevelUnlocked(level) {
    if (level.zone === 1 && level.id === '1-1') return true;
    // Find the previous level
    const allLevels = LEVELS;
    const idx = allLevels.indexOf(level);
    if (idx <= 0) return true;
    const prevLevel = allLevels[idx - 1];
    return this.getLevelProgress(prevLevel.id).completed;
  },

  getZoneProgress(zoneId) {
    const zoneLevels = LEVELS.filter(l => l.zone === zoneId);
    const completed = zoneLevels.filter(l => this.getLevelProgress(l.id).completed).length;
    const stars = zoneLevels.reduce((sum, l) => sum + (this.getLevelProgress(l.id).stars || 0), 0);
    const maxStars = zoneLevels.length * 3;
    return { completed, total: zoneLevels.length, stars, maxStars };
  },

  // ---- NAVIGATION ----
  showMap() {
    this.state.currentScreen = 'map';
    this.state.currentZone = null;
    this.state.currentLevel = null;
    this.render();
  },

  showLevels(zoneId) {
    if (!this.isZoneUnlocked(zoneId)) return;
    this.state.currentScreen = 'levels';
    this.state.currentZone = zoneId;
    this.render();
  },

  showGame(levelId) {
    const level = LEVELS.find(l => l.id === levelId);
    if (!level || !this.isLevelUnlocked(level)) return;
    this.state.currentScreen = 'game';
    this.state.currentLevel = level;
    this.render();
  },

  showResult(stars, explanation) {
    this.state.currentScreen = 'result';
    this.state.resultStars = stars;
    this.state.resultExplanation = explanation;
    this.render();
  },

  // ---- RENDERING ----
  render() {
    const app = document.getElementById('app');
    if (!app) return;

    switch (this.state.currentScreen) {
      case 'map':
        app.innerHTML = this.renderHeader() + this.renderMap();
        break;
      case 'levels':
        app.innerHTML = this.renderHeader() + this.renderLevels();
        break;
      case 'game':
        app.innerHTML = this.renderHeader() + this.renderGame();
        break;
      case 'result':
        app.innerHTML = this.renderHeader() + this.renderResult();
        break;
    }
  },

  renderHeader() {
    return `
      <header class="header">
        <div class="header-brand">
          <div class="logo">PQ</div>
          <div>
            <h1>PromptQuest</h1>
            <span>The Prompt Engineering Dojo</span>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat">
            <span class="icon">⭐</span>
            <span class="value">${this.state.totalStars}</span>
            <span>/ ${this.state.totalLevels * 3}</span>
          </div>
          <div class="stat">
            <span class="icon">✅</span>
            <span>${Object.values(this.state.progress).filter(p => p.completed).length}</span>
            <span>/ ${this.state.totalLevels}</span>
          </div>
        </div>
      </header>
    `;
  },

  renderMap() {
    const zonesHtml = ZONES.map(zone => {
      const progress = this.getZoneProgress(zone.id);
      const unlocked = this.isZoneUnlocked(zone.id);
      const completed = progress.completed === progress.total;
      const starsDisplay = '⭐'.repeat(progress.stars) + '☆'.repeat(progress.maxStars - progress.stars);

      return `
        <div class="zone-card ${unlocked ? '' : 'locked'} ${completed ? 'completed' : ''}"
             data-zone="${zone.id}"
             onclick="Game.showLevels(${zone.id})">
          ${!unlocked ? '<div class="zone-lock-icon">🔒</div>' : ''}
          <div class="zone-icon">${zone.icon}</div>
          <div class="zone-name">${zone.name}</div>
          <div class="zone-desc">${zone.desc}</div>
          <div class="zone-progress">
            <span>${progress.completed}/${progress.total} levels</span>
            <span class="zone-stars">${starsDisplay}</span>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="screen active">
        <h2 style="margin-bottom:8px; font-size:22px;">World Map</h2>
        <p style="color:var(--text-secondary); margin-bottom:24px; font-size:14px;">
          Master prompt engineering through 5 zones. Complete each zone to unlock the next.
        </p>
        <div class="world-map">${zonesHtml}</div>
      </div>
    `;
  },

  renderLevels() {
    const zone = ZONES.find(z => z.id === this.state.currentZone);
    const levels = LEVELS.filter(l => l.zone === this.state.currentZone);

    const levelsHtml = levels.map(level => {
      const unlocked = this.isLevelUnlocked(level);
      const progress = this.getLevelProgress(level.id);
      const starsDisplay = progress.completed
        ? '⭐'.repeat(progress.stars) + '☆'.repeat(3 - progress.stars)
        : '☆☆☆';

      return `
        <div class="level-card ${unlocked ? '' : 'locked'} ${progress.completed ? 'completed' : ''}"
             data-zone="${level.zone}"
             onclick="Game.showGame('${level.id}')">
          <div class="level-number">${level.id}</div>
          <div class="level-title">${level.title}</div>
          <div class="level-stars">${starsDisplay}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="screen active">
        <div class="level-select-header">
          <button class="back-btn" onclick="Game.showMap()">← Back to Map</button>
          <div>
            <h2 style="font-size:20px;">${zone.icon} ${zone.name}</h2>
            <p style="color:var(--text-secondary); font-size:13px;">${zone.desc}</p>
          </div>
        </div>
        <div class="levels-grid">${levelsHtml}</div>
      </div>
    `;
  },

  renderGame() {
    const level = this.state.currentLevel;
    if (!level) return '';

    const progress = ((LEVELS.indexOf(level) + 1) / LEVELS.length * 100).toFixed(0);

    return `
      <div class="screen active">
        <div class="game-container">
          <div class="game-header">
            <button class="back-btn" onclick="Game.showLevels(${level.zone})">← ${level.zoneName}</button>
            <div class="game-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width:${progress}%"></div>
              </div>
              <span style="font-size:12px; color:var(--text-muted);">${level.id}</span>
            </div>
            <button class="hint-btn" onclick="Game.toggleHint()">💡 Hint</button>
          </div>

          <div class="scenario-card fade-in">
            <div class="scenario-label">Scenario</div>
            <div class="scenario-text">${level.scenario}</div>
          </div>

          <div class="hint-text" id="hintText">💡 ${level.hint}</div>

          <div class="challenge-area fade-in" id="challengeArea">
            <div class="challenge-instruction">${level.question}</div>
            ${this.renderChallenge(level)}
          </div>

          <div class="feedback" id="feedback"></div>

          <div class="game-actions">
            <button class="btn btn-primary" id="submitBtn" onclick="Game.submitAnswer()">
              Check Answer
            </button>
            <button class="btn btn-secondary" id="skipBtn" onclick="Game.skipLevel()">
              Skip →
            </button>
          </div>
        </div>
      </div>
    `;
  },

  renderChallenge(level) {
    switch (level.challenge) {
      case 'multiple_choice':
        return `
          <div class="choice-list" id="choiceList">
            ${level.options.map((opt, i) => `
              <div class="choice-item" data-index="${i}" onclick="Game.selectChoice(${i})">
                <div class="choice-marker">${String.fromCharCode(65 + i)}</div>
                <div>${opt}</div>
              </div>
            `).join('')}
          </div>
        `;

      case 'compare_prompts':
        return `
          <div class="prompt-compare">
            <div class="prompt-option" data-option="a" onclick="Game.selectPrompt('a')">
              <div class="prompt-option-label">Prompt A</div>
              <div class="prompt-option-text">${level.promptA}</div>
            </div>
            <div class="prompt-option" data-option="b" onclick="Game.selectPrompt('b')">
              <div class="prompt-option-label">Prompt B</div>
              <div class="prompt-option-text">${level.promptB}</div>
            </div>
          </div>
        `;

      case 'drag_drop':
        // Shuffle items
        const shuffled = [...level.items].sort(() => Math.random() - 0.5);
        return `
          <div style="margin-bottom:12px;">
            <p style="font-size:13px; color:var(--text-secondary); margin-bottom:8px;">Drag items to the correct order:</p>
            <div class="drag-container" id="dragSource">
              ${shuffled.map(item => `
                <div class="drag-item" draggable="true" data-id="${item.id}"
                     ondragstart="Game.handleDragStart(event)"
                     ondragend="Game.handleDragEnd(event)">
                  ${item.text}
                </div>
              `).join('')}
            </div>
          </div>
          <div>
            <p style="font-size:13px; color:var(--text-secondary); margin-bottom:8px;">Drop here in order:</p>
            <div class="drop-zone" id="dropZone"
                 ondragover="Game.handleDragOver(event)"
                 ondragleave="Game.handleDragLeave(event)"
                 ondrop="Game.handleDrop(event)">
              <span class="drop-zone-placeholder">Drop items here in the correct order</span>
            </div>
          </div>
        `;

      case 'fill_blanks':
        return `
          <div class="fill-blank-container">
            ${level.blanks.map((blank, i) => `
              <div class="fill-blank-item">
                <label class="fill-blank-label">${blank.label}:</label>
                <input type="text" class="fill-blank-input" id="blank_${i}"
                       placeholder="Enter your answer..."
                       data-answer="${blank.answer}">
              </div>
            `).join('')}
          </div>
        `;

      case 'spot_bug':
        const bugQuestionText = level.question.replace("You wrote this prompt. What's WRONG with it?\n\n", '');
        return `
          <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:16px; margin-bottom:12px;">
            <p style="font-size:13px; color:var(--text-secondary); margin-bottom:8px; white-space:pre-wrap;">${bugQuestionText}</p>
          </div>
          <textarea id="bugInput" rows="4" class="fill-blank-input" style="width:100%; min-height:100px; resize:vertical;"
                    placeholder="Describe the problem(s) with this prompt..."></textarea>
        `;

      default:
        return '<p>Unknown challenge type</p>';
    }
  },

  renderResult() {
    const stars = this.state.resultStars || 0;
    const explanation = this.state.resultExplanation || '';
    const level = this.state.currentLevel;

    let title, subtitle;
    if (stars === 3) {
      title = 'Perfect!';
      subtitle = 'You nailed it. Full marks!';
    } else if (stars === 2) {
      title = 'Great job!';
      subtitle = 'Almost perfect -- review the explanation to improve.';
    } else if (stars === 1) {
      title = 'Good effort!';
      subtitle = 'You got the basics. Check the explanation for tips.';
    } else {
      title = 'Keep practicing!';
      subtitle = 'Review the explanation and try again.';
    }

    const starsDisplay = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    const isLastLevel = LEVELS.indexOf(level) === LEVELS.length - 1;
    const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];

    return `
      <div class="screen active">
        <div class="result-container fade-in">
          <div class="result-stars star-pop">${starsDisplay}</div>
          <div class="result-title">${title}</div>
          <div class="result-subtitle">${subtitle}</div>

          <div class="result-explanation">
            <h4>What you learned</h4>
            <p>${explanation}</p>
          </div>

          <div class="game-actions">
            <button class="btn btn-secondary" onclick="Game.showLevels(${level.zone})">
              ← Back to Levels
            </button>
            ${!isLastLevel ? `
              <button class="btn btn-primary" onclick="Game.showGame('${nextLevel.id}')">
                Next Level →
              </button>
            ` : `
              <button class="btn btn-success" onclick="Game.showMap()">
                🏆 View World Map
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  },

  // ---- GAME INTERACTIONS ----
  toggleHint() {
    const hint = document.getElementById('hintText');
    if (hint) hint.classList.toggle('show');
  },

  // Multiple choice
  selectedChoice: null,
  selectChoice(index) {
    this.selectedChoice = index;
    document.querySelectorAll('.choice-item').forEach((el, i) => {
      el.classList.toggle('selected', i === index);
    });
  },

  // Prompt comparison
  selectedPrompt: null,
  selectPrompt(option) {
    this.selectedPrompt = option;
    document.querySelectorAll('.prompt-option').forEach(el => {
      el.classList.toggle('selected', el.dataset.option === option);
    });
  },

  // Drag and drop
  draggedItem: null,
  dropOrder: [],

  handleDragStart(e) {
    this.draggedItem = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  },

  handleDragEnd(e) {
    e.target.classList.remove('dragging');
    this.draggedItem = null;
  },

  handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  },

  handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
  },

  handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (!this.draggedItem) return;

    const dropZone = e.currentTarget;
    const placeholder = dropZone.querySelector('.drop-zone-placeholder');
    if (placeholder) placeholder.remove();

    // If item came from drop zone, remove from old position
    if (this.draggedItem.parentElement === dropZone) return;

    // Clone and add to drop zone
    const clone = this.draggedItem.cloneNode(true);
    clone.classList.add('placed');
    clone.draggable = true;
    clone.addEventListener('dragstart', (ev) => this.handleDragStart(ev));
    clone.addEventListener('dragend', (ev) => this.handleDragEnd(ev));

    // Allow dragging back
    clone.addEventListener('dblclick', () => {
      const source = document.getElementById('dragSource');
      if (source) {
        source.appendChild(this.draggedItem);
        clone.remove();
        // Restore placeholder if empty
        if (!dropZone.children.length) {
          dropZone.innerHTML = '<span class="drop-zone-placeholder">Drop items here in the correct order</span>';
        }
      }
    });

    dropZone.appendChild(clone);
    this.draggedItem.style.display = 'none';
  },

  // ---- ANSWER CHECKING ----
  submitAnswer() {
    const level = this.state.currentLevel;
    let correct = false;
    let stars = 0;

    switch (level.challenge) {
      case 'multiple_choice':
        if (this.selectedChoice === null) {
          this.showFeedback('info', 'Please select an answer first.');
          return;
        }
        correct = this.selectedChoice === level.correct;
        // Highlight correct/incorrect
        document.querySelectorAll('.choice-item').forEach((el, i) => {
          if (i === level.correct) el.classList.add('correct');
          else if (i === this.selectedChoice && !correct) el.classList.add('incorrect');
        });
        break;

      case 'compare_prompts':
        if (!this.selectedPrompt) {
          this.showFeedback('info', 'Please select a prompt first.');
          return;
        }
        correct = this.selectedPrompt === level.correct;
        document.querySelectorAll('.prompt-option').forEach(el => {
          if (el.dataset.option === level.correct) el.classList.add('correct');
          else if (el.dataset.option === this.selectedPrompt && !correct) el.classList.add('incorrect');
        });
        break;

      case 'drag_drop':
        const dropZone = document.getElementById('dropZone');
        const placed = dropZone.querySelectorAll('.drag-item');
        if (placed.length < level.correctOrder.length) {
          this.showFeedback('info', 'Please place all items in order first.');
          return;
        }
        const userOrder = Array.from(placed).map(el => el.dataset.id);
        correct = JSON.stringify(userOrder) === JSON.stringify(level.correctOrder);
        // Highlight
        placed.forEach((el, i) => {
          if (userOrder[i] === level.correctOrder[i]) el.classList.add('correct');
          else el.classList.add('incorrect');
        });
        break;

      case 'fill_blanks':
        const inputs = document.querySelectorAll('.fill-blank-input');
        let allCorrect = true;
        let anyEmpty = false;
        inputs.forEach((input, i) => {
          const userAnswer = input.value.trim().toLowerCase();
          const correctAnswer = input.dataset.answer.toLowerCase();
          if (!userAnswer) { anyEmpty = true; return; }
          if (userAnswer === correctAnswer || correctAnswer.includes(userAnswer) || userAnswer.includes(correctAnswer)) {
            input.classList.add('correct');
          } else {
            input.classList.add('incorrect');
            allCorrect = false;
          }
        });
        if (anyEmpty) {
          this.showFeedback('info', 'Please fill in all blanks.');
          return;
        }
        correct = allCorrect;
        break;

      case 'spot_bug':
        const bugInput = document.getElementById('bugInput');
        if (!bugInput || bugInput.value.trim().length < 10) {
          this.showFeedback('info', 'Please describe the problem(s) in at least a few words.');
          return;
        }
        // For spot-the-bug, we accept any reasonable answer (AI would judge, but we use keyword matching)
        const answer = bugInput.value.toLowerCase();
        const keywords = level.bug.toLowerCase().split(' ').filter(w => w.length > 4);
        const matchCount = keywords.filter(kw => answer.includes(kw)).length;
        const matchRatio = matchCount / keywords.length;
        correct = matchRatio > 0.15; // At least 15% keyword match
        break;
    }

    // Calculate stars
    if (correct) {
      stars = 3;
      this.showFeedback('success', 'Correct! Well done.');
    } else {
      stars = 1;
      this.showFeedback('error', 'Not quite right. Check the explanation below.');
    }

    // Disable submit
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) submitBtn.disabled = true;

    // Save progress and show result after delay
    setTimeout(() => {
      this.completeLevel(level.id, stars);
      this.showResult(stars, level.explanation);
    }, 1500);
  },

  skipLevel() {
    const level = this.state.currentLevel;
    this.showResult(0, level.explanation);
  },

  showFeedback(type, message) {
    const fb = document.getElementById('feedback');
    if (!fb) return;
    fb.className = `feedback show ${type}`;
    fb.innerHTML = `<span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span><span>${message}</span>`;
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => Game.init());
