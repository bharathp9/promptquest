// PromptQuest Gamification Integration Layer
// Bridges game.js with gamification systems

const GameIntegration = {
  // Track current level state
  currentLevel: null,
  currentAttempts: 0,
  currentLevelPoints: 0,
  questionStartTime: 0,

  // Initialize integration (just set the flag, game.js will call functions directly)
  init() {
    console.log('✅ GameIntegration system ready');
  },

  // Initialize the integration (called from game.js)
  hookGameMethods() {
    console.log('✅ GameIntegration ready for direct calls from game.js');
  },

  // ========== EVENT HANDLERS ==========

  // Called when level menu opens
  onLevelMenuOpen(level) {
    this.currentLevel = level;
    this.currentAttempts = 0;
    this.currentLevelPoints = 0;
  },

  // Called when level starts (quiz begins)
  onLevelStart(level) {
    this.currentLevel = level;
    this.currentAttempts = 0;
    this.currentLevelPoints = 0;
    this.questionStartTime = Date.now();

    // Initialize game
    document.dispatchEvent(new CustomEvent('game-start', {
      detail: {
        zoneId: level.zone,
        levelNumber: level.number,
        levelId: level.id,
      }
    }));

    // Update UI with current state
    setTimeout(() => {
      UIDisplay.updateHeaderStats();
      UIDisplay.updateStreakDisplay();
    }, 100);
  },

  // Called when answer is submitted
  onAnswerSubmitted(level, isCorrect, userAnswer) {
    this.currentAttempts++;
    const zoneId = level.zone;
    const levelId = level.id;

    if (isCorrect) {
      this.onCorrectAnswer(level, zoneId, levelId);
    } else {
      this.onWrongAnswer(level, zoneId, levelId, userAnswer);
    }

    // Track quiz history
    this.trackQuestionAnswer(level, isCorrect, userAnswer);
  },

  // Called when player answers correctly
  onCorrectAnswer(level, zoneId, levelId) {
    // Calculate points
    const pointsData = Points.calculateForCorrectAnswer(
      this.currentAttempts,
      zoneId,
      Streak.isSessionStreakActive(),
      Streak.dailyStreak
    );

    console.log(`[Points Debug] Attempts: ${this.currentAttempts}, Zone: ${zoneId}, Calculated:`, pointsData);

    this.currentLevelPoints += pointsData.finalPoints;
    console.log(`[Points Debug] Current Level Points now: ${this.currentLevelPoints}`);

    // Update streak
    const streakResult = Streak.onCorrectAnswer();

    // Animate correct answer (find the option element)
    const optionElement = document.querySelector('.option.selected') ||
                         document.querySelector('[data-correct="true"]');
    const description = Points.getPointDescription(pointsData);

    if (optionElement) {
      UIDisplay.showCorrectAnswerFeedback(optionElement, pointsData, description);
    }

    // Dispatch event for tracking
    document.dispatchEvent(new CustomEvent('answer-selected', {
      detail: {
        isCorrect: true,
        zoneId: zoneId,
        levelId: levelId,
        attempts: this.currentAttempts,
        pointsData: pointsData,
      }
    }));

    // Check for level completion badges
    const badges = Badges.checkLevelCompleteBadges(zoneId, level.number, pointsData.finalPoints / 3, pointsData.finalPoints);
    badges.forEach(badge => {
      if (badge.unlocked) {
        AnimateCelebrate.showBadgeUnlock(badge.badge);
        Analytics.trackBadgeUnlock(badgeId, 'question_answered');
      }
    });

    // Update UI
    UIDisplay.updateHeaderStats();
    UIDisplay.updateStreakDisplay();
  },

  // Called when player answers incorrectly
  onWrongAnswer(level, zoneId, levelId, userAnswer) {
    // Update streak (resets session streak)
    const streakResult = Streak.onWrongAnswer();

    // Get explanation
    const explanation = level.explanation || 'Try again!';

    // Find wrong option element
    const wrongOption = document.querySelector(`[data-answer="${userAnswer}"]`);
    if (wrongOption) {
      UIDisplay.showWrongAnswerFeedback(wrongOption, explanation);
    }

    // Dispatch event for tracking
    document.dispatchEvent(new CustomEvent('answer-selected', {
      detail: {
        isCorrect: false,
        zoneId: zoneId,
        levelId: levelId,
        attempts: this.currentAttempts,
        userAnswer: userAnswer,
        correctAnswer: level.correctAnswer,
      }
    }));

    // Show notification if streak was broken
    if (streakResult.wasStreakActive) {
      UIDisplay.showNotification('Streak reset. Try again!', 'info');
    }

    // Update streak display
    UIDisplay.updateStreakDisplay();
  },

  // Handle level completion
  onLevelComplete(level, stars) {
    const zoneId = level.zone;
    const levelNumber = level.number;

    console.log(`[Level Complete Debug] Level: ${level.id}, Stars: ${stars}, Points: ${this.currentLevelPoints}`);

    // Update progress
    const progressResult = Progress.updateLevel(zoneId, levelNumber, stars, this.currentLevelPoints);

    // Show level complete notification
    UIDisplay.showLevelComplete(stars, this.currentLevelPoints);

    // Check for zone completion
    if (Progress.isZoneComplete(zoneId)) {
      this.onZoneComplete(zoneId, level);
    }

    // Dispatch event
    document.dispatchEvent(new CustomEvent('level-completed', {
      detail: {
        zoneId: zoneId,
        levelNumber: levelNumber,
        stars: stars,
        pointsEarned: this.currentLevelPoints,
      }
    }));

    // Analytics
    Analytics.trackLevelComplete({
      zone: zoneId,
      level: levelNumber,
      stars: stars,
      totalPointsEarned: this.currentLevelPoints,
      timeSpentMs: Date.now() - this.questionStartTime,
    });

    // Update UI
    UIDisplay.updateHeaderStats();
    UIDisplay.displayAllZoneProgress();
  },

  // Handle zone completion
  onZoneComplete(zoneId, level) {
    const zone = Progress.getZone(zoneId);

    // Check for zone badges
    const badges = Badges.checkZoneCompleteBadges(zoneId);
    badges.forEach(badge => {
      if (badge.unlocked) {
        AnimateCelebrate.showBadgeUnlock(badge.badge);
        Analytics.trackBadgeUnlock(badge.badgeId, 'zone_completed');
      }
    });

    // Show victory screen
    AnimateCelebrate.showZoneVictory(zoneId, {
      zoneStars: zone.stars,
      maxZoneStars: zone.maxStars,
      totalPoints: this.currentLevelPoints,
      accuracy: this.calculateZoneAccuracy(zoneId),
    });

    // Dispatch event
    document.dispatchEvent(new CustomEvent('zone-completed', {
      detail: {
        zoneId: zoneId,
        stats: {
          zoneStars: zone.stars,
          maxZoneStars: zone.maxStars,
          totalPoints: this.currentLevelPoints,
          accuracy: this.calculateZoneAccuracy(zoneId),
        }
      }
    }));

    // Analytics
    Analytics.trackZoneComplete(zoneId, {
      totalStars: zone.stars,
      totalPoints: this.currentLevelPoints,
    });

    // Update UI
    UIDisplay.updateHeaderStats();
    UIDisplay.displayAllZoneProgress();
    UIDisplay.displayBadges();
  },

  // ========== UTILITY METHODS ==========

  // Track question answer for quiz history
  trackQuestionAnswer(level, isCorrect, userAnswer) {
    // This data can be used for analytics/reports later
    const questionData = {
      levelId: level.id,
      zone: level.zone,
      timestamp: Date.now(),
      correct: isCorrect,
      userAnswer: userAnswer,
      correctAnswer: level.correctAnswer,
    };

    // Store for later analytics (optional)
    if (!window.questionHistory) window.questionHistory = [];
    window.questionHistory.push(questionData);
  },

  // Calculate zone accuracy
  calculateZoneAccuracy(zoneId) {
    // Get all levels in zone
    const zoneLevels = GameConfig.ZONES.find(z => z.id === zoneId);
    if (!zoneLevels) return 0;

    let correct = 0;
    let total = zoneLevels.levels;

    for (let i = 1; i <= zoneLevels.levels; i++) {
      const level = Progress.getLevel(zoneId, i);
      if (level.stars > 0) correct++;
    }

    return Math.round((correct / total) * 100);
  },

  // Get current player stats
  getStats() {
    return GameificationInit.getPlayerStats();
  },

  // Hook into Game progress save
  syncGameProgress() {
    // Sync Game.state.totalStars and Game.state.levelsCompleted with gamification system
    const stats = this.getStats();
    Game.state.totalStars = stats.totalStars;
    Game.state.levelsCompleted = stats.levelsCompleted;
    Game.saveProgress();
  },
};

// Initialize when document loads
document.addEventListener('DOMContentLoaded', () => {
  GameIntegration.init();
});

// Expose for testing
window.GameIntegration = GameIntegration;
