'use client';

import { useState, useEffect } from 'react';

export default function LetterPreview({
  letterContent,
  setLetterContent,
  keywords,
  impactScore,
  refinementSuggestion,
  onRefinement,
  isGenerating
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(letterContent);
  const [activeKeywords, setActiveKeywords] = useState([]);
  const [keywordHover, setKeywordHover] = useState(null);

  useEffect(() => {
    setEditableContent(letterContent);
    
    // Highlight keywords in the letter content
    if (letterContent && keywords && keywords.length > 0) {
      const foundKeywords = [];
      const lowerContent = letterContent.toLowerCase();
      
      keywords.forEach(keyword => {
        if (lowerContent.includes(keyword.toLowerCase())) {
          foundKeywords.push(keyword);
        }
      });
      
      setActiveKeywords(foundKeywords);
    }
  }, [letterContent, keywords]);

  const handleEditToggle = () => {
    if (isEditing) {
      setLetterContent(editableContent);
    } else {
      setEditableContent(letterContent);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Letter Preview
        </h2>
        {letterContent && (
          <button 
            onClick={handleEditToggle}
            className="text-sm text-accent hover:text-accent/80"
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        )}
      </div>

      <div className="bg-card rounded-md border border-border p-4 min-h-[300px]">
        {isGenerating ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
          </div>
        ) : letterContent ? (
          isEditing ? (
            <textarea
              className="w-full h-full min-h-[300px] bg-transparent focus:outline-none resize-none"
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
            />
          ) : (
            <div className="whitespace-pre-wrap">{letterContent}</div>
          )
        ) : (
          <div className="text-muted-foreground text-center h-full flex items-center justify-center">
            Your cover letter will appear here after generation
          </div>
        )}
      </div>

      {letterContent && (
        <>
          {refinementSuggestion && (
            <div className="flex items-start space-x-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{refinementSuggestion}</p>
            </div>
          )}

          <div>
            <h3 className="flex items-center text-base font-medium mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Keyword Match
            </h3>
            <div className="mb-2">
              <div className="h-2 w-full bg-accent/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-secondary rounded-full transition-all duration-500" 
                  style={{ width: `${activeKeywords.length > 0 ? (activeKeywords.length / keywords.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div className="flex flex-wrap relative">
              {keywords.map((keyword) => (
                <div 
                  key={keyword} 
                  className={`keyword-tag ${activeKeywords.includes(keyword) ? 'keyword-tag-matched' : 'keyword-tag-missing'}`}
                  onMouseEnter={() => setKeywordHover(keyword)}
                  onMouseLeave={() => setKeywordHover(null)}
                >
                  {keyword}
                  {keywordHover === keyword && (
                    <div className="absolute z-10 bg-card border border-border rounded-md p-2 shadow-lg text-xs max-w-[200px] -mt-12">
                      {activeKeywords.includes(keyword) 
                        ? `✓ "${keyword}" is included in your letter` 
                        : `✗ Consider adding "${keyword}" to your letter`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="flex items-center text-base font-medium mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Impact Score
            </h3>
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    className="text-accent/20" 
                    strokeWidth="10" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="40" 
                    cx="50" 
                    cy="50" 
                  />
                  <circle 
                    className="text-secondary transition-all duration-1000" 
                    strokeWidth="10" 
                    strokeDasharray={`${impactScore * 2.51} 251`} 
                    strokeLinecap="round" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="40" 
                    cx="50" 
                    cy="50" 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-4xl font-bold">{impactScore}</span>
                    <span className="text-xl">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button 
              className="btn-refinement flex items-center justify-center"
              onClick={() => onRefinement('strengthen-opener')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Strengthen Opener
            </button>
            <button 
              className="btn-refinement flex items-center justify-center"
              onClick={() => onRefinement('achievement-focused')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Achievement-Focused
            </button>
            <button 
              className="btn-refinement flex items-center justify-center"
              onClick={() => onRefinement('make-more')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Make More
            </button>
            <button 
              className="btn-refinement flex items-center justify-center"
              onClick={() => onRefinement('shorten-letter')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Shorten Let
            </button>
          </div>

          <div className="mt-6 bg-primary/10 rounded-md p-4 flex">
            <div className="mr-3 text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Interview Guys Pro Tip</h4>
              <p className="text-sm">Show passion for the role and company to set yourself apart.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
