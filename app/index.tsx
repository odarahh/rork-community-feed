import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Text,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, ArrowLeftRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { mockPosts, currentUser } from '@/mocks/feedData';
import { Post } from '@/types/feed';
import PostCard from '@/components/PostCard';

const channels = [
  { id: '1', name: 'Geral' },
  { id: '2', name: 'Anúncios' },
  { id: '3', name: 'Discussões' },
  { id: '4', name: 'Suporte' },
  { id: '5', name: 'Feedback' },
];

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(channels[0]);

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

  const handleSelectChannel = (channel: typeof channels[0]) => {
    setSelectedChannel(channel);
    setShowChannelModal(false);
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

        <TouchableOpacity 
          style={styles.channelButton}
          onPress={() => setShowChannelModal(true)}
        >
          <ArrowLeftRight size={16} color={Colors.blue} />
          <Text style={styles.channelButtonText}>{selectedChannel.name}</Text>
        </TouchableOpacity>
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

      <Modal
        visible={showChannelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowChannelModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowChannelModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecionar Canal</Text>
            {channels.map((channel) => (
              <TouchableOpacity
                key={channel.id}
                style={[
                  styles.channelOption,
                  selectedChannel.id === channel.id && styles.channelOptionSelected,
                ]}
                onPress={() => handleSelectChannel(channel)}
              >
                <Text
                  style={[
                    styles.channelOptionText,
                    selectedChannel.id === channel.id && styles.channelOptionTextSelected,
                  ]}
                >
                  {channel.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  channelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  channelButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.blue,
  },
  feed: {
    flex: 1,
  },
  feedContent: {
    paddingVertical: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 16,
  },
  channelOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: Colors.inputBackground,
  },
  channelOptionSelected: {
    backgroundColor: Colors.blue,
  },
  channelOptionText: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
  channelOptionTextSelected: {
    color: Colors.primaryForeground,
    fontWeight: '600' as const,
  },
});
