import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// SafeAreaView es necesario para evitar que el contenido se solape con la barra de navegación
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Pantalla de bienvenida de la aplicación AniValientes.
 * 
 * Esta pantalla da la bienvenida al usuario y ofrece dos opciones: iniciar sesión
 * o registrarse en la aplicación. 
 * 
 * @returns {React.Element} La pantalla de bienvenida.
 */
export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo de la aplicación */}
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      {/* Título de la pantalla */}
      <Text style={styles.title}>Bienvenido a AniValientes</Text>

      {/* Botón para navegar a la pantalla de inicio de sesión */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login" as never)} // Redirige a la pantalla de Login
      >
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      {/* Botón para navegar a la pantalla de registro */}
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]} // Aplica estilos secundarios para diferenciarlo
        onPress={() => navigation.navigate("Register" as never)} // Redirige a la pantalla de Register
      >
        <Text style={styles.secondaryButtonText}>Registrarse</Text>
      </TouchableOpacity>

      {/* Pie de página con derechos reservados */}
           <Text style={styles.footer}>
        Jordi Hernández Vinyals - Proyecto 3 - Media - UOC
      </Text>
      <Text style={styles.footer}>
        © Last Monkey Soft – Todos los derechos reservados – 2025
      </Text>   
    </SafeAreaView>
  );
}

// Estilos para la pantalla de bienvenida
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCE4B3", 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 20
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain", 
    marginBottom: 40
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 40,
    textAlign: "center", 
    color: "#114D4D" 
  },
  button: {
    backgroundColor: "#114D4D", 
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%", 
    alignItems: "center" 
  },
  buttonText: {
    color: "#fff", 
    fontSize: 16
  },
  secondaryButton: {
    backgroundColor: "#fff", 
    borderWidth: 1, 
    borderColor: "#114D4D" 
  },
  secondaryButtonText: {
    color: "#114D4D", 
    fontSize: 16
  },
  footer: {
    marginTop: 30,
    fontSize: 12,
    color: "#444", 
    textAlign: "center" 
  }
});
