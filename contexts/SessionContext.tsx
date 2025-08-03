import React, { createContext, useContext, useEffect, useState } from "react";
import { LoginResponse, UserProfile } from "../entities/User";
import { SessionManager, SessionState } from "../services/SessionManager";

interface SessionContextType {
  session: SessionState;
  login: (loginResponse: LoginResponse, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: (newToken: string) => Promise<void>;
  updateUserProfile: (user: UserProfile) => Promise<void>;
  getSavedEmail: () => Promise<string | null>;
  isRememberMeEnabled: () => Promise<boolean>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<SessionState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,
  });

  const sessionManager = SessionManager.getInstance();

  useEffect(() => {
    sessionManager.initializeSession();

    const unsubscribe = sessionManager.subscribe((newState) => {
      setSession(newState);
    });

    return unsubscribe;
  }, []);

  const login = async (
    loginResponse: LoginResponse,
    rememberMe: boolean = false
  ) => {
    await sessionManager.login(loginResponse, rememberMe);
  };

  const logout = async () => {
    await sessionManager.logout();
  };

  const refreshToken = async (newToken: string) => {
    await sessionManager.refreshAccessToken(newToken);
  };

  const updateUserProfile = async (user: UserProfile) => {
    await sessionManager.updateUserProfile(user);
  };

  const getSavedEmail = async () => {
    return await sessionManager.getSavedEmail();
  };

  const isRememberMeEnabled = async () => {
    return await sessionManager.isRememberMeEnabled();
  };

  const value: SessionContextType = {
    session,
    login,
    logout,
    refreshToken,
    updateUserProfile,
    getSavedEmail,
    isRememberMeEnabled,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
