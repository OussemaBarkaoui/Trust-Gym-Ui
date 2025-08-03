import { User } from "@/entities/User";
import axios from "axios";
const API_URL = "http://192.168.3.215:3000/api/auth";

export const verifyOtp = (email: string, otp: string) =>
  axios.post(`${API_URL}/verify-otp`, { email, otp });

export const resetPassword = (email: string, otp: string, newPassword: string) =>
  axios.patch(`${API_URL}/reset-password`, { email, otp, newPassword });

export const forgotPassword = (email: string) =>
  axios.post(`${API_URL}/forgot-password`, { email});

export const login = (user:User) =>
  axios.post(`${API_URL}/login`,  user );