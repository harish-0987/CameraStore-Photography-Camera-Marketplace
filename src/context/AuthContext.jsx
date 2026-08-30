import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('camerastore_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('camerastore_all_users');
    return saved ? JSON.parse(saved) : [
      { id: 'usr-1', name: 'Demo Admin', email: 'admin@camerastore.com', role: 'admin', joined: '2025-01-15' },
      { id: 'usr-2', name: 'Alex Johnson', email: 'alex@example.com', role: 'customer', joined: '2025-02-10' },
      { id: 'usr-3', name: 'Elena Rostova', email: 'elena@photo.pro', role: 'customer', joined: '2025-03-01' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('camerastore_all_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = (email, password) => {
    // Check if admin
    if (email === 'admin@camerastore.com' || email === 'admin') {
      const adminUser = {
        id: 'usr-admin',
        name: 'Master Admin',
        email: 'admin@camerastore.com',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      };
      setUser(adminUser);
      localStorage.setItem('camerastore_user', JSON.stringify(adminUser));
      return { success: true, user: adminUser };
    }

    // Check registered users
    const found = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    const loggedUser = found || {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };

    if (!found) {
      setRegisteredUsers(prev => [...prev, loggedUser]);
    }

    setUser(loggedUser);
    localStorage.setItem('camerastore_user', JSON.stringify(loggedUser));
    return { success: true, user: loggedUser };
  };

  const register = (name, email, password) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: 'customer',
      joined: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };
    setRegisteredUsers(prev => [...prev, newUser]);
    setUser(newUser);
    localStorage.setItem('camerastore_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('camerastore_user');
  };

  return (
    <AuthContext.Provider value={{ user, registeredUsers, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
