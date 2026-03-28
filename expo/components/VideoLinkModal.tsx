import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { X, Youtube, Video as VideoIcon } from 'lucide-react-native';
import Colors from '@/constants/colors';

type VideoLinkModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddLink: (link: { platform: string; url: string }) => void;
};

const PLATFORMS = [
  { id: 'youtube', name: 'YouTube', icon: Youtube },
  { id: 'vimeo', name: 'Vimeo', icon: VideoIcon },
  { id: 'loom', name: 'Loom', icon: VideoIcon },
  { id: 'instagram', name: 'Instagram', icon: VideoIcon },
];

export default function VideoLinkModal({
  visible,
  onClose,
  onAddLink,
}: VideoLinkModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState('youtube');
  const [url, setUrl] = useState('');

  const handleAdd = () => {
    if (!url.trim()) {
      return;
    }

    const platform = PLATFORMS.find((p) => p.id === selectedPlatform);
    onAddLink({
      platform: platform?.name || 'YouTube',
      url: url.trim(),
    });

    setUrl('');
    setSelectedPlatform('youtube');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modal} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title}>Adicionar link de vídeo</Text>
            <TouchableOpacity onPress={onClose}>
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
              onPress={handleAdd}
              disabled={!url.trim()}
            >
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
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
