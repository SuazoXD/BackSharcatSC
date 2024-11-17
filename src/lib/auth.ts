// utils/auth.js
import { userPayload } from '@/app/home/interfaces/userPayload-int';
import {jwtDecode} from 'jwt-decode';

export const isTokenExpired = (token: string) => {
  if (!token) return true;

  try {
    const decodedToken: userPayload = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (e) {
    console.log(e)
    return true; 
  }
};

export const getAccessToken = () => {
  return sessionStorage.getItem("access_token");
};