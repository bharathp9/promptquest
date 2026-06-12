// PromptQuest Gamification System - Initialization
// This module initializes all gamification systems

const GameificationInit = {
  initialized: false,

  // Initialize all gamification systems
  init() {
    if (this.initialized) return;

    console.log('✅ Initializing PromptQuest Gamification System...');

    // 1. Initialize storage-based systems
    Progress.init();
    Streak.init();
    Badges.init();

    // 2. Setup event listeners
    this.setupEventListeners();

    // 3. Update UI with current state
    this.updateUIState();

    // 4. Setup analytics
    console.log('✅ Gamification initialized. User:', Analytics.userId);

    this.initialized = true;
  },

  // Setup event listeners for game events
  setupEventListeners() {
    // Listen for correct/wrong answer events
    document.addEventListener('answer-selected', (e) => {
      const { isCorrect, zoneId, levelId, attempts, pointsData } = e.detail;

      if (isCorrect) {
        this.onCorrectAnswer(zoneId, levelId, attempts, pointsData);
      } else {
        this.onWrongAnswer(zoneId, levelId);
      }
    });

    // Listen for level completion
    document.addEventListener('level-completed', (e) => {
      const { zoneId, levelNumber, stars, pointsEarned } = e.detail;
      this.onLevelComplete(zoneId, levelNumber, stars, pointsEarned);
    });

    // Listen for zone completion
    document.addEventListener('zone-completed', (e) => {
      const { zoneId, stats } = e.detail;
      this.onZoneComplete(zoneId, stats);
    });

    // Refresh streaks on game start
    document.addEventListener('game-start', () => {
      Streak.checkDailyReset();
      this.updateStreakDisplay();
    });
  },

  // Handle correct answer
  onCorrectAnswer(zoneId, levelId, attempts, pointsData) {
    // Update streak
    const streakResult = Streak.onCorrectAnswer();

    // Update display
    UIDisplay.showCorrectAnswerFeedback(
      document.querySelector(`[data-question-id="${levelId}"]`),
      pointsData,
      Points.getPointDescription(pointsData)
    );

    // Check for badges
    const levelBadges = Badges.checkLevelCompleteBadges(zoneId, parseInt(levelId.split('-')[1]), pointsData.finalPoints / 3, pointsData.finalPoints);
    const streakBadges = Badges.checkStreakBadges();

    [...levelBadges, ...streakBadges].forEach(badge => {
      if (badge.unlocked) {
        AnimateCelebrate.showBadgeUnlock(badge.badge);
      }
    });

    // Track analytics
    Analytics.trackCorrectAnswer({
      zone: zoneId,
      level: levelId,
      attempts: attempts,
      pointsEarned: pointsData.finalPoints,
      streakActive: Streak.isSessionStreakActive(),
    });

    // Update UI
    this.updateUIState();
  },

  // Handle wrong answer
  onWrongAnswer(zoneId, levelId) {
    // Update streak
    const streakResult = Streak.onWrongAnswer();

    // Show notification if streak was broken
    if (streakResult.wasStreakActive) {
      UIDisplay.showNotification('Streak broken! Start again.', 'info');
    }

    // Track analytics
    Analytics.trackWrongAnswer({
      zone: zoneId,
      level: levelId,
    });

    // Update UI
    this.updateStreakDisplay();
  },

  // Handle level completion
  onLevelComplete(zoneId, levelNumber, stars, pointsEarned) {
    // Update progress
    const progressResult = Progress.updateLevel(zoneId, levelNumber, stars, pointsEarned);

    // Show level completion
    UIDisplay.showLevelComplete(stars, pointsEarned);

    // Track analytics
    Analytics.trackLevelComplete({
      zone: zoneId,
      level: levelNumber,
      stars: stars,
      totalPointsEarned: pointsEarned,
    });

    // Check if zone is complete
    if (Progress.isZoneComplete(zoneId)) {
      // Calculate accuracy for this zone
      const zoneLevels = LEVELS.filter(l => l.zone === zoneId);
      const zoneProgress = Game.state.progress;
      const correctAnswers = zoneLevels.filter(l => zoneProgress[l.id]?.completed).length;
      const accuracy = zoneLevels.length > 0 ? Math.round((correctAnswers / zoneLevels.length) * 100) : 0;

      this.onZoneComplete(zoneId, {
        zoneStars: Progress.getZone(zoneId).stars,
        maxZoneStars: Progress.getZone(zoneId).maxStars,
        totalPoints: pointsEarned,
        accuracy: accuracy,
      });
    }

    // Update UI
    this.updateUIState();
  },

  // Handle zone completion
  onZoneComplete(zoneId, stats) {
    // Check for zone badge
    const zoneBadges = Badges.checkZoneCompleteBadges(zoneId);
    zoneBadges.forEach(badge => {
      if (badge.unlocked) {
        AnimateCelebrate.showBadgeUnlock(badge.badge);
      }
    });

    // Show victory screen
    AnimateCelebrate.showZoneVictory(zoneId, stats);

    // Track analytics
    Analytics.trackZoneComplete(zoneId, stats);

    // Update UI
    this.updateUIState();
  },

  // Update UI state based on current progress
  updateUIState() {
    UIDisplay.updateHeaderStats();
    UIDisplay.updateStreakDisplay();
    UIDisplay.displayAllZoneProgress();
    UIDisplay.displayBadges();
    UIDisplay.displayProgressPercentage();
  },

  // Update streak display
  updateStreakDisplay() {
    UIDisplay.updateStreakDisplay();
  },

  // Get current player stats
  getPlayerStats() {
    const progress = Progress.getAllProgress();
    const streak = Streak.getData();
    const badges = Badges.getData();

    return {
      totalStars: progress.totalStars,
      levelsCompleted: progress.levelsCompleted,
      percentageComplete: progress.percentageComplete,
      sessionStreak: streak.sessionStreak,
      dailyStreak: streak.dailyStreak,
      badgesUnlocked: badges.count,
      ...progress,
      ...streak,
      ...badges,
    };
  },

  // Reset all data (admin/testing)
  resetAllData() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      Progress.resetProgress();
      Streak.resetSession();
      Badges.resetBadges();
      this.updateUIState();
      alert('All progress has been reset.');
    }
  },
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for other scripts to load
  setTimeout(() => {
    GameificationInit.init();
  }, 200);
});

// Also expose global functions for easy access
window.initializeGameification = () => GameificationInit.init();
window.getGameStats = () => GameificationInit.getPlayerStats();
window.resetGameProgress = () => GameificationInit.resetAllData();
