# PromptQuest Gamification System Design

## Executive Summary

This document provides implementation guidance for PromptQuest gamification mechanics, animations, and progression systems.

### Key Deliverables
- 6 core animations with exact timings (200-500ms range)
- 14 badges with clear unlock conditions
- Points, streaks, and achievement systems
- 3-phase implementation roadmap (6 weeks)
- Mobile-first design guidelines
- WCAG AA accessibility requirements

---

## Core Mechanics

### 1. Points System
- **3 points**: Correct answer (first attempt)
- **2 points**: Correct answer (second attempt)
- **1 point**: Correct answer (third+ attempt)
- **Multipliers**: 
  - +1.5x when daily streak >= 5
  - +0.5x in zones 4-5 (higher difficulty)
  - +1x random bonus (10% chance on any answer)

### 2. Streak Tracking
- **Session Streak**: Resets on wrong answer; shows momentum
- **Daily Streak**: Persists across days; resets at midnight UTC
- **Badges Unlock**: At 10/20/30 day milestones
- **Psychology Drive**: Users fear losing their streak → daily returns

### 3. Badge System (14 Total)

| Badge | Unlock Condition | Category |
|-------|-----------------|----------|
| First Step | Complete question 1 | Starter |
| Zone Pioneer | Complete zone 1 (all levels) | Zone |
| Technique Master | Complete zone 2 | Zone |
| Refinement Expert | Complete zone 3 | Zone |
| Pitfall Navigator | Complete zone 4 | Zone |
| Prompt Engineer | Complete zone 5 | Legend |
| Master Streak | 10-day daily streak | Streak |
| Unstoppable | 20-day daily streak | Streak |
| Legendary | 30-day daily streak | Streak |
| Sniper | 90%+ accuracy in zone | Accuracy |
| Quick Thinker | Zone <5 min average | Speed |
| Lucky Break | 5+ bonus rewards | Luck |
| Flawless | 3 stars (no wrongs) in level | Perfect |

### 4. Star System
- **3 stars**: 0 wrong answers (perfect)
- **2 stars**: 1 wrong answer
- **1 star**: 2 wrong answers
- **0 stars**: 3+ wrong answers (must retry)

**Max total: 60 stars (20 levels × 3 stars)**

---

## Animation Specifications

### Animation Principle
Every animation serves to **communicate feedback or progress**. Duration: 200-500ms. Easing: ease-in-out (natural deceleration).

### Wrong Answer Feedback (1000ms Total Flow)

**Sequence:**
1. **Shake** (0ms → 200ms)
   - Duration: 200ms
   - Effect: ±3px horizontal (±2px on mobile)
   - Easing: ease-out
   - Signal: Error occurred

2. **Pulse** (200ms → 500ms)
   - Duration: 300ms
   - Effect: Background white → red (#ff6b6b) → white
   - Easing: ease-in-out
   - Signal: Visual confirmation of error

3. **Tooltip Slide** (400ms → 800ms)
   - Duration: 400ms
   - Effect: Slides down from top, opacity 0→1
   - Easing: ease-out
   - Signal: Explanation revealed

4. **Text Fade** (700ms → 1000ms)
   - Duration: 300ms
   - Effect: Text fades in + slight upward motion (8px)
   - Easing: ease-in
   - Signal: Full explanation visible

**CSS Keyframes:**
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

@keyframes pulse-red {
  0% { background-color: white; }
  50% { background-color: #ff6b6b; }
  100% { background-color: white; }
}

@keyframes slide-down {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Accessibility**: Shake + color + text all present (no single-indicator feedback). Screen reader announces error + explanation.

---

### Correct Answer Celebration (1000ms Total)

**Sequence:**
1. **Highlight** (0ms → 300ms)
   - Background: white → #51cf66 (green)

2. **Checkmark Pop** (300ms → 700ms)
   - Icon: scales 0 → 1.2 → 1.0 (bounce)
   - Easing: cubic-bezier(0.68, -0.55, 0.265, 1.55)

3. **Points Float** (400ms → 1000ms)
   - Text: "+3 points" floats up + fades
   - Easing: ease-out

4. **Particle Burst** (300ms → 800ms)
   - 8-12 circles burst outward
   - Easing: ease-out

**Sound**: Optional victory chime (user can disable)

---

### Progress Bar (250ms)
- **Trigger**: After each question answered
- **Animation**: Width transition 250ms ease-in-out
- **Milestone**: Subtle glow flash at 25%, 50%, 75%, 100%

---

### Badge Unlock Popup (3400ms Total)

1. **Appear** (0ms → 400ms)
   - Scale: 0.5 → 1.0
   - Opacity: 0 → 1
   - Easing: ease-out

2. **Icon Bounce** (200ms → 800ms)
   - Y-axis oscillation: 0 → -12px → 0 → -6px → 0
   - Easing: cubic-bezier(0.68, -0.55, 0.265, 1.55)

3. **Text Fade** (400ms → 700ms)
   - Opacity: 0 → 1
   - Easing: ease-in

4. **Auto-Dismiss** (3000ms → 3400ms)
   - Fade out + remove from DOM

---

### Streak Counter Update (300ms)

**Trigger**: After correct answer (session streak active)

1. **Number Increment** (0ms → 200ms)
   - Y-motion: 10px down → 0
   - Scale: 1.0 → 1.1 → 1.0
   - Opacity: 0 → 1

2. **Fire Glow** (0ms → 300ms)
   - Text-shadow: 0→8px glow (orange)
   - Color: Orange (#ff8c00)

---

## Points Multiplier System

**Base Calculation:**
```
basePoints = 3 - (attempts - 1)  // 3, 2, 1
finalPoints = basePoints × multiplier
```

**Multipliers Stack:**
- Streak: +1.0x (when daily streak >= 5)
- Difficulty: +0.5x (zones 4-5)
- Random Bonus: ×2.0 (10% chance)

**Example**: 3 points × 1.5 (streak) × 1.5 (difficulty) × 2 (random) = 13.5 ≈ 14 points

---

## Phase 1: Core Gamification (Weeks 1-2)

**Deliverables:**
1. Points system + calculation
2. Wrong answer animation (shake → pulse → tooltip)
3. Correct answer celebration (highlight → checkmark → particles)
4. Session streak tracking + display
5. Progress bar (per-level)
6. LocalStorage persistence

**Success Criteria:**
- Animations play smoothly (60fps on mobile)
- Streak increments correctly
- Progress data persists across page reloads
- No animation jank on iPhone 8+ or Android mid-range

**Estimated effort: 80 hours**

---

## Phase 2: Rewards & Progression (Weeks 3-4)

**Deliverables:**
1. Badge system (14 badges, unlock logic)
2. Badge unlock popups (animation + sound)
3. Daily streak mechanics (UTC midnight reset)
4. Star rating system (0-3 per level)
5. Zone victory screens
6. Points multiplier system
7. Difficulty scaling (suggest challenge mode)

**Success Criteria:**
- 40%+ of users unlock 5+ badges within 30 days
- Daily streak resets correctly at midnight
- Multipliers apply accurately
- Victory screens trigger on zone completion

**Estimated effort: 60 hours**

---

## Phase 3: Analytics & Optimization (Weeks 5-6)

**Deliverables:**
1. Event analytics tracking (all major actions)
2. Engagement dashboard (DAU, session length, retention)
3. A/B testing framework (test animation timings)
4. User feedback surveys (post-zone)
5. Performance optimization (maintain 60fps)
6. Accessibility audit (WCAG AA)

**Success Criteria:**
- 90%+ event tracking accuracy
- 60fps maintained on mobile
- WCAG AA compliance achieved
- User satisfaction >4.0/5.0

**Estimated effort: 40 hours**

---

## Mobile-First Design Guidelines

### Animation Adjustments by Screen Size

| Animation | <480px (Mobile) | 480-768px (Tablet) | >768px (Desktop) |
|-----------|-----------------|-------------------|------------------|
| Shake | ±2px, 150ms | ±2px, 175ms | ±3px, 200ms |
| Progress Bar | 200ms | 225ms | 250ms |
| Particle Burst | 4 particles | 8 particles | 12 particles |
| Badge Popup | Full width -20px | 360px centered | 400px centered |

### Touch Feedback
- **No hover states** (hover doesn't exist on touch)
- **Active state**: Scale 0.95 → 1.0 (100ms)
- **Tap targets**: Minimum 48px × 48px

### Responsive Breakpoints
```css
/* Mobile: <480px */
.progress-bar { height: 3px; }

/* Tablet: 480-768px */
@media (min-width: 480px) {
  .progress-bar { height: 3px; }
}

/* Desktop: >768px */
@media (min-width: 768px) {
  .progress-bar { height: 4px; }
}
```

---

## Accessibility Requirements

### Mandatory (WCAG AA)
- [ ] All animations respect `prefers-reduced-motion` media query
- [ ] Color contrast 4.5:1 for text, 3:1 for UI components
- [ ] Keyboard navigation fully functional (Tab, Enter, Space, Escape)
- [ ] Focus indicators visible (min 2px outline, high contrast)
- [ ] Screen reader support (role="alert", aria-live="polite")
- [ ] No information conveyed by color alone

### Code Patterns

```javascript
// Announce to screen readers
function announceWrongAnswer(explanation) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'alert');
  announcement.setAttribute('aria-live', 'polite');
  announcement.textContent = `Incorrect. ${explanation}`;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1500);
}

// Respect reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--animation-duration', '1ms');
}
```

### Testing
- Test with NVDA (Windows) or VoiceOver (Mac)
- Keyboard-only navigation (no mouse)
- Chrome DevTools Lighthouse accessibility audit

---

## User Engagement Metrics

### Primary Metrics to Track

| Metric | Target | Measurement | Frequency |
|--------|--------|-------------|-----------|
| DAU | +20% growth | Unique users/day | Daily |
| Session Length | 8-15 min | Minutes per session | Per session |
| Retention (Day 7) | 30%+ | Users returning day 7+ | Weekly |
| Streak Adoption | 60%+ | Users with 3+ streak | Weekly |
| Badge Unlock Rate | 40%+ unlock 5+ badges | Badge count per user | Monthly |
| Wrong Answer Reflection | 3+ sec | Time before advance | Per question |

### Learning Metrics
| Metric | Target | Definition |
|--------|--------|-----------|
| Accuracy Gain | +15% | Zone 1 accuracy → Zone 5 accuracy |
| First-Attempt Success | Increases | % of questions correct on first try |
| Zone Completion | 25%+ | Users completing zone 5 |
| Replay Rate | 15%+ | Retrying failed levels |

### Analytics Implementation
```javascript
const Analytics = {
  track(event, data) {
    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify({
        event,
        userId: User.id,
        timestamp: Date.now(),
        sessionId: Session.id,
        ...data
      })
    });
  },
  
  onCorrectAnswer() {
    this.track('correct_answer', {
      zone: currentZone,
      level: currentLevel,
      attempts: attempts,
      pointsEarned: pointsEarned,
      streakActive: streak > 0
    });
  },
  
  onBadgeUnlock() {
    this.track('badge_unlocked', {
      badgeId: badgeName,
      triggerEvent: triggerEvent
    });
  }
};
```

---

## Implementation Checklist

### Phase 1 Validation
- [ ] Points calculation correct (1-3 base, adjusted for attempts)
- [ ] Wrong answer animation smooth (60fps, no jank)
- [ ] Correct answer celebration (first attempt only)
- [ ] Session streak increments/resets correctly
- [ ] Progress bar updates (250ms smooth transition)
- [ ] LocalStorage persists progress across reloads
- [ ] Mobile layout responsive (<480px width)
- [ ] Touch targets 48×48px minimum
- [ ] Keyboard navigation fully functional
- [ ] Screen reader announcements working

### Phase 2 Validation
- [ ] Badges unlock at correct thresholds
- [ ] Badge popups animate smoothly (400ms + bounce)
- [ ] Daily streak persists across day boundaries
- [ ] Star calculation accurate (3 stars = no wrongs)
- [ ] Zone completion triggers victory screen
- [ ] Points multipliers apply correctly
- [ ] Challenge mode suggestions trigger at >90% accuracy

### Phase 3 Validation
- [ ] Events tracked (95%+ delivery)
- [ ] No animation frame drops (60fps on mobile)
- [ ] WCAG AA compliance verified
- [ ] User feedback collection working
- [ ] Engagement metrics dashboard functional

---

## Success Criteria Summary

**Launch is successful when:**

1. **Performance**: 60fps animations on real mobile device
2. **Engagement**: 60%+ streak adoption, 40%+ badge unlock
3. **Learning**: +15% accuracy improvement (zone 1 → 5)
4. **Retention**: 30%+ day-7 retention rate
5. **Accessibility**: WCAG AA audit passes
6. **Reflection**: Users spend ≥3 seconds reading explanations

---

## Quick Start for Developers

1. Extract all @keyframes → `css/animations.css`
2. Implement points calculation function
3. Wire streak counter to answer events
4. Add progress bar updates
5. Test on mobile (360px viewport)
6. Validate 60fps (Chrome DevTools)
7. Run accessibility audit

**Total effort: 180 hours (3 phases)**

---

**Status**: Ready for Implementation  
**Version**: 1.0  
**Last Updated**: June 2026
