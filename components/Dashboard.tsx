import React from 'react';

interface DashboardProps {
  onStartRecording: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartRecording }) => {
  const stickyNotes = [
    { color: 'bg-yellow-50 border-yellow-100', text: "Remember to follow up with Dr. Kumar regarding the new cardio protocols.", date: "Today" },
    { color: 'bg-blue-50 border-blue-100', text: "Department meeting scheduled for Friday at 2 PM in Hall B.", date: "Upcoming" },
    { color: 'bg-purple-50 border-purple-100', text: "Check inventory for pediatric vaccines before next shift.", date: "Task" },
  ];

  return (
    <div className="flex-1 bg-gray-50 h-full overflow-y-auto font-sans">
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10 animate-fade-in">
           <div>
               <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Good Morning, Dr. Smith</h1>
               <p className="text-gray-500 mt-2 text-lg">Ready to transform patient care today?</p>
           </div>
           
           {/* Online and Shift indicators removed */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Main Actions & Workflow (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
                
                {/* Hero Action Card */}
                <div 
                    id="tour-start-consult-card"
                    onClick={onStartRecording}
                    className="group relative bg-white rounded-[2rem] p-8 shadow-soft border border-gray-100 overflow-hidden cursor-pointer hover:shadow-2xl hover:border-red-100 transition-all duration-300"
                >
                    <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-red-50 to-transparent opacity-50 rounded-r-[2rem]"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-20 h-20 rounded-2xl bg-bbh-red text-white flex items-center justify-center shadow-lg shadow-red-200 group-hover:scale-110 transition-transform duration-300">
                             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-bbh-red transition-colors">Start New Consultation</h2>
                            <p className="text-gray-500 leading-relaxed max-w-md">
                                AI-powered listening is ready. Click here to begin a secure recording session and generate SOAP notes instantly.
                            </p>
                        </div>
                        <div className="ml-auto">
                            <div className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center group-hover:bg-bbh-red group-hover:border-bbh-red group-hover:text-white transition-all text-gray-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* New Workflow Boxes */}
                 <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-6 rounded-full bg-gray-900"></span>
                        Scribe Workflow
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Box 1: Listen & Record */}
                        <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 rounded-full bg-red-50 text-bbh-red flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2 text-lg">Listen & Record</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">Capture audio securely in any supported language.</p>
                        </div>

                        {/* Box 2: AI Processing */}
                        <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2 text-lg">AI Processing</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">Extracts symptoms, meds, and vitals automatically.</p>
                        </div>

                        {/* Box 3: Review & Sync */}
                        <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2 text-lg">Review & Sync</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">Verify generated SOAP note and upload to EHR.</p>
                        </div>
                    </div>
                 </div>
            </div>

            {/* Right Column: Bulletin Board (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-8">
                
                {/* Bulletin Board / Sticky Notes */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Bulletin Board</h3>
                    {stickyNotes.map((note, idx) => (
                        <div key={idx} className={`${note.color} border p-5 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform duration-300 cursor-default`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wide opacity-60 bg-white/50 px-2 py-0.5 rounded">{note.date}</span>
                                <svg className="w-3 h-3 opacity-40" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"/></svg>
                            </div>
                            <p className="text-sm font-medium text-gray-800 leading-relaxed font-serif italic">"{note.text}"</p>
                        </div>
                    ))}
                    <button className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm font-bold hover:border-bbh-red hover:text-bbh-red hover:bg-red-50 transition-all">
                        + Add Reminder
                    </button>
                </div>

            </div>

        </div>
      </div>
    </div>
  );
}