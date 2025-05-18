import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert  
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Switch } from "react-native";

/**
 * Pantalla de configuración.
 * 
 * LA opción más importante es la de PROTEGER LA INTIMIDAD
 * DEL EVALUADOR. Esa opción permite anonimizar la ubicación real
 * de la denuncia.
 * 
 * @returns {React.Element} La pantalla de configuración.
 */
export default function SettingsScreen() {
  const navigation = useNavigation();

  // Estado para controlar si la protección de ubicación está activada o no
    const [privacyEnabled, setPrivacyEnabled] = useState(false);

  /**
   * Cerrar sesión.
   * 
   * Esta función elimina el token de autenticación guardado y redirige al usuario a la pantalla de bienvenida.
   */
  const handleLogout = async () => {
    
    await SecureStore.deleteItemAsync("authToken");
    
    navigation.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    });
  };

  
  const settings = [
    {
      icon: "person-circle-outline",
      label: "Mi perfil",
      action: () => navigation.navigate("ProfileScreen"), 
    },
    {
      icon: "moon-outline",
      label: "Preferencias de visualización",
      action: () => Alert.alert("En desarrollo", "Esta opción aún no está disponible."),
    },
    {
      icon: "language-outline",
      label: "Idioma",
      action: () => Alert.alert("En desarrollo", "Esta opción aún no está disponible."),
    },
    {
      icon: "notifications-outline",
      label: "Notificaciones",
      action: () => navigation.navigate("NotificationSettings"), 
    },
    {
      icon: "log-out-outline",
      label: "Cerrar sesión",
      action: handleLogout, 
    },
  ];

  // useEffect para inicializar el estado de privacidad (si está activada o no)
  useEffect(() => {
    (async () => {
      const value = await SecureStore.getItemAsync("privacyMode");
      setPrivacyEnabled(value === "true"); 
    })();
  }, []);
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.list}>
        {/* Opción para activar o desactivar la protección de ubicación */}
        <View style={styles.option}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="eye-off-outline" size={22} color="#1E3A34" />
            <Text style={styles.label}>Proteger ubicación real</Text>
          </View>
          <Switch
            value={privacyEnabled} 
            onValueChange={async (value) => {
              
              await SecureStore.setItemAsync("privacyMode", value.toString());
              setPrivacyEnabled(value); 
              
              Alert.alert(
                "Protección de ubicación",
                value
                  ? "La ubicación será sustituida por una aleatoria dentro de la demarcación."
                  : "La ubicación real volverá a usarse en las denuncias."
              );
            }}
            trackColor={{ false: "#D6D3CB", true: "#1E3A34" }} 
            thumbColor="#FFF" 
          />
        </View>

        {/* Las opciones están definidas arriba. Aquí las mapeamos */}
        {settings.map((item, index) => (
          <TouchableOpacity key={index} style={styles.option} onPress={item.action}>
            <Ionicons name={item.icon as any} size={22} color="#1E3A34" />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
    marginBottom: 24,
    color: "#1E3A34",
  },
  list: {
    paddingBottom: 40,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#D6D3CB", 
  },
  label: {
    fontSize: 16,
    marginLeft: 12,
    color: "#1E3A34", 
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between", 
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#D6D3CB", 
  },
});
