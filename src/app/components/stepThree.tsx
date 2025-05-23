"use client"
import React, { useState } from 'react';

interface Service {
  name: string;
  description: string;
}

interface OperatingHours {
  from: string;
  to: string;
  days: string[];
}

export interface FormData {
  name: string;
  size: 'Small' | 'Medium' | 'Large' | ''; // Added '' for initial state if applicable
  location: string;
  totalBeds: number | string; // Allow string for input field, convert before submit
  operatingHours: OperatingHours;
  services: Service[];
}

interface StepThreeProps {
  formData: FormData;
  prevStep: () => void;
  // You might want a function to reset the form or navigate away on success
  // onFormSubmitSuccess?: () => void;
}

const StepThree: React.FC<StepThreeProps> = ({ formData, prevStep }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Ensure totalBeds is a number
    const payload = {
      ...formData,
      totalBeds: Number(formData.totalBeds),
    };

    try {
      const response = await fetch('/api/hospitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle HTTP errors like 400, 409, 500
        const errorMessage = result.error || `Request failed with status ${response.status}`;
        const errorDetails = result.details ? ` Details: ${JSON.stringify(result.details)}` : '';
        setError(`${errorMessage}.${errorDetails}`);
        alert(`Error: ${errorMessage}.${errorDetails}`);
        return;
      }

      // Handle success
      setSuccessMessage(result.message || 'Hospital data submitted successfully!');
      alert('Success! Hospital data submitted.');
      // Optionally, call a prop function to navigate away or reset form
      // if (onFormSubmitSuccess) onFormSubmitSuccess();

    } catch (err) {
      // Handle network errors or other unexpected issues
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Submission failed: ${errorMessage}`);
      alert(`Submission failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700 text-center">Step 3: Review and Submit</h2>

      <div className="bg-gray-50 p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Data Preview:</h3>
        <pre className="text-sm text-gray-600 bg-white p-3 rounded overflow-x-auto">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={prevStep}
          disabled={isLoading}
          className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:bg-indigo-400"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default StepThree;