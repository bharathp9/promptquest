// Streak tracking system (session + daily)
const Streak = {
  sessionStreak: 0,
  dailyStreak: 0,
  lastPlayDate: null,

  // Initialize streak from storage
  init() {
    const data = Storage.getStreakData();
    this.sessionStreak = data.session || 0;
    this.dailyStreak = data.daily || 0;
    this.lastPlayDate = data.lastPlayDate;
    this.checkDailyReset();
  },

  // Check if daily streak should reset
  checkDailyReset() {
    const today = new Date().toDateString();

    if (!this.lastPlayDate) {
      // First play ever
      this.lastPlayDate = today;
      this.dailyStreak = 0;
      return;
    }

    if (this.lastPlayDate === today) {
      // Already played today, no reset
      return;
    }

    // Different day - check if consecutive
    const lastDate = new Date(this.lastPlayDate);
    const currentDate = new Date();
    const dayDifference = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));

    if (dayDifference === 1) {
      // Consecutive day, increment
      this.dailyStreak++;
    } else {
      // Gap detected, reset
      this.dailyStreak = 1;
    }

    this.lastPlayDate = today;
    this.save();
  },

  // On correct answer
  onCorrectAnswer() {
    this.sessionStreak++;
    this.save();
    return {
      sessionStreak: this.sessionStreak,
      dailyStreak: this.dailyStreak,
      isNewDailyDay: this.lastPlayDate === new Date().toDateString(),
    };
  },

  // On wrong answer
  onWrongAnswer() {
    const wasStreakActive = this.sessionStreak > 0;
    this.sessionStreak = 0;
    this.save();
    return {
      sessionStreak: 0,
      dailyStreak: this.dailyStreak,
      wasStreakActive,
    };
  },

  // Check if daily streak multiplier is active
  isDailyMultiplierActive() {
    return this.dailyStreak >= GameConfig.STREAK.DAILY_MULTIPLIER_THRESHOLD;
  },

  // Check if session streak is active
  isSessionStreakActive() {
    return this.sessionStreak > 0;
  },

  // Save streak to storage
  save() {
    Storage.saveStreakData(this.sessionStreak, this.dailyStreak, this.lastPlayDate);
  },

  // Get display text for streak
  getStreakDisplay() {
    return {
      session: this.sessionStreak.toString(),
      daily: this.dailyStreak.toString(),
      dailyMultiplierActive: this.isDailyMultiplierActive(),
    };
  },

  // Reset session streak (for level/zone completion)
  resetSession() {
    this.sessionStreak = 0;
    this.save();
  },

  // Get streak data
  getData() {
    return {
      sessionStreak: this.sessionStreak,
      dailyStreak: this.dailyStreak,
      lastPlayDate: this.lastPlayDate,
    };
  },

  // Check badge unlock conditions
  checkBadgeUnlocks() {
    const unlockedBadges = [];

    if (this.dailyStreak === 10) {
      unlockedBadges.push(GameConfig.BADGES.MASTER_STREAK.id);
    }
    if (this.dailyStreak === 20) {
      unlockedBadges.push(GameConfig.BADGES.UNSTOPPABLE.id);
    }
    if (this.dailyStreak === 30) {
      unlockedBadges.push(GameConfig.BADGES.LEGENDARY.id);
    }

    return unlockedBadges;
  },
};
