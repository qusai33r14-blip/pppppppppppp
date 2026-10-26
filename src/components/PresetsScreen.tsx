/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bookmark, ArrowRight, Trash2, Users, Check, Plus } from 'lucide-react';
import { PlayerPreset, AppScreen } from '../types/mafia';
import { sound } from '../utils/audio';

interface PresetsScreenProps {
  presets: PlayerPreset[];
  onLoadPreset: (players: string[]) => void;
  onDeletePreset: (id: string) => void;
  onNavigate: (screen: AppScreen) => void;
}

export const PresetsScreen: React.FC<PresetsScreenProps> = ({
  presets,
  onLoadPreset,
  onDeletePreset,
  onNavigate,
}) => {
  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-4">
        <div>
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('PLAYERS');
            }}
            className="text-xs text-[#bca3cf] hover:text-white flex items-center gap-1 mb-1 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة لقائمة اللاعبين</span>
          </button>
          <h2 className="text-2xl font-black gold-gradient-text">القوائم والأسماء المحفوظة</h2>
        </div>
      </div>

      <p className="text-xs text-[#c4b5d4]">
        اختر أي قائمة محفوظة لتحميل جميع لاعبيها فوراً وبدء الجولة دون الحاجة لكتابة الأسماء مجدداً.
      </p>

      {presets.length === 0 ? (
        <div className="py-16 text-center text-slate-400 space-y-3 bg-[#150726]/60 rounded-2xl border border-white/5">
          <Bookmark className="w-10 h-10 mx-auto text-slate-500" />
          <p className="text-base font-bold text-white">لا توجد قوائم مخصصة محفوظة</p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            يمكنك حفظ أي مجموعة لاعبين من خلال شاشة «إدارة اللاعبين» بالضغط على زر «حفظ القائمة الحالية».
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {presets.map((preset) => {
            return (
              <div
                key={preset.id}
                className="bg-[#17082a] border border-[#d4af37]/25 rounded-2xl p-4 shadow-xl space-y-3 hover:border-[#d4af37]/50 transition-all text-right"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-[#d4af37]" />
                    <h3 className="text-base font-bold text-white">{preset.name}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#d1c4e9] bg-[#2a1045] px-2 py-0.5 rounded font-mono">
                      {preset.players.length} لاعبين
                    </span>
                    <button
                      onClick={() => {
                        if (window.confirm(`هل أنت متأكد من حذف قائمة "${preset.name}"؟`)) {
                          sound.playClick();
                          onDeletePreset(preset.id);
                        }
                      }}
                      className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                      title="حذف القائمة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-white/90 leading-relaxed bg-[#0e041b] p-2.5 rounded-xl border border-white/5">
                  {preset.players.join(' ، ')}
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => {
                      sound.playClick();
                      onLoadPreset(preset.players);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b45309] text-[#120422] text-xs font-black hover:brightness-110 active:scale-95 transition-all shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>استخدام هذه القائمة ({preset.players.length} لاعبين)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
