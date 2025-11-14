import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@app_images';

export function useImages() {
  const [images, setImages] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar imagens ao inicializar - apenas uma vez
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const savedImages = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('📥 Carregando imagens do storage:', savedImages ? JSON.parse(savedImages).length : 0);
      if (savedImages) {
        const parsedImages = JSON.parse(savedImages);
        setImages(parsedImages);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('❌ Erro ao carregar imagens:', error);
      setIsLoaded(true);
    }
  };

  // ✅ SOLUÇÃO: Usar useCallback e sempre ler/escrever do AsyncStorage
  const addMultipleImages = useCallback(async (newUris: string[]) => {
    try {
      console.log('🔄 Tentando adicionar', newUris.length, 'imagens');
      
      // 1. Primeiro, pegar o estado atual do AsyncStorage
      const currentStorage = await AsyncStorage.getItem(STORAGE_KEY);
      const currentImages = currentStorage ? JSON.parse(currentStorage) : [];
      
      console.log('📋 Imagens atuais no storage:', currentImages.length);
      console.log('🆕 Novas imagens para adicionar:', newUris.length);
      
      // 2. Combinar as imagens atuais com as novas (evitar duplicatas)
      const combinedImages = [...currentImages];
      
      for (const uri of newUris) {
        if (!combinedImages.includes(uri)) {
          combinedImages.push(uri);
        }
      }
      
      console.log('🎯 Total após combinação:', combinedImages.length);
      
      // 3. Salvar no AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(combinedImages));
      console.log('💾 Storage atualizado com', combinedImages.length, 'imagens');
      
      // 4. Atualizar o estado local
      setImages(combinedImages);
      
      return combinedImages.length;
      
    } catch (error) {
      console.error('❌ Erro ao adicionar múltiplas imagens:', error);
      throw error;
    }
  }, []);

  const addImage = useCallback(async (uri: string) => {
    return addMultipleImages([uri]);
  }, [addMultipleImages]);

  const clearImages = async () => {
    try {
      console.log('🗑️ Limpando todas as imagens');
      setImages([]);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('❌ Erro ao limpar imagens:', error);
    }
  };

  // ✅ NOVA FUNÇÃO: Forçar recarregamento do storage
  const refreshImages = async () => {
    await loadImages();
  };

  return {
    images,
    addImage,
    addMultipleImages,
    clearImages,
    refreshImages,
    isLoaded
  };
}