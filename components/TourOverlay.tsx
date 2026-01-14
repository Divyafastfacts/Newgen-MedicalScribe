import React, { useEffect, useState, useRef } from 'react';

export interface TourStep {
  id: string;
  targetId: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  actionRequired?: boolean; // If true, user must click the element to proceed
}

interface TourOverlayProps {
  steps: TourStep[];
  currentStepIndex: number;
  onNext: () => void;
  onSkip: () => void;
  isVisible: boolean;
}

export const TourOverlay: React.FC<TourOverlayProps> = ({ 
  steps, 
  currentStepIndex, 
  onNext, 
  onSkip, 
  isVisible 
}) => {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const step = steps[currentStepIndex];

  useEffect(() => {
    if (!isVisible || !step) return;

    const updatePosition = () => {
      const element = document.getElementById(step.targetId);
      if (element) {
        // Scroll element into view if needed
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTargetRect(element.getBoundingClientRect());
      }
    };

    // Initial update
    setTimeout(updatePosition, 500); // Small delay to allow UI transitions

    // Update on resize
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [step, isVisible, currentStepIndex]);

  if (!isVisible || !step || !targetRect) return null;

  // Calculate tooltip position
  const getTooltipStyle = () => {
    const gap = 20;
    const tooltipWidth = 320; 
    
    let top = 0;
    let left = 0;

    switch (step.position) {
      case 'right':
        top = targetRect.top + (targetRect.height / 2) - 100;
        left = targetRect.right + gap;
        break;
      case 'left':
        top = targetRect.top + (targetRect.height / 2) - 100;
        left = targetRect.left - tooltipWidth - gap;
        break;
      case 'bottom':
        top = targetRect.bottom + gap;
        left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        break;
      case 'top':
        top = targetRect.top - 200 - gap; // Approx height
        left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        break;
      case 'center':
        top = window.innerHeight / 2 - 100;
        left = window.innerWidth / 2 - 160;
        break;
    }

    // Boundary checks to keep inside viewport
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth) left = window.innerWidth - tooltipWidth - 10;

    return { top, left };
  };

  const tooltipPos = getTooltipStyle();

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Dark Overlay with cutout */}
      <div className="absolute inset-0 bg-gray-900/60 transition-opacity duration-500">
        {/* We use clip-path to "cut out" the target element */}
        <div 
           className="absolute bg-transparent border-4 border-bbh-red shadow-[0_0_30px_rgba(211,47,47,0.5)] transition-all duration-500 ease-in-out rounded-xl animate-pulse"
           style={{
             top: targetRect.top - 4,
             left: targetRect.left - 4,
             width: targetRect.width + 8,
             height: targetRect.height + 8,
           }}
        />
      </div>

      {/* Tooltip Card */}
      <div 
        className="absolute pointer-events-auto bg-white rounded-2xl shadow-2xl p-6 w-[320px] transition-all duration-500 ease-out border border-gray-100 flex flex-col gap-3"
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
        }}
      >
        <div className="flex justify-between items-start">
           <div className="flex items-center gap-2 mb-1">
             <span className="bg-bbh-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
               Step {currentStepIndex + 1} of {steps.length}
             </span>
           </div>
           <button onClick={onSkip} className="text-gray-400 hover:text-gray-600 text-xs font-bold uppercase tracking-wide">
             Skip Tour
           </button>
        </div>

        <h3 className="text-xl font-bold text-gray-900 leading-tight">
          {step.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {step.content}
        </p>

        <div className="mt-2 flex justify-end gap-2">
          {!step.actionRequired ? (
            <button 
              onClick={onNext}
              className="bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg transition-transform active:scale-95"
            >
              Next
            </button>
          ) : (
             <div className="text-xs text-bbh-red font-bold animate-pulse flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                {step.content.includes('Click') ? 'Interact with element to continue' : 'Action Required'}
             </div>
          )}
        </div>
        
        {/* Arrow pointer */}
        <div className="absolute w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100" 
             style={{
                display: step.position === 'center' ? 'none' : 'block',
                ...(step.position === 'right' ? { left: -8, top: '50%', marginTop: -8, borderRight: 'none', borderTop: 'none', borderBottom: '1px solid #f3f4f6', borderLeft: '1px solid #f3f4f6' } : {}),
                ...(step.position === 'left' ? { right: -8, top: '50%', marginTop: -8, borderLeft: 'none', borderBottom: 'none', borderRight: '1px solid #f3f4f6', borderTop: '1px solid #f3f4f6' } : {}),
                ...(step.position === 'bottom' ? { top: -8, left: '50%', marginLeft: -8 } : {}),
                ...(step.position === 'top' ? { bottom: -8, left: '50%', marginLeft: -8, borderLeft: 'none', borderTop: 'none', borderRight: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' } : {}),
             }}
        />
      </div>
    </div>
  );
};