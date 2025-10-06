import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { X, Link as LinkIcon } from 'lucide-react-native';
import Colors from '@/constants/colors';

type LinkModalProps = {
  visible: boolean;
  onClose: () => void;
  onInsertLink: (url: string, text: string) => void;
};

export default function LinkModal({
  visible,
  onClose,
  onInsertLink,
}: LinkModalProps) {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  const handleInsert = () => {
    if (url.trim()) {
      onInsertLink(url.trim(), text.trim() || url.trim());
      setUrl('');
      setText('');
      onClose();
    }
  };

  const handleClose = () => {
    setUrl('');
    setText('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <LinkIcon size={20} color={Colors.blue} />
              <Text style={styles.title}>Inserir Link</Text>
            </View>
            <TouchableOpacity onPress={handleClose}>
              <X size={20} color={Colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>URL *</Text>
              <TextInput
                style={styles.input}
                placeholder="https://exemplo.com"
                placeholderTextColor={Colors.mutedForeground}
                value={url}
                onChangeText={setUrl}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Texto (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Texto do link"
                placeholderTextColor={Colors.mutedForeground}
                value={text}
                onChangeText={setText}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.insertButton, !url.trim() && styles.insertButtonDisabled]}
              onPress={handleInsert}
              disabled={!url.trim()}
            >
              <Text style={styles.insertButtonText}>Inserir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  input: {
    fontSize: 15,
    color: Colors.primary,
    backgroundColor: Colors.muted,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.mutedForeground,
  },
  insertButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.blue,
  },
  insertButtonDisabled: {
    opacity: 0.5,
  },
  insertButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.primaryForeground,
  },
});
