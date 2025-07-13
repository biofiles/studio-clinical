import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';

interface ElementPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const OnboardingOverlay: React.FC = () => {
  const { 
    isActive, 
    currentStep, 
    currentFlow, 
    nextStep, 
    previousStep, 
    stopOnboarding 
  } = useOnboarding();
  const { t } = useLanguage();
  const [elementPosition, setElementPosition] = useState<ElementPosition | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const updateElementPosition = useCallback(() => {
    if (!currentFlow || !isActive) return;

    const currentStepData = currentFlow.steps[currentStep];
    if (!currentStepData) return;

    const element = document.querySelector(currentStepData.selector);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    const position = {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
      width: rect.width,
      height: rect.height,
    };

    setElementPosition(position);

    // Calculate tooltip position with improved viewport boundary checks
    const tooltipOffset = 20;
    const tooltipWidth = 384; // max-w-sm = 24rem = 384px
    const tooltipHeight = 300; // estimated height
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let tooltipTop = position.top;
    let tooltipLeft = position.left;
    let actualPosition = currentStepData.position || 'bottom';

    // Initial position calculation
    switch (actualPosition) {
      case 'top':
        tooltipTop = position.top - tooltipOffset - tooltipHeight;
        tooltipLeft = position.left + position.width / 2 - tooltipWidth / 2;
        break;
      case 'bottom':
        tooltipTop = position.top + position.height + tooltipOffset;
        tooltipLeft = position.left + position.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        tooltipTop = position.top + position.height / 2 - tooltipHeight / 2;
        tooltipLeft = position.left - tooltipOffset - tooltipWidth;
        break;
      case 'right':
        tooltipTop = position.top + position.height / 2 - tooltipHeight / 2;
        tooltipLeft = position.left + position.width + tooltipOffset;
        break;
    }

    // Apply custom offset if provided
    if (currentStepData.offset) {
      tooltipTop += currentStepData.offset.y;
      tooltipLeft += currentStepData.offset.x;
    }

    // Enhanced viewport boundary checks and smart repositioning
    const margin = 20;
    
    // Check if tooltip goes out of bounds horizontally
    if (tooltipLeft < margin) {
      if (actualPosition === 'left') {
        // Switch to right position if left doesn't fit
        tooltipLeft = position.left + position.width + tooltipOffset;
        if (tooltipLeft + tooltipWidth > viewportWidth - margin) {
          // Center it if neither side fits
          tooltipLeft = Math.max(margin, (viewportWidth - tooltipWidth) / 2);
        }
      } else {
        tooltipLeft = margin;
      }
    } else if (tooltipLeft + tooltipWidth > viewportWidth - margin) {
      if (actualPosition === 'right') {
        // Switch to left position if right doesn't fit
        tooltipLeft = position.left - tooltipOffset - tooltipWidth;
        if (tooltipLeft < margin) {
          // Center it if neither side fits
          tooltipLeft = Math.max(margin, (viewportWidth - tooltipWidth) / 2);
        }
      } else {
        tooltipLeft = viewportWidth - tooltipWidth - margin;
      }
    }

    // Check if tooltip goes out of bounds vertically
    if (tooltipTop < margin) {
      if (actualPosition === 'top') {
        // Switch to bottom position if top doesn't fit
        tooltipTop = position.top + position.height + tooltipOffset;
      } else {
        tooltipTop = margin;
      }
    } else if (tooltipTop + tooltipHeight > viewportHeight - margin) {
      if (actualPosition === 'bottom') {
        // Switch to top position if bottom doesn't fit
        tooltipTop = position.top - tooltipOffset - tooltipHeight;
        if (tooltipTop < margin) {
          tooltipTop = margin;
        }
      } else {
        tooltipTop = viewportHeight - tooltipHeight - margin;
      }
    }

    setTooltipPosition({ top: tooltipTop, left: tooltipLeft });
  }, [currentFlow, currentStep, isActive]);

  // Update positions when step changes or on window resize
  useEffect(() => {
    if (isActive) {
      const timeoutId = setTimeout(updateElementPosition, 100);
      
      const handleResize = () => updateElementPosition();
      window.addEventListener('resize', handleResize);
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isActive, currentStep, updateElementPosition]);

  // Scroll element into view if needed
  useEffect(() => {
    if (!currentFlow || !isActive) return;

    const currentStepData = currentFlow.steps[currentStep];
    if (!currentStepData) return;

    const element = document.querySelector(currentStepData.selector);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    }
  }, [currentFlow, currentStep, isActive]);

  const handleAction = useCallback(() => {
    if (!currentFlow) return;

    const currentStepData = currentFlow.steps[currentStep];
    if (currentStepData.requiresAction) {
      const element = document.querySelector(currentStepData.selector) as HTMLElement;
      if (element) {
        element.click();
        // Wait a bit for the action to complete, then proceed
        setTimeout(() => {
          nextStep();
        }, 500);
      }
    } else {
      nextStep();
    }
  }, [currentFlow, currentStep, nextStep]);

  if (!isActive || !currentFlow || !elementPosition) {
    return null;
  }

  const currentStepData = currentFlow.steps[currentStep];
  const progress = ((currentStep + 1) / currentFlow.steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Spotlight effect - highlight the target element */}
      <div
        className="absolute border-4 border-primary rounded-lg shadow-xl"
        style={{
          top: elementPosition.top - 4,
          left: elementPosition.left - 4,
          width: elementPosition.width + 8,
          height: elementPosition.height + 8,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 20px rgba(59, 130, 246, 0.5)',
        }}
      />

      {/* Tooltip */}
      <div
        className="absolute z-10"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        <Card className="bg-studio-surface border-studio-border shadow-xl max-w-sm w-80">
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {currentStep + 1} / {currentFlow.steps.length}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={stopOnboarding}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Progress */}
            <Progress value={progress} className="mb-3 h-2" />

            {/* Content */}
            <div className="space-y-2">
              <h3 className="font-semibold text-studio-text text-sm">
                {t(currentStepData.title)}
              </h3>
              <p className="text-xs text-studio-text-muted leading-relaxed">
                {t(currentStepData.description)}
              </p>
              
              {currentStepData.requiresAction && (
                <div className="bg-blue-50 border border-blue-200 rounded p-2">
                  <p className="text-xs text-blue-800">
                    <strong>{t('onboarding.action.required')}:</strong>{' '}
                    {currentStepData.actionDescription && t(currentStepData.actionDescription)}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-1">
                {currentStep > 0 && (
                  <Button variant="outline" size="sm" onClick={previousStep} className="text-xs px-2 py-1">
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    {t('onboarding.previous')}
                  </Button>
                )}
              </div>

              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" onClick={stopOnboarding} className="text-xs px-2 py-1">
                  <SkipForward className="h-3 w-3 mr-1" />
                  {t('onboarding.skip')}
                </Button>
                <Button size="sm" onClick={handleAction} className="text-xs px-2 py-1">
                  {currentStep === currentFlow.steps.length - 1
                    ? t('onboarding.finish')
                    : t('onboarding.next')
                  }
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};