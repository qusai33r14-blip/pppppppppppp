/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Users, History, BookOpen, Sparkles, ChevronLeft, ShieldCheck, Flame } from 'lucide-react';
import { CREST_IMAGE } from '../data/roles';
import { AppScreen } from '../types/mafia';
import { sound } from '../utils/audio';

interface HomeScreenProps {
  playerCount: number;
  hasActiveRound: boolean;
  onNavigate: (screen: AppScreen) => void;
  onOpenRules: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  playerCount,
  hasActiveRound,
  onNavigate,
  onOpenRules,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4 py-8 max-w-lg mx-auto text-center">
      {/* Decorative Aura */}
      <div className="relative mb-6 group">
        <div className="absolute -inset-4 bg-gradient-to-tr from-[#9333ea]/30 via-[#d4af37]/20 to-[#dc2626]/20 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition duration-700 animate-pulse" />
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden gold-shimmer-border shadow-2xl shadow-purple-950/80 bg-[#160829]">
          <img
            src={CREST_IMAGE}
            alt="شعار لعبة المافيا"
            className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Title Lockup */}
      <div className="space-y-2 mb-8">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-[#d4af37] uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#eab308]" />
          <span>إصدار الهاتف الواحد للجمعات</span>
          <Sparkles className="w-3.5 h-3.5 text-[#eab308]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black gold-gradient-text tracking-tight">
          لعبة المافيا
        </h1>
        <p className="text-sm text-[#c4b5d4] max-w-sm mx-auto leading-relaxed">
          هاتف واحد يتناقله الأصدقاء لكشف أدوارهم سرًا، وتعيش المدينة ليلة مليئة بالغموض والترقب والخداع الذكي.
        </p>
      </div>

      {/* Resume Banner if Active Match */}
      {hasActiveRound && (
        <button
          onClick={() => {
            sound.playClick();
            onNavigate('GAME_RUNNING');
          }}
          className="w-full mb-4 p-3.5 rounded-xl bg-gradient-to-r from-[#701a75] via-[#4c1d95] to-[#831843] border border-[#d4af37]/50 shadow-lg text-white flex items-center justify-between text-right transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-amber-400/20 text-amber-300">
              <Flame className="w-5 h-5 animate-bounce" />
            </span>
            <div>
              <div className="text-xs text-amber-200 font-medium">جولة حالية قيد اللعب!</div>
              <div className="text-sm font-bold">العودة إلى إدارة أحداث الجولة والراوي</div>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-amber-300" />
        </button>
      )}

      {/* Main Action Buttons */}
      <div className="w-full space-y-3">
        {/* New Game Primary CTA */}
        <button
          onClick={() => {
            sound.playClick();
            onNavigate('PLAYERS');
          }}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#b45309] text-[#120422] font-black text-lg shadow-xl shadow-[#d4af37]/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-[#fef08a]/60"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>لعبة جديدة</span>
          <span className="text-xs bg-black/20 text-[#120422] font-bold px-2 py-0.5 rounded-full">
            {playerCount} لاعبين
          </span>
        </button>

        {/* Secondary Navigation Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('PRESETS');
            }}
            className="py-3 px-4 rounded-xl bg-[#1b0b30]/80 hover:bg-[#251040] border border-[#d4af37]/30 text-[#e9d5ff] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:border-[#d4af37]/60 active:scale-[0.98]"
          >
            <Users className="w-4 h-4 text-[#d4af37]" />
            <span>الأسماء المحفوظة</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onNavigate('HISTORY');
            }}
            className="py-3 px-4 rounded-xl bg-[#1b0b30]/80 hover:bg-[#251040] border border-[#d4af37]/30 text-[#e9d5ff] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:border-[#d4af37]/60 active:scale-[0.98]"
          >
            <History className="w-4 h-4 text-[#d4af37]" />
            <span>الجولات السابقة</span>
          </button>
        </div>

        {/* Rules Button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenRules();
          }}
          className="w-full py-3 px-4 rounded-xl bg-[#140624]/90 hover:bg-[#1f0a35] border border-white/10 hover:border-white/20 text-[#c4b5d4] hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <BookOpen className="w-4 h-4 text-[#38bdf8]" />
          <span>قواعد وأدوار اللعبة</span>
        </button>
      </div>

      {/* Feature Badges Footer */}
      <div className="mt-8 pt-6 border-t border-white/5 w-full flex items-center justify-center gap-6 text-[11px] text-[#9c89b0]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>كشف سرّي 100%</span>
        </div>
        <span className="text-white/20">·</span>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>حفظ محلي فوري</span>
        </div>
        <span className="text-white/20">·</span>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-purple-400" />
          <span>هاتف واحد يتناقله الكل</span>
        </div>
      </div>
    </div>
  );
};
