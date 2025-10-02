import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  MoreVertical,
  Pin,
  Bookmark,
  FileText,
  Download,
  Play,

  X,
  ChevronLeft,
  ChevronRight,
  MessageCircleOff,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Post, Attachment } from '@/types/feed';
import PostMenu from './PostMenu';
import CommentSection from './CommentSection';

type PostCardProps = {
  post: Post;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onTogglePin: (postId: string) => void;
  onToggleComments: (postId: string) => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PostCard({
  post,
  onToggleLike,
  onToggleSave,
  onTogglePin,
  onToggleComments,
}: PostCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [likeScale] = useState(new Animated.Value(1));
  const [localComments, setLocalComments] = useState(post.comments);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const videoRef = React.useRef<Video>(null);

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

  const handleAddComment = (content: string, attachments: Attachment[], replyToId?: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      author: {
        id: 'current-user',
        name: 'Você',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      content,
      timestamp: 'Agora',
      likes: 0,
      userLiked: false,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    if (replyToId) {
      const addReplyToComment = (comments: typeof localComments): typeof localComments => {
        return comments.map((comment) => {
          if (comment.id === replyToId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment],
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: addReplyToComment(comment.replies),
            };
          }
          return comment;
        });
      };
      setLocalComments(addReplyToComment(localComments));
    } else {
      setLocalComments([...localComments, newComment]);
    }
    
    setCommentsCount(commentsCount + 1);
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

      {post.media?.type === 'banner' && (
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: post.media.url as string }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>
      )}

      <View style={styles.content}>
        {post.title && <Text style={styles.titleText}>{post.title}</Text>}
        <Text style={styles.contentText}>{post.content}</Text>
      </View>

      {post.media && post.media.type === 'image' && (
        <TouchableOpacity 
          style={styles.mediaContainer}
          onPress={() => {
            setSelectedImageIndex(0);
            setShowFullImage(true);
          }}
        >
          <Image
            source={{ uri: post.media.url as string }}
            style={styles.mediaImage}
            resizeMode="cover"
          />
          {post.media.caption && (
            <Text style={styles.mediaCaption}>{post.media.caption}</Text>
          )}
        </TouchableOpacity>
      )}

      {post.media && post.media.type === 'video' && (
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: post.media.url as string }}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay={isPlaying}
            onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
              if (status.isLoaded) {
                setIsPlaying(status.isPlaying);
              }
            }}
          />
          <TouchableOpacity
            style={styles.videoOverlay}
            onPress={() => {
              if (isPlaying) {
                videoRef.current?.pauseAsync();
              } else {
                videoRef.current?.playAsync();
              }
            }}
          >
            {!isPlaying && (
              <View style={styles.playButton}>
                <Play size={40} color={Colors.primaryForeground} fill={Colors.primaryForeground} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      {post.media && post.media.type === 'gallery' && Array.isArray(post.media.url) && (
        <View style={styles.galleryContainer}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {post.media.url.map((imageUrl, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedImageIndex(index);
                  setShowFullImage(true);
                }}
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.galleryIndicator}>
            <Text style={styles.galleryIndicatorText}>
              {1}/{post.media.url.length}
            </Text>
          </View>
        </View>
      )}

      {post.media && post.media.type === 'file' && (
        <View style={styles.fileContainer}>
          <View style={styles.fileContent}>
            <FileText size={32} color={Colors.blue} />
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>{post.media.fileName}</Text>
              {post.media.fileSize && (
                <Text style={styles.fileSize}>{post.media.fileSize}</Text>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.downloadButton}>
            <Download size={20} color={Colors.blue} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.stats}>
        <View style={styles.statsLeft}>
          <View style={styles.statItem}>
            <Heart size={16} color={Colors.red} fill={Colors.red} />
            <Text style={styles.statsText}>{post.totalReactions}</Text>
          </View>
          <View style={styles.statItem}>
            <MessageCircle size={16} color={Colors.mutedForeground} />
            <Text style={styles.statsText}>{commentsCount} comentários</Text>
          </View>
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
          disabled={post.commentsDisabled}
        >
          <MessageCircle 
            size={20} 
            color={post.commentsDisabled ? Colors.mutedForeground : Colors.mutedForeground} 
          />
          <Text style={[styles.actionText, post.commentsDisabled && styles.disabledText]}>
            Comentar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={20} color={Colors.mutedForeground} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Send size={20} color={Colors.mutedForeground} />
          <Text style={styles.actionText}>Enviar</Text>
        </TouchableOpacity>
      </View>

      {showComments && (
        <>
          <View style={styles.divider} />
          {post.commentsDisabled ? (
            <View style={styles.commentsDisabledContainer}>
              <MessageCircleOff size={32} color={Colors.mutedForeground} />
              <Text style={styles.commentsDisabledTitle}>Comentários desabilitados</Text>
              <Text style={styles.commentsDisabledText}>
                O autor desabilitou os comentários nesta postagem.
              </Text>
              <TouchableOpacity 
                style={styles.enableCommentsButton}
                onPress={() => onToggleComments(post.id)}
              >
                <Text style={styles.enableCommentsButtonText}>Reativar comentários</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <CommentSection comments={localComments} onAddComment={handleAddComment} />
          )}
        </>
      )}

      <Modal
        visible={showFullImage}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFullImage(false)}
      >
        <View style={styles.fullImageModal}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowFullImage(false)}
          >
            <X size={24} color={Colors.primaryForeground} />
          </TouchableOpacity>
          
          {post.media && (
            <>
              <Image
                source={{ 
                  uri: Array.isArray(post.media.url) 
                    ? post.media.url[selectedImageIndex] 
                    : post.media.url as string 
                }}
                style={styles.fullImage}
                resizeMode="contain"
              />
              
              {Array.isArray(post.media.url) && post.media.url.length > 1 && (
                <>
                  {selectedImageIndex > 0 && (
                    <TouchableOpacity
                      style={[styles.navButton, styles.navButtonLeft]}
                      onPress={() => setSelectedImageIndex(selectedImageIndex - 1)}
                    >
                      <ChevronLeft size={32} color={Colors.primaryForeground} />
                    </TouchableOpacity>
                  )}
                  
                  {selectedImageIndex < post.media.url.length - 1 && (
                    <TouchableOpacity
                      style={[styles.navButton, styles.navButtonRight]}
                      onPress={() => setSelectedImageIndex(selectedImageIndex + 1)}
                    >
                      <ChevronRight size={32} color={Colors.primaryForeground} />
                    </TouchableOpacity>
                  )}
                  
                  <View style={styles.imageCounter}>
                    <Text style={styles.imageCounterText}>
                      {selectedImageIndex + 1} / {post.media.url.length}
                    </Text>
                  </View>
                </>
              )}
            </>
          )}
        </View>
      </Modal>

      <PostMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        post={post}
        onToggleSave={onToggleSave}
        onTogglePin={onTogglePin}
        onToggleComments={onToggleComments}
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
  statsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
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
  disabledText: {
    opacity: 0.5,
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    marginBottom: 12,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 8,
  },
  videoContainer: {
    marginTop: 8,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.primary,
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryContainer: {
    marginTop: 8,
    position: 'relative',
  },
  galleryImage: {
    width: SCREEN_WIDTH - 32,
    height: 300,
  },
  galleryIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  galleryIndicatorText: {
    color: Colors.primaryForeground,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  fileContainer: {
    marginTop: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.muted,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  fileInfo: {
    flex: 1,
    gap: 4,
  },
  fileName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  fileSize: {
    fontSize: 13,
    color: Colors.mutedForeground,
  },
  downloadButton: {
    padding: 8,
  },
  commentsDisabledContainer: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
  },
  commentsDisabledTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginTop: 8,
  },
  commentsDisabledText: {
    fontSize: 14,
    color: Colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 20,
  },
  enableCommentsButton: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.blue,
    borderRadius: 8,
  },
  enableCommentsButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primaryForeground,
  },
  fullImageModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    zIndex: 10,
  },
  navButtonLeft: {
    left: 20,
  },
  navButtonRight: {
    right: 20,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  imageCounterText: {
    color: Colors.primaryForeground,
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
