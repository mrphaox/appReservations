'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold">
          <Link href="/dashboard">Eventos App</Link>
        </div>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
            ☰
          </button>
        </div>

        <div className={`flex-1 md:flex items-center justify-between ${menuOpen ? 'block' : 'hidden'} md:block`}>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <Link href="/dashboard" className="hover:text-gray-300">Inicio</Link>
            <Link href="/calendar" className="hover:text-gray-300">Calendario</Link>
            <Link href="/explore" className="hover:text-gray-300">Explorar Eventos</Link>
          </div>

          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
