'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export const useToken = () => {
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setToken(token);
  }, [setToken]);
};
