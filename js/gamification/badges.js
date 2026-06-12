// Badge/achievement system
const Badges = {
  unlockedBadges: {},

  // Initialize badges from storage
  init() {
    this.unlockedBadges = Storage.getBadges() || {};
  },

  // Check if badge is unlocked
  isUnlocked(badgeId) {
    return !!this.unlockedBadges[badgeId];
  },

  // Unlock a badge
  unlock(badgeId) {
    if (this.isUnlocked(badgeId)) {
      return {
        unlocked: false,
        badgeId,
        reason: 'already_unlocked',
      };
    }

    this.unlockedBadges[badgeId] = {
      badgeId,
      unlockedAt: Date.now(),
    };

    this.save();

    return {
      unlocked: true,
      badgeId,
      badge: this.getBadgeInfo(badgeId),
    };
  },

  // Get badge info
  getBadgeInfo(badgeId) {
    return Object.values(GameConfig.BADGES).find(b => b.id === badgeId);
  },

  // Get all unlocked badges
  getUnlockedBadges() {
    return Object.keys(this.unlockedBadges).map(badgeId => this.getBadgeInfo(badgeId));
  },

  // Count unlocked badges
  getUnlockedCount() {
    return Object.keys(this.unlockedBadges).length;
  },

  // Check badges on level completion
  checkLevelCompleteBadges(zoneId, levelNumber, stars, pointsEarned) {
    const unlockedBadges = [];

    // First Step badge
    if (this.getUnlockedCount() === 0) {
      const result = this.unlock(GameConfig.BADGES.FIRST_STEP.id);
      if (result.unlocked) unlockedBadges.push(result);
    }

    // Flawless badge (3 stars on level)
    if (stars === 3) {
      const result = this.unlock(GameConfig.BADGES.FLAWLESS.id);
      if (result.unlocked) unlockedBadges.push(result);
    }

    return unlockedBadges;
  },

  // Check badges on zone completion
  checkZoneCompleteBadges(zoneId) {
    const unlockedBadges = [];

    const zoneBadgeMap = {
      1: GameConfig.BADGES.ZONE_PIONEER.id,
      2: GameConfig.BADGES.TECHNIQUE_MASTER.id,
      3: GameConfig.BADGES.REFINEMENT_EXPERT.id,
      4: GameConfig.BADGES.PITFALL_NAVIGATOR.id,
      5: GameConfig.BADGES.PROMPT_ENGINEER.id,
    };

    if (zoneBadgeMap[zoneId]) {
      const result = this.unlock(zoneBadgeMap[zoneId]);
      if (result.unlocked) unlockedBadges.push(result);
    }

    return unlockedBadges;
  },

  // Check streak-based badges (called from Streak module)
  checkStreakBadges() {
    const unlockedBadges = [];

    if (Streak.dailyStreak === 10) {
      const result = this.unlock(GameConfig.BADGES.MASTER_STREAK.id);
      if (result.unlocked) unlockedBadges.push(result);
    }

    if (Streak.dailyStreak === 20) {
      const result = this.unlock(GameConfig.BADGES.UNSTOPPABLE.id);
      if (result.unlocked) unlockedBadges.push(result);
    }

    if (Streak.dailyStreak === 30) {
      const result = this.unlock(GameConfig.BADGES.LEGENDARY.id);
      if (result.unlocked) unlockedBadges.push(result);
    }

    return unlockedBadges;
  },

  // Save badges to storage
  save() {
    Storage.saveBadges(this.unlockedBadges);
  },

  // Get badges data
  getData() {
    return {
      unlockedBadges: this.unlockedBadges,
      count: this.getUnlockedCount(),
      allBadges: Object.values(GameConfig.BADGES),
    };
  },

  // Reset badges (admin/testing)
  resetBadges() {
    this.unlockedBadges = {};
    this.save();
  },
};
