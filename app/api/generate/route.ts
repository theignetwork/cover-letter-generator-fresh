import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { jobDescription, tone, keyStrength } = await request.json();

    // Enhanced validation
    if (!jobDescription || typeof jobDescription !== 'string') {
      return NextResponse.json(
        { error: 'Valid job description is required' },
        { status: 400 }
      );
    }

    if (jobDescription.trim().length < 10) {
      return NextResponse.json(
        { error: 'Job description must be at least 10 characters long' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Initialize OpenAI client with the API key from environment variables
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log('Generating cover letter with OpenAI API...');
    console.log('Job Description length:', jobDescription.length);
    console.log('Tone:', tone);
    console.log('Key Strength provided:', !!keyStrength);

    // Extract keywords from job description
    const keywords = extractKeywords(jobDescription);

    // Create enhanced prompt for OpenAI
    const prompt = createEnhancedPrompt(jobDescription, tone, keyStrength, keywords);

    // Call OpenAI API to generate cover letter with increased token limit
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an elite professional cover letter writer with extensive experience in HR and recruitment. You create compelling, personalized cover letters that stand out to hiring managers and significantly increase interview rates. Your writing is sophisticated yet authentic, strategic yet human."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000, // Increased for much longer responses
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1,
    });

    const letterContent = completion.choices[0].message.content || '';
    console.log('Letter generated successfully. Length:', letterContent.length);

    if (!letterContent.trim()) {
      throw new Error('Generated letter content is empty');
    }

    // Calculate enhanced impact score
    const impactScore = calculateEnhancedImpactScore(letterContent, keywords, jobDescription);

    // Generate intelligent refinement suggestions
    const refinementSuggestion = generateRefinementSuggestion(letterContent, keywords, impactScore);

    return NextResponse.json({
      letterContent,
      keywords,
      impactScore,
      refinementSuggestion,
      metadata: {
        wordCount: letterContent.split(/\s+/).length,
        characterCount: letterContent.length,
        generatedAt: new Date().toISOString(),
        tone,
        keywordsFound: keywords.length
      }
    });

  } catch (error: any) {
    console.error('Error generating cover letter:', error);

    // Enhanced error handling with specific error types
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'OpenAI API quota exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key configuration.' },
        { status: 401 }
      );
    }

    if (error.code === 'model_not_found') {
      return NextResponse.json(
        { error: 'Requested AI model is not available.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to generate cover letter',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Enhanced helper function to create sophisticated prompts for OpenAI
function createEnhancedPrompt(jobDescription: string, tone: string, keyStrength: string, keywords: string[]): string {
  let prompt = `Create a highly compelling and personalized cover letter for the following job description. This letter should be comprehensive, sophisticated, and significantly longer than typical cover letters to showcase deep understanding and enthusiasm.\n\n`;

  prompt += `JOB DESCRIPTION:\n${jobDescription}\n\n`;

  prompt += `WRITING INSTRUCTIONS:\n`;
  prompt += `• Tone: ${tone}\n`;
  prompt += `• Length: Write a comprehensive letter (800-1200 words) that thoroughly addresses the role\n`;
  prompt += `• Structure: Strong opening hook, detailed body paragraphs with specific examples, compelling closing\n`;
  prompt += `• Style: Professional yet engaging, confident but not arrogant, authentic and human\n\n`;

  if (keywords.length > 0) {
    prompt += `KEY SKILLS TO INTEGRATE NATURALLY:\n${keywords.join(', ')}\n\n`;
  }

  if (keyStrength && keyStrength.trim()) {
    prompt += `HIGHLIGHT THIS ACHIEVEMENT/STRENGTH:\n${keyStrength}\n\n`;
  }

  prompt += `REQUIREMENTS:\n`;
  prompt += `• Open with a compelling hook that immediately shows understanding of the company/role\n`;
  prompt += `• Include 2-3 detailed paragraphs with specific examples and quantifiable achievements\n`;
  prompt += `• Address the company's needs and pain points directly\n`;
  prompt += `• Show genuine enthusiasm and cultural fit\n`;
  prompt += `• Include a strong call-to-action in the closing\n`;
  prompt += `• Use active voice and varied sentence structure\n`;
  prompt += `• Avoid generic phrases and clichés\n`;
  prompt += `• Make it sound authentic and personally written, not AI-generated\n`;
  prompt += `• End with a professional but warm closing\n\n`;

  prompt += `Write the complete cover letter now:`;

  return prompt;
}

// Enhanced helper function to extract keywords from job description
function extractKeywords(jobDescription: string): string[] {
  // Comprehensive keyword categories
  const keywordCategories = {
    technical: [
      'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node.js', 'typescript',
      'html', 'css', 'sql', 'mongodb', 'postgresql', 'aws', 'azure', 'docker', 'kubernetes',
      'git', 'api', 'rest', 'graphql', 'microservices', 'devops', 'ci/cd', 'agile', 'scrum'
    ],
    business: [
      'marketing', 'sales', 'business development', 'strategy', 'analytics', 'roi',
      'revenue', 'growth', 'customer acquisition', 'retention', 'conversion', 'crm',
      'b2b', 'b2c', 'saas', 'digital marketing', 'seo', 'sem', 'social media'
    ],
    soft: [
      'leadership', 'communication', 'collaboration', 'teamwork', 'problem solving',
      'critical thinking', 'creativity', 'adaptability', 'time management', 'organization',
      'presentation', 'negotiation', 'mentoring', 'coaching', 'cross-functional'
    ],
    general: [
      'management', 'development', 'analysis', 'research', 'design', 'implementation',
      'optimization', 'innovation', 'quality', 'efficiency', 'productivity', 'project',
      'customer', 'client', 'stakeholder', 'experience', 'skills', 'knowledge', 'expertise'
    ]
  };

  const allKeywords = [
    ...keywordCategories.technical,
    ...keywordCategories.business,
    ...keywordCategories.soft,
    ...keywordCategories.general
  ];

  const jobDescLower = jobDescription.toLowerCase();
  const foundKeywords = allKeywords.filter(keyword =>
    jobDescLower.includes(keyword.toLowerCase())
  );

  // Also extract words that appear frequently and look important
  const words = jobDescLower.match(/\b[a-z]{4,}\b/g) || [];
  const wordFreq: { [key: string]: number } = {};

  words.forEach(word => {
    if (!['this', 'that', 'with', 'from', 'they', 'have', 'will', 'been', 'were', 'their', 'what', 'your', 'when', 'where', 'more', 'some', 'like', 'into', 'time', 'very', 'only', 'know', 'just', 'first', 'also', 'after', 'back', 'other', 'many', 'than', 'then', 'them', 'these', 'most', 'over', 'such', 'about', 'would', 'there', 'could', 'should'].includes(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  const frequentWords = Object.entries(wordFreq)
    .filter(([_, count]) => count >= 2)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 10)
    .map(([word, _]) => word);

  return [...new Set([...foundKeywords, ...frequentWords])].slice(0, 15);
}

// Enhanced helper function to calculate comprehensive impact score (60-95% range)
function calculateEnhancedImpactScore(letterContent: string, keywords: string[], jobDescription: string): number {
  let score = 60; // Base score starts at 60%

  // Keyword integration (0-20 points) - More selective scoring
  const contentLower = letterContent.toLowerCase();
  const keywordsFound = keywords.filter(keyword =>
    contentLower.includes(keyword.toLowerCase())
  ).length;

  if (keywords.length > 0) {
    const keywordRatio = keywordsFound / keywords.length;
    if (keywordRatio >= 0.8) score += 20; // 80%+ of keywords
    else if (keywordRatio >= 0.6) score += 15; // 60-79% of keywords
    else if (keywordRatio >= 0.4) score += 10; // 40-59% of keywords
    else if (keywordRatio >= 0.2) score += 5; // 20-39% of keywords
    // Below 20% gets no points
  }

  // Length and comprehensiveness (0-15 points) - More realistic
  const wordCount = letterContent.split(/\s+/).length;
  let lengthScore = 0;
  if (wordCount >= 300 && wordCount <= 600) {
    lengthScore = 15; // Optimal length
  } else if (wordCount >= 200 && wordCount < 300) {
    lengthScore = 12; // Good length
  } else if (wordCount >= 150 && wordCount < 200) {
    lengthScore = 8; // Acceptable but short
  } else if (wordCount > 600 && wordCount <= 800) {
    lengthScore = 10; // A bit long but ok
  } else if (wordCount > 800) {
    lengthScore = 5; // Too long
  }
  score += lengthScore;

  // Structure and professionalism (0-15 points)
  const hasOpening = /dear|hello|greetings/i.test(letterContent);
  const hasClosing = /sincerely|regards|best|thank you/i.test(letterContent);
  const hasParagraphs = letterContent.split('\n\n').length >= 3;
  const hasSpecificExamples = /\$|\%|[0-9]+\s*(years?|months?|projects?|clients?|customers?|percent)/i.test(letterContent);
  const hasActionVerbs = /led|managed|developed|created|implemented|increased|reduced|improved|achieved|delivered/i.test(letterContent);

  let structureScore = 0;
  if (hasOpening) structureScore += 3;
  if (hasClosing) structureScore += 3;
  if (hasParagraphs) structureScore += 3;
  if (hasSpecificExamples) structureScore += 4;
  if (hasActionVerbs) structureScore += 2;
  score += structureScore;

  // Add some randomness to make scores more realistic (±3 points)
  const randomFactor = Math.floor(Math.random() * 7) - 3; // -3 to +3
  score += randomFactor;

  // Ensure score stays within 60-95% range
  return Math.min(Math.max(Math.round(score), 60), 95);
}

// Helper function to generate intelligent refinement suggestions
function generateRefinementSuggestion(letterContent: string, keywords: string[], impactScore: number): string {
  const suggestions = [];

  // Analyze content for specific improvements
  const wordCount = letterContent.split(/\s+/).length;
  const hasNumbers = /\$|\%|[0-9]+\s*(years?|months?|projects?|clients?|customers?|percent)/i.test(letterContent);
  const hasAction = /led|managed|developed|created|implemented|increased|reduced|improved/i.test(letterContent);

  if (impactScore < 70) {
    suggestions.push("Consider adding more specific achievements with quantifiable results");
  }

  if (wordCount < 200) {
    suggestions.push("Expand your letter with more detailed examples and explanations");
  }

  if (!hasNumbers) {
    suggestions.push("Include specific metrics or numbers to strengthen your achievements");
  }

  if (!hasAction) {
    suggestions.push("Use more action verbs to make your accomplishments stand out");
  }

  if (keywords.length > 0) {
    const contentLower = letterContent.toLowerCase();
    const missingKeywords = keywords.filter(keyword =>
      !contentLower.includes(keyword.toLowerCase())
    );

    if (missingKeywords.length > keywords.length * 0.5) {
      suggestions.push(`Try incorporating more key terms from the job description: ${missingKeywords.slice(0, 3).join(', ')}`);
    }
  }

  if (suggestions.length === 0) {
    suggestions.push("Your cover letter looks strong! Consider personalizing it further for the specific company.");
  }

  return suggestions[Math.floor(Math.random() * suggestions.length)];
}
