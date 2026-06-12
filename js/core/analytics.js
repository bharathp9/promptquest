// Event tracking and analytics
const Analytics = {
  sessionId: this.generateSessionId(),
  userId: this.generateUserId(),

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  generateUserId() {
    let userId = localStorage.getItem('promptquest_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('promptquest_user_id', userId);
    }
    return userId;
  },

  // Track an event
  track(eventName, data = {}) {
    const payload = {
      event: eventName,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...data,
    };

    // Log to console (can be replaced with backend API call)
    if (!shouldReduceMotion()) {
      // Only log if user hasn't disabled motion preferences
      // (Don't spam console if they prefer reduced motion)
    }

    // Optional: Send to backend analytics service
    // this.sendToBackend(payload);

    return payload;
  },

  sendToBackend(payload) {
    // Placeholder for backend API integration
    // Example: fetch('/api/analytics', { method: 'POST', body: JSON.stringify(payload) })
  },

  // Track correct answer
  trackCorrectAnswer(data) {
    return this.track('correct_answer', {
      zone: data.zone,
      level: data.level,
      questionIndex: data.questionIndex,
      attempts: data.attempts,
      pointsEarned: data.pointsEarned,
      streakActive: data.streakActive,
      timeSpentMs: data.timeSpentMs,
    });
  },

  // Track wrong answer
  trackWrongAnswer(data) {
    return this.track('wrong_answer', {
      zone: data.zone,
      level: data.level,
      questionIndex: data.questionIndex,
      userAnswer: data.userAnswer,
      correctAnswer: data.correctAnswer,
      reflectionTimeMs: data.reflectionTimeMs,
    });
  },

  // Track badge unlock
  trackBadgeUnlock(badgeId, triggerEvent) {
    return this.track('badge_unlocked', {
      badgeId: badgeId,
      triggerEvent: triggerEvent,
      unlockedAt: Date.now(),
    });
  },

  // Track level completion
  trackLevelComplete(data) {
    return this.track('level_completed', {
      zone: data.zone,
      level: data.level,
      stars: data.stars,
      totalPointsEarned: data.totalPointsEarned,
      timeSpentMs: data.timeSpentMs,
    });
  },

  // Track zone completion
  trackZoneComplete(zoneId, stats) {
    return this.track('zone_completed', {
      zone: zoneId,
      totalStars: stats.totalStars,
      totalPoints: stats.totalPoints,
      timeSpentMs: stats.timeSpentMs,
    });
  },

  // Track session stats
  trackSessionEnd(stats) {
    return this.track('session_end', {
      durationMs: stats.durationMs,
      questionsAnswered: stats.questionsAnswered,
      correctAnswers: stats.correctAnswers,
      accuracy: stats.accuracy,
      pointsEarned: stats.pointsEarned,
      streakLength: stats.streakLength,
    });
  },
};
