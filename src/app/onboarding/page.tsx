"use client"

import React, { useState } from 'react';
import StepOne from '@/app/components/stepOne'; 
import StepTwo from '@/app/components/steptwo';  
import StepThree, { FormData as OnboardingFormData } from '@/app/components/stepThree';

const OnboardingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    name: '',
    size: '', 
    location: '',
    totalBeds: '',
    operatingHours: { from: '', to: '', days: [] },
    services: [],
  });

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const updateFormData = (data: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  

  switch (currentStep) {
    case 1:
      return <StepOne formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
    case 2:
      return <StepTwo formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
    case 3:
      return <StepThree formData={formData} prevStep={prevStep} /* onFormSubmitSuccess={handleSuccessfulSubmission} */ />;
    default:
      return <div>Form Completed or Invalid Step</div>;
  }
};

export default OnboardingForm;
