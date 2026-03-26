import { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VideoCard } from './components/VideoCard';
import { VideoModal } from './components/VideoModal';
import { HonorRollModal } from './components/HonorRollModal';
import { LoginModal } from './components/LoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Video, SiteConfig, User, HonorStudent } from './types';
import { 
  db, auth, onAuthStateChanged, doc, collection, 
  setDoc, signInWithPopup, googleProvider, signOut, 
  getDoc, getDocs, deleteDoc 
} from './firebase';

// جلب كل البيانات من Firestore مرة واحدة (بدل onSnapshot لتوفير القراءات)
const fetchAllData = async () => {
  const [configSnap, videosSnap, honorSnap] = await Promise.all([
    getDoc(doc(db, 'config', 'main')),
    getDocs(collection(db, 'videos')),
    getDocs(collection(db, 'honor_roll')),
  ]);

  const config = configSnap.exists() 
    ? configSnap.data() as SiteConfig 
    : { siteName: "منصة المستر حمدي", examsLink: "#", contactDetails: { phone: '', whatsapp: '', telegram: '', email: '', address: '' }, heroTitle: '', heroSubtitle: '' } as SiteConfig;

  const videos = videosSnap.docs.map(d => ({ ...d.data(), id: Number(d.id) } as Video));
  const honorRoll = honorSnap.docs.map(d => ({ ...d.data(), id: Number(d.id) } as HonorStudent));

  return { config, videos, honorRoll };
};

export default function App() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [students, setStudents] = useState<{ phone: string; name: string }[]>([]);
  const [honorRoll, setHonorRoll] = useState<HonorStudent[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isHonorRollOpen, setIsHonorRollOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [user, setUser] = useState<User>({ role: null });
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // جلب البيانات عند بدء التشغيل
  useEffect(() => {
    fetchAllData().then(({ config, videos, honorRoll }) => {
      setConfig(config);
      setVideos(videos);
      setHonorRoll(honorRoll);
    }).catch(console.error);
  }, []);

  // إدارة الـ Auth
  useEffect(() => {
    const savedUser = localStorage.getItem('student_user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch {}
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const isAdmin = firebaseUser.email === "mohamed.radwannn0@gmail.com";
        const newUser: User = {
          role: isAdmin ? 'admin' : 'student',
          name: isAdmin ? 'المستر حمدي رضوان' : (firebaseUser.displayName || 'طالب'),
          email: firebaseUser.email,
          uid: firebaseUser.uid
        };
        setUser(newUser);
        localStorage.setItem('student_user', JSON.stringify(newUser));
      }
      setIsAuthReady(true);
    });

    return () => unsubscribeAuth();
  }, []);

  // جلب الطلاب للأدمن فقط عند الحاجة
  useEffect(() => {
    if (user.role === 'admin') {
      getDocs(collection(db, 'students')).then(snap => {
        setStudents(snap.docs.map(d => d.data() as { phone: string; name: string }));
      }).catch(console.error);
    }
  }, [user.role]);

  const handleUpdateConfig = async (newConfig: SiteConfig) => {
    try {
      setIsSaving(true);
      await setDoc(doc(db, 'config', 'main'), newConfig, { merge: true });
      setConfig(newConfig);
    } catch (e) { 
      console.error('خطأ في حفظ الإعدادات:', e); 
      alert('حدث خطأ أثناء الحفظ، تحقق من الاتصال');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateVideos = async (newVideos: Video[], deletedIds: number[] = []) => {
    try {
      setIsSaving(true);
      // احذف الفيديوهات المحذوفة من Firestore
      for (const id of deletedIds) {
        await deleteDoc(doc(db, 'videos', String(id)));
      }
      // احفظ الفيديوهات الموجودة
      for (const v of newVideos) {
        await setDoc(doc(db, 'videos', String(v.id)), v, { merge: true });
      }
      setVideos(newVideos);
    } catch (e) {
      console.error('خطأ في حفظ الفيديوهات:', e);
      alert('حدث خطأ أثناء الحفظ، تحقق من الاتصال');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStudents = async (newStudents: { phone: string; name: string }[], deletedPhones: string[] = []) => {
    try {
      setIsSaving(true);
      // احذف الطلاب المحذوفين من Firestore
      for (const phone of deletedPhones) {
        await deleteDoc(doc(db, 'students', phone));
      }
      // احفظ الطلاب الجدد
      for (const st of newStudents) {
        await setDoc(doc(db, 'students', st.phone), st, { merge: true });
      }
      setStudents(newStudents);
    } catch (e) {
      console.error('خطأ في حفظ الطلاب:', e);
      alert('حدث خطأ أثناء الحفظ، تحقق من الاتصال');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateHonorRoll = async (newHonorRoll: HonorStudent[], deletedIds: number[] = []) => {
    try {
      setIsSaving(true);
      // احذف المحذوفين من Firestore
      for (const id of deletedIds) {
        await deleteDoc(doc(db, 'honor_roll', String(id)));
      }
      // احفظ الباقيين
      for (const st of newHonorRoll) {
        await setDoc(doc(db, 'honor_roll', String(st.id)), st, { merge: true });
      }
      setHonorRoll(newHonorRoll);
    } catch (e) {
      console.error('خطأ في حفظ لوحة الشرف:', e);
      alert('حدث خطأ أثناء الحفظ، تحقق من الاتصال');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogin = async (loginData: any) => {
    if (loginData.type === 'admin') {
      if (loginData.useGoogle) {
        try { 
          await signInWithPopup(auth, googleProvider); 
          setIsLoginOpen(false); 
        } catch (err) { 
          setLoginError('فشل الدخول بحساب جوجل'); 
        }
      } else if (loginData.password === 'admin123') {
        const admin: User = { role: 'admin', name: 'المستر حمدي رضوان' };
        setUser(admin);
        localStorage.setItem('student_user', JSON.stringify(admin));
        setIsLoginOpen(false);
      } else { 
        setLoginError('الباسورد غلط'); 
      }
    } else {
      try {
        const studentDoc = await getDoc(doc(db, 'students', loginData.phone));
        if (studentDoc.exists()) {
          const student = { role: 'student', ...studentDoc.data() } as User;
          setUser(student);
          localStorage.setItem('student_user', JSON.stringify(student));
          setIsLoginOpen(false);
        } else { 
          setLoginError('الرقم غير مسجل'); 
        }
      } catch (e) {
        setLoginError('حدث خطأ، تحقق من الاتصال');
      }
    }
  };

  const handleLogout = () => {
    signOut(auth);
    localStorage.removeItem('student_user');
    setUser({ role: null });
    setStudents([]);
  };

  const levels = useMemo(() => ['all', ...Array.from(new Set(videos.map(v => v.level)))], [videos]);
  const filteredVideos = useMemo(() => 
    activeFilter === 'all' ? videos : videos.filter(v => v.level === activeFilter), 
    [activeFilter, videos]
  );

  if (!config && !isAuthReady) return (
    <div className="h-screen bg-bg-primary flex items-center justify-center text-accent">
      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans bg-bg-primary overflow-x-hidden rtl">
      <Navbar 
        config={config || {} as any} 
        user={user} 
        onContactClick={() => {}}
        onHonorRollClick={() => setIsHonorRollOpen(true)} 
        onLoginClick={() => setIsLoginOpen(true)} 
        onAdminClick={() => setIsAdminOpen(true)} 
        onLogout={handleLogout}
      />
      
      <Hero config={config || {} as any} user={user} />

      {user.role ? (
        <div className="max-w-7xl mx-auto px-5 pb-20">
          <div className="flex overflow-x-auto py-6 gap-2 no-scrollbar">
            {levels.map(l => (
              <button 
                key={l} 
                onClick={() => setActiveFilter(l)} 
                className={`whitespace-nowrap py-2 px-6 rounded-full font-bold transition-all ${
                  activeFilter === l 
                    ? 'bg-accent text-white shadow-lg' 
                    : 'bg-bg-card text-text-muted hover:bg-bg-card-hover'
                }`}
              >
                {l === 'all' ? 'الكل' : l}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVideos.map((v, i) => (
              <VideoCard key={v.id} video={v} index={i} onClick={setSelectedVideo} />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-20 text-center px-5">
          <div className="max-w-md mx-auto bg-bg-card border border-border-accent p-10 rounded-3xl shadow-2xl">
            <h2 className="text-xl font-black mb-6">سجل دخولك لمتابعة دروسك</h2>
            <button 
              onClick={() => setIsLoginOpen(true)} 
              className="w-full bg-accent text-white font-black py-4 rounded-xl shadow-xl shadow-accent/20 transition-all"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      )}

      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      <HonorRollModal isOpen={isHonorRollOpen} onClose={() => setIsHonorRollOpen(false)} students={honorRoll} />
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => { setIsLoginOpen(false); setLoginError(null); }} 
        onLogin={handleLogin} 
        externalError={loginError} 
      />
      
      {isAdminOpen && (
        <AdminDashboard 
          isOpen={isAdminOpen} 
          onClose={() => setIsAdminOpen(false)} 
          config={config || {} as any} 
          videos={videos} 
          students={students} 
          honorRoll={honorRoll}
          isSaving={isSaving}
          onUpdateConfig={async (cfg) => { await handleUpdateConfig(cfg); setIsAdminOpen(false); }}
          onUpdateVideos={async (vids, deletedIds) => { await handleUpdateVideos(vids, deletedIds); setIsAdminOpen(false); }}
          onUpdateStudents={async (s, deletedPhones) => { await handleUpdateStudents(s, deletedPhones); setIsAdminOpen(false); }}
          onUpdateHonorRoll={async (h, deletedIds) => { await handleUpdateHonorRoll(h, deletedIds); setIsAdminOpen(false); }}
        />
      )}
    </div>
  );
}
