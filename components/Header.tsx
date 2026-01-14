import React from 'react';

interface HeaderProps {
  isRecording: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isRecording }) => {
  return (
    <header className="bg-bbh-red text-white p-4 shadow-md flex justify-between items-center z-10 relative">
      <div className="flex items-center gap-3">
        {/* Hospital Cross Icon Simulation */}
        <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4H14V10H20V14H14V20H10V14H4V10H10V4Z" fill="#D32F2F"/>
             </svg>
        </div>
        <div>
            <h1 className="text-xl font-bold tracking-wide">Newgen Digitalworks Scribe</h1>
            <p className="text-xs text-red-100 font-light tracking-wider uppercase">AI Medical Scribe Portal</p>
        </div>
      </div>
      
      {isRecording && (
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full animate-pulse border border-white/20">
          <div className="w-3 h-3 bg-red-400 rounded-full animate-ping absolute opacity-75"></div>
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full relative z-10"></div>
          <span className="text-sm font-medium tracking-wide">Live Recording</span>
        </div>
      )}
    </header>
  );
};