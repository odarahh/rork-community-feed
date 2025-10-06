import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Colors from '@/constants/colors';
import { TextSegment } from './RichTextEditor';

type RichTextRendererProps = {
  segments: TextSegment[];
};

export default function RichTextRenderer({ segments }: RichTextRendererProps) {
  return (
    <View style={styles.container}>
      {segments.map((segment, index) => {
        const textStyles: any[] = [styles.baseText];
        
        if (segment.bold) textStyles.push(styles.bold);
        if (segment.italic) textStyles.push(styles.italic);
        if (segment.strikethrough) textStyles.push(styles.strikethrough);
        if (segment.underline) textStyles.push(styles.underline);
        if (segment.code) textStyles.push(styles.code);
        if (segment.h2) textStyles.push(styles.h2);
        if (segment.h3) textStyles.push(styles.h3);
        if (segment.link) textStyles.push(styles.link);

        return (
          <Text key={index} style={textStyles}>
            {segment.text}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  baseText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.gray800,
  },
  bold: {
    fontWeight: '700' as const,
  },
  italic: {
    fontStyle: 'italic' as const,
  },
  strikethrough: {
    textDecorationLine: 'line-through' as const,
  },
  underline: {
    textDecorationLine: 'underline' as const,
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: Colors.muted,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 14,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    marginVertical: 8,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 28,
    marginVertical: 6,
  },
  link: {
    color: Colors.blue,
    textDecorationLine: 'underline' as const,
  },
});
