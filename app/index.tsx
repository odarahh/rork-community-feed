import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Text,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { mockPosts, currentUser } from '@/mocks/feedData';
import { Post } from '@/types/feed';
import PostCard from '@/components/PostCard';

const CHANNELS = [
  { id: '1', name: 'Produtividade' },
  { id: '2', name: 'Anúncios' },
  { id: '3', name: 'Design' },
  { id: '4', name: 'Negócios' },
  { id: '5', name: 'Tecnologia' },
  { id: '6', name: 'Produto' },
  { id: '7', name: 'Conteúdo' },
  { id: '8', name: 'Recursos' },
  { id: '9', name: 'Reflexões' },
];

const FILTER_TAGS = [
  { id: '1', label: 'Últimas atividades' },
  { id: '2', label: 'Relevantes' },
  { id: '3', label: 'Recentes' },
  { id: '4', label: 'Mais antigas' },
  { id: '5', label: 'Minhas postagens' },
  { id: '6', label: 'Salvos' },
];

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('1');

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

  const handleChangeChannel = (postId: string) => {
    setSelectedPostId(postId);
    setShowChannelModal(true);
  };

  const handleSelectChannel = (channelName: string) => {
    if (selectedPostId) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === selectedPostId ? { ...post, location: channelName } : post
        )
      );
    }
    setShowChannelModal(false);
    setSelectedPostId(null);
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagsContainer}
          contentContainerStyle={styles.tagsContent}
        >
          {FILTER_TAGS.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.tag,
                selectedFilter === tag.id && styles.tagSelected,
              ]}
              onPress={() => setSelectedFilter(tag.id)}
            >
              <Text style={styles.tagText}>{tag.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
            onChangeChannel={handleChangeChannel}
          />
        ))}
      </ScrollView>

      <Modal
        visible={showChannelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowChannelModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowChannelModal(false)}>
          <View style={styles.channelModal}>
            <Text style={styles.channelModalTitle}>Alterar canal</Text>
            <Text style={styles.channelModalSubtitle}>Selecione o novo canal para esta postagem</Text>
            <ScrollView style={styles.channelList}>
              {CHANNELS.map((channel) => {
                const currentPost = posts.find((p) => p.id === selectedPostId);
                const isSelected = currentPost?.location === channel.name;
                return (
                  <TouchableOpacity
                    key={channel.id}
                    style={[
                      styles.channelItem,
                      isSelected && styles.channelItemSelected,
                    ]}
                    onPress={() => handleSelectChannel(channel.name)}
                  >
                    <Text
                      style={[
                        styles.channelItemText,
                        isSelected && styles.channelItemTextSelected,
                      ]}
                    >
                      {channel.name}
                    </Text>
                    {isSelected && <Check size={20} color={Colors.blue} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
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
  tagsContainer: {
    marginTop: 16,
  },
  tagsContent: {
    paddingRight: 16,
    gap: 8,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(37, 99, 235, 0.3)',
  },
  tagSelected: {
    backgroundColor: 'rgba(37, 99, 235, 0.5)',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500' as const,
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
    padding: 20,
  },
  channelModal: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  channelModalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  channelModalSubtitle: {
    fontSize: 14,
    color: Colors.mutedForeground,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  channelList: {
    maxHeight: 400,
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  channelItemSelected: {
    backgroundColor: Colors.accent,
  },
  channelItemText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  channelItemTextSelected: {
    color: Colors.blue,
    fontWeight: '600' as const,
  },
});
