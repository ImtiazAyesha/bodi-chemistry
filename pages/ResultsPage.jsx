import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResultsScreen from '../components/ResultsScreen';

const ResultsPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {
        // Retrieve all data from sessionStorage
        const captureData = JSON.parse(sessionStorage.getItem('captureData') || '{}');
        const questionnaireData = JSON.parse(sessionStorage.getItem('questionnaireData') || '{}');
        const patternResults = JSON.parse(sessionStorage.getItem('patternResults') || '{}');

        // Validate data exists
        if (!captureData.stage1 || !patternResults.primaryPattern) {
            console.warn('⚠️ Missing data, redirecting to home');
            navigate('/');
            return;
        }

        setData({ captureData, questionnaireData, patternResults });
    }, [navigate]);

    const handleRestart = () => {
        // Clear all session data
        sessionStorage.clear();
        navigate('/');
    };

    if (!data) {
        return (
            <div className="min-h-screen bg-brand-sand flex items-center justify-center">
                <div className="text-brand-slate text-xl font-display font-bold">Loading results...</div>
            </div>
        );
    }

    return (
        <ResultsScreen
            captureData={data.captureData}
            questionnaireData={data.questionnaireData}
            patternResults={data.patternResults}
            onRestart={handleRestart}
        />
    );
};

export default ResultsPage;
