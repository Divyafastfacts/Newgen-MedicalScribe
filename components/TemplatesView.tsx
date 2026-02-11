import React, { useState, useEffect, useRef } from 'react';

interface Template {
  id: string;
  title: string;
  category: string;
  text: string;
  isCustom?: boolean;
}

const DEFAULT_TEMPLATES: Template[] = [
  { id: 'def-1', title: "Normal Physical Exam", category: "General", text: "Patient is alert and oriented x3. No acute distress. Heart: RRR, no murmurs. Lungs: CTA bilaterally. Abdomen: Soft, non-tender, non-distended." },
  { id: 'def-2', title: "Viral URI Plan", category: "Pediatrics", text: "1. Supportive care with fluids and rest.\n2. Acetaminophen 15mg/kg every 4-6 hours prn fever.\n3. Return if difficulty breathing or high fever persists > 3 days." },
  { id: 'def-3', title: "Type 2 Diabetes Follow-up", category: "Chronic Care", text: "Review of systems negative for chest pain, SOB, vision changes, or numbness in feet. Med compliance reported as good. Diet: Struggling with carbohydrate restriction." },
  { id: 'def-4', title: "Normal Psych Status", category: "Psychiatry", text: "Appearance: Well-groomed. Behavior: Cooperative. Speech: Normal rate/tone. Mood: 'Okay'. Affect: Congruent. Thought Process: Linear. Suicidal Ideation: Denied." },
  { id: 'def-5', title: "Suture Removal", category: "Procedures", text: "Wound inspected: Clean, dry, intact. No signs of erythema or purulence. Sutures removed. Steri-strips applied. Wound care instructions given." },
  { id: 'def-6', title: "Hypertension Plan", category: "Cardiology", text: "1. Continue Amlodipine 5mg daily.\n2. Check BP daily at home.\n3. Low salt diet (DASH diet).\n4. Follow up in 1 month with BP log." },
];

export const TemplatesView: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Load templates on mount
  useEffect(() => {
    const saved = localStorage.getItem('scribe_personalized_templates_v2');
    if (saved) {
      try {
        setTemplates(JSON.parse(saved));
      } catch (e) {
        setTemplates(DEFAULT_TEMPLATES);
      }
    } else {
      setTemplates(DEFAULT_TEMPLATES);
    }
  }, []);

  // Persistence effect
  useEffect(() => {
    if (templates.length > 0) {
      setIsSaving(true);
      localStorage.setItem('scribe_personalized_templates_v2', JSON.stringify(templates));
      const timer = setTimeout(() => setIsSaving(false), 800);
      return () => clearTimeout(timer);
    }
  }, [templates]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      setTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleUpdateField = (id: string, field: keyof Template, value: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const handleAddNew = () => {
    const newId = `custom-${Date.now()}`;
    const newTemp: Template = {
      id: newId,
      title: "",
      category: "New Category",
      text: "",
      isCustom: true
    };
    setTemplates([newTemp, ...templates]);
    
    // Auto-focus the new title after render
    setTimeout(() => {
        firstInputRef.current?.focus();
    }, 100);
  };

  const handleResetDefaults = () => {
      if (window.confirm("This will clear all custom templates and reset to factory defaults. Proceed?")) {
          setTemplates(DEFAULT_TEMPLATES);
      }
  };

  return (
    <div className="flex-1 bg-gray-50 h-full overflow-y-auto p-8 md:p-12 font-sans animate-fade-in relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Clinical Template Builder</h1>
                <p className="text-gray-500 mt-1">Create, edit, and organize your personalized medical macros.</p>
            </div>
            <div className="flex items-center gap-4">
                {isSaving && (
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Autosaving...
                    </div>
                )}
                <button 
                    onClick={handleResetDefaults}
                    className="text-xs font-bold text-gray-400 hover:text-bbh-red transition-colors uppercase tracking-widest"
                >
                    Reset Defaults
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {/* Create New Template Card */}
            <button 
                onClick={handleAddNew}
                className="border-2 border-dashed border-gray-300 rounded-3xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-bbh-red hover:text-bbh-red hover:bg-red-50/30 transition-all cursor-pointer h-[340px] group order-first"
            >
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-red-50 transition-colors">
                    <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                </div>
                <span className="font-bold text-lg">Create New Template</span>
                <p className="text-xs mt-2 text-center px-4">Macro will be added instantly to your library.</p>
            </button>

            {templates.map((t, idx) => (
                <div key={t.id} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-soft hover:shadow-lg transition-all flex flex-col h-[340px] group animate-fade-in">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 mr-2">
                            <input 
                                type="text"
                                value={t.category}
                                onChange={(e) => handleUpdateField(t.id, 'category', e.target.value)}
                                className={`text-[10px] uppercase font-extrabold px-2 py-1 rounded border outline-none transition-all w-full ${
                                    t.isCustom 
                                    ? 'bg-blue-50 text-blue-700 border-blue-100 focus:border-blue-300' 
                                    : 'bg-red-50 text-bbh-red border-red-100 focus:border-red-300'
                                }`}
                                placeholder="CATEGORY"
                            />
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => handleDelete(t.id)}
                                className="text-gray-300 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                                title="Delete Template"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                            <button 
                                onClick={() => handleCopy(t.text, t.id)}
                                className="text-gray-300 hover:text-bbh-red transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                                title="Copy to Clipboard"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                            </button>
                        </div>
                    </div>
                    
                    <input 
                        ref={idx === 0 && t.isCustom ? firstInputRef : null}
                        type="text"
                        value={t.title}
                        onChange={(e) => handleUpdateField(t.id, 'title', e.target.value)}
                        placeholder="Template Title..."
                        className="text-lg font-bold text-gray-900 mb-3 w-full bg-transparent border-b border-transparent focus:border-gray-200 focus:bg-gray-50 rounded-t-lg px-1 outline-none transition-all placeholder:text-gray-300"
                    />

                    <textarea 
                        className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm text-gray-600 font-medium mb-4 flex-1 resize-none focus:outline-none focus:border-bbh-red focus:ring-4 focus:ring-red-500/5 focus:bg-white transition-all leading-relaxed placeholder:italic placeholder:text-gray-300"
                        value={t.text}
                        placeholder="Type your medical macro content here..."
                        onChange={(e) => handleUpdateField(t.id, 'text', e.target.value)}
                    />

                    <button 
                        onClick={() => handleCopy(t.text, t.id)}
                        className={`w-full py-3 rounded-2xl border font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                            copyStatus === t.id 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900 active:scale-95'
                        }`}
                    >
                        {copyStatus === t.id ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                Ready to Use!
                            </>
                        ) : (
                            'Copy Treatment Template'
                        )}
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};