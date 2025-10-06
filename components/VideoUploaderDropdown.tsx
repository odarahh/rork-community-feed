import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { Video, ChevronDown, Youtube, Video as VideoIcon, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/colors';

type VideoUploaderDropdownProps = {
  onVideosSelected: (videos: { uri: string; thumbnail: string }[]) => void;
  onVideoLinkAdded: (link: { platform: string; url: string }) => void;
  maxVideos: number;
  maxVideoLinks: number;
};

const PLATFORMS = [
  { id: 'youtube', name: 'YouTube', icon: Youtube },
  { id: 'vimeo', name: 'Vimeo', icon: VideoIcon },
  { id: 'loom', name: 'Loom', icon: VideoIcon },
  { id: 'instagram', name: 'Instagram', icon: VideoIcon },
];

export default function VideoUploaderDropdown({
  onVideosSelected,
  onVideoLinkAdded,
  maxVideos,
  maxVideoLinks,
}: VideoUploaderDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('youtube');
  const [url, setUrl] = useState('');

  const handlePickVideos = async () => {
    setShowDropdown(false);

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

  const handleOpenLinkModal = () => {
    setShowDropdown(false);
    setShowLinkModal(true);
  };

  const handleAddLink = () => {
    if (!url.trim()) {
      return;
    }

    const platform = PLATFORMS.find((p) => p.id === selectedPlatform);
    onVideoLinkAdded({
      platform: platform?.name || 'YouTube',
      url: url.trim(),
    });

    setUrl('');
    setSelectedPlatform('youtube');
    setShowLinkModal(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowDropdown(true)}
      >
        <Video size={20} color={Colors.mutedForeground} />
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
              onPress={handlePickVideos}
            >
              <Text style={styles.dropdownItemText}>Upload local</Text>
              <Text style={styles.dropdownItemSubtext}>
                Até {maxVideos} vídeos
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={handleOpenLinkModal}
            >
              <Text style={styles.dropdownItemText}>Link de vídeo</Text>
              <Text style={styles.dropdownItemSubtext}>
                YouTube, Vimeo, Loom, Instagram
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showLinkModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLinkModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowLinkModal(false)}>
          <View style={styles.modal} onStartShouldSetResponder={() => true}>
            <View style={styles.header}>
              <Text style={styles.title}>Adicionar link de vídeo</Text>
              <TouchableOpacity onPress={() => setShowLinkModal(false)}>
                <X size={20} color={Colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Plataforma</Text>
              <View style={styles.platformGrid}>
                {PLATFORMS.map((platform) => {
                  const Icon = platform.icon;
                  const isSelected = selectedPlatform === platform.id;
                  return (
                    <TouchableOpacity
                      key={platform.id}
                      style={[styles.platformButton, isSelected && styles.platformButtonSelected]}
                      onPress={() => setSelectedPlatform(platform.id)}
                    >
                      <Icon
                        size={24}
                        color={isSelected ? Colors.blue : Colors.mutedForeground}
                      />
                      <Text
                        style={[
                          styles.platformText,
                          isSelected && styles.platformTextSelected,
                        ]}
                      >
                        {platform.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.label}>URL do vídeo</Text>
              <TextInput
                style={styles.input}
                placeholder="Cole o link do vídeo aqui"
                placeholderTextColor={Colors.mutedForeground}
                value={url}
                onChangeText={setUrl}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                style={[styles.addButton, !url.trim() && styles.addButtonDisabled]}
                onPress={handleAddLink}
                disabled={!url.trim()}
              >
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Pressable>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginBottom: 12,
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  platformButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.muted,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  platformButtonSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.blue,
  },
  platformText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.mutedForeground,
  },
  platformTextSelected: {
    color: Colors.blue,
  },
  input: {
    fontSize: 15,
    color: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.muted,
    borderRadius: 8,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: Colors.blue,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: Colors.muted,
    opacity: 0.5,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.primaryForeground,
  },
});
