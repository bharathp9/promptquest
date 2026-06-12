// LocalStorage management with JSON serialization
const Storage = {
  // Save data
  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Storage save error:', e);
      return false;
    }
  },

  // Load data
  load(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Storage load error:', e);
      return defaultValue;
    }
  },

  // Remove data
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Storage remove error:', e);
      return false;
    }
  },

  // Clear all game data
  clearAllData() {
    Object.values(GameConfig.STORAGE_KEYS).forEach(key => this.remove(key));
  },

  // Get progress data structure
  getProgressData() {
    return this.load(GameConfig.STORAGE_KEYS.PROGRESS, {
      progress: {}, // { '1-1': { stars: 3, completed: true }, ... }
      totalStars: 0,
      levelsCompleted: 0,
      lastUpdated: Date.now(),
    });
  },

  // Save progress data
  saveProgressData(progressData) {
    return this.save(GameConfig.STORAGE_KEYS.PROGRESS, progressData);
  },

  // Get streak data
  getStreakData() {
    return {
      session: this.load(GameConfig.STORAGE_KEYS.SESSION_STREAK, 0),
      daily: this.load(GameConfig.STORAGE_KEYS.DAILY_STREAK, 0),
      lastPlayDate: this.load(GameConfig.STORAGE_KEYS.LAST_PLAY_DATE, null),
    };
  },

  // Save streak data
  saveStreakData(sessionStreak, dailyStreak, lastPlayDate) {
    this.save(GameConfig.STORAGE_KEYS.SESSION_STREAK, sessionStreak);
    this.save(GameConfig.STORAGE_KEYS.DAILY_STREAK, dailyStreak);
    this.save(GameConfig.STORAGE_KEYS.LAST_PLAY_DATE, lastPlayDate);
  },

  // Get badges
  getBadges() {
    return this.load(GameConfig.STORAGE_KEYS.BADGES, {});
  },

  // Save badges
  saveBadges(badges) {
    return this.save(GameConfig.STORAGE_KEYS.BADGES, badges);
  },

  // Get total stars
  getTotalStars() {
    return this.load(GameConfig.STORAGE_KEYS.TOTAL_STARS, 0);
  },

  // Save total stars
  saveTotalStars(total) {
    return this.save(GameConfig.STORAGE_KEYS.TOTAL_STARS, total);
  },
};
