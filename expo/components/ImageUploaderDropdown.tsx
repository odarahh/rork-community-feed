import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Image, ChevronDown } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/colors';

type ImageType = 'banner' | 'body';

type ImageUploaderDropdownProps = {
  onImagesSelected: (images: string[], type: ImageType) => void;
  maxBannerImages: number;
  maxBodyImages: number;
};

export default function ImageUploaderDropdown({
  onImagesSelected,
  maxBannerImages,
  maxBodyImages,
}: ImageUploaderDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handlePickImages = async (type: ImageType) => {
    setShowDropdown(false);

    const maxImages = type === 'banner' ? maxBannerImages : maxBodyImages;
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
      onImagesSelected(imageUris, type);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowDropdown(true)}
      >
        <Image size={20} color={Colors.mutedForeground} />
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
              onPress={() => handlePickImages('banner')}
            >
              <Text style={styles.dropdownItemText}>Banner (topo)</Text>
              <Text style={styles.dropdownItemSubtext}>
                Até {maxBannerImages} imagens
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handlePickImages('body')}
            >
              <Text style={styles.dropdownItemText}>Galeria (corpo)</Text>
              <Text style={styles.dropdownItemSubtext}>
                Até {maxBodyImages} imagens
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
