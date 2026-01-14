import React, { useState } from 'react';

export const TemplatesView: React.FC = () => {
  const [templates, setTemplates] = useState([
    { title: "Normal Physical Exam", category: "General", text: "Patient is alert and oriented x3. No acute distress. Heart: RRR, no murmurs. Lungs: CTA bilaterally. Abdomen: Soft, non-tender, non-distended." },
    { title: "Viral URI Plan", category: "Pediatrics", text: "1. Supportive care with fluids and rest.\n2. Acetaminophen 15mg/kg every 4-6 hours prn fever.\n3. Return if difficulty breathing or high fever persists > 3 days." },
    { title: "Type 2 Diabetes Follow-up", category: "Chronic Care", text: "Review of systems negative for chest pain, SOB, vision changes, or numbness in feet. Med compliance reported as good. Diet: Struggling with carbohydrate restriction." },
    { title: "Normal Psych Status", category: "Psychiatry", text: "Appearance: Well-groomed. Behavior: Cooperative. Speech: Normal rate/tone. Mood: 'Okay'. Affect: Congruent. Thought Process: Linear. Suicidal Ideation: Denied." },
    { title: "Suture Removal", category: "Procedures", text: "Wound inspected: Clean, dry, intact. No signs of erythema or purulence. Sutures removed. Steri-strips applied. Wound care instructions given." },
    { title: "Hypertension Plan", category: "Cardiology", text: "1. Continue Amlodipine 5mg daily.\n2. Check BP daily at home.\n3. Low salt diet (DASH diet).\n4. Follow up in 1 month with BP log." },
  ]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Template copied to clipboard!");
  };

  const handleUpdateTemplate = (index: number, newText: string) => {
      const updated = [...templates];
      updated[index].text = newText;
      setTemplates(updated);
  };

  return (
    <div className="flex-1 bg-gray-50 h-full overflow-y-auto p-8 md:p-12 font-sans animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Ministry of Health & Family Welfare's Template</h1>
            <p className="text-gray-500 mt-1">Standardized phrases and macros to speed up your documentation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((t, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-[320px]">
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-red-50 text-bbh-red text-[10px] uppercase font-bold px-2 py-1 rounded border border-red-100">{t.category}</span>
                        <button 
                            onClick={() => handleCopy(t.text)}
                            className="text-gray-400 hover:text-bbh-red transition-colors"
                            title="Copy to Clipboard"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                        </button>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{t.title}</h3>
                    <textarea 
                        className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm text-gray-600 font-mono mb-4 flex-1 resize-none focus:outline-none focus:border-bbh-red focus:ring-1 focus:ring-bbh-red focus:bg-white transition-all"
                        value={t.text}
                        onChange={(e) => handleUpdateTemplate(idx, e.target.value)}
                    />
                    <button 
                        onClick={() => handleCopy(t.text)}
                        className="w-full py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        Use Template
                    </button>
                </div>
            ))}
            
            {/* Add New Template Card */}
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-bbh-red hover:text-bbh-red hover:bg-red-50/30 transition-all cursor-pointer min-h-[320px]">
                <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                <span className="font-bold">Create New Template</span>
            </div>
        </div>
      </div>
    </div>
  );
};