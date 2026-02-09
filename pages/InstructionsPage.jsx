import React from 'react';
import { useNavigate } from 'react-router-dom';
import InstructionPage from '../components/InstructionPage';

const InstructionsPage = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/capture');
    };

    return <InstructionPage onStart={handleStart} />;
};

export default InstructionsPage;
