import React from 'react';

type ViewType = 'dashboard' | 'consultation' | 'notes' | 'templates' | 'support' | 'custom-note';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onRestartTour: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onRestartTour }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    )},
    { id: 'notes', label: 'My Notes', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
    )},
    { id: 'templates', label: 'My Templates', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
    )},
    { id: 'support', label: 'Support', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    )},
  ];

  return (
    <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col h-full shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div className="p-6 flex gap-3 cursor-pointer group hover:bg-gray-50/50 transition-colors border-b border-transparent hover:border-gray-50" onClick={() => onNavigate('dashboard')}>
        {/* Logo Icon: Stylized Heart & Cross */}
        <div className="shrink-0 pt-1">
             <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm group-hover:scale-105 transition-transform duration-300">
                {/* Heart Base */}
                <path d="M50 88.5 C15 60 5 38 22 20 C32 10 46 12 50 22 C54 12 68 10 78 20 C95 38 85 60 50 88.5 Z" fill="#D32F2F"/>
                {/* White Cross */}
                <rect x="42" y="30" width="16" height="36" fill="white" rx="1" />
                <rect x="32" y="40" width="36" height="16" fill="white" rx="1" />
             </svg>
        </div>
        
        {/* Text & Ribbon */}
        <div className="flex flex-col">
            <h1 className="text-[17px] font-bold text-gray-900 leading-tight tracking-tight">
                Newgen Digitalworks<br/>Scribe
            </h1>
            
            {/* Ribbon Quote */}
            <div className="relative mt-2 bg-bbh-red text-white py-1 px-2.5 shadow-sm leading-none" 
                 style={{ 
                     borderTopLeftRadius: '2px',
                     borderBottomLeftRadius: '2px',
                     clipPath: 'polygon(0 0, 100% 0, 94% 50%, 100% 100%, 0 100%)' 
                 }}>
                 <p className="text-[8.5px] font-medium tracking-wide font-sans">
                    Transforming Care
                 </p>
                 <p className="text-[8px] font-bold text-red-100 text-right pr-2 mt-0.5">
                    with AI
                 </p>
            </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="px-6 pb-8 space-y-4 pt-6">
        <button 
          onClick={() => onNavigate('consultation')}
          className="w-full bg-bbh-red hover:bg-bbh-darkRed text-white py-3.5 px-4 rounded-xl shadow-lg shadow-red-100 font-semibold transition-all transform active:scale-95 flex items-center justify-center gap-3 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="relative z-10">Start Consult</span>
        </button>
        
        <button 
            onClick={() => onNavigate('custom-note')}
            className="w-full bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-100 py-3.5 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-3"
        >
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
           </svg>
           Custom Notes
        </button>

        <button 
            onClick={onRestartTour}
            className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 py-3.5 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-3"
        >
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           Watch Demo
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-1.5">
        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</div>
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
                key={item.id}
                onClick={() => onNavigate(item.id as ViewType)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-left group
                    ${isActive 
                        ? 'bg-red-50 text-bbh-red shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
            >
                <span className={`transition-colors duration-200 ${isActive ? 'text-bbh-red' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    {item.icon}
                </span>
                {item.label}
            </button>
          )
        })}
      </nav>

      {/* Footer / Profile */}
      <div className="p-6 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-white hover:shadow-sm cursor-pointer transition-all border border-transparent hover:border-gray-100">
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 p-0.5 shadow-sm">
                 <img src="https://ui-avatars.com/api/?name=Dr+Smith&background=FDECEC&color=D32F2F" alt="Dr. Smith" className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">Dr. Smith</p>
                <p className="text-xs text-gray-500 truncate">Cardiology</p>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </div>
      </div>
    </aside>
  );
};