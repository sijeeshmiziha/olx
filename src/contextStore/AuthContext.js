import React, { useState, createContext, useEffect, useMemo } from 'react';
import { Firebase } from '../firebase/config';

export const AuthContext = createContext(null);

function ContextAuth({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = Firebase.auth().onAuthStateChanged((authUser) => {
      setUser(authUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({ user, setUser, authLoading }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default ContextAuth;
