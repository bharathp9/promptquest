// Animation system for wrong/correct answer feedback
const AnimateFeedback = {
  advanceButtonDisabledUntil: 0,

  // Animate wrong answer
  animateWrongAnswer(optionElement, explanation) {
    if (shouldReduceMotion()) {
      // Show explanation instantly if user prefers reduced motion
      this.showWrongExplanation(optionElement, explanation);
      return;
    }

    // Step 1: Shake (0-200ms)
    optionElement.classList.add('animate-shake');

    // Step 2: Pulse (200-500ms, delayed)
    setTimeout(() => {
      optionElement.classList.add('animate-pulse-red');
    }, GameConfig.ANIMATIONS.WRONG_SHAKE);

    // Step 3: Tooltip slide + Step 4: Text fade (400-1000ms, delayed)
    setTimeout(() => {
      this.showWrongExplanation(optionElement, explanation);
    }, GameConfig.ANIMATIONS.WRONG_SHAKE + GameConfig.ANIMATIONS.WRONG_PULSE);

    // Disable advance button for reflection time
    this.disableAdvanceButton(GameConfig.ANIMATIONS.ADVANCE_BUTTON_DISABLED);

    // Play error sound
    this.playSound('wrong-answer', 0.3);

    // Announce to screen readers
    this.announceToScreenReader(`Incorrect. ${explanation}`);

    // Clean up animations after sequence completes
    setTimeout(() => {
      optionElement.classList.remove('animate-shake', 'animate-pulse-red');
    }, 1000);
  },

  // Animate correct answer
  animateCorrectAnswer(optionElement, pointsEarned, pointsDescription) {
    if (shouldReduceMotion()) {
      optionElement.classList.add('correct-answer-highlight');
      this.showCorrectFeedback(optionElement, pointsEarned, pointsDescription);
      return;
    }

    // Step 1: Highlight (0-300ms)
    optionElement.classList.add('animate-highlight-green');

    // Step 2: Checkmark pop (300-700ms, delayed)
    setTimeout(() => {
      this.showCheckmark(optionElement);
    }, GameConfig.ANIMATIONS.CORRECT_HIGHLIGHT);

    // Step 3: Points float (400-1000ms, delayed)
    setTimeout(() => {
      this.showPointsFloat(optionElement, pointsEarned, pointsDescription);
    }, GameConfig.ANIMATIONS.CORRECT_HIGHLIGHT + GameConfig.ANIMATIONS.CORRECT_CHECKMARK / 2);

    // Step 4: Particle burst (300-800ms, delayed)
    setTimeout(() => {
      this.createParticleBurst(optionElement);
    }, GameConfig.ANIMATIONS.CORRECT_HIGHLIGHT / 2);

    // Play success sound
    this.playSound('correct-answer', 0.4);

    // Announce to screen readers
    this.announceToScreenReader('Correct answer!');

    // Enable advance button immediately
    this.enableAdvanceButton();

    // Clean up animations
    setTimeout(() => {
      optionElement.classList.remove('animate-highlight-green');
    }, GameConfig.ANIMATIONS.CORRECT_HIGHLIGHT + GameConfig.ANIMATIONS.CORRECT_CHECKMARK);
  },

  // Show wrong answer explanation
  showWrongExplanation(optionElement, explanation) {
    const tooltip = document.createElement('div');
    tooltip.className = 'wrong-answer-tooltip animate-slide-down';
    tooltip.innerHTML = `
      <div class="tooltip-content">
        <p class="tooltip-explanation animate-fade-up">${explanation}</p>
      </div>
    `;

    // Remove existing tooltips
    optionElement.querySelectorAll('.wrong-answer-tooltip').forEach(el => el.remove());

    optionElement.appendChild(tooltip);
  },

  // Show checkmark
  showCheckmark(optionElement) {
    const checkmark = document.createElement('span');
    checkmark.className = 'checkmark animate-pop';
    checkmark.textContent = '✓';

    optionElement.appendChild(checkmark);
  },

  // Show floating points
  showPointsFloat(optionElement, pointsEarned, description) {
    const pointsDisplay = document.createElement('div');
    pointsDisplay.className = 'points-float animate-float-up';
    pointsDisplay.textContent = `+${pointsEarned}`;
    pointsDisplay.title = description;

    optionElement.appendChild(pointsDisplay);

    // Remove after animation
    setTimeout(() => pointsDisplay.remove(), GameConfig.ANIMATIONS.CORRECT_POINTS);
  },

  // Create particle burst
  createParticleBurst(origin) {
    const isMobile = getDeviceType() === 'mobile';
    const particleCount = isMobile ? 4 : 8;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 40;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      const particle = document.createElement('div');
      particle.className = 'particle animate-burst';
      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');

      origin.appendChild(particle);

      // Remove after animation
      setTimeout(() => particle.remove(), GameConfig.ANIMATIONS.CORRECT_PARTICLES);
    }
  },

  // Disable advance button
  disableAdvanceButton(duration) {
    const advanceBtn = document.querySelector('[data-action="advance"]');
    if (!advanceBtn) return;

    advanceBtn.disabled = true;
    this.advanceButtonDisabledUntil = Date.now() + duration;

    setTimeout(() => {
      advanceBtn.disabled = false;
      this.advanceButtonDisabledUntil = 0;
    }, duration);
  },

  // Enable advance button immediately
  enableAdvanceButton() {
    const advanceBtn = document.querySelector('[data-action="advance"]');
    if (!advanceBtn) return;
    advanceBtn.disabled = false;
  },

  // Play sound (placeholder)
  playSound(soundName, volume = 0.5) {
    // Create a simple beep using Web Audio API
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();

      if (soundName === 'correct-answer') {
        // High beep for correct
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.frequency.value = 800;
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.value = volume;

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (soundName === 'wrong-answer') {
        // Low beep for wrong
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.frequency.value = 400;
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.value = volume;

        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (e) {
      // Audio context not available, skip
    }
  },

  // Announce to screen readers
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'alert');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only'; // Screen reader only
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement read (typically 1-2 seconds)
    setTimeout(() => announcement.remove(), 2000);
  },

  // Show correct feedback summary
  showCorrectFeedback(optionElement, pointsEarned, description) {
    const feedback = document.createElement('div');
    feedback.className = 'correct-feedback';
    feedback.innerHTML = `
      <div class="feedback-content">
        <span class="feedback-icon">✓</span>
        <span class="feedback-text">Correct!</span>
        <span class="feedback-points">${description}</span>
      </div>
    `;
    optionElement.appendChild(feedback);
  },
};
