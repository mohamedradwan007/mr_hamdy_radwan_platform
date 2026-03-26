import React from 'react';
import { LogIn, Settings, LogOut, Trophy } from 'lucide-react';
import { SiteConfig, User } from '../types';

interface NavbarProps {
  config: SiteConfig;
  user: User;
  onContactClick: () => void;
  onHonorRollClick: () => void;
  onLoginClick: () => void;
  onAdminClick: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config, user, onContactClick, onHonorRollClick,
  onLoginClick, onAdminClick, onLogout
}) => {
  return (
    <nav className="bg-bg-secondary border-b border-border-accent sticky top-0 z-50 backdrop-blur-xl">

      {/* السطر الأول: اسم المستر */}
      <div className="flex flex-col items-center justify-center pt-4 pb-2 px-4 text-center">
        <span className="text-[1.2rem] md:text-[1.4rem] font-black text-accent-light leading-none">
          {config.siteName}
        </span>
        {config.siteSubtitle && (
          <span className="text-[0.65rem] md:text-[0.75rem] font-bold text-text-muted mt-1">
            {config.siteSubtitle}
          </span>
        )}
      </div>

      {/* السطر الثاني: الأزرار */}
      <div className="flex items-center justify-center gap-1 md:gap-2 px-4 pb-3 flex-wrap">
        <a href="#"
          className="text-accent-light bg-accent/12 no-underline text-[0.8rem] md:text-[0.9rem] font-bold py-1.5 px-3 md:py-2 md:px-4 rounded-xl transition-all">
          الفيديوهات
        </a>

        {/* زرار لوحة الشرف الذهبي مع shimmer */}
        <button
          onClick={onHonorRollClick}
          className="relative flex items-center gap-1.5 font-bold py-1.5 px-3 md:py-2 md:px-4 rounded-xl transition-all cursor-pointer border border-[#f5d060]/40 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(245,208,96,0.15) 0%, rgba(200,150,12,0.25) 50%, rgba(245,208,96,0.15) 100%)',
            color: '#e6b800',
          }}
        >
          {/* shimmer layer */}
          <span
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,220,80,0.35) 50%, transparent 60%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2.5s infinite',
            }}
          />
          <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4 relative z-10" style={{ color: '#f5c842' }} />
          <span className="relative z-10 text-[0.8rem] md:text-[0.9rem]">لوحة الشرف</span>
        </button>

        <a href={config.examsLink} target="_blank" rel="noopener noreferrer"
          className="text-text-muted hover:text-accent-light hover:bg-accent/12 no-underline text-[0.8rem] md:text-[0.9rem] font-bold py-1.5 px-3 md:py-2 md:px-4 rounded-xl transition-all">
          الامتحانات
        </a>
        {config.showContact !== false && (
          <button onClick={onContactClick}
            className="text-text-muted hover:text-accent-light hover:bg-accent/12 text-[0.8rem] md:text-[0.9rem] font-bold py-1.5 px-3 md:py-2 md:px-4 rounded-xl transition-all cursor-pointer border-none bg-transparent">
            تواصل معنا
          </button>
        )}

        <div className="w-px h-5 bg-border-accent mx-1" />

        {user.role === 'admin' ? (
          <>
            <button onClick={onAdminClick}
              className="text-accent hover:bg-accent/10 p-2 rounded-xl transition-all cursor-pointer border-none bg-transparent" title="لوحة التحكم">
              <Settings className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button onClick={onLogout}
              className="text-red-400 hover:bg-red-400/10 p-2 rounded-xl transition-all cursor-pointer border-none bg-transparent" title="خروج">
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </>
        ) : user.role === 'student' ? (
          <button onClick={onLogout}
            className="flex items-center gap-1.5 text-text-primary bg-bg-card border border-border-accent py-1.5 px-3 rounded-xl font-bold text-xs hover:bg-bg-card-hover transition-all">
            <LogOut className="w-3.5 h-3.5" />
            خروج
          </button>
        ) : (
          <button onClick={onLoginClick}
            className="flex items-center gap-1.5 text-white bg-accent py-1.5 px-4 rounded-xl font-black text-[0.85rem] hover:bg-accent-light transition-all shadow-lg shadow-accent/20">
            <LogIn className="w-4 h-4" />
            دخول
          </button>
        )}
      </div>
    </nav>
  );
};