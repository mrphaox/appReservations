'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import api from '@/service/axios';
import { motion } from 'framer-motion';
import CreateEventModal from '@/components/ui/CreateEventModal';
import Navbar from '@/components/ui/Navbar';


type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  limit: number;
  reservedCount: number;
};

const Dashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // 🔥 Estado para mostrar modal
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push('/login');

    const fetchEvents = async () => {
      try {
        const response = await api.get('/events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(response.data);
      } catch (err) {
        console.error('Error al cargar eventos', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token, router]);

  const handleEventCreated = (newEvent: Event) => {
    setEvents(prev => [newEvent, ...prev]);
    setShowModal(false);
  };

  return (
    <>
    <Navbar />
    <div className="p-8 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-blue-600">🎉 Eventos Creados</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
        >
          ➕ Crear Evento
        </button>
      </div>

      {loading ? (
        <div className="text-center">Cargando eventos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <motion.div
              key={event._id}
              className="bg-white p-6 rounded shadow hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold text-blue-600 mb-2">{event.title}</h2>
              <p>{event.description}</p>
              <p><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Cupo:</strong> {event.reservedCount}/{event.limit}</p>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && (
        <CreateEventModal onClose={() => setShowModal(false)} onEventCreated={handleEventCreated} />
      )}
    </div>
    </>
  );
};

export default Dashboard;
