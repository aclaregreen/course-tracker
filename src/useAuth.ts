import type { Session } from '@supabase/supabase-js';
import { createContext, useContext } from 'react';

type AuthContextType = {
  session: Session | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

export function useUserId() {
  const { session } = useAuth();
  if (!session) throw new Error('useUserId must be used on a protected page');
  return session.user.id;
}
