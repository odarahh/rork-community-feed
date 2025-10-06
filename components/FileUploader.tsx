import React from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Paperclip } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import Colors from '@/constants/colors';

type FileUploaderProps = {
  onFilesSelected: (files: { name: string; size: string; uri: string }[]) => void;
  maxFiles: number;
};

export default function FileUploader({ onFilesSelected, maxFiles }: FileUploaderProps) {
  const handlePickFiles = async () => {
    if (maxFiles <= 0) {
      Alert.alert('Limite atingido', 'Você atingiu o limite máximo de arquivos.');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.ms-excel', 'text/csv', 'application/msword'],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets) {
        const files = result.assets.slice(0, maxFiles).map((asset) => ({
          name: asset.name,
          size: formatFileSize(asset.size || 0),
          uri: asset.uri,
        }));
        onFilesSelected(files);
      }
    } catch (error) {
      console.error('Error picking files:', error);
      Alert.alert('Erro', 'Não foi possível selecionar os arquivos.');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePickFiles}>
      <Paperclip size={20} color={Colors.mutedForeground} />
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
