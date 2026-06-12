// Animation system for UI transitions
const AnimateTransitions = {
  // Animate progress bar
  updateProgressBar(current, total) {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;

    const percentage = (current / total) * 100;
    progressBar.style.width = percentage + '%';

    // Milestone glow effect
    const milestones = [25, 50, 75, 100];
    if (milestones.includes(Math.round(percentage))) {
      progressBar.classList.add('milestone-glow');
      setTimeout(() => progressBar.classList.remove('milestone-glow'), GameConfig.ANIMATIONS.PROGRESS_BAR);
    }
  },

  // Update streak counter with animation
  updateStreakCounter(sessionStreak, dailyStreak) {
    if (shouldReduceMotion()) {
      this.updateStreakCounterInstant(sessionStreak, dailyStreak);
      return;
    }

    const sessionDisplay = document.querySelector('[data-streak="session"]');
    const dailyDisplay = document.querySelector('[data-streak="daily"]');
    const fireIcon = document.querySelector('[data-streak="icon"]');

    if (sessionDisplay) {
      sessionDisplay.classList.add('streak-counter-animate');
      sessionDisplay.textContent = sessionStreak;

      setTimeout(() => sessionDisplay.classList.remove('streak-counter-animate'), GameConfig.ANIMATIONS.STREAK_GLOW);
    }

    if (dailyDisplay) {
      dailyDisplay.classList.add('streak-counter-animate');
      dailyDisplay.textContent = dailyStreak;

      setTimeout(() => dailyDisplay.classList.remove('streak-counter-animate'), GameConfig.ANIMATIONS.STREAK_GLOW);
    }

    if (fireIcon) {
      fireIcon.classList.add('fire-glow');
      setTimeout(() => fireIcon.classList.remove('fire-glow'), GameConfig.ANIMATIONS.STREAK_GLOW);
    }
  },

  // Update streak counter instantly (no animation)
  updateStreakCounterInstant(sessionStreak, dailyStreak) {
    const sessionDisplay = document.querySelector('[data-streak="session"]');
    const dailyDisplay = document.querySelector('[data-streak="daily"]');

    if (sessionDisplay) sessionDisplay.textContent = sessionStreak;
    if (dailyDisplay) dailyDisplay.textContent = dailyStreak;
  },

  // Update header stats with animation
  updateHeaderStats(totalStars, levelsCompleted) {
    const starsDisplay = document.getElementById('total-stars');
    const levelsDisplay = document.getElementById('levels-completed');

    if (starsDisplay) {
      starsDisplay.classList.add('stat-update-animate');
      starsDisplay.textContent = totalStars;
      setTimeout(() => starsDisplay.classList.remove('stat-update-animate'), 200);
    }

    if (levelsDisplay) {
      levelsDisplay.classList.add('stat-update-animate');
      levelsDisplay.textContent = levelsCompleted;
      setTimeout(() => levelsDisplay.classList.remove('stat-update-animate'), 200);
    }
  },

  // Show toast notification
  showToast(message, type = 'info', duration = 3000) {
    const toast = document.getElementById('toast') || this.createToastContainer();

    if (shouldReduceMotion()) {
      duration = 500;
    }

    toast.textContent = message;
    toast.className = `toast toast-${type} toast-show`;

    setTimeout(() => {
      toast.classList.remove('toast-show');
    }, duration);
  },

  // Create toast container
  createToastContainer() {
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
    return toast;
  },

  // Fade in element
  fadeInElement(element, duration = 300) {
    if (!element) return;

    if (shouldReduceMotion()) {
      element.style.opacity = '1';
      return;
    }

    element.style.opacity = '0';
    element.classList.add('animate-fade-in');
    element.style.animationDuration = duration + 'ms';

    setTimeout(() => {
      element.classList.remove('animate-fade-in');
      element.style.opacity = '1';
    }, duration);
  },

  // Fade out element
  fadeOutElement(element, duration = 300) {
    if (!element) return;

    if (shouldReduceMotion()) {
      element.style.opacity = '0';
      return;
    }

    element.classList.add('animate-fade-out');
    element.style.animationDuration = duration + 'ms';

    setTimeout(() => {
      element.style.opacity = '0';
      element.classList.remove('animate-fade-out');
    }, duration);
  },

  // Slide in element
  slideInElement(element, direction = 'down', duration = 300) {
    if (!element) return;

    if (shouldReduceMotion()) {
      element.style.transform = 'translate(0, 0)';
      return;
    }

    const animationClass = `animate-slide-${direction}`;
    element.classList.add(animationClass);
    element.style.animationDuration = duration + 'ms';

    setTimeout(() => {
      element.classList.remove(animationClass);
    }, duration);
  },

  // Scale element (for button presses, etc.)
  scaleElement(element, targetScale = 1.1, duration = 100) {
    if (!element || shouldReduceMotion()) return;

    element.style.transform = `scale(${targetScale})`;
    element.style.transition = `transform ${duration}ms ease-out`;

    setTimeout(() => {
      element.style.transform = 'scale(1)';
      element.style.transition = 'none';
    }, duration);
  },

  // Shake element
  shakeElement(element, duration = 200) {
    if (!element || shouldReduceMotion()) return;

    element.classList.add('animate-shake');
    element.style.animationDuration = duration + 'ms';

    setTimeout(() => {
      element.classList.remove('animate-shake');
    }, duration);
  },

  // Pulse element
  pulseElement(element, duration = 300) {
    if (!element || shouldReduceMotion()) return;

    element.classList.add('animate-pulse');
    element.style.animationDuration = duration + 'ms';

    setTimeout(() => {
      element.classList.remove('animate-pulse');
    }, duration);
  },
};
