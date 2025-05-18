
import React from "react";
import { NavigationContainer } from "@react-navigation/native";/
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Pantallas para la navegación
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import MainTabs from "./MainTabs"; // La pantalla principal se compone de dos tabs(Denuncias y Configuración)


const Stack = createNativeStackNavigator();

/**
 * Componente que configura la navegación de la aplicación.
 * 
 * Este componente utiliza un stack navigator para gestionar las pantallas de la aplicación.
 * Las pantallas incluidas son:
 * 1. WelcomeScreen: Pantalla de bienvenida.
 * 2. LoginScreen: Pantalla de inicio de sesión.
 * 3. RegisterScreen: Pantalla de registro.
 * 4. MainTabs: Pantalla principal con las pestañas después del inicio de sesión.
 * 
 * @returns {React.Element} El contenedor de navegación con el stack configurado.
 */
export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Pantalla de bienvenida */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        {/* Pantalla de inicio de sesión */}
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* Pantalla de registro */}
        <Stack.Screen name="Register" component={RegisterScreen} />
        {/* Pantalla principal con pestañas después del login */}
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
