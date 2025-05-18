import * as Notifications from 'expo-notifications'; 
import * as Device from 'expo-device'; 
import * as SecureStore from 'expo-secure-store'; 
import axios from 'axios'; 
import { API_BASE_URL } from './config'; 

/**
 * IMPRESCINDIBLE PARA NOTIFICACIONES:
 * Registramos el token de notificaciones en Expo y lo envíamos al backend.
 * 
 * Esta función gestiona la obtención y el registro del token de notificación 
 * push de Expo para permitir el envío de notificaciones push.  
 * 
 * @throws {Error} Si ocurre un error durante el proceso de registro o en la comunicación con el backend.
 */
export async function registerPushToken() {
  try {
    
    const token = await SecureStore.getItemAsync('authToken');
    console.log('🔐 Auth token:', token);
    
    if (!token) {
      console.warn('⚠️ No hay token de usuario. No se puede registrar Expo token.');
      return;
    }
    
    if (!Device.isDevice) {
      console.warn('⚠️ Las notificaciones solo funcionan en dispositivos físicos');
      return;
    }

    // Gestionemos permisos, todo legal, of course
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    console.log('📱 Estado actual permisos:', existingStatus);
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log('📱 Nuevo estado permisos:', finalStatus);
    }
    
    if (finalStatus !== 'granted') {
      console.warn('⚠️ Permisos de notificaciones no concedidos');
      return;
    }

    // Aquí obtenemos el token expo. Sin él, no hay notificaciones
    const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync();
    console.log('Expo push token generado:', expoPushToken);

    // Y lo enviamos al backend para relacionarlo con el usuario
    const response = await axios.post(
      `${API_BASE_URL}/expo-token`, 
      { token: expoPushToken }, 
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    
    console.log('📡 Token enviado al backend. Respuesta:', response.data);
  } catch (error) {    
    console.error('❌ Error al registrar el token de notificaciones:', error);
  }
}
