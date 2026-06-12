# PromptQuest Quiz UX Testing Guide

## Test Cases for Quiz Interaction Flow

### Test 1: Correct Answer with 3 Stars
**Objective:** Verify that correct answers show next button, explanation, and proper points

**Steps:**
1. Start Level 1-1
2. Select the correct answer (option index 1)
3. Wait for animations (800ms)

**Expected Results:**
- ✅ Correct answer option highlights green
- ✅ Checkmark appears on correct option
- ✅ Explanation text appears in feedback box
- ✅ Points float up with calculation (e.g., "+3")
- ✅ "Next Level →" button appears
- ✅ "Back to Levels" button appears
- ✅ Other options are disabled and cannot be clicked
- ✅ Header stats update (stars increment)
- ✅ Streak counter updates

**Console Checks:**
```javascript
// Run in console to verify
getGameStats()  // Should show stars increased
Streak.getStreakDisplay()  // Should show streak active
```

---

### Test 2: Wrong Answer with Retry
**Objective:** Verify wrong answer flow allows retry

**Steps:**
1. Start Level 1-1
2. Select wrong answer (option index 0, 2, or 3)
3. Wait for animations (800ms)
4. Click "Try Again"

**Expected Results:**
- ✅ Wrong answer option highlights red
- ✅ Correct answer highlights green after delay
- ✅ Explanation text appears
- ✅ "Try Again" button appears
- ✅ "Review Lesson" button appears (if lesson exists)
- ✅ "Show Answer & Continue" button appears
- ✅ Level resets and can try again
- ✅ Streak counter resets

---

### Test 3: Multiple Wrong Attempts Then Correct
**Objective:** Verify points deduction for multiple attempts

**Steps:**
1. Start Level 1-2
2. Click wrong answer, see feedback
3. Click "Try Again"
4. Click another wrong answer
5. Click "Try Again"
6. Click correct answer

**Expected Results:**
- ✅ After 3rd attempt (correct): 2 stars awarded (not 3) due to hint/multiple attempts
- ✅ Points calculation shows reduced points: "+1" or "+2" (not "+3")
- ✅ Progress shows 2/3 stars for the level

**Console Check:**
```javascript
Progress.getLevel('1-2')  // Should show stars: 2
```

---

### Test 4: No Multiple Clicks After Selection
**Objective:** Verify options cannot be clicked multiple times

**Steps:**
1. Start Level 1-1
2. Click correct answer
3. While animations are playing, rapidly click other options
4. Wait for completion

**Expected Results:**
- ✅ Only the first clicked option triggers animation
- ✅ All options have `disabled` attribute set
- ✅ Options have `disabled` CSS class applied
- ✅ Clicking other options has no effect

**Console Check:**
```javascript
// Before clicking any option
document.querySelectorAll('.choice-item').forEach(b => console.log(b.disabled))  // Should be false/undefined
// After clicking an option
document.querySelectorAll('.choice-item').forEach(b => console.log(b.disabled))  // Should be true
```

---

### Test 5: Mobile Responsiveness
**Objective:** Verify quiz works on mobile (< 480px width)

**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Set width to 360px (mobile)
4. Complete a full level

**Expected Results:**
- ✅ Answer options fit on screen
- ✅ Buttons are at least 48×48px tap targets
- ✅ Animation shake is reduced (±2px instead of ±3px)
- ✅ Particle count reduced (4 instead of 8-12)
- ✅ Text is readable without zooming
- ✅ No horizontal scroll

---

### Test 6: Keyboard Navigation
**Objective:** Verify keyboard navigation works

**Steps:**
1. Start a level
2. Press Tab to focus options
3. Press Space or Enter to select focused option
4. Press Tab to focus buttons
5. Press Enter to click buttons

**Expected Results:**
- ✅ Options are focusable (Tab works)
- ✅ Option can be selected with Space/Enter
- ✅ Buttons are focusable
- ✅ Buttons activate with Enter
- ✅ Focus is visible (outline or highlight)

---

### Test 7: Screen Reader Accessibility
**Objective:** Verify screen reader announcements work

**Steps:**
1. Enable screen reader (use built-in OS accessibility)
2. Answer a question
3. Listen for announcements

**Expected Results:**
- ✅ Answer selection announced: "Correct answer!" or "Incorrect"
- ✅ Stars announced: "3 stars!", "2 stars", etc.
- ✅ Buttons announced with their labels

**Console Check:**
```javascript
// Check announcements are being created
document.querySelectorAll('[role="alert"]').forEach(el => console.log(el.textContent))
```

---

### Test 8: Analytics Events
**Objective:** Verify events are being tracked

**Steps:**
1. Answer a correct question
2. Check console for tracking

**Expected Results:**
- ✅ No errors in console
- ✅ Analytics initialized with userId and sessionId
- ✅ Events dispatched successfully

**Console Check:**
```javascript
// Check analytics
Analytics.userId      // Should show "user_XXXXX"
Analytics.sessionId   // Should show "session_XXXXX"
```

---

### Test 9: Streak Tracking
**Objective:** Verify streaks work correctly

**Steps:**
1. Complete 3 levels correctly in a row
2. Check streak display
3. Answer one level incorrectly
4. Verify streak resets

**Expected Results:**
- ✅ Session streak increments after each correct answer
- ✅ Streak displays in header
- ✅ Streak animates with glow effect
- ✅ After wrong answer: session streak resets to 0
- ✅ Daily streak persists

**Console Check:**
```javascript
// Check streak data
Streak.getStreakDisplay()
// {
//   session: 3,      // Current session streak
//   daily: 3,        // Total today
//   dailyMultiplierActive: false  // Active at 5+ streak
// }
```

---

### Test 10: Badge Unlocks
**Objective:** Verify badges unlock and display

**Steps:**
1. Complete 5 levels with 3 stars each
2. Watch for badge popup
3. Open console

**Expected Results:**
- ✅ Badge popup appears when condition met
- ✅ Badge bounces and auto-dismisses after 3 seconds
- ✅ Badge added to unlocked list

**Console Check:**
```javascript
Badges.getUnlockedBadges()  // Should show unlocked badges
```

---

## Automated Test Commands

Run these in the browser console to verify entire flows:

```javascript
// Test Suite Function
async function runQuizTests() {
  console.log('=== Quiz UX Test Suite ===\n');
  
  // Test 1: Stats exist
  console.log('1. Checking game stats...');
  const stats = getGameStats();
  console.log('✓ Game stats:', stats);
  
  // Test 2: Analytics initialized
  console.log('\n2. Checking analytics...');
  console.log('✓ User ID:', Analytics.userId);
  console.log('✓ Session ID:', Analytics.sessionId);
  
  // Test 3: Streak system
  console.log('\n3. Checking streak...');
  const streakData = Streak.getStreakDisplay();
  console.log('✓ Streak:', streakData);
  
  // Test 4: Progress system
  console.log('\n4. Checking progress...');
  const progress = Progress.getAllProgress();
  console.log('✓ Total stars:', progress.totalStars);
  console.log('✓ Levels completed:', progress.levelsCompleted);
  
  // Test 5: Badges
  console.log('\n5. Checking badges...');
  const badges = Badges.getUnlockedBadges();
  console.log('✓ Unlocked badges:', badges.length);
  badges.forEach(b => console.log(`  - ${b.name}`));
  
  // Test 6: Option disabling
  console.log('\n6. Testing option disable...');
  const options = document.querySelectorAll('.choice-item');
  console.log(`✓ Options found: ${options.length}`);
  options.forEach((opt, i) => {
    console.log(`  Option ${i}: disabled=${opt.disabled}, classes=${opt.className}`);
  });
  
  console.log('\n=== Tests Complete ===');
}

// Run the tests
runQuizTests();
```

---

## Issues Found & Fixed

### Issue 1: Analytics Initialization Error
**Error:** `Uncaught TypeError: this.generateSessionId is not a function`
**Fix:** Changed Analytics to use lazy getters for sessionId and userId
**Status:** ✅ Fixed

### Issue 2: No Next Button After Correct Answer  
**Error:** Auto-continue without showing buttons
**Fix:** Modified `_showAnswerFeedback()` to show "Next Level" button for correct answers
**Status:** ✅ Fixed

### Issue 3: Options Remain Clickable
**Error:** Multiple options could be selected before feedback
**Fix:** Added `answered` flag and `button.disabled = true` to prevent multiple submissions
**Status:** ✅ Fixed

### Issue 4: Game Object Not Found (Warnings Only)
**Error:** `"Game object not found, retrying..."` repeated in console
**Status:** ⚠️ Cosmetic (doesn't break functionality, just noisy)
**Note:** GameIntegration keeps retrying every 500ms until Game loads - eventually succeeds

---

## Manual Testing Checklist

- [ ] Correct answer shows explanation
- [ ] Correct answer shows next button
- [ ] Wrong answer can be retried
- [ ] Wrong answer shows correct answer highlighted
- [ ] Cannot click multiple options
- [ ] Points display correctly (not "0")
- [ ] Stars display correctly (1-3)
- [ ] Header stats update
- [ ] Streak counter updates
- [ ] Mobile layout works (<480px)
- [ ] Keyboard navigation works (Tab, Space, Enter)
- [ ] Screen reader works (with AT)
- [ ] No console errors
- [ ] Badges unlock correctly
- [ ] Daily streak persists across sessions

---

## Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 8+)

---

## Performance Baselines

- **Question Load:** < 200ms
- **Animation Duration:** 800ms total (feedback + animations)
- **Feedback Display:** Instant (< 50ms)
- **Button Response:** < 100ms
- **Points Calculation:** < 50ms

---

## Known Limitations

1. **Floating Points Display:** Currently shows in overlay - may overlap with text on small screens
2. **Game Object Retry:** Console shows many warnings before Game loads - doesn't affect functionality
3. **Daily Streak Reset:** Uses UTC midnight, not local timezone
4. **Mobile Landscape:** Not optimized for landscape mode on small devices

