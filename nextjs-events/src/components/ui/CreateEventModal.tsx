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
        date,
        limit,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onEventCreated(response.data);
    } catch (err) {
      console.error('Error al crear evento', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <h2 className="text-2xl mb-4">Crear Evento</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
          <input
            type="number"
            placeholder="Límite de Personas"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
