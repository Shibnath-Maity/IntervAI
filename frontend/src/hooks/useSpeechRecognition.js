import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Optional voice dictation using the browser's Web Speech API.
 * `supported` is false in browsers without it (e.g. Firefox), so the UI can hide the button.
 * Final transcripts are passed to `onText`.
 */
export default function useSpeechRecognition(onText) {
  const Recognition =
    typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined;
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const onTextRef = useRef(onText);
  onTextRef.current = onText;

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  }, []);

  const start = useCallback(() => {
    if (!Recognition || recognitionRef.current) return;

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        if (event.results[i].isFinal) text += `${event.results[i][0].transcript} `;
      }
      if (text) onTextRef.current(text);
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
    };
    recognition.onerror = () => {
      recognitionRef.current = null;
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [Recognition]);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  return { supported: Boolean(Recognition), listening, start, stop };
}