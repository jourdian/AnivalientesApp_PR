import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

/**
 * Componente principal que gestiona las pestañas de la aplicación.
 * 
 * En este componente se definen las pestañas que estarán disponibles en la navegación,
 * y se configuran sus pantallas, iconos y títulos. Las pestañas incluyen:
 * - "Mis denuncias": Pantalla principal de denuncias.
 * - "Configuración": Pantalla de configuración de la app.
 * 
 * @returns {React.Element} El tab navigator con las pantallas configuradas.
 */
export default function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      {/* Pestaña de "Mis denuncias" */}
      <Tab.Screen
        name="Mis denuncias"
        component={HomeScreen}
        options={{
          headerShown: true, 
          title: "Mis denuncias", 
          tabBarIcon: ({ color, size }) => (            
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Pestaña de "Configuración" */}
      <Tab.Screen
        name="Configuración"
        component={SettingsScreen}
        options={{
          headerShown: true, 
          title: "Configuración", 
          tabBarIcon: ({ color, size }) => (            
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
