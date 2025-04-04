'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import FormCard from '@/components/ui/FormCard';
import api from '@/service/axios';

type FormData = {
  username: string;
  email: string;
  password: string;
};

const Register = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const requestData = { ...data, role: 'user' };

      await api.post('/users/register', requestData);
      alert('Registro exitoso');
      reset();
      router.push('/login');
    } catch (err) {
      setError('Hubo un problema al registrarse. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <FormCard title="Registro">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.input
            {...register('username')}
            placeholder="Nombre de usuario"
            className="w-full p-3 border border-gray-400 rounded focus:outline-none focus:border-blue-500 bg-gray-50 text-gray-800"
            required
            whileFocus={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <motion.input
            {...register('email')}
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-3 border border-gray-400 rounded focus:outline-none focus:border-blue-500 bg-gray-50 text-gray-800"
            required
            whileFocus={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <motion.input
            {...register('password')}
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 border border-gray-400 rounded focus:outline-none focus:border-blue-500 bg-gray-50 text-gray-800"
            required
            whileFocus={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <motion.button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition shadow-md"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </motion.button>
          {error && (
            <motion.p
              className="text-red-500 text-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {error}
            </motion.p>
          )}
          <div className="text-center mt-4">
            <Link href="/login" className="text-blue-600 hover:underline">
              ¿Ya tienes una cuenta? Inicia sesión aquí
            </Link>
          </div>
        </form>
      </FormCard>
    </motion.div>
  );
};

export default Register;
