import type { Session } from '@supabase/supabase-js';
import { createContext, useContext } from 'react';

type AuthContextType = {
  session: Session | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
