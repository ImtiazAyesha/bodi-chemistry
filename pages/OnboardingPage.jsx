import React from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingSlides from '../components/OnboardingSlides';

const OnboardingPage = () => {
  const navigate = useNavigate();
  return <OnboardingSlides onComplete={() => navigate('/questionnaire')} />;
};

export default OnboardingPage;
