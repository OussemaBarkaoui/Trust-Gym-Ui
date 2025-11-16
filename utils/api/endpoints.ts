/**
 * API endpoints configuration
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_OTP: "/auth/verify-otp",
  },

  // Member endpoints
  MEMBER: {
    PROFILE: "/member/profile",
    SUBSCRIPTIONS: "/member/subscriptions",
    PURCHASES: "/member/purchases",
    ACCESS_HISTORY: "/member/access-history",
    WALLET: "/member/wallet",
    WALLET_ENTRIES: "/member/wallet/entries",
    CHANGE_PASSWORD: "/member/change-password",
  },

  // Product endpoints
  PRODUCTS: {
    LIST: "/products",
    DETAILS: (id: string) => `/products/${id}`,
    IMAGE: (id: string) => `/products/${id}/image`,
  },

  // Subscription endpoints
  SUBSCRIPTIONS: {
    LIST: "/subscriptions",
    DETAILS: (id: string) => `http://192.168.1.18:3000/subscriptions/${id}`,
    RENEW: (id: string) =>
      `http://192.168.1.18:3000/subscriptions/${id}/renew`,
    UPGRADE: (id: string) =>
      `http://192.168.1.18:3000/subscriptions/${id}/upgrade`,
  },

  // Access endpoints
  ACCESS: {
    CHECK_IN: "/access/check-in",
    HISTORY: "/access/history",
    DETAILS: (id: string) => `/access/${id}`,
  },
} as const;
