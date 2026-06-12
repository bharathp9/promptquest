// Game configuration and constants
const GameConfig = {
  // Points system
  POINTS: {
    BASE_3_STARS: 3,
    BASE_2_STARS: 2,
    BASE_1_STAR: 1,
    MULTIPLIER_STREAK_5PLUS: 1.5,
    MULTIPLIER_DIFFICULTY_ZONE_4_5: 1.5,
    BONUS_CHANCE: 0.10, // 10% chance for 2x bonus
  },

  // Streak configuration
  STREAK: {
    SESSION_RESET_ON_WRONG: true,
    DAILY_RESET_HOUR: 0, // UTC midnight
    DAILY_MULTIPLIER_THRESHOLD: 5,
  },

  // Animation timings (ms)
  ANIMATIONS: {
    WRONG_SHAKE: 200,
    WRONG_PULSE: 300,
    WRONG_TOOLTIP: 400,
    WRONG_TEXT: 300,
    CORRECT_HIGHLIGHT: 300,
    CORRECT_CHECKMARK: 400,
    CORRECT_POINTS: 600,
    CORRECT_PARTICLES: 500,
    PROGRESS_BAR: 250,
    BADGE_POPUP_APPEAR: 400,
    BADGE_BOUNCE: 600,
    BADGE_TEXT_FADE: 300,
    BADGE_DISMISS: 3000,
    STREAK_GLOW: 300,
    ADVANCE_BUTTON_DISABLED: 3000, // Force reflection time
  },

  // Mobile breakpoints
  BREAKPOINTS: {
    MOBILE: 480,
    TABLET: 768,
  },

  // Storage keys
  STORAGE_KEYS: {
    PROGRESS: 'promptquest_progress',
    DAILY_STREAK: 'promptquest_daily_streak',
    SESSION_STREAK: 'promptquest_session_streak',
    LAST_PLAY_DATE: 'promptquest_last_play_date',
    TOTAL_STARS: 'promptquest_total_stars',
    BADGES: 'promptquest_badges',
  },

  // Zone and level data
  ZONES: [
    { id: 1, name: 'Foundation Valley', icon: '🏔️', levels: 4 },
    { id: 2, name: 'Technique Tower', icon: '🏗️', levels: 4 },
    { id: 3, name: 'Refinement Ridge', icon: '🎯', levels: 4 },
    { id: 4, name: 'Pitfall Peaks', icon: '⚠️', levels: 4 },
    { id: 5, name: 'Mastery Mountain', icon: '🏆', levels: 4 },
  ],

  // Badge definitions
  BADGES: {
    FIRST_STEP: {
      id: 'first-step',
      name: 'First Step',
      icon: '🌟',
      color: 'bronze',
      description: 'Complete your first question',
    },
    ZONE_PIONEER: {
      id: 'zone-pioneer',
      name: 'Zone Pioneer',
      icon: '🗻',
      color: 'silver',
      description: 'Complete Zone 1',
    },
    TECHNIQUE_MASTER: {
      id: 'technique-master',
      name: 'Technique Master',
      icon: '🔨',
      color: 'silver',
      description: 'Complete Zone 2',
    },
    REFINEMENT_EXPERT: {
      id: 'refinement-expert',
      name: 'Refinement Expert',
      icon: '💎',
      color: 'gold',
      description: 'Complete Zone 3',
    },
    PITFALL_NAVIGATOR: {
      id: 'pitfall-navigator',
      name: 'Pitfall Navigator',
      icon: '🧭',
      color: 'gold',
      description: 'Complete Zone 4',
    },
    PROMPT_ENGINEER: {
      id: 'prompt-engineer',
      name: 'Prompt Engineer',
      icon: '⚡',
      color: 'platinum',
      description: 'Complete Zone 5 - Master!',
    },
    MASTER_STREAK: {
      id: 'master-streak',
      name: 'Master Streak',
      icon: '🔥',
      color: 'fire',
      description: '10-day daily streak',
    },
    UNSTOPPABLE: {
      id: 'unstoppable',
      name: 'Unstoppable',
      icon: '🔥🔥',
      color: 'fire',
      description: '20-day daily streak',
    },
    LEGENDARY: {
      id: 'legendary',
      name: 'Legendary',
      icon: '🔥🔥🔥',
      color: 'fire',
      description: '30-day daily streak',
    },
    SNIPER: {
      id: 'sniper',
      name: 'Sniper',
      icon: '🎯',
      color: 'gold',
      description: '90%+ accuracy in a zone',
    },
    QUICK_THINKER: {
      id: 'quick-thinker',
      name: 'Quick Thinker',
      icon: '⚡',
      color: 'orange',
      description: 'Complete zone in <5 min average',
    },
    LUCKY_BREAK: {
      id: 'lucky-break',
      name: 'Lucky Break',
      icon: '🎁',
      color: 'gold',
      description: 'Receive 5+ bonus point rewards',
    },
    FLAWLESS: {
      id: 'flawless',
      name: 'Flawless',
      icon: '👑',
      color: 'platinum',
      description: 'Complete a level perfectly (3 stars, no wrongs)',
    },
  },
};

// Utility: Get device type based on window width
function getDeviceType() {
  const width = window.innerWidth;
  if (width < GameConfig.BREAKPOINTS.MOBILE) return 'mobile';
  if (width < GameConfig.BREAKPOINTS.TABLET) return 'tablet';
  return 'desktop';
}

// Utility: Respect prefers-reduced-motion
function shouldReduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
