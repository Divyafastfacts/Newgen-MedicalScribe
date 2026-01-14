import React from 'react';
import { SoapNote } from '../types.ts';

interface SoapPanelProps {
  soapData: SoapNote;
  setSoapData: (data: SoapNote) => void;
  isGenerating: boolean;
  isVerified: boolean;
  signature: string | null;
}

export const SoapPanel: React.FC<SoapPanelProps> = ({ soapData, setSoapData, isGenerating, isVerified, signature }) => {
  
  const handleChange = (field: keyof SoapNote, value: string) => {
    setSoapData({ ...soapData, [field]: value });
  };

  const sections: { 
    key: keyof SoapNote; 
    label: string; 
    accentColor: string; 
    textColor: string; 
    placeholder: string;
    readOnly: boolean;
    badge: string;
  }[] = [
    { 
      key: 'subjective', 
      label: 'Subjective', 
      accentColor: 'bg-blue-600', 
      textColor: 'text-blue-800', 
      placeholder: 'Waiting for AI generation...', 
      readOnly: true,
      badge: 'AI Generated (Read Only)'
    },
    { 
      key: 'objective', 
      label: 'Objective', 
      accentColor: 'bg-red-600', 
      textColor: 'text-red-800', 
      placeholder: 'Waiting for AI generation...', 
      readOnly: true,
      badge: 'AI Generated (Read Only)'
    },
    { 
      key: 'assessment', 
      label: 'Assessment', 
      accentColor: 'bg-amber-600', 
      textColor: 'text-amber-800', 
      placeholder: 'Type diagnosis here...', 
      readOnly: false,
      badge: 'Doctor Input Required'
    },
    { 
      key: 'plan', 
      label: 'Plan', 
      accentColor: 'bg-green-600', 
      textColor: 'text-green-800', 
      placeholder: 'Type treatment plan here...', 
      readOnly: false,
      badge: 'Doctor Input Required'
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 relative bg-white h-full">
         {isGenerating && (
             <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-fade-in">
                 <div className="w-16 h-16 relative mb-4">
                     <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                     <div className="absolute inset-0 rounded-full border-4 border-bbh-red border-t-transparent animate-spin"></div>
                 </div>
                 <h3 className="text-xl font-bold text-gray-800">Analyzing Transcript</h3>
                 <p className="text-gray-500">Extracting Subjective & Objective Data...</p>
             </div>
         )}

         {sections.map((section) => (
             <div key={section.key} className="group">
                 <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        {/* Vertical Accent Bar */}
                        <div className={`w-1.5 h-6 rounded-full ${section.accentColor}`}></div>
                        <h3 className={`text-sm font-bold uppercase tracking-wide ${section.textColor}`}>
                            {section.label}
                        </h3>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border flex items-center gap-1
                        ${section.readOnly 
                            ? 'bg-gray-50 text-gray-500 border-gray-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                        {section.readOnly ? (
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        ) : (
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        )}
                        {section.badge}
                    </span>
                 </div>
                 <textarea 
                     className={`w-full min-h-[120px] p-4 text-base leading-relaxed rounded-xl transition-colors resize-y
                         ${section.readOnly 
                            ? 'bg-gray-50 text-gray-700 border border-gray-200 focus:outline-none cursor-default' 
                            : 'bg-white text-gray-900 border border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10'
                         }
                         ${isVerified ? 'opacity-70 pointer-events-none' : ''}
                     `}
                     value={soapData[section.key]}
                     onChange={(e) => handleChange(section.key, e.target.value)}
                     placeholder={section.placeholder}
                     readOnly={section.readOnly || isVerified}
                 />
             </div>
         ))}

         {/* Digital Signature Block */}
         {isVerified && signature && (
             <div className="mt-8 border-t-2 border-dashed border-gray-200 pt-8 animate-fade-in">
                 <div className="flex justify-between items-end">
                     <div>
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Digitally Verified By</p>
                         <div className="font-serif text-2xl italic text-bbh-darkRed">
                             {signature.split(' | ')[0]}
                         </div>
                         <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                             <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             <span>Verified & Signed</span>
                             <span className="text-gray-300">|</span>
                             <span className="font-mono text-xs">{signature.split(' | ')[1]}</span>
                         </div>
                     </div>
                     <div className="w-24 h-24 opacity-10">
                         {/* Stamp Seal Simulation */}
                         <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="text-bbh-red rotate-[-12deg]">
                             <circle cx="50" cy="50" r="45" />
                             <path d="M50 88.5 C15 60 5 38 22 20 C32 10 46 12 50 22 C54 12 68 10 78 20 C95 38 85 60 50 88.5 Z" stroke="currentColor" fill="none"/>
                             <text x="50" y="65" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor">NDW</text>
                             <text x="50" y="75" textAnchor="middle" fontSize="8" fill="currentColor">OFFICIAL</text>
                         </svg>
                     </div>
                 </div>
             </div>
         )}
         
         {/* Bottom padding for scrolling past buttons */}
         <div className="h-24"></div>
    </div>
  );
};