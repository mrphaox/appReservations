'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import FormCard from '@/components/ui/FormCard';
import { useAuthStore } from '@/store/authStore';
import api from '@/service/axios';
import Link from 'next/link';

type FormData = {
  login: string;
  password: string;
};

const Login = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', data);

      if (response.status === 201 || response.status === 200) {
        const { access_token } = response.data;
        setToken(access_token);
        localStorage.setItem('token', access_token);
        alert('Inicio de sesión exitoso');
        router.push('/dashboard');
      } else {
        setError('Credenciales incorrectas.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Credenciales incorrectas o problema de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard title="Inicio de Sesión">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('login')}
          placeholder="Correo o nombre de usuario"
          className="w-full p-3 border border-gray-400 rounded focus:outline-none focus:border-blue-500 bg-gray-50 text-gray-800"
          required
        />
        <input
          {...register('password')}
          type="password"
          placeholder="Contraseña"
          className="w-full p-3 border border-gray-400 rounded focus:outline-none focus:border-blue-500 bg-gray-50 text-gray-800"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        <div className="text-center mt-4">
            <Link href="/register" className="text-blue-600 hover:underline">
              ¿No tienes una cuenta? Registrate aquí
            </Link>
          </div>
      </form>
    </FormCard>
  );
};

export default Login;
