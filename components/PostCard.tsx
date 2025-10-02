import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  MoreVertical,
  Pin,
  Bookmark,
  Eye,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Post } from '@/types/feed';
import PostMenu from './PostMenu';
import CommentSection from './CommentSection';

type PostCardProps = {
  post: Post;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onTogglePin: (postId: string) => void;
};

export default function PostCard({
  post,
  onToggleLike,
  onToggleSave,
  onTogglePin,
}: PostCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [likeScale] = useState(new Animated.Value(1));

  const heartReaction = post.reactions.find((r) => r.type === '❤️');
  const isLiked = heartReaction?.userReacted || false;

  const handleLike = () => {
    Animated.sequence([
      Animated.timing(likeScale, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(likeScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onToggleLike(post.id);
  };

  return (
    <View style={styles.card}>
      {post.isPinned && (
        <View style={styles.pinnedBadge}>
          <Pin size={14} color={Colors.yellow} />
          <Text style={styles.pinnedText}>Postagem fixada</Text>
        </View>
      )}

      {post.isSaved && !post.isPinned && (
        <View style={styles.savedBadge}>
          <Bookmark size={14} color={Colors.blue} />
          <Text style={styles.savedText}>Salva</Text>
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
          <View style={styles.authorDetails}>
            <View style={styles.authorNameRow}>
              <Text style={styles.authorName}>{post.author.name}</Text>
              {post.author.isAdmin && (
                <View style={styles.adminBadge}>
                  <Text style={styles.adminText}>Admin</Text>
                </View>
              )}
            </View>
            {post.author.role && (
              <Text style={styles.authorRole}>{post.author.role}</Text>
            )}
            <View style={styles.metaRow}>
              <Text style={styles.timestamp}>{post.timestamp}</Text>
              {post.location && (
                <>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.location}>em {post.location}</Text>
                </>
              )}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMenu(true)}
        >
          <MoreVertical size={20} color={Colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.contentText}>{post.content}</Text>
      </View>

      {post.media && (
        <View style={styles.mediaContainer}>
          <Image
            source={{ uri: post.media.url }}
            style={styles.mediaImage}
            resizeMode="cover"
          />
          {post.media.caption && (
            <Text style={styles.mediaCaption}>{post.media.caption}</Text>
          )}
        </View>
      )}

      <View style={styles.stats}>
        <View style={styles.reactionsContainer}>
          {post.reactions.slice(0, 3).map((reaction) => (
            <Text key={reaction.type} style={styles.reactionEmoji}>
              {reaction.type}
            </Text>
          ))}
          <Text style={styles.statsText}>{post.totalReactions}</Text>
        </View>
        <View style={styles.statsRight}>
          <Text style={styles.statsText}>{post.commentsCount} comentários</Text>
          <Text style={styles.dot}>•</Text>
          <Eye size={14} color={Colors.mutedForeground} />
          <Text style={styles.statsText}>{post.views}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Animated.View style={{ transform: [{ scale: likeScale }] }}>
            <Heart
              size={20}
              color={isLiked ? Colors.red : Colors.mutedForeground}
              fill={isLiked ? Colors.red : 'transparent'}
            />
          </Animated.View>
          <Text
            style={[styles.actionText, isLiked && { color: Colors.red }]}
          >
            Curtir
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowComments(!showComments)}
        >
          <MessageCircle size={20} color={Colors.mutedForeground} />
          <Text style={styles.actionText}>Comentar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={20} color={Colors.mutedForeground} />
          <Text style={styles.actionText}>Compartilhar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Send size={20} color={Colors.mutedForeground} />
          <Text style={styles.actionText}>Enviar</Text>
        </TouchableOpacity>
      </View>

      {showComments && (
        <>
          <View style={styles.divider} />
          <CommentSection comments={post.comments} />
        </>
      )}

      <PostMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        post={post}
        onToggleSave={onToggleSave}
        onTogglePin={onTogglePin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fef3c7',
    borderBottomWidth: 1,
    borderBottomColor: '#fde68a',
  },
  pinnedText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#92400e',
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#dbeafe',
    borderBottomWidth: 1,
    borderBottomColor: '#bfdbfe',
  },
  savedText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#1e40af',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  authorInfo: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  authorDetails: {
    flex: 1,
    gap: 2,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  adminBadge: {
    backgroundColor: Colors.destructive,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adminText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.destructiveForeground,
  },
  authorRole: {
    fontSize: 14,
    color: Colors.mutedForeground,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  timestamp: {
    fontSize: 13,
    color: Colors.mutedForeground,
  },
  dot: {
    fontSize: 13,
    color: Colors.mutedForeground,
  },
  location: {
    fontSize: 13,
    color: Colors.blue,
    fontWeight: '500' as const,
  },
  menuButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.gray800,
  },
  mediaContainer: {
    marginTop: 8,
  },
  mediaImage: {
    width: '100%',
    height: 300,
  },
  mediaCaption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: Colors.mutedForeground,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  reactionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reactionEmoji: {
    fontSize: 16,
  },
  statsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statsText: {
    fontSize: 14,
    color: Colors.mutedForeground,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.mutedForeground,
  },
});
