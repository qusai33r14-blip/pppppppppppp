/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Player, RoleCounts, GameRoundHistory, PlayerPreset } from '../types/mafia';
import { DEFAULT_ROLE_COUNTS } from '../data/roles';

const STORAGE_KEYS = {
  CURRENT_PLAYERS: 'mafia_current_players',
  SAVED_PRESETS: 'mafia_player_presets',
  GAME_HISTORY: 'mafia_game_history',
  SAVED_ROLES: 'mafia_saved_role_counts',
  LAST_ROUND_PLAYERS: 'mafia_last_round_players',
};

// Initial default Arabic names for instant out-of-the-box enjoyment
export const DEFAULT_PLAYERS: Player[] = [
  { id: 'p1', name: 'سلطان' },
  { id: 'p2', name: 'فيصل' },
  { id: 'p3', name: 'فهد' },
  { id: 'p4', name: 'خالد' },
  { id: 'p5', name: 'مشاري' },
  { id: 'p6', name: 'عبدالعزيز' },
  { id: 'p7', name: 'سعود' },
];

export const DEFAULT_PRESETS: PlayerPreset[] = [
  {
    id: 'preset_friends',
    name: 'شلة الاستراحة (7 لاعبين)',
    players: ['سلطان', 'فيصل', 'فهد', 'خالد', 'مشاري', 'عبدالعزيز', 'سعود'],
    createdAt: Date.now() - 100000,
  },
  {
    id: 'preset_family',
    name: 'سهرة العائلة (6 لاعبين)',
    players: ['محمد', 'أحمد', 'سارة', 'نورة', 'عمر', 'عبدالله'],
    createdAt: Date.now() - 50000,
  },
];

export function loadCurrentPlayers(): Player[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_PLAYERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load current players', err);
  }
  return DEFAULT_PLAYERS;
}

export function saveCurrentPlayers(players: Player[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLAYERS, JSON.stringify(players));
  } catch (err) {
    console.error('Failed to save current players', err);
  }
}

export function loadLastRoundPlayers(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_ROUND_PLAYERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return [];
}

export function saveLastRoundPlayers(playerNames: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_ROUND_PLAYERS, JSON.stringify(playerNames));
  } catch {
    // ignore
  }
}

export function loadSavedPresets(): PlayerPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_PRESETS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_PRESETS;
}

export function savePresets(presets: PlayerPreset[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_PRESETS, JSON.stringify(presets));
  } catch {
    // ignore
  }
}

export function loadGameHistory(): GameRoundHistory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return [];
}

export function saveGameHistory(history: GameRoundHistory[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(history));
  } catch {
    // ignore
  }
}

export function addGameToHistory(record: Omit<GameRoundHistory, 'id' | 'timestamp' | 'dateFormatted'>): void {
  const history = loadGameHistory();
  const date = new Date();
  const formatter = new Intl.DateTimeFormat('ar-SA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const newEntry: GameRoundHistory = {
    ...record,
    id: 'round_' + Date.now(),
    timestamp: Date.now(),
    dateFormatted: formatter.format(date),
  };

  const updated = [newEntry, ...history].slice(0, 50); // Keep last 50 games
  saveGameHistory(updated);
}

export function clearGameHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.GAME_HISTORY);
  } catch {
    // ignore
  }
}

export function loadSavedRoleCounts(): RoleCounts {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_ROLES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return DEFAULT_ROLE_COUNTS;
}

export function saveSavedRoleCounts(counts: RoleCounts): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_ROLES, JSON.stringify(counts));
  } catch {
    // ignore
  }
}
