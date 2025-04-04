'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion } from 'framer-motion';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="p-8 min-h-screen bg-gray-500">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">📅 Calendario de Eventos</h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center"
      >
        <Calendar
          onChange={(value) => setDate(value as Date)}
          value={date}
          className="shadow-lg rounded-lg p-4 bg-white"
        />
      </motion.div>
    </div>
  );
};

export default CalendarPage;
