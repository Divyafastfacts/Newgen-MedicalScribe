import React, { useState } from 'react';
import { SoapNote } from '../types.ts';

export const CustomNoteView: React.FC = () => {
  // Patient Details State
  const [patient, setPatient] = useState({
    name: '',
    age: '',
    gender: 'Male',
    specialty: 'General Practice',
    noteType: 'SOAP Note - Standard'
  });

  // SOAP Note State
  const [soapData, setSoapData] = useState<SoapNote>({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });

  // Workflow State
  const [isVerified, setIsVerified] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);

  const specialties = [
    "General Practice", "Cardiology", "Pediatrics", "Orthopedics", "Dermatology", "Neurology"
  ];

  const noteTypes = [
    "SOAP Note - Standard", "SOAP Note - List", "SOAP Note - Narrative", "Comprehensive Note", "Psychiatry Note"
  ];

  const handlePatientChange = (field: string, value: string) => {
    setPatient(prev => ({ ...prev, [field]: value }));
  };

  const handleSoapChange = (field: keyof SoapNote, value: string) => {
    setSoapData(prev => ({ ...prev, [field]: value }));
  };

  const handleVerify = () => {
    if (!patient.name || !soapData.assessment || !soapData.plan) {
      alert("Please ensure Patient Name, Assessment, and Plan are filled out.");
      return;
    }
    const doctorName = "Dr. Smith, MD";
    const timestamp = new Date().toLocaleString();
    setSignature(`${doctorName} | Signed: ${timestamp}`);
    setIsVerified(true);
  };

  const handleUploadToEHR = () => {
    if (!isVerified) return;
    
    // Mock Payload
    const payload = {
        patient,
        soapData,
        signature,
        timestamp: new Date().toISOString()
    };
    
    console.log("Uploading Manual Note to EHR:", payload);
    alert(`Successfully uploaded manual record for ${patient.name} to Hospital EHR System.`);
  };

  const handleDownloadWord = () => {
    if (!isVerified) return;

    const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset="utf-8">
            <title>Manual SOAP Note - ${patient.name}</title>
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
                <p class="hospital">Manual Clinical Record</p>
            </div>

            <table class="meta-table">
                <tr>
                    <td class="label">Patient Name:</td>
                    <td>${patient.name}</td>
                    <td class="label">Date:</td>
                    <td>${new Date().toLocaleDateString()}</td>
                </tr>
                <tr>
                    <td class="label">Age/Gender:</td>
                    <td>${patient.age} / ${patient.gender}</td>
                    <td class="label">Specialty:</td>
                    <td>${patient.specialty}</td>
                </tr>
                 <tr>
                    <td class="label">Note Type:</td>
                    <td>${patient.noteType}</td>
                    <td class="label">Provider:</td>
                    <td>Dr. Smith</td>
                </tr>
            </table>

            <h2>Subjective</h2>
            <p>${soapData.subjective.replace(/\n/g, '<br/>') || 'N/A'}</p>

            <h2>Objective</h2>
            <p>${soapData.objective.replace(/\n/g, '<br/>') || 'N/A'}</p>

            <h2>Assessment</h2>
            <p>${soapData.assessment.replace(/\n/g, '<br/>') || 'N/A'}</p>

            <h2>Plan</h2>
            <p>${soapData.plan.replace(/\n/g, '<br/>') || 'N/A'}</p>

            <div class="signature-block">
                <p><strong>Electronically Verified & Signed By:</strong></p>
                <p style="font-family: 'Times New Roman', serif; font-size: 14pt; font-style: italic; color: #D32F2F;">
                    ${signature?.split(' | ')[0] || 'Dr. Smith'}
                </p>
                <p style="font-size: 9pt; color: #666;">${signature?.split(' | ')[1] || new Date().toLocaleString()}</p>
                <div class="sign-line"></div>
                <p style="font-size: 8pt; color: #888;">This document is a manually created record in the Scribe system.</p>
            </div>
        </body>
        </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Manual_SOAP_${patient.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.doc`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="flex-1 bg-gray-50 h-full overflow-y-auto p-8 md:p-12 font-sans animate-fade-in">
      <div className="max-w-5xl mx-auto h-full flex flex-col">
        
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manual Note Entry</h1>
            <p className="text-gray-500 mt-1">Create a clinical record without AI assistance.</p>
        </div>

        {/* Patient Details Section */}
        <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 mb-8">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Patient Demographics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Patient Name</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Rahul Gupta"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-bbh-red focus:ring-4 focus:ring-bbh-red/10 outline-none transition-all font-bold text-gray-900"
                        value={patient.name}
                        onChange={(e) => handlePatientChange('name', e.target.value)}
                        disabled={isVerified}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Age</label>
                        <input 
                            type="text" 
                            placeholder="Yrs"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-bbh-red focus:ring-4 focus:ring-bbh-red/10 outline-none transition-all"
                            value={patient.age}
                            onChange={(e) => handlePatientChange('age', e.target.value)}
                            disabled={isVerified}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Gender</label>
                        <select 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-bbh-red focus:ring-4 focus:ring-bbh-red/10 outline-none appearance-none"
                            value={patient.gender}
                            onChange={(e) => handlePatientChange('gender', e.target.value)}
                            disabled={isVerified}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Medical Specialty</label>
                     <div className="relative">
                        <select 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-bbh-red focus:ring-4 focus:ring-bbh-red/10 outline-none appearance-none font-medium text-gray-700"
                            value={patient.specialty}
                            onChange={(e) => handlePatientChange('specialty', e.target.value)}
                            disabled={isVerified}
                        >
                            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                     </div>
                </div>
                <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Note Type</label>
                     <div className="relative">
                        <select 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-bbh-red focus:ring-4 focus:ring-bbh-red/10 outline-none appearance-none font-medium text-gray-700"
                            value={patient.noteType}
                            onChange={(e) => handlePatientChange('noteType', e.target.value)}
                            disabled={isVerified}
                        >
                            {noteTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                         <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                     </div>
                </div>
            </div>
        </div>

        {/* SOAP Editor Section */}
        <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 flex-1 flex flex-col gap-8">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Clinical Documentation</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Subjective */}
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-6 rounded-full bg-blue-600"></div>
                        <h3 className="text-sm font-bold uppercase tracking-wide text-blue-800">Subjective</h3>
                    </div>
                    <textarea 
                        className="w-full h-40 p-4 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none text-gray-800 leading-relaxed disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Patient history, symptoms, complaints..."
                        value={soapData.subjective}
                        onChange={(e) => handleSoapChange('subjective', e.target.value)}
                        disabled={isVerified}
                    />
                </div>

                {/* Objective */}
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-6 rounded-full bg-red-600"></div>
                        <h3 className="text-sm font-bold uppercase tracking-wide text-red-800">Objective</h3>
                    </div>
                    <textarea 
                        className="w-full h-40 p-4 bg-white border border-gray-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all resize-none text-gray-800 leading-relaxed disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Vitals, physical exam findings..."
                        value={soapData.objective}
                        onChange={(e) => handleSoapChange('objective', e.target.value)}
                        disabled={isVerified}
                    />
                </div>

                {/* Assessment */}
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-6 rounded-full bg-amber-600"></div>
                        <h3 className="text-sm font-bold uppercase tracking-wide text-amber-800">Assessment</h3>
                    </div>
                    <textarea 
                        className="w-full h-32 p-4 bg-white border border-gray-300 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all resize-none text-gray-800 font-medium disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Diagnosis and differential diagnosis..."
                        value={soapData.assessment}
                        onChange={(e) => handleSoapChange('assessment', e.target.value)}
                        disabled={isVerified}
                    />
                </div>

                {/* Plan */}
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-6 rounded-full bg-green-600"></div>
                        <h3 className="text-sm font-bold uppercase tracking-wide text-green-800">Plan</h3>
                    </div>
                    <textarea 
                        className="w-full h-32 p-4 bg-white border border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all resize-none text-gray-800 font-medium disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Treatment, prescriptions, follow-up..."
                        value={soapData.plan}
                        onChange={(e) => handleSoapChange('plan', e.target.value)}
                        disabled={isVerified}
                    />
                </div>
            </div>
            
            {/* Signature Display */}
            {isVerified && signature && (
                 <div className="border-t border-dashed border-gray-200 pt-6 mt-4 animate-fade-in">
                     <div className="flex justify-between items-end">
                         <div>
                             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Digitally Verified By</p>
                             <div className="font-serif text-2xl italic text-bbh-darkRed">
                                 {signature.split(' | ')[0]}
                             </div>
                             <div className="text-xs text-gray-400 mt-1 font-mono">{signature.split(' | ')[1]}</div>
                         </div>
                         <div className="text-green-600 font-bold flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             VERIFIED RECORD
                         </div>
                     </div>
                 </div>
            )}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 pb-10">
             <button
                onClick={handleVerify}
                disabled={isVerified}
                className={`py-4 px-6 rounded-2xl font-bold shadow-sm transition-all flex items-center justify-center gap-2 border
                    ${isVerified 
                        ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' 
                        : 'bg-white hover:bg-green-50 hover:text-green-700 hover:border-green-200 text-gray-700 border-gray-200'
                    }`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {isVerified ? 'Note Verified' : 'Verify & Sign'}
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

      </div>
    </div>
  );
};
