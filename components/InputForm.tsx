'use client';

import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

interface InputFormProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  keyStrength: string;
  setKeyStrength: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function InputForm({
  jobDescription,
  setJobDescription,
  tone,
  setTone,
  keyStrength,
  setKeyStrength,
  onGenerate,
  isGenerating
}: InputFormProps) {
  const [toneDropdownOpen, setToneDropdownOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const toneOptions = [
    {
      value: 'Professional & Formal',
      description: 'Traditional, business-appropriate language suitable for corporate environments and traditional industries.'
    },
    {
      value: 'Friendly & Conversational',
      description: 'Warm, approachable tone ideal for creative industries, startups, and modern companies.'
    },
    {
      value: 'Bold & Assertive',
      description: 'Confident language that emphasizes achievements and leadership qualities for competitive roles.'
    },
    {
      value: 'Problem-Solution Focused',
      description: 'Analytical approach highlighting your ability to identify challenges and implement solutions.'
    },
    {
      value: 'Direct to Hiring Manager / Formal to HR',
      description: 'Tailored approach that adapts based on the intended recipient of your application.'
    }
  ];

  // Character count helpers
  const getCharacterInfo = (text: string, label: string) => {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return { chars, words, label };
  };

  const jobDescInfo = getCharacterInfo(jobDescription, 'Job Description');
  const keyStrengthInfo = getCharacterInfo(keyStrength, 'Key Strength');

  return (
    <div className="space-y-6">
      {/* Job Description Field */}
      <div className="space-y-2">
        <label
          htmlFor="jobDescription"
          className="block text-lg font-medium mb-2 flex items-center justify-between"
        >
          <span className="flex items-center">
            Job Description
            <span className="ml-2 text-sm text-accent bg-accent/10 px-2 py-1 rounded-full">
              Required
            </span>
          </span>
          <div className="text-sm text-muted-foreground font-normal">
            {jobDescInfo.words} words • {jobDescInfo.chars} characters
          </div>
        </label>

        <div className={`relative transition-all duration-300 ${
          focusedField === 'jobDescription' ? 'ring-2 ring-accent/20 ring-offset-2 ring-offset-background' : ''
        }`}>
          <TextareaAutosize
            id="jobDescription"
            className="input-field min-h-[150px] resize-none transition-all duration-200"
            placeholder="Paste the complete job listing, including responsibilities, requirements, and qualifications. The more detail you provide, the better your cover letter will be tailored."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            onFocus={() => setFocusedField('jobDescription')}
            onBlur={() => setFocusedField(null)}
            minRows={6}
            maxRows={25}
          />
          {jobDescription.length > 0 && (
            <div className="absolute top-2 right-2 opacity-60">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {jobDescription.length > 0 && (
          <div className="text-xs text-muted-foreground bg-accent/5 p-2 rounded-md">
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-1 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Excellent! Your job description is comprehensive and will help create a highly targeted cover letter.
            </div>
          </div>
        )}
      </div>

      {/* Tone Selection */}
      <div className="space-y-2">
        <label htmlFor="tone" className="block text-lg font-medium mb-2 flex items-center">
          <span>Writing Tone</span>
          <svg className="w-4 h-4 ml-2 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </label>

        <div className="relative">
          <button
            type="button"
            className={`flex items-center justify-between w-full input-field transition-all duration-200 ${
              toneDropdownOpen ? 'ring-2 ring-accent/20 ring-offset-2 ring-offset-background' : ''
            }`}
            onClick={() => setToneDropdownOpen(!toneDropdownOpen)}
          >
            <span className="font-medium">{tone}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform duration-200 ${toneDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {toneDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-card rounded-md shadow-lg border border-border animate-in slide-in-from-top-2 duration-200">
              <ul className="py-1">
                {toneOptions.map((option, index) => (
                  <li
                    key={option.value}
                    className={`px-4 py-3 text-sm cursor-pointer hover:bg-accent/10 transition-colors duration-150 ${
                      tone === option.value ? 'bg-accent/20 border-l-2 border-accent' : ''
                    } relative`}
                    onClick={() => {
                      setTone(option.value);
                      setToneDropdownOpen(false);
                    }}
                    onMouseEnter={() => setActiveTooltip(option.value)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{option.value}</div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {option.description}
                        </div>
                      </div>
                      {tone === option.value && (
                        <svg className="w-4 h-4 text-accent mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Key Strength Field */}
      <div className="space-y-2">
        <label
          htmlFor="keyStrength"
          className="block text-lg font-medium mb-2 flex items-center justify-between"
        >
          <span className="flex items-center">
            Key Strength or Achievement
            <span className="ml-2 text-sm text-muted-foreground bg-muted/20 px-2 py-1 rounded-full">
              Optional
            </span>
          </span>
          <div className="text-sm text-muted-foreground font-normal">
            {keyStrengthInfo.words} words • {keyStrengthInfo.chars} characters
          </div>
        </label>

        <div className={`relative transition-all duration-300 ${
          focusedField === 'keyStrength' ? 'ring-2 ring-accent/20 ring-offset-2 ring-offset-background' : ''
        }`}>
          <TextareaAutosize
            id="keyStrength"
            className="input-field min-h-[100px] resize-none transition-all duration-200"
            placeholder="Describe a specific achievement, strength, or quality you'd like highlighted. Example: 'Led a team of 12 developers and increased productivity by 40% through implementation of agile methodologies and automated testing frameworks.'"
            value={keyStrength}
            onChange={(e) => setKeyStrength(e.target.value)}
            onFocus={() => setFocusedField('keyStrength')}
            onBlur={() => setFocusedField(null)}
            minRows={3}
            maxRows={15}
          />
          {keyStrength.length > 0 && (
            <div className="absolute top-2 right-2 opacity-60">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {keyStrength.length > 50 && (
          <div className="text-xs text-muted-foreground bg-accent/5 p-2 rounded-md">
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-1 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Great! This specific achievement will be prominently featured in your cover letter.
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div className="pt-4">
        <button
          className={`btn-primary w-full text-lg py-4 uppercase tracking-wider transition-all duration-300 transform ${
            isGenerating
              ? 'opacity-70 cursor-not-allowed scale-95'
              : jobDescription.trim().length > 0
              ? 'hover:shadow-lg hover:scale-105 hover:shadow-accent/25'
              : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={onGenerate}
          disabled={!jobDescription.trim() || isGenerating}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="animate-pulse">Crafting Your Cover Letter...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Generate Professional Cover Letter
            </span>
          )}
        </button>

        {!jobDescription.trim() && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Please provide a job description to generate your cover letter
          </p>
        )}
      </div>
    </div>
  );
}
