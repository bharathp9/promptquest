// Progress tracking system
const Progress = {
  progressData: {},
  totalStars: 0,

  // Initialize progress from storage
  init() {
    const data = Storage.getProgressData();
    this.progressData = data.progress || {};
    this.totalStars = data.totalStars || 0;
  },

  // Update progress for a level
  updateLevel(zoneId, levelNumber, stars, pointsEarned = 0) {
    const levelId = `${zoneId}-${levelNumber}`;

    // Ensure entry exists
    if (!this.progressData[levelId]) {
      this.progressData[levelId] = {
        stars: 0,
        completed: false,
        attempts: 0,
        bestScore: 0,
        firstCompletedAt: Date.now(),
      };
    }

    // Update stars (only if higher)
    const oldStars = this.progressData[levelId].stars;
    if (stars > oldStars) {
      this.totalStars += stars - oldStars;
      this.progressData[levelId].stars = stars;
    }

    // Mark as completed if stars > 0
    if (stars > 0) {
      this.progressData[levelId].completed = true;
    }

    this.progressData[levelId].attempts++;
    this.progressData[levelId].bestScore = Math.max(
      this.progressData[levelId].bestScore || 0,
      pointsEarned
    );
    this.progressData[levelId].lastCompletedAt = Date.now();

    this.save();

    return {
      levelId,
      stars,
      oldStars,
      totalStars: this.totalStars,
      isLevelNew: oldStars === 0,
    };
  },

  // Get level progress
  getLevel(zoneId, levelNumber) {
    const levelId = `${zoneId}-${levelNumber}`;
    return this.progressData[levelId] || { stars: 0, completed: false };
  },

  // Get zone progress
  getZone(zoneId) {
    const zoneLevels = GameConfig.ZONES.find(z => z.id === zoneId);
    if (!zoneLevels) return null;

    let zoneStars = 0;
    let completedLevels = 0;

    for (let i = 1; i <= zoneLevels.levels; i++) {
      const level = this.getLevel(zoneId, i);
      zoneStars += level.stars || 0;
      if (level.completed) completedLevels++;
    }

    return {
      zoneId,
      name: zoneLevels.name,
      completedLevels,
      totalLevels: zoneLevels.levels,
      stars: zoneStars,
      maxStars: zoneLevels.levels * 3,
      isComplete: completedLevels === zoneLevels.levels,
    };
  },

  // Get all progress
  getAllProgress() {
    const zoneProgress = GameConfig.ZONES.map(zone => this.getZone(zone.id));
    const levelsCompleted = Object.values(this.progressData).filter(l => l.completed).length;

    return {
      zoneProgress,
      totalStars: this.totalStars,
      levelsCompleted,
      totalLevels: 20,
      percentageComplete: Math.round((levelsCompleted / 20) * 100),
    };
  },

  // Check if a zone is complete
  isZoneComplete(zoneId) {
    const zone = this.getZone(zoneId);
    return zone && zone.isComplete;
  },

  // Get zone completion percentage
  getZonePercentage(zoneId) {
    const zone = this.getZone(zoneId);
    if (!zone) return 0;
    return Math.round((zone.completedLevels / zone.totalLevels) * 100);
  },

  // Save progress to storage
  save() {
    const data = {
      progress: this.progressData,
      totalStars: this.totalStars,
      lastUpdated: Date.now(),
    };
    Storage.saveProgressData(data);
  },

  // Get total stars
  getTotalStars() {
    return this.totalStars;
  },

  // Get levels completed
  getLevelsCompleted() {
    return Object.values(this.progressData).filter(l => l.completed).length;
  },

  // Reset all progress (admin/testing)
  resetProgress() {
    this.progressData = {};
    this.totalStars = 0;
    this.save();
  },
};
