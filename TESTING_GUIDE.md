# PromptQuest Gamification - Testing Guide

## 🚀 Quick Start (5 Minutes)

### 1. Wait for Deployment
- GitHub Pages deploys automatically (2-3 minutes)
- Your site: https://bharathp9.github.io/promptquest/

### 2. Open Your Site
- Visit the URL in a new tab
- **You should hear music playing** 🎵 (auto-start enabled)

### 3. Test the Gamification Flow

#### Test Correct Answer Path:
1. Click any zone (e.g., "Foundation Valley")
2. Click any level
3. Click "⚡ Take Quiz"
4. Select the correct answer
5. **Watch for animations:**
   - ✅ Green highlight (300ms)
   - ✅ Checkmark pops in (400ms bounce)
   - ✅ Points float up ("+3 points" or with multiplier)
   - ✅ Particles burst outward (8 particles)

#### Test Wrong Answer Path:
1. Select **wrong** answer instead
2. **Watch for animations:**
   - ✅ Button shakes (200ms, ±2px)
   - ✅ Background pulses red (300ms)
   - ✅ Tooltip slides down (400ms)
   - ✅ Explanation text fades in (300ms)
   - ✅ "Advance" button disabled for 3 seconds (reflection time)

---

## 📊 Check Gamification Data

### Open Browser Console (F12)

**Get all player stats:**
```javascript
getGameStats()
```

Output:
```javascript
{
  totalStars: 45,
  levelsCompleted: 15,
  percentageComplete: 75,
  sessionStreak: 5,
  dailyStreak: 3,
  badgesUnlocked: 2,
  // ... more data
}
```

**Get streak information:**
```javascript
console.log(Streak.getStreakDisplay())
// { session: 5, daily: 3, dailyMultiplierActive: false }
```

**Get progress for a zone:**
```javascript
Progress.getZone(1)
// {
//   zoneId: 1,
//   name: "Foundation Valley",
//   completedLevels: 4,
//   totalLevels: 4,
//   stars: 12,
//   maxStars: 12,
//   isComplete: true
// }
```

**Get all unlocked badges:**
```javascript
Badges.getUnlockedBadges()
// Array of badge objects with name, icon, description
```

**Check localStorage:**
```javascript
// View all gamification data
localStorage.getItem('promptquest_progress')
localStorage.getItem('promptquest_daily_streak')
localStorage.getItem('promptquest_session_streak')
localStorage.getItem('promptquest_badges')
```

---

## 🎯 Expected Behavior

### When You Complete Your First Question ✓

**If Correct:**
- ✅ Points appear (+3, +4, +6 depending on multipliers)
- ✅ Green highlight animation
- ✅ Checkmark appears with bounce
- ✅ Particles burst from button
- ✅ Header "★ 3/60" updates
- ✅ Session streak shows "1 🔥"

**If Wrong:**
- ✅ Button shakes
- ✅ Red pulse background
- ✅ Explanation tooltip appears
- ✅ "Next" button disabled for 3 seconds
- ✅ Session streak resets to 0

### Header Stats Should Update:
- ⭐ Total stars earned
- ✅ Levels completed
- 🔥 Current streak (session)

---

## 🔍 Performance Checks

### Animation Frame Rate (Chrome DevTools)
1. Open DevTools (F12)
2. Go to **Performance** tab
3. Click record
4. Answer a question (trigger animations)
5. Stop recording
6. **Target:** No red bars (60fps maintained)

### Mobile Test (Chrome DevTools)
1. Open DevTools (F12)
2. Click mobile icon (top-left)
3. Select "iPhone 12" or "Pixel 5"
4. Answer questions
5. **Check:**
   - Animations still smooth
   - Shake reduced to ±2px (not ±3px)
   - Particles count: 4 (not 8)
   - All text readable

---

## ♿ Accessibility Checks

### Keyboard Navigation
1. Open DevTools (F12)
2. Type: `document.body.style.cursor = 'none'`
3. Navigate using **Tab** key only
4. Press **Enter/Space** to select answers
5. **All buttons should be reachable**

### Screen Reader (Windows: NVDA, Mac: VoiceOver)
1. Enable screen reader
2. Navigate through game
3. **Hear announcements:**
   - "Incorrect answer" (on wrong)
   - "Correct answer" (on right)
   - "Question 1 of 4"
   - "Badge unlocked: First Step"

### Reduced Motion (Settings)
```javascript
// Check if browser respects prefers-reduced-motion
window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

If true, animations should be instant (1ms)

---

## 🐛 Common Issues & Fixes

### Issue: Music doesn't auto-play
**Fix:** Check browser autoplay policy
```javascript
// In console:
localStorage.getItem('promptquest_music_enabled')
```
- If falsy, user might have disabled music
- Click "🎵 Music On" button to enable

### Issue: Points not calculating
**Check:**
```javascript
Streak.dailyStreak  // Daily streak count
Streak.isSessionStreakActive()  // Is multiplier active?
Points.calculateForCorrectAnswer(1, 1, true, 5)  // Test calculation
```

### Issue: Streak not persisting
**Check localStorage:**
```javascript
// These should update after each answer
localStorage.getItem('promptquest_session_streak')
localStorage.getItem('promptquest_daily_streak')
localStorage.getItem('promptquest_last_play_date')
```

### Issue: Animations laggy on mobile
**Check:**
```javascript
// Chrome DevTools → Performance tab
// Should see < 16ms per frame (60fps = 16.6ms)
// If > 16ms, reduce particle count or animation duration
```

### Issue: Data not saving between sessions
**Check:**
```javascript
// Clear cache and test again
// Try incognito/private mode
// Check if localStorage is enabled
typeof(Storage) !== "undefined"
```

---

## 🧪 Test Scenarios

### Scenario 1: Build a 5-question Streak
1. Answer Q1 correctly → Session streak: 1
2. Answer Q2 correctly → Session streak: 2
3. Answer Q3 correctly → Session streak: 3
4. Answer Q4 correctly → Session streak: 4
5. Answer Q5 correctly → Session streak: 5 ✅
   - Multiplier should activate (1.5x)
   - "Get 5 more correct to unlock badge!" message
   - Points should show multiplier: "+3 ×1.5 = 4"

### Scenario 2: Test Streak Reset
1. Build streak to 3
2. Answer one wrong
3. Session streak should reset to 0
4. Toast notification: "Streak reset!"

### Scenario 3: Test Daily Streak Persistence
1. Complete a level today
2. Check: `Streak.dailyStreak` (should be 1 or higher)
3. Close browser completely
4. Reopen tomorrow
5. Open a level (triggers `Streak.checkDailyReset()`)
6. Daily streak should increment (not reset)

### Scenario 4: Complete a Full Zone
1. Answer all 4 levels in a zone correctly
2. On final correct answer:
   - ✅ Victory screen appears with zone stats
   - ✅ Zone badge might unlock
   - ✅ Celebration sound plays
   - ✅ Confetti animation (optional, subtle)

---

## 📈 Metrics Dashboard (Coming Phase 3)

Currently tracked in localStorage:
- Total stars: `Storage.getTotalStars()`
- Daily streak: `Streak.dailyStreak`
- Session streak: `Streak.sessionStreak`
- Badges: `Badges.getUnlockedBadges()`
- Progress: `Progress.getAllProgress()`

Future analytics will show:
- Daily active users (DAU)
- Session length
- Retention (day 7)
- Engagement score

---

## 🎓 Learning Verification

**The system works when:**
1. ✅ Music plays on load
2. ✅ Animations trigger smoothly (60fps)
3. ✅ Points calculated with multipliers
4. ✅ Streaks persist across sessions
5. ✅ Badges unlock at thresholds
6. ✅ Progress saves in localStorage
7. ✅ Header stats update in real-time
8. ✅ Keyboard navigation works
9. ✅ Screen reader announces events
10. ✅ Mobile animations are optimized

---

## 📝 Test Checklist

- [ ] Music auto-plays on load
- [ ] Can complete a full zone
- [ ] Animations smooth (no jank)
- [ ] Points display correctly
- [ ] Streak counter updates
- [ ] Progress persists on reload
- [ ] Wrong answer shows explanation
- [ ] Correct answer shows celebration
- [ ] Mobile layout responsive
- [ ] Keyboard navigation works
- [ ] Console has no errors
- [ ] Performance (60fps maintained)

---

## 🔗 Resources

- **Repo:** https://github.com/bharathp9/promptquest
- **Live Site:** https://bharathp9.github.io/promptquest/
- **Design Doc:** [GAMIFICATION_DESIGN.md](GAMIFICATION_DESIGN.md)
- **Implementation:** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)

---

## 📞 Support

**If something breaks:**

1. **Check console for errors:**
   ```javascript
   // Look for red errors in F12 → Console
   ```

2. **Reset all data:**
   ```javascript
   resetGameProgress()
   // Or manually: localStorage.clear()
   ```

3. **Reinitialize:**
   ```javascript
   initializeGameification()
   ```

4. **Check GitHub:**
   - Any recent pushes?
   - Are the JS files loading? (Network tab in DevTools)

---

**Status:** Phase 1 Complete ✅  
**Last Updated:** June 2026  
**Next:** Phase 2 (Daily streak UI, multiplier display, zone victory screens)
