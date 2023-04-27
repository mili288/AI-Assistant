import { useState } from "react";

function VoiceInput({ onPrompt }) {
  const [isListening, setIsListening] = useState(false);

  const handleStart = () => {
    setIsListening(true);
    recognition.start();
  };

  const handleStop = () => {
    setIsListening(false);
    recognition.stop();
  };

  const recognition = new window.webkitSpeechRecognition();
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    const lastResult = event.results[event.results.length - 1];
    const transcript = lastResult[0].transcript.trim();
    if (lastResult.isFinal) {
      onPrompt(transcript);
    }
  };

  return (
    <div>
      <button disabled={isListening} onClick={handleStart}>
        Start Talking
      </button>
      <button disabled={!isListening} onClick={handleStop}>
        Stop Talking
      </button>
    </div>
  );
}

export default VoiceInput;
