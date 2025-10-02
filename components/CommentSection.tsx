import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Paperclip, Send } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Comment } from '@/types/feed';
import { currentUser } from '@/mocks/feedData';

type CommentSectionProps = {
  comments: Comment[];
};

type CommentItemProps = {
  comment: Comment;
  isReply?: boolean;
};

function CommentItem({ comment, isReply = false }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [liked, setLiked] = useState(comment.userLiked);
  const [likes, setLikes] = useState(comment.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <View style={[styles.commentContainer, isReply && styles.replyContainer]}>
      <Image source={{ uri: comment.author.avatar }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentBubble}>
          <Text style={styles.commentAuthor}>{comment.author.name}</Text>
          <Text style={styles.commentText}>{comment.content}</Text>
        </View>
        <View style={styles.commentActions}>
          <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
          <TouchableOpacity onPress={handleLike}>
            <Text style={[styles.commentAction, liked && styles.commentActionLiked]}>
              Curtir {likes > 0 && `(${likes})`}
            </Text>
          </TouchableOpacity>
          {!isReply && (
            <TouchableOpacity>
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
                  <CommentItem key={reply.id} comment={reply} isReply />
                ))}
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

export default function CommentSection({ comments }: CommentSectionProps) {
  const [commentText, setCommentText] = useState('');

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      console.log('Submitting comment:', commentText);
      setCommentText('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Image source={{ uri: currentUser.avatar }} style={styles.inputAvatar} />
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Escreva um comentário..."
            placeholderTextColor={Colors.mutedForeground}
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <View style={styles.inputActions}>
            <TouchableOpacity style={styles.inputAction}>
              <Paperclip size={20} color={Colors.mutedForeground} />
            </TouchableOpacity>
            {commentText.trim().length > 0 && (
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
            <CommentItem key={comment.id} comment={comment} />
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
  commentAction: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.mutedForeground,
  },
  commentActionLiked: {
    color: Colors.red,
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
