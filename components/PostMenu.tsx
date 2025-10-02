import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  Pin,
  PinOff,
  Settings,
  MessageCircleOff,
  Trash2,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Post } from '@/types/feed';

type PostMenuProps = {
  visible: boolean;
  onClose: () => void;
  post: Post;
  onToggleSave: (postId: string) => void;
  onTogglePin: (postId: string) => void;
};

type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

function MenuItem({ icon, label, onPress, destructive }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* eslint-disable-next-line @rork/linters/general-no-raw-text */}
      <View style={styles.iconWrapper}>{icon}</View>
      <Text style={[styles.menuItemText, destructive && styles.menuItemTextDestructive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function PostMenu({
  visible,
  onClose,
  post,
  onToggleSave,
  onTogglePin,
}: PostMenuProps) {
  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.menu}>
          <MenuItem
            icon={
              post.isSaved ? (
                <BookmarkCheck size={20} color={Colors.blue} />
              ) : (
                <Bookmark size={20} color={Colors.mutedForeground} />
              )
            }
            label={post.isSaved ? 'Remover dos salvos' : 'Salvar'}
            onPress={() => handleAction(() => onToggleSave(post.id))}
          />

          <MenuItem
            icon={<CheckCircle size={20} color={Colors.mutedForeground} />}
            label="Marcar como lido"
            onPress={() => handleAction(() => console.log('Mark as read'))}
          />

          <MenuItem
            icon={
              post.isPinned ? (
                <PinOff size={20} color={Colors.orange} />
              ) : (
                <Pin size={20} color={Colors.mutedForeground} />
              )
            }
            label={post.isPinned ? 'Desfixar postagem' : 'Fixar postagem no topo'}
            onPress={() => handleAction(() => onTogglePin(post.id))}
          />

          <MenuItem
            icon={<Settings size={20} color={Colors.mutedForeground} />}
            label="Alterar canal"
            onPress={() => handleAction(() => console.log('Change channel'))}
          />

          <MenuItem
            icon={<MessageCircleOff size={20} color={Colors.mutedForeground} />}
            label={
              post.commentsDisabled
                ? 'Ativar comentários'
                : 'Desativar comentários'
            }
            onPress={() => handleAction(() => console.log('Toggle comments'))}
          />

          <View style={styles.divider} />

          <MenuItem
            icon={<Trash2 size={20} color={Colors.destructive} />}
            label="Remover"
            onPress={() => handleAction(() => console.log('Remove post'))}
            destructive
          />
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
  menu: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  iconWrapper: {
    width: 24,
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  menuItemTextDestructive: {
    color: Colors.destructive,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
});
