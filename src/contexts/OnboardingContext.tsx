import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  selector: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  offset?: { x: number; y: number };
  requiresAction?: boolean;
  actionDescription?: string;
}

export interface OnboardingFlow {
  role: string;
  steps: OnboardingStep[];
}

interface OnboardingContextType {
  isActive: boolean;
  currentStep: number;
  currentFlow: OnboardingFlow | null;
  startOnboarding: (role?: string) => void;
  stopOnboarding: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipToStep: (stepIndex: number) => void;
  hasCompletedOnboarding: (role: string) => boolean;
  markOnboardingComplete: (role: string) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentFlow, setCurrentFlow] = useState<OnboardingFlow | null>(null);
  const { user } = useAuth();

  const getStorageKey = (role: string) => `onboarding_completed_${role}`;

  const hasCompletedOnboarding = useCallback((role: string): boolean => {
    return localStorage.getItem(getStorageKey(role)) === 'true';
  }, []);

  const markOnboardingComplete = useCallback((role: string) => {
    localStorage.setItem(getStorageKey(role), 'true');
  }, []);

  const startOnboarding = useCallback((role?: string) => {
    const userRole = role || user?.role || 'participant';
    const flow = getOnboardingFlow(userRole);
    
    if (flow) {
      setCurrentFlow(flow);
      setCurrentStep(0);
      setIsActive(true);
    }
  }, [user?.role]);

  const stopOnboarding = useCallback(() => {
    setIsActive(false);
    setCurrentFlow(null);
    setCurrentStep(0);
  }, []);

  const nextStep = useCallback(() => {
    if (currentFlow && currentStep < currentFlow.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else if (currentFlow) {
      // Tutorial completed
      markOnboardingComplete(currentFlow.role);
      stopOnboarding();
    }
  }, [currentFlow, currentStep, markOnboardingComplete, stopOnboarding]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const skipToStep = useCallback((stepIndex: number) => {
    if (currentFlow && stepIndex >= 0 && stepIndex < currentFlow.steps.length) {
      setCurrentStep(stepIndex);
    }
  }, [currentFlow]);

  const value: OnboardingContextType = {
    isActive,
    currentStep,
    currentFlow,
    startOnboarding,
    stopOnboarding,
    nextStep,
    previousStep,
    skipToStep,
    hasCompletedOnboarding,
    markOnboardingComplete,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

// Define onboarding flows for different roles
const getOnboardingFlow = (role: string): OnboardingFlow | null => {
  switch (role) {
    case 'participant':
      return {
        role: 'participant',
        steps: [
          {
            id: 'welcome',
            title: 'onboarding.participant.welcome.title',
            description: 'onboarding.participant.welcome.description',
            selector: '[data-onboarding="welcome-section"]',
            position: 'bottom'
          },
          {
            id: 'progress',
            title: 'onboarding.participant.progress.title', 
            description: 'onboarding.participant.progress.description',
            selector: '[data-onboarding="progress-card"]',
            position: 'bottom'
          },
          {
            id: 'schedule',
            title: 'onboarding.participant.schedule.title',
            description: 'onboarding.participant.schedule.description',
            selector: '[data-tab="schedule"]',
            position: 'bottom',
            requiresAction: true,
            actionDescription: 'onboarding.participant.schedule.action'
          },
          {
            id: 'questionnaires',
            title: 'onboarding.participant.questionnaires.title',
            description: 'onboarding.participant.questionnaires.description',
            selector: '[data-tab="questionnaires"]',
            position: 'bottom',
            requiresAction: true,
            actionDescription: 'onboarding.participant.questionnaires.action'
          },
          {
            id: 'econsent',
            title: 'onboarding.participant.econsent.title',
            description: 'onboarding.participant.econsent.description',
            selector: '[data-tab="econsent"]',
            position: 'bottom'
          },
          {
            id: 'visits',
            title: 'onboarding.participant.visits.title',
            description: 'onboarding.participant.visits.description',
            selector: '[data-tab="visits"]',
            position: 'bottom'
          },
          {
            id: 'contact',
            title: 'onboarding.participant.contact.title',
            description: 'onboarding.participant.contact.description',
            selector: '[data-tab="contact"]',
            position: 'bottom'
          }
        ]
      };

    case 'investigator':
      return {
        role: 'investigator',
        steps: [
          {
            id: 'metrics',
            title: 'onboarding.investigator.metrics.title',
            description: 'onboarding.investigator.metrics.description',
            selector: '[data-onboarding="study-metrics"]',
            position: 'bottom'
          },
          {
            id: 'participants',
            title: 'onboarding.investigator.participants.title',
            description: 'onboarding.investigator.participants.description',
            selector: '[data-onboarding="participant-list-btn"]',
            position: 'left'
          },
          {
            id: 'calendar',
            title: 'onboarding.investigator.calendar.title',
            description: 'onboarding.investigator.calendar.description',
            selector: '[data-onboarding="calendar-btn"]',
            position: 'left'
          },
          {
            id: 'barcode',
            title: 'onboarding.investigator.barcode.title',
            description: 'onboarding.investigator.barcode.description',
            selector: '[data-onboarding="barcode-btn"]',
            position: 'left'
          },
          {
            id: 'fhir',
            title: 'onboarding.investigator.fhir.title',
            description: 'onboarding.investigator.fhir.description',
            selector: '[data-onboarding="fhir-btn"]',
            position: 'left'
          },
          {
            id: 'progress',
            title: 'onboarding.investigator.progress.title',
            description: 'onboarding.investigator.progress.description',
            selector: '[data-onboarding="progress-cards"]',
            position: 'top'
          }
        ]
      };

    case 'cro-sponsor':
      return {
        role: 'cro-sponsor',
        steps: [
          {
            id: 'overview',
            title: 'onboarding.cro.overview.title',
            description: 'onboarding.cro.overview.description',
            selector: '[data-onboarding="portfolio-stats"]',
            position: 'bottom'
          },
          {
            id: 'study-selector',
            title: 'onboarding.cro.selector.title',
            description: 'onboarding.cro.selector.description',
            selector: '[data-onboarding="study-dropdown"]',
            position: 'bottom'
          },
          {
            id: 'tabs',
            title: 'onboarding.cro.tabs.title',
            description: 'onboarding.cro.tabs.description',
            selector: '[data-onboarding="main-tabs"]',
            position: 'bottom'
          },
          {
            id: 'questionnaires',
            title: 'onboarding.cro.questionnaires.title',
            description: 'onboarding.cro.questionnaires.description',
            selector: '[data-tab="questionnaires"]',
            position: 'bottom',
            requiresAction: true,
            actionDescription: 'onboarding.cro.questionnaires.action'
          },
          {
            id: 'reports',
            title: 'onboarding.cro.reports.title',
            description: 'onboarding.cro.reports.description',
            selector: '[data-tab="reports"]',
            position: 'bottom',
            requiresAction: true,
            actionDescription: 'onboarding.cro.reports.action'
          }
        ]
      };

    default:
      return null;
  }
};