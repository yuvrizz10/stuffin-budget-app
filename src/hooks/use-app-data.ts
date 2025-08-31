'use client';
import { useContext } from 'react';
import { AppContext } from '@/components/AppProvider';

export const useAppData = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppProvider');
  }
  return context;
};
