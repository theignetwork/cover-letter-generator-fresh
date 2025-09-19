'use client';

import { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Header from '@/components/Header';
import InputForm from '@/components/InputForm';
import LetterPreview from '@/components/LetterPreview';

interface GenerationMetadata {
  wordCount: number;
  characterCount: number;
  generatedAt: string;
  tone: string;
  keywordsFound: number;
}

interface GenerationState {
  jobDescription: string;
  tone: string;
  keyStrength: string;
  letterContent: string;
  keywords: string[];
  impactScore: number;
  refinementSuggestion: string;
  metadata?: GenerationMetadata;
}

export default function Home() {
  // Core state
  const [state, setState] = useState<GenerationState>({
    jobDescription: '',
    tone: 'Professional & Formal',
    keyStrength: '',
    letterContent: '',
    keywords: [],
    impactScore: 0,
    refinementSuggestion: '',
  });

  // Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generation history (for potential undo functionality)
  const [generationHistory, setGenerationHistory] = useState<GenerationState[]>([]);

  // Auto-save to localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('coverLetterApp_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState(prevState => ({ ...prevState, ...parsed }));
      } catch (err) {
        console.warn('Failed to load saved state:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (state.jobDescription || state.letterContent) {
      localStorage.setItem('coverLetterApp_state', JSON.stringify({
        jobDescription: state.jobDescription,
        tone: state.tone,
        keyStrength: state.keyStrength,
        letterContent: state.letterContent,
      }));
    }
  }, [state.jobDescription, state.tone, state.keyStrength, state.letterContent]);

  // Optimized state setters
  const updateJobDescription = useCallback((value: string) => {
    setState(prev => ({ ...prev, jobDescription: value }));
    setError(null);
  }, []);

  const updateTone = useCallback((value: string) => {
    setState(prev => ({ ...prev, tone: value }));
  }, []);

  const updateKeyStrength = useCallback((value: string) => {
    setState(prev => ({ ...prev, keyStrength: value }));
  }, []);

  const updateLetterContent = useCallback((value: string) => {
    setState(prev => ({ ...prev, letterContent: value }));
  }, []);

  // Enhanced generation handler with comprehensive error handling
  const handleGenerate = useCallback(async () => {
    if (!state.jobDescription.trim()) {
      toast.error('Please provide a job description before generating your cover letter.');
      return;
    }

    if (state.jobDescription.trim().length < 10) {
      toast.error('Job description is too short. Please provide more details.');
      return;
    }

    // Save current state to history
    setGenerationHistory(prev => [...prev.slice(-4), state]); // Keep last 5 states

    setIsGenerating(true);
    setError(null);

    const startTime = Date.now();
    const loadingToast = toast.loading('Generating your personalized cover letter...', {
      duration: 30000,
    });

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription: state.jobDescription,
          tone: state.tone,
          keyStrength: state.keyStrength
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      // Update state with new generation
      setState(prev => ({
        ...prev,
        letterContent: data.letterContent,
        keywords: data.keywords || [],
        impactScore: data.impactScore || 0,
        refinementSuggestion: data.refinementSuggestion || '',
        metadata: data.metadata
      }));

      const duration = Date.now() - startTime;
      toast.success(`Cover letter generated successfully in ${(duration / 1000).toFixed(1)}s!`, {
        duration: 3000,
        id: loadingToast,
      });

      // Analytics tracking (optional)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'cover_letter_generated', {
          tone: state.tone,
          has_key_strength: !!state.keyStrength,
          job_description_length: state.jobDescription.length,
          generation_time_ms: duration
        });
      }

    } catch (error: any) {
      console.error('Error generating cover letter:', error);

      let errorMessage = 'Failed to generate cover letter. Please try again.';

      if (error.message.includes('quota')) {
        errorMessage = 'API quota exceeded. Please try again later.';
      } else if (error.message.includes('api_key')) {
        errorMessage = 'API configuration error. Please contact support.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }

      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 5000,
        id: loadingToast,
      });

    } finally {
      setIsGenerating(false);
    }
  }, [state]);

  // Enhanced refinement handler
  const handleRefinement = useCallback(async (type: string) => {
    if (!state.letterContent) {
      toast.error('No cover letter to refine. Please generate one first.');
      return;
    }

    setIsRefining(true);
    const loadingToast = toast.loading('Refining your cover letter...', {
      duration: 15000,
    });

    try {
      // Save current state before refinement
      setGenerationHistory(prev => [...prev.slice(-4), state]);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription: state.jobDescription,
          tone: state.tone,
          keyStrength: state.keyStrength,
          refinementType: type,
          existingLetter: state.letterContent
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to refine cover letter');
      }

      setState(prev => ({
        ...prev,
        letterContent: data.letterContent,
        keywords: data.keywords || prev.keywords,
        impactScore: data.impactScore || prev.impactScore,
        refinementSuggestion: data.refinementSuggestion || prev.refinementSuggestion,
        metadata: data.metadata || prev.metadata
      }));

      toast.success('Cover letter refined successfully!', {
        duration: 2000,
        id: loadingToast,
      });

      // Analytics tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'cover_letter_refined', {
          refinement_type: type
        });
      }

    } catch (error: any) {
      console.error('Error refining cover letter:', error);
      toast.error(error.message || 'Failed to refine cover letter. Please try again.', {
        duration: 4000,
        id: loadingToast,
      });
    } finally {
      setIsRefining(false);
    }
  }, [state]);

  // Clear all data
  const handleClearAll = useCallback(() => {
    setState({
      jobDescription: '',
      tone: 'Professional & Formal',
      keyStrength: '',
      letterContent: '',
      keywords: [],
      impactScore: 0,
      refinementSuggestion: '',
    });
    setGenerationHistory([]);
    localStorage.removeItem('coverLetterApp_state');
    toast.success('All data cleared successfully!');
  }, []);

  return (
    <>
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          duration: 4000,
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: '500',
          },
          // Default options for specific types
          success: {
            iconTheme: {
              primary: 'hsl(var(--accent))',
              secondary: 'hsl(var(--accent-foreground))',
            },
          },
          error: {
            duration: 6000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
          loading: {
            iconTheme: {
              primary: 'hsl(var(--secondary))',
              secondary: 'hsl(var(--secondary-foreground))',
            },
          },
        }}
      />

      {/* Main Application */}
      <div className="min-h-screen bg-background max-h-screen overflow-hidden">
        <div className="container mx-auto px-3 py-4 h-screen flex flex-col">
          <Header />

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-700 px-3 py-2 rounded-md flex items-center space-x-2 mb-3">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          {/* Main Grid Layout - Compact & Responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 flex-1 min-h-0">
            {/* Left Column - Input Form */}
            <div className="flex flex-col space-y-3 overflow-y-auto">
              <InputForm
                jobDescription={state.jobDescription}
                setJobDescription={updateJobDescription}
                tone={state.tone}
                setTone={updateTone}
                keyStrength={state.keyStrength}
                setKeyStrength={updateKeyStrength}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />

              {/* Additional Actions */}
              {(state.jobDescription || state.letterContent) && (
                <div className="flex items-center justify-between pt-1 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    {state.letterContent && (
                      <span>Last generated: {state.metadata?.generatedAt ? new Date(state.metadata.generatedAt).toLocaleTimeString() : 'Recently'}</span>
                    )}
                  </div>
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center space-x-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Clear All</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Column - Letter Preview */}
            <div className="flex flex-col min-h-0">
              <LetterPreview
                letterContent={state.letterContent}
                setLetterContent={updateLetterContent}
                keywords={state.keywords}
                impactScore={state.impactScore}
                refinementSuggestion={state.refinementSuggestion}
                onRefinement={handleRefinement}
                isGenerating={isGenerating || isRefining}
                metadata={state.metadata}
              />
            </div>
          </div>

          {/* Generation History (Optional) */}
          {generationHistory.length > 0 && state.letterContent && (
            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Recent Versions</h3>
                <span className="text-xs text-muted-foreground">{generationHistory.length} version{generationHistory.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {generationHistory.slice(-3).map((historyState, index) => (
                  <button
                    key={index}
                    onClick={() => setState(historyState)}
                    className="text-left p-3 bg-card border border-border rounded-md hover:bg-accent/10 transition-colors duration-200"
                  >
                    <div className="text-xs text-muted-foreground mb-1">
                      Version {generationHistory.length - index}
                    </div>
                    <div className="text-sm font-medium truncate">
                      {historyState.tone}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {historyState.letterContent ? `${historyState.letterContent.split(' ').length} words` : 'No content'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
