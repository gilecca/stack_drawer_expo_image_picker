import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useImages } from '../hooks/useImages';

export default function GalleryScreen({ navigation }: any) {
  const { images, clearImages } = useImages();

  const handleClearImages = () => {
    Alert.alert(
      'Limpar Galeria',
      'Tem certeza que deseja apagar todas as fotos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar', 
          style: 'destructive',
          onPress: clearImages
        }
      ]
    );
  };

  // Se não há imagens, mostrar tela vazia centralizada
  if (images.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyContent}>
          <Text style={styles.emptyIcon}>🖼️</Text>
          <Text style={styles.emptyTitle}>Galeria Vazia</Text>
          <Text style={styles.emptyText}>
            Nenhuma foto salva ainda.{'\n'}
            Capture fotos ou importe da galeria!
          </Text>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('Camera')}
          >
            <Text style={styles.buttonText}>📸 Ir para Câmera</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Se há imagens, mostrar a galeria normal
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>📁 Galeria de Fotos</Text>
          <Text style={styles.subtitle}>{images.length} foto(s)</Text>
        </View>

        <TouchableOpacity style={styles.clearButton} onPress={handleClearImages}>
          <Text style={styles.clearButtonText}>🗑️ Limpar Galeria</Text>
        </TouchableOpacity>
        
        <ScrollView 
          style={styles.gallery}
          contentContainerStyle={styles.galleryContent}
          showsVerticalScrollIndicator={false}
        >
          {images.map((uri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri }} style={styles.image} />
              <Text style={styles.imageNumber}>Foto {index + 1}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container para quando NÃO tem fotos (CENTRALIZADO)
  emptyContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    width: '100%',
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 30,
  },

  // Container para quando TEM fotos
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
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
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gallery: {
    flex: 1,
  },
  galleryContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
  },
  imageNumber: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    fontSize: 14,
  },
  navButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});