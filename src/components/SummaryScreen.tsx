/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Trophy, Skull, Shield, RotateCcw, Home, Sparkles, CheckCircle2 } from 'lucide-react';
import { AssignedPlayer, RoleCounts, AppScreen } from '../types/mafia';
import { ROLES } from '../data/roles';
import { sound } from '../utils/audio';

interface SummaryScreenProps {
  players: AssignedPlayer[];
  roleCounts: RoleCounts;
  onSaveToHistory: (winner: 'CIVILIAN' | 'MAFIA' | 'UNDECIDED') => void;
  onPlayAgainSamePlayers: () => void;
  onNavigate: (screen: AppScreen) => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  players,
  onSaveToHistory,
  onPlayAgainSamePlayers,
  onNavigate,
}) => {
  const [selectedWinner, setSelectedWinner] = useState<'CIVILIAN' | 'MAFIA' | 'UNDECIDED'>('UNDECIDED');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSelectWinner = (winner: 'CIVILIAN' | 'MAFIA' | 'UNDECIDED') => {
    sound.playClick();
    setSelectedWinner(winner);
    onSaveToHistory(winner);
    setIsSaved(true);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      {/* Trophy & Finish Title */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#d4af37] via-[#9333ea] to-[#dc2626] p-0.5 mx-auto shadow-2xl shadow-purple-950">
          <div className="w-full h-full bg-[#120520] rounded-[14px] flex items-center justify-center">
            <Trophy className="w-8 h-8 text-[#d4af37]" />
          </div>
        </div>
        <h2 className="text-3xl font-black gold-gradient-text">كشف أدوار الجولة بالكامل</h2>
        <p className="text-xs text-[#bca3cf]">
          انتهت الجولة وسقطت الأقنعة! هذه هي الهويات الحقيقية لجميع اللاعبين:
        </p>
      </div>

      {/* Select Winner Banner */}
      <div className="bg-[#18082c] border border-[#d4af37]/30 p-4 rounded-2xl space-y-3 shadow-xl text-center">
        <div className="text-xs font-bold text-[#e2d5f0]">من حقق النصر في هذه الجولة؟</div>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => handleSelectWinner('CIVILIAN')}
            className={`py-3 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
              selectedWinner === 'CIVILIAN'
                ? 'bg-sky-950 border-sky-400 text-sky-200 shadow-lg shadow-sky-950/50'
                : 'bg-black/30 border-white/10 text-slate-300 hover:border-sky-500/50'
            }`}
          >
            <Shield className="w-4 h-4 text-sky-400" />
            <span>فوز حلف المدينة 🛡️</span>
          </button>

          <button
            onClick={() => handleSelectWinner('MAFIA')}
            className={`py-3 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
              selectedWinner === 'MAFIA'
                ? 'bg-red-950 border-red-500 text-red-200 shadow-lg shadow-red-950/50'
                : 'bg-black/30 border-white/10 text-slate-300 hover:border-red-500/50'
            }`}
          >
            <Skull className="w-4 h-4 text-red-400" />
            <span>فوز عصابة المافيا 🔪</span>
          </button>
        </div>

        {isSaved && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>تم حفظ نتيجة الجولة في السجل بنجاح!</span>
          </div>
        )}
      </div>

      {/* Full Roles Reveal Roster Table */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-[#bca3cf] px-1 flex items-center justify-between">
          <span>قائمة اللاعبين والأدوار ({players.length})</span>
          <span className="text-[10px] text-slate-400">الحالة / الانتماء</span>
        </div>

        {players.map((p) => {
          const role = ROLES[p.roleId];
          const isMafia = role.side === 'MAFIA';

          return (
            <div
              key={p.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                isMafia
                  ? 'bg-gradient-to-r from-[#200814] to-[#140624] border-red-500/40 shadow-sm'
                  : 'bg-gradient-to-r from-[#0c1829] to-[#140624] border-sky-500/30 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border relative"
                  style={{ borderColor: role.accentColor }}
                >
                  <img
                    src={role.image}
                    alt={role.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white truncate">{p.name}</span>
                    <span className="text-xs">{role.emoji}</span>
                  </div>
                  <div className="text-xs font-bold" style={{ color: role.accentColor }}>
                    {role.name}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isMafia
                      ? 'bg-red-950/80 text-red-300 border border-red-500/40'
                      : 'bg-sky-950/80 text-sky-300 border border-sky-500/40'
                  }`}
                >
                  {isMafia ? 'عصابة مافيا' : 'مدينة صالحة'}
                </span>
                <span
                  className={`text-[10px] font-medium ${
                    p.isAlive ? 'text-emerald-400' : 'text-slate-500 line-through'
                  }`}
                >
                  {p.isAlive ? 'نجا للنهاية ✓' : 'تم استبعاده ✗'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons Footer */}
      <div className="space-y-3 pt-2">
        <button
          onClick={() => {
            sound.playClick();
            onPlayAgainSamePlayers();
          }}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#b45309] text-[#120422] font-black text-base shadow-xl shadow-[#d4af37]/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-[#fef08a]/60"
        >
          <RotateCcw className="w-5 h-5" />
          <span>بدء جولة جديدة بنفس الأسماء 🔄</span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('PLAYERS');
            }}
            className="py-3 px-4 rounded-xl bg-[#1b0b30] hover:bg-[#270e44] border border-white/10 text-[#d1c4e9] hover:text-white font-bold text-xs transition-all active:scale-[0.98]"
          >
            تعديل قائمة الأسماء
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onNavigate('HOME');
            }}
            className="py-3 px-4 rounded-xl bg-[#140624] hover:bg-[#1d0834] border border-white/10 text-[#c4b5d4] hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
          >
            <Home className="w-3.5 h-3.5" />
            <span>العودة للرئيسية</span>
          </button>
        </div>
      </div>
    </div>
  );
};
