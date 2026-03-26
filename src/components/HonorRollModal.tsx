import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Award } from 'lucide-react';
import { HonorStudent } from '../types';

interface HonorRollModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: HonorStudent[];
}

export const HonorRollModal: React.FC<HonorRollModalProps> = ({ isOpen, onClose, students }) => {
  const [activeLevel, setActiveLevel] = useState<string>('أول ثانوي');

  const filteredStudents = students
    .filter((s) => s.level === activeLevel)
    .sort((a, b) => a.rank - b.rank);

  const levels = ['أول ثانوي', 'ثاني ثانوي', 'ثالث ثانوي'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#151619] border border-white/10 rounded-[2.5rem] overflow-hidden w-full max-w-[600px] max-h-[90vh] flex flex-col shadow-[0_32px_100px_rgba(0,0,0,0.8)]"
          >
            <div className="relative p-8 flex flex-col items-center text-center border-b border-white/5">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/40 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6 border border-accent/20">
                <Trophy className="w-10 h-10 text-accent" />
              </div>

              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-light via-white to-accent-light mb-2">
                لوحة شرف المتفوقين 🏆
              </h2>
              <p className="text-text-muted font-bold text-sm">أبطال مستر حمدي رضوان</p>
            </div>

            <div className="flex bg-white/5 p-1 mx-8 mt-6 rounded-2xl border border-white/5">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${
                    activeLevel === level
                      ? 'bg-accent text-white shadow-lg shadow-accent/20'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <motion.div
                    key={student.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between hover:bg-white/8 hover:border-accent/30 transition-all cursor-default"
                  >
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl shadow-lg ${
                          student.rank === 1 ? 'bg-accent text-white' : 'bg-bg-secondary text-text-primary'
                        }`}>
                          {student.rank}
                        </div>
                        {student.rank === 1 && (
                          <div className="absolute -top-2 -right-2 bg-yellow-500 text-black p-1 rounded-full animate-bounce">
                            <Award className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-lg font-black text-text-primary mb-1 group-hover:text-accent transition-colors">
                          {student.name}
                        </span>
                        <div className="flex items-center gap-2 text-text-muted font-bold text-xs">
                          <span>الدرجة:</span>
                          <span className="text-accent-light">{student.score}</span>
                          <span className="opacity-50">في الرياضيات</span>
                        </div>
                      </div>
                    </div>

                    {student.certificateUrl && (
                      <a
                        href={student.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-accent/10 text-accent hover:bg-accent hover:text-white px-4 py-2 rounded-xl text-xs font-black transition-all"
                      >
                        شهادة التقدير
                      </a>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-text-muted opacity-50">
                  <Trophy className="w-12 h-12 mb-4" />
                  <p className="font-bold">لا يوجد طلاب في لوحة الشرف لهذه المرحلة حالياً</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
