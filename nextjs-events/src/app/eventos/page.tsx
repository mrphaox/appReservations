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
  const [editingEvent, setEditingEvent] = useState<Event | null>(null); // Estado para edición de eventos
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

  const handleEventUpdated = (updatedEvent: Event) => {
    setEvents(prevEvents =>
      prevEvents.map(event => (event._id === updatedEvent._id ? updatedEvent : event))
    );
    setEditingEvent(null);
    toast.success('Evento actualizado con éxito.');
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

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
  };

  const handleUpdateEvent = async (updatedEvent: Event) => {
    try {
      const response = await api.patch(`/events/${updatedEvent._id}`, updatedEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });

      handleEventUpdated(response.data);
    } catch (error) {
      console.error('Error al actualizar evento', error);
      toast.error('Error al actualizar el evento.');
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
                  className="bg-green-500 text-white p-1 rounded"
                  onClick={() => handleEdit(event)}
                >
                  ✏️
                </button>
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

        {editingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg dark:bg-slate-800">
              <h2 className="text-2xl mb-4 text-blue-600">Editar Evento</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateEvent(editingEvent);
              }}>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded mb-3"
                  required
                />
                <textarea
                  value={editingEvent.description}
                  onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded mb-3"
                  required
                />
                <input
                  type="date"
                  value={editingEvent.date.split('T')[0]}
                  onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded mb-3"
                  required
                />
                <input
                  type="number"
                  value={editingEvent.limit}
                  onChange={e => setEditingEvent({ ...editingEvent, limit: Number(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded mb-3"
                  required
                />
                <div className="flex justify-end space-x-2">
                  <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setEditingEvent(null)}>
                    Cancelar
                  </button>
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ExplorePage;
