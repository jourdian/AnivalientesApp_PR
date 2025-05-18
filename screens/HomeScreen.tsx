import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL } from "../services/config";
import * as SecureStore from 'expo-secure-store';
import NewReportScreen from './NewReportScreen';

export default function HomeScreen() {
  const navigation = useNavigation();
  // Estados para manejar las denuncias
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'resolved'>('pending');

  // Gestión de carga de denuncias
  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Necesitamos el token de autenticación porque he implementado protección CSRF
        const token = await SecureStore.getItemAsync('authToken');
        console.log('Token actual:', token);

        // Obtenemos las denuncias mediante una petición GET
        const response = await axios.get(`${API_BASE_URL}/reports`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });        
        setReports(response.data);
        setFilteredReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {        
        setLoading(false);
      }
    };

    fetchReports(); 
  }, []);

  // Control de filtro de búsqueda. Cuando se rellena el cuadro de búsqueda, los resultados se adaptan
  // Podemos fitrar tanto por estado de la denuncia como por contenido en el título
  useEffect(() => {
    const filtered = reports
      .filter((report: any) => report.status === activeTab) 
      .filter((report: any) =>
        report.title.toLowerCase().includes(search.toLowerCase()) 
      );
    setFilteredReports(filtered); 
  }, [search, activeTab, reports]); 

  // Esta función se encarga de mostrar la lista de denuncias
  const renderReport = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ReportDetailScreen", { report: item })}
    >
      <View style={styles.card}>
        {item.image_url && (
          <Image
            source={{ uri: item.image_url }} 
            style={styles.cardThumbnail}
            resizeMode="cover"
          />
        )}
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDate}>
          {new Date(item.created_at).toLocaleDateString()} 
        </Text>
      </View>
    </TouchableOpacity>
  );

  // He decidido separar las denuncias en pendientes y resueltas, para evitar el paso de filtrar
  // mediante el buscador.
  const renderTab = (label: string, key: 'pending' | 'resolved') => (
    <TouchableOpacity
      style={[
        styles.tab,
        activeTab === key && styles.activeTab, 
      ]}
      onPress={() => setActiveTab(key)} 
    >
      <Text
        style={[
          styles.tabText,
          activeTab === key && styles.activeTabText, 
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Cuadro de búsqueda */}
      <TextInput
        placeholder="Buscar denuncia..."
        placeholderTextColor="#666"
        value={search} 
        onChangeText={setSearch} 
        style={styles.searchBar}
      />

      {/* Pestañas de filtrado (Pendientes y Resueltas) */}
      <View style={styles.tabContainer}>
        {renderTab('Pendientes', 'pending')}
        {renderTab('Resueltas', 'resolved')}
      </View>

      {/* Muestra el indicador de carga mientras se obtienen los datos */}
      {loading ? (
        <ActivityIndicator size="large" color="#1E3A34" style={{ marginTop: 20 }} />
      ) : (        
        <FlatList
          data={filteredReports}
          keyExtractor={(item) => item.id.toString()} 
          renderItem={renderReport} 
          contentContainerStyle={styles.list} 
        />
      )}

      {/* Botón flotante para crear un nuevo reporte */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewReportScreen')} 
      >
        <Text style={styles.fabIcon}>＋</Text> {/* Icono para el botón */}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEAE3', 
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logo: {
    width: 140,
    height: 40,
    alignSelf: 'center',
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
    color: '#1E3A34',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#D6D3CB', 
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#1E3A34', 
  },
  tabText: {
    color: '#1E3A34',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF', 
  },
  list: {
    paddingBottom: 100, 
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1, 
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A34',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 14,
    color: '#7B7B7B', 
  },
  newReportButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#1E3A34', 
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  newReportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  cardThumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#EEE'
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#F97316', 
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },  
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 28,
    fontWeight: '600',
  },
})
