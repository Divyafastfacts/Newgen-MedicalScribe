import React, { useState } from 'react';
import { Language, PatientDetails } from '../types.ts';
import { LANGUAGES } from '../constants.ts';

interface PatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (details: PatientDetails) => void;
}

export const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({ isOpen, onClose, onProceed }) => {
  const [details, setDetails] = useState<PatientDetails>({
    name: '',
    age: '',
    gender: 'Male',
    inputLanguage: Language.ENGLISH,
    outputLanguage: 'English',
    specialty: 'General Practice',
    noteType: 'SOAP Note - Standard',
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof PatientDetails, value: any) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  const noteTypes = [
    "SOAP Note - Standard",
    "SOAP Note - List",
    "SOAP Note - Narrative",
    "Comprehensive Note",
    "Psychiatry Note"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in border border-gray-100 transform transition-all flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">New Consultation</h2>
            <p className="text-sm text-gray-500 mt-1">Configure session details to initialize the AI model.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body - Scrollable */}
        <div id="tour-patient-form" className="p-8 space-y-6 bg-white overflow-y-auto">
          
          {/* Name & Age Row */}
          <div className="flex gap-6">
            <div className="flex-grow-[2]">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Patient Name
              </label>
              <input 
                type="text"
                placeholder="e.g. Aditi Rao"
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-bbh-red focus:ring-4 focus:ring-bbh-red/10 outline-none transition-all font-medium text-gray-900 placeholder-gray-400"
                value={details.name}
                autoFocus
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            <div className="flex-grow-[1]">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Age
              </label>
              <input 
                type="text"
                placeholder="Yrs"
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-bbh-red focus:ring-4 focus:ring-bbh-red/10 outline-none transition-all font-medium text-gray-900 placeholder-gray-400"
                value={details.age}
                onChange={(e) => handleChange('age', e.target.value)}
              />
            </div>
          </div>

          {/* Gender Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['Male', 'Female', 'Other'].map((gender) => (
                <label key={gender} className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  details.gender === gender 
                    ? 'border-bbh-red bg-red-50 text-bbh-red shadow-sm font-semibold' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                }`}>
                  <input 
                    type="radio" 
                    name="gender" 
                    className="hidden"
                    checked={details.gender === gender}
                    onChange={() => handleChange('gender', gender)}
                  />
                  {gender === 'Male' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                  {gender === 'Female' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                  <span className="text-sm">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Context Row */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                 Spoken Language
              </label>
              <div className="relative">
                  <select 
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-bbh-red focus:ring-4 focus:ring-bbh-red/10 outline-none appearance-none font-medium text-gray-900"
                    value={details.inputLanguage}
                    onChange={(e) => handleChange('inputLanguage', e.target.value)}
                  >
                    {LANGUAGES.map(l => (
                      <option key={l.code} value={l.code}>{l.label}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                 Medical Specialty
              </label>
              <div className="relative">
                <select 
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-bbh-red focus:ring-4 focus:ring-bbh-red/10 outline-none appearance-none font-medium text-gray-900"
                    value={details.specialty}
                    onChange={(e) => handleChange('specialty', e.target.value)}
                >
                    <option value="General Practice">General Practice</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Neurology">Neurology</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Note Type Row - NEW SECTION */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
               Choose Note Type <span className="text-bbh-red">*</span>
            </label>
            <div className="relative">
                <select 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-bbh-red focus:ring-4 focus:ring-bbh-red/10 outline-none appearance-none font-semibold text-gray-900 shadow-sm"
                    value={details.noteType}
                    onChange={(e) => handleChange('noteType', e.target.value)}
                >
                    {noteTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 ml-1">This format will be used by the AI to structure the final clinical documentation.</p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
            <button 
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
            >
                Cancel
            </button>
            <button 
                id="tour-start-recording-btn"
                onClick={() => onProceed(details)}
                className="bg-bbh-red hover:bg-bbh-darkRed text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-red-200 hover:shadow-xl transition-all transform active:scale-95 flex items-center gap-2"
            >
                Start Recording
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
        </div>

      </div>
    </div>
  );
};