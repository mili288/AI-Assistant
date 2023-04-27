import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useSpeechSynthesis } from "react-speech-kit";
import VoiceInput from "./SpeechRecognition";
import "./AiAssistant.css";
import CESTalk from '../assets/character/OpenEyesGif.gif';
import CESNormal from '../assets/character/OES.png';
import CESClosedNormal from '../assets/character/CES.png';
import CESClosedTalk from '../assets/character/ClosedEyesGif.gif';

const VoiceAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { speak } = useSpeechSynthesis();
  const socketRef = useRef(null);
  const timerRef = useRef(null);
  const [characterState, setCharacterState] = useState("normal");

  useEffect(() => {
    socketRef.current = io("https://ai-assistant-tepe.onrender.com");
    socketRef.current.on("response", (message) => {
      setResponse(message);
      setCharacterState(message.includes("and") ? "talk" : message.includes("sad") ? "sad" : "normal");
    });
    return () => socketRef.current.disconnect();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("https://ai-assistant-tepe.onrender.com/ask/prompt", { prompt });
      setMessage(response.data.message);
      setPrompt("");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlePrompt = (text) => {
    setPrompt(text);
    socketRef.current.emit("prompt", text);
    setIsRecording(true);
  };

  useEffect(() => {
    if (message) {
      speak({ text: message });
      setCharacterState("talk");
      setTimeout(() => setCharacterState("normal"), message.length * 100);
    }
  }, [message]);

  useEffect(() => {
    document.getElementById("character").src = characterState === "talk" ? CESTalk : CESNormal;
  }, [characterState]);

  return (
    <div className="voice-assistant-container">
      <h1>Voice Assistant</h1>
      <div className="character-container">
        <img
          id="character"
          style={{ width: '800px', height: '500px', borderRadius: '60px' }}
          src={characterState}
          alt="Animated character"
          className="character-image"
        />
      </div>
      <p>Before clicking Submit make sure to press the Stop Talking button. Also you can either talk your prompt or type it.</p>
      <VoiceInput onPrompt={handlePrompt} setIsRecording={setIsRecording} />
      <p>Prompt: {prompt}</p>
      <button style={{ marginBottom: "20px" }} onClick={() =>{ 
        speak({ text: message })
        setCharacterState("talk");
        setTimeout(() => setCharacterState("normal"), message.length * 100);
      }}>
        Replay response
      </button>
      <div>
        <form disabled={!prompt} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <button type="submit" disabled={!prompt}>Submit</button>
        </form>
      </div>
      <p className="response">{message}</p>
    </div>
  );
};

export default VoiceAssistant;
