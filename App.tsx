import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import { LogBox, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import { AndroidImportance } from "expo-notifications";

// Pantallas
import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MainTabs from "./navigation/MainTabs";
import LoadingScreen from "./screens/LoadingScreen";
import NewReportScreen from "./screens/NewReportScreen";
import ReportDetailScreen from "./screens/ReportDetailScreen";
import ProfileScreen from "./screens/ProfileScreen";
import NotificationSettings from "./screens/NotificationsSettings";

// Tipos y servicios
import { RootStackParamList } from "./types";
import { registerPushToken } from "./services/notifications";
import { navigationRef } from "./services/navigationRef";


const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Componente principal.
 * 
 * Éste es el componente principal. Aquí se configura y gestiona el flujo de navegación
 * y la configuración general(notificaciones, autenticación...)
 * 
 * @returns {React.Element} El componente principal de la aplicación.
 */
export default function App() {
 
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  // Los logs molestan bastante. Los desactivo por comodidad
  LogBox.ignoreAllLogs(false);

  
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error("🟥 ERROR GLOBAL:", error);
    if (isFatal) {
      console.error("🔥 Error fatal detectado:", error.message);
    } else {
      console.warn("⚠️ Error no fatal:", error.message);
    }
  });

  // Por defecto, el canal de notificaciones es "default" 
  // Aquí configuramos las notificaciones con Expo
  useEffect(() => {
    Notifications.setNotificationChannelAsync("default", {
      name: "default", 
      importance: AndroidImportance.MAX, 
      vibrationPattern: [0, 250, 250, 250], 
      lightColor: "#FF231F7C", 
      enableVibrate: true, 
    });
  }, []);

  // El token de notificaciones(expo_token) se registra después del login
  // Si de alguna forma llegamos a la página de denuncias sin pasar por el
  // login(yo no lo he conseguido), las notificaciones no funcionarán
  useEffect(() => {
    registerPushToken();
  }, []);

  /**
   * Muestra una alerta con la notificación recibida.
   * 
   * Las notificaciones se muestran de diferentes forma y por diferentes motivos.
   * Por un lado tenemos la actualización de denuncia. Si la administración actualiza
   * el estado(nueva actuación, cambio de urgencia o estado de la denuncia), se envía
   * una notificación indicando cambio de estado. Pero la administración también puede 
   * enviar notificaciones personalizada para lo que necesite(citar al usuario, solicitar
   * más información, etc...)   
   * 
   * Cuando la app está cerrada, la notificación llega de la forma habitual(a la bandeja
   * de notificaciones y se muestra un banner) Pero si la app está abierta, se muestra una
   * ventana de comunicación(de momento un simple Alert)
   * 
   * @param data - Los datos de la notificación recibida.
   */
  const showNotificationAlert = (data: any) => {
    const type = data?.type || "unknown"; 
    const admin =
      typeof data?.administration === "string" && data.administration.trim()
        ? data.administration
        : "Administración"; 

    // Si la notificación es por actualización de denuncia
    if (type === "update") {
      const title = data.reportTitle || "una denuncia";
      const responseText = data.response || "Sin respuesta";

      const statusLabel = {
        pending: "pendiente",
        reviewing: "en proceso",
        resolved: "resuelta",
        dismissed: "desestimada",
      }[data.status] || data.status; 

      const severityLabel = {
        low: "baja",
        medium: "media",
        high: "alta",
      }[data.severity] || data.severity; 

      /**  Uso emojis UNICODE para asegurarme de que aparecerán correctamente 
      * sin grandes complicaciones. Al ser una demo para una asignatura, 
      * muestro una alerta sencilla. En versiones posteriores se puede crear 
      * un modal más elegante y completo. */
      Alert.alert(
        `📢 Actualización de denuncia`,
        `Su denuncia "${title}" ha sido actualizada.\n\n` +
          `ACTUACIÓN: ${responseText}\n` +
          `ESTADO: ${statusLabel}\n` +
          `URGENCIA: ${severityLabel}`
      );
    } else if (type === "manual") {
      const message = data.message || "Se ha enviado una notificación.";
      Alert.alert(`📢 Notificación de ${admin}`, message); 
    } else {
      Alert.alert("📢 Notificación", "Has recibido una notificación."); 
    }
  };

  /** Aquí gestiono si las notificaciones se reciben estando la app en primer plano,
   * y, por tanto, hay que mostrar un Alert */
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      const data = notification.request.content.data as any; 
      showNotificationAlert(data); 
    });
    return () => subscription.remove(); 
  }, []);

  /** Y aquí cuando está en segundo plano */  
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as any; 
      showNotificationAlert(data); 
    });
    return () => subscription.remove(); 
  }, []);

  
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true, 
      shouldPlaySound: false, 
      shouldSetBadge: false, 
      shouldShowBanner: true, 
      shouldShowList: true, 
    }),
  });

  /** Si tenemos el token de autenticación, vamos a la pantalla de bienvenida */
  useEffect(() => {
    const checkAuthToken = async () => {
      const token = await SecureStore.getItemAsync("authToken");
      setInitialRoute(token ? "MainTabs" : "Welcome"); 
    };
    checkAuthToken();
  }, []);

  
  if (initialRoute === null) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {/* Stack de navegación y la ruta inicial */}
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        {/* Pantallas disponibles */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="NewReportScreen"
          component={NewReportScreen}
          options={{ headerShown: true, title: "Detalle de denuncia" }}
        />
        <Stack.Screen
          name="ReportDetailScreen"
          component={ReportDetailScreen}
          options={{ headerShown: true, title: "Detalle de denuncia" }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ headerShown: true, title: "Perfil de usuario" }}
        />
        <Stack.Screen
          name="NotificationSettings"
          component={NotificationSettings}
          options={{ headerShown: true, title: "Notificaciones" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
