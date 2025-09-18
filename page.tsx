'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import InputForm from '@/components/InputForm';
import LetterPreview from '@/components/LetterPreview';

export default function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('Professional & Formal');
  const [keyStrength, setKeyStrength] = useState('');
  const [letterContent, setLetterContent] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [impactScore, setImpactScore] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [refinementSuggestion, setRefinementSuggestion] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          tone,
          keyStrength
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate cover letter');
      }
      
      const data = await response.json();
      
      setLetterContent(data.letterContent);
      setKeywords(data.keywords);
      setImpactScore(data.impactScore);
      setRefinementSuggestion(data.refinementSuggestion);
    } catch (error) {
      console.error('Error generating cover letter:', error);
      // Show error message to user
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefinement = async (type) => {
    if (!letterContent) return;
    
    setIsRefining(true);
    
    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          letterContent,
          refinementType: type
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to refine cover letter');
      }
      
      const data = await response.json();
      setLetterContent(data.refinedContent);
      
      // Recalculate impact score (simplified version)
      if (type === 'strengthen-opener' || type === 'achievement-focused') {
        setImpactScore(Math.min(impactScore + 5, 100));
      }
    } catch (error) {
      console.error('Error refining cover letter:', error);
      // Show error message to user
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="space-y-8">
      <Header />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <InputForm 
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            tone={tone}
            setTone={setTone}
            keyStrength={keyStrength}
            setKeyStrength={setKeyStrength}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>
        
        <div>
          <LetterPreview 
            letterContent={letterContent}
            setLetterContent={setLetterContent}
            keywords={keywords}
            impactScore={impactScore}
            refinementSuggestion={refinementSuggestion}
            onRefinement={handleRefinement}
            isGenerating={isGenerating || isRefining}
          />
        </div>
      </div>
    </div>
  );
}
