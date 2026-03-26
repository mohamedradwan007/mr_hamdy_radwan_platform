import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Save, Trophy } from 'lucide-react';
import { Video, SiteConfig, HonorStudent } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  videos: Video[];
  students: { phone: string; name: string }[];
  honorRoll: HonorStudent[];
  isSaving?: boolean;
  onUpdateConfig: (config: SiteConfig) => void;
  onUpdateVideos: (videos: Video[], deletedIds: number[]) => void;
  onUpdateStudents: (students: { phone: string; name: string }[], deletedPhones: string[]) => void;
  onUpdateHonorRoll: (honorRoll: HonorStudent[], deletedIds: number[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen, onClose, config, videos, students, honorRoll,
  isSaving, onUpdateConfig, onUpdateVideos, onUpdateStudents, onUpdateHonorRoll,
}) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'config' | 'students' | 'honor'>('videos');
  const [localConfig, setLocalConfig] = useState(config);
  const [localVideos, setLocalVideos] = useState(videos);
  const [localStudents, setLocalStudents] = useState(students);
  const [localHonorRoll, setLocalHonorRoll] = useState(honorRoll);

  // تتبع العناصر المحذوفة عشان نحذفها من Firestore
  const [deletedVideoIds, setDeletedVideoIds] = useState<number[]>([]);
  const [deletedStudentPhones, setDeletedStudentPhones] = useState<string[]>([]);
  const [deletedHonorIds, setDeletedHonorIds] = useState<number[]>([]);

  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentName, setNewStudentName] = useState('');

  const [newHonorName, setNewHonorName] = useState('');
  const [newHonorScore, setNewHonorScore] = useState('');
  const [newHonorLevel, setNewHonorLevel] = useState('أول ثانوي');
  const [newHonorRank, setNewHonorRank] = useState(1);
  const [newHonorCert, setNewHonorCert] = useState('');

  const handleAddVideo = () => {
    const newVideo: Video = {
      id: Date.now(),
      title: 'فيديو جديد',
      unit: 'الوحدة الأولى',
      level: 'أول ثانوي',
      duration: '00:00',
      views: 0,
      ytLink: '',
    };
    setLocalVideos([newVideo, ...localVideos]);
  };

  const handleRemoveVideo = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الفيديو نهائياً؟')) {
      setLocalVideos(prev => prev.filter(v => v.id !== id));
      setDeletedVideoIds(prev => [...prev, id]); // تسجيل الـ id للحذف من Firestore
    }
  };

  const handleUpdateVideo = (id: number, field: keyof Video, value: string) => {
    setLocalVideos(localVideos.map(v => 
      v.id === id ? { ...v, [field]: field === 'views' ? parseInt(value) || 0 : value } : v
    ));
  };

  const handleAddStudent = () => {
    if (!newStudentPhone || !newStudentName) return;
    if (localStudents.find(s => s.phone === newStudentPhone)) {
      alert("هذا الطالب مسجل بالفعل!");
      return;
    }
    setLocalStudents([...localStudents, { phone: newStudentPhone, name: newStudentName }]);
    setNewStudentPhone('');
    setNewStudentName('');
  };

  const handleRemoveStudent = (phone: string) => {
    if (window.confirm('هل تريد حذف هذا الطالب؟')) {
      setLocalStudents(localStudents.filter(s => s.phone !== phone));
      setDeletedStudentPhones(prev => [...prev, phone]); // تسجيل للحذف من Firestore
    }
  };

  const handleAddHonor = () => {
    if (!newHonorName || !newHonorScore) return;
    const newHonor: HonorStudent = {
      id: Date.now(),
      name: newHonorName,
      score: newHonorScore,
      level: newHonorLevel,
      rank: newHonorRank,
      certificateUrl: newHonorCert || ""
    };
    setLocalHonorRoll([newHonor, ...localHonorRoll]);
    setNewHonorName('');
    setNewHonorScore('');
    setNewHonorCert('');
  };

  const handleRemoveHonor = (id: number) => {
    if (window.confirm('حذف الطالب من لوحة الشرف؟')) {
      setLocalHonorRoll(localHonorRoll.filter(h => h.id !== id));
      setDeletedHonorIds(prev => [...prev, id]); // تسجيل للحذف من Firestore
    }
  };

  const handleSaveAll = async () => {
    // بنبعت الـ deleted IDs مع البيانات الجديدة عشان App.tsx يحذفهم من Firestore
    onUpdateConfig(localConfig);
    onUpdateVideos(localVideos, deletedVideoIds);
    onUpdateStudents(localStudents, deletedStudentPhones);
    onUpdateHonorRoll(localHonorRoll, deletedHonorIds);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="bg-bg-secondary border border-border-accent rounded-3xl overflow-hidden w-full max-w-[1000px] h-[90vh] flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center p-4 px-6 border-b border-border-accent bg-bg-card/50">
              <h2 className="text-[1.2rem] font-black text-accent-light">لوحة التحكم</h2>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-900/20"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? 'جاري الحفظ...' : 'حفظ الكل'}
                </button>
                <button
                  onClick={onClose}
                  className="text-text-muted hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex bg-bg-card/30 border-b border-border-accent overflow-x-auto">
              {[
                { id: 'videos', label: 'إدارة الفيديوهات' },
                { id: 'students', label: 'قاعدة بيانات الطلاب' },
                { id: 'honor', label: 'لوحة الشرف' },
                { id: 'config', label: 'إعدادات المنصة' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-8 py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'border-accent text-accent bg-accent/5' 
                      : 'border-transparent text-text-muted hover:text-text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">

              {/* تاب الفيديوهات */}
              {activeTab === 'videos' && (
                <div className="space-y-4">
                  <button
                    onClick={handleAddVideo}
                    className="w-full py-6 border-2 border-dashed border-border-accent rounded-2xl text-text-muted hover:text-accent hover:border-accent hover:bg-accent/5 transition-all flex items-center justify-center gap-2 font-bold"
                  >
                    <Plus className="w-5 h-5" />
                    إضافة فيديو جديد للمنصة
                  </button>

                  {localVideos.map((video) => (
                    <div key={video.id} className="bg-bg-card border border-border-accent rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 hover:border-accent/30 transition-colors">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted">عنوان الفيديو</label>
                        <input value={video.title} onChange={(e) => handleUpdateVideo(video.id, 'title', e.target.value)} className="w-full bg-bg-secondary border border-border-accent rounded-xl p-2.5 text-sm text-text-primary outline-none focus:border-accent" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted">رابط يوتيوب</label>
                        <input value={video.ytLink} onChange={(e) => handleUpdateVideo(video.id, 'ytLink', e.target.value)} className="w-full bg-bg-secondary border border-border-accent rounded-xl p-2.5 text-sm text-text-primary outline-none focus:border-accent" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted">المرحلة الدراسية</label>
                        <select value={video.level} onChange={(e) => handleUpdateVideo(video.id, 'level', e.target.value)} className="w-full bg-bg-secondary border border-border-accent rounded-xl p-2.5 text-sm text-text-primary outline-none">
                          <option value="أول ثانوي">أول ثانوي</option>
                          <option value="ثاني ثانوي">ثاني ثانوي</option>
                          <option value="ثالث ثانوي">ثالث ثانوي</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted">الوحدة</label>
                        <input value={video.unit} onChange={(e) => handleUpdateVideo(video.id, 'unit', e.target.value)} className="w-full bg-bg-secondary border border-border-accent rounded-xl p-2.5 text-sm text-text-primary outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted">المدة</label>
                        <input value={video.duration} onChange={(e) => handleUpdateVideo(video.id, 'duration', e.target.value)} className="w-full bg-bg-secondary border border-border-accent rounded-xl p-2.5 text-sm text-text-primary outline-none" />
                      </div>
                      <div className="flex items-end justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <label className="text-xs font-bold text-text-muted">المشاهدات</label>
                          <input type="number" value={video.views} onChange={(e) => handleUpdateVideo(video.id, 'views', e.target.value)} className="w-full bg-bg-secondary border border-border-accent rounded-xl p-2.5 text-sm text-text-primary outline-none" />
                        </div>
                        <button onClick={() => handleRemoveVideo(video.id)} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-xl transition-all flex-shrink-0" title="حذف الفيديو">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* تاب الطلاب */}
              {activeTab === 'students' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-bg-card border border-border-accent p-6 rounded-2xl shadow-xl">
                    <h3 className="text-lg font-bold text-text-primary mb-4">إضافة طالب جديد</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <input type="text" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} placeholder="اسم الطالب بالكامل" className="bg-bg-secondary border border-border-accent rounded-xl p-3 text-text-primary outline-none focus:border-accent" />
                      <input type="tel" value={newStudentPhone} onChange={(e) => setNewStudentPhone(e.target.value)} placeholder="رقم الهاتف (للدخول)" className="bg-bg-secondary border border-border-accent rounded-xl p-3 text-text-primary outline-none focus:border-accent" />
                    </div>
                    <button onClick={handleAddStudent} className="w-full bg-accent hover:bg-accent-light text-white py-3 rounded-xl font-bold transition-all active:scale-[0.98]">
                      إضافة لقاعدة البيانات
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-text-primary mb-4 flex justify-between items-center">
                      <span>الطلاب المسجلين</span>
                      <span className="text-sm bg-accent/20 text-accent px-3 py-1 rounded-full">{localStudents.length} طالب</span>
                    </h3>
                    <div className="grid gap-2">
                      {localStudents.map((student) => (
                        <div key={student.phone} className="bg-bg-card border border-border-accent p-4 rounded-xl flex justify-between items-center group hover:border-accent/40 transition-all">
                          <div className="flex flex-col">
                            <span className="text-text-primary font-bold">{student.name}</span>
                            <span className="text-text-muted text-xs font-mono">{student.phone}</span>
                          </div>
                          <button onClick={() => handleRemoveStudent(student.phone)} className="text-red-400 hover:bg-red-400/10 p-2.5 rounded-lg transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* تاب لوحة الشرف */}
              {activeTab === 'honor' && (
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="bg-bg-card border border-border-accent p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-accent" />
                      إضافة طالب للوحة الشرف
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted">اسم المتفوق</label>
                        <input type="text" value={newHonorName} onChange={(e) => setNewHonorName(e.target.value)} placeholder="مثال: أحمد محمد علي" className="w-full bg-bg-secondary border border-border-accent rounded-xl p-3 text-text-primary outline-none focus:border-accent" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted">الدرجة النهائية</label>
                        <input type="text" value={newHonorScore} onChange={(e) => setNewHonorScore(e.target.value)} placeholder="مثال: 50/50" className="w-full bg-bg-secondary border border-border-accent rounded-xl p-3 text-text-primary outline-none focus:border-accent" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted">السنة الدراسية</label>
                        <select value={newHonorLevel} onChange={(e) => setNewHonorLevel(e.target.value)} className="w-full bg-bg-secondary border border-border-accent rounded-xl p-3 text-text-primary outline-none">
                          <option value="أول ثانوي">أول ثانوي</option>
                          <option value="ثاني ثانوي">ثاني ثانوي</option>
                          <option value="ثالث ثانوي">ثالث ثانوي</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted">الترتيب</label>
                        <input type="number" value={newHonorRank} onChange={(e) => setNewHonorRank(parseInt(e.target.value) || 1)} className="w-full bg-bg-secondary border border-border-accent rounded-xl p-3 text-text-primary outline-none" />
                      </div>
                    </div>
                    <div className="space-y-1 mb-4">
                      <label className="text-xs font-bold text-text-muted">رابط الشهادة (اختياري)</label>
                      <input type="text" value={newHonorCert} onChange={(e) => setNewHonorCert(e.target.value)} placeholder="ضع رابط الصورة المباشر هنا" className="w-full bg-bg-secondary border border-border-accent rounded-xl p-3 text-text-primary outline-none" />
                    </div>
                    <button onClick={handleAddHonor} className="w-full bg-accent hover:bg-accent-light text-white py-3 rounded-xl font-bold transition-all shadow-lg">
                      تأكيد الإضافة للوحة
                    </button>
                  </div>

                  <div className="space-y-3">
                    {[...localHonorRoll].sort((a, b) => {
                      if (a.level !== b.level) return a.level.localeCompare(b.level);
                      return a.rank - b.rank;
                    }).map((student) => (
                      <div key={student.id} className="bg-bg-card border border-border-accent p-4 rounded-xl flex justify-between items-center group hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${student.rank === 1 ? 'bg-yellow-500 text-black' : 'bg-accent/10 text-accent'}`}>
                            {student.rank}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-text-primary font-bold">{student.name}</span>
                            <div className="flex gap-2 text-[0.7rem] font-bold">
                              <span className="text-accent-light">{student.level}</span>
                              <span className="text-green-500">{student.score}</span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => handleRemoveHonor(student.id)} className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* تاب الإعدادات */}
              {activeTab === 'config' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 gap-5 bg-bg-card p-6 rounded-2xl border border-border-accent">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text-muted">اسم المنصة</label>
                      <input value={localConfig.siteName} onChange={(e) => setLocalConfig({ ...localConfig, siteName: e.target.value })} className="w-full bg-bg-secondary border border-border-accent rounded-xl p-3 text-text-primary outline-none focus:border-accent" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text-muted">تخصص المدرس (Subtitle)</label>
                      <input value={localConfig.siteSubtitle || ''} onChange={(e) => setLocalConfig({ ...localConfig, siteSubtitle: e.target.value })} className="w-full bg-bg-secondary border border-border-accent rounded-xl p-3 text-text-primary outline-none focus:border-accent" placeholder="مثال: معلم خبير في الرياضيات" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text-muted">رابط نظام الامتحانات</label>
                      <input value={localConfig.examsLink} onChange={(e) => setLocalConfig({ ...localConfig, examsLink: e.target.value })} className="w-full bg-bg-secondary border border-border-accent rounded-xl p-3 text-accent outline-none font-mono" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-border-accent/50">
                      <div>
                        <p className="text-sm font-bold text-text-primary">قسم "تواصل معنا"</p>
                        <p className="text-[0.65rem] text-text-muted">إخفاء أو إظهار طرق التواصل للطلاب</p>
                      </div>
                      <button
                        onClick={() => setLocalConfig({ ...localConfig, showContact: !localConfig.showContact })}
                        className={`w-12 h-6 rounded-full transition-all relative ${localConfig.showContact !== false ? 'bg-accent' : 'bg-gray-600'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${localConfig.showContact !== false ? 'right-1' : 'right-7'}`} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted">رابط واتساب</label>
                        <input value={localConfig.contactDetails?.whatsapp || ''} onChange={(e) => setLocalConfig({ ...localConfig, contactDetails: { ...localConfig.contactDetails, whatsapp: e.target.value } })} className="w-full bg-bg-secondary border border-border-accent rounded-xl p-3 text-sm text-text-primary outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted">رابط تيليجرام</label>
                        <input value={localConfig.contactDetails?.telegram || ''} onChange={(e) => setLocalConfig({ ...localConfig, contactDetails: { ...localConfig.contactDetails, telegram: e.target.value } })} className="w-full bg-bg-secondary border border-border-accent rounded-xl p-3 text-sm text-text-primary outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
