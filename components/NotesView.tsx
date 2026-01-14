import React, { useState } from 'react';

// Define the structure for our mock data including details
interface NoteRecord {
  id: number;
  patient: string;
  date: string;
  diagnosis: string;
  type: string;
  status: string;
  details: {
    age: string;
    gender: string;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
}

export const NotesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<NoteRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Expanded Mock Data
  const notes: NoteRecord[] = [
    { 
      id: 1, 
      patient: "Anjali Sharma", 
      date: "Jan 24, 2024", 
      diagnosis: "Viral Fever", 
      type: "SOAP", 
      status: "Synced",
      details: {
        age: "24",
        gender: "Female",
        subjective: "Patient reports sudden onset of fever (102°F) starting yesterday evening. Associated with severe body aches, chills, and headache. Denies cough, cold, or loose stools.",
        objective: "Vitals: Temp 101.4°F, BP 110/70 mmHg, HR 92 bpm. General: Febrile, hydrated. ENT: Mild pharyngeal congestion. Lungs: Clear to auscultation.",
        assessment: "Acute Viral Pyrexia.",
        plan: "1. Tab. Paracetamol 650mg TDS for 3 days.\n2. Hydration with ORS/Fluids.\n3. Bed rest.\n4. Review if fever persists > 3 days or warning signs appear."
      }
    },
    { 
      id: 2, 
      patient: "Rahul Verma", 
      date: "Jan 24, 2024", 
      diagnosis: "Hypertension", 
      type: "Comprehensive", 
      status: "Draft",
      details: {
        age: "54",
        gender: "Male",
        subjective: "Follow-up for hypertension. Patient reports occasional headaches in the occipital region. Adherent to medication (Amlodipine 5mg). Home BP readings average 140/90.",
        objective: "BP: 150/94 mmHg (Right arm, sitting). HR: 78 bpm. CVS: S1 S2 heard, no murmurs. Edema: Absent.",
        assessment: "Uncontrolled Essential Hypertension.",
        plan: "1. Increase Tab. Amlodipine to 10mg OD.\n2. Salt restriction (<5g/day).\n3. Daily 30 min brisk walk.\n4. Review in 2 weeks with BP log."
      }
    },
    { 
      id: 3, 
      patient: "Lakshmi Narayanan", 
      date: "Jan 23, 2024", 
      diagnosis: "Type 2 Diabetes", 
      type: "Follow-up", 
      status: "Synced",
       details: {
        age: "62",
        gender: "Female",
        subjective: "Diabetic review. Complaints of tingling sensation in toes at night. Fasting blood sugar checked today morning was 160 mg/dL.",
        objective: "Vitals stable. BMI: 28. Foot Exam: Reduced sensation to monofilament in bilateral big toes. Dorsalis pedis pulse palpable.",
        assessment: "Type 2 Diabetes Mellitus with Peripheral Neuropathy.",
        plan: "1. Continue Metformin 1000mg BD.\n2. Add Tab. Pregabalin 75mg HS for neuropathy.\n3. Diabetic foot care education given.\n4. HbA1c test next visit."
      }
    },
    { 
      id: 4, 
      patient: "Joseph Thomas", 
      date: "Jan 23, 2024", 
      diagnosis: "Acute Bronchitis", 
      type: "SOAP", 
      status: "Synced",
       details: {
        age: "45",
        gender: "Male",
        subjective: "Productive cough for 5 days. Sputum is yellowish. Mild wheezing reported at night. No fever currently. History of smoking.",
        objective: "Temp: 98.6°F, SpO2: 96% RA. Chest: Bilateral scattered rhonchi heard. No crepitations.",
        assessment: "Acute Bronchitis.",
        plan: "1. Cap. Amoxicillin 500mg TDS x 5 days.\n2. Syp. Ambroxol 5ml TDS.\n3. Steam inhalation BD.\n4. Smoking cessation counseling provided."
      }
    },
    { 
      id: 5, 
      patient: "Priya Krishna", 
      date: "Jan 22, 2024", 
      diagnosis: "Migraine", 
      type: "SOAP", 
      status: "Synced",
       details: {
        age: "29",
        gender: "Female",
        subjective: "Unilateral pulsating headache on left side since morning. Photophobia and nausea present. Triggered by lack of sleep.",
        objective: "Neuro exam normal. PERRLA. No focal deficits. BP 120/80.",
        assessment: "Migraine without aura.",
        plan: "1. Tab. Naproxen 500mg SOS.\n2. Tab. Domperidone 10mg SOS for nausea.\n3. Sleep hygiene advice.\n4. Maintain headache diary."
      }
    },
    { 
      id: 6, 
      patient: "Amit Patel", 
      date: "Jan 21, 2024", 
      diagnosis: "Gastroenteritis", 
      type: "Emergency", 
      status: "Flagged",
       details: {
        age: "33",
        gender: "Male",
        subjective: "Multiple episodes of loose stools and vomiting since last night after eating outside food. Abdominal cramping present. Feeling dizzy.",
        objective: "HR: 104 bpm (Tachycardia), BP: 100/60 mmHg. Mucosa dry. Abdomen: Soft, diffuse tenderness, hyperactive bowel sounds.",
        assessment: "Acute Gastroenteritis with moderate dehydration.",
        plan: "1. IV Fluids RL 500ml stat.\n2. Inj. Ondansetron 4mg IV.\n3. Tab. Ofloxacin-Ornidazole BD x 5 days.\n4. Oral rehydration."
      }
    },
  ];

  const filteredNotes = notes.filter(note => 
    note.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDetailChange = (field: keyof NoteRecord['details'], value: string) => {
    if (!selectedNote) return;
    setSelectedNote({
        ...selectedNote,
        details: {
            ...selectedNote.details,
            [field]: value
        }
    });
  };

  const handleDownloadWord = () => {
    if (!selectedNote) return;
    const { patient, date, details } = selectedNote;

    const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset="utf-8">
            <title>SOAP Note - ${patient}</title>
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
                    <td>${patient}</td>
                    <td class="label">Date:</td>
                    <td>${date}</td>
                </tr>
                <tr>
                    <td class="label">Age/Gender:</td>
                    <td>${details.age} / ${details.gender}</td>
                    <td class="label">Generated By:</td>
                    <td>AI Scribe</td>
                </tr>
            </table>

            <h2>Subjective</h2>
            <p>${details.subjective.replace(/\n/g, '<br/>')}</p>

            <h2>Objective</h2>
            <p>${details.objective.replace(/\n/g, '<br/>')}</p>

            <h2>Assessment</h2>
            <p>${details.assessment.replace(/\n/g, '<br/>')}</p>

            <h2>Plan</h2>
            <p>${details.plan.replace(/\n/g, '<br/>')}</p>

            <div class="signature-block">
                <p><strong>Electronically Verified & Signed By:</strong></p>
                <p style="font-family: 'Times New Roman', serif; font-size: 14pt; font-style: italic; color: #D32F2F;">
                    Dr. Smith
                </p>
                <p style="font-size: 9pt; color: #666;">Signed: ${new Date().toLocaleString()}</p>
                <div class="sign-line"></div>
                <p style="font-size: 8pt; color: #888;">This document is a digital record generated by the Scribe system.</p>
            </div>
        </body>
        </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SOAP_${patient.replace(/\s+/g, '_')}_${date}.doc`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }, 100);
  };

  if (selectedNote) {
    // Detail View
    return (
        <div className="flex-1 bg-gray-50 h-full overflow-y-auto p-8 md:p-12 font-sans animate-fade-in">
            <div className="max-w-5xl mx-auto">
                {/* Back Navigation */}
                <button 
                    onClick={() => { setSelectedNote(null); setIsEditing(false); }}
                    className="flex items-center gap-2 text-gray-500 hover:text-bbh-red transition-colors mb-6 font-medium group"
                >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Notes List
                </button>

                {/* Patient Header Card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">{selectedNote.patient}</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                   selectedNote.status === 'Synced' ? 'bg-green-50 text-green-700 border-green-100' : 
                                   selectedNote.status === 'Draft' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                   'bg-red-50 text-red-700 border-red-100'
                               }`}>
                                {selectedNote.status}
                            </span>
                        </div>
                        <p className="text-gray-500 flex gap-4 text-sm font-medium">
                            <span>{selectedNote.details.gender}, {selectedNote.details.age} Years</span>
                            <span className="w-px h-4 bg-gray-300"></span>
                            <span>{selectedNote.type}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Consultation Date</p>
                        <p className="text-xl font-semibold text-gray-900">{selectedNote.date}</p>
                    </div>
                </div>

                {/* SOAP Details Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Subjective */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
                        <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                            Subjective
                        </h3>
                        {isEditing ? (
                            <textarea 
                                className="w-full h-32 p-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-gray-900 leading-relaxed"
                                value={selectedNote.details.subjective}
                                onChange={(e) => handleDetailChange('subjective', e.target.value)}
                            />
                        ) : (
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedNote.details.subjective}</p>
                        )}
                    </div>

                    {/* Objective */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-l-4 border-l-red-500">
                        <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                            Objective
                        </h3>
                         {isEditing ? (
                            <textarea 
                                className="w-full h-32 p-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all text-gray-900 leading-relaxed"
                                value={selectedNote.details.objective}
                                onChange={(e) => handleDetailChange('objective', e.target.value)}
                            />
                        ) : (
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedNote.details.objective}</p>
                        )}
                    </div>

                    {/* Assessment */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-l-4 border-l-amber-500">
                        <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                            Assessment
                        </h3>
                         {isEditing ? (
                            <textarea 
                                className="w-full h-24 p-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all text-gray-900 font-semibold leading-relaxed"
                                value={selectedNote.details.assessment}
                                onChange={(e) => handleDetailChange('assessment', e.target.value)}
                            />
                        ) : (
                            <p className="text-gray-900 font-semibold text-lg leading-relaxed whitespace-pre-wrap">{selectedNote.details.assessment}</p>
                        )}
                    </div>

                    {/* Plan */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-l-4 border-l-green-500">
                        <h3 className="text-sm font-bold text-green-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                            Plan
                        </h3>
                         {isEditing ? (
                            <textarea 
                                className="w-full h-32 p-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all text-gray-900 font-medium leading-relaxed"
                                value={selectedNote.details.plan}
                                onChange={(e) => handleDetailChange('plan', e.target.value)}
                            />
                        ) : (
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">{selectedNote.details.plan}</p>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                     <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-6 py-2.5 rounded-xl border font-bold transition-all flex items-center gap-2 ${
                            isEditing 
                            ? 'bg-white text-gray-900 border-gray-900 hover:bg-gray-50' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                     >
                        {isEditing ? (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Save Changes
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                Edit Record
                            </>
                        )}
                     </button>
                     
                     <button 
                        onClick={handleDownloadWord}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2"
                     >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Download Word
                     </button>
                </div>
            </div>
        </div>
    );
  }

  // List View (Existing)
  return (
    <div className="flex-1 bg-gray-50 h-full overflow-y-auto p-8 md:p-12 font-sans animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Notes</h1>
                <p className="text-gray-500 mt-1">Manage and review your patient documentation history.</p>
            </div>
            <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex items-center w-64">
                <div className="pl-3 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input 
                    type="text" 
                    placeholder="Search patient or diagnosis..." 
                    className="w-full p-2 bg-transparent outline-none text-sm font-medium text-gray-700 placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
             <table className="w-full text-left border-collapse">
               <thead>
                   <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                       <th className="p-6">Patient Name</th>
                       <th className="p-6">Diagnosis</th>
                       <th className="p-6">Note Type</th>
                       <th className="p-6">Date</th>
                       <th className="p-6">Status</th>
                       <th className="p-6 text-right">Action</th>
                   </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                   {filteredNotes.map((note) => (
                       <tr key={note.id} className="hover:bg-gray-50/80 transition-colors group cursor-pointer" onClick={() => setSelectedNote(note)}>
                           <td className="p-6 font-bold text-gray-900">{note.patient}</td>
                           <td className="p-6 text-gray-600">{note.diagnosis}</td>
                           <td className="p-6">
                               <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">{note.type}</span>
                           </td>
                           <td className="p-6 text-gray-500 text-sm">{note.date}</td>
                           <td className="p-6">
                               <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                   note.status === 'Synced' ? 'bg-green-50 text-green-700 border-green-100' : 
                                   note.status === 'Draft' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                   'bg-red-50 text-red-700 border-red-100'
                               }`}>
                                   {note.status}
                               </span>
                           </td>
                           <td className="p-6 text-right">
                               <button 
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent row click double firing if needed, but row click handles it mostly
                                    setSelectedNote(note);
                                }}
                                className="text-bbh-red font-bold text-sm hover:underline"
                               >
                                View
                               </button>
                           </td>
                       </tr>
                   ))}
                   {filteredNotes.length === 0 && (
                       <tr>
                           <td colSpan={6} className="p-12 text-center text-gray-400">
                               No records found matching "{searchTerm}"
                           </td>
                       </tr>
                   )}
               </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};