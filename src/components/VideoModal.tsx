import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Video } from '../types';

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  const getYouTubeId = (url: string) => {
    const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
    return m ? m[1] : null;
  };

  if (!video) return null;

  const ytId = getYouTubeId(video.ytLink);
  const embedUrl = ytId 
    ? `https://www.youtube.com/embed/${ytId}?autoplay=1` 
    : video.ytLink;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/88 z-[999] flex items-center justify-center backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.93, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.93, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-bg-secondary border border-border-accent rounded-3xl overflow-hidden w-full max-w-[860px] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
        >
          <div className="flex justify-between items-center p-4 px-5 border-b border-border-accent">
            <h2 className="text-[1rem] font-extrabold text-text-primary">
              {video.title}
            </h2>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-white hover:bg-white/8 p-1 rounded-lg transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="relative pb-[56.25%] h-0">
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full border-none"
              allowFullScreen
              allow="autoplay; encrypted-media"
              title={video.title}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
