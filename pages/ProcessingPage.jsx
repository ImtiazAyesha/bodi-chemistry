import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProcessingScreen from '../components/ProcessingScreen';
import analyzePatterns from '../utils/patternAnalyzer';
import { calculateQuestionnaireScores } from '../utils/questionnaireScoring';
import integrateAllModalities from '../utils/integratedPatternFusion';

const ProcessingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const processData = async () => {
            // Retrieve data from sessionStorage
            const captureData = JSON.parse(sessionStorage.getItem('captureData') || '{}');
            const questionnaireData = JSON.parse(sessionStorage.getItem('questionnaireData') || '{}');

            console.log('🔄 Processing captured data...');

            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Analyze patterns
            const questionnaireScores = calculateQuestionnaireScores(questionnaireData);
            const bodyPatterns = analyzePatterns(captureData);
            const patternResults = integrateAllModalities(bodyPatterns, questionnaireScores);

            console.log('✅ Pattern analysis complete:', patternResults);

            // Store results
            sessionStorage.setItem('patternResults', JSON.stringify(patternResults));

            // Navigate to results
            navigate('/results');
        };

        processData();
    }, [navigate]);

    return <ProcessingScreen />;
};

export default ProcessingPage;
