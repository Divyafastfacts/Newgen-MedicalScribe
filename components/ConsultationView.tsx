import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './Header.tsx';
import { TranscriptPanel } from './TranscriptPanel.tsx';
import { SoapPanel } from './SoapPanel.tsx';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition.ts';
import { useTimer } from '../hooks/useTimer.ts';
import { generateSoapNote } from '../services/geminiService.ts';
import { INITIAL_SOAP_NOTE, LANGUAGES } from '../constants.ts';
import { Language, SoapNote, PatientDetails } from '../types.ts';

interface ConsultationViewProps {
    patientDetails?: PatientDetails;
    onTourAction?: (action: 'demo_loaded' | 'soap_generated') => void;
}

const DEMO_TRANSCRIPT = `Doctor: Come in, sit down. What seems to be the trouble today?
Patient: Doctor, I have had a bad stomach pain since last night. It is mostly around the belly button area.
Doctor: Okay. Did you eat anything from outside recently?
Patient: Yes, actually yesterday evening I had some street food... Pani Puri.
Doctor: Ah, I see. Any vomiting or loose motion?
Patient: I vomited twice early in the morning. No loose motion yet, but I feel very nauseous.
Doctor: Let me check your abdomen. Tell me if it hurts... Does it hurt here?
Patient: Ouch! Yes, it is very painful there.
Doctor: Okay, tenderness is present in the epigastric region. Let me check your vitals. Temperature is 99, slightly elevated. Pulse is 88.
Doctor: It looks like acute gastritis, likely due to food poisoning.
Doctor: I will prescribe an antacid syrup and an anti-emetic tablet for the vomiting.
Doctor: Please stick to a bland diet for now—curd rice, khichdi, or toast. Absolutely no spicy or oily food for the next 2 days.
Patient: Okay doctor. Thank you.`;

export const ConsultationView: React.FC<ConsultationViewProps> = ({ patientDetails, onTourAction }) => {
  // Use the language selected in patient details for the microphone, or default to English.
  // We no longer allow changing this mid-session to streamline the UI.
  const language = patientDetails?.inputLanguage || Language.ENGLISH;
  
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [soapData, setSoapData] = useState<SoapNote>(INITIAL_SOAP_NOTE);
  const [patientSummary, setPatientSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  // Verification State
  const [isVerified, setIsVerified] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);

  const handleSpeechResult = useCallback((text: string) => {
    setTranscript((prev) => {
        // Add a space if the previous text doesn't end with whitespace
        const spacer = (prev.length > 0 && !/\s$/.test(prev)) ? ' ' : '';
        return prev + spacer + text;
    });
    setInterimTranscript('');
  }, []);

  const handleInterimResult = useCallback((text: string) => {
    setInterimTranscript(text);
  }, []);

  const { isRecording, startRecording, stopRecording, error: speechError } = useSpeechRecognition({
    language: language,
    onResult: handleSpeechResult,
    onInterimResult: handleInterimResult,
  });

  const { time } = useTimer(isRecording);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleLoadDemo = () => {
      setTranscript(DEMO_TRANSCRIPT); 
      setInterimTranscript('');
      if (onTourAction) onTourAction('demo_loaded');
  };

  const handleGenerateSoap = async () => {
    // Combine finalized transcript with any pending interim text for the AI
    const fullTranscript = (transcript + (interimTranscript ? ' ' + interimTranscript : '')).trim();
    
    if (!fullTranscript) return;
    
    setIsGenerating(true);
    setGenerationError(null);
    setIsVerified(false);
    setSignature(null); // Reset signature if regenerated
    
    try {
      // AI automatically detects language from the transcript
      const response = await generateSoapNote(fullTranscript);
      setSoapData(response.soap_details);
      setPatientSummary(response.patient_summary);
      if (onTourAction) onTourAction('soap_generated');
    } catch (err: any) {
      setGenerationError(err.message || "Failed to generate SOAP note.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVerify = () => {
    if (!soapData.assessment.trim() || !soapData.plan.trim()) {
        alert("Please enter both Assessment and Plan before verifying.");
        return;
    }
    
    const doctorName = "Dr. Smith, MD";
    const timestamp = new Date().toLocaleString();
    const sig = `${doctorName} | Signed: ${timestamp}`;
    
    setSignature(sig);
    setIsVerified(true);
  };

  const handleUploadToEHR = () => {
    if (!isVerified) return;
    
    // Construct payload for EHR and JSON download
    const payload = {
        hospital: "Newgen Digitalworks Scribe",
        patient_summary: patientSummary || "Summary not generated.",
        soap_details: soapData, 
        signature: signature,
        raw_transcript_reference: transcript + (interimTranscript ? ' ' + interimTranscript : ''),
        metadata: {
            language_context: LANGUAGES.find(l => l.code === language)?.label || language,
            detection_mode: "AI-Auto-Detect",
            timestamp: new Date().toISOString(),
            patient_context: patientDetails || "Anonymous"
        }
    };
    
    console.log("Uploading to EHR:", payload);

    // Generate JSON download
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `EHR_SYNC_${patientDetails?.name?.replace(/\s+/g, '_') || 'record'}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    // Mock success feedback
    alert(`Successfully uploaded record for ${patientDetails?.name || 'Patient'} to Hospital EHR System and downloaded JSON backup.`);
  };

  const handleDownloadWord = () => {
    if (!isVerified) return;

    // Create a robust HTML template for Word
    const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset="utf-8">
            <title>SOAP Note - ${patientDetails?.name || 'Patient'}</title>
            <style>
                body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; color: #000000; }
                .header { border-bottom: 2px solid #D32F2F; padding-bottom: 10px; margin-bottom: 20px; }
                .title { font-size: 18pt; font-weight: bold; color: #D32F2F; margin: 0; }
                .hospital { font-size: 10pt; color: #666; margin: 0; }
                .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .meta-table td { padding: 5px 0; border-bottom: 1px solid #eee; }
                .label { font-weight: bold; color: #444; width: 150px; }
                h2 { font-size: 14pt; color: #2c3e50; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 20px; margin-bottom: 10px; }
                p { margin: 5px 0; }
                .signature-block { margin-top: 50px; page-break-inside: avoid; }
                .sign-line { border-top: 1px solid #000; width: 300px; margin-top: 40px; }
            </style>
        </head>
        <body>
            <div class="header">
                <p class="title">Newgen Digitalworks Scribe</p>
                <p class="hospital">Medical Scribe Generated Record</p>
            </div>

            <table class="meta-table">
                <tr>
                    <td class="label">Patient Name:</td>
                    <td>${patientDetails?.name || 'N/A'}</td>
                    <td class="label">Date:</td>
                    <td>${new Date().toLocaleDateString()}</td>
                </tr>
                <tr>
                    <td class="label">Age/Gender:</td>
                    <td>${patientDetails?.age || 'N/A'} / ${patientDetails?.gender || 'N/A'}</td>
                    <td class="label">Consult Time:</td>
                    <td>${new Date().toLocaleTimeString()}</td>
                </tr>
                <tr>
                    <td class="label">Specialty:</td>
                    <td>${patientDetails?.specialty || 'General'}</td>
                    <td class="label">Language:</td>
                    <td>${LANGUAGES.find(l => l.code === language)?.label || language}</td>
                </tr>
            </table>

            <h2>Subjective</h2>
            <p>${soapData.subjective ? soapData.subjective.replace(/\n/g, '<br/>') : '<em>No subjective data recorded.</em>'}</p>

            <h2>Objective</h2>
            <p>${soapData.objective ? soapData.objective.replace(/\n/g, '<br/>') : '<em>No objective data recorded.</em>'}</p>

            <h2>Assessment</h2>
            <p>${soapData.assessment ? soapData.assessment.replace(/\n/g, '<br/>') : '<em>No assessment recorded.</em>'}</p>

            <h2>Plan</h2>
            <p>${soapData.plan ? soapData.plan.replace(/\n/g, '<br/>') : '<em>No plan recorded.</em>'}</p>

            <div class="signature-block">
                <p><strong>Electronically Verified & Signed By:</strong></p>
                <p style="font-family: 'Times New Roman', serif; font-size: 14pt; font-style: italic; color: #D32F2F;">
                    ${signature?.split(' | ')[0] || 'Dr. Smith'}
                </p>
                <p style="font-size: 9pt; color: #666;">${signature?.split(' | ')[1] || new Date().toLocaleString()}</p>
                <div class="sign-line"></div>
                <p style="font-size: 8pt; color: #888;">This document is a digital record generated by the Scribe system.</p>
            </div>
        </body>
        </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
        type: 'application/msword'
    });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Scribe_SOAP_${patientDetails?.name?.replace(/\s+/g, '_') || 'Patient'}_${new Date().toISOString().slice(0,10)}.doc`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 text-gray-900 font-sans">
      <Header isRecording={isRecording} />

      {/* Patient Context Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between shadow-sm z-10">
         <div className="flex items-center gap-6">
             {patientDetails ? (
                <>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Patient</span>
                        <span className="font-bold text-gray-900 text-lg leading-tight">{patientDetails.name}</span>
                    </div>
                    <div className="h-8 w-px bg-gray-200"></div>
                    <div className="flex gap-6 text-sm">
                        <div>
                             <span className="block text-xs text-gray-400 font-medium">Age/Sex</span>
                             <span className="text-gray-700 font-semibold">{patientDetails.age} / {patientDetails.gender}</span>
                        </div>
                        <div>
                             <span className="block text-xs text-gray-400 font-medium">Specialty</span>
                             <span className="text-gray-700 font-semibold">{patientDetails.specialty}</span>
                        </div>
                        <div className="hidden md:block">
                             <span className="block text-xs text-gray-400 font-medium">Format</span>
                             <span className="text-bbh-red font-semibold bg-red-50 px-2 rounded">{patientDetails.noteType}</span>
                        </div>
                    </div>
                </>
             ) : (
                <span className="text-gray-500 font-medium">Anonymous Session</span>
             )}
         </div>

         {/* Active Timer Pill */}
         {isRecording ? (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 px-4 py-1.5 rounded-full animate-pulse-soft">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-bbh-red"></span>
                </span>
                <span className="font-mono font-bold text-bbh-red text-lg">{time}</span>
            </div>
         ) : (
            <div className="text-gray-400 text-sm font-medium">Ready to record</div>
         )}
      </div>

      <main className="flex-1 overflow-hidden p-6 gap-6 flex flex-col md:flex-row max-w-[1920px] mx-auto w-full">
        
        {/* Left Pane: Transcript */}
        <section className="flex-[4] min-w-0 h-full flex flex-col gap-4">
             {/* Toolbar */}
             <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                     {/* Removed Input Lang Selector as per request */}
                     <div className="px-3 py-1.5 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wide rounded-lg border border-gray-100">
                         AI Auto-Detect Enabled
                     </div>
                 </div>
                 
                 <div className="flex gap-2">
                    {/* Demo Button for Testing */}
                    <button
                        id="tour-load-demo"
                        onClick={handleLoadDemo}
                        disabled={isRecording || transcript.length > 0}
                        className="px-3 py-2 rounded-lg text-sm font-bold text-bbh-red bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-30 disabled:hover:bg-red-50"
                    >
                        Load Demo
                    </button>
                    
                    <button
                        onClick={() => { setTranscript(''); setInterimTranscript(''); }}
                        disabled={isRecording || (!transcript && !interimTranscript)}
                        className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30"
                    >
                        Clear Text
                    </button>
                 </div>
             </div>
             
             <div className="flex-1 min-h-0 bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden flex flex-col relative">
                <TranscriptPanel 
                    transcript={transcript} 
                    interimTranscript={interimTranscript}
                    setTranscript={setTranscript} 
                    isRecording={isRecording} 
                />
                
                {/* Floating Recording Button & Visualizer */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
                    
                    {/* Simple Audio Wave Visualizer - only visible when recording */}
                    <div className={`flex items-end gap-1 h-8 transition-opacity duration-300 ${isRecording ? 'opacity-100' : 'opacity-0'}`}>
                         {[...Array(5)].map((_, i) => (
                             <div 
                                key={i} 
                                className="w-1.5 bg-bbh-red rounded-full animate-pulse"
                                style={{ 
                                    height: '100%', 
                                    animationDuration: `${0.4 + i * 0.1}s`,
                                    animationDelay: `${i * 0.05}s`
                                }}
                             ></div>
                         ))}
                    </div>

                    <button
                        onClick={toggleRecording}
                        className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white shadow-xl transition-all transform hover:scale-105 active:scale-95
                            ${isRecording 
                                ? 'bg-gray-900 ring-4 ring-gray-200' 
                                : 'bg-bbh-red hover:bg-bbh-darkRed ring-4 ring-red-100'
                            }`}
                    >
                        {isRecording ? (
                            <>
                                <div className="w-4 h-4 bg-red-500 rounded-sm animate-pulse"></div>
                                Stop Recording
                            </>
                        ) : (
                            <>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                                Start Recording
                            </>
                        )}
                    </button>
                </div>
             </div>

             {(speechError || generationError) && (
                <div className="bg-red-50 text-red-800 p-4 rounded-xl text-sm border border-red-100 flex items-start gap-3 shadow-sm animate-fade-in">
                    <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                        <p className="font-bold">Error Detected</p>
                        <p>{speechError} {generationError}</p>
                    </div>
                </div>
             )}
        </section>

        {/* Right Pane: SOAP Editor */}
        <section className="flex-[3] min-w-0 h-full flex flex-col gap-4">
            <div className="flex items-center justify-between h-[42px]"> 
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Clinical Documentation
                </span>
                
                <div className="flex gap-2">
                    <button
                        id="tour-generate-soap"
                        onClick={handleGenerateSoap}
                        disabled={isGenerating || (!transcript && !interimTranscript) || isVerified}
                        className="bg-white text-bbh-red border border-gray-200 hover:border-bbh-red hover:bg-red-50 py-1.5 px-4 rounded-lg text-sm font-bold shadow-sm transition-all disabled:opacity-50 disabled:border-gray-100 disabled:text-gray-400 flex items-center gap-2"
                    >
                        {isGenerating && <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
                        Generate SOAP
                    </button>
                </div>
            </div>

            <div id="tour-assessment-plan" className="flex-1 min-h-0 bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden flex flex-col">
                <SoapPanel 
                    soapData={soapData} 
                    setSoapData={setSoapData} 
                    isGenerating={isGenerating}
                    isVerified={isVerified}
                    signature={signature}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                    onClick={handleVerify}
                    disabled={isVerified || !soapData.assessment || !soapData.plan}
                    className={`py-4 px-6 rounded-2xl font-bold shadow-sm transition-all flex items-center justify-center gap-2 border
                        ${isVerified 
                            ? 'bg-green-50 text-green-700 border-green-200 opacity-100 cursor-default' 
                            : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 disabled:opacity-50'
                        }`}
                >
                    {isVerified ? (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Verified
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Verify & Sign Note
                        </>
                    )}
                </button>

                <button
                    onClick={handleUploadToEHR}
                    disabled={!isVerified}
                    className="bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 py-4 px-6 rounded-2xl font-bold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-400"
                >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    Upload to EHR
                </button>

                <button
                    onClick={handleDownloadWord}
                    disabled={!isVerified}
                    className="bg-gray-900 text-white hover:bg-black py-4 px-6 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                >
                        <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Word
                </button>
            </div>
        </section>

      </main>
    </div>
  );
};