import React from 'react';

export const SupportView: React.FC = () => {
  return (
    <div className="flex-1 bg-gray-50 h-full overflow-y-auto p-8 md:p-12 font-sans animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">IT Support & Help Desk</h1>
            <p className="text-gray-500 mt-2">Need assistance with the Scribe Portal? We are here to help.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-soft border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Submit a Ticket</h2>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Ticket Submitted"); }}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">First Name</label>
                            <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bbh-red focus:ring-1 focus:ring-bbh-red" placeholder="Dr. Smith" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Employee ID</label>
                            <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bbh-red focus:ring-1 focus:ring-bbh-red" placeholder="NGN-1024" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Issue Type</label>
                        <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bbh-red focus:ring-1 focus:ring-bbh-red">
                            <option>Microphone / Audio Issue</option>
                            <option>AI Generation Error</option>
                            <option>Login / Account Issue</option>
                            <option>EMR Sync Failure</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Description</label>
                        <textarea className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-32 outline-none focus:border-bbh-red focus:ring-1 focus:ring-bbh-red resize-none" placeholder="Please describe the issue in detail..."></textarea>
                    </div>
                    <button className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95">
                        Submit Ticket
                    </button>
                </form>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        System Status
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Gemini AI API</span>
                            <span className="text-green-600 font-medium">Operational</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Speech-to-Text</span>
                            <span className="text-green-600 font-medium">Operational</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">EMR Gateway</span>
                            <span className="text-amber-500 font-medium">Maintenance</span>
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 rounded-3xl p-6 border border-red-100">
                    <h3 className="font-bold text-bbh-red mb-2">Emergency IT Support</h3>
                    <p className="text-sm text-red-800 mb-4">For critical issues affecting patient care during consultation hours.</p>
                    <div className="flex items-center gap-3 text-red-900 font-bold text-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        ext. 4400
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};