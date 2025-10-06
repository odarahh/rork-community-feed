import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Bold,
  Italic,
  Strikethrough,
  Underline,
  Code,
  List,
  ListOrdered,
  Link as LinkIcon,
  Heading2,
  Heading3,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import LinkModal from './LinkModal';

type FormatType =
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'underline'
  | 'code'
  | 'h2'
  | 'h3'
  | 'ul'
  | 'ol'
  | 'link';

type RichTextEditorProps = {
  content: string;
  onContentChange: (content: string) => void;
  placeholder?: string;
};

const RichTextEditor = forwardRef((props: RichTextEditorProps, ref) => {
  const { content, onContentChange, placeholder } = props;
  const [showToolbar, setShowToolbar] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const inputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
  }));

  const handleSelectionChange = (event: any) => {
    const { start, end } = event.nativeEvent.selection;
    setSelection({ start, end });
    setShowToolbar(start !== end);
  };

  const applyFormat = (format: FormatType) => {
    const { start, end } = selection;
    if (start === end) return;

    const selectedText = content.substring(start, end);
    let formattedText = '';

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        break;
      case 'h3':
        formattedText = `### ${selectedText}`;
        break;
      case 'ul':
        formattedText = selectedText
          .split('\n')
          .map((line) => `• ${line}`)
          .join('\n');
        break;
      case 'ol':
        formattedText = selectedText
          .split('\n')
          .map((line, i) => `${i + 1}. ${line}`)
          .join('\n');
        break;
      default:
        formattedText = selectedText;
    }

    const newContent =
      content.substring(0, start) + formattedText + content.substring(end);
    onContentChange(newContent);
    setShowToolbar(false);
  };

  const handleInsertLink = (url: string, text: string) => {
    const { start, end } = selection;
    const linkText = start !== end ? content.substring(start, end) : text;
    const formattedLink = `[${linkText}](${url})`;

    const newContent =
      content.substring(0, start) + formattedLink + content.substring(end);
    onContentChange(newContent);
    setShowToolbar(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={placeholder || 'O que você está pensando?'}
        placeholderTextColor={Colors.mutedForeground}
        value={content}
        onChangeText={onContentChange}
        onSelectionChange={handleSelectionChange}
        multiline
        textAlignVertical="top"
      />

      {showToolbar && (
        <View style={styles.floatingToolbar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.toolbarContent}
          >
            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => applyFormat('h2')}
            >
              <Heading2 size={18} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => applyFormat('h3')}
            >
              <Heading3 size={18} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => applyFormat('bold')}
            >
              <Bold size={18} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => applyFormat('italic')}
            >
              <Italic size={18} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => applyFormat('strikethrough')}
            >
              <Strikethrough size={18} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => applyFormat('underline')}
            >
              <Underline size={18} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => applyFormat('code')}
            >
              <Code size={18} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => applyFormat('ul')}
            >
              <List size={18} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => applyFormat('ol')}
            >
              <ListOrdered size={18} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => setShowLinkModal(true)}
            >
              <LinkIcon size={18} color={Colors.primary} />
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      <LinkModal
        visible={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onInsertLink={handleInsertLink}
      />
    </View>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;

const styles = StyleSheet.create({
  container: {
    minHeight: 150,
    backgroundColor: Colors.muted,
    borderRadius: 8,
    padding: 16,
    position: 'relative',
  },
  input: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.primary,
    minHeight: 150,
  },
  floatingToolbar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toolbarContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    alignItems: 'center',
  },
  toolButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
