import React, { ChangeEvent, FormEvent } from 'react';
import { FormData } from './stepThree';
import { Hospital, Bed, MapPin, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepOneProps {
  formData: Pick<FormData, 'name' | 'size' | 'location' | 'totalBeds'>;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
    },
  }),
};

const StepOne: React.FC<StepOneProps> = ({ formData, updateFormData, nextStep }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: name === 'totalBeds' && value !== '' ? parseInt(value, 10) : value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.size || !formData.location || formData.totalBeds === '' || Number(formData.totalBeds) <= 0) {
      alert('Please fill in all fields correctly.');
      return;
    }
    nextStep();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="p-6 max-w-xl mx-auto bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-2xl space-y-6 border border-blue-100"
      initial="hidden"
      animate="visible"
    >
      <motion.div className="text-center" variants={fadeInUp}>
        <motion.div whileHover={{ rotate: 10, scale: 1.1 }}>
          <Hospital className="mx-auto h-10 w-10 text-indigo-600 mb-2" />
        </motion.div>
        <motion.h2 className="text-3xl font-bold text-indigo-700" variants={fadeInUp} custom={1}>
          Step 1: Hospital Details
        </motion.h2>
        <motion.p className="text-sm text-gray-600" variants={fadeInUp} custom={2}>
          Please fill out the hospital's basic information.
        </motion.p>
      </motion.div>

      {[
        {
          label: 'Hospital Name',
          name: 'name',
          type: 'text',
          icon: <Building2 className="inline-block w-4 h-4 mr-1 text-indigo-500" />,
          placeholder: 'e.g. CityCare Clinic',
        },
        {
          label: 'Location',
          name: 'location',
          type: 'text',
          icon: <MapPin className="inline-block w-4 h-4 mr-1 text-indigo-500" />,
          placeholder: 'e.g. Jodhpur, India',
        },
        {
          label: 'Total Beds',
          name: 'totalBeds',
          type: 'number',
          icon: <Bed className="inline-block w-4 h-4 mr-1 text-indigo-500" />,
          placeholder: '',
        },
      ].map((field, index) => (
        <motion.div key={field.name} variants={fadeInUp} custom={index + 3}>
          <label htmlFor={field.name} className="block text-sm font-medium text-indigo-700">
            {field.icon} {field.label}
          </label>
          <input
            type={field.type}
            name={field.name}
            id={field.name}
            value={formData[field.name as keyof typeof formData] || ''}
            onChange={handleChange}
            required
            placeholder={field.placeholder}
            className="mt-1 block w-full px-4 py-2 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:shadow-md transition duration-200 sm:text-sm"
          />
        </motion.div>
      ))}

      <motion.div variants={fadeInUp} custom={6}>
        <label htmlFor="size" className="block text-sm font-medium text-indigo-700">
          <Building2 className="inline-block w-4 h-4 mr-1 text-indigo-500" /> Size
        </label>
        <select
          name="size"
          id="size"
          value={formData.size}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border border-indigo-200 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:shadow-md transition duration-200 sm:text-sm"
        >
          <option value="" disabled>Select size</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
        </select>
      </motion.div>

      <div className="flex justify-end pt-4">
        <motion.button
          type="submit"
          className="px-6 py-2 rounded-lg shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next
        </motion.button>
      </div>
    </motion.form>
  );
};

export default StepOne;
