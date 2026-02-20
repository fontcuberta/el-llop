import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const LOCALE_TO_LANG: Record<string, string> = {
  es: "es-ES",
  en: "en-US",
  ca: "ca-ES",
};

let voicesLoaded = false;

function getVoiceForLang(lang: string): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices();
  const target = voices.find((v) => v.lang.startsWith(lang.split("-")[0]));
  return target ?? voices[0];
}

export function useSpeech() {
  const { i18n } = useTranslation();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (voicesLoaded) return;
    speechSynthesis.getVoices();
    const onVoicesChanged = () => {
      voicesLoaded = true;
      speechSynthesis.onvoiceschanged = null;
    };
    speechSynthesis.onvoiceschanged = onVoicesChanged;
    setTimeout(() => {
      if (!voicesLoaded) {
        voicesLoaded = true;
        speechSynthesis.onvoiceschanged = null;
      }
    }, 500);
  }, []);

  const speak = useCallback(
    (key: string, options?: Record<string, string>) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

      const text = i18n.t(key, options);
      if (!text || text === key) return;

      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = LOCALE_TO_LANG[i18n.language] ?? "en-US";
      utterance.rate = 0.9;
      utterance.volume = 1;

      const voice = getVoiceForLang(utterance.lang);
      if (voice) utterance.voice = voice;

      speechSynthesis.speak(utterance);
      utteranceRef.current = utterance;
    },
    [i18n]
  );

  const cancel = useCallback(() => {
    speechSynthesis.cancel();
  }, []);

  const isAvailable =
    typeof window !== "undefined" && "speechSynthesis" in window;

  return { speak, cancel, isAvailable };
}
