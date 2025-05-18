import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_BASE_URL } from '../services/config';

/**
 * Pantalla que muestra la información del perfil del usuario.
 * 
 * Este componente obtiene y muestra los detalles del perfil del usuario, como su nombre, 
 * correo electrónico, teléfono y dirección. 
 * Al ser un ejercicio acadámico, solo muestro los datos. En esta demo no se permite
 * el registro de usuarios ni la modificación de perfil.
 * 
 * @returns {React.Element} 
 */
export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Carga de perfil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        
        const token = await SecureStore.getItemAsync('authToken');
        
        const response = await axios.get(`${API_BASE_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setUser(response.data);
      } catch (error) {
        console.error('Error cargando el perfil:', error);
        
        Alert.alert('Error', 'No se pudo cargar el perfil del usuario.');
      } finally {
        
        setLoading(false);
      }
    };

    fetchProfile(); 
  }, []);

  
  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#1E3A34" />
      </View>
    );
  }

  // Oh, no! No hemos podido cargar la información!
  if (!user) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>No se pudo obtener la información del usuario.</Text>
      </View>
    );
  }

  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Título de la pantalla */}
        <Text style={styles.header}>Mi perfil</Text>
        {/* Nota que informa que los datos no pueden ser modificados */}
        <Text style={styles.note}>* Esta información no puede modificarse</Text>

        {/* Nombre del usuario */}
        <View style={styles.field}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{user.first_name} {user.last_name}</Text>
        </View>

        {/* Email */}
        <View style={styles.field}>
          <Text style={styles.label}>Correo electrónico:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        {/* Teléfono */}
        <View style={styles.field}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value}>{user.phone || 'No disponible'}</Text>
        </View>

        {/* Dirección */}
        <View style={styles.field}>
          <Text style={styles.label}>Dirección:</Text>
          <Text style={styles.value}>
            {user.address || 'No disponible'}
          </Text>
        </View>

        {/* Administración asociada al domicilio */}
        {user.administration_name && (
          <View style={styles.field}>
            <Text style={styles.label}>Administración asociada:</Text>
            <Text style={styles.value}>{user.administration_name}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEAE3',
    paddingHorizontal: 20,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    paddingVertical: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E3A34',
    marginBottom: 6,
  },
  note: {
    fontSize: 14,
    color: '#7B7B7B',
    marginBottom: 20,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A34',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 16,
  },
});
