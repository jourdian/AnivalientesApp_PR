import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "../services/config";
import { registerPushToken } from "../services/notifications";

/**
 * Pantalla de inicio de sesión para los usuarios.
 *
 * Este componente permite a los usuarios introducir su email y contraseña para
 * acceder a la aplicación. Al iniciar sesión, el token de autenticación se guarda
 * de manera segura y el usuario es redirigido a la pantalla principal de la app.
 *
 * @returns {React.Element} El formulario de inicio de sesión.
 */
export default function LoginScreen() {
  const navigation = useNavigation();

  // Estado para email, contraseña y estado de visibilidad de la contraseña
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Función de gestión de inicio de sesión.
   *
   * Valida que se haya introducido un email y una contraseña, luego realiza una
   * solicitud POST al servidor para autenticar al usuario. Si el login es exitoso,
   * el token recibido se guarda de manera segura y se redirige al usuario a la
   * pantalla principal.
   */
  const handleLogin = async () => {
    // Control de seguridad(email y la contraseña no deben estar vacíos)
    if (!email || !password) {
      Alert.alert("Error", "Introduce tu email y contraseña.");
      return;
    }

    console.log("Intentando login con:", email, password);

    try {
      // Autenticamos...
      const response = await axios.post(
        `${API_BASE_URL}/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Respuesta del login:", response.data);

      const token = response.data.token;

      if (!token) {
        throw new Error("Token no recibido");
      }

      await SecureStore.setItemAsync("authToken", token);

      // REGISTRO DEL PUSH TOKEN
      // Esto es importantísimo. Si no se almacena el token
      // no será posible recibir notificaciones
      await registerPushToken();

      navigation.navigate("MainTabs" as never);
    } catch (error: any) {
      console.error(
        "Login error completo:",
        JSON.stringify(error.response?.data || error.message || error, null, 2)
      );
      Alert.alert("Error", "Credenciales incorrectas o problema de red.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%", alignItems: "center" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Logo de la aplicación */}
        <Image source={require("../assets/logo.png")} style={styles.logo} />

        {/* Campo de texto para el email */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Contenedor de la contraseña */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          {/* Botón para mostrar/ocultar la contraseña */}
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.eyeButton}
          >
            <Text>{showPassword ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>

        {/* Botón para iniciar sesión */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        {/* Enlace para redirigir a la pantalla de registro */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Register" as never)}
        >
          <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>

        {/* Pie de página */}
        <Text style={styles.footer}>
          Jordi Hernández Vinyals - Proyecto 3 - Media - UOC
        </Text>
        <Text style={styles.footer}>
          © Last Monkey Soft – Todos los derechos reservados – 2025
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCE4B3", 
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain", 
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc", 
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#114D4D", 
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff", 
    fontSize: 16,
  },
  link: {
    marginTop: 15,
    color: "#114D4D",
  },
  footer: {
    marginTop: 30,
    fontSize: 12,
    color: "#444",
    textAlign: "center",
  },
  passwordContainer: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
  },
  eyeButton: {
    paddingHorizontal: 10,
  },
});
