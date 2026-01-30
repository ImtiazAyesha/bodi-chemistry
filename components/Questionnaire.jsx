import React, { useState } from 'react';

const QUESTIONS = [
  { id: 1, text: "Do you experience frequent headaches?", type: "yesno" },
  { id: 2, text: "Do you have neck pain or stiffness?", type: "yesno" },
  { id: 3, text: "Do you experience lower back pain?", type: "yesno" },
  { id: 4, text: "Do you have shoulder pain or tension?", type: "yesno" },
  { id: 5, text: "Do you spend more than 6 hours per day sitting?", type: "yesno" },
  { id: 6, text: "Do you use a computer or phone for extended periods?", type: "yesno" },
  { id: 7, text: "Do you exercise regularly (3+ times per week)?", type: "yesno" },
  { id: 8, text: "Do you have difficulty sleeping due to discomfort?", type: "yesno" },
  { id: 9, text: "Do you experience knee pain?", type: "yesno" },
  { id: 10, text: "Do you have flat feet or high arches?", type: "yesno" },
  { id: 11, text: "Do you experience hip pain or tightness?", type: "yesno" },
  { id: 12, text: "Do you have jaw pain or TMJ issues?", type: "yesno" },
  { id: 13, text: "Do you carry a heavy bag on one shoulder regularly?", type: "yesno" },
  { id: 14, text: "Do you wear high heels frequently?", type: "yesno" },
  { id: 15, text: "Do you have good posture awareness?", type: "yesno" },
  { id: 16, text: "Do you stretch or do mobility work regularly?", type: "yesno" },
  { id: 17, text: "Do you experience numbness or tingling in your hands/feet?", type: "yesno" },
  { id: 18, text: "Do you have a history of injuries affecting your posture?", type: "yesno" },
  { id: 19, text: "Do you feel balanced when standing on one leg?", type: "yesno" },
  { id: 20, text: "Do you have breathing difficulties or shallow breathing?", type: "yesno" }
];

const Questionnaire = ({ onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 5;
  const totalPages = Math.ceil(QUESTIONS.length / questionsPerPage);

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    // Scoring logic: 
    // Positive answers (good habits): Q7, Q15, Q16, Q19 give +5 points each
    // Negative answers (pain/issues): All others give -2.5 points each
    // Start at 50, adjust based on answers
    
    let score = 50;
    const positiveQuestions = [7, 15, 16, 19];
    
    Object.entries(answers).forEach(([qId, answer]) => {
      const questionId = parseInt(qId);
      if (positiveQuestions.includes(questionId)) {
        // Good habits
        score += answer === 'yes' ? 5 : -2.5;
      } else {
        // Pain/issues (yes is bad)
        score += answer === 'yes' ? -2.5 : 2.5;
      }
    });

    return Math.max(0, Math.min(100, score));
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const score = calculateScore();
    onComplete(answers, score);
  };

  const startIndex = currentPage * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = QUESTIONS.slice(startIndex, endIndex);
  const allAnswered = QUESTIONS.every(q => answers[q.id]);
  const currentPageAnswered = currentQuestions.every(q => answers[q.id]);

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          Health Questionnaire
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '30px',
          fontSize: '16px'
        }}>
          Page {currentPage + 1} of {totalPages} • {Object.keys(answers).length}/{QUESTIONS.length} answered
        </p>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '8px',
          background: '#e0e0e0',
          borderRadius: '10px',
          marginBottom: '30px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(Object.keys(answers).length / QUESTIONS.length) * 100}%`,
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Questions */}
        <div style={{ marginBottom: '30px' }}>
          {currentQuestions.map((question, index) => (
            <div key={question.id} style={{
              marginBottom: '25px',
              padding: '20px',
              background: answers[question.id] ? '#f8f9fa' : 'white',
              border: '2px solid',
              borderColor: answers[question.id] ? '#667eea' : '#e0e0e0',
              borderRadius: '10px',
              transition: 'all 0.3s ease'
            }}>
              <p style={{
                fontSize: '18px',
                color: '#333',
                marginBottom: '15px',
                fontWeight: '500'
              }}>
                {startIndex + index + 1}. {question.text}
              </p>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button
                  onClick={() => handleAnswer(question.id, 'yes')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: '2px solid',
                    borderColor: answers[question.id] === 'yes' ? '#667eea' : '#ddd',
                    background: answers[question.id] === 'yes' ? '#667eea' : 'white',
                    color: answers[question.id] === 'yes' ? 'white' : '#333',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer(question.id, 'no')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: '2px solid',
                    borderColor: answers[question.id] === 'no' ? '#667eea' : '#ddd',
                    background: answers[question.id] === 'no' ? '#667eea' : 'white',
                    color: answers[question.id] === 'no' ? 'white' : '#333',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  No
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'space-between' }}>
          <button
            onClick={handlePrevious}
            disabled={currentPage === 0}
            style={{
              padding: '15px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
              border: '2px solid #667eea',
              background: 'white',
              color: '#667eea',
              borderRadius: '50px',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 0 ? 0.5 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            ← Previous
          </button>

          {currentPage < totalPages - 1 ? (
            <button
              onClick={handleNext}
              disabled={!currentPageAnswered}
              style={{
                padding: '15px 30px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                background: currentPageAnswered ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#ccc',
                color: 'white',
                borderRadius: '50px',
                cursor: currentPageAnswered ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease'
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              style={{
                padding: '15px 30px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                background: allAnswered ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#ccc',
                color: 'white',
                borderRadius: '50px',
                cursor: allAnswered ? 'pointer' : 'not-allowed',
                boxShadow: allAnswered ? '0 10px 30px rgba(102, 126, 234, 0.4)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              Continue to Instructions →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
