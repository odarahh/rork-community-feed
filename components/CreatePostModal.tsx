import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  X,
  Maximize2,
  Minimize2,
  Smile,
  Calendar,
  Hash,
  ChevronDown,
  Video as VideoIcon,
  Paperclip,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import RichTextEditor, { TextSegment } from './RichTextEditor';
import EmojiPicker from './EmojiPicker';
import ImageUploaderDropdown from './ImageUploaderDropdown';
import FileUploaderDropdown from './FileUploaderDropdown';
import VideoUploaderDropdown from './VideoUploaderDropdown';
import ScheduleModal from './ScheduleModal';
import ChannelSelector from './ChannelSelector';
import TextFormattingDropdown from './TextFormattingDropdown';

type CreatePostModalProps = {
  visible: boolean;
  onClose: () => void;
  onPublish: (postData: any) => void;
};

export default function CreatePostModal({
  visible,
  onClose,
  onPublish,
}: CreatePostModalProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<TextSegment[]>([{ text: '' }]);
  const [selectedChannel, setSelectedChannel] = useState('Geral');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showChannelSelector, setShowChannelSelector] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [bannerImages, setBannerImages] = useState<string[]>([]);
  const [bodyImages, setBodyImages] = useState<string[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [videoLinks, setVideoLinks] = useState<any[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  const editorRef = useRef<any>(null);

  const handleClose = () => {
    setTitle('');
    setContent([{ text: '' }]);
    setBannerImages([]);
    setBodyImages([]);
    setFiles([]);
    setVideos([]);
    setVideoLinks([]);
    setScheduledDate(null);
    setSelectedChannel('Geral');
    onClose();
  };

  const handlePublish = async () => {
    const contentText = content.map(seg => seg.text).join('');
    if (!contentText.trim() && bannerImages.length === 0 && bodyImages.length === 0) {
      return;
    }

    setIsPublishing(true);

    const postData = {
      title: title.trim() || undefined,
      content,
      channel: selectedChannel,
      bannerImages,
      bodyImages,
      files,
      videos,
      videoLinks,
      scheduledDate,
    };

    setTimeout(() => {
      onPublish(postData);
      setIsPublishing(false);
      handleClose();
    }, 1000);
  };

  const canPublish = content.map(seg => seg.text).join('').trim().length > 0 || bannerImages.length > 0 || bodyImages.length > 0;

  const handleFormatSelect = (format: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={!isMaximized}
      onRequestClose={handleClose}
    >
      <View style={[styles.container, isMaximized && styles.containerMaximized]}>
        <View style={[styles.modal, isMaximized && styles.modalMaximized]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Criar postagem</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setIsMaximized(!isMaximized)}
              >
                {isMaximized ? (
                  <Minimize2 size={20} color={Colors.mutedForeground} />
                ) : (
                  <Maximize2 size={20} color={Colors.mutedForeground} />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={handleClose}>
                <X size={20} color={Colors.mutedForeground} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <TextInput
              style={styles.titleInput}
              placeholder="Título (opcional)"
              placeholderTextColor={Colors.mutedForeground}
              value={title}
              onChangeText={setTitle}
            />

            {bannerImages.length > 0 && (
              <View style={styles.bannerSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {bannerImages.map((uri, index) => (
                    <View key={index} style={styles.bannerImageContainer}>
                      <Image source={{ uri }} style={styles.bannerImage} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() =>
                          setBannerImages(bannerImages.filter((_, i) => i !== index))
                        }
                      >
                        <X size={16} color={Colors.primaryForeground} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            <RichTextEditor
              ref={editorRef}
              content={content}
              onContentChange={setContent}
              placeholder="O que você está pensando?"
            />

            {bodyImages.length > 0 && (
              <View style={styles.bodyImagesSection}>
                <Text style={styles.sectionTitle}>Imagens no corpo</Text>
                <View style={styles.bodyImagesGrid}>
                  {bodyImages.map((uri, index) => (
                    <View key={index} style={styles.bodyImageContainer}>
                      <Image source={{ uri }} style={styles.bodyImage} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() =>
                          setBodyImages(bodyImages.filter((_, i) => i !== index))
                        }
                      >
                        <X size={16} color={Colors.primaryForeground} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {files.length > 0 && (
              <View style={styles.filesSection}>
                <Text style={styles.sectionTitle}>Arquivos anexados</Text>
                {files.map((file, index) => (
                  <View key={index} style={styles.fileItem}>
                    <View style={styles.fileInfo}>
                      <Paperclip size={20} color={Colors.blue} />
                      <View style={styles.fileDetails}>
                        <Text style={styles.fileName}>{file.name}</Text>
                        <Text style={styles.fileSize}>{file.size}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => setFiles(files.filter((_, i) => i !== index))}
                    >
                      <X size={20} color={Colors.mutedForeground} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {videos.length > 0 && (
              <View style={styles.videosSection}>
                <Text style={styles.sectionTitle}>Vídeos</Text>
                {videos.map((video, index) => (
                  <View key={index} style={styles.videoItem}>
                    <Image source={{ uri: video.thumbnail }} style={styles.videoThumbnail} />
                    <TouchableOpacity
                      style={styles.removeVideoButton}
                      onPress={() => setVideos(videos.filter((_, i) => i !== index))}
                    >
                      <X size={16} color={Colors.primaryForeground} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {videoLinks.length > 0 && (
              <View style={styles.videoLinksSection}>
                <Text style={styles.sectionTitle}>Links de vídeo</Text>
                {videoLinks.map((link, index) => (
                  <View key={index} style={styles.videoLinkItem}>
                    <View style={styles.videoLinkInfo}>
                      <VideoIcon size={20} color={Colors.blue} />
                      <View style={styles.videoLinkDetails}>
                        <Text style={styles.videoLinkPlatform}>{link.platform}</Text>
                        <Text style={styles.videoLinkUrl} numberOfLines={1}>
                          {link.url}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => setVideoLinks(videoLinks.filter((_, i) => i !== index))}
                    >
                      <X size={20} color={Colors.mutedForeground} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {scheduledDate && (
              <View style={styles.scheduleInfo}>
                <Calendar size={16} color={Colors.blue} />
                <Text style={styles.scheduleText}>
                  Agendado para: {scheduledDate.toLocaleString('pt-BR')}
                </Text>
                <TouchableOpacity onPress={() => setScheduledDate(null)}>
                  <X size={16} color={Colors.mutedForeground} />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          <View style={styles.toolbar}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.toolbarContent}
            >
              <TextFormattingDropdown onFormatSelect={handleFormatSelect} />

              <TouchableOpacity
                style={styles.toolButton}
                onPress={() => setShowEmojiPicker(true)}
              >
                <Smile size={20} color={Colors.mutedForeground} />
              </TouchableOpacity>

              <ImageUploaderDropdown
                onImagesSelected={(images: string[], type: 'banner' | 'body') => {
                  if (type === 'banner') {
                    if (bannerImages.length + images.length <= 10) {
                      setBannerImages([...bannerImages, ...images]);
                    }
                  } else {
                    if (bodyImages.length + images.length <= 10) {
                      setBodyImages([...bodyImages, ...images]);
                    }
                  }
                }}
                maxBannerImages={10 - bannerImages.length}
                maxBodyImages={10 - bodyImages.length}
              />

              <FileUploaderDropdown
                onFilesSelected={(newFiles: { name: string; size: string; uri: string }[]) => {
                  if (files.length + newFiles.length <= 10) {
                    setFiles([...files, ...newFiles]);
                  }
                }}
                maxFiles={10 - files.length}
              />

              <VideoUploaderDropdown
                onVideosSelected={(newVideos: { uri: string; thumbnail: string }[]) => {
                  if (videos.length + newVideos.length <= 5) {
                    setVideos([...videos, ...newVideos]);
                  }
                }}
                onVideoLinkAdded={(link: { platform: string; url: string }) => {
                  if (videoLinks.length < 10) {
                    setVideoLinks([...videoLinks, link]);
                  }
                }}
                maxVideos={5 - videos.length}
                maxVideoLinks={10 - videoLinks.length}
              />

              <TouchableOpacity
                style={styles.toolButton}
                onPress={() => setShowScheduleModal(true)}
              >
                <Calendar size={20} color={Colors.mutedForeground} />
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.channelButtonContainer}>
              <TouchableOpacity
                style={styles.channelButton}
                onPress={() => setShowChannelSelector(true)}
              >
                <Hash size={18} color={Colors.blue} />
                <Text style={styles.channelButtonText}>{selectedChannel}</Text>
                <ChevronDown size={16} color={Colors.blue} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.publishButton, !canPublish && styles.publishButtonDisabled]}
              onPress={handlePublish}
              disabled={!canPublish || isPublishing}
            >
              {isPublishing ? (
                <ActivityIndicator color={Colors.primaryForeground} />
              ) : (
                <Text style={styles.publishButtonText}>Publicar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <EmojiPicker
        visible={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onEmojiSelect={(emoji: string) => {
          const lastSegment = content[content.length - 1];
          const newContent = [...content];
          newContent[newContent.length - 1] = { ...lastSegment, text: lastSegment.text + emoji };
          setContent(newContent);
          setShowEmojiPicker(false);
        }}
      />

      <ChannelSelector
        visible={showChannelSelector}
        onClose={() => setShowChannelSelector(false)}
        selectedChannel={selectedChannel}
        onSelectChannel={(channel: string) => {
          setSelectedChannel(channel);
          setShowChannelSelector(false);
        }}
      />

      <ScheduleModal
        visible={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={(date: Date) => {
          setScheduledDate(date);
          setShowScheduleModal(false);
        }}
      />


    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  containerMaximized: {
    padding: 0,
    backgroundColor: Colors.background,
  },
  modal: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    width: '100%',
    maxWidth: 700,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalMaximized: {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  titleInput: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.muted,
    borderRadius: 8,
    marginBottom: 16,
  },
  bannerSection: {
    marginBottom: 16,
  },
  bannerImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  bannerImage: {
    width: 200,
    height: 120,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
  },
  bodyImagesSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginBottom: 12,
  },
  bodyImagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bodyImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  bodyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  filesSection: {
    marginTop: 16,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: Colors.muted,
    borderRadius: 8,
    marginBottom: 8,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  fileSize: {
    fontSize: 12,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  videosSection: {
    marginTop: 16,
  },
  videoItem: {
    position: 'relative',
    marginBottom: 12,
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeVideoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
  },
  videoLinksSection: {
    marginTop: 16,
  },
  videoLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: Colors.muted,
    borderRadius: 8,
    marginBottom: 8,
  },
  videoLinkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  videoLinkDetails: {
    flex: 1,
  },
  videoLinkPlatform: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  videoLinkUrl: {
    fontSize: 12,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    marginTop: 16,
  },
  scheduleText: {
    flex: 1,
    fontSize: 14,
    color: Colors.blue,
    fontWeight: '600' as const,
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 12,
  },
  toolbarContent: {
    paddingHorizontal: 20,
    gap: 12,
    alignItems: 'center',
  },
  channelButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  toolButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.accent,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.blue,
  },
  channelButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.blue,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  publishButton: {
    backgroundColor: Colors.blue,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  publishButtonDisabled: {
    backgroundColor: Colors.muted,
    opacity: 0.5,
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.primaryForeground,
  },
});
