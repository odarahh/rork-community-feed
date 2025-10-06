import React from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Video } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/colors';

type VideoUploaderProps = {
  onVideosSelected: (videos: { uri: string; thumbnail: string }[]) => void;
  maxVideos: number;
};

export default function VideoUploader({ onVideosSelected, maxVideos }: VideoUploaderProps) {
  const handlePickVideos = async () => {
    if (maxVideos <= 0) {
      Alert.alert('Limite atingido', 'Você atingiu o limite máximo de vídeos.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de permissão para acessar seus vídeos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsMultipleSelection: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const videos = result.assets.slice(0, maxVideos).map((asset) => ({
        uri: asset.uri,
        thumbnail: asset.uri,
      }));
      onVideosSelected(videos);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePickVideos}>
      <Video size={20} color={Colors.mutedForeground} />
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
