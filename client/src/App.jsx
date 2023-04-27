import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VoiceAssistant from './components/AIAssistant';

function App() {

  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<VoiceAssistant />} />
      </Routes>
     </Router>
    </>
  )
}

export default App
