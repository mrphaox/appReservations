'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  const initializeToken = useAuthStore((state) => state.initializeToken);
  const router = useRouter();

  useEffect(() => {
    initializeToken(); // ✅ Cargamos el token al iniciar la aplicación
  }, [initializeToken]);

  useEffect(() => {
    const isPublicRoute = ["/login", "/register"].includes(window.location.pathname);

    if (!token && !isPublicRoute) {
      router.push("/login");
    }
  }, [token, router]);

  return <>{children}</>;
};

export default AuthGuard;
