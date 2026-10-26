/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { History, ArrowRight, Trash2, RotateCcw, Trophy, Users, Shield, Skull, Calendar } from 'lucide-react';
import { GameRoundHistory, AppScreen } from '../types/mafia';
import { sound } from '../utils/audio';

interface HistoryScreenProps {
  history: GameRoundHistory[];
  onLoadPlayersFromHistory: (players: string[]) => void;
  onClearHistory: () => void;
  onNavigate: (screen: AppScreen) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  onLoadPlayersFromHistory,
  onClearHistory,
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
              onNavigate('HOME');
            }}
            className="text-xs text-[#bca3cf] hover:text-white flex items-center gap-1 mb-1 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة للرئيسية</span>
          </button>
          <h2 className="text-2xl font-black gold-gradient-text">سجل الجولات السابقة</h2>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('هل أنت متأكد من مسح جميع سجلات الجولات السابقة؟')) {
                sound.playClick();
                onClearHistory();
              }
            }}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>مسح السجل</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-16 text-center text-slate-400 space-y-3 bg-[#150726]/60 rounded-2xl border border-white/5">
          <History className="w-10 h-10 mx-auto text-slate-500" />
          <p className="text-base font-bold text-white">لا توجد جولات سابقة مسجلة حتى الآن</p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            عند إنهاء أي جولة سيتم حفظ تفاصيلها وتاريخها وقائمة لاعبيها تلقائياً هنا في ذاكرة جهازك.
          </p>
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('PLAYERS');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#2a1045] hover:bg-[#38165b] border border-[#d4af37]/40 text-xs font-bold text-[#fcd34d] transition-all"
          >
            بدء جولة جديدة الآن
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((record) => {
            return (
              <div
                key={record.id}
                className="bg-[#17082a] border border-[#d4af37]/25 rounded-2xl p-4 shadow-xl space-y-3 hover:border-[#d4af37]/50 transition-all text-right"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#c4b5d4]">
                    <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{record.dateFormatted}</span>
                  </div>

                  {record.winner && record.winner !== 'UNDECIDED' && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        record.winner === 'CIVILIAN'
                          ? 'bg-sky-950/80 text-sky-300 border border-sky-500/40'
                          : 'bg-red-950/80 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {record.winner === 'CIVILIAN' ? (
                        <>
                          <Shield className="w-3 h-3" />
                          <span>فوز المدينة</span>
                        </>
                      ) : (
                        <>
                          <Skull className="w-3 h-3" />
                          <span>فوز المافيا</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>اللاعبون ({record.players.length}):</span>
                  </div>
                  <div className="text-xs text-white/90 leading-relaxed bg-[#0e041b] p-2.5 rounded-xl border border-white/5">
                    {record.players.join(' ، ')}
                  </div>
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => {
                      sound.playClick();
                      onLoadPlayersFromHistory(record.players);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b45309] text-[#120422] text-xs font-black hover:brightness-110 active:scale-95 transition-all shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>بدء جولة جديدة بهؤلاء اللاعبين ({record.players.length})</span>
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
