import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginResponse, UserProfile } from "../entities/User";

// Storage keys
const ACCESS_TOKEN_KEY = "@trust_gym_access_token";
const REFRESH_TOKEN_KEY = "@trust_gym_refresh_token";
const USER_PROFILE_KEY = "@trust_gym_user_profile";
const REMEMBER_ME_KEY = "@trust_gym_remember_me";
const SAVED_EMAIL_KEY = "@trust_gym_saved_email";

export interface SessionState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
}

export class SessionManager {
  private static instance: SessionManager;
  private sessionState: SessionState = {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,
  };

  private listeners: Array<(state: SessionState) => void> = [];

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  // Subscribe to session changes
  subscribe(listener: (state: SessionState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.sessionState));
  }

  async initializeSession(): Promise<void> {
    try {
      const [accessToken, refreshToken, userProfile] = await Promise.all([
        AsyncStorage.getItem(ACCESS_TOKEN_KEY),
        AsyncStorage.getItem(REFRESH_TOKEN_KEY),
        AsyncStorage.getItem(USER_PROFILE_KEY),
      ]);

      if (accessToken && refreshToken && userProfile) {
        this.sessionState = {
          isAuthenticated: true,
          user: JSON.parse(userProfile),
          accessToken,
          refreshToken,
          isLoading: false,
        };
      } else {
        this.sessionState.isLoading = false;
      }
    } catch (error) {
      this.sessionState.isLoading = false;
    }

    this.notifyListeners();
  }

  async login(
    loginResponse: LoginResponse,
    rememberMe: boolean = false
  ): Promise<void> {
    try {
      const { accessToken, refreshToken, user } = loginResponse;

      if (!accessToken || !refreshToken || !user) {
        throw new Error("Invalid login response: missing required fields");
      }

      await Promise.all([
        AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken),
        AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken),
        AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user)),
      ]);

      if (rememberMe) {
        await Promise.all([
          AsyncStorage.setItem(REMEMBER_ME_KEY, "true"),
          AsyncStorage.setItem(SAVED_EMAIL_KEY, user.email || ""),
        ]);
      } else {
        await Promise.all([
          AsyncStorage.removeItem(REMEMBER_ME_KEY),
          AsyncStorage.removeItem(SAVED_EMAIL_KEY),
        ]);
      }

      this.sessionState = {
        isAuthenticated: true,
        user,
        accessToken,
        refreshToken,
        isLoading: false,
      };

      this.notifyListeners();
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
        AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_PROFILE_KEY),
        AsyncStorage.removeItem(REMEMBER_ME_KEY),
        AsyncStorage.removeItem(SAVED_EMAIL_KEY),
      ]);

      this.sessionState = {
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
      };

      this.notifyListeners();
    } catch (error) {
      throw error;
    }
  }

  async refreshAccessToken(newAccessToken: string): Promise<void> {
    try {
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
      this.sessionState.accessToken = newAccessToken;
      this.notifyListeners();
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfile(user: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user));
      this.sessionState.user = user;
      this.notifyListeners();
    } catch (error) {
      throw error;
    }
  }

  getSessionState(): SessionState {
    return { ...this.sessionState };
  }

  async getSavedEmail(): Promise<string | null> {
    try {
      const rememberMe = await AsyncStorage.getItem(REMEMBER_ME_KEY);
      if (rememberMe === "true") {
        return await AsyncStorage.getItem(SAVED_EMAIL_KEY);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async isRememberMeEnabled(): Promise<boolean> {
    try {
      const rememberMe = await AsyncStorage.getItem(REMEMBER_ME_KEY);
      return rememberMe === "true";
    } catch (error) {
      return false;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
        AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_PROFILE_KEY),
        AsyncStorage.removeItem(REMEMBER_ME_KEY),
        AsyncStorage.removeItem(SAVED_EMAIL_KEY),
      ]);

      this.sessionState = {
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
      };

      this.notifyListeners();
    } catch (error) {
      throw error;
    }
  }
}
