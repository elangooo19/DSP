import { createContext, useContext, useState } from 'react';
import { getStoredUser, isLoggedIn } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(isLoggedIn() ? getStoredUser() : null);

  const signIn  = (data) => setUser(data);
  const signOut = () => { localStorage.removeItem('sadms_user'); setUser(null); };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react/only-export-components, react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
