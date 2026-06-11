// PromptQuest - All 20 Level Definitions
// Each level has: id, zone, number, title, scenario, challenge type, and correct answer

const LEVELS = [
    // ===== ZONE 1: FOUNDATION VALLEY =====
    {
        id: "1-1", zone: 1, number: 1,
        title: "What is a Prompt?",
        scenario: "You are writing a guide for your team about AI tools. You need to explain what a 'prompt' is in the context of AI systems.",
        type: "multiple-choice",
        question: "Which of the following best defines a prompt in the context of AI language models?",
        choices: [
            "A command-line instruction that tells a computer what program to run",
            "A natural language input that provides context and instructions to guide an AI model's output",
            "A programming function that sends data to an AI API",
            "A type of software that automates repetitive tasks"
        ],
        correct: 1,
        explanation: "A prompt is a natural language input that provides context, instructions, and guidance to an AI model to produce a desired output. It is the primary way humans communicate intent to language models."
    },
    {
        id: "1-2", zone: 1, number: 2,
        title: "The Clarity Principle",
        scenario: "Your colleague asks the AI: 'Tell me about marketing.' The response is a generic 2-paragraph overview that is not useful.",
        type: "compare-choice",
        question: "Which prompt will produce a more useful response for someone who needs to create a social media marketing plan for a small business?",
        choices: [
            "Tell me about marketing",
            "Give me 5 specific social media marketing strategies for a small local coffee shop with a monthly budget under RM 2,000. Include platform recommendations and content types for each."
        ],
        correct: 1,
        explanation: "The second prompt is far more specific: it defines the context (small coffee shop), constraints (budget under RM 2,000), format (5 strategies with platform and content types), and audience. Specificity drives useful output."
    },
    {
        id: "1-3", zone: 1, number: 3,
        title: "Adding Context",
        scenario: "You need the AI to write an email to a client. Without context, the email sounds robotic and does not match your company's tone.",
        type: "fill-blank",
        question: "Fill in the blank to create a prompt that includes proper context:\n\n'Write a follow-up email to a client who missed our product demo yesterday. The tone should be _______________. Mention that we have next Tuesday and Thursday available, and include a link to our booking page.'",
        placeholder: "e.g., professional but warm, understanding rather than pushy",
        answer: "professional but warm, understanding rather than pushy",
        acceptable: ["professional but warm", "friendly and understanding", "warm and professional", "understanding and helpful", "polite and professional"],
        explanation: "Adding tone and style context transforms generic output into something that matches your brand voice. The more context you provide about the situation, audience, and desired tone, the better the result."
    },
    {
        id: "1-4", zone: 1, number: 4,
        title: "The Anatomy of a Prompt",
        scenario: "You are building a template system for your team. You want to teach them the four essential components of an effective prompt.",
        type: "drag-drop",
        question: "Arrange these four components in the order they typically appear in a well-structured prompt:",
        items: ["Task (what you want done)", "Role (who the AI should act as)", "Format (how the output should be structured)", "Constraints (limitations and requirements)"],
        correctOrder: ["Role (who the AI should act as)", "Task (what you want done)", "Format (how the output should be structured)", "Constraints (limitations and requirements)"],
        explanation: "A well-structured prompt typically flows: Role first (sets the persona), then Task (the core request), Format (output structure), and Constraints (boundaries). This framework is sometimes called RTFC."
    },

    // ===== ZONE 2: TECHNIQUE TOWER =====
    {
        id: "2-1", zone: 2, number: 1,
        title: "Role-Based Prompting",
        scenario: "You need to prepare training materials for new employees. You want the AI to generate content that sounds like it came from an experienced operations manager.",
        type: "multiple-choice",
        question: "Which prompt uses role-based prompting most effectively?",
        choices: [
            "Write about operations management for new employees",
            "You are a senior operations manager with 15 years of experience in manufacturing. Write a 500-word guide for new employees explaining the top 5 operational KPIs they should understand in their first month.",
            "Explain operations management KPIs to someone who is new at a manufacturing company",
            "As an expert, write something about KPIs for new employees"
        ],
        correct: 1,
        explanation: "The best role-based prompt assigns a specific persona with defined expertise (senior operations manager, 15 years, manufacturing) AND combines it with clear task parameters (500 words, top 5 KPIs, first month). The role gives the AI a knowledge lens; the parameters give it structure."
    },
    {
        id: "2-2", zone: 2, number: 2,
        title: "Chain of Thought",
        scenario: "You need the AI to help you calculate whether hiring a part-time employee is financially viable. A direct answer keeps getting the math wrong.",
        type: "multiple-choice",
        question: "Which prompt will most reliably produce a correct financial analysis?",
        choices: [
            "Should I hire a part-time employee for RM 3,000/month? We currently make RM 15,000/month revenue with RM 10,000 in costs.",
            "I need to decide whether to hire a part-time employee. Help me think through this step by step: (1) Calculate current monthly profit, (2) Subtract the new salary cost, (3) Estimate if the additional capacity could generate at least RM 3,000 in new revenue, (4) Give me a clear recommendation with reasoning.",
            "Calculate my profit after hiring someone for RM 3,000. Revenue is RM 15,000, costs are RM 10,000.",
            "Tell me if hiring a part-time worker at RM 3,000/month is a good idea for my business."
        ],
        correct: 1,
        explanation: "Chain-of-thought prompting asks the AI to reason step by step before reaching a conclusion. This dramatically improves accuracy for mathematical and logical tasks. By breaking the problem into numbered steps, you reduce the chance of the AI skipping logic or making calculation errors."
    },
    {
        id: "2-3", zone: 2, number: 3,
        title: "Few-Shot Learning",
        scenario: "You want the AI to classify customer feedback into categories, but it keeps using inconsistent labels. You need it to follow your exact classification system.",
        type: "fill-blank",
        question: "Complete this prompt with two examples (few-shot) to get consistent classification:\n\n'Classify each customer feedback into one of these categories: Product Quality, Delivery, Pricing, Customer Service, Other.\n\nExample 1: \"The item arrived with a scratch on the surface.\" → Product Quality\nExample 2: \"Delivery took 2 weeks instead of 3 days.\" → Delivery\n\nNow classify this: \"The price increased by 30% since last month with no notice.\" → _______________'",
        placeholder: "Pricing",
        answer: "Pricing",
        acceptable: ["pricing"],
        explanation: "Few-shot examples show the AI exactly what you want. By providing 2-3 input-output examples before the actual task, you establish the pattern, format, and categories. This is especially powerful for classification, formatting, and style-matching tasks."
    },
    {
        id: "2-4", zone: 2, number: 4,
        title: "Structured Output",
        scenario: "You need to extract specific information from 50 customer emails and compile them into a spreadsheet. You want the AI to output data in a format you can directly use.",
        type: "multiple-choice",
        question: "Which prompt will produce the most useful structured output for data extraction?",
        choices: [
            "Read these emails and tell me what they say about our product",
            "Extract information from each email and return it as a JSON array. Each object should have: {customer_name, email_date, sentiment (positive/negative/neutral), main_topic, action_required (yes/no), action_description}. Here are the emails: ...",
            "Summarize the customer emails and give me the key points",
            "Go through these emails and list out any complaints or praise"
        ],
        correct: 1,
        explanation: "Structured output prompts specify the exact format (JSON), field names, and value constraints. This makes the output directly usable in spreadsheets, databases, or code. Always specify the format when you need to process the output programmatically."
    },

    // ===== ZONE 3: REFINEMENT RIDGE =====
    {
        id: "3-1", zone: 3, number: 1,
        title: "Iterative Refinement",
        scenario: "Your first prompt produces a response that is too formal and too long for your audience (busy executives who want quick bullet points).",
        type: "multiple-choice",
        question: "What is the best approach to refine this prompt iteratively?",
        choices: [
            "Start over with a completely different prompt",
            "Add 'make it shorter and less formal' to the existing prompt, then review the result and adjust tone and length again based on what you see",
            "Use a different AI model entirely",
            "Accept the output and manually edit it yourself"
        ],
        correct: 1,
        explanation: "Iterative refinement is the core skill of prompt engineering. Instead of trying to get perfect output in one shot, you: (1) write an initial prompt, (2) review the output, (3) identify what needs to change, (4) adjust the prompt accordingly, and (5) repeat. Each iteration gets you closer to the ideal output."
    },
    {
        id: "3-2", zone: 3, number: 2,
        title: "Prompt Chaining",
        scenario: "You need to create a comprehensive market analysis report. A single prompt produces shallow, surface-level content because the task is too complex.",
        type: "multiple-choice",
        question: "Which approach demonstrates prompt chaining for this complex task?",
        choices: [
            "Write one very long prompt that includes every detail about the market analysis",
            "Break it into steps: First prompt asks for an outline of the report. Second prompt expands each section from the outline. Third prompt polishes the language and adds data tables.",
            "Ask the AI to 'do a thorough market analysis' and hope for the best",
            "Write the report yourself and ask the AI only to check grammar"
        ],
        correct: 1,
        explanation: "Prompt chaining breaks complex tasks into sequential steps where each step builds on the previous output. This mirrors how humans tackle complex work: outline first, then draft, then refine. Each step gets the AI's full attention, producing higher quality than one massive prompt."
    },
    {
        id: "3-3", zone: 3, number: 3,
        title: "System Prompts & Personas",
        scenario: "You are building a customer support chatbot. It needs to always be polite, never make up information, and escalate to a human when it is unsure.",
        type: "fill-blank",
        question: "Write a system prompt that establishes the AI's persona and rules for a customer support chatbot:\n\n'You are a _______________ for [Company Name]. Always be _______________. Never _______________. If you are unsure about any answer, always _______________.'",
        placeholder: "customer support agent... polite and helpful... make up information... escalate to a human agent",
        answer: "customer support agent",
        acceptable: ["customer support agent", "customer service representative", "support specialist", "helpful customer support assistant"],
        explanation: "System prompts set the persistent behavior and persona of an AI. They define who the AI is, how it should behave, and what its boundaries are. Good system prompts include: the role, behavioral rules, prohibitions, and fallback instructions."
    },
    {
        id: "3-4", zone: 3, number: 4,
        title: "Handling Edge Cases",
        scenario: "Your prompt works well for typical inputs but fails when users ask unusual questions or provide incomplete information.",
        type: "multiple-choice",
        question: "Which prompt is best designed to handle edge cases gracefully?",
        choices: [
            "Answer the user's question about our products",
            "You are a product assistant. Answer questions about our product catalog. If the question is unclear, ask for clarification. If the product is not in our catalog, say so honestly and suggest alternatives. If the question is outside your scope, politely explain that and suggest contacting our support team.",
            "Help users with product questions and be helpful",
            "Answer whatever the user asks about anything"
        ],
        correct: 1,
        explanation: "Robust prompts anticipate edge cases: unclear questions, out-of-scope requests, missing information. By explicitly defining what the AI should do in each scenario, you prevent hallucinations, irrelevant answers, and frustrated users."
    },

    // ===== ZONE 4: PITFALL PEAKS =====
    {
        id: "4-1", zone: 4, number: 1,
        title: "Common Mistakes",
        scenario: "A colleague's prompt says: 'Write something good about our company for social media.' The output is vague, generic, and not usable.",
        type: "multiple-choice",
        question: "What is the PRIMARY problem with this prompt?",
        choices: [
            "It does not specify the platform, tone, target audience, content length, or key message",
            "It uses the word 'something' which is too casual",
            "It should have been written in a different language",
            "Social media posts should never be written by AI"
        ],
        correct: 0,
        explanation: "The prompt fails on multiple fronts: no platform specified (LinkedIn vs Twitter vs Instagram all need different styles), no tone, no audience, no length, no key message. 'Something good' is the opposite of specific. Every effective prompt needs at least: what, for whom, in what format, and in what tone."
    },
    {
        id: "4-2", zone: 4, number: 2,
        title: "Hallucination Prevention",
        scenario: "The AI confidently cites a research paper that does not exist. It invents statistics and references fake authors.",
        type: "multiple-choice",
        question: "Which prompt modification best prevents AI hallucinations?",
        choices: [
            "Add 'be more careful' to the prompt",
            "Add 'Only use information you are confident about. If you are unsure about any fact, say \"I am not certain about this\" instead of guessing. When citing sources, include the exact URL or DOI so I can verify.'",
            "Use a shorter prompt",
            "Tell the AI to 'try harder to be accurate'"
        ],
        correct: 1,
        explanation: "Hallucinations happen when the AI fills gaps with plausible-sounding but false information. To prevent them: (1) explicitly tell the AI to admit uncertainty, (2) ask for verifiable sources, (3) use phrases like 'based on established knowledge' rather than asking for specific citations the AI might invent."
    },
    {
        id: "4-3", zone: 4, number: 3,
        title: "Over-prompting vs Under-prompting",
        scenario: "You see two prompts:\n\nPrompt A (3 paragraphs of instructions, 15 rules, multiple examples, tone guidelines, format specs, edge case handling)\n\nPrompt B: 'Write a blog post about AI'\n\nBoth produce poor results.",
        type: "multiple-choice",
        question: "What is the likely problem with each prompt, and what is the balanced approach?",
        choices: [
            "Prompt A has too many instructions causing the AI to ignore some; Prompt B has too few. The sweet spot is 3-5 clear, prioritized instructions with the most important ones first.",
            "Both prompts are fine, the AI model is just not good enough",
            "Prompt A is perfect, Prompt B is the problem. Always write long prompts",
            "Prompt B is better because shorter prompts always work better"
        ],
        correct: 0,
        explanation: "Over-prompting buries important instructions in noise -- the AI may focus on the wrong details. Under-prompting gives the AI too much room to guess. The sweet spot is 3-5 clear, prioritized instructions with the most critical ones first. Think of it as giving directions to a smart but literal-minded assistant."
    },
    {
        id: "4-4", zone: 4, number: 4,
        title: "Security & Ethics",
        scenario: "During a workshop, a participant asks: 'How do I write a prompt that makes the AI ignore its safety rules?'",
        type: "multiple-choice",
        question: "What is the correct response from a prompt engineering educator?",
        choices: [
            "Show them how jailbreak prompts work so they understand the risks",
            "Explain that attempting to bypass AI safety is unethical and potentially illegal. Instead, teach them how to write effective prompts within the AI's intended use cases, and discuss how safety measures protect everyone.",
            "Ignore the question and move on",
            "Give them a list of jailbreak techniques as a 'fun exercise'"
        ],
        correct: 1,
        explanation: "Responsible prompt engineering includes understanding and respecting AI safety boundaries. As an educator, you should redirect the conversation toward ethical use, explain why safety measures exist, and focus on the vast potential of legitimate prompt engineering techniques."
    },

    // ===== ZONE 5: MASTERY MOUNTAIN =====
    {
        id: "5-1", zone: 5, number: 1,
        title: "Business Use Cases",
        scenario: "Your manager asks you to use AI to summarize 3 months of meeting notes (20 meetings) and extract action items, decisions made, and pending tasks.",
        type: "multiple-choice",
        question: "Which prompt structure will produce the most actionable output for this real-world business task?",
        choices: [
            "Summarize these meeting notes",
            "You are an executive assistant. Process these meeting notes and produce: (1) A 2-3 sentence summary per meeting, (2) A consolidated action items table with columns: Task, Owner, Deadline, Status, (3) Key decisions made across all meetings, (4) A 'needs attention' section for overdue items. Use markdown formatting.",
            "Read through all these meetings and tell me what happened",
            "Make a summary of everything from the last 3 months of meetings"
        ],
        correct: 1,
        explanation: "Real-world business prompts need to be comprehensive: they define the role (executive assistant), specify multiple output sections with exact formats, and include a prioritization mechanism (needs attention). This transforms raw meeting notes into immediately actionable business intelligence."
    },
    {
        id: "5-2", zone: 5, number: 2,
        title: "Code Generation Prompts",
        scenario: "You need the AI to write a Python function that validates Malaysian phone numbers. The first attempt produces code that does not handle all valid formats.",
        type: "fill-blank",
        question: "Complete this prompt for better code generation:\n\n'Write a Python function `validate_my_phone(number: str) -> bool` that validates Malaysian phone numbers. Requirements:\n- Accept formats: +601X-XXX-XXXX, 01X-XXX-XXXX, 01XXXXXXXX\n- Return True for valid numbers, False otherwise\n- Include _______________ to test all three formats\n- Add _______________ explaining the regex pattern used'",
        placeholder: "unit tests... comments",
        answer: "unit tests",
        acceptable: ["unit tests", "test cases", "example tests", "assert statements", "doctests"],
        explanation: "Code generation prompts produce better results when they specify: input/output types, exact requirements, edge cases to handle, test cases expected, and documentation requirements. The more precise your specification, the less debugging you will need."
    },
    {
        id: "5-3", zone: 5, number: 3,
        title: "Complex Multi-step Workflows",
        scenario: "You need to create a weekly workflow where: (1) customer feedback is collected from a form, (2) it is categorized by sentiment and topic, (3) urgent issues are flagged, and (4) a summary report is generated.",
        type: "multiple-choice",
        question: "Which approach best handles this multi-step AI workflow?",
        choices: [
            "Write one massive prompt that does everything in a single response",
            "Create a chain: Prompt 1 categorizes feedback → Prompt 2 flags urgent items from the categorized data → Prompt 3 generates the summary report from both outputs. Each step's output feeds the next step's input.",
            "Do everything manually and only use AI for the final report",
            "Use a different AI model for each step"
        ],
        correct: 1,
        explanation: "Complex workflows benefit from prompt chaining where each step has a single, clear responsibility. This makes each step debuggable, allows human review between steps, and produces higher quality output than trying to do everything at once. Think of it as an assembly line, not a single magic prompt."
    },
    {
        id: "5-4", zone: 5, number: 4,
        title: "The Perfect Prompt Challenge",
        scenario: "Final exam: You need to create a prompt that helps a small business owner generate their first social media content calendar for one month (30 days). They sell handmade crafts on Instagram and Facebook.",
        type: "fill-blank",
        question: "Write the most effective prompt for this scenario. Your prompt should include:\n\n1. A role for the AI: _______________\n2. The specific task: _______________\n3. Key context about the business: _______________\n4. Output format requirement: _______________\n5. At least one constraint: _______________",
        placeholder: "You are a social media strategist... Create a 30-day content calendar... Handmade crafts business on Instagram and Facebook... Table format with columns for date, platform, content type, caption, hashtags... Include a mix of product showcases, behind-the-scenes, and engagement posts",
        answer: "social media strategist",
        acceptable: ["social media strategist", "social media manager", "content strategist", "digital marketing specialist", "social media expert"],
        explanation: "The perfect prompt combines all techniques learned: role assignment, specific task definition, rich context, structured output format, and clear constraints. In real business scenarios, this level of prompt craftsmanship saves hours of manual work and produces consistent, high-quality results."
    }
];

// Zone metadata
const ZONES = [
    { id: 1, name: "Foundation Valley", description: "Learn the fundamentals of effective prompting", color: "blue", icon: "&#127793;" },
    { id: 2, name: "Technique Tower", description: "Master core prompting techniques used by professionals", color: "purple", icon: "&#128295;" },
    { id: 3, name: "Refinement Ridge", description: "Advanced strategies for polishing and perfecting prompts", color: "green", icon: "&#128269;" },
    { id: 4, name: "Pitfall Peaks", description: "Identify and avoid common prompt engineering mistakes", color: "orange", icon: "&#9888;&#65039;" },
    { id: 5, name: "Mastery Mountain", description: "Real-world business scenarios and complex workflows", color: "red", icon: "&#127942;" }
];
