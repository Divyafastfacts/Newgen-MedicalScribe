import { useState, useEffect, useRef, useCallback } from 'react';

// --- Type Definitions for Web Speech API ---
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  interpretation: any;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}
// -------------------------------------------

interface UseSpeechRecognitionProps {
  language: string;
  onResult: (text: string) => void;
  onInterimResult?: (text: string) => void;
}

export const useSpeechRecognition = ({ language, onResult, onInterimResult }: UseSpeechRecognitionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isRecordingRef = useRef(false);

  // Keep refs for callbacks to use inside event listeners without triggering re-effects
  const onResultRef = useRef(onResult);
  const onInterimResultRef = useRef(onInterimResult);

  useEffect(() => {
    onResultRef.current = onResult;
    onInterimResultRef.current = onInterimResult;
  }, [onResult, onInterimResult]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech Recognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalChunk = '';
      let interimChunk = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalChunk += event.results[i][0].transcript;
        } else {
          interimChunk += event.results[i][0].transcript;
        }
      }

      if (finalChunk && onResultRef.current) {
        onResultRef.current(finalChunk);
      }
      
      if (onInterimResultRef.current) {
        onInterimResultRef.current(interimChunk);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone access denied.');
        setIsRecording(false);
        isRecordingRef.current = false;
      } else if (event.error === 'no-speech') {
        // Ignore silence
      } else {
        // For other errors, we might want to stop or retry
        // Keeping it running if possible, or letting logic handle it
      }
    };

    recognition.onend = () => {
      // Auto-restart if we are supposed to be recording
      if (isRecordingRef.current) {
        try {
           recognition.start();
        } catch (e) {
           console.error("Failed to restart recognition", e);
           setIsRecording(false);
           isRecordingRef.current = false;
        }
      } else {
        setIsRecording(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onend = null; // Prevent restart loop during cleanup
      recognition.stop();
    };
  }, [language]); // Only recreate if language changes

  const startRecording = useCallback(() => {
    setError(null);
    if (recognitionRef.current) {
      try {
        isRecordingRef.current = true;
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Failed to start recording:", e);
      }
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      isRecordingRef.current = false;
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  return { isRecording, startRecording, stopRecording, error };
};