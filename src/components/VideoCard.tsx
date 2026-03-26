import React from 'react';
import { motion } from 'motion/react';
import { Play, Eye } from 'lucide-react';
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
  index: number;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      onClick={() => onClick(video)}
      className="bg-bg-card rounded-2xl overflow-hidden border border-border-accent cursor-pointer transition-all duration-250 ease-in-out hover:bg-bg-card-hover hover:border-accent/35 hover:shadow-[0_12px_32px_rgba(0,0,0,0.3),0_0_0_1px_rgba(139,111,212,0.2)]"
    >
      <div className="relative bg-[#12152a] aspect-video flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,111,212,0.08)_0%,transparent_70%)]" />
        
        <div className="absolute top-2.5 right-2.5 bg-accent text-white text-[0.78rem] font-bold py-1 px-3 rounded-full z-10">
          {video.level}
        </div>

        <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center transition-all duration-200 shadow-[0_4px_20px_rgba(139,111,212,0.3)] relative z-10 group-hover:scale-110 group-hover:shadow-[0_6px_28px_rgba(139,111,212,0.5)]">
          <Play className="fill-white text-white w-5.5 h-5.5 ml-[-2px]" />
        </div>

        <div className="absolute bottom-2.5 left-2.5 bg-black/85 text-white text-[0.8rem] font-bold py-0.5 px-2 rounded-md font-mono">
          {video.duration}
        </div>
      </div>

      <div className="p-4.5 pb-4.5">
        <h3 className="text-[1rem] font-extrabold text-text-primary mb-1.5 leading-tight">
          {video.title}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-[0.82rem] text-text-muted font-semibold">
            {video.unit}
          </span>
          <span className="text-[0.82rem] text-text-muted font-semibold flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 opacity-60" />
            {video.views} مشاهدة
          </span>
        </div>
      </div>
    </motion.div>
  );
};
