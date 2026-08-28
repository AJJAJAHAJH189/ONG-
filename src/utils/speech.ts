/**
 * Web Speech API synthesized speech helper for high accessibility
 * Allows users with visual impairments or reading difficulties to listen to any section of the app.
 */

let synth: SpeechSynthesis | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  synth = window.speechSynthesis;
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakText(
  text: string,
  options?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
    rate?: number;
    pitch?: number;
  }
): void {
  if (!synth) {
    console.warn('Speech synthesis not supported on this browser.');
    options?.onError?.();
    return;
  }

  // Cancel any ongoing speech
  synth.cancel();

  // Clean HTML if passed
  const cleanText = text.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'pt-BR';
  utterance.rate = options?.rate || 1.0;
  utterance.pitch = options?.pitch || 1.0;

  // Try to find a Portuguese voice
  const voices = synth.getVoices();
  const ptVoice = voices.find(v => v.lang.startsWith('pt') || v.lang.includes('BR'));
  if (ptVoice) {
    utterance.voice = ptVoice;
  }

  utterance.onstart = () => {
    options?.onStart?.();
  };

  utterance.onend = () => {
    options?.onEnd?.();
  };

  utterance.onerror = () => {
    options?.onError?.();
  };

  currentUtterance = utterance;
  synth.speak(utterance);
}

export function stopSpeech(): void {
  if (synth) {
    synth.cancel();
    currentUtterance = null;
  }
}

export function pauseSpeech(): void {
  if (synth && synth.speaking) {
    synth.pause();
  }
}

export function resumeSpeech(): void {
  if (synth && synth.paused) {
    synth.resume();
  }
}
