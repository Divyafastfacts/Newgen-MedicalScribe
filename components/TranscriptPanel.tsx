import React, { useEffect, useRef } from 'react';

interface TranscriptPanelProps {
  transcript: string;
  interimTranscript?: string;
  setTranscript: (text: string) => void;
  isRecording: boolean;
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({ transcript, interimTranscript = '', setTranscript, isRecording }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when text updates
  useEffect(() => {
    if (isRecording && containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcript, interimTranscript, isRecording]);

  return (
    <div className="flex-1 flex flex-col relative h-full">
      <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
      
      {transcript.length === 0 && interimTranscript.length === 0 && !isRecording && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none p-8 text-center z-0">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </div>
              <p className="font-medium text-lg text-gray-500">Waiting for audio...</p>
              <p className="text-sm mt-1">Press "Start Recording" to begin the consultation.</p>
          </div>
      )}

      {/* 
         Dual Mode Display:
         1. Recording Mode: Div with rich styling (Interim text in gray/italic) to show live listening status.
         2. Editing Mode: Textarea for manual corrections when paused.
      */}
      {isRecording ? (
        <div 
            ref={containerRef}
            className="w-full h-full p-8 overflow-y-auto text-gray-800 leading-loose text-lg font-medium whitespace-pre-wrap font-sans transition-all"
        >
            {transcript}
            <span className="text-gray-500 font-normal transition-opacity duration-75">
                {interimTranscript && (transcript ? ' ' : '') + interimTranscript}
            </span>
            {/* Blinking Cursor Indicator */}
            <span className="inline-block w-0.5 h-5 ml-1 bg-bbh-red animate-pulse align-middle shadow-[0_0_8px_rgba(211,47,47,0.5)]"></span>
        </div>
      ) : (
        <textarea
            ref={textareaRef}
            className="w-full h-full p-8 resize-none focus:outline-none text-gray-800 leading-loose text-lg font-medium placeholder-transparent bg-transparent z-10 font-sans"
            placeholder="Transcript will appear here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            spellCheck={false}
        />
      )}
      
      {/* Bottom fade for scrolling */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
    </div>
  );
};