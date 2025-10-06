import React from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Image } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/colors';

type ImageUploaderProps = {
  onImagesSelected: (images: string[]) => void;
  maxImages: number;
  type: 'banner' | 'body';
};

export default function ImageUploader({
  onImagesSelected,
  maxImages,
}: ImageUploaderProps) {
  const handlePickImages = async () => {
    if (maxImages <= 0) {
      Alert.alert('Limite atingido', 'Você atingiu o limite máximo de imagens.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de permissão para acessar suas fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const imageUris = result.assets.slice(0, maxImages).map((asset) => asset.uri);
      onImagesSelected(imageUris);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePickImages}>
      <Image size={20} color={Colors.mutedForeground} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
