import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { RouteProp, useRoute } from '@react-navigation/native';

// Definimos los tipos de datos para la denuncia
type Report = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  status: string;
  latitude: number;
  longitude: number;
  created_at: string;
};

// Y los parámetros de ruta
type RouteParams = {
  report: Report;
};

/**
 * Pantalla de detalle de la denuncia.
 * 
 * Este componente muestra toda la información de una denuncia seleccionada, incluyendo 
 * una imagen, título, descripción, estado, ubicación en el mapa y dirección aproximada.
 * 
 * @returns {React.Element} La pantalla de detalles de la denuncia.
 */
export default function ReportDetailScreen() {
  
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { report } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Muestra la imagen de la denuncia si está disponible */}
        {report.image_url && (
          <Image
            source={{ uri: report.image_url }}
            style={styles.image}
            resizeMode="cover" 
          />
        )}

        {/* Título de la denuncia */}
        <Text style={styles.title}>{report.title}</Text>
        {/* Fecha de creación de la denuncia */}
        <Text style={styles.date}>
          {new Date(report.created_at).toLocaleDateString()} {/* Formateamos la fecha */}
        </Text>

        {/* Sección de estado de la denuncia */}
        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Estado:</Text>
          <Text
            style={[
              styles.statusText,
              report.status === 'resolved' ? styles.resolved : styles.pending, 
            ]}
          >
            {report.status === 'resolved' ? 'Resuelta' : 'Pendiente'} 
          </Text>
        </View>

        {/* Sección de descripción de la denuncia */}
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>{report.description}</Text>

        {/* Sección de ubicación en el mapa */}
        <Text style={styles.sectionTitle}>Ubicación</Text>
        <MapView
          provider="google" 
          style={{ width: '100%', height: 180 }} 
          region={{
            latitude: parseFloat(report.latitude), 
            longitude: parseFloat(report.longitude), 
            latitudeDelta: 0.01, 
            longitudeDelta: 0.01, 
          }}
        >
          {/* Marcador de ubicación en el mapa */}
          <Marker
            coordinate={{
              latitude: parseFloat(report.latitude),
              longitude: parseFloat(report.longitude),
            }}
          />
        </MapView>

        {/* Sección de dirección aproximada de la denuncia. NO FUNCIONA. NO PROBADO */}
        <Text style={styles.sectionTitle}>Dirección aproximada</Text>
        <Text style={styles.addressText}>{report.address}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEAE3', 
  },
  scroll: {
    padding: 20, 
  },
  image: {
    width: '100%',
    height: 200, 
    borderRadius: 12, 
    marginBottom: 16, 
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A34', 
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#7B7B7B', 
    marginBottom: 12,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16, 
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A34', 
    marginRight: 8, 
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pending: {
    color: '#D97706', 
  },
  resolved: {
    color: '#10B981', 
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A34', 
    marginBottom: 4, 
  },
  description: {
    fontSize: 15,
    color: '#333', 
    marginBottom: 16, 
  },
  map: {
    height: 180,
    borderRadius: 12,
    marginBottom: 20, 
  },
  addressText: {
    fontSize: 14,
    color: '#555', 
    marginBottom: 16, 
  },
});
