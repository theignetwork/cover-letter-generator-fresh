# Cover Letter Generator PRO - Complete Requirements

## Core Features Required
- AI-powered cover letter generation using Anthropic Claude API
- Dark theme UI with navy, teal, white, soft blue colors
- Inter font throughout
- Mobile-first responsive design
- NO character limits anywhere - unlimited input/output

## User Interface Requirements

### Input Section (Left Side)
1. **Job Description Input**
   - Large textarea, auto-expanding
   - Placeholder: "Paste the job listing or key responsibilities"
   - NO character limits

2. **Tone Selection Dropdown**
   - Professional & Formal
   - Friendly & Conversational
   - Bold & Assertive
   - Problem-Solution Focused
   - Direct to Hiring Manager
   - Include tooltips explaining each tone

3. **Key Strength Input (Optional)**
   - Textarea for achievements/strengths
   - Placeholder: "Describe one achievement, strength, or quality you'd like us to highlight"
   - NO character limits

4. **Generate Button**
   - Prominent teal button
   - Loading state with spinner
   - Disabled until job description is filled

### Output Section (Right Side)
1. **Letter Preview**
   - Editable text area after generation
   - Edit button to toggle editing mode

2. **Keyword Match Visualization**
   - Extract 5-10 keywords from job description
   - Green tags for keywords included in letter
   - Yellow tags for missing keywords
   - Progress bar showing match percentage

3. **Impact Score Meter**
   - Circular progress indicator
   - Score out of 100
   - Based on keyword matching and content quality

4. **Smart Refinement Buttons**
   - Strengthen Opener
   - Add Achievement Focus
   - Make More Detailed
   - Shorten Letter

5. **Interview Guys Pro Tip**
   - Rotating tips in highlighted box
   - Lightbulb icon

## Technical Requirements
- Next.js 14 with TypeScript
- Tailwind CSS for styling
- Anthropic Claude API integration
- Model: claude-3-5-sonnet-20241022
- Environment variable: ANTHROPIC_API_KEY
- Auto-expanding textareas
- Copy-to-clipboard functionality
- Mobile responsive design

## API Integration Requirements
- Use @anthropic-ai/sdk package
- Max tokens: 4000+ for longer responses
- Temperature: 0.7
- Proper error handling
- Loading states

## Branding
- "Powered by The IG Network" in footer
- Dark theme consistent throughout
- Professional, premium feel

## Deployment
- Must build successfully on Netlify
- No build errors or warnings
- Proper environment variable handling
