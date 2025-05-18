import React from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';

/**
 * Pantalla de carga .
 * 
 * Esta pantalla muestra un logo y un indicador de carga (ActivityIndicator) 
 * mientras la aplicación espera algún proceso, como la carga de datos o la 
 * autenticación.
 * 
 * @returns {React.Element} La pantalla de carga con el logo y el indicador de carga.
 */
export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      {/* Logo de la aplicación */}
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain" 
      />
      {/* Indicador de carga */}
      <ActivityIndicator size="large" color="#1E3A34" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEAE3', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  logo: {
    width: 160, 
    height: 60, 
    marginBottom: 20, 
  },
});
