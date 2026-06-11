# PromptQuest: The Prompt Engineering Dojo

> Created by **Bharath Kumar** | AI Strategist | SWAI (Strategic Workshops in AI)

An interactive web game that teaches prompt engineering to professionals. Built as a hands-on learning tool for SWAI workshops -- free, no signup, works offline.

## What It Is

A single-page game with 20 levels across 5 zones that teaches professional prompt engineering through interactive challenges, plus a curated Prompt Gallery with real-world templates.

### 5 Learning Zones (20 Levels)

1. **Foundation Valley** -- Basics: clarity, specificity, context, anatomy of a prompt
2. **Technique Tower** -- Core methods: role-based, chain-of-thought, few-shot, structured output
3. **Refinement Ridge** -- Advanced: iterative refinement, chaining, system prompts, edge cases
4. **Pitfall Peaks** -- Debugging: common mistakes, hallucination prevention, balance, ethics
5. **Mastery Mountain** -- Real-world: business use cases, code generation, multi-step workflows

### Prompt Gallery

A curated library of 16 real-world prompt templates across 6 categories:
- Business & Strategy (SWOT analysis, email tone adapter, meeting extractor, battlecard)
- Writing & Content (blog outliner, social media adapter, tech documentation)
- Code & Development (code review, function generator with tests, SQL builder)
- Analysis & Research (data interpreter, research synthesizer)
- Education & Training (Socratic tutor, quiz generator, lesson plan builder)
- Creative & Design (creative brief, UX copy)

Each prompt can be copied to clipboard with one click. Students can study the patterns and adapt them for their own use.

## Challenge Types

- **Multiple Choice** -- Pick the best prompt approach
- **Compare & Choose** -- Select the better prompt between two options
- **Fill in the Blank** -- Complete a prompt with the right context or technique
- **Ordering** -- Arrange prompt components in the correct order

## Features

- Dark theme, professional aesthetic
- 3-star scoring system per level
- Progressive unlocking (complete levels to unlock the next)
- Progress saved to localStorage
- Hints available (reduces star rating)
- Prompt Gallery with copy-to-clipboard
- Completion Certificate with name entry and title based on score (use browser Print to save as PDF)
- Progress Dashboard (view all scores, printable)
- Responsive design (mobile + desktop)
- Works offline after first load
- Zero dependencies, no backend

## Quick Start

```bash
# Open in browser (no server needed)
open index.html

# Or serve locally
python3 -m http.server 8000
```

## How to Share with Students

### Option 1: GitHub Pages (Recommended, Free)

1. Create a repo on GitHub and push the code
2. Go to **Settings > Pages**
3. Under "Source", select **Deploy from a branch**
4. Branch: `main`, folder: `/ (root)`
5. Click **Save**
6. Share the link with students

### Option 2: Direct Link (If Already Hosted)

If deployed to a VPS or hosting platform, simply share the URL.

### Option 3: Embed in Course Materials

Since it is a single HTML file, you can:
- Download `index.html` and distribute it directly
- Embed in an iframe on your LMS (Moodle, Canvas, etc.)
- Share via Google Drive / Dropbox file link

### For SWAI Workshop

Share the link with attendees before the session so they can:
1. Play through zones 1-2 before the workshop (foundation + techniques)
2. Browse the Prompt Gallery to see real-world examples
3. During the workshop, use specific levels as live exercises
4. After the workshop, continue through zones 3-5 for advanced practice
5. Generate their completion certificate after finishing all 20 levels

## About

PromptQuest was created by **Bharath Kumar** as a hands-on learning tool for SWAI (Strategic Workshops in AI) participants. The Prompt Gallery features curated real-world prompt templates organized by category -- from business strategy to code generation -- so students can study proven patterns and adapt them for their own use.

## License

CC0 -- Free for any use, no attribution required.
