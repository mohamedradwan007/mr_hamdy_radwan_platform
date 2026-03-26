export interface User {
  role: 'admin' | 'student' | null;
  phone?: string;
  name?: string;
  uid?: string;
  email?: string | null;
}

export interface Video {
  id: number;
  title: string;
  unit: string;
  level: string;
  duration: string;
  views: number;
  ytLink: string;
}

export interface HonorStudent {
  id: number;
  name: string;
  score: string;
  level: string;
  rank: number;
  certificateUrl?: string;
}

export interface SiteConfig {
  siteName: string;
  siteSubtitle?: string;
  examsLink: string;
  showContact?: boolean;
  contactDetails: {
    phone: string;
    whatsapp: string;
    telegram: string;
    email: string;
    address: string;
  };
  heroTitle: string;
  heroSubtitle: string;
}
