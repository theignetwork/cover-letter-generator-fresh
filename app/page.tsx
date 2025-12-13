'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { FiX, FiZap } from 'react-icons/fi';
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

function HomeContent() {
  const searchParams = useSearchParams();

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

  // Smart Context state
  const [smartContextLoaded, setSmartContextLoaded] = useState(false);
  const [contextData, setContextData] = useState<any>(null);

  // Authentication state
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  // Helper to build job description from context data
  const buildJobDescription = (data: any): string => {
    let desc = '';

    if (data.companyName || data.positionTitle) {
      desc += `Company: ${data.companyName || 'Not specified'}\n`;
      desc += `Position: ${data.positionTitle || 'Not specified'}\n\n`;
    }

    if (data.location) desc += `Location: ${data.location}\n`;
    if (data.remoteType) desc += `Work Type: ${data.remoteType}\n`;
    if (data.salaryRange) desc += `Salary: ${data.salaryRange}\n`;
    if (data.location || data.remoteType || data.salaryRange) desc += '\n';

    if (data.jobDescription) {
      desc += `Job Description:\n${data.jobDescription}`;
    } else {
      desc += 'Job Description:\n(Details auto-loaded from IG Career Hub)';
    }

    return desc;
  };

  // Detect and verify smart context from URL
  useEffect(() => {
    const loadContext = async () => {
      console.log('[Smart Context] Checking for context parameter...');
      console.log('[Smart Context] Available window JWT variables:', {
        __IG_COVER_LETTER_JWT__: !!(window as any).__IG_COVER_LETTER_JWT__,
        __IG_NETWORK_JWT__: !!(window as any).__IG_NETWORK_JWT__,
        __IG_CAREER_COACH_JWT__: !!(window as any).__IG_CAREER_COACH_JWT__,
        __IG_CAREER_HUB_JWT__: !!(window as any).__IG_CAREER_HUB_JWT__
      });

      // Check for WordPress global JWT token first
      const windowJWT = (window as any).__IG_COVER_LETTER_JWT__ || (window as any).__IG_NETWORK_JWT__;
      if (windowJWT) {
        console.log('[Smart Context] Found WordPress JWT token (length:', windowJWT.length, ')');
        try {
          // Verify token with server
          const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: windowJWT })
          });

          console.log('[Smart Context] Token verification response status:', response.status);

          if (response.ok) {
            const { user: userData } = await response.json();
            console.log('[Smart Context] User data received:', userData);
            setAuthToken(windowJWT);
            setIsAuthenticated(true);
            setContextData(userData);
            sessionStorage.setItem('auth_token', windowJWT);
            sessionStorage.setItem('user_data', JSON.stringify(userData));

            // Build and auto-fill job description from context if available
            if (userData.companyName || userData.positionTitle || userData.jobDescription) {
              const jobDesc = buildJobDescription(userData);
              setState(prev => ({ ...prev, jobDescription: jobDesc }));
              setSmartContextLoaded(true);
              console.log('[Smart Context] Job description auto-populated from context');
            }

            console.log('[Smart Context] WordPress authentication successful');
            return;
          } else {
            const errorData = await response.json();
            console.error('[Smart Context] Token verification failed:', response.status, errorData);
          }
        } catch (err) {
          console.error('[Smart Context] WordPress JWT verification failed:', err);
        }
      } else {
        console.log('[Smart Context] No WordPress JWT token found in window variables');
      }

      // Check sessionStorage for existing auth
      const storedToken = sessionStorage.getItem('auth_token');
      const storedUserData = sessionStorage.getItem('user_data');

      if (storedToken && storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          setAuthToken(storedToken);
          setIsAuthenticated(true);
          setContextData(userData);
          console.log('[Smart Context] Restored authentication from sessionStorage');
          return;
        } catch (err) {
          console.error('[Smart Context] Failed to restore auth:', err);
          sessionStorage.removeItem('auth_token');
          sessionStorage.removeItem('user_data');
        }
      }

      const token = searchParams.get('context');

      if (token) {
        try {
          console.log('[Smart Context] Token received, verifying with server...');

          // Verify token with server (server has the secret, not client!)
          const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
          });

          if (!response.ok) {
            throw new Error('Token verification failed');
          }

          const { user: userData } = await response.json();
          console.log('[Smart Context] Token verified:', userData);

          // Store token and user data
          setAuthToken(token);
          setIsAuthenticated(true);
          sessionStorage.setItem('auth_token', token);
          sessionStorage.setItem('user_data', JSON.stringify(userData));

          // Build job description from context
          const jobDesc = buildJobDescription(userData);

          // Auto-fill the job description
          setState(prev => ({ ...prev, jobDescription: jobDesc }));
          setContextData(userData);
          setSmartContextLoaded(true);

          // Clean URL (remove token from address bar for security)
          window.history.replaceState({}, '', window.location.pathname);

          toast.success(`Job details auto-loaded from IG Career Hub!`, {
            duration: 4000,
            position: 'top-center',
          });

          console.log('[Smart Context] SUCCESS - Authenticated and context loaded!');
        } catch (err) {
          console.error('[Smart Context] Failed to verify context token:', err);
          toast.error('Failed to authenticate. Please try again from Career Hub.');
        }
      }
    };

    loadContext();
  }, [searchParams]);

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
      // Build headers with authentication if available
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers,
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

      // Build headers with authentication if available
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers,
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
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Header />

          {/* Smart Context Banner */}
          {smartContextLoaded && (
            <div className="mb-6 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-2 border-teal-500/50 rounded-lg p-4 relative animate-fade-in">
              <button
                onClick={() => setSmartContextLoaded(false)}
                className="absolute top-2 right-2 text-teal-200 hover:text-white transition-colors"
              >
                <FiX size={20} />
              </button>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <FiZap className="text-teal-400" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">
                    ✨ Job Details Auto-Loaded!
                  </h3>
                  <p className="text-teal-100 text-sm">
                    Context from <span className="font-semibold">{contextData?.companyName}</span> - {contextData?.positionTitle} has been automatically filled. You can edit the details below before generating your cover letter.
                  </p>
                </div>
              </div>
            </div>
          )}

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

          {/* Main Grid Layout - Wide & Responsive */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 lg:gap-8">
            {/* Left Column - Input Form */}
            <div className="xl:col-span-2 space-y-4">
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
            <div className="xl:col-span-3">
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
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Recent Versions</h3>
                <span className="text-xs text-muted-foreground">{generationHistory.length} version{generationHistory.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {generationHistory.slice(-5).map((historyState, index) => (
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

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
