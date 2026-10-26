/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, VolumeX, Shield, BookOpen, Home } from 'lucide-react';
import { sound } from '../utils/audio';
import { AppScreen } from '../types/mafia';

interface HeaderProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onOpenRules: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate, onOpenRules }) => {
  const [soundActive, setSoundActive] = useState<boolean>(sound.isEnabled());

  const handleToggleSound = () => {
    const nextState = sound.toggle();
    setSoundActive(nextState);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#120720]/90 backdrop-blur-md border-b border-[#d4af37]/25 px-4 py-2.5 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            sound.playClick();
            onNavigate('HOME');
          }}
          className="flex items-center gap-2.5 text-right group transition-transform active:scale-95"
          title="العودة للشاشة الرئيسية"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37] via-[#9333ea] to-[#1e0a38] p-0.5 shadow-md shadow-[#9333ea]/20">
            <div className="w-full h-full bg-[#0d0517] rounded-[6px] flex items-center justify-center">
              <span className="text-base select-none">🎭</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight gold-gradient-text leading-tight">
              لعبة المافيا
            </span>
            <span className="text-[10px] text-[#bca3cf] font-medium leading-none">
              إصدار الهاتف الواحد
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 text-xs font-semibold">
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('HOME');
            }}
            className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
              currentScreen === 'HOME'
                ? 'bg-[#2a1345] text-[#fcd34d] border border-[#d4af37]/30'
                : 'text-[#d1c4e9] hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">الرئيسية</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onNavigate('PLAYERS');
            }}
            className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentScreen === 'PLAYERS'
                ? 'bg-[#2a1345] text-[#fcd34d] border border-[#d4af37]/30'
                : 'text-[#d1c4e9] hover:text-white hover:bg-white/5'
            }`}
          >
            اللاعبين
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onNavigate('ROLES');
            }}
            className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentScreen === 'ROLES'
                ? 'bg-[#2a1345] text-[#fcd34d] border border-[#d4af37]/30'
                : 'text-[#d1c4e9] hover:text-white hover:bg-white/5'
            }`}
          >
            الأدوار
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenRules();
            }}
            className="px-2.5 py-1.5 rounded-md text-[#d1c4e9] hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#eab308]" />
            <span>القواعد</span>
          </button>
        </nav>

        {/* Zone 3: Single Primary Action / Utility */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-lg border transition-all ${
              soundActive
                ? 'bg-[#2b1045] border-[#d4af37]/40 text-[#fcd34d] shadow-sm'
                : 'bg-black/40 border-white/10 text-slate-400'
            }`}
            title={soundActive ? 'كتم المؤثرات الصوتية' : 'تفعيل المؤثرات الصوتية'}
            aria-label="تبديل الصوت"
          >
            {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
