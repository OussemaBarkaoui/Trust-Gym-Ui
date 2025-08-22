import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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

interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider = React.memo<SessionProviderProps>(
  ({ children }) => {
    const [session, setSession] = useState<SessionState>({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: true,
    });

    const sessionManager = useMemo(() => SessionManager.getInstance(), []);

    useEffect(() => {
      // Initialize session on mount
      sessionManager.initializeSession();

      // Subscribe to session changes
      const unsubscribe = sessionManager.subscribe((newState) => {
        setSession(newState);
      });

      return unsubscribe;
    }, [sessionManager]);

    // Memoize context methods to prevent unnecessary re-renders
    const login = useCallback(
      async (loginResponse: LoginResponse, rememberMe: boolean = false) => {
        await sessionManager.login(loginResponse, rememberMe);
      },
      [sessionManager]
    );

    const logout = useCallback(async () => {
      await sessionManager.logout();
    }, [sessionManager]);

    const refreshToken = useCallback(
      async (newToken: string) => {
        await sessionManager.refreshToken(newToken);
      },
      [sessionManager]
    );

    const updateUserProfile = useCallback(
      async (user: UserProfile) => {
        await sessionManager.updateUserProfile(user);
      },
      [sessionManager]
    );

    const getSavedEmail = useCallback(async () => {
      return await sessionManager.getSavedEmail();
    }, [sessionManager]);

    const isRememberMeEnabled = useCallback(async () => {
      return await sessionManager.isRememberMeEnabled();
    }, [sessionManager]);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo<SessionContextType>(
      () => ({
        session,
        login,
        logout,
        refreshToken,
        updateUserProfile,
        getSavedEmail,
        isRememberMeEnabled,
      }),
      [
        session,
        login,
        logout,
        refreshToken,
        updateUserProfile,
        getSavedEmail,
        isRememberMeEnabled,
      ]
    );

    return (
      <SessionContext.Provider value={contextValue}>
        {children}
      </SessionContext.Provider>
    );
  }
);

SessionProvider.displayName = "SessionProvider";

/**
 * Hook to access session context with error handling
 */
export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);

  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
};
