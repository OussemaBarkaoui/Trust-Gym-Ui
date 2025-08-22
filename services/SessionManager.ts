import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginResponse, UserProfile } from "../entities/User";
import { STORAGE_KEYS } from "./sessionUtils";

export interface SessionState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
}

type SessionListener = (state: SessionState) => void;

export class SessionManager {
  private static instance: SessionManager | null = null;
  private sessionState: SessionState = {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,
  };

  private listeners: Set<SessionListener> = new Set();

  private constructor() {
    // Private constructor for singleton
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Subscribe to session state changes
   */
  subscribe(listener: SessionListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get current session state (read-only)
   */
  getSessionState(): Readonly<SessionState> {
    return { ...this.sessionState };
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getSessionState());
      } catch (error) {
        console.error("Error in session listener:", error);
      }
    });
  }

  /**
   * Update session state and notify listeners
   */
  private updateSessionState(updates: Partial<SessionState>): void {
    this.sessionState = { ...this.sessionState, ...updates };
    this.notifyListeners();
  }

  /**
   * Initialize session from stored data
   */
  async initializeSession(): Promise<void> {
    try {
      const [accessToken, refreshToken, userProfile] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE),
      ]);

      if (accessToken && refreshToken && userProfile) {
        const user = JSON.parse(userProfile);

        // Validate parsed user data
        if (this.isValidUserProfile(user)) {
          this.updateSessionState({
            isAuthenticated: true,
            user,
            accessToken,
            refreshToken,
            isLoading: false,
          });
          return;
        }
      }

      // If we reach here, session is invalid
      await this.clearInvalidSession();
    } catch (error) {
      console.error("Error initializing session:", error);
      await this.clearInvalidSession();
    }
  }

  /**
   * Clear invalid session data
   */
  private async clearInvalidSession(): Promise<void> {
    await this.clearStoredSession();
    this.updateSessionState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
    });
  }

  /**
   * Validate user profile structure
   */
  private isValidUserProfile(user: any): user is UserProfile {
    return (
      user &&
      typeof user === "object" &&
      typeof user.id === "string" &&
      typeof user.email === "string"
    );
  }

  /**
   * Clear all stored session data
   */
  private async clearStoredSession(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE),
        AsyncStorage.removeItem(STORAGE_KEYS.REMEMBER_ME),
        AsyncStorage.removeItem(STORAGE_KEYS.SAVED_EMAIL),
      ]);
    } catch (error) {
      console.error("Error clearing stored session:", error);
    }
  }

  /**
   * Login with credentials
   */
  async login(
    loginResponse: LoginResponse,
    rememberMe: boolean = false
  ): Promise<void> {
    try {
      const { accessToken, refreshToken, user } = loginResponse;

      if (!accessToken || !refreshToken || !user) {
        throw new Error("Invalid login response: missing required fields");
      }

      // Store session data
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
        AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
        AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user)),
      ]);

      // Handle remember me preference
      if (rememberMe) {
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, "true"),
          AsyncStorage.setItem(STORAGE_KEYS.SAVED_EMAIL, user.email || ""),
        ]);
      } else {
        await Promise.all([
          AsyncStorage.removeItem(STORAGE_KEYS.REMEMBER_ME),
          AsyncStorage.removeItem(STORAGE_KEYS.SAVED_EMAIL),
        ]);
      }

      // Update session state
      this.updateSessionState({
        isAuthenticated: true,
        user,
        accessToken,
        refreshToken,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  /**
   * Logout and clear session
   */
  async logout(): Promise<void> {
    try {
      await this.clearStoredSession();
      this.updateSessionState({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(newAccessToken: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
      this.updateSessionState({
        accessToken: newAccessToken,
      });
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(user: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROFILE,
        JSON.stringify(user)
      );
      this.updateSessionState({
        user,
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  /**
   * Get saved email if remember me is enabled
   */
  async getSavedEmail(): Promise<string | null> {
    try {
      const rememberMe = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
      if (rememberMe === "true") {
        return await AsyncStorage.getItem(STORAGE_KEYS.SAVED_EMAIL);
      }
      return null;
    } catch (error) {
      console.error("Error getting saved email:", error);
      return null;
    }
  }

  /**
   * Check if remember me is enabled
   */
  async isRememberMeEnabled(): Promise<boolean> {
    try {
      const rememberMe = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
      return rememberMe === "true";
    } catch (error) {
      console.error("Error checking remember me status:", error);
      return false;
    }
  }
}
