import React, { createContext, useContext, useState, useEffect } from 'react';

interface Study {
  id: string;
  name: string;
  protocol: string;
  phase: string;
  status: 'active' | 'recruiting' | 'completed';
  sites: number;
  participants: number;
}

interface StudyContextType {
  selectedStudy: Study | null;
  setSelectedStudy: (study: Study | null) => void;
  studies: Study[];
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const mockStudies: Study[] = [
  {
    id: '1',
    name: 'Cardiovascular Safety Study',
    protocol: 'PROTO-2024-001',
    phase: 'Phase III',
    status: 'active',
    sites: 12,
    participants: 450
  },
  {
    id: '2',
    name: 'Diabetes Management Trial',
    protocol: 'PROTO-2024-002',
    phase: 'Phase II',
    status: 'recruiting',
    sites: 8,
    participants: 120
  },
  {
    id: '3',
    name: 'Oncology Biomarker Study',
    protocol: 'PROTO-2024-003',
    phase: 'Phase I',
    status: 'active',
    sites: 5,
    participants: 75
  },
  {
    id: '4',
    name: 'Pediatric Safety Evaluation',
    protocol: 'PROTO-2024-004',
    phase: 'Phase III',
    status: 'recruiting',
    sites: 15,
    participants: 200
  }
];

export const StudyProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [studies] = useState<Study[]>(mockStudies);

  // Load selected study from localStorage on mount
  useEffect(() => {
    const savedStudy = localStorage.getItem('selectedStudy');
    if (savedStudy) {
      try {
        const study = JSON.parse(savedStudy);
        setSelectedStudy(study);
      } catch (error) {
        console.error('Error loading saved study:', error);
      }
    }
  }, []);

  // Save selected study to localStorage when it changes
  useEffect(() => {
    if (selectedStudy) {
      localStorage.setItem('selectedStudy', JSON.stringify(selectedStudy));
    } else {
      localStorage.removeItem('selectedStudy');
    }
  }, [selectedStudy]);

  return (
    <StudyContext.Provider value={{ selectedStudy, setSelectedStudy, studies }}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};