import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getStoredSession,
  saveStoredSession,
  clearStoredSession,
  authenticateIdempiere,
  refreshIdempiereToken,
  logoutIdempiere,
  testErpConnectivity
} from '../services/idempiereAuth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession());
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [erpHealth, setErpHealth] = useState(null);

  // Comprobar salud del ERP al montar
  useEffect(() => {
    testErpConnectivity().then(res => setErpHealth(res));
  }, []);

  const login = useCallback(async (credentials, options = {}) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const activeSession = await authenticateIdempiere(credentials, options);
      setSession(activeSession);
      // Actualizar salud de ERP tras autenticación exitosa
      testErpConnectivity().then(res => setErpHealth(res));
      return activeSession;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (session?.token) {
      await logoutIdempiere(session.token);
    } else {
      clearStoredSession();
    }
    setSession(null);
  }, [session]);

  const refreshSession = useCallback(async () => {
    if (!session?.token) return null;
    try {
      const updated = await refreshIdempiereToken(session.token, session.refreshToken);
      setSession(updated);
      return updated;
    } catch (err) {
      console.error('Error al refrescar sesión:', err);
      logout();
      throw err;
    }
  }, [session, logout]);

  const checkHealth = useCallback(async (customUrl) => {
    const res = await testErpConnectivity(customUrl);
    setErpHealth(res);
    return res;
  }, []);

  const value = {
    session,
    token: session?.token || null,
    user: session?.user || null,
    role: session?.role || null,
    organization: session?.organization || null,
    warehouse: session?.warehouse || null,
    parameters: session?.parameters || null,
    isAuthenticated: !!session?.token,
    isSimulated: !!session?.isSimulated,
    simulationReason: session?.simulationReason || null,
    isAuthenticating,
    authError,
    setAuthError,
    erpHealth,
    login,
    logout,
    refreshSession,
    checkHealth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}

