/**
 * Enhanced session utilities and constants
 */

// Storage keys with namespace to prevent conflicts
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "@trust_gym_access_token",
  REFRESH_TOKEN: "@trust_gym_refresh_token",
  USER_PROFILE: "@trust_gym_user_profile",
  REMEMBER_ME: "@trust_gym_remember_me",
  SAVED_EMAIL: "@trust_gym_saved_email",
} as const;

// Session timeouts
export const SESSION_TIMEOUTS = {
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
  NETWORK_REQUEST_TIMEOUT: 30 * 1000, // 30 seconds
  RETRY_DELAY: 1000, // 1 second
  MAX_RETRY_ATTEMPTS: 3,
} as const;

/**
 * Validate session state structure
 */
export const isValidSessionState = (state: any): boolean => {
  return (
    state &&
    typeof state.isAuthenticated === "boolean" &&
    typeof state.isLoading === "boolean" &&
    (state.user === null || typeof state.user === "object") &&
    (state.accessToken === null || typeof state.accessToken === "string") &&
    (state.refreshToken === null || typeof state.refreshToken === "string")
  );
};

/**
 * Check if token is close to expiry
 */
export const isTokenExpiringSoon = (token: string): boolean => {
  try {
    // Basic JWT parsing (you might want to use a proper JWT library)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    return expiryTime - currentTime < SESSION_TIMEOUTS.TOKEN_REFRESH_THRESHOLD;
  } catch {
    return true; // If we can't parse, assume it's expiring
  }
};
