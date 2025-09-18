'use client';

import { useState } from 'react';

export default function InputForm({
  jobDescription,
  setJobDescription,
  tone,
  setTone,
  keyStrength,
  setKeyStrength,
  onGenerate,
  isGenerating
}) {
  const [toneDropdownOpen, setToneDropdownOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const toneOptions = [
    {
      value: 'Professional & Formal',
      description: 'Traditional, business-appropriate language suitable for corporate environments.'
    },
    {
      value: 'Friendly & Conversational',
      description: 'Warm, approachable tone ideal for creative industries and startups.'
    },
    {
      value: 'Bold & Assertive',
      description: 'Confident language that emphasizes achievements and leadership qualities.'
    },
    {
      value: 'Problem-Solution Focused',
      description: 'Highlights your ability to identify challenges and implement effective solutions.'
    },
    {
      value: 'Direct to Hiring Manager / Formal to HR',
      description: 'Tailored approach depending on who will be reading your letter.'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="jobDescription" className="block text-lg font-medium mb-2">
          Job Description
        </label>
        <textarea
          id="jobDescription"
          className="input-field min-h-[150px]"
          placeholder="Paste the job listing or key responsibilities"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="tone" className="block text-lg font-medium mb-2">
          Tone
        </label>
        <div className="relative">
          <button
            type="button"
            className="flex items-center justify-between w-full input-field"
            onClick={() => setToneDropdownOpen(!toneDropdownOpen)}
          >
            <span>{tone}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform ${toneDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {toneDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-card rounded-md shadow-lg">
              <ul className="py-1">
                {toneOptions.map((option) => (
                  <li 
                    key={option.value}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-accent/10 ${tone === option.value ? 'bg-accent/20' : ''} relative`}
                    onClick={() => {
                      setTone(option.value);
                      setToneDropdownOpen(false);
                    }}
                    onMouseEnter={() => setActiveTooltip(option.value)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <div className="flex justify-between items-center">
                      <span>{option.value}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    
                    {activeTooltip === option.value && (
                      <div className="absolute left-full ml-2 top-0 z-20 w-64 p-2 bg-card border border-border rounded-md shadow-lg text-xs">
                        {option.description}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="keyStrength" className="block text-lg font-medium mb-2 flex items-center">
          Key Strength or Achievement
          <span className="ml-2 text-xs text-muted-foreground">(Optional)</span>
        </label>
        <textarea
          id="keyStrength"
          className="input-field min-h-[100px]"
          placeholder="Describe one achievement, strength, or quality you'd like us to highlight."
          value={keyStrength}
          onChange={(e) => setKeyStrength(e.target.value)}
        />
      </div>

      <button
        className={`btn-primary w-full uppercase tracking-wider transition-all duration-300 ${isGenerating ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'}`}
        onClick={onGenerate}
        disabled={!jobDescription || isGenerating}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </span>
        ) : (
          'Generate'
        )}
      </button>
    </div>
  );
}
