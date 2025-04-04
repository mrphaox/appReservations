'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import api from '@/service/axios';
import { motion } from 'framer-motion';
import Navbar from '@/components/ui/Navbar';
import toast from 'react-hot-toast';

type Reservation = {
  _id: string;
  eventId: string;
  userId: string;
};

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  limit: number;
};

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [events, setEvents] = useState<Record<string, Event>>({});
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchReservations = async () => {
      setLoading(true);
      try {
        const response = await api.get('/reservations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const reservationsData = response.data;
        setReservations(reservationsData);

        // 🚀 Ahora hacemos peticiones individuales a cada evento con su ID
        const eventPromises = reservationsData.map((reservation: Reservation) =>
          api.get(`/events/${reservation.eventId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => res.data)
        );

        const fetchedEvents = await Promise.all(eventPromises);
        const eventsData: Record<string, Event> = {};

        fetchedEvents.forEach((event: Event) => {
          eventsData[event._id] = event;
        });

        setEvents(eventsData);

      } catch (error) {
        console.error('Error al cargar reservas', error);
        toast.error('No se pudieron cargar tus reservas. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [token, router]);

  const handleCancelReservation = async (reservationId: string) => {
    try {
      await api.delete(`/reservations/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReservations(prev => prev.filter(reservation => reservation._id !== reservationId));
      toast.success('Reserva cancelada con éxito.');
    } catch (error) {
      console.error('Error al cancelar la reserva', error);
      toast.error('No se pudo cancelar la reserva.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-8 min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-yellow-400 mb-6">📋 Mis Reservas</h1>

        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Cargando reservas...</div>
        ) : (
          <>
            {reservations.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">No tienes reservas aún.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reservations.map(reservation => {
                  const event = events[reservation.eventId];
                  if (!event) return null;

                  return (
                    <motion.div
                      key={reservation._id}
                      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="text-xl font-bold text-blue-600 dark:text-yellow-400 mb-2">{event.title}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{event.description}</p>
                      <p><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}</p>
                      <button
                        onClick={() => handleCancelReservation(reservation._id)}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Cancelar Reserva
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Reservations;
