'use client';

import React, { ReactNode } from 'react';
import { useToken } from '@/hooks/useToken';

const ClientProvider = ({ children }: { children: ReactNode }) => {
  useToken(); 
  return <>{children}</>;
};

export default ClientProvider;
