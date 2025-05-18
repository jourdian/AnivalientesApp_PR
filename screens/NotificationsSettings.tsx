import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  SafeAreaView,
  Alert,
  Platform,
} from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { API_BASE_URL } from "../services/config";

/**
 * Pantalla de configuración de notificaciones.
 * NOTA: No se han hecho pruebas adecuadas. No se garantiza el buen funcionamiento
 * Este componente permite al usuario activar o desactivar las notificaciones push. 
 * Si las notificaciones están habilitadas, el token de dispositivo se registra en el backend.
 * 
 * @returns {React.Element} La pantalla de configuración de notificaciones.
 */
export default function NotificationSettings() {
  // Estado para controlar activación de notificaciones
  const [enabled, setEnabled] = useState(true); 
  const [loading, setLoading] = useState(true); 

  
  useEffect(() => {
    const init = async () => {      
      const stored = await SecureStore.getItemAsync("notificationsEnabled");

      if (stored === "false") {
        setEnabled(false); 
      } else {
        await registerForPushNotifications(); 
      }

      setLoading(false); 
    };

    init();
  }, []);

  /**
   * Solicitud de permisos para recibir notificaciones push y registra el token.
   * 
   * Si el dispositivo tiene permisos para recibir notificaciones, se obtiene el token
   * y se guarda en el backend para recibir futuras notificaciones.
   */
  const registerForPushNotifications = async () => {
    if (!Device.isDevice) {
      Alert.alert("Error", "Las notificaciones solo funcionan en dispositivos reales.");
      return;
    }

    // Solicitud de permisos (seamos legales)
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {      
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Permiso denegado", "No se pueden activar las notificaciones.");
      return;
    }
    
    const token = (await Notifications.getExpoPushTokenAsync()).data;

    const authToken = await SecureStore.getItemAsync("authToken");
    await axios.post(`${API_BASE_URL}/expo-token`, { token }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    
    await SecureStore.setItemAsync("notificationsEnabled", "true");
  };

  /**
   * Cuando desactivamos las notificaciones push, eliminamos el token del backend.
   * 
   * Esta función elimina el token de notificación del backend y actualiza el estado
   * de las notificaciones en SecureStore a "false".
   */
  const disableNotifications = async () => {
    const authToken = await SecureStore.getItemAsync("authToken");
    
    await axios.delete(`${API_BASE_URL}/expo-token`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    
    await SecureStore.setItemAsync("notificationsEnabled", "false");
  };

  /**
   * Gestión del selector para activar o desactivar las notificaciones.
   * 
   * Si las notificaciones están activadas, llama a `registerForPushNotifications()`.
   * Si se desactivan, llama a `disableNotifications()`.
   */
  const toggleSwitch = async () => {
    const newValue = !enabled;
    setEnabled(newValue);
    
    if (newValue) {
      await registerForPushNotifications();
      Alert.alert("Notificaciones activadas");
    } else {
      await disableNotifications();
      Alert.alert("Notificaciones desactivadas");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Título de la pantalla */}
      <Text style={styles.title}>Notificaciones</Text>

      {/* Opción para activar o desactivar las notificaciones */}
      <View style={styles.option}>
        <Text style={styles.label}>Recibir notificaciones</Text>
        <Switch
          value={enabled} 
          onValueChange={toggleSwitch} 
          disabled={loading} 
          trackColor={{ false: "#ccc", true: "#34D399" }} 
          thumbColor={enabled ? "#1E3A34" : "#f4f3f4"} 
        />
      </View>

      {/* Nota informativa sobre las notificaciones */}
      <Text style={styles.note}>
        * Puedes activar o desactivar las notificaciones en cualquier momento.
      </Text>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEAE3",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E3A34",
    marginBottom: 24,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "#1E3A34",
  },
  note: {
    fontSize: 14,
    color: "#666",
    marginTop: 24,
  },
});
