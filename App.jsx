import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import QuestionnairePage from './pages/QuestionnairePage';
import InstructionsPage from './pages/InstructionsPage';
import CapturePage from './pages/CapturePage';
import ProcessingPage from './pages/ProcessingPage';
import ResultsPage from './pages/ResultsPage';

/**
 * Main App Component with React Router
 * 
 * Routes:
 * / - Landing page
 * /questionnaire - Self-assessment questionnaire
 * /instructions - Pre-capture instructions
 * /capture - 4-stage camera capture
 * /processing - Pattern analysis processing
 * /results - Final results and report
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/questionnaire" element={<QuestionnairePage />} />
        <Route path="/instructions" element={<InstructionsPage />} />
        <Route path="/capture" element={<CapturePage />} />
        <Route path="/processing" element={<ProcessingPage />} />
        <Route path="/results" element={<ResultsPage />} />

        {/* Catch-all redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
