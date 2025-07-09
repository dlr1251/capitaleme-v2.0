import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface TutorialStep {
  target: string;
  content: React.ReactNode;
  title?: string;
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  isOpen: boolean;
  onClose: () => void;
  onFinish: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  steps,
  isOpen,
  onClose,
  onFinish
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && steps[currentStep]) {
      const targetElement = document.querySelector(steps[currentStep].target);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep, isOpen, steps]);

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const targetElement = document.querySelector(currentStepData.target);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const getTargetPosition = () => {
    if (!targetElement) return { top: 0, left: 0, width: 0, height: 0 };
    
    const rect = targetElement.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height
    };
  };

  const position = getTargetPosition();

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleSkip}
      />
      
      {/* Highlight overlay */}
      <div
        className="absolute border-2 border-primary rounded-lg shadow-lg"
        style={{
          top: position.top - 4,
          left: position.left - 4,
          width: position.width + 8,
          height: position.height + 8,
          zIndex: 51
        }}
      >
        <div className="absolute inset-0 bg-primary bg-opacity-10 rounded-lg" />
      </div>

      {/* Tooltip */}
      <div
        ref={overlayRef}
        className="absolute bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-sm"
        style={{
          top: position.top + position.height + 20,
          left: Math.max(10, position.left - 200),
          zIndex: 52
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span className="text-sm font-medium text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          {currentStepData.title && (
            <h3 className="font-semibold text-primary mb-2">
              {currentStepData.title}
            </h3>
          )}
          <div className="text-gray-700">
            {currentStepData.content}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center gap-1 px-3 py-2 text-sm rounded transition-colors ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-primary hover:bg-primary-50'
            }`}
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary-600 transition-colors"
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            {currentStep < steps.length - 1 && <ChevronRightIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay; 