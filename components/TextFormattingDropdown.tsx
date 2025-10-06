import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import {
  Type,
  Bold,
  Italic,
  Strikethrough,
  Underline,
  Code,
  List,
  ListOrdered,
  Heading2,
  Heading3,
} from 'lucide-react-native';
import Colors from '@/constants/colors';

type FormatOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
};

type TextFormattingDropdownProps = {
  onFormatSelect: (format: string) => void;
};

export default function TextFormattingDropdown({
  onFormatSelect,
}: TextFormattingDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const formatOptions: FormatOption[] = [
    {
      id: 'h2',
      label: 'Título 2',
      icon: <Heading2 size={20} color={Colors.primary} />,
      action: () => handleFormatSelect('h2'),
    },
    {
      id: 'h3',
      label: 'Título 3',
      icon: <Heading3 size={20} color={Colors.primary} />,
      action: () => handleFormatSelect('h3'),
    },
    {
      id: 'bold',
      label: 'Negrito',
      icon: <Bold size={20} color={Colors.primary} />,
      action: () => handleFormatSelect('bold'),
    },
    {
      id: 'italic',
      label: 'Itálico',
      icon: <Italic size={20} color={Colors.primary} />,
      action: () => handleFormatSelect('italic'),
    },
    {
      id: 'strikethrough',
      label: 'Tachado',
      icon: <Strikethrough size={20} color={Colors.primary} />,
      action: () => handleFormatSelect('strikethrough'),
    },
    {
      id: 'underline',
      label: 'Sublinhado',
      icon: <Underline size={20} color={Colors.primary} />,
      action: () => handleFormatSelect('underline'),
    },
    {
      id: 'code',
      label: 'Código',
      icon: <Code size={20} color={Colors.primary} />,
      action: () => handleFormatSelect('code'),
    },
    {
      id: 'ul',
      label: 'Lista com marcadores',
      icon: <List size={20} color={Colors.primary} />,
      action: () => handleFormatSelect('ul'),
    },
    {
      id: 'ol',
      label: 'Lista numerada',
      icon: <ListOrdered size={20} color={Colors.primary} />,
      action: () => handleFormatSelect('ol'),
    },
  ];

  const handleFormatSelect = (format: string) => {
    onFormatSelect(format);
    setShowDropdown(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.toolButton}
        onPress={() => setShowDropdown(true)}
      >
        <Type size={20} color={Colors.mutedForeground} />
      </TouchableOpacity>

      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.dropdown}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Formatação de texto</Text>
            </View>
            <ScrollView style={styles.dropdownContent}>
              {formatOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.formatOption}
                  onPress={option.action}
                >
                  <View style={styles.formatIcon}>{option.icon}</View>
                  <Text style={styles.formatLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  toolButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdown: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dropdownHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  dropdownContent: {
    maxHeight: 400,
  },
  formatOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  formatIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formatLabel: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
});
