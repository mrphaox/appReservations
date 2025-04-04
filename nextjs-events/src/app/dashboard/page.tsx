'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import api from '@/service/axios';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Navbar from '@/components/ui/Navbar';
import toast from 'react-hot-toast';

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  limit: number;
  userId: string;
  participants: string[]; // Ahora almacenamos los participantes aquí
};

const Dashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchEvents = async () => {
      setLoading(true);

      try {
        const response = await api.get<Event[]>('/events/all', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setEvents(response.data);
      } catch (err) {
        console.error('Error al cargar eventos', err);
        toast.error('Error al cargar eventos. Inténtalo nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token, router]);

  useEffect(() => {
    const filtered = events.filter(event => 
      new Date(event.date).toDateString() === selectedDate.toDateString()
    );
    setFilteredEvents(filtered);
  }, [selectedDate, events]);

  const handleReserve = async (eventId: string) => {
    try {
      await api.post(`/reservations/${eventId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Reserva realizada con éxito.');
      
      // Actualiza la lista de eventos después de reservar
      const updatedEvents = events.map(event => {
        if (event._id === eventId) {
          return { ...event, participants: [...event.participants, 'nuevo_participante_id'] };
        }
        return event;
      });

      setEvents(updatedEvents);

    } catch (err) {
      console.error('Error al reservar evento', err);
      toast.error('Error al reservar el evento.');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const EventCard = ({ event }: { event: Event }) => {
    const reservedCount = event.participants.length;
    const cupoDisponible = event.limit - reservedCount;
    const progreso = (reservedCount / event.limit) * 100;

    return (
      <motion.div
        key={event._id}
        className={`p-4 rounded shadow hover:shadow-lg transition-shadow ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-bold text-emerald-400">{event.title}</h3>
        <p>{event.description}</p>
        <p><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Cupo Total:</strong> {event.limit}</p>
        <p><strong>Reservas Realizadas:</strong> {reservedCount}</p>
        <p className={`font-bold ${cupoDisponible === 0 ? 'text-red-500' : 'text-green-500'}`}>
          {cupoDisponible > 0 ? `Cupo Disponible: ${cupoDisponible}` : '¡Cupo Completo!'}
        </p>

        <div className="w-full bg-gray-300 rounded mt-2">
          <div 
            className="bg-emerald-500 text-xs font-medium text-white text-center p-0.5 leading-none rounded-l"
            style={{ width: `${progreso}%` }}
          >
            {Math.round(progreso)}%
          </div>
        </div>

        <button
          onClick={() => handleReserve(event._id)}
          className={`mt-2 py-1 px-4 rounded transition ${cupoDisponible > 0 ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-500 text-white cursor-not-allowed'}`}
          disabled={cupoDisponible === 0}
        >
          Reservar
        </button>
      </motion.div>
    );
  };

  return (
    <>
      <Navbar />
      <div className={`${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-100 text-black'} p-8 min-h-screen`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard de Eventos</h1>
          <button
            onClick={toggleTheme}
            className="bg-emerald-300-500 text-white py-2 px-4 rounded transition hover:bg-emerald-600"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className={`w-full md:w-1/3 p-4 rounded shadow ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <h2 className="text-xl font-bold mb-4 text-emerald-400">📅 Calendario de Eventos</h2>
            <Calendar
              onChange={(value) => value && setSelectedDate(value as Date)}
              value={selectedDate}
              className={`w-full calendar-custom ${isDarkMode ? 'calendar-dark' : 'calendar-light'}`}
            />
          </div>

          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold text-emerald-400 mb-4">🎉 Eventos Disponibles</h2>
            {loading ? (
              <div className="text-center text-gray-400">Cargando eventos...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.map(event => <EventCard key={event._id} event={event} />)}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .calendar-custom {
          border-radius: 0.5rem;
        }

        .calendar-dark {
          background-color: #1e293b;
          color: white;
        }
        .calendar-dark .react-calendar__tile {
          background: transparent;
          color: white;
        }
        .calendar-dark .react-calendar__tile--active {
          background: #10b981;
          color: white;
        }
        .calendar-dark .react-calendar__tile--now {
          background: #4b5563;
          color: white;
        }

        .calendar-light {
          background-color: white;
          color: black;
        }
        .calendar-light .react-calendar__tile {
          background: transparent;
          color: black;
        }
        .calendar-light .react-calendar__tile--active {
          background: #10b981;
          color: white;
        }
        .calendar-light .react-calendar__tile--now {
          background: #4b5563;
          color: white;
        }
      `}</style>
    </>
  );
};

export default Dashboard;
