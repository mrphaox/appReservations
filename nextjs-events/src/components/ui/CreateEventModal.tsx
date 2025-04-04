'use client';

import React, { useState } from 'react';
import api from '@/service/axios';
import { useAuthStore } from '@/store/authStore';

interface CreateEventModalProps {
  onClose: () => void;
  onEventCreated: (event: any) => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ onClose, onEventCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [limit, setLimit] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((state) => state.token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/events', {
        title,
        description,
        date: new Date(date).toISOString().split('T')[0],
        limit,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onEventCreated(response.data);
      onClose();
    } catch (err) {
      console.error('Error al crear evento', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-xl transform transition-all duration-300 scale-100 hover:scale-105"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-emerald-500">Crear Evento</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring focus:ring-emerald-500"
            required
          />
          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring focus:ring-emerald-500"
            rows={4}
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring focus:ring-emerald-500"
            required
          />
          <input
            type="number"
            placeholder="Límite de Personas"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring focus:ring-emerald-500"
            required
          />
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
