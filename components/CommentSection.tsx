import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Paperclip, Send, Heart, X, FileText } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import Colors from '@/constants/colors';
import { Comment, Attachment } from '@/types/feed';
import { currentUser } from '@/mocks/feedData';

type CommentSectionProps = {
  comments: Comment[];
  onAddComment: (content: string, attachments: Attachment[], replyToId?: string) => void;
};

type CommentItemProps = {
  comment: Comment;
  isReply?: boolean;
  onReply: (commentId: string) => void;
};

function CommentItem({ comment, isReply = false, onReply }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [liked, setLiked] = useState(comment.userLiked);
  const [likes, setLikes] = useState(comment.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleReply = () => {
    onReply(comment.id);
  };

  return (
    <View style={[styles.commentContainer, isReply && styles.replyContainer]}>
      <Image source={{ uri: comment.author.avatar }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentBubble}>
          <Text style={styles.commentAuthor}>{comment.author.name}</Text>
          <Text style={styles.commentText}>{comment.content}</Text>
          {comment.attachments && comment.attachments.length > 0 && (
            <View style={styles.attachmentsContainer}>
              {comment.attachments.map((attachment) => (
                <View key={attachment.id} style={styles.attachmentItem}>
                  {attachment.type === 'image' ? (
                    <Image
                      source={{ uri: attachment.url }}
                      style={styles.attachmentImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.pdfAttachment}>
                      <FileText size={20} color={Colors.blue} />
                      <Text style={styles.pdfName} numberOfLines={1}>
                        {attachment.name}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
        <View style={styles.commentActions}>
          <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
          <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
            <Heart
              size={12}
              color={liked ? Colors.red : Colors.mutedForeground}
              fill={liked ? Colors.red : 'transparent'}
            />
            <Text style={[styles.commentAction, liked && styles.commentActionLiked]}>
              {likes > 0 ? likes : ''}
            </Text>
          </TouchableOpacity>
          {!isReply && (
            <TouchableOpacity onPress={handleReply}>
              <Text style={styles.commentAction}>Responder</Text>
            </TouchableOpacity>
          )}
        </View>

        {comment.replies && comment.replies.length > 0 && (
          <>
            {!showReplies && (
              <TouchableOpacity onPress={() => setShowReplies(true)}>
                <Text style={styles.viewReplies}>
                  Ver {comment.replies.length} resposta{comment.replies.length > 1 ? 's' : ''}
                </Text>
              </TouchableOpacity>
            )}
            {showReplies && (
              <View style={styles.repliesContainer}>
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} isReply onReply={onReply} />
                ))}
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

export default function CommentSection({ comments, onAddComment }: CommentSectionProps) {
  const [commentText, setCommentText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [replyToId, setReplyToId] = useState<string | undefined>(undefined);
  const [replyToName, setReplyToName] = useState<string | undefined>(undefined);

  const handleReply = (commentId: string) => {
    const comment = findCommentById(comments, commentId);
    if (comment) {
      setReplyToId(commentId);
      setReplyToName(comment.author.name);
    }
  };

  const findCommentById = (commentsList: Comment[], id: string): Comment | null => {
    for (const comment of commentsList) {
      if (comment.id === id) return comment;
      if (comment.replies) {
        const found = findCommentById(comment.replies, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const fileType = file.mimeType?.startsWith('image/') ? 'image' : 'pdf';
        
        const newAttachment: Attachment = {
          id: Date.now().toString(),
          type: fileType as 'image' | 'pdf',
          url: file.uri,
          name: file.name || 'arquivo',
        };

        setAttachments([...attachments, newAttachment]);
      }
    } catch (err) {
      console.error('Error picking file:', err);
      if (Platform.OS !== 'web') {
        Alert.alert('Erro', 'Não foi possível selecionar o arquivo');
      }
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((att) => att.id !== id));
  };

  const handleSubmitComment = () => {
    if (commentText.trim() || attachments.length > 0) {
      onAddComment(commentText, attachments, replyToId);
      setCommentText('');
      setAttachments([]);
      setReplyToId(undefined);
      setReplyToName(undefined);
    }
  };

  const handleCancelReply = () => {
    setReplyToId(undefined);
    setReplyToName(undefined);
  };

  return (
    <View style={styles.container}>
      {replyToName && (
        <View style={styles.replyingToContainer}>
          <Text style={styles.replyingToText}>Respondendo a {replyToName}</Text>
          <TouchableOpacity onPress={handleCancelReply}>
            <X size={16} color={Colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      )}

      {attachments.length > 0 && (
        <View style={styles.selectedAttachments}>
          {attachments.map((attachment) => (
            <View key={attachment.id} style={styles.selectedAttachmentItem}>
              {attachment.type === 'image' ? (
                <Image
                  source={{ uri: attachment.url }}
                  style={styles.selectedAttachmentImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.selectedPdfAttachment}>
                  <FileText size={16} color={Colors.blue} />
                  <Text style={styles.selectedPdfName} numberOfLines={1}>
                    {attachment.name}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.removeAttachmentButton}
                onPress={() => handleRemoveAttachment(attachment.id)}
              >
                <X size={14} color={Colors.destructiveForeground} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.inputContainer}>
        <Image source={{ uri: currentUser.avatar }} style={styles.inputAvatar} />
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={replyToName ? `Responder a ${replyToName}...` : "Escreva um comentário..."}
            placeholderTextColor={Colors.mutedForeground}
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <View style={styles.inputActions}>
            <TouchableOpacity style={styles.inputAction} onPress={handlePickFile}>
              <Paperclip size={20} color={Colors.mutedForeground} />
            </TouchableOpacity>
            {(commentText.trim().length > 0 || attachments.length > 0) && (
              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleSubmitComment}
              >
                <Send size={20} color={Colors.blue} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {comments.length > 0 && (
        <View style={styles.commentsContainer}>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} onReply={handleReply} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: Colors.inputBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.primary,
    maxHeight: 100,
  },
  inputActions: {
    flexDirection: 'row',
    gap: 8,
  },
  inputAction: {
    padding: 4,
  },
  submitButton: {
    padding: 4,
  },
  commentsContainer: {
    gap: 16,
  },
  commentContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  replyContainer: {
    marginTop: 12,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  commentContent: {
    flex: 1,
    gap: 6,
  },
  commentBubble: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray800,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
  },
  commentTimestamp: {
    fontSize: 12,
    color: Colors.mutedForeground,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentAction: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.mutedForeground,
  },
  commentActionLiked: {
    color: Colors.red,
  },
  attachmentsContainer: {
    marginTop: 8,
    gap: 8,
  },
  attachmentItem: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  attachmentImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  pdfAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pdfName: {
    flex: 1,
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  replyingToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.muted,
    borderRadius: 8,
    marginBottom: 8,
  },
  replyingToText: {
    fontSize: 13,
    color: Colors.blue,
    fontWeight: '600' as const,
  },
  selectedAttachments: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  selectedAttachmentItem: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  selectedAttachmentImage: {
    width: '100%',
    height: '100%',
  },
  selectedPdfAttachment: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  selectedPdfName: {
    fontSize: 10,
    color: Colors.primary,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  removeAttachmentButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.destructive,
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewReplies: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.blue,
    paddingHorizontal: 4,
  },
  repliesContainer: {
    marginTop: 8,
    gap: 12,
  },
});
