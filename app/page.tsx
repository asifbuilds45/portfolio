import { Navbar } from '@/components/public/Navbar';
import { HeroSection } from '@/components/public/HeroSection';
import { AboutSection } from '@/components/public/AboutSection';
import { EducationSection } from '@/components/public/EducationSection';
import { ExperienceSection } from '@/components/public/ExperienceSection';
import { ProjectsSection } from '@/components/public/ProjectsSection';
import { AwardsSection } from '@/components/public/AwardsSection';
import { ContactSection } from '@/components/public/ContactSection';
import { Footer } from '@/components/public/Footer';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getData() {
  const supabase = await createServerSupabaseClient();
  const [
    { data: profile },
    { data: about },
    { data: skills },
    { data: education },
    { data: experience },
    { data: projects },
    { data: awards },
    { data: contact },
    { data: socialLinks },
  ] = await Promise.all([
    supabase.from('profile').select('*').single(),
    supabase.from('about').select('*').single(),
    supabase.from('skills').select('*').order('sort_order'),
    supabase.from('education').select('*').order('sort_order'),
    supabase.from('experience').select('*').order('sort_order'),
    supabase.from('projects').select('*').order('sort_order'),
    supabase.from('awards').select('*').order('sort_order'),
    supabase.from('contact').select('*').single(),
    supabase.from('social_links').select('*').order('sort_order'),
  ]);

  return { profile, about, skills, education, experience, projects, awards, contact, socialLinks };
}

export default async function HomePage() {
  const data = await getData();

  return (
    <main>
      <Navbar cvUrl={data.profile?.cv_url} />
      <HeroSection profile={data.profile} />
      <AboutSection about={data.about} skills={data.skills ?? []} />
      <EducationSection items={data.education ?? []} />
      <ExperienceSection items={data.experience ?? []} />
      <ProjectsSection projects={data.projects ?? []} />
      <AwardsSection awards={data.awards ?? []} />
      <ContactSection />
      <Footer contact={data.contact} socialLinks={data.socialLinks ?? []} />
    </main>
  );
}