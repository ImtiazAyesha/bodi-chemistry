import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Questionnaire from '../components/Questionnaire';

const QuestionnairePage = () => {
    const navigate = useNavigate();

    const handleComplete = (questionnaireResult) => {
        console.log('Questionnaire Complete:', questionnaireResult);
        // Store in sessionStorage for access in other pages
        sessionStorage.setItem('questionnaireData', JSON.stringify(questionnaireResult));
        navigate('/instructions');
    };

    return <Questionnaire onComplete={handleComplete} />;
};

export default QuestionnairePage;
