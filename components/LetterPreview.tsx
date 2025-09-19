'use client';

import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

interface LetterPreviewProps {
  letterContent: string;
  setLetterContent: (content: string) => void;
  keywords: string[];
  impactScore: number;
  refinementSuggestion: string;
  onRefinement: (type: string) => void;
  isGenerating: boolean;
  metadata?: {
    wordCount: number;
    characterCount: number;
    generatedAt: string;
    tone: string;
    keywordsFound: number;
  };
}

export default function LetterPreview({
  letterContent,
  setLetterContent,
  keywords,
  impactScore,
  refinementSuggestion,
  onRefinement,
  isGenerating,
  metadata
}: LetterPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(letterContent);
  const [activeKeywords, setActiveKeywords] = useState<string[]>([]);
  const [keywordHover, setKeywordHover] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditableContent(letterContent);

    // Highlight keywords in the letter content
    if (letterContent && keywords && keywords.length > 0) {
      const foundKeywords: string[] = [];
      const lowerContent = letterContent.toLowerCase();

      keywords.forEach(keyword => {
        if (lowerContent.includes(keyword.toLowerCase())) {
          foundKeywords.push(keyword);
        }
      });

      setActiveKeywords(foundKeywords);
    }
  }, [letterContent, keywords]);

  // Copy to clipboard functionality
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(letterContent);
      setCopySuccess(true);
      toast.success('Cover letter copied to clipboard!', {
        duration: 2000,
        position: 'top-center',
      });
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard', {
        duration: 2000,
        position: 'top-center',
      });
    }
  };

  // Export to text file functionality
  const handleExportToFile = () => {
    setIsExporting(true);
    try {
      const blob = new Blob([letterContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cover-letter-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Cover letter exported successfully!', {
        duration: 2000,
        position: 'top-center',
      });
    } catch (err) {
      toast.error('Failed to export file', {
        duration: 2000,
        position: 'top-center',
      });
    } finally {
      setTimeout(() => setIsExporting(false), 1000);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setLetterContent(editableContent);
      toast.success('Changes saved!', {
        duration: 1000,
        position: 'top-center',
      });
    } else {
      setEditableContent(letterContent);
    }
    setIsEditing(!isEditing);
  };

  // Calculate additional metrics
  const wordCount = letterContent ? letterContent.trim().split(/\s+/).length : 0;
  const charCount = letterContent ? letterContent.length : 0;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200)); // Average reading speed

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Cover Letter Preview
          </h2>
          {letterContent && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{estimatedReadTime} min read</span>
            </div>
          )}
        </div>

        {letterContent && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyToClipboard}
              className={`text-sm px-3 py-1.5 rounded-md transition-all duration-200 flex items-center space-x-1 ${
                copySuccess
                  ? 'bg-green-500/20 text-green-600'
                  : 'bg-accent/10 text-accent hover:bg-accent/20'
              }`}
              title="Copy to clipboard"
            >
              {copySuccess ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
              <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handleExportToFile}
              disabled={isExporting}
              className="text-sm px-3 py-1.5 rounded-md bg-secondary/10 text-secondary hover:bg-secondary/20 transition-all duration-200 flex items-center space-x-1"
              title="Export to text file"
            >
              {isExporting ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              <span>{isExporting ? 'Exporting...' : 'Export'}</span>
            </button>

            <button
              onClick={handleEditToggle}
              className="text-sm px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200 flex items-center space-x-1"
            >
              {isEditing ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              )}
              <span>{isEditing ? 'Save' : 'Edit'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="bg-card rounded-md border border-border overflow-hidden">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center h-80 space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
              <div className="absolute inset-0 rounded-full border-2 border-secondary/20"></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Crafting your cover letter...</p>
              <p className="text-sm text-muted-foreground">
                Using advanced AI to create a personalized, professional cover letter
              </p>
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        ) : letterContent ? (
          <div className="relative">
            {isEditing ? (
              <div className="p-4">
                <textarea
                  ref={textareaRef}
                  className="w-full min-h-[400px] bg-transparent focus:outline-none resize-none text-sm leading-relaxed"
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  placeholder="Edit your cover letter here..."
                />
              </div>
            ) : (
              <div className="p-6">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {letterContent}
                  </div>
                </div>
              </div>
            )}

            {/* Status indicator */}
            <div className="absolute top-2 right-2">
              {isEditing ? (
                <div className="bg-amber-500/20 text-amber-600 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <span>Editing</span>
                </div>
              ) : (
                <div className="bg-green-500/20 text-green-600 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Ready</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-80 space-y-4">
            <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-muted-foreground">Ready to generate your cover letter</p>
              <p className="text-sm text-muted-foreground max-w-sm">
                Enter your job description and click generate to create a personalized, professional cover letter
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Analytics and Actions Section */}
      {letterContent && (
        <>
          {/* Refinement Suggestion */}
          {refinementSuggestion && (
            <div className="bg-accent/5 border border-accent/20 rounded-md p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-accent mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Suggestion for Improvement</h4>
                  <p className="text-sm text-muted-foreground">{refinementSuggestion}</p>
                </div>
              </div>
            </div>
          )}

          {/* Keywords Analysis */}
          <div className="space-y-4">
            <h3 className="flex items-center text-base font-medium">
              <svg className="h-5 w-5 mr-2 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Keyword Analysis
              <span className="ml-2 text-sm text-muted-foreground">
                ({activeKeywords.length}/{keywords.length} matched)
              </span>
            </h3>

            <div className="space-y-3">
              <div className="relative">
                <div className="h-3 w-full bg-accent/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-accent rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${keywords.length > 0 ? (activeKeywords.length / keywords.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                  {keywords.length > 0 ? Math.round((activeKeywords.length / keywords.length) * 100) : 0}%
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {keywords.slice(0, 9).map((keyword) => (
                  <div
                    key={keyword}
                    className={`relative px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                      activeKeywords.includes(keyword)
                        ? 'bg-green-500/20 text-green-700 border border-green-500/30'
                        : 'bg-red-500/20 text-red-700 border border-red-500/30'
                    }`}
                    onMouseEnter={() => setKeywordHover(keyword)}
                    onMouseLeave={() => setKeywordHover(null)}
                  >
                    <div className="flex items-center space-x-1">
                      {activeKeywords.includes(keyword) ? (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="truncate">{keyword}</span>
                    </div>

                    {keywordHover === keyword && (
                      <div className="absolute z-10 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-md p-2 shadow-lg text-xs max-w-[200px] whitespace-normal">
                        {activeKeywords.includes(keyword)
                          ? `✓ "${keyword}" is successfully included in your cover letter`
                          : `✗ Consider incorporating "${keyword}" to better match the job requirements`}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {keywords.length > 9 && (
                <p className="text-xs text-muted-foreground">
                  Showing top 9 keywords. {keywords.length - 9} more analyzed.
                </p>
              )}
            </div>
          </div>

          {/* Impact Score */}
          <div className="space-y-4">
            <h3 className="flex items-center text-base font-medium">
              <svg className="h-5 w-5 mr-2 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Impact Score
            </h3>

            <div className="flex items-center justify-center">
              <div className={`relative w-40 h-40 ${impactScore >= 85 ? 'drop-shadow-[0_0_15px_rgba(20,184,166,0.4)]' : ''}`}>
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-teal-200/20"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className={`transition-all duration-2000 ease-out ${
                      impactScore >= 85 ? 'text-teal-400' : 'text-teal-500'
                    }`}
                    strokeWidth="8"
                    strokeDasharray={`${impactScore * 2.51} 251`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    style={{
                      filter: impactScore >= 85 ? 'drop-shadow(0 0 8px rgba(20, 184, 166, 0.6))' : 'none'
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className={`text-5xl font-bold ${impactScore >= 85 ? 'text-teal-400' : 'text-foreground'}`}>
                      {impactScore}
                    </span>
                    <span className={`text-2xl ${impactScore >= 85 ? 'text-teal-400' : 'text-foreground'}`}>%</span>
                    <div className="text-xs text-muted-foreground mt-1">Impact Score</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              {impactScore >= 90 ? 'Excellent! Your cover letter is highly optimized.' :
               impactScore >= 80 ? 'Very good! Minor improvements could help.' :
               impactScore >= 70 ? 'Good foundation. Consider refinements below.' :
               'Room for improvement. Try the refinement options.'}
            </div>
          </div>

          {/* Refinement Options */}
          <div className="space-y-4">
            <h3 className="flex items-center text-base font-medium">
              <svg className="h-5 w-5 mr-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              Refinement Options
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'strengthen-opener', label: 'Strengthen Opening', icon: 'M13 10V3L4 14h7v7l9-11h-7z', description: 'Make a more compelling first impression' },
                { id: 'achievement-focused', label: 'Highlight Achievements', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', description: 'Emphasize quantifiable results' },
                { id: 'make-more-compelling', label: 'Enhance Content', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', description: 'Add more persuasive details' },
                { id: 'optimize-length', label: 'Optimize Length', icon: 'M19 9l-7 7-7-7', description: 'Adjust for optimal impact' }
              ].map((option) => (
                <button
                  key={option.id}
                  className="btn-refinement p-4 text-left space-y-2 hover:shadow-md transition-all duration-200"
                  onClick={() => onRefinement(option.id)}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
                    </svg>
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Pro Tip */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-md p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">💡 Professional Tip</h4>
                <p className="text-sm text-muted-foreground">
                  Research the company's values and recent news to add personalized touches that demonstrate genuine interest and cultural fit.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
