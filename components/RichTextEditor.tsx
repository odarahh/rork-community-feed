import React, { forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Colors from '@/constants/colors';

type RichTextEditorProps = {
  content: string;
  onContentChange: (content: string) => void;
  placeholder?: string;
};

const RichTextEditor = forwardRef((props: RichTextEditorProps, ref) => {
  const { content, onContentChange, placeholder } = props;

  useImperativeHandle(ref, () => ({
    focus: () => {},
    blur: () => {},
  }));

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder || 'O que você está pensando?'}
        placeholderTextColor={Colors.mutedForeground}
        value={content}
        onChangeText={onContentChange}
        multiline
        textAlignVertical="top"
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
  },
  input: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.primary,
    minHeight: 150,
  },
});
