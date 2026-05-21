export interface Profile {
  id: string;
  name: string;
  tagline: string;
  intro: string;
  avatar_url: string | null;
  cv_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface About {
  id: string;
  content: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  sort_order: number;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  start_date: string;
  end_date: string;
  description: string | null;
  sort_order: number;
}

export interface Experience {
  id: string;
  job_title: string;
  company: string;
  start_date: string;
  end_date: string;
  description: string | null;
  sort_order: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  sort_order: number;
}

export interface Award {
  id: string;
  title: string;
  description: string;
  certificate_url: string | null;
  sort_order: number;
}

export interface Contact {
  id: string;
  email: string;
  phone: string | null;
  location: string | null;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  sort_order: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}