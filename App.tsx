import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { ConsultationView } from './components/ConsultationView.tsx';
import { NotesView } from './components/NotesView.tsx';
import { TemplatesView } from './components/TemplatesView.tsx';
import { SupportView } from './components/SupportView.tsx';
import { CustomNoteView } from './components/CustomNoteView.tsx';
import { PatientDetailsModal } from './components/PatientDetailsModal.tsx';
import { PatientDetails } from './types.ts';
import { TourOverlay, TourStep } from './components/TourOverlay.tsx';

type ViewType = 'dashboard' | 'consultation' | 'notes' | 'templates' | 'support' | 'custom-note';

// Define Tour Steps
const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    targetId: 'tour-start-consult-card',
    title: 'Start Here',
    content: 'Welcome, Dr. Smith! 👋 Click here to launch your first AI-assisted consultation. We will handle the documentation for you.',
    position: 'right',
    actionRequired: true
  },
  {
    id: 'modal-inputs',
    targetId: 'tour-patient-form',
    title: 'Context Matters',
    content: 'Enter basic details here. The AI adapts its medical terminology based on the Patient Age and Specialty you select.',
    position: 'right'
  },
  {
    id: 'modal-start',
    targetId: 'tour-start-recording-btn',
    title: 'Begin Session',
    content: 'Once details are set, click "Start Recording" to enter the secure listening room.',
    position: 'top',
    actionRequired: true
  },
  {
    id: 'consult-demo',
    targetId: 'tour-load-demo',
    title: 'See the Magic',
    content: 'No microphone right now? No problem! Click "Load Demo" to simulate a real-time patient conversation instantly.',
    position: 'bottom',
    actionRequired: true
  },
  {
    id: 'consult-generate',
    targetId: 'tour-generate-soap',
    title: 'AI Extraction',
    content: 'The Transcript is ready. Now click "Generate SOAP" to watch the AI organize clinical facts into a structured note.',
    position: 'bottom',
    actionRequired: true
  },
  {
    id: 'consult-edit',
    targetId: 'tour-assessment-plan',
    title: 'Your Expertise',
    content: 'The AI drafts the Subjective & Objective. You provide the final Diagnosis (Assessment) and Treatment (Plan) to verify the note.',
    position: 'left'
  }
];

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [activePatient, setActivePatient] = useState<PatientDetails | undefined>(undefined);
  
  // Tour State
  const [isTourActive, setIsTourActive] = useState(true);
  const [tourStepIndex, setTourStepIndex] = useState(0);

  // Load tour state from local storage on mount
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('scribe_tour_completed');
    if (hasSeenTour) {
      setIsTourActive(false);
    }
  }, []);

  // --- Auto-Advance Logic based on App State ---
  useEffect(() => {
    if (!isTourActive) return;

    // Step 0 -> 1: User clicks "Start Consult" (handled by Modal Open)
    if (tourStepIndex === 0 && isPatientModalOpen) {
      setTourStepIndex(1);
    }
    
    // Step 2 -> 3: User clicks "Start Recording" (handled by View Change)
    if (tourStepIndex === 2 && currentView === 'consultation') {
      setTourStepIndex(3);
    }

  }, [isPatientModalOpen, currentView, tourStepIndex, isTourActive]);

  const handleStartConsultClick = () => {
    setIsPatientModalOpen(true);
  };

  const handlePatientDetailsProceed = (details: PatientDetails) => {
    setActivePatient(details);
    setIsPatientModalOpen(false);
    setCurrentView('consultation');
  };

  const handleNavigation = (view: ViewType) => {
    if (view === 'consultation') {
        handleStartConsultClick();
    } else {
        setCurrentView(view);
    }
  };

  // Tour Callbacks
  const handleTourNext = () => {
    if (tourStepIndex < TOUR_STEPS.length - 1) {
      setTourStepIndex(prev => prev + 1);
    } else {
      setIsTourActive(false);
      localStorage.setItem('scribe_tour_completed', 'true');
    }
  };

  const handleTourSkip = () => {
    setIsTourActive(false);
    localStorage.setItem('scribe_tour_completed', 'true');
  };
  
  const handleRestartTour = () => {
    setIsTourActive(true);
    setTourStepIndex(0);
    setCurrentView('dashboard');
    setIsPatientModalOpen(false);
    // We intentionally don't clear localStorage here so it remembers they've technically "seen" it before if they reload, 
    // but we force active state now.
  };

  // Callback exposed to ConsultationView to advance tour when specific actions happen
  const handleConsultAction = (action: 'demo_loaded' | 'soap_generated') => {
    if (!isTourActive) return;
    
    if (action === 'demo_loaded' && tourStepIndex === 3) {
       setTimeout(() => setTourStepIndex(4), 500); // Small delay for UX
    }
    if (action === 'soap_generated' && tourStepIndex === 4) {
       setTimeout(() => setTourStepIndex(5), 1000); // Delay to allow AI generation animation to start
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onStartRecording={handleStartConsultClick} />;
      case 'consultation':
        return <ConsultationView patientDetails={activePatient} onTourAction={handleConsultAction} />;
      case 'notes':
        return <NotesView />;
      case 'templates':
        return <TemplatesView />;
      case 'support':
        return <SupportView />;
      case 'custom-note':
        return <CustomNoteView />;
      default:
        return <Dashboard onStartRecording={handleStartConsultClick} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans relative">
      <Sidebar 
        currentView={currentView} 
        onNavigate={handleNavigation}
        onRestartTour={handleRestartTour} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {renderView()}
      </div>

      <PatientDetailsModal 
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onProceed={handlePatientDetailsProceed}
      />

      <TourOverlay 
        steps={TOUR_STEPS}
        currentStepIndex={tourStepIndex}
        onNext={handleTourNext}
        onSkip={handleTourSkip}
        isVisible={isTourActive}
      />
    </div>
  );
}

export default App;