import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import {
  X,
  Hash,
  Megaphone,
  MessageSquare,
  FolderKanban,
  BookOpen,
  Check,
} from 'lucide-react-native';
import Colors from '@/constants/colors';

type ChannelSelectorProps = {
  visible: boolean;
  onClose: () => void;
  selectedChannel: string;
  onSelectChannel: (channel: string) => void;
};

const CHANNELS = [
  { id: '1', name: 'Geral', icon: Hash },
  { id: '2', name: 'Anúncios', icon: Megaphone },
  { id: '3', name: 'Discussões', icon: MessageSquare },
  { id: '4', name: 'Projetos', icon: FolderKanban },
  { id: '5', name: 'Recursos', icon: BookOpen },
];

export default function ChannelSelector({
  visible,
  onClose,
  selectedChannel,
  onSelectChannel,
}: ChannelSelectorProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modal} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecionar canal</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={Colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.channelList} showsVerticalScrollIndicator={false}>
            {CHANNELS.map((channel) => {
              const Icon = channel.icon;
              const isSelected = selectedChannel === channel.name;
              return (
                <TouchableOpacity
                  key={channel.id}
                  style={[styles.channelItem, isSelected && styles.channelItemSelected]}
                  onPress={() => onSelectChannel(channel.name)}
                >
                  <View style={styles.channelInfo}>
                    <Icon
                      size={20}
                      color={isSelected ? Colors.blue : Colors.mutedForeground}
                    />
                    <Text
                      style={[
                        styles.channelName,
                        isSelected && styles.channelNameSelected,
                      ]}
                    >
                      {channel.name}
                    </Text>
                  </View>
                  {isSelected && <Check size={20} color={Colors.blue} />}
                </TouchableOpacity>
              );
            })}
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
    maxWidth: 400,
    maxHeight: '70%',
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
  channelList: {
    maxHeight: 400,
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  channelItemSelected: {
    backgroundColor: Colors.accent,
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
  channelNameSelected: {
    color: Colors.blue,
    fontWeight: '600' as const,
  },
});
