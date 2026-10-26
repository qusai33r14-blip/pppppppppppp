/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Clock, Play, Pause, RotateCcw, AlertTriangle, Eye, Volume2, ShieldCheck, Skull, MessageSquareOff, ChevronDown, ChevronUp } from 'lucide-react';
import { AssignedPlayer, AppScreen } from '../types/mafia';
import { sound } from '../utils/audio';

interface GameRunningScreenProps {
  players: AssignedPlayer[];
  onTogglePlayerAlive: (playerId: string) => void;
  onTogglePlayerSilenced: (playerId: string) => void;
  onEndRoundAndShowSummary: () => void;
  onNavigate: (screen: AppScreen) => void;
}

export const GameRunningScreen: React.FC<GameRunningScreenProps> = ({
  players,
  onTogglePlayerAlive,
  onTogglePlayerSilenced,
  onEndRoundAndShowSummary,
}) => {
  const [activeTab, setActiveTab] = useState<'NARRATOR' | 'PLAYERS_TRACKER'>('NARRATOR');
  const [nightStep, setNightStep] = useState<number>(0);
  const [confirmEndModal, setConfirmEndModal] = useState<boolean>(false);

  // Discussion Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(120);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            sound.playGong();
            return 0;
          }
          if (prev <= 5) {
            sound.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const handleStartTimer = (sec?: number) => {
    sound.playClick();
    if (sec !== undefined) {
      setTimerSeconds(sec);
    }
    setIsTimerRunning(true);
  };

  const handlePauseTimer = () => {
    sound.playClick();
    setIsTimerRunning(false);
  };

  const handleResetTimer = (sec: number = 120) => {
    sound.playClick();
    setIsTimerRunning(false);
    setTimerSeconds(sec);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const narratorSteps = [
    {
      title: '1. نوم المدينة الكامل',
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
      callout: '«تنام المدينة بالكامل ويغمض الجميع أعينهم بإحكام.. ولا صوت يعلو في الظلام!»',
      details: 'تأكد من إغلاق جميع اللاعبين لأعينهم وعدم فتحها أو استراق النظر.',
    },
    {
      title: '2. استيقاظ عصابة المافيا',
      icon: <Skull className="w-5 h-5 text-red-500" />,
      callout: '«تستيقظ المافيا الآن وتفتح أعينها بصمت.. وتتفق بالإشارة الصامتة على الضحية المراد تصفيتها!»',
      details: 'يفتح أعضاء المافيا أعينهم ويتفقون على شخص واحد. يشير زعيم الاغتيال للضحية، ثم يشير المشرف للموافقة. بعدها: «تنام المافيا!»',
    },
    {
      title: '3. استيقاظ الطبيب',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      callout: '«تنام المافيا.. ويستيقظ الطبيب! أشر للشخص الذي تريد إسعافه وحمايته هذه الليلة.»',
      details: 'يفتح الطبيب عينيه ويشير للاعب لحمايته. إذا استهدفته المافيا في نفس الليلة ينجو! ثم: «ينام الطبيب!»',
    },
    {
      title: '4. استيقاظ المحقق',
      icon: <Eye className="w-5 h-5 text-amber-400" />,
      callout: '«ينام الطبيب.. ويستيقظ المحقق! أشر للاعب الذي تريد معرفة حقيقته.»',
      details: 'يفتح المحقق عينيه ويشير لمشتبه به. يجيبه المشرف بالإشارة الصامتة المتفق عليها (👍 نعم مافيا / 👎 مواطن بريء). ثم: «ينام المحقق!»',
    },
    {
      title: '5. استيقاظ مافيا التسكيت (إن وُجد)',
      icon: <MessageSquareOff className="w-5 h-5 text-purple-400" />,
      callout: '«تستيقظ مافيا التسكيت! أشر إلى اللاعب الذي تريد كتم صوته بالكامل طوال النهار التالي.»',
      details: 'يشير صاحب هذا الدور لشخص واحد. ذلك الشخص لا يحق له الكلام غداً، بل الإيماء والتصويت فقط. ثم: «تنام مافيا التسكيت!»',
    },
    {
      title: '6. شروق الشمس والنهار',
      icon: <Sun className="w-5 h-5 text-yellow-400" />,
      callout: '«تصحو المدينة وتشرق شمس الصباح! يستيقظ الجميع ويفتحون أعينهم!»',
      details: 'يعلن المشرف: هل سقط ضحية الليلة أم أن الطبيب أنقذه؟ ومن هو اللاعب الممنوع من الكلام بسبب التسكيت؟ ثم تبدأ جلسة النقاش والمحاكمة!',
    },
  ];

  const aliveCount = players.filter((p) => p.isAlive).length;
  const deadCount = players.filter((p) => !p.isAlive).length;

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#d4af37]/25 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-2xl font-black gold-gradient-text">الجولة قيد اللعب</h2>
          </div>
          <p className="text-xs text-[#bca3cf]">
            تم كشف الأدوار سرًا · جميع الأدوار مخفية لضمان الخصوصية
          </p>
        </div>

        {/* End Round Button */}
        <button
          onClick={() => {
            sound.playClick();
            setConfirmEndModal(true);
          }}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
        >
          إنهاء الجولة وكشف الأدوار
        </button>
      </div>

      {/* Discussion & Trial Timer Card */}
      <div className="bg-[#18082c] border border-[#d4af37]/30 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs text-[#d1c4e9]">
          <div className="flex items-center gap-1.5 font-bold">
            <Clock className="w-4 h-4 text-[#d4af37]" />
            <span>مؤقت النقاش والتصويت الصباحي:</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handleResetTimer(60)}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[11px]"
            >
              1 د
            </button>
            <button
              onClick={() => handleResetTimer(120)}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[11px]"
            >
              2 د
            </button>
            <button
              onClick={() => handleResetTimer(180)}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[11px]"
            >
              3 د
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-4xl font-black font-mono tracking-wider text-white">
            {formatTimer(timerSeconds)}
          </div>

          <div className="flex items-center gap-2">
            {isTimerRunning ? (
              <button
                onClick={handlePauseTimer}
                className="p-3 rounded-xl bg-amber-500 text-black font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-md"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span className="text-xs">إيقاف</span>
              </button>
            ) : (
              <button
                onClick={() => handleStartTimer()}
                className="p-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b45309] text-[#120422] font-black flex items-center gap-1.5 active:scale-95 transition-all shadow-md"
              >
                <Play className="w-4 h-4 fill-current" />
                <span className="text-xs">تشغيل</span>
              </button>
            )}

            <button
              onClick={() => handleResetTimer(120)}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 active:scale-95 transition-all"
              title="إعادة ضبط"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mode Tabs: Narrator Guide vs Alive Tracker */}
      <div className="flex rounded-xl bg-[#140624] p-1 border border-white/10">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('NARRATOR');
          }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'NARRATOR'
              ? 'bg-[#2b1045] text-[#fcd34d] border border-[#d4af37]/30 shadow-sm'
              : 'text-[#c4b5d4] hover:text-white'
          }`}
        >
          دليل الراوي الليلي (سير الأحداث)
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('PLAYERS_TRACKER');
          }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'PLAYERS_TRACKER'
              ? 'bg-[#2b1045] text-[#fcd34d] border border-[#d4af37]/30 shadow-sm'
              : 'text-[#c4b5d4] hover:text-white'
          }`}
        >
          <span>تتبع الأحياء والمستبعدين</span>
          <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded font-mono text-[#d4af37]">
            {aliveCount}/{players.length}
          </span>
        </button>
      </div>

      {/* TAB 1: Narrator Script & Step-by-Step */}
      {activeTab === 'NARRATOR' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#c4b5d4] px-1">
            <span>اقرأ هذه العبارات بصوت عالٍ لإدارة الليل بسلاسة:</span>
            <button
              onClick={() => sound.playGong()}
              className="text-[#d4af37] hover:underline flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>قرع جرس الليل</span>
            </button>
          </div>

          <div className="space-y-2">
            {narratorSteps.map((step, idx) => {
              const isCurrent = nightStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    sound.playClick();
                    setNightStep(idx);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-gradient-to-br from-[#260e3d] to-[#160624] border-[#d4af37] shadow-xl'
                      : 'bg-[#150624]/70 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                        {step.icon}
                      </div>
                      <span className="text-sm font-bold text-white">{step.title}</span>
                    </div>
                    {isCurrent ? (
                      <ChevronUp className="w-4 h-4 text-[#d4af37]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </div>

                  {isCurrent && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2 animate-fade-in text-right">
                      <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/20 text-xs text-amber-200 font-bold leading-relaxed">
                        {step.callout}
                      </div>
                      <p className="text-[11px] text-[#c4b5d4] leading-relaxed">
                        {step.details}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Alive vs Dead Interactive Roster (WITHOUT ROLE SPOILERS) */}
      {activeTab === 'PLAYERS_TRACKER' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-[#c4b5d4] flex items-center justify-between">
            <div>
              الأحياء حالياً: <span className="font-bold text-emerald-400 font-mono">{aliveCount}</span>
            </div>
            <div>
              المستبعدون: <span className="font-bold text-red-400 font-mono">{deadCount}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {players.map((p) => {
              return (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                    p.isAlive
                      ? 'bg-[#1c0a30] border-white/10'
                      : 'bg-[#12041c] border-red-950/40 opacity-55 line-through'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      onClick={() => {
                        sound.playClick();
                        onTogglePlayerAlive(p.id);
                      }}
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        p.isAlive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                      title="تبديل حالة الحياة / الاستبعاد"
                    >
                      {p.isAlive ? '✓' : '✗'}
                    </button>
                    <span className="text-sm font-bold text-white truncate">{p.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Silenced toggle */}
                    <button
                      onClick={() => {
                        sound.playClick();
                        onTogglePlayerSilenced(p.id);
                      }}
                      className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
                        p.isSilenced
                          ? 'bg-purple-900/80 text-purple-200 border border-purple-500/50 shadow-sm'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                      title="تبديل علامة التسكيت لهذا اليوم"
                    >
                      <MessageSquareOff className="w-3 h-3" />
                      <span>{p.isSilenced ? 'مسكوت 🤐' : 'تسكيت'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-center text-slate-400">
            🔒 لا تظهر الأدوار هنا حفاظاً على سرّية اللعبة أثناء تمرير الهاتف أو مشاركته مع المشرف.
          </p>
        </div>
      )}

      {/* Confirmation Modal to End Round and Show Truth Table */}
      {confirmEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#1b082e] border-2 border-[#d4af37]/60 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-500/50 text-red-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">هل انتهت اللعبة بالفعل؟</h3>
              <p className="text-xs text-[#c4b5d4] leading-relaxed">
                الضغط على متابعة سينهي الجولة ويكشف جدول جميع الأدوار وهوية كل لاعب بالكامل للجميع!
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmEndModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors"
              >
                تراجع وإكمال اللعب
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setConfirmEndModal(false);
                  onEndRoundAndShowSummary();
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                نعم، اكشف الأدوار
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
