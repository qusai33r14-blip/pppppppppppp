/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Shield, Skull, Check, Sparkles, HelpCircle } from 'lucide-react';
import { AssignedPlayer } from '../types/mafia';
import { ROLES, CREST_IMAGE } from '../data/roles';
import { sound } from '../utils/audio';

interface SecretRevealScreenProps {
  player: AssignedPlayer;
  playerIndex: number;
  totalPlayers: number;
  isLastPlayer: boolean;
  onNextPlayer: () => void;
  onFinishReveals: () => void;
}

export const SecretRevealScreen: React.FC<SecretRevealScreenProps> = ({
  player,
  playerIndex,
  totalPlayers,
  isLastPlayer,
  onNextPlayer,
  onFinishReveals,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasRevealedOnce, setHasRevealedOnce] = useState(false);

  const role = ROLES[player.roleId];
  const isMafia = role.side === 'MAFIA';

  const handleToggleReveal = () => {
    const nextState = !isRevealed;
    setIsRevealed(nextState);

    if (nextState) {
      sound.playCardFlip();
      setTimeout(() => {
        sound.playReveal(isMafia);
      }, 150);
      setHasRevealedOnce(true);
    } else {
      sound.playCardFlip();
    }
  };

  const handleAdvance = () => {
    sound.playClick();
    if (isLastPlayer) {
      onFinishReveals();
    } else {
      onNextPlayer();
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-75px)] px-4 py-4 max-w-md mx-auto">
      {/* Top Header: Player Turn Information */}
      <div className="w-full text-center space-y-1 mb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#240e3b] border border-[#d4af37]/30 text-[11px] font-bold text-[#fcd34d]">
          <Sparkles className="w-3 h-3 text-[#eab308]" />
          <span>اللاعب {playerIndex + 1} من {totalPlayers}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white">
          حان دور اللاعب: <span className="gold-gradient-text">{player.name}</span>
        </h2>
        <p className="text-[11px] text-[#bca3cf]">
          {!isRevealed
            ? 'انقر على الكرت أو الزر أدناه لكشف دورك سرًا'
            : 'اقرأ دورك بحذر، ثم اضغط على «إخفاء الكرت» قبل تمرير الهاتف'}
        </p>
      </div>

      {/* 3D Flip Card Container */}
      <div className="w-full max-w-[310px] sm:max-w-[330px] aspect-[3/4.4] my-auto perspective-1000 select-none">
        <div
          onClick={handleToggleReveal}
          className={`relative w-full h-full rounded-2xl cursor-pointer transition-transform duration-700 transform-style-3d shadow-2xl ${
            isRevealed ? 'rotate-y-180' : ''
          }`}
          style={{
            boxShadow: isRevealed
              ? `0 20px 40px ${role.glowColor}, 0 0 25px ${role.glowColor}`
              : '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.2)',
          }}
        >
          {/* ================= CARD BACK (CLOSED STATE) ================= */}
          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden backface-hidden bg-gradient-to-br from-[#1b082e] via-[#0f041b] to-[#250a3d] border-2 border-[#d4af37] p-3 flex flex-col justify-between items-center">
            {/* Corner Ornaments */}
            <div className="w-full flex justify-between items-center text-[#d4af37]/70 text-xs font-serif">
              <span>✦</span>
              <span className="text-[10px] tracking-widest text-[#d4af37]">MAFIA SECRET</span>
              <span>✦</span>
            </div>

            {/* Central Ornate Crest Emblem */}
            <div className="flex flex-col items-center justify-center my-auto space-y-3">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-[#d4af37]/60 shadow-xl shadow-black/80 bg-[#140624]">
                <img
                  src={CREST_IMAGE}
                  alt="بطاقة مغلقة"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="text-center space-y-1">
                <div className="text-sm font-bold text-white tracking-wide">
                  اضغط للكشف سرًا
                </div>
                <div className="text-[10px] text-[#c4b5d4] flex items-center justify-center gap-1">
                  <Eye className="w-3 h-3 text-[#d4af37]" />
                  <span>لا تدع أحداً ينظر إلى الشاشة</span>
                </div>
              </div>
            </div>

            {/* Bottom Emblem */}
            <div className="w-full flex justify-between items-center text-[#d4af37]/70 text-xs font-serif">
              <span>✦</span>
              <span className="text-[9px] text-[#c4b5d4]">إصدار الهاتف الواحد</span>
              <span>✦</span>
            </div>
          </div>

          {/* ================= CARD FRONT (REVEALED STATE) ================= */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden backface-hidden rotate-y-180 bg-[#0d0417] border-2 p-3 flex flex-col justify-between"
            style={{ borderColor: role.accentColor }}
          >
            {/* Header: Role Name & Side Badge */}
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: `${role.accentColor}40` }}>
              <div className="flex items-center gap-1.5">
                <span className="text-xl">{role.emoji}</span>
                <span className="text-base font-black text-white">{role.name}</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  isMafia
                    ? 'bg-red-950 text-red-300 border border-red-500/50'
                    : 'bg-sky-950 text-sky-300 border border-sky-500/50'
                }`}
              >
                {isMafia ? <Skull className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                <span>{role.sideName}</span>
              </span>
            </div>

            {/* Role Character Artwork Portrait */}
            <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden my-1.5 border border-white/10 shadow-inner bg-black">
              <img
                src={role.image}
                alt={role.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-2">
                <div className="text-[11px] text-amber-200 font-medium">
                  {role.englishTitle}
                </div>
              </div>
            </div>

            {/* Mission & Action Instructions */}
            <div className="space-y-1.5 text-right">
              <div className="text-[11px] font-bold text-white leading-relaxed">
                {role.shortDesc}
              </div>
              <div className="p-2 rounded-lg bg-black/50 border border-white/5 text-[10px] text-[#d1c4e9] leading-snug">
                <span className="font-bold text-[#d4af37]">في الليل: </span>
                {role.nightActionDesc}
              </div>
              <div className="text-[9.5px] text-[#a78bfa] italic leading-tight">
                💡 نصيحة: {role.proTip}
              </div>
            </div>

            {/* Card Footer Warning */}
            <div className="text-center pt-1 border-t border-white/10">
              <span className="text-[9px] text-red-300 font-semibold">
                🔒 احفظ دورك ثم اضغط «إخفاء الكرت» فوراً!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Actions Bottom Bar */}
      <div className="w-full space-y-2.5 pt-2">
        {!isRevealed ? (
          /* When Closed: Reveal Button */
          <button
            onClick={handleToggleReveal}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#b45309] text-[#120422] font-black text-base shadow-xl shadow-[#d4af37]/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-[#fef08a]/60"
          >
            <Eye className="w-5 h-5" />
            <span>اكشف دورك سرًا (اضغط هنا)</span>
          </button>
        ) : (
          /* When Revealed: Hide Button */
          <button
            onClick={handleToggleReveal}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-700 text-white font-black text-base shadow-xl shadow-red-900/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-red-300/40"
          >
            <EyeOff className="w-5 h-5" />
            <span>إخفاء الكرت وقفل الشاشة 🔒</span>
          </button>
        )}

        {/* Next Player Button (Only enabled after player has viewed and closed the card) */}
        {!isRevealed && hasRevealedOnce && (
          <button
            onClick={handleAdvance}
            className="w-full py-3.5 px-6 rounded-xl bg-[#2b1045] hover:bg-[#39155c] border-2 border-[#d4af37] text-[#fcd34d] font-bold text-base shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] animate-pulse"
          >
            <span>{isLastPlayer ? 'إنهاء التوزيع وبدء الجولة ⚔️' : 'اللاعب التالي (تسليم الهاتف) ➔'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
