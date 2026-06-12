# PromptQuest Gamification - Implementation Guide

## Phase 1: Core Gamification ✅ COMPLETED

**What's Implemented:**
- ✅ Points system (1-3 base, multipliers)
- ✅ Streak tracking (session + daily)
- ✅ Progress tracking (levels, zones, stars)
- ✅ Badge system (14 badges defined)
- ✅ Animations (6 core animations, 200-500ms)
- ✅ Storage persistence (LocalStorage)
- ✅ Analytics tracking (event system)

---

## Modular Architecture Overview

```
js/
├── core/                          # Low-level utilities
│   ├── constants.js              # Game config, badge definitions
│   ├── storage.js                # LocalStorage wrapper
│   └── analytics.js              # Event tracking
│
├── gamification/                  # Game mechanics
│   ├── points.js                 # Points calculation
│   ├── streak.js                 # Streak logic
│   ├── progress.js               # Progress tracking
│   └── badges.js                 # Badge unlocking
│
├── animations/                    # Animation systems
│   ├── feedback.js               # Wrong/correct answer animations
│   ├── transitions.js            # UI transitions
│   └── celebrate.js              # Celebration popups
│
├── ui/                            # UI updates
│   └── display.js                # Display management
│
├── gamification.init.js          # System initialization
└── [existing game files]         # levels.js, game.js, etc.

css/
├── animations.css                # All @keyframes
└── [existing styles]             # style.css
```

**Key Design Principle:** Each module is independent and uses simple data structures (objects, arrays). No jQuery, no frameworks - vanilla JS for GitHub Pages compatibility.

---

## Integration with Game Code

### 1. Dispatch Events When Player Answers

Your game code (`js/game.js`) needs to dispatch custom events. Here's how:

**When player selects an answer (correct or wrong):**

```javascript
// In your question-answering code
function handleAnswerSelection(selectedAnswer, correctAnswer, zoneId, levelId, questionNumber) {
  const isCorrect = selectedAnswer === correctAnswer;
  const attempts = getUserAttempts(); // Track how many times they've tried
  
  if (isCorrect) {
    // Calculate points
    const pointsData = Points.calculateForCorrectAnswer(
      attempts,
      zoneId,
      Streak.isSessionStreakActive(),
      Streak.dailyStreak
    );
    
    // Dispatch event
    document.dispatchEvent(new CustomEvent('answer-selected', {
      detail: {
        isCorrect: true,
        zoneId: zoneId,
        levelId: levelId,
        attempts: attempts,
        pointsData: pointsData,
        questionNumber: questionNumber,
      }
    }));
    
    // Show correct answer animation
    UIDisplay.showCorrectAnswerFeedback(
      optionElement,
      pointsData,
      Points.getPointDescription(pointsData)
    );
    
  } else {
    // Show wrong answer animation with explanation
    const explanation = getExplanationForWrongAnswer(selectedAnswer);
    
    document.dispatchEvent(new CustomEvent('answer-selected', {
      detail: {
        isCorrect: false,
        zoneId: zoneId,
        levelId: levelId,
        attempts: attempts,
        questionNumber: questionNumber,
      }
    }));
    
    UIDisplay.showWrongAnswerFeedback(optionElement, explanation);
  }
}
```

### 2. Dispatch Level Completion Event

**When player finishes a level:**

```javascript
function completeLevelLogic(zoneId, levelNumber, wrongAnswerCount) {
  const stars = 3 - Math.min(wrongAnswerCount, 3); // 0-3 stars
  const pointsEarned = calculateTotalPointsForLevel(); // Sum all question points
  
  document.dispatchEvent(new CustomEvent('level-completed', {
    detail: {
      zoneId: zoneId,
      levelNumber: levelNumber,
      stars: stars,
      pointsEarned: pointsEarned,
    }
  }));
}
```

### 3. Dispatch Zone Completion Event

**When all levels in a zone are complete:**

```javascript
function completeZone(zoneId) {
  const zone = Progress.getZone(zoneId);
  
  document.dispatchEvent(new CustomEvent('zone-completed', {
    detail: {
      zoneId: zoneId,
      stats: {
        zoneStars: zone.stars,
        maxZoneStars: zone.maxStars,
        totalPoints: calculateZonePoints(zoneId),
        accuracy: calculateZoneAccuracy(zoneId),
      }
    }
  }));
}
```

### 4. Dispatch Game Start Event

**When the player opens a level:**

```javascript
function startLevel(zoneId, levelNumber) {
  // Check and reset daily streak if needed
  Streak.checkDailyReset();
  
  document.dispatchEvent(new CustomEvent('game-start', {
    detail: {
      zoneId: zoneId,
      levelNumber: levelNumber,
    }
  }));
}
```

---

## Using the Gamification APIs

### Points System

```javascript
// Calculate points for a correct answer
const pointsData = Points.calculateForCorrectAnswer(
  attempts,        // How many tries (1, 2, 3+)
  zone,            // Zone number (1-5)
  streakActive,    // Is session streak > 0?
  dailyStreak      // Daily streak count
);

console.log(pointsData);
// {
//   basePoints: 3,
//   multiplier: 1.5,
//   finalPoints: 4,
//   isBonus: false
// }

// Get display text
const description = Points.getPointDescription(pointsData);
// "+3 ×1.5 = 4"
```

### Streak System

```javascript
// Get current streak info
const streakDisplay = Streak.getStreakDisplay();
// {
//   session: 5,
//   daily: 12,
//   dailyMultiplierActive: true
// }

// Check if multiplier is active
if (Streak.isDailyMultiplierActive()) {
  console.log('1.5x multiplier active!');
}

// After correct answer (automatically called by events)
Streak.onCorrectAnswer();

// After wrong answer (automatically called by events)
Streak.onWrongAnswer();
```

### Progress Tracking

```javascript
// Get overall progress
const allProgress = Progress.getAllProgress();
// {
//   totalStars: 45,
//   levelsCompleted: 15,
//   percentageComplete: 75,
//   zoneProgress: [...],
// }

// Get zone progress
const zone = Progress.getZone(1);
// {
//   zoneId: 1,
//   name: "Foundation Valley",
//   completedLevels: 4,
//   totalLevels: 4,
//   stars: 12,
//   maxStars: 12,
//   isComplete: true,
// }

// Check if level is complete
const level = Progress.getLevel(1, 1);
// { stars: 3, completed: true }
```

### Badge System

```javascript
// Get all unlocked badges
const badges = Badges.getUnlockedBadges();
// [
//   { id: 'first-step', name: 'First Step', icon: '🌟', ... },
//   { id: 'zone-pioneer', name: 'Zone Pioneer', icon: '🗻', ... }
// ]

// Check if badge is unlocked
if (Badges.isUnlocked('master-streak')) {
  console.log('Player has 10-day streak!');
}

// Badge info
const badge = Badges.getBadgeInfo('sniper');
// { id: 'sniper', name: 'Sniper', icon: '🎯', description: '90%+ accuracy' }
```

### UI Display

```javascript
// Update header stats (★ and levels)
UIDisplay.updateHeaderStats();

// Show wrong answer with animation
UIDisplay.showWrongAnswerFeedback(optionElement, explanation);

// Show correct answer with celebration
UIDisplay.showCorrectAnswerFeedback(optionElement, pointsData, description);

// Update progress bar during level
UIDisplay.updateLevelProgress(currentQuestion, totalQuestions);

// Show toast notification
UIDisplay.showNotification('Great job!', 'success');

// Display all badges
UIDisplay.displayBadges();
```

### Analytics

```javascript
// Track custom event
Analytics.track('custom_event', {
  someData: 'value',
  timestamp: Date.now(),
});

// Pre-defined tracking (automatically called by events)
Analytics.trackCorrectAnswer({ zone, level, attempts, pointsEarned });
Analytics.trackWrongAnswer({ zone, level, userAnswer, correctAnswer });
Analytics.trackBadgeUnlock(badgeId, triggerEvent);
Analytics.trackLevelComplete({ zone, level, stars, timeSpentMs });
```

---

## Animation System

All animations are **automatically triggered** by the display functions. You don't need to call them manually:

```javascript
// Animations happen automatically when you call:
UIDisplay.showCorrectAnswerFeedback(optionElement, points, description);
// ↓ Triggers:
// - 300ms highlight green
// - 400ms checkmark pop
// - 600ms points float
// - 500ms particle burst

UIDisplay.showWrongAnswerFeedback(optionElement, explanation);
// ↓ Triggers:
// - 200ms shake
// - 300ms pulse red
// - 400ms tooltip slide
// - 300ms text fade
```

**Manual animation calls (advanced):**

```javascript
// Force reflection time (3 seconds disabled)
AnimateFeedback.disableAdvanceButton(3000);

// Show badge popup
AnimateCelebrate.showBadgeUnlock(badgeInfo);

// Show zone victory
AnimateCelebrate.showZoneVictory(zoneId, stats);

// Update streak counter with glow
AnimateTransitions.updateStreakCounter(session, daily);
```

---

## Performance Optimization

### For Smooth 60fps on Mobile:

1. **Animations are GPU-accelerated:**
   - Only use `transform` and `opacity` properties
   - Never animate `width`, `height`, `position` directly
   - All animations in CSS, not JavaScript

2. **Event-driven architecture:**
   - Systems respond to events, don't poll
   - LocalStorage reads cached in memory
   - Minimal DOM queries (use `querySelector` sparingly)

3. **Mobile-specific optimizations:**
   - Shake animation: ±2px on mobile (vs ±3px desktop)
   - Particle burst: 4 particles on mobile (vs 8-12 desktop)
   - Progress bar: faster transitions on small screens

4. **Respects user preferences:**
   - `prefers-reduced-motion`: Animations run at 1ms (instant)
   - `prefers-color-scheme`: Inherits system theme (use CSS vars)

### Bundle Size:
- All modules combined: ~15KB gzipped
- No external dependencies
- Compatible with GitHub Pages (all static files)

---

## Storage Architecture

**LocalStorage Keys:**
```javascript
GameConfig.STORAGE_KEYS = {
  PROGRESS: 'promptquest_progress',       // { progress: {...}, totalStars, levelsCompleted }
  DAILY_STREAK: 'promptquest_daily_streak',
  SESSION_STREAK: 'promptquest_session_streak',
  LAST_PLAY_DATE: 'promptquest_last_play_date',
  TOTAL_STARS: 'promptquest_total_stars',
  BADGES: 'promptquest_badges',           // { badgeId: { unlockedAt } }
}
```

**Data Format:**
```javascript
// Progress data
{
  "1-1": { stars: 3, completed: true, attempts: 1, bestScore: 9 },
  "1-2": { stars: 2, completed: true, attempts: 2, bestScore: 6 },
  // ... more levels
  totalStars: 45,
  lastUpdated: 1718000000000
}

// Badges data
{
  "first-step": { badgeId: "first-step", unlockedAt: 1718000000000 },
  "zone-pioneer": { badgeId: "zone-pioneer", unlockedAt: 1718001000000 }
}
```

---

## Accessibility Features

✅ **Keyboard Navigation:**
- Tab through options
- Enter/Space to select
- No mouse required

✅ **Screen Reader Support:**
- `role="alert"` announcements
- `aria-live="polite"` for dynamic updates
- Semantic HTML

✅ **Motion Preferences:**
- Respects `prefers-reduced-motion`
- Animations auto-disable for users with this preference

✅ **Color Contrast:**
- Red (#ff6b6b) for wrong answers: 4.5:1 contrast
- Green (#51cf66) for correct answers: 4.5:1 contrast
- Color not the only indicator

---

## Common Integration Checklist

- [ ] Import all CSS and JS files in index.html (in correct order)
- [ ] Dispatch `answer-selected` event from your answer handler
- [ ] Dispatch `level-completed` event when level finishes
- [ ] Dispatch `zone-completed` event when zone finishes
- [ ] Dispatch `game-start` event when opening a level
- [ ] Call `UIDisplay.showCorrectAnswerFeedback()` for correct answers
- [ ] Call `UIDisplay.showWrongAnswerFeedback()` for wrong answers
- [ ] Update progress bar with `UIDisplay.updateLevelProgress()`
- [ ] Test on mobile device (60fps check)
- [ ] Test keyboard navigation
- [ ] Test screen reader (NVDA/VoiceOver)
- [ ] Verify animations respect `prefers-reduced-motion`

---

## Next Steps: Phase 2 (Not Yet Implemented)

**Week 3-4 Deliverables:**
- Daily streak display in header
- Points multiplier visual indicator
- Zone victory screens with animations
- Star rating system UI
- Badge display in dashboard
- Challenge mode suggestions (>90% accuracy)

**To implement Phase 2:**
1. Create UI components for daily streak badge
2. Add multiplier indicator to points display
3. Build zone victory screen modal
4. Create badge gallery in dashboard
5. Add challenge mode logic

---

## Next Steps: Phase 3 (Not Yet Implemented)

**Week 5-6 Deliverables:**
- Analytics dashboard (DAU, retention, engagement)
- A/B testing framework
- User feedback surveys
- Performance profiling
- Accessibility audit

---

## Troubleshooting

**Q: Events not firing?**
A: Check that events are dispatched AFTER DOM is ready (after DOMContentLoaded)

**Q: Animations lagging on mobile?**
A: Reduce particle count, check Chrome DevTools Performance tab for dropped frames

**Q: Data not persisting?**
A: Check browser allows localStorage (not in private mode), verify keys in STORAGE_KEYS

**Q: Points not calculating correctly?**
A: Verify attempts parameter (1, 2, 3+), check zone number (1-5), test multiplier conditions

**Q: Streak not resetting?**
A: Check LAST_PLAY_DATE is being saved, verify UTC midnight logic

---

## Global Functions (For Console Testing)

```javascript
// Initialize gamification
initializeGameification();

// Get current player stats
getGameStats();

// Reset all data (warning: destructive)
resetGameProgress();

// Dispatch test events
document.dispatchEvent(new CustomEvent('answer-selected', {
  detail: {
    isCorrect: true,
    zoneId: 1,
    levelId: '1-1',
    attempts: 1,
    pointsData: Points.calculateForCorrectAnswer(1, 1, false, 0),
  }
}));
```

---

## Resources

- **Animation Best Practices:** [Nielsen Norman Group](https://www.nngroup.com/articles/animation-usability/)
- **Gamification Research:** [Octalysis Framework](https://yukaichou.com/gamification-examples/octalysis-framework/)
- **Web Performance:** [MDN: Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
- **Accessibility:** [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Status:** Phase 1 Complete ✅  
**Last Updated:** June 2026  
**Maintainer:** Bharath Kumar
