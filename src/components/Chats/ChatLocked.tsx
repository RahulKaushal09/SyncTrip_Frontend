import React from 'react'
import Link from 'next/link'
import { MessageCircle, Clock, Lock, ShieldCheck, Bell, ArrowLeft } from 'lucide-react'
import Playstore from '@/assets/icons/GetOnPlayStore.png'
import DisplayImg from '@/assets/images/di1.png'
import Image from 'next/image'

const ChatLocked = () => {
  return (
    <div className="relative bg-gradient-to-b from-white to-slate-50 flex items-center justify-center px-6 py-16 sm:px-12 font-sans overflow-hidden">
      
      {/* ── Top Navigation / Go Back Home ── */}
      <div className="absolute top-0 left-6 sm:top-10 sm:left-10 z-50">
        <Link 
          href="/" 
          className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-slate-200 text-slate-600 hover:text-[var(--secondary-1,#16324F)] hover:bg-white transition-all shadow-sm hover:shadow-md"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm font-semibold">Go back home</span>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8 max-w-6xl w-full mt-10 lg:mt-0">

        {/* ── Left: Phone Image Showcase ── */}
        <div className="relative flex-shrink-0 flex items-center justify-center w-full max-w-sm lg:max-w-md">
          
          {/* Enhanced Soft Glow Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full bg-[var(--primary-1,#3abeF5)] opacity-15 blur-[60px] pointer-events-none" />
          
          {/* Second accent glow for depth */}
          <div className="absolute bottom-0 right-10 w-[200px] h-[200px] rounded-full bg-[var(--secondary-1,#16324F)] opacity-10 blur-[50px] pointer-events-none" />

          {/* Floating Lock Badge */}
          <div className="absolute -top-6 right-4 sm:-right-4 z-20 flex items-center gap-2 rounded-2xl bg-white/90 backdrop-blur-md px-4 py-2.5 text-sm font-bold shadow-xl border border-slate-100 text-[var(--secondary-1)] animate-fade-in">
            <div className="flex items-center justify-center bg-red-100 text-red-500 rounded-full p-1.5">
              <Lock size={14} strokeWidth={2.5} />
            </div>
            Chats Locked
          </div>

          <img
            src={DisplayImg.src}
            alt="SyncTrip Chats on Mobile"
            className="relative z-10 w-[370px] md:w-[390px] object-contain drop-shadow-[0_20px_40px_rgba(22,50,79,0.25)] hover:scale-[1.05] transition-transform duration-500"
          />
        </div>

        {/* ── Right: Content & Copy ── */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-lg z-10">

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[var(--primary-4,#E5F6FE)] px-4 py-2 text-xs font-semibold text-[var(--primary-1,#3abeF5)] border border-[var(--primary-3,#B3E5FC)] mb-6 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary-1)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--primary-1)]"></span>
            </span>
            Now on SyncTrip Mobile
          </div>

          {/* Main Heading */}
          <h1 className="mb-3 text-4xl sm:text-5xl font-extrabold text-[var(--secondary-1,#16324F)] leading-[1.15] tracking-tight font-serif">
            Your chats moved <br className="hidden sm:block" />
            to the <span className="text-[var(--primary-1,#3abeF5)] relative inline-block">
              mobile app
              {/* Subtle underline accent */}
              <svg className="absolute w-3/4 h-3 -bottom-1 left-0 text-[var(--primary-1)]/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>

          {/* Subtext */}
          <p className="mb-10 text-base sm:text-lg text-slate-500 leading-relaxed max-w-md">
            Stay connected with your travel group on the go. Real-time messages,
            trip updates, and shared plans are all seamlessly synced inside the app.
          </p>

          {/* Feature List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-8 w-full">
            {[
              { icon: <MessageCircle size={18} />, label: 'Group & private chats' },
              { icon: <Bell size={18} />,          label: 'Instant notifications' },
              { icon: <ShieldCheck size={18} />,   label: 'End-to-end secure' },
              { icon: <Clock size={18} />,         label: 'Real-time trip updates' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3 group">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--primary-4,#E5F6FE)] text-[var(--primary-1,#3abeF5)] group-hover:bg-[var(--primary-1)] group-hover:text-white transition-colors duration-300 shadow-sm">
                  {icon}
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Action Area */}
          <div className="flex flex-col items-center lg:items-start w-full">
            
            {/* Fix: Wrapped Next.js Image in an standard <a> tag. 
              This is better for accessibility, SEO, and allows users to "Open in new tab".
            */}
            <a 
              href="https://play.google.com/store/apps/details?id=com.synctrip" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block hover:scale-105 active:scale-95 transition-transform duration-300"
            >
              <Image 
                src={Playstore} 
                alt="Get it on Google Play" 
                className="w-52 sm:w-60 h-auto" 
                priority
              />
            </a>

            {/* Footnote */}
            <p className="flex items-center gap-2 mt-5 text-xs font-medium text-slate-400">
              <ShieldCheck size={14} className="text-emerald-500" />
              Free to download • Available on Google Playstore
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ChatLocked