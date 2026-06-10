// PromptQuest Level Data
// 20 levels across 5 zones, based on "The Interactive Book of Prompting"

const LEVELS = [
  // ==================== ZONE 1: FOUNDATION VALLEY ====================
  {
    id: "1-1", zone: 1, zoneName: "Foundation Valley",
    title: "What is a Prompt?",
    scenario: "You're a marketing manager who just got access to ChatGPT. You type 'Help me with my campaign' and get a generic response. You realize you need to understand what a prompt actually is.",
    challenge: "multiple_choice",
    question: "What is the BEST definition of a prompt in the context of AI?",
    options: [
      "A command that forces the AI to do exactly what you want",
      "An instruction or question you give to an AI to get a specific response",
      "A programming language used to code AI models",
      "A type of AI model that generates text"
    ],
    correct: 1,
    explanation: "A prompt is an instruction or question you give to an AI to get a specific response. It's not a programming language, and it doesn't 'force' the AI -- the quality of your prompt determines the quality of the output.",
    hint: "Think about what you actually type into ChatGPT or Claude."
  },
  {
    id: "1-2", zone: 1, zoneName: "Foundation Valley",
    title: "The Clarity Principle",
    scenario: "You ask an AI: 'Write something about our product.' The result is vague and unusable. Your colleague asks: 'Write a 150-word product description for our project management SaaS targeting small business owners, highlighting ease of use and collaboration features.' The result is much better.",
    challenge: "compare_prompts",
    question: "Which prompt will get a BETTER result? Why?",
    promptA: "Write something about our product.",
    promptB: "Write a 150-word product description for our project management SaaS targeting small business owners, highlighting ease of use and collaboration features.",
    correct: "b",
    explanation: "Prompt B is far superior because it specifies: the format (product description), length (150 words), audience (small business owners), and key points to cover (ease of use, collaboration). Prompt A gives the AI no direction, so it has to guess what you want.",
    hint: "Compare the level of detail in each prompt."
  },
  {
    id: "1-3", zone: 1, zoneName: "Foundation Valley",
    title: "Adding Context",
    scenario: "You're a data analyst. You ask an AI to 'Analyze this sales data' without providing any context about what the data contains, what period it covers, or what insights you're looking for. The AI gives a generic analysis.",
    challenge: "fill_blanks",
    question: "Fill in the blanks to create a well-contextualized prompt:",
    blanks: [
      { label: "Role", answer: "data analyst", hint: "Your job title" },
      { label: "Data type", answer: "Q3 2024 sales data", hint: "What data and time period" },
      { label: "Goal", answer: "identify trends and anomalies", hint: "What you want to find" },
      { label: "Output format", answer: "bullet points with percentages", hint: "How you want the results" }
    ],
    explanation: "Good context includes: who you are (role), what data you're working with (data type), what you want to achieve (goal), and how you want the output (format). This helps the AI give you exactly what you need.",
    hint: "Think about what information the AI needs to give you a useful answer."
  },
  {
    id: "1-4", zone: 1, zoneName: "Foundation Valley",
    title: "Anatomy of a Prompt",
    scenario: "You're writing a prompt to generate a weekly status report from raw project data. You want to make sure your prompt has all the essential components.",
    challenge: "drag_drop",
    question: "Arrange these prompt components in the BEST order:",
    items: [
      { id: "role", text: "Act as a senior project manager" },
      { id: "task", text: "Generate a weekly status report" },
      { id: "context", text: "from the following project data: [data]" },
      { id: "format", text: "Format as: Summary, Progress, Risks, Next Steps" },
      { id: "constraint", text: "Keep it under 300 words" }
    ],
    correctOrder: ["role", "task", "context", "format", "constraint"],
    explanation: "The best prompt structure is: 1) Role (who the AI should be), 2) Task (what to do), 3) Context (the data/situation), 4) Format (how to structure output), 5) Constraints (limits like word count). This gives the AI a complete picture.",
    hint: "Start with who the AI should be, then what it should do."
  },

  // ==================== ZONE 2: TECHNIQUE TOWER ====================
  {
    id: "2-1", zone: 2, zoneName: "Technique Tower",
    title: "Role-Based Prompting",
    scenario: "You need to prepare for a difficult conversation with an underperforming team member. You want the AI to give you advice from the perspective of an experienced HR professional.",
    challenge: "multiple_choice",
    question: "Which prompt uses role-based prompting MOST effectively?",
    options: [
      "Tell me how to talk to an underperforming employee.",
      "I need help with an employee. What should I say?",
      "Act as an experienced HR professional with 15 years of experience in performance management. I need to have a difficult conversation with a team member who has been missing deadlines for 3 months. Provide a step-by-step guide for the conversation, including specific phrases I can use.",
      "Pretend you're HR and help me."
    ],
    correct: 2,
    explanation: "Option C is the best because it: 1) Defines a specific role (experienced HR professional), 2) Adds credibility (15 years experience), 3) Provides context (missing deadlines for 3 months), 4) Specifies the output format (step-by-step guide with phrases). The 'Act As' technique works best when you're specific about the role and context.",
    hint: "Look for the prompt that gives the AI the most specific role and context."
  },
  {
    id: "2-2", zone: 2, zoneName: "Technique Tower",
    title: "Chain of Thought",
    scenario: "You're a financial analyst trying to understand why your company's profit margin dropped from 25% to 18% over the last quarter. This requires multi-step reasoning.",
    challenge: "multiple_choice",
    question: "Which prompt will get the AI to show its reasoning step by step?",
    options: [
      "Why did our profit margin drop?",
      "Analyze our profit margin drop from 25% to 18% last quarter.",
      "Our profit margin dropped from 25% to 18% last quarter. Walk me through your analysis step by step. First, identify possible causes. Then, evaluate each cause against our data. Finally, rank the causes by likelihood and suggest actions.",
      "Think step by step about our profit margin."
    ],
    correct: 2,
    explanation: "Chain-of-thought prompting explicitly asks the AI to break down its reasoning. Option C does this best by: 1) Providing the specific numbers, 2) Asking for step-by-step analysis, 3) Defining the steps (identify, evaluate, rank), 4) Requesting actionable output. Simply saying 'think step by step' (Option D) is less effective than defining the actual steps.",
    hint: "The best chain-of-thought prompt defines WHAT steps the AI should take."
  },
  {
    id: "2-3", zone: 2, zoneName: "Technique Tower",
    title: "Few-Shot Learning",
    scenario: "You want the AI to convert a list of customer feedback comments into a specific format: sentiment (positive/negative/neutral) + key topic + action item. You have some examples of how you want it formatted.",
    challenge: "spot_bug",
    question: "You wrote this prompt. What's WRONG with it?\n\n'Convert these customer feedback comments into sentiment analysis format. Here's an example:\n\nInput: \"The product is great but shipping was slow\"\nOutput: Sentiment: Mixed | Topic: Shipping | Action: Review logistics partner\n\nNow convert these: [list of 50 comments]'",
    bug: "The prompt only provides ONE example (one-shot). For reliable results with 50 comments, you should provide 3-5 examples covering different sentiment types (positive, negative, neutral) and different topics. This helps the AI understand the full range of expected outputs.",
    explanation: "Few-shot learning works best with 3-5 diverse examples. One example (one-shot) often isn't enough for the AI to understand the pattern, especially with varied input. Include examples that cover edge cases and different categories.",
    hint: "How many examples does the AI need to understand the pattern reliably?"
  },
  {
    id: "2-4", zone: 2, zoneName: "Technique Tower",
    title: "Structured Output",
    scenario: "You're building an app that uses AI to extract information from business emails. You need the AI to return data in a specific JSON format so your code can parse it automatically.",
    challenge: "fill_blanks",
    question: "Fill in the blanks to create a prompt that gets structured JSON output:",
    blanks: [
      { label: "Format instruction", answer: "Return the result as a JSON object", hint: "Tell it what format to use" },
      { label: "Schema", answer: "with fields: sender, intent, priority, deadline", hint: "Specify the fields" },
      { label: "Example", answer: "Example: {\"sender\": \"...\", \"intent\": \"...\", \"priority\": \"high/medium/low\", \"deadline\": \"YYYY-MM-DD\"}", hint: "Show an example" },
      { label: "Constraint", answer: "Do not include any text outside the JSON", hint: "Prevent extra text" }
    ],
    explanation: "For structured output, you need to: 1) Specify the format (JSON), 2) Define the schema (fields), 3) Provide an example, 4) Add constraints (no extra text). This ensures the AI returns data your code can parse reliably.",
    hint: "Think about what a developer needs to parse the output automatically."
  },

  // ==================== ZONE 3: REFINEMENT RIDGE ====================
  {
    id: "3-1", zone: 3, zoneName: "Refinement Ridge",
    title: "Iterative Refinement",
    scenario: "You asked an AI to write a project proposal. The first draft is too long, lacks specific budget figures, and doesn't address risks. You need to improve it through iteration.",
    challenge: "multiple_choice",
    question: "What is the BEST approach to iteratively refine the AI's output?",
    options: [
      "Start over with a completely new prompt from scratch.",
      "Tell the AI: 'Make it better.'",
      "Give specific feedback: 'Reduce to 500 words, add a budget table with estimated costs for each phase, and add a risk mitigation section with at least 3 identified risks and their solutions.'",
      "Use a different AI model entirely."
    ],
    correct: 2,
    explanation: "Iterative refinement works best with specific, actionable feedback. Option C tells the AI exactly what to change: length (500 words), specific additions (budget table, risk section), and quantifiers (3 risks). Vague feedback like 'make it better' gives the AI no direction on what to change.",
    hint: "The best feedback is specific and measurable."
  },
  {
    id: "3-2", zone: 3, zoneName: "Refinement Ridge",
    title: "Prompt Chaining",
    scenario: "You need to create a comprehensive go-to-market strategy for a new product. This is too complex for a single prompt -- it involves market analysis, competitor research, positioning, pricing, and launch planning.",
    challenge: "drag_drop",
    question: "Arrange these prompt steps in the BEST order for prompt chaining:",
    items: [
      { id: "step1", text: "Analyze the target market size and growth trends for [product category]" },
      { id: "step2", text: "Based on the market analysis, identify the top 3 competitors and their positioning" },
      { id: "step3", text: "Using the competitor analysis, define our unique value proposition and positioning" },
      { id: "step4", text: "Based on positioning, recommend a pricing strategy with 3 tiers" },
      { id: "step5", text: "Create a 90-day launch plan using the positioning and pricing strategy" }
    ],
    correctOrder: ["step1", "step2", "step3", "step4", "step5"],
    explanation: "Prompt chaining breaks complex tasks into sequential steps where each step builds on the previous one. The logical flow is: Market Analysis -> Competitor Research -> Positioning -> Pricing -> Launch Plan. Each step uses the output of the previous step as context.",
    hint: "Think about the logical dependency between each step."
  },
  {
    id: "3-3", zone: 3, zoneName: "Refinement Ridge",
    title: "System Prompts & Personas",
    scenario: "You're setting up an AI assistant for your customer support team. You want it to always be professional, empathetic, and follow your company's tone guidelines.",
    challenge: "multiple_choice",
    question: "Where should you define the AI's persona and behavior guidelines?",
    options: [
      "In every single message you send to the AI",
      "In a system prompt that sets the AI's default behavior",
      "In the user's profile settings",
      "You can't control the AI's persona"
    ],
    correct: 1,
    explanation: "System prompts define the AI's default behavior, persona, and guidelines. They're set once and apply to all subsequent messages. This is much more efficient than repeating guidelines in every message. Most AI platforms (ChatGPT, Claude, etc.) support system prompts.",
    hint: "Think about where you'd set behavior that applies to ALL conversations."
  },
  {
    id: "3-4", zone: 3, zoneName: "Refinement Ridge",
    title: "Handling Edge Cases",
    scenario: "You've created a prompt that works well for 90% of customer inquiries. But it fails when: (1) the customer writes in all caps, (2) the inquiry is in a different language, or (3) the customer asks about a product you don't carry.",
    challenge: "fill_blanks",
    question: "Fill in the blanks to handle these edge cases in your prompt:",
    blanks: [
      { label: "All caps", answer: "regardless of capitalization or formatting", hint: "Case insensitivity" },
      { label: "Language", answer: "If the inquiry is in another language, respond in the same language", hint: "Language matching" },
      { label: "Unknown product", answer: "If the product is not in our catalog, politely explain and suggest alternatives", hint: "Graceful fallback" },
      { label: "General", answer: "If you're unsure about any information, say so rather than guessing", hint: "Honesty policy" }
    ],
    explanation: "Handling edge cases means anticipating what could go wrong and telling the AI how to respond. Key strategies: normalize input (handle caps), match language, provide fallback responses for unknown inputs, and tell the AI to admit uncertainty rather than guess.",
    hint: "Think about what could go wrong and how the AI should respond."
  },

  // ==================== ZONE 4: PITFALL PEAKS ====================
  {
    id: "4-1", zone: 4, zoneName: "Pitfall Peaks",
    title: "Common Mistakes",
    scenario: "A colleague shares their prompt: 'Write a good email to my boss about the project.' The AI's response is too generic and doesn't match what they needed.",
    challenge: "spot_bug",
    question: "Identify ALL the problems with this prompt: 'Write a good email to my boss about the project.'",
    bug: "This prompt has multiple problems: 1) 'Good' is subjective -- what makes an email 'good'? 2) No context about the project (which project? what's the status?). 3) No purpose (is this an update? a request? a problem report?). 4) No tone specified (formal? casual? urgent?). 5) No length constraint. 6) No specific details to include. A better prompt would specify: the project name, the email's purpose, the tone, key points to cover, and the desired length.",
    explanation: "Common prompt mistakes include: vague adjectives ('good', 'nice', 'better'), missing context, no clear purpose, undefined tone, and no constraints. Every word in your prompt should serve a purpose.",
    hint: "Count how many specific details are missing from this prompt."
  },
  {
    id: "4-2", zone: 4, zoneName: "Pitfall Peaks",
    title: "Hallucination Prevention",
    scenario: "You asked an AI to provide statistics about your industry's market size. It gave you specific numbers that look convincing but you're not sure if they're real. You need to verify the information.",
    challenge: "multiple_choice",
    question: "Which prompt modification BEST prevents AI hallucinations (made-up information)?",
    options: [
      "Add: 'Be accurate.'",
      "Add: 'Only use verified data from reputable sources. If you're not certain about a number, say so instead of guessing. Provide sources for all statistics.'",
      "Add: 'Don't lie.'",
      "Add: 'Make sure everything is true.'"
    ],
    correct: 1,
    explanation: "Option B is the most effective because it: 1) Specifies the source quality (reputable sources), 2) Gives the AI permission to say 'I don't know' (reducing pressure to invent), 3) Requires sources (making verification possible). Simply saying 'be accurate' or 'don't lie' doesn't give the AI a strategy for handling uncertainty.",
    hint: "The best approach gives the AI a clear strategy for handling uncertainty."
  },
  {
    id: "4-3", zone: 4, zoneName: "Pitfall Peaks",
    title: "Over vs Under-Prompting",
    scenario: "You're trying to find the right level of detail in your prompts. Too little detail gives generic results. Too much detail confuses the AI or makes it ignore important parts.",
    challenge: "compare_prompts",
    question: "Which prompt strikes the BEST balance between too little and too much detail?",
    promptA: "Write an email.",
    promptB: "Write a professional email to the VP of Engineering, Sarah Chen, updating her on the Q3 platform migration project. The email should: (1) Open with a one-sentence executive summary, (2) Detail the 3 key milestones completed this week with specific metrics, (3) Flag 2 risks with proposed mitigations, (4) Request a 30-minute meeting to discuss the go-live plan, (5) Close with a specific call-to-action. Keep it under 250 words. Use a confident but not overly formal tone. Include the project codename 'Project Hermes' in the subject line. CC the engineering leads. Reference the JIRA epic. Attach the latest test results. Mention the budget status. Note the team morale. Include the deployment timeline. Add the rollback plan summary.",
    promptC: "Write a professional email to the VP of Engineering updating her on the Q3 platform migration. Include: (1) Executive summary, (2) 3 key milestones with metrics, (3) 2 risks with mitigations, (4) Request a meeting to discuss go-live. Keep under 250 words.",
    correct: "c",
    explanation: "Prompt C strikes the best balance. Prompt A is too vague (under-prompting). Prompt B is overloaded with too many details (over-prompting) -- the AI may miss important points in the noise. Prompt C provides clear structure with the right level of detail: who, what, key points, and a length constraint.",
    hint: "Look for the prompt that's detailed but not overwhelming."
  },
  {
    id: "4-4", zone: 4, zoneName: "Pitfall Peaks",
    title: "Security & Ethics",
    scenario: "You're using AI at work and want to make sure you're using it responsibly. You need to avoid sharing sensitive data and ensure the AI's outputs are fair and unbiased.",
    challenge: "multiple_choice",
    question: "Which of the following is a BEST practice for responsible AI use in a professional setting?",
    options: [
      "Share customer PII (Personally Identifiable Information) with the AI if it helps get better results.",
      "Use the AI's output as-is without reviewing it, since the AI is usually right.",
      "Never share confidential company data, customer PII, or trade secrets with public AI tools. Always review AI outputs for accuracy and bias before using them.",
      "Use AI for everything -- it's always better than human work."
    ],
    correct: 2,
    explanation: "Responsible AI use means: 1) Never sharing confidential data or PII with public AI tools, 2) Always reviewing outputs for accuracy (AI makes mistakes), 3) Checking for bias in outputs, 4) Using AI as a tool, not a replacement for human judgment. Options A, B, and D are all dangerous practices.",
    hint: "Think about data privacy and the limitations of AI."
  },

  // ==================== ZONE 5: MASTERY MOUNTAIN ====================
  {
    id: "5-1", zone: 5, zoneName: "Mastery Mountain",
    title: "Business Use Cases",
    scenario: "You're a product manager who needs to prepare for a quarterly business review. You need to: analyze user feedback from the last quarter, identify the top 3 product issues, and create an executive summary with recommendations.",
    challenge: "drag_drop",
    question: "Arrange these prompt components to create the MOST effective business prompt:",
    items: [
      { id: "role", text: "Act as a senior product manager preparing for a QBR" },
      { id: "data", text: "Here is the user feedback data from Q3: [data]" },
      { id: "task", text: "Analyze the feedback and identify the top 3 product issues" },
      { id: "format", text: "Format the output as an executive summary with: Issue, Impact, Recommendation, Effort Level" },
      { id: "audience", text: "The audience is the executive team -- keep it strategic, not technical" }
    ],
    correctOrder: ["role", "data", "task", "format", "audience"],
    explanation: "Effective business prompts follow this structure: 1) Role (establishes expertise level), 2) Data (provides the raw material), 3) Task (what to do with the data), 4) Format (how to present results), 5) Audience (who will read it -- determines tone and detail level). This ensures the output is actionable and presentation-ready.",
    hint: "Think about what a product manager needs to present to executives."
  },
  {
    id: "5-2", zone: 5, zoneName: "Mastery Mountain",
    title: "Code Generation Prompts",
    scenario: "You're a developer who needs to write a Python function that validates email addresses, checks for disposable email domains, and returns a structured result. You want the AI to generate production-quality code.",
    challenge: "fill_blanks",
    question: "Fill in the blanks to create an effective code generation prompt:",
    blanks: [
      { label: "Language", answer: "Python", hint: "Programming language" },
      { label: "Function", answer: "validate_email(email: str) -> dict", hint: "Function signature" },
      { label: "Requirements", answer: "Check format with regex, check against disposable domain list, return {valid: bool, reason: str}", hint: "What it should do" },
      { label: "Quality", answer: "Include type hints, docstring, and error handling", hint: "Code quality standards" }
    ],
    explanation: "Effective code generation prompts specify: 1) The programming language, 2) The function signature (inputs/outputs), 3) The specific requirements, 4) Quality standards (type hints, docs, error handling). The more specific you are about the interface, the more usable the generated code.",
    hint: "Think about what a developer needs to integrate the code."
  },
  {
    id: "5-3", zone: 5, zoneName: "Mastery Mountain",
    title: "Complex Multi-step Workflows",
    scenario: "You need to set up an automated workflow that: (1) receives a customer complaint, (2) classifies its urgency, (3) drafts a response, (4) escalates if needed, and (5) logs the interaction. This requires combining multiple prompt techniques.",
    challenge: "multiple_choice",
    question: "Which approach is BEST for this complex workflow?",
    options: [
      "Write one massive prompt that does everything at once.",
      "Use prompt chaining: separate prompts for classification, drafting, escalation check, and logging, where each step feeds into the next.",
      "Use a different AI model for each step.",
      "Don't use AI for this -- it's too complex."
    ],
    correct: 1,
    explanation: "Prompt chaining is the best approach for complex workflows. Each step has a clear, focused task: classification -> drafting -> escalation check -> logging. This is more reliable than one massive prompt (which tends to lose track of instructions) and more practical than using different models. Each step's output becomes the next step's input.",
    hint: "Complex tasks are best broken into smaller, focused steps."
  },
  {
    id: "5-4", zone: 5, zoneName: "Mastery Mountain",
    title: "The Perfect Prompt Challenge",
    scenario: "FINAL CHALLENGE: You're the head of operations at a mid-size company. You need to create a prompt that will be used by your entire team to generate weekly department reports. It needs to work reliably for different departments (Sales, Engineering, Marketing, Support) with different data sources.",
    challenge: "spot_bug",
    question: "You wrote this team-wide prompt. What are its BIGGEST problems?\n\n'Act as an operations analyst. Generate a weekly report from the department data. Include key metrics, trends, and recommendations. Make it professional and keep it concise. The report should cover the main points and be useful for leadership.'",
    bug: "This prompt has several critical problems for a team-wide template: 1) No department-specific customization (Sales metrics differ from Engineering metrics). 2) No data source specification (where does the data come from?). 3) No standardized format (each department's report will look different). 4) 'Concise' is subjective -- no word/page limit. 5) No specific metrics defined (what are 'key metrics' for each department?). 6) No audience definition (who is 'leadership' -- C-suite vs direct managers need different detail levels). A better approach: create a template with department-specific sections, define exact metrics per department, specify the data source, set a word limit, and define the audience.",
    explanation: "The 'perfect prompt' for a team needs: department-specific sections, defined metrics, specified data sources, standardized format, clear audience, and measurable constraints. One-size-fits-all prompts rarely work across different teams. The best approach is a template with customizable sections.",
    hint: "Think about what differs between departments and what needs to be standardized."
  }
];

// Zone metadata
const ZONES = [
  { id: 1, name: "Foundation Valley", icon: "🏔️", desc: "Learn the fundamentals of prompt engineering", color: "blue" },
  { id: 2, name: "Technique Tower", icon: "🗼", desc: "Master core prompting techniques", color: "purple" },
  { id: 3, name: "Refinement Ridge", icon: "⛰️", desc: "Advanced strategies and optimization", color: "green" },
  { id: 4, name: "Pitfall Peaks", icon: "🏔️", desc: "Avoid common mistakes and edge cases", color: "orange" },
  { id: 5, name: "Mastery Mountain", icon: "🏆", desc: "Real-world applications and challenges", color: "red" }
];
