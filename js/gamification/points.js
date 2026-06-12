// Points calculation system
const Points = {
  // Calculate points for correct answer
  calculateForCorrectAnswer(attempts, zone, streakActive, totalDailyStreak) {
    console.log(`[Points] Calculating: attempts=${attempts}, zone=${zone}, streakActive=${streakActive}, dailyStreak=${totalDailyStreak}`);
    console.log(`[Points] GameConfig.POINTS:`, GameConfig.POINTS);

    let basePoints = GameConfig.POINTS.BASE_3_STARS;
    console.log(`[Points] basePoints after init: ${basePoints}`);

    // Adjust for attempts
    if (attempts > 1) {
      basePoints = Math.max(1, GameConfig.POINTS.BASE_3_STARS - (attempts - 1));
      console.log(`[Points] basePoints after attempt adjustment: ${basePoints}`);
    }

    let multiplier = 1.0;

    // Streak multiplier (daily streak >= 5)
    if (streakActive && totalDailyStreak >= GameConfig.STREAK.DAILY_MULTIPLIER_THRESHOLD) {
      multiplier *= GameConfig.POINTS.MULTIPLIER_STREAK_5PLUS;
      console.log(`[Points] Applied streak multiplier: ${multiplier}`);
    }

    // Difficulty multiplier (zones 4-5 are harder)
    if (zone >= 4) {
      multiplier *= GameConfig.POINTS.MULTIPLIER_DIFFICULTY_ZONE_4_5;
      console.log(`[Points] Applied difficulty multiplier: ${multiplier}`);
    }

    // Random bonus (10% chance for 2x)
    if (Math.random() < GameConfig.POINTS.BONUS_CHANCE) {
      multiplier *= 2.0;
      this.isBonusActive = true;
      console.log(`[Points] BONUS APPLIED! multiplier: ${multiplier}`);
    } else {
      this.isBonusActive = false;
    }

    const finalPoints = Math.round(basePoints * multiplier);
    console.log(`[Points] FINAL: basePoints=${basePoints}, multiplier=${multiplier}, finalPoints=${finalPoints}`);

    return {
      basePoints,
      multiplier,
      finalPoints,
      isBonus: this.isBonusActive,
    };
  },

  // Calculate points for wrong answer (0 points, but other rewards may apply)
  calculateForWrongAnswer() {
    return {
      basePoints: 0,
      multiplier: 0,
      finalPoints: 0,
      isBonus: false,
    };
  },

  // Get point description for UI display
  getPointDescription(pointsData) {
    if (pointsData.isBonus) {
      return `+${pointsData.basePoints} ×${pointsData.multiplier.toFixed(1)} ×2 = ${pointsData.finalPoints}!`;
    }
    if (pointsData.multiplier > 1) {
      return `+${pointsData.basePoints} ×${pointsData.multiplier.toFixed(1)} = ${pointsData.finalPoints}`;
    }
    return `+${pointsData.finalPoints}`;
  },

  // Format points for display in UI
  formatPoints(points) {
    return points.toString().padStart(3, '0');
  },
};
