// Animation system for celebrations (badges, victories)
const AnimateCelebrate = {
  // Show badge unlock popup
  showBadgeUnlock(badge) {
    if (!badge) return;

    if (shouldReduceMotion()) {
      this.showBadgeInstant(badge);
      return;
    }

    const backdrop = document.createElement('div');
    backdrop.className = 'badge-backdrop animate-fade-in';

    const popup = document.createElement('div');
    popup.className = 'badge-popup animate-popup-appear';
    popup.innerHTML = `
      <div class="badge-content">
        <div class="badge-icon animate-badge-bounce">${badge.icon}</div>
        <h3 class="badge-title animate-fade-up">Badge Unlocked!</h3>
        <p class="badge-name animate-fade-up">${badge.name}</p>
        <p class="badge-description animate-fade-up">${badge.description}</p>
      </div>
    `;

    backdrop.appendChild(popup);
    document.body.appendChild(backdrop);

    // Play badge unlock sound
    AnimateFeedback.playSound('badge-unlock', 0.6);

    // Auto-dismiss
    setTimeout(() => {
      backdrop.classList.remove('animate-fade-in');
      backdrop.classList.add('animate-fade-out');

      setTimeout(() => backdrop.remove(), GameConfig.ANIMATIONS.BADGE_POPUP_APPEAR);
    }, GameConfig.ANIMATIONS.BADGE_DISMISS);

    // Announce to screen readers
    AnimateFeedback.announceToScreenReader(`Badge unlocked: ${badge.name}. ${badge.description}`);
  },

  // Show badge instantly (no animation)
  showBadgeInstant(badge) {
    const backdrop = document.createElement('div');
    backdrop.className = 'badge-backdrop';
    backdrop.style.opacity = '1';

    const popup = document.createElement('div');
    popup.className = 'badge-popup';
    popup.innerHTML = `
      <div class="badge-content">
        <div class="badge-icon">${badge.icon}</div>
        <h3 class="badge-title">Badge Unlocked!</h3>
        <p class="badge-name">${badge.name}</p>
        <p class="badge-description">${badge.description}</p>
      </div>
    `;

    backdrop.appendChild(popup);
    document.body.appendChild(backdrop);

    setTimeout(() => backdrop.remove(), 3000);
  },

  // Show zone victory screen
  showZoneVictory(zoneId, stats) {
    const zone = GameConfig.ZONES.find(z => z.id === zoneId);
    if (!zone) return;

    if (shouldReduceMotion()) {
      this.showZoneVictoryInstant(zone, stats);
      return;
    }

    const backdrop = document.createElement('div');
    backdrop.className = 'victory-backdrop animate-fade-in';

    const screen = document.createElement('div');
    screen.className = 'victory-screen animate-popup-appear';
    screen.innerHTML = `
      <div class="victory-content">
        <h2 class="victory-title animate-fade-up">${zone.icon} Zone Complete!</h2>
        <div class="victory-stars animate-fade-up">
          <p>You earned: <strong>${stats.zoneStars}/${stats.maxZoneStars}</strong> ⭐</p>
        </div>
        <div class="victory-stats animate-fade-up">
          <p>Total Points: <strong>${stats.totalPoints}</strong></p>
          <p>Accuracy: <strong>${stats.accuracy}%</strong></p>
        </div>
        <button class="btn btn-primary victory-btn animate-scale-in" onclick="window.location.hash='#map'">
          Continue Journey
        </button>
      </div>
    `;

    backdrop.appendChild(screen);
    document.body.appendChild(backdrop);

    // Celebration sound
    this.playCelebrationSound();

    // Confetti animation (optional - simple version)
    this.createSimpleConfetti(screen);
  },

  // Show zone victory instantly
  showZoneVictoryInstant(zone, stats) {
    const backdrop = document.createElement('div');
    backdrop.className = 'victory-backdrop';

    const screen = document.createElement('div');
    screen.className = 'victory-screen';
    screen.innerHTML = `
      <div class="victory-content">
        <h2 class="victory-title">${zone.icon} Zone Complete!</h2>
        <div class="victory-stars">
          <p>You earned: <strong>${stats.zoneStars}/${stats.maxZoneStars}</strong> ⭐</p>
        </div>
        <div class="victory-stats">
          <p>Total Points: <strong>${stats.totalPoints}</strong></p>
          <p>Accuracy: <strong>${stats.accuracy}%</strong></p>
        </div>
        <button class="btn btn-primary victory-btn" onclick="window.location.hash='#map'">
          Continue Journey
        </button>
      </div>
    `;

    backdrop.appendChild(screen);
    document.body.appendChild(backdrop);
  },

  // Create simple confetti effect
  createSimpleConfetti(origin) {
    if (shouldReduceMotion()) return;

    const confettiCount = getDeviceType() === 'mobile' ? 8 : 20;

    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.delay = Math.random() * 0.2 + 's';
        confetti.textContent = ['⭐', '✨', '🎉', '🏆'][Math.floor(Math.random() * 4)];

        origin.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3000);
      }, i * 50);
    }
  },

  // Play celebration sound
  playCelebrationSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();

      // Play a celebratory tone sequence
      const notes = [523, 659, 784]; // C5, E5, G5 (major chord)
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      gain.gain.value = 0.1;

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.frequency.value = freq;
        osc.connect(gain);

        const startTime = ctx.currentTime + (i * 0.1);
        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch (e) {
      // Audio not available
    }
  },

  // Show level victory
  showLevelVictory(levelId, stars, pointsEarned) {
    const message = stars === 3
      ? `Perfect! ${pointsEarned} points! ⭐⭐⭐`
      : `Great! ${pointsEarned} points! ${'⭐'.repeat(stars)}`;

    AnimateTransitions.showToast(message, 'success', 2000);

    // Play subtle celebration
    this.playLevelCompleteSound();
  },

  // Play level complete sound
  playLevelCompleteSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.value = 600;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = 0.2;

      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      // Audio not available
    }
  },
};
