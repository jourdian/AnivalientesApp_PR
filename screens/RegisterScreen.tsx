import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

/**
 * Pantalla de registro de usuario.
 * 
 * Este componente permite al usuario ingresar su nombre, email y contraseña para
 * registrarse. Sin embargo, al ser este un ejercicio para la Universidad, no se 
 * ha implementado el registro. Solo se muestra la pantalla.
 * @returns {React.Element} La pantalla de registro de usuario.
 */
export default function RegisterScreen() {
  const navigation = useNavigation();

  // Estados para el nombre, el email y la contraseña
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * Gestión de registro del usuario.
   * 
   * En esta versión de prueba, ya que el registro está deshabilitado, solo se muestra
   * una alerta indicando que los usuarios ya están creados manualmente.
   */
  const handleRegister = () => {
    Alert.alert(
      "Registro no disponible",
      "En esta versión de prueba, los usuarios ya están creados manualmente."
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo de la aplicación */}
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      {/* Texto informativo sobre el registro */}
      <Text style={styles.infoText}>
        Esta versión no permite registrar nuevos usuarios
      </Text>

      {/* Campo de texto para el nombre */}
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={firstName}
        onChangeText={setFirstName} 
      />

      {/* Campo de texto para el email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address" 
        autoCapitalize="none" 
        value={email}
        onChangeText={setEmail} 
      />

      {/* Campo de texto para la contraseña */}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry 
        value={password}
        onChangeText={setPassword} 
      />

      {/* Botón para registrar */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      {/* Enlace para navegar a la pantalla de inicio de sesión */}
      <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>

      {/* Pie de página con derechos reservados */}
      <Text style={styles.footer}>
        © Last Monkey Soft – Todos los derechos reservados – 2025
      </Text>
    </SafeAreaView>
  );
}

// Estilos para la pantalla de registro
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCE4B3", 
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain", 
    marginBottom: 20
  },
  infoText: {
    color: "#AF3E3E", 
    marginBottom: 20,
    textAlign: "center"
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc", 
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff" 
  },
  button: {
    backgroundColor: "#AF3E3E", 
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
    alignItems: "center"
  },
  buttonText: {
    color: "#fff", 
    fontSize: 16
  },
  link: {
    marginTop: 15,
    color: "#114D4D" 
  },
  footer: {
    marginTop: 30,
    fontSize: 12,
    color: "#444", 
    textAlign: "center"
  }
});
