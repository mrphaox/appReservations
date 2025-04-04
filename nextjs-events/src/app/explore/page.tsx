'use client';

import React, { useEffect, useState } from 'react';
import api from '@/service/axios';
import { motion } from 'framer-motion';
import Navbar from '@/components/ui/Navbar';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import CreateEventModal from '@/components/ui/CreateEventModal';

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  limit: number;
};

const ExplorePage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const token = useAuthStore((state) => state.token);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error al cargar eventos', error);
      toast.error('No se pudieron cargar los eventos. Inténtalo nuevamente.');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const handleEventCreated = (newEvent: Event) => {
    setEvents(prevEvents => [newEvent, ...prevEvents]);
    setShowModal(false);
    toast.success('Evento creado con éxito.');
  };

  const handleDelete = async (eventId: string) => {
    try {
      await api.delete(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
      toast.success('Evento eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar evento', error);
      toast.error('Error al eliminar el evento.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-8 min-h-screen bg-gray-100 dark:bg-gray-900 transition duration-500">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-center text-blue-600 dark:text-yellow-400">🎴 Explorar Eventos</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => setShowModal(true)}
          >
            + Crear Evento
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <motion.div
              key={event._id}
              className="bg-white dark:bg-slate-800 p-6 rounded shadow hover:shadow-lg transition-shadow relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
            >
              <h2 className="text-xl font-bold text-blue-600 dark:text-yellow-400 mb-2">{event.title}</h2>
              <p>{event.description}</p>
              <p><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Límite:</strong> {event.limit}</p>
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  className="bg-red-500 text-white p-1 rounded"
                  onClick={() => handleDelete(event._id)}
                >
                  🗑️
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {showModal && (
          <CreateEventModal
            onClose={() => setShowModal(false)}
            onEventCreated={handleEventCreated}
          />
        )}
      </div>
    </>
  );
};

export default ExplorePage;
