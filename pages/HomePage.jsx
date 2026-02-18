import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from '../components/LandingPage';

const HomePage = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/questionnaire');
    };

    return <LandingPage onStart={handleStart} />;
};

export default HomePage;
