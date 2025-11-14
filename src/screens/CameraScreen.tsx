import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useImages } from '../hooks/useImages';

export default function CameraScreen({ navigation }: any) {
  const { images, addMultipleImages, refreshImages, isLoaded } = useImages();
  const [isSaving, setIsSaving] = useState(false);

  const requestPermissions = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted' || cameraStatus.status !== 'granted') {
      alert('Desculpe, precisamos de permissão para acessar a câmera e galeria!');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    console.log('📸 Iniciando captura de foto...');
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('📷 Resultado da câmera:', result);
    
    if (!result.canceled && result.assets && result.assets[0].uri) {
      console.log('✅ Foto capturada, salvando...');
      setIsSaving(true);
      try {
        await addMultipleImages([result.assets[0].uri]);
        Alert.alert('✅ Sucesso!', 'Foto salva na galeria!');
      } catch (error) {
        Alert.alert('❌ Erro', 'Não foi possível salvar a foto');
      } finally {
        setIsSaving(false);
      }
    } else {
      console.log('❌ Foto cancelada ou sem assets');
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    console.log('🖼️ Abrindo galeria...');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    console.log('📂 Resultado da galeria:', result);
    
    if (!result.canceled && result.assets) {
      console.log(`✅ ${result.assets.length} foto(s) selecionada(s)`);
      
      setIsSaving(true);
      try {
        // ✅ Extrair todos os URIs
        const uris = result.assets.map(asset => asset.uri);
        console.log('📋 URIs das imagens:', uris);
        
        // ✅ Salvar todas de uma vez
        const finalCount = await addMultipleImages(uris);
        
        Alert.alert('✅ Sucesso!', `${finalCount} foto(s) na galeria!\n(${uris.length} novas adicionadas)`);
        
        // ✅ Forçar recarregamento para garantir sincronização
        await refreshImages();
        
      } catch (error) {
        console.error('❌ Erro ao salvar imagens:', error);
        Alert.alert('❌ Erro', 'Não foi possível salvar algumas fotos');
      } finally {
        setIsSaving(false);
      }
    } else {
      console.log('❌ Seleção cancelada');
    }
  };

  // ✅ Função para verificar o storage manualmente
  const checkStorage = async () => {
    console.log('🔍 Verificando storage manualmente...');
    await refreshImages();
    Alert.alert('🔍 Storage', `Encontradas ${images.length} fotos no storage`);
  };

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando galeria...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>📷 Câmera & Galeria</Text>
          <Text style={styles.subtitle}>
            {images.length} foto(s) salvas
          </Text>
          
          {/* ✅ Botão para verificar storage */}
          <TouchableOpacity style={styles.checkButton} onPress={checkStorage}>
            <Text style={styles.checkButtonText}>🔄 Verificar Storage</Text>
          </TouchableOpacity>
        </View>

        {isSaving && (
          <View style={styles.savingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.savingText}>Salvando fotos...</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.cameraButton, isSaving && styles.disabledButton]} 
            onPress={takePhoto}
            disabled={isSaving}
          >
            <Text style={styles.buttonIcon}>📸</Text>
            <Text style={styles.buttonText}>Tirar Foto</Text>
            <Text style={styles.buttonDescription}>Usar câmera</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.galleryButton, isSaving && styles.disabledButton]} 
            onPress={pickImage}
            disabled={isSaving}
          >
            <Text style={styles.buttonIcon}>🖼️</Text>
            <Text style={styles.buttonText}>Abrir Galeria</Text>
            <Text style={styles.buttonDescription}>Importar fotos</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => {
            console.log('📂 Indo para galeria com', images.length, 'fotos');
            navigation.navigate('Gallery');
          }}
        >
          <Text style={styles.navButtonText}>
            📂 Ver Galeria ({images.length})
          </Text>
        </TouchableOpacity>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>
            Últimas Fotos ({images.length} no total)
          </Text>
          {images.length > 0 ? (
            <ScrollView 
              horizontal 
              style={styles.horizontalScroll}
              showsHorizontalScrollIndicator={false}
            >
              {images.slice(-10).map((uri, index) => (
                <View key={index} style={styles.thumbnailContainer}>
                  <Image source={{ uri }} style={styles.thumbnail} />
                  <Text style={styles.thumbnailText}>{images.length - (images.slice(-10).length - index) + 1}</Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noPhotos}>
              <Text style={styles.noPhotosText}>Nenhuma foto ainda...</Text>
              <Text style={styles.noPhotosSubtext}>As fotos aparecerão aqui</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c1c1e',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  checkButton: {
    backgroundColor: '#5856D6',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  checkButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  savingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  savingText: {
    marginLeft: 10,
    color: '#1976D2',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  cameraButton: {
    backgroundColor: '#FF3B30',
    padding: 20,
    borderRadius: 15,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  galleryButton: {
    backgroundColor: '#4CD964',
    padding: 20,
    borderRadius: 15,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  buttonDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  navButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  recentSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 15,
    textAlign: 'center',
  },
  horizontalScroll: {
    flexGrow: 0,
  },
  thumbnailContainer: {
    alignItems: 'center',
    marginRight: 15,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  thumbnailText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  noPhotos: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noPhotosText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  noPhotosSubtext: {
    fontSize: 14,
    color: '#999',
  },
});