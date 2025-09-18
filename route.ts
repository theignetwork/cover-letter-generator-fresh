import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { jobDescription, tone, keyStrength } = await request.json();
    
    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    console.log('Generating cover letter with OpenAI API...');
    console.log('Job Description:', jobDescription.substring(0, 50) + '...');
    console.log('Tone:', tone);
    console.log('Key Strength:', keyStrength ? keyStrength.substring(0, 50) + '...' : 'None provided');

    // Extract keywords from job description
    const keywords = extractKeywords(jobDescription);
    
    // Create prompt for OpenAI
    const prompt = createPrompt(jobDescription, tone, keyStrength, keywords);
    
    // Call OpenAI API to generate cover letter
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert cover letter writer who creates personalized, professional cover letters."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const letterContent = completion.choices[0].message.content || '';
    console.log('Letter generated successfully. Length:', letterContent.length);
    
    // Calculate impact score based on keyword matching and content quality
    const impactScore = calculateImpactScore(letterContent, keywords);
    
    // Generate refinement suggestions
    const refinementSuggestion = 'Consider making the opening sentence more engaging';
    
    return NextResponse.json({
      letterContent,
      keywords,
      impactScore,
      refinementSuggestion
    });
    
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to create the prompt for OpenAI
function createPrompt(jobDescription: string, tone: string, keyStrength: string, keywords: string[]): string {
  let prompt = `Write a cover letter applying for the following job description:\n\n${jobDescription}\n\n`;
  
  prompt += `Use the following tone: ${tone}.\n\n`;
  
  if (keywords.length > 0) {
    prompt += `Incorporate these key skills and qualifications extracted from the job description: ${keywords.join(', ')}.\n\n`;
  }
  
  if (keyStrength) {
    prompt += `Highlight this achievement or strength meaningfully: ${keyStrength}.\n\n`;
  }
  
  prompt += `Focus on clear, confident, and engaging language. Use active voice. The letter should be no longer than 400 words and sound authentic, not robotic. Include a strong opener, a relevant middle paragraph aligning skills to the job description, and a confident, human closing.`;
  
  return prompt;
}

// Helper function to extract keywords from job description
function extractKeywords(jobDescription: string): string[] {
  // Common job-related keywords to look for
  const commonKeywords = [
    'marketing', 'communication', 'leadership', 'team', 'strategy', 
    'development', 'management', 'analysis', 'research', 'design',
    'sales', 'customer', 'project', 'technical', 'software',
    'data', 'experience', 'skills', 'knowledge', 'ability'
  ];
  
  const jobDescLower = jobDescription.toLowerCase();
  return commonKeywords.filter(keyword => jobDescLower.includes(keyword));
}

// Helper function to calculate impact score
function calculateImpactScore(letterContent: string, keywords: string[]): number {
  // In a real implementation, this would use more sophisticated metrics
  // For now, we'll use a simple formula based on keyword presence and letter length
  const letterLength = letterContent.length;
  const keywordCount = keywords.length;
  
  // Base score between 70-90
  let score = 70 + Math.min(keywordCount * 5, 20);
  
  // Adjust based on letter length (penalize if too short or too long)
  if (letterLength < 200) {
    score -= 10;
  } else if (letterLength > 500) {
    score -= 5;
  }
  
  return Math.min(Math.max(score, 0), 100);
}
