import type { Metadata } from 'next';
import { LandingPage, landingContent } from '@/features/public';

export const metadata: Metadata = {
  title: landingContent.meta.title,
  description: landingContent.meta.description,
};

export default function Home() {
  return <LandingPage />;
}
