/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, Minus, Shuffle, CheckCircle2, AlertTriangle, Wand2, Shield, Skull, ArrowRight, Info } from 'lucide-react';
import { RoleCounts, RoleId, AppScreen } from '../types/mafia';
import { ROLES, ROLE_LIST, getRecommendedRoleSetup } from '../data/roles';
import { calculateTotalRoles, countBySide } from '../utils/gameLogic';
import { sound } from '../utils/audio';

interface RoleSetupScreenProps {
  playerCount: number;
  roleCounts: RoleCounts;
  onUpdateRoleCounts: (counts: RoleCounts) => void;
  onStartDistribution: () => void;
  onNavigate: (screen: AppScreen) => void;
}

export const RoleSetupScreen: React.FC<RoleSetupScreenProps> = ({
  playerCount,
  roleCounts,
  onUpdateRoleCounts,
  onStartDistribution,
  onNavigate,
}) => {
  const totalRoles = calculateTotalRoles(roleCounts);
  const isMatch = totalRoles === playerCount;
  const delta = totalRoles - playerCount;
  const { mafia, civilian } = countBySide(roleCounts);

  const handleIncrement = (id: RoleId) => {
    sound.playClick();
    onUpdateRoleCounts({
      ...roleCounts,
      [id]: (roleCounts[id] || 0) + 1,
    });
  };

  const handleDecrement = (id: RoleId) => {
    if ((roleCounts[id] || 0) <= 0) return;
    sound.playClick();
    onUpdateRoleCounts({
      ...roleCounts,
      [id]: (roleCounts[id] || 0) - 1,
    });
  };

  const handleApplyRecommended = () => {
    sound.playClick();
    const recommended = getRecommendedRoleSetup(playerCount);
    onUpdateRoleCounts(recommended);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
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
          <h2 className="text-2xl font-black gold-gradient-text">إعداد وتوزيع الأدوار</h2>
        </div>

        <button
          onClick={handleApplyRecommended}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2a1147] hover:bg-[#38165f] border border-[#d4af37]/40 text-xs font-bold text-[#fcd34d] transition-all active:scale-95 shadow-md"
          title="توزيع تلقائي متوازن للأدوار بناءً على عدد اللاعبين"
        >
          <Wand2 className="w-3.5 h-3.5 text-[#eab308]" />
          <span>توازن تلقائي</span>
        </button>
      </div>

      {/* Role Matching HUD / Status Bar */}
      <div
        className={`p-4 rounded-2xl border transition-all shadow-xl ${
          isMatch
            ? 'bg-emerald-950/40 border-emerald-500/50 shadow-emerald-950/20'
            : 'bg-[#21092e] border-amber-500/40 shadow-purple-950/40'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {isMatch ? (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
                <AlertTriangle className="w-6 h-6" />
              </div>
            )}
            <div>
              <div className="text-xs text-[#c4b5d4] font-medium">حالة تطابق الأدوار</div>
              <div className="text-sm font-bold text-white">
                {isMatch
                  ? 'مجموع الأدوار يطابق تماماً عدد اللاعبين!'
                  : delta > 0
                  ? `الأدوار زائدة بمقدار ${delta} (خفّض ${delta} دور)`
                  : `الأدوار ناقصة بمقدار ${Math.abs(delta)} (أضف ${Math.abs(delta)} دور)`}
              </div>
            </div>
          </div>

          <div className="text-left shrink-0">
            <div className="text-2xl font-black font-mono">
              <span className={isMatch ? 'text-emerald-400' : 'text-amber-400'}>{totalRoles}</span>
              <span className="text-slate-400 text-lg"> / {playerCount}</span>
            </div>
            <div className="text-[10px] text-slate-400">دور / لاعب</div>
          </div>
        </div>

        {/* Team Balance Summary Bar */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-red-400">
            <Skull className="w-4 h-4" />
            <span>عصابة المافيا: </span>
            <span className="font-bold font-mono text-sm">{mafia}</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-1.5 text-sky-400">
            <Shield className="w-4 h-4" />
            <span>حلف المدينة: </span>
            <span className="font-bold font-mono text-sm">{civilian}</span>
          </div>
        </div>
      </div>

      {/* Role Cards Stepper List */}
      <div className="space-y-3">
        {ROLE_LIST.map((role) => {
          const count = roleCounts[role.id] || 0;
          const isMafia = role.side === 'MAFIA';

          return (
            <div
              key={role.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                count > 0
                  ? isMafia
                    ? 'bg-[#1e0717]/90 border-red-500/40 shadow-lg'
                    : 'bg-[#0f172a]/90 border-sky-500/30 shadow-lg'
                  : 'bg-[#140624]/70 border-white/5 opacity-70'
              }`}
            >
              {/* Role Info & Thumbnail */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className="w-12 h-14 rounded-xl overflow-hidden shrink-0 border relative"
                  style={{ borderColor: count > 0 ? role.accentColor : 'rgba(255,255,255,0.1)' }}
                >
                  <img
                    src={role.image}
                    alt={role.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-0.5">
                    <span className="text-xs">{role.emoji}</span>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white truncate">{role.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isMafia
                          ? 'bg-red-950/80 text-red-300 border border-red-500/30'
                          : 'bg-sky-950/80 text-sky-300 border border-sky-500/30'
                      }`}
                    >
                      {role.side === 'MAFIA' ? 'مافيا' : 'مدينة'}
                    </span>
                  </div>
                  <p className="text-xs text-[#bca3cf] line-clamp-1 mt-0.5 leading-snug">
                    {role.shortDesc}
                  </p>
                </div>
              </div>

              {/* Stepper Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleDecrement(role.id)}
                  disabled={count <= 0}
                  className="w-8 h-8 rounded-xl bg-[#260f3d] hover:bg-[#351554] text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 active:scale-95 transition-all"
                  aria-label={`تقليل ${role.name}`}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <div className="w-7 text-center font-bold text-base font-mono text-white">
                  {count}
                </div>

                <button
                  type="button"
                  onClick={() => handleIncrement(role.id)}
                  className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b45309] text-[#120422] flex items-center justify-center border border-[#fef08a]/50 active:scale-95 transition-all shadow-sm"
                  aria-label={`زيادة ${role.name}`}
                >
                  <Plus className="w-4 h-4 font-black" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Start Distribution CTA */}
      <div className="pt-2">
        <button
          onClick={() => {
            sound.playClick();
            onStartDistribution();
          }}
          disabled={!isMatch}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#b45309] text-[#120422] font-black text-lg shadow-xl shadow-[#d4af37]/20 disabled:opacity-35 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-[#fef08a]/60"
        >
          <Shuffle className="w-5 h-5" />
          <span>وزّع الأدوار عشوائيًا وابدأ الكشف السري</span>
        </button>

        {!isMatch && (
          <p className="text-center text-xs text-amber-400/90 mt-2 flex items-center justify-center gap-1">
            <Info className="w-3.5 h-3.5" />
            <span>يجب أن يتطابق مجموع الأدوار ({totalRoles}) مع عدد اللاعبين ({playerCount}) للبدء.</span>
          </p>
        )}
      </div>
    </div>
  );
};
