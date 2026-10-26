/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, BookOpen, Shield, Skull, Sun, Moon, Info, HelpCircle } from 'lucide-react';
import { ROLE_LIST } from '../data/roles';
import { sound } from '../utils/audio';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'HOW_TO_PLAY' | 'ROLES' | 'NARRATOR'>('HOW_TO_PLAY');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#170729] border-2 border-[#d4af37]/60 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#d4af37]/20 flex items-center justify-between bg-[#120422]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#9333ea] text-[#120422]">
              <BookOpen className="w-5 h-5 font-black" />
            </div>
            <div>
              <h3 className="text-lg font-black gold-gradient-text">دليل وقواعد لعبة المافيا</h3>
              <p className="text-[11px] text-[#c4b5d4]">إصدار الهاتف الواحد للجمعات العائلية والأصدقاء</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-[#0f041a] p-1.5 border-b border-white/5 text-xs font-bold">
          <button
            onClick={() => {
              sound.playClick();
              setTab('HOW_TO_PLAY');
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              tab === 'HOW_TO_PLAY'
                ? 'bg-[#2b1045] text-[#fcd34d] border border-[#d4af37]/30 shadow-sm'
                : 'text-[#c4b5d4] hover:text-white'
            }`}
          >
            طريقة اللعب والأهداف
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setTab('ROLES');
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              tab === 'ROLES'
                ? 'bg-[#2b1045] text-[#fcd34d] border border-[#d4af37]/30 shadow-sm'
                : 'text-[#c4b5d4] hover:text-white'
            }`}
          >
            شرح الشخصيات الست
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setTab('NARRATOR');
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              tab === 'NARRATOR'
                ? 'bg-[#2b1045] text-[#fcd34d] border border-[#d4af37]/30 shadow-sm'
                : 'text-[#c4b5d4] hover:text-white'
            }`}
          >
            إرشادات المشرف (الراوي)
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-right text-xs leading-relaxed text-[#dcd0ea]">
          {tab === 'HOW_TO_PLAY' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#230d3a]/70 border border-[#d4af37]/30 space-y-2">
                <div className="flex items-center gap-2 font-black text-white text-sm">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>الهدف من اللعبة</span>
                </div>
                <p>
                  المافيا هي لعبة ذكاء اجتماعي وتضليل واستنتاج، تنقسم فيها المجموعة سراً إلى فريقين:
                  <br />
                  <strong className="text-red-400">1. عصابة المافيا:</strong> يحاولون القضاء على سكان المدينة ليلاً دون أن يُكتشفوا نهاراً.
                  <br />
                  <strong className="text-sky-300">2. حلف أهل المدينة:</strong> يسعون لكشف عناصر المافيا وإعدامهم بالتصويت القضائي في النهار.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>دورة الليل (الهدوء والعمليات السرية)</span>
                </div>
                <p className="bg-[#12041e] p-3 rounded-xl border border-white/5">
                  ينام الجميع ويغمضون أعينهم. ينادي المشرف على الأدوار الخاصة بالترتيب:
                  المافيا تختار ضحيتها، الطبيب يختار من يحمي، المحقق يسأل عن لاعب، ومافيا التسكيت تختار من تخرس صوته.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <Sun className="w-4 h-4 text-yellow-400" />
                  <span>دورة النهار (النقاش والمحاكمة)</span>
                </div>
                <p className="bg-[#12041e] p-3 rounded-xl border border-white/5">
                  يستيقظ الجميع. يعلن المشرف من قُتل في الليل (إلا إذا نجح الطبيب في إنقاذه).
                  يبدأ مؤقت النقاش، يتناقش اللاعبون ويحللون الشبهات، ثم يُفتح باب الترشيح والتصويت لإعدام المشتبه به الأكثر تصويتاً.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <div className="font-bold text-[#d4af37]">شروط الفوز:</div>
                <div>• <strong className="text-emerald-400">تفوز المدينة:</strong> عند القضاء على جميع أعضاء المافيا بالكامل.</div>
                <div>• <strong className="text-red-400">تفوز المافيا:</strong> عندما يتساوى عدد أفراد المافيا مع عدد المواطنين الأحياء.</div>
              </div>
            </div>
          )}

          {tab === 'ROLES' && (
            <div className="space-y-3">
              {ROLE_LIST.map((role) => (
                <div
                  key={role.id}
                  className="p-3.5 rounded-2xl bg-[#140624] border border-white/10 flex items-start gap-3"
                  style={{ borderColor: `${role.accentColor}40` }}
                >
                  <div
                    className="w-12 h-16 rounded-xl overflow-hidden shrink-0 border relative"
                    style={{ borderColor: role.accentColor }}
                  >
                    <img
                      src={role.image}
                      alt={role.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{role.emoji}</span>
                        <span className="font-black text-white text-sm">{role.name}</span>
                      </div>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ color: role.accentColor, backgroundColor: `${role.accentColor}20` }}
                      >
                        {role.sideName}
                      </span>
                    </div>
                    <p className="text-xs text-white/90">{role.fullDesc}</p>
                    <p className="text-[10px] text-[#d4af37]">
                      <strong>في الليل: </strong> {role.nightActionDesc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'NARRATOR' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#230d3a]/70 border border-[#d4af37]/30 space-y-2">
                <div className="font-bold text-white text-sm">نصائح للمشرف والراوي:</div>
                <p>
                  1. كن محايداً تماماً، ولا تنظر في اتجاه لاعب معين أثناء مناداة الأدوار ليلاً.
                  <br />
                  2. عند مناداة كل دور (طبيب، محقق، تسكيت...)، حافظ على مدة زمنية متساوية حتى لو كان الدور غير موجود في اللعبة، حتى لا يستنتج اللاعبون من الصوت وجوده أو غيابه.
                  <br />
                  3. استخدم إشارات اليد الصامتة (الإشارة بالسبابة، الإبهام لأعلى ولأسفل) وتجنب الكلام بالأسماء ليلاً.
                  <br />
                  4. استخدم مؤقت النقاش المدمج في التطبيق لضبط وقت الكلام حتى لا تطول الجولة بشكل مبالغ فيه.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Close Button */}
        <div className="p-3 border-t border-white/10 bg-[#120422] flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b45309] text-[#120422] font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-md"
          >
            إغلاق الدليل
          </button>
        </div>
      </div>
    </div>
  );
};
