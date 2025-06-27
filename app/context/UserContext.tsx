// Arquivo: app/context/UserContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

interface User {
  uid: string;
  email: string;
  nomeCompleto?: string;
  role?: 'admin' | 'funcionario';
}

interface UserContextType {
  user: User | null;
  userId: string | null;
  userRole: 'admin' | 'funcionario' | null;
  userName: string | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  userId: null,
  userRole: null,
  userName: null,
  loading: true,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, 'funcionarios', firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            nomeCompleto: data.nomeCompleto,
            role: data.role,
          });
        } else {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const userId = user?.uid ?? null;
  const userRole = user?.role ?? null;
  const userName = user?.nomeCompleto ?? null;

  return (
    <UserContext.Provider value={{ user, userId, userRole, userName, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
