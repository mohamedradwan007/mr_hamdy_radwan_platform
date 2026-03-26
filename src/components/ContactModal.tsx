import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, MessageCircle, Send, Mail, MapPin } from 'lucide-react';
import { SiteConfig } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, config }) => {
  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-bg-secondary border border-border-accent rounded-3xl overflow-hidden w-full max-w-[500px] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
          >
            <div className="flex justify-between items-center p-4 px-6 border-b border-border-accent">
              <h2 className="text-[1.1rem] font-extrabold text-text-primary">
                تواصل معنا
              </h2>
              <button
                onClick={onClose}
                className="text-text-muted hover:text-white hover:bg-white/8 p-1 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-bg-card rounded-2xl border border-border-accent hover:border-accent/30 transition-all">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-text-muted text-xs font-bold mb-0.5">رقم الهاتف</p>
                  <p className="text-text-primary font-bold">{config.contactDetails.phone}</p>
                </div>
              </div>

              <a 
                href={config.contactDetails.whatsapp} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-bg-card rounded-2xl border border-border-accent hover:border-accent/30 transition-all no-underline"
              >
                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-text-muted text-xs font-bold mb-0.5">واتساب</p>
                  <p className="text-text-primary font-bold">تحدث معنا الآن</p>
                </div>
              </a>

              <a 
                href={config.contactDetails.telegram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-bg-card rounded-2xl border border-border-accent hover:border-accent/30 transition-all no-underline"
              >
                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-text-muted text-xs font-bold mb-0.5">تيليجرام</p>
                  <p className="text-text-primary font-bold">قناة التليجرام</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 bg-bg-card rounded-2xl border border-border-accent hover:border-accent/30 transition-all">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-text-muted text-xs font-bold mb-0.5">البريد الإلكتروني</p>
                  <p className="text-text-primary font-bold">{config.contactDetails.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-bg-card rounded-2xl border border-border-accent hover:border-accent/30 transition-all">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-text-muted text-xs font-bold mb-0.5">العنوان</p>
                  <p className="text-text-primary font-bold">{config.contactDetails.address}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
