'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FormCardProps {
  children: React.ReactNode;
  title: string;
}

const FormCard: React.FC<FormCardProps> = ({ children, title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 px-4">
      <motion.div
        className="bg-white shadow-lg rounded-lg p-10 w-full max-w-md border border-gray-200"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-700">{title}</h2>
        {children}
      </motion.div>
    </div>
  );
};

export default FormCard;
