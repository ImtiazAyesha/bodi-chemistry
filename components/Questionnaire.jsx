import React, { useState } from 'react';
import { QUESTIONNAIRE_DATA, PATTERN_NAMES } from '../config/questionnaireData.js';
import { calculateQuestionnaireScores } from '../utils/questionnaireScoring.js';

const Questionnaire = ({ onComplete }) => {
  const [ currentQuestionIndex, setCurrentQuestionIndex ] = useState( 0 );
  const [ answers, setAnswers ] = useState( Array( 20 ).fill( null ) );
  const [ showReview, setShowReview ] = useState( false );

  const currentQuestion = QUESTIONNAIRE_DATA[ currentQuestionIndex ];
  const progress = ( ( currentQuestionIndex + 1 ) / 20 ) * 100;
  const answeredCount = answers.filter( a => a !== null ).length;

  const handleAnswer = ( optionLabel ) => {
    // Store the answer
    const newAnswers = [ ...answers ];
    newAnswers[ currentQuestionIndex ] = optionLabel;
    setAnswers( newAnswers );

    // Auto-advance to next question after short delay
    setTimeout( () => {
      if ( currentQuestionIndex < 19 ) {
        setCurrentQuestionIndex( currentQuestionIndex + 1 );
      } else {
        // Last question answered - show review or complete
        setShowReview( true );
      }
    }, 300 );
  };

  const handlePrevious = () => {
    if ( currentQuestionIndex > 0 ) {
      setCurrentQuestionIndex( currentQuestionIndex - 1 );
      setShowReview( false );
    }
  };

  const handleNext = () => {
    if ( currentQuestionIndex < 19 ) {
      setCurrentQuestionIndex( currentQuestionIndex + 1 );
    }
  };

  const handleSubmit = () => {
    // Calculate scores
    const result = calculateQuestionnaireScores( answers );

    // Pass results to parent component
    onComplete( {
      answers,
      rawScores: result.rawScores,
      normalizedScores: result.normalizedScores,
      metadata: result.metadata
    } );
  };

  const handleReviewAnswer = ( index ) => {
    setCurrentQuestionIndex( index );
    setShowReview( false );
  };

  // Review Screen
  if ( showReview ) {
    return (
      <div style={ {
        width: '100vw',
        minHeight: '100dvh', // FIXED: Dynamic viewport height for mobile
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 'clamp(20px, 5vw, 40px)',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box'
      } }>
        <div style={ {
          maxWidth: '900px',
          margin: '0 auto',
          background: 'white',
          borderRadius: 'clamp(12px, 3vw, 20px)',
          padding: 'clamp(20px, 5vw, 40px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        } }>
          <h1 style={ {
            fontSize: 'clamp(24px, 5vw, 32px)',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px',
            textAlign: 'center'
          } }>
            Review Your Answers
          </h1>

          <p style={ {
            textAlign: 'center',
            color: '#666',
            marginBottom: '30px',
            fontSize: 'clamp(14px, 2.5vw, 16px)'
          } }>
            { answeredCount }/20 questions answered • Click any answer to change it
          </p>

          {/* Answer Summary */ }
          <div style={ {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '30px'
          } }>
            { QUESTIONNAIRE_DATA.map( ( q, index ) => (
              <div
                key={ q.id }
                onClick={ () => handleReviewAnswer( index ) }
                style={ {
                  padding: '15px',
                  background: answers[ index ] ? '#f0f4ff' : '#fff5f5',
                  border: '2px solid',
                  borderColor: answers[ index ] ? '#667eea' : '#ffcccc',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                } }
              >
                <div style={ { fontSize: '14px', color: '#666', marginBottom: '5px' } }>
                  Question { index + 1 }
                </div>
                <div style={ {
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: answers[ index ] ? '#667eea' : '#ff6b6b'
                } }>
                  { answers[ index ] || '—' }
                </div>
              </div>
            ) ) }
          </div>

          {/* Action Buttons */ }
          <div style={ { display: 'flex', gap: '15px', justifyContent: 'center' } }>
            <button
              onClick={ () => setShowReview( false ) }
              style={ {
                padding: '15px 30px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: '2px solid #667eea',
                background: 'white',
                color: '#667eea',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              } }
            >
              ← Back to Questions
            </button>

            <button
              onClick={ handleSubmit }
              disabled={ answeredCount < 20 }
              style={ {
                padding: '15px 40px',
                fontSize: '18px',
                fontWeight: 'bold',
                border: 'none',
                background: answeredCount === 20
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : '#ccc',
                color: 'white',
                borderRadius: '50px',
                cursor: answeredCount === 20 ? 'pointer' : 'not-allowed',
                boxShadow: answeredCount === 20 ? '0 10px 30px rgba(102, 126, 234, 0.4)' : 'none',
                transition: 'all 0.3s ease'
              } }
            >
              Continue to Photo Assessment →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Question Screen
  return (
    <div style={{
      width: '100vw',
      minHeight: '100dvh', // FIXED: Dynamic viewport height for mobile
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 'clamp(20px, 5vw, 40px)',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: 'clamp(12px, 3vw, 20px)',
        padding: 'clamp(20px, 5vw, 40px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */ }
        <h1 style={{
          fontSize: 'clamp(20px, 4vw, 28px)',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          Somatic Pattern Assessment
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '30px',
          fontSize: 'clamp(14px, 2.5vw, 16px)'
        }}>
          Question { currentQuestionIndex + 1 } of 20 • { answeredCount } answered
        </p>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '10px',
          background: '#e0e0e0',
          borderRadius: '10px',
          marginBottom: '40px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${ progress }%`,
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Question */ }
        <div style={ {
          marginBottom: '30px',
          padding: 'clamp(15px, 3vw, 25px)',
          background: '#f8f9fa',
          borderRadius: '15px',
          border: '2px solid #e0e0e0'
        } }>
          <h2 style={ {
            fontSize: 'clamp(18px, 3.5vw, 22px)',
            color: '#333',
            fontWeight: '600',
            lineHeight: '1.5',
            margin: 0
          } }>
            { currentQuestion.question }
          </h2>
        </div>

        {/* Options */ }
        <div style={ { marginBottom: '40px' } }>
          { currentQuestion.options.map( ( option ) => {
            const isSelected = answers[ currentQuestionIndex ] === option.label;

            return (
              <button
                key={ option.label }
                onClick={ () => handleAnswer( option.label ) }
                style={ {
                  width: '100%',
                  padding: 'clamp(15px, 3vw, 20px) clamp(20px, 4vw, 25px)',
                  marginBottom: '15px',
                  fontSize: 'clamp(14px, 2.5vw, 16px)',
                  textAlign: 'left',
                  border: '3px solid',
                  borderColor: isSelected ? '#667eea' : '#e0e0e0',
                  background: isSelected ? '#f0f4ff' : 'white',
                  color: '#333',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'clamp(10px, 2vw, 15px)',
                  lineHeight: '1.6',
                  boxSizing: 'border-box'
                } }
                onMouseEnter={ ( e ) => {
                  if ( !isSelected ) {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.background = '#fafbff';
                  }
                } }
                onMouseLeave={ ( e ) => {
                  if ( !isSelected ) {
                    e.currentTarget.style.borderColor = '#e0e0e0';
                    e.currentTarget.style.background = 'white';
                  }
                } }
              >
                <span style={ {
                  fontSize: 'clamp(16px, 3vw, 20px)',
                  fontWeight: 'bold',
                  color: isSelected ? '#667eea' : '#999',
                  minWidth: 'clamp(25px, 5vw, 30px)',
                  flexShrink: 0
                } }>
                  { option.label })
                </span>
                <span style={ { flex: 1 } }>
                  { option.text }
                </span>
                { isSelected && (
                  <span style={ {
                    fontSize: '20px',
                    color: '#667eea'
                  } }>
                    ✓
                  </span>
                ) }
              </button>
            );
          } ) }
        </div>

        {/* Navigation */ }
        <div style={ {
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'clamp(10px, 2vw, 15px)'
        } }>
          <button
            onClick={ handlePrevious }
            disabled={ currentQuestionIndex === 0 }
            style={ {
              padding: 'clamp(10px, 2vh, 12px) clamp(20px, 4vw, 25px)',
              fontSize: 'clamp(14px, 2.5vw, 16px)',
              fontWeight: 'bold',
              border: '2px solid #667eea',
              background: 'white',
              color: '#667eea',
              borderRadius: '50px',
              cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentQuestionIndex === 0 ? 0.4 : 1,
              transition: 'all 0.3s ease',
              flex: '1 1 auto',
              minWidth: 'fit-content'
            } }
          >
            ← Previous
          </button>

          <button
            onClick={ () => setShowReview( true ) }
            style={{
              padding: 'clamp(10px, 2vh, 12px) clamp(20px, 4vw, 25px)',
              fontSize: 'clamp(12px, 2vw, 14px)',
              fontWeight: 'bold',
              border: '2px solid #999',
              background: 'white',
              color: '#666',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flex: '1 1 auto',
              minWidth: 'fit-content',
              whiteSpace: 'nowrap'
            }}
          >
            Review ({ answeredCount }/20)
          </button>

          { currentQuestionIndex < 19 ? (
            <button
              onClick={ handleNext }
              style={ {
                padding: 'clamp(10px, 2vh, 12px) clamp(20px, 4vw, 25px)',
                fontSize: 'clamp(14px, 2.5vw, 16px)',
                fontWeight: 'bold',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                flex: '1 1 auto',
                minWidth: 'fit-content'
              } }
            >
              Next →
            </button>
          ) : (
            <button
                onClick={ () => setShowReview( true ) }
                style={ {
                  padding: 'clamp(10px, 2vh, 12px) clamp(20px, 4vw, 25px)',
                  fontSize: 'clamp(14px, 2.5vw, 16px)',
                fontWeight: 'bold',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                flex: '1 1 auto',
                minWidth: 'fit-content'
              } }
            >
                Review Answers →
            </button>
          ) }
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
