/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EyeOff, ShieldAlert, ArrowLeft, Smartphone } from 'lucide-react';
import { sound } from '../utils/audio';

interface SecretPassScreenProps {
  nextPlayerName: string;
  playerIndex: number;
  totalPlayers: number;
  onReadyToReveal: () => void;
}

export const SecretPassScreen: React.FC<SecretPassScreenProps> = ({
  nextPlayerName,
  playerIndex,
  totalPlayers,
  onReadyToReveal,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 max-w-md mx-auto text-center space-y-6">
      {/* Privacy Icon Shield */}
      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 via-amber-500/20 to-red-600/30 rounded-full blur-xl animate-pulse" />
        <div className="relative w-28 h-28 rounded-full bg-[#1b0930] border-2 border-[#d4af37]/60 flex items-center justify-center shadow-2xl shadow-purple-950">
          <Smartphone className="w-12 h-12 text-[#d4af37] animate-bounce" />
        </div>
      </div>

      {/* Handover Instruction */}
      <div className="space-y-3 w-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2a1147] border border-[#d4af37]/30 text-xs font-bold text-[#fcd34d]">
          <span>اللاعب {playerIndex + 1} من {totalPlayers}</span>
        </div>

        <h2 className="text-xl font-bold text-[#c4b5d4]">
          مرّر الهاتف إلى اللاعب:
        </h2>

        {/* Player Name Display */}
        <div className="py-4 px-6 rounded-2xl bg-gradient-to-br from-[#2a1145] to-[#150624] border-2 border-[#d4af37] shadow-xl shadow-amber-950/20">
          <span className="text-3xl sm:text-4xl font-black gold-gradient-text tracking-wide">
            {nextPlayerName}
          </span>
        </div>
      </div>

      {/* Privacy Warning Box */}
      <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200/90 flex items-start gap-3 text-right max-w-sm">
        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-red-300">تنبيه خصوصية وسرّية تامّة!</div>
          <div>
            لا تضغط على الزر أدناه إلا عندما يكون الهاتف في يدك وحدك وبعيداً عن أنظار باقي اللاعبين.
          </div>
        </div>
      </div>

      {/* I Am Ready Button */}
      <div className="w-full pt-4">
        <button
          onClick={() => {
            sound.playCardFlip();
            onReadyToReveal();
          }}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#b45309] text-[#120422] font-black text-lg shadow-xl shadow-[#d4af37]/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-[#fef08a]/60"
        >
          <EyeOff className="w-5 h-5" />
          <span>أنا {nextPlayerName}، جاهز لكشف دوري</span>
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
