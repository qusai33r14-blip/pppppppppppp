/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RoleId =
  | 'citizen'
  | 'silencer_mafia'
  | 'assassin_mafia'
  | 'regular_mafia'
  | 'doctor'
  | 'detective';

export type RoleSide = 'CIVILIAN' | 'MAFIA';

export interface RoleDefinition {
  id: RoleId;
  name: string;
  englishTitle: string;
  emoji: string;
  side: RoleSide;
  sideName: string;
  accentColor: string; // Tailwind color string or hex
  glowColor: string;
  image: string;
  shortDesc: string;
  fullDesc: string;
  nightActionDesc: string;
  proTip: string;
}

export interface Player {
  id: string;
  name: string;
}

export interface AssignedPlayer extends Player {
  roleId: RoleId;
  revealed: boolean;
  isAlive: boolean;
  isSilenced?: boolean;
}

export type RoleCounts = Record<RoleId, number>;

export interface GameRoundHistory {
  id: string;
  timestamp: number;
  dateFormatted: string;
  players: string[];
  roleCounts: RoleCounts;
  winner?: 'CIVILIAN' | 'MAFIA' | 'UNDECIDED';
  notes?: string;
  durationSeconds?: number;
}

export interface PlayerPreset {
  id: string;
  name: string;
  players: string[];
  createdAt: number;
}

export type AppScreen =
  | 'HOME'
  | 'PLAYERS'
  | 'ROLES'
  | 'REVEAL_PASS'
  | 'REVEAL_CARD'
  | 'GAME_RUNNING'
  | 'SUMMARY'
  | 'PRESETS'
  | 'HISTORY'
  | 'RULES';
