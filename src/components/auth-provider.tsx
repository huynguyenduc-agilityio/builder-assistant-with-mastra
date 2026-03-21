import { useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  auth,
  onAuthStateChanged,
  signInWithGoogle,
  logOut as firebaseLogOut,
  type User,
} from '@/lib/firebase';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async () => {
    await signInWithGoogle();
  }, []);

  const logOut = useCallback(async () => {
    await firebaseLogOut();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
