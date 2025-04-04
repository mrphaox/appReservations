'use client';

import React, { useState } from 'react';
import api from '@/service/axios';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface EditEventModalProps {
  event: any;
  onClose: () => void;
  onEventUpdated: (updatedEvent: any) => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ event, onClose, onEventUpdated }) => {
  const [title, setTitle] = useState(event.title || '');
  const [description, setDescription] = useState(event.description || '');
  const [date, setDate] = useState(event.date?.split('T')[0] || '');
  const [limit, setLimit] = useState(event.limit || 0);
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((state) => state.token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.patch(`/events/${event._id}`, {
        title,
        description,
        date: new Date(date).toISOString().split('T')[0],
        limit,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onEventUpdated(response.data);
      toast.success('Evento actualizado con éxito.');
      onClose();
    } catch (err) {
      console.error('Error al actualizar evento', err);
      toast.error('Error al actualizar el evento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl mb-4 text-emerald-500">Editar Evento</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="number"
            placeholder="Límite de Personas"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
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
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
