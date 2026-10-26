/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserPlus, Trash2, Edit2, Check, X, RotateCcw, BookmarkPlus, ArrowLeft, Users, AlertCircle, Sparkles } from 'lucide-react';
import { Player, AppScreen } from '../types/mafia';
import { sound } from '../utils/audio';

interface PlayerManagerScreenProps {
  players: Player[];
  onUpdatePlayers: (players: Player[]) => void;
  onRestoreLastRound: () => boolean;
  hasLastRoundPlayers: boolean;
  onSaveAsPreset: (presetName: string) => void;
  onNavigate: (screen: AppScreen) => void;
}

export const PlayerManagerScreen: React.FC<PlayerManagerScreenProps> = ({
  players,
  onUpdatePlayers,
  onRestoreLastRound,
  hasLastRoundPlayers,
  onSaveAsPreset,
  onNavigate,
}) => {
  const [newName, setNewName] = useState('');
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [presetModalOpen, setPresetModalOpen] = useState(false);
  const [presetNameInput, setPresetNameInput] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleAddSingle = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;

    if (players.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
      showNotification('هذا الاسم موجود بالفعل في القائمة!');
      sound.playClick();
      return;
    }

    const newPlayer: Player = {
      id: 'p_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: trimmed,
    };

    const updated = [...players, newPlayer];
    onUpdatePlayers(updated);
    setNewName('');
    sound.playClick();
  };

  const handleAddBulk = () => {
    const lines = bulkText
      .split(/[\n,،]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (lines.length === 0) return;

    const existingNames = new Set(players.map((p) => p.name.toLowerCase()));
    const newItems: Player[] = [];

    lines.forEach((name) => {
      if (!existingNames.has(name.toLowerCase())) {
        existingNames.add(name.toLowerCase());
        newItems.push({
          id: 'p_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          name,
        });
      }
    });

    if (newItems.length > 0) {
      onUpdatePlayers([...players, ...newItems]);
      showNotification(`تمت إضافة ${newItems.length} لاعبين بنجاح!`);
      setBulkText('');
      setBulkMode(false);
      sound.playClick();
    } else {
      showNotification('جميع الأسماء المكتوبة موجودة مسبقاً!');
    }
  };

  const handleDelete = (id: string) => {
    sound.playClick();
    const updated = players.filter((p) => p.id !== id);
    onUpdatePlayers(updated);
  };

  const handleStartEdit = (player: Player) => {
    sound.playClick();
    setEditingId(player.id);
    setEditingName(player.name);
  };

  const handleSaveEdit = () => {
    const trimmed = editingName.trim();
    if (!trimmed || !editingId) return;

    const updated = players.map((p) => (p.id === editingId ? { ...p, name: trimmed } : p));
    onUpdatePlayers(updated);
    setEditingId(null);
    setEditingName('');
    sound.playClick();
  };

  const handleClearAll = () => {
    if (window.confirm('هل أنت متأكد من مسح جميع الأسماء؟')) {
      sound.playClick();
      onUpdatePlayers([]);
      showNotification('تم إفراغ قائمة اللاعبين');
    }
  };

  const handleRestoreClick = () => {
    sound.playClick();
    const ok = onRestoreLastRound();
    if (ok) {
      showNotification('تم استرجاع أسماء الجولة السابقة بنجاح!');
    } else {
      showNotification('لا توجد أسماء سابقة مسجلة');
    }
  };

  const handleSavePresetClick = () => {
    const trimmed = presetNameInput.trim();
    if (!trimmed) return;
    onSaveAsPreset(trimmed);
    setPresetNameInput('');
    setPresetModalOpen(false);
    showNotification(`تم حفظ قائمة "${trimmed}" في القوائم المحفوظة!`);
    sound.playClick();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      {/* Title & Count */}
      <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-4">
        <div>
          <h2 className="text-2xl font-black gold-gradient-text">إدارة قائمة اللاعبين</h2>
          <p className="text-xs text-[#bca3cf]">أضف أسماء اللاعبين المشاركين في الجولة</p>
        </div>
        <div className="flex items-center gap-2 bg-[#25103a] px-3.5 py-1.5 rounded-xl border border-[#d4af37]/40">
          <Users className="w-4 h-4 text-[#d4af37]" />
          <span className="text-sm font-bold text-white font-mono">{players.length}</span>
          <span className="text-xs text-[#d1c4e9]">لاعبين</span>
        </div>
      </div>

      {/* Notifications Toast */}
      {feedbackMsg && (
        <div className="p-3 rounded-lg bg-purple-900/80 border border-purple-500/50 text-xs text-purple-200 text-center animate-fade-in shadow-md">
          {feedbackMsg}
        </div>
      )}

      {/* Quick Action Bar (Restore & Presets) */}
      <div className="flex flex-wrap gap-2 text-xs">
        {hasLastRoundPlayers && (
          <button
            onClick={handleRestoreClick}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#220d38] hover:bg-[#2f134d] border border-[#d4af37]/30 text-[#e9d5ff] transition-all active:scale-95"
            title="استرجاع أسماء آخر جولة تم لعبها"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>استرجاع أسماء الجولة السابقة</span>
          </button>
        )}

        <button
          onClick={() => {
            sound.playClick();
            onNavigate('PRESETS');
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#180929] hover:bg-[#240e3c] border border-white/10 text-[#c4b5d4] transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>القوائم الجاهزة</span>
        </button>

        {players.length >= 4 && (
          <button
            onClick={() => {
              sound.playClick();
              setPresetModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#180929] hover:bg-[#240e3c] border border-white/10 text-[#c4b5d4] transition-all active:scale-95 mr-auto"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>حفظ القائمة الحالية</span>
          </button>
        )}
      </div>

      {/* Input Mode Tabs: Single or Bulk */}
      <div className="bg-[#17082a] p-4 rounded-2xl border border-[#d4af37]/25 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[#e2d5f0]">إضافة لاعب جديد:</span>
          <button
            type="button"
            onClick={() => setBulkMode(!bulkMode)}
            className="text-[#d4af37] hover:underline"
          >
            {bulkMode ? 'إضافة فردية' : 'إضافة جماعية (نسخ ولصق)'}
          </button>
        </div>

        {!bulkMode ? (
          <form onSubmit={handleAddSingle} className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="اكتب اسم اللاعب (مثلاً: أحمد، سارة، فهد)..."
              maxLength={25}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#0e041b] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] text-sm"
            />
            <button
              type="submit"
              disabled={!newName.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b45309] text-[#120422] font-black text-sm flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>إضافة</span>
            </button>
          </form>
        ) : (
          <div className="space-y-2">
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder="الصق أو اكتب الأسماء مفصولة بفاصلة أو سطر جديد:&#10;محمد&#10;عبدالله&#10;سلطان&#10;خالد"
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e041b] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] text-sm"
            />
            <button
              type="button"
              onClick={handleAddBulk}
              disabled={!bulkText.trim()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b45309] text-[#120422] font-black text-sm disabled:opacity-40 hover:brightness-110 active:scale-95 transition-all shadow-md"
            >
              إضافة جميع الأسماء المكتوبة
            </button>
          </div>
        )}
      </div>

      {/* Players List Card */}
      <div className="bg-[#140624]/90 rounded-2xl border border-white/10 p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-[#bca3cf] pb-2 border-b border-white/5">
          <span>اللاعبون المسجلون ({players.length})</span>
          {players.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              مسح الكل
            </button>
          )}
        </div>

        {players.length === 0 ? (
          <div className="py-8 text-center text-slate-400 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-500" />
            <p className="text-sm">لم تتم إضافة أي لاعبين بعد.</p>
            <p className="text-xs text-slate-500">أضف 4 لاعبين على الأقل لبدء لعبة المافيا.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
            {players.map((player, index) => {
              const isEditing = editingId === player.id;
              return (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-[#1f0b35]/70 hover:bg-[#270e42] p-2.5 rounded-xl border border-white/5 transition-all"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-[#2d124d] text-[#d4af37] text-xs font-bold font-mono flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full px-2 py-1 rounded bg-[#0d0517] border border-[#d4af37] text-white text-xs"
                        autoFocus
                      />
                    ) : (
                      <span className="text-sm font-bold text-white truncate">{player.name}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 mr-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="p-1 rounded text-emerald-400 hover:bg-emerald-400/20"
                          title="حفظ"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 rounded text-red-400 hover:bg-red-400/20"
                          title="إلغاء"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(player)}
                          className="p-1 rounded text-slate-400 hover:text-[#d4af37] hover:bg-white/5 transition-colors"
                          title="تعديل الاسم"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(player.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                          title="حذف اللاعب"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Save Preset Modal */}
      {presetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a082e] border border-[#d4af37]/40 p-5 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">حفظ القائمة الحالية كقالب</h3>
            <p className="text-xs text-[#c4b5d4]">
              احفظ هذه المجموعة المكونة من {players.length} لاعبين للرجوع إليها في أي وقت بضغطة زر.
            </p>
            <input
              type="text"
              value={presetNameInput}
              onChange={(e) => setPresetNameInput(e.target.value)}
              placeholder="مثال: شلة الجمعة، سهرة الاستراحة..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#0e041b] border border-white/20 text-white text-sm"
              autoFocus
            />
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setPresetModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5"
              >
                إلغاء
              </button>
              <button
                onClick={handleSavePresetClick}
                disabled={!presetNameInput.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b45309] text-[#120422] font-bold text-xs disabled:opacity-40"
              >
                حفظ القالب
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="pt-2">
        <button
          onClick={() => {
            sound.playClick();
            onNavigate('ROLES');
          }}
          disabled={players.length < 4}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#b45309] text-[#120422] font-black text-base shadow-xl shadow-[#d4af37]/20 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-[#fef08a]/60"
        >
          <span>متابعة لإعداد الأدوار والشخصيات</span>
          <ArrowLeft className="w-5 h-5" />
        </button>
        {players.length < 4 && (
          <p className="text-center text-xs text-amber-400/90 mt-2">
            يجب إضافة 4 لاعبين على الأقل لتفعيل توزيع أدوار المافيا.
          </p>
        )}
      </div>
    </div>
  );
};
