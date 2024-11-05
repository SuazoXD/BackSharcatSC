// utils/auth.js
import {jwtDecode} from 'jwt-decode';

export const getUserDataFromToken = () => {
  if (typeof window === 'undefined') return null;

  const token = sessionStorage.getItem('access_token');
  
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};
