'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { BellIcon, SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token'); 
    router.push('/login');
  };

  return (
    <motion.nav 
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 shadow-md transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-emerald-800 to-indigo-200 text-black'}`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-tight">
          <Link href="/dashboard" className="hover:text-gray-300 transition-colors">
            🌟 Eventos App
          </Link>
        </div>

        {/* Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <div className={`md:flex items-center space-x-6 ${menuOpen ? 'block' : 'hidden'} md:block`}>
          <Link href="/dashboard" className="hover:text-gray-300 transition-colors">Inicio</Link>
          <Link href="/calendar" className="hover:text-gray-300 transition-colors">Calendario</Link>
          <Link href="/explore" className="hover:text-gray-300 transition-colors">Explorar</Link>

          {/* Notificación y Avatar */}
          <div className="flex items-center space-x-4 relative">
            <BellIcon className="h-6 w-6 cursor-pointer hover:text-gray-300" />

            {/* Botón de Tema Oscuro / Claro */}
            <button onClick={handleThemeToggle} className="focus:outline-none">
              {isDarkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-800" />
              )}
            </button>

            {/* Avatar con Dropdown */}
            <div className="relative">
              <Image
                src="/avatar.png"
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full cursor-pointer hover:ring-2 hover:ring-gray-300"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 mt-2 w-48 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded shadow-lg z-50`}
                  >
                    <Link
                      href="/reservations"
                      className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      📋 Mis Reservas
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      🔒 Cerrar Sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
