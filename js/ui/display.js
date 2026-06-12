// UI Display and Update Functions
const UIDisplay = {
  // Update header stats (called after correct/wrong answer)
  updateHeaderStats() {
    const stats = Progress.getAllProgress();

    AnimateTransitions.updateHeaderStats(stats.totalStars, stats.levelsCompleted);
  },

  // Update streak display in header
  updateStreakDisplay() {
    const streakData = Streak.getStreakDisplay();
    AnimateTransitions.updateStreakCounter(streakData.session, streakData.daily);

    // Update multiplier indicator if active
    if (streakData.dailyMultiplierActive) {
      const multiplierDisplay = document.querySelector('[data-multiplier="display"]');
      if (multiplierDisplay) {
        multiplierDisplay.textContent = '1.5x';
        multiplierDisplay.classList.add('active');
      }
    }
  },

  // Update progress bar during level
  updateLevelProgress(currentQuestion, totalQuestions) {
    AnimateTransitions.updateProgressBar(currentQuestion, totalQuestions);
  },

  // Display points earned
  displayPoints(points, description) {
    const pointsDisplay = document.querySelector('[data-display="points"]');
    if (pointsDisplay) {
      pointsDisplay.textContent = `+${points.finalPoints}`;
      pointsDisplay.title = description;
      pointsDisplay.classList.add('points-update');

      setTimeout(() => pointsDisplay.classList.remove('points-update'), 200);
    }
  },

  // Show level completion message
  showLevelComplete(stars, totalPoints) {
    AnimateCelebrate.showLevelVictory('', stars, totalPoints);
  },

  // Handle badge unlock and display
  handleBadgeUnlock(badgeId) {
    const badge = Badges.getBadgeInfo(badgeId);
    if (badge) {
      const result = Badges.unlock(badgeId);
      if (result.unlocked) {
        AnimateCelebrate.showBadgeUnlock(badge);
        Analytics.trackBadgeUnlock(badgeId, 'question_answered');
      }
    }
  },

  // Show wrong answer with explanation
  showWrongAnswerFeedback(optionElement, explanation) {
    AnimateFeedback.animateWrongAnswer(optionElement, explanation);
  },

  // Show correct answer with celebration
  showCorrectAnswerFeedback(optionElement, points, description) {
    AnimateFeedback.animateCorrectAnswer(optionElement, points.finalPoints, description);

    // Update header stats
    this.updateHeaderStats();

    // Update streak display
    this.updateStreakDisplay();

    // Display points on screen
    this.displayPoints(points, description);
  },

  // Show all unlocked badges in dashboard
  displayBadges() {
    const badgesContainer = document.getElementById('badges-container');
    if (!badgesContainer) return;

    const badgesList = Badges.getUnlockedBadges();

    if (badgesList.length === 0) {
      badgesContainer.innerHTML = '<p class="empty-state">Complete levels to unlock badges!</p>';
      return;
    }

    badgesContainer.innerHTML = badgesList
      .map(badge => `
        <div class="badge-item" title="${badge.description}">
          <span class="badge-icon">${badge.icon}</span>
          <span class="badge-name">${badge.name}</span>
        </div>
      `)
      .join('');
  },

  // Display zone progress in map/dashboard
  displayZoneProgress(zoneId) {
    const zone = Progress.getZone(zoneId);
    if (!zone) return;

    const percentage = (zone.completedLevels / zone.totalLevels) * 100;
    const zoneElement = document.querySelector(`[data-zone="${zoneId}"]`);

    if (zoneElement) {
      const progressBar = zoneElement.querySelector('.progress-bar');
      if (progressBar) {
        progressBar.style.width = percentage + '%';
      }

      const stats = zoneElement.querySelector('.zone-stats');
      if (stats) {
        stats.textContent = `${zone.completedLevels}/${zone.totalLevels} levels`;
      }
    }
  },

  // Display all zone progress
  displayAllZoneProgress() {
    GameConfig.ZONES.forEach(zone => {
      this.displayZoneProgress(zone.id);
    });
  },

  // Show reflection time countdown (optional)
  showReflectionCountdown(seconds) {
    const countdownDisplay = document.createElement('div');
    countdownDisplay.className = 'reflection-countdown';
    countdownDisplay.textContent = `Please reflect for ${seconds}s...`;

    const gameBody = document.querySelector('#game-body');
    if (gameBody) {
      gameBody.appendChild(countdownDisplay);

      let remaining = seconds;
      const interval = setInterval(() => {
        remaining--;
        countdownDisplay.textContent = `Please reflect for ${remaining}s...`;

        if (remaining <= 0) {
          clearInterval(interval);
          countdownDisplay.remove();
        }
      }, 1000);
    }
  },

  // Display notification banner
  showNotification(message, type = 'info') {
    AnimateTransitions.showToast(message, type, 3000);
  },

  // Update question counter in UI
  updateQuestionCounter(current, total) {
    const counter = document.querySelector('[data-display="question-counter"]');
    if (counter) {
      counter.textContent = `${current}/${total}`;
    }
  },

  // Clear answer feedback (after advancing to next question)
  clearAnswerFeedback() {
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
      option.classList.remove('animate-shake', 'animate-pulse-red', 'animate-highlight-green');
      option.querySelectorAll('.wrong-answer-tooltip, .checkmark, .points-float, .particle').forEach(el => el.remove());
    });
  },

  // Display overall progress percentage
  displayProgressPercentage() {
    const progress = Progress.getAllProgress();
    const percentageDisplay = document.querySelector('[data-display="progress-percentage"]');

    if (percentageDisplay) {
      percentageDisplay.textContent = `${progress.percentageComplete}%`;
    }
  },
};
