import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Paperclip, ChevronDown } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import Colors from '@/constants/colors';

type FileUploaderDropdownProps = {
  onFilesSelected: (files: { name: string; size: string; uri: string }[]) => void;
  maxFiles: number;
};

export default function FileUploaderDropdown({
  onFilesSelected,
  maxFiles,
}: FileUploaderDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handlePickFiles = async (type: 'document' | 'pdf' | 'excel') => {
    setShowDropdown(false);

    if (maxFiles <= 0) {
      Alert.alert('Limite atingido', 'Você atingiu o limite máximo de arquivos.');
      return;
    }

    try {
      let fileTypes: string[] = [];
      
      switch (type) {
        case 'pdf':
          fileTypes = ['application/pdf'];
          break;
        case 'excel':
          fileTypes = ['application/vnd.ms-excel', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
          break;
        case 'document':
          fileTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
          break;
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: fileTypes,
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
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowDropdown(true)}
      >
        <Paperclip size={20} color={Colors.mutedForeground} />
        <ChevronDown size={14} color={Colors.mutedForeground} />
      </TouchableOpacity>

      <Modal
        visible={showDropdown}
        animationType="fade"
        transparent
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handlePickFiles('pdf')}
            >
              <Text style={styles.dropdownItemText}>PDF</Text>
              <Text style={styles.dropdownItemSubtext}>
                Até {maxFiles} arquivos
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handlePickFiles('excel')}
            >
              <Text style={styles.dropdownItemText}>Excel/CSV</Text>
              <Text style={styles.dropdownItemSubtext}>
                Até {maxFiles} arquivos
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handlePickFiles('document')}
            >
              <Text style={styles.dropdownItemText}>Documento</Text>
              <Text style={styles.dropdownItemSubtext}>
                Até {maxFiles} arquivos
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
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
    flexDirection: 'row',
    gap: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  dropdownItemText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  dropdownItemSubtext: {
    fontSize: 13,
    color: Colors.mutedForeground,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
});
