# Cover Letter Generator PRO - Architecture Design

## Overview
The Cover Letter Generator PRO is a Next.js application that provides an AI-powered tool for creating targeted cover letters. The application follows a mobile-first responsive design approach with a dark mode UI.

## Technology Stack
- **Frontend Framework**: Next.js
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI API
- **Deployment**: Next.js deployment with Cloudflare Workers

## Component Structure

### Page Components
- **Main Page** (`src/app/page.tsx`): The main container for the application
  - Handles overall layout and state management
  - Manages responsive design behavior

### UI Components
- **Header** (`src/components/Header.tsx`): Contains the title and branding
- **InputForm** (`src/components/InputForm.tsx`): Left side of the interface
  - JobDescriptionInput
  - ToneSelector
  - KeyStrengthInput
  - GenerateButton
- **LetterPreview** (`src/components/LetterPreview.tsx`): Right side of the interface
  - PreviewHeader
  - LetterContent (editable)
  - RefinementSuggestions
- **KeywordMatch** (`src/components/KeywordMatch.tsx`): Keyword visualization
  - KeywordTags
  - MatchingIndicator
- **ImpactScore** (`src/components/ImpactScore.tsx`): Circular progress indicator
- **RefinementButtons** (`src/components/RefinementButtons.tsx`): Smart refinement options
- **ProTip** (`src/components/ProTip.tsx`): Interview Guys Pro Tip section
- **Footer** (`src/components/Footer.tsx`): Contains "Powered by The IG Network" branding

### Utility Components
- **CircularProgress** (`src/components/ui/CircularProgress.tsx`): Reusable circular progress indicator
- **Tag** (`src/components/ui/Tag.tsx`): Reusable tag component for keywords
- **Button** (`src/components/ui/Button.tsx`): Reusable button component
- **TextArea** (`src/components/ui/TextArea.tsx`): Reusable text area component
- **Dropdown** (`src/components/ui/Dropdown.tsx`): Reusable dropdown component

## Data Flow
1. User inputs job description, selects tone, and optionally adds key strength
2. On "Generate" button click, data is sent to the API endpoint
3. API endpoint processes the data and sends a request to OpenAI API
4. OpenAI API returns generated cover letter content
5. Application processes the response:
   - Displays the generated letter
   - Extracts and displays matching keywords
   - Calculates and displays impact score
   - Provides refinement suggestions

## State Management
- React's useState and useContext hooks for local and global state management
- Key state objects:
  - formData: Contains user inputs (job description, tone, key strength)
  - letterContent: The generated cover letter
  - keywords: Extracted keywords from job description and letter
  - impactScore: Calculated score based on keyword matching and content quality
  - refinementSuggestions: Generated suggestions for improving the letter

## API Endpoints
- `/api/generate`: Processes user inputs and generates cover letter
  - Accepts: Job description, tone, key strength
  - Returns: Generated letter, keywords, impact score, refinement suggestions
- `/api/refine`: Refines the letter based on selected refinement option
  - Accepts: Current letter content, refinement type
  - Returns: Updated letter content

## OpenAI Integration
- Uses OpenAI API to generate cover letter content
- Prompt engineering to ensure high-quality, relevant content
- Keyword extraction from job description
- Content analysis for impact scoring

## Responsive Design
- Mobile-first approach
- Breakpoints for different screen sizes:
  - Mobile: Default layout (stacked)
  - Tablet: Side-by-side layout with adjusted proportions
  - Desktop: Side-by-side layout with optimal reading width

## UI/UX Considerations
- Dark mode design with navy, teal, white, and soft blue accents
- Inter font throughout the application
- Interactive elements with hover and focus states
- Smooth transitions and animations
- Accessible design with proper contrast and focus indicators

## Deployment Strategy
- Next.js application deployed with Cloudflare Workers
- No token-based access protection (handled by client's membership system)
- Sharable URL provided for embedding in client's members-only page
