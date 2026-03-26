import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, ShieldCheck, Phone, Lock, Mail } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (data: { type: 'admin' | 'student'; phone?: string; password?: string; useGoogle?: boolean }) => void;
  externalError?: string | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, externalError }) => {
  const [loginType, setLoginType] = useState<'student' | 'admin'>('student');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const displayError = error || externalError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (loginType === 'student') {
      if (phone.length < 10) {
        setError('يرجى إدخال رقم هاتف صحيح');
        return;
      }
      onLogin({ type: 'student', phone });
    } else {
      if (!password) {
        setError('يرجى إدخال كلمة المرور');
        return;
      }
      onLogin({ type: 'admin', password });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/88 z-[1000] flex items-center justify-center backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.93, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.93, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-secondary border border-border-accent rounded-3xl overflow-hidden w-full max-w-[400px] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
          >
            <div className="flex justify-between items-center p-4 px-6 border-b border-border-accent">
              <h2 className="text-[1.1rem] font-extrabold text-text-primary">
                تسجيل الدخول
              </h2>
              <button
                onClick={onClose}
                className="text-text-muted hover:text-white hover:bg-white/8 p-1 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex bg-bg-card rounded-xl p-1 mb-6 border border-border-accent">
                <button
                  onClick={() => setLoginType('student')}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    loginType === 'student' ? 'bg-accent text-white shadow-lg' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <User className="w-4 h-4" />
                  طالب
                </button>
                <button
                  onClick={() => setLoginType('admin')}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    loginType === 'admin' ? 'bg-accent text-white shadow-lg' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  أدمن
                </button>
              </div>

              {loginType === 'admin' && (
                <button
                  onClick={() => onLogin({ type: 'admin', useGoogle: true })}
                  className="w-full mb-6 bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all shadow-lg"
                >
                  <Mail className="w-5 h-5" />
                  الدخول بحساب جوجل (للمستر فقط)
                </button>
              )}

              {loginType === 'admin' && (
                <div className="relative flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-border-accent"></div>
                  <span className="text-[0.65rem] font-bold text-text-muted uppercase tracking-widest">أو بكلمة السر</span>
                  <div className="flex-1 h-px bg-border-accent"></div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {loginType === 'student' ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-muted mr-1">رقم الهاتف</label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full bg-bg-card border border-border-accent rounded-xl py-3 pr-10 pl-4 text-text-primary focus:outline-none focus:border-accent transition-all"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-muted mr-1">كلمة المرور</label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-bg-card border border-border-accent rounded-xl py-3 pr-10 pl-4 text-text-primary focus:outline-none focus:border-accent transition-all"
                      />
                    </div>
                  </div>
                )}

                {displayError && <p className="text-red-400 text-xs font-bold text-center">{displayError}</p>}

                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent-light text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-accent/20 mt-2"
                >
                  دخول
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
