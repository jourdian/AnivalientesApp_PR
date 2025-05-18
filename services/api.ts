/** Este servicio se encarga de crear una instancia personalizada de Axios
 *  para centralizar las peticiones HTTP. 
 * De esta forma, la inclusión del token de autenticación,
 * por ejemplo, se hace de forma automática */

import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "./config";

// Crear una instancia de axios con la configuración base
const api = axios.create({
  baseURL: API_BASE_URL, 
  timeout: 10000 
});

// Interceptor para añadir el token de autenticación a cada solicitud
api.interceptors.request.use(
  async (config) => {
    try {
      
      const token = await SecureStore.getItemAsync("authToken");
      
      if (token) {
        config.headers = config.headers || {}; 
        config.headers.Authorization = `Bearer ${token}`; 
      }
      
      return config;
    } catch (error) {
      
      console.error("Error al recuperar el token:", error);
      return config;
    }
  },
  (error) => {    
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globales en las solicitudes
api.interceptors.request.use(
  async (config) => {
    try {
      
      const token = await SecureStore.getItemAsync("authToken");
      
      if (token) {
        config.headers = config.headers || {}; 
        config.headers.Authorization = `Bearer ${token}`; 
      }

      // Devuelve la configuración de la solicitud
      return config;
    } catch (error) {
      
      console.error("Error al recuperar el token:", error);
      return config;
    }
  },
  (error) => {
    
    return Promise.reject(error);
  }
);


export default api;
