import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { mockPosts, currentUser } from '@/mocks/feedData';
import { Post } from '@/types/feed';
import PostCard from '@/components/PostCard';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const sortedPosts = posts.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const heartReaction = post.reactions.find((r) => r.type === '❤️');
          if (heartReaction) {
            const newUserReacted = !heartReaction.userReacted;
            return {
              ...post,
              reactions: post.reactions.map((r) =>
                r.type === '❤️'
                  ? {
                      ...r,
                      userReacted: newUserReacted,
                      count: newUserReacted ? r.count + 1 : r.count - 1,
                    }
                  : r
              ),
              totalReactions: newUserReacted
                ? post.totalReactions + 1
                : post.totalReactions - 1,
            };
          }
        }
        return post;
      })
    );
  };

  const handleToggleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post
      )
    );
  };

  const handleTogglePin = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, isPinned: !post.isPinned } : post
      )
    );
  };

  const handleToggleComments = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, commentsDisabled: !post.commentsDisabled } : post
      )
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.createPostContainer}>
          <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Compartilhe algo com a comunidade..."
              placeholderTextColor={Colors.mutedForeground}
              editable={false}
            />
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color={Colors.blue} />
          </TouchableOpacity>
        </View>


      </View>

      <ScrollView
        style={styles.feed}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
      >
        {sortedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onToggleLike={handleToggleLike}
            onToggleSave={handleToggleSave}
            onTogglePin={handleTogglePin}
            onToggleComments={handleToggleComments}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  header: {
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  createPostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: Colors.inputBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  input: {
    fontSize: 15,
    color: Colors.primary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  feed: {
    flex: 1,
  },
  feedContent: {
    paddingVertical: 8,
  },
});
