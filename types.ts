export interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface GeneratedSoapResponse {
  hospital: string;
  patient_summary: string;
  soap_details: SoapNote;
  raw_transcript_reference: string;
}

export enum Language {
  ENGLISH = 'en-US',
  HINDI = 'hi-IN',
  TAMIL = 'ta-IN',
  TELUGU = 'te-IN',
  KANNADA = 'kn-IN',
  MALAYALAM = 'ml-IN',
}

export interface LanguageOption {
  code: Language;
  label: string;
}

export type ProcessingStatus = 'idle' | 'recording' | 'generating' | 'success' | 'error';

export interface PatientDetails {
  name: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  inputLanguage: Language;
  outputLanguage: string;
  specialty: string;
  noteType: string;
}