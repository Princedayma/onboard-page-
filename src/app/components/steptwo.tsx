"use client"

import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { FormData } from './stepThree';
import { Calendar, Clock, Plus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import gsap from 'gsap';

interface StepTwoProps {
  formData: Pick<FormData, 'operatingHours' | 'services'>;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const daysOfWeek: FormData['operatingHours']['days'][number][] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const StepTwo: React.FC<StepTwoProps> = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [currentService, setCurrentService] = useState({ name: '', description: '' });
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 });
    }
  }, []);

  const handleOperatingHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({
      operatingHours: { ...formData.operatingHours, [name]: value },
    });
  };

  const handleDayToggle = (day: FormData['operatingHours']['days'][number]) => {
    const currentDays = formData.operatingHours.days || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    updateFormData({
      operatingHours: { ...formData.operatingHours, days: newDays },
    });
  };

  const handleServiceInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentService({ ...currentService, [e.target.name]: e.target.value });
  };

  const addService = () => {
    if (currentService.name && currentService.description) {
      updateFormData({
        services: [...formData.services, currentService],
      });
      setCurrentService({ name: '', description: '' });
    } else {
      alert("Please provide both name and description for the service.");
    }
  };

  const removeService = (index: number) => {
    const updatedServices = formData.services.filter((_, i) => i !== index);
    updateFormData({ services: updatedServices });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.operatingHours.from || !formData.operatingHours.to || formData.operatingHours.days.length === 0) {
      alert("Please fill in all operating hours details, including at least one day.");
      return;
    }
    if (formData.services.length === 0) {
      alert("Please add at least one service.");
      return;
    }
    nextStep();
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="p-6 max-w-xl mx-auto bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-2xl space-y-6 border border-blue-100"
    >
      <h2 className="text-2xl font-semibold text-gray-700 text-center flex items-center justify-center gap-2">
        <Calendar className="text-indigo-600" /> Step 2: Operations & Services
      </h2>

      {/* Operating Hours */}
      <fieldset className="space-y-4 border p-4 rounded-md">
        <legend className="text-lg font-medium text-gray-700 px-1 flex items-center gap-2"><Clock className="text-indigo-500" /> Operating Hours</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="from" className="block text-sm font-medium text-gray-700">From (HH:MM)</label>
            <input type="time" name="from" id="from" value={formData.operatingHours.from} onChange={handleOperatingHoursChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700">To (HH:MM)</label>
            <input type="time" name="to" id="to" value={formData.operatingHours.to} onChange={handleOperatingHoursChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Operating Days</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {daysOfWeek.map(day => (
              <button
                type="button"
                key={day}
                onClick={() => handleDayToggle(day)}
                className={`px-3 py-2 border rounded-md text-sm font-medium focus:outline-none transition-all duration-300 ease-in-out
                  ${formData.operatingHours.days.includes(day)
                    ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </fieldset>

      {/* Services */}
      <fieldset className="space-y-4 border p-4 rounded-md">
        <legend className="text-lg font-medium text-gray-700 px-1 flex items-center gap-2">Services</legend>
        <div className="space-y-2">
          <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700">Service Name</label>
          <input
            type="text"
            name="name"
            id="serviceName"
            value={currentService.name}
            onChange={handleServiceInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., Cardiology"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="serviceDescription" className="block text-sm font-medium text-gray-700">Service Description</label>
          <textarea
            name="description"
            id="serviceDescription"
            value={currentService.description}
            onChange={handleServiceInputChange}
            rows={2}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., Heart-related treatments"
          />
        </div>
        <button
          type="button"
          onClick={addService}
          className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform duration-200 hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>

        {formData.services.length > 0 && (
          <div className="mt-4 space-y-2 fade-in">
            <h4 className="text-md font-medium text-gray-700">Added Services:</h4>
            <ul className="list-disc list-inside pl-2 space-y-1">
              {formData.services.map((service, index) => (
                <li key={index} className="text-sm text-gray-600 flex justify-between items-center">
                  <span><strong>{service.name}:</strong> {service.description}</span>
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="ml-2 text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </fieldset>

      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform duration-200 hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform duration-200 hover:scale-105"
        >
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

export default StepTwo;
