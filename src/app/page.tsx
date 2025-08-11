// src/app/page.tsx

import { Metadata } from 'next';
import "../../styles/home/home.css";
import HomeHeroSection from '@/components/Home_new/HomeHeroSection';
import Testimonials from '@/components/Home_new/testimonialSection';
import BlogsHomePage from '../components/Home_new/homeBlogsSection';
// import { cookies } from 'next/headers';

export default async function Home() {
  // Data fetching with error handling
  
  return (
    <>
    <HomeHeroSection/>
    <Testimonials/>
    <BlogsHomePage/>
    </>
  );
}