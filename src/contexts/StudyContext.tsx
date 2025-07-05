import React, { createContext, useContext, useState, useEffect } from 'react';

interface Study {
  id: string;
  name: string;
  protocol: string;
  phase: string;
  status: 'active' | 'recruiting' | 'completed';
  sites: number;
  participants: number;
  sponsor: string;
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
    name: 'PARADIGM-CV',
    protocol: 'NVS-4578-301',
    phase: 'Phase III',
    status: 'active',
    sites: 18,
    participants: 385,
    sponsor: 'Novartis AG'
  },
  {
    id: '2',
    name: 'ATLAS-DM2', 
    protocol: 'PF-07081532-003',
    phase: 'Phase II',
    status: 'recruiting',
    sites: 14,
    participants: 162,
    sponsor: 'Pfizer Inc.'
  },
  {
    id: '3',
    name: 'HORIZON-Onc',
    protocol: 'RO-7198457-104',
    phase: 'Phase I/II',
    status: 'active',
    sites: 9,
    participants: 94,
    sponsor: 'Roche Ltd.'
  },
  {
    id: '4',
    name: 'GUARDIAN-Ped',
    protocol: 'JNJ-83475219-201',
    phase: 'Phase II/III',
    status: 'recruiting',
    sites: 22,
    participants: 278,
    sponsor: 'Johnson & Johnson'
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