'use client';

import React, { useEffect, useState } from 'react';
import api from '@/service/axios';
import { motion } from 'framer-motion';

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
};

const ExplorePage = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await api.get('/events');
      setEvents(response.data);
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">🎴 Explorar Eventos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <motion.div
            key={event._id}
            className="bg-white p-6 rounded shadow hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
          >
            <h2 className="text-xl font-bold text-blue-600 mb-2">{event.title}</h2>
            <p>{event.description}</p>
            <p><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
