import React from 'react';
import { SiteConfig, User } from '../types';

interface HeroProps {
  config: SiteConfig;
  user: User;
}

export const Hero: React.FC<HeroProps> = ({ config, user = { role: null } }) => {
  return (
    <section className="bg-linear-to-b from-[#1a1d3a] to-bg-primary py-10 px-5 md:py-15 md:px-10 text-center border-b border-border">
      <h1 className="text-[1.7rem] md:text-[2.2rem] font-black text-text-primary mb-3">
        إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ مَنْ أَحْسَنَ عَمَلًا
      </h1>
      <p className="text-[0.9rem] md:text-[1rem] text-text-muted font-semibold">
        كل ساعة ذاكرتها ليها ثمنها يوم الامتحان
      </p>
      {user.role === 'student' && user.name && (
        <p className="text-[1rem] md:text-[1.2rem] text-purple-400 font-bold mt-3">
          أهلاً، {user.name} 👋
        </p>
      )}
    </section>
  );
};