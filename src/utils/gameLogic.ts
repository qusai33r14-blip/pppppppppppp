/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Player, RoleCounts, RoleId, AssignedPlayer } from '../types/mafia';
import { ROLES } from '../data/roles';

export function calculateTotalRoles(counts: RoleCounts): number {
  return Object.values(counts).reduce((acc, curr) => acc + curr, 0);
}

export function countBySide(counts: RoleCounts): { mafia: number; civilian: number } {
  let mafia = 0;
  let civilian = 0;
  for (const [key, count] of Object.entries(counts) as [RoleId, number][]) {
    const role = ROLES[key];
    if (role.side === 'MAFIA') {
      mafia += count;
    } else {
      civilian += count;
    }
  }
  return { mafia, civilian };
}

/**
 * Modern Fisher-Yates Cryptographic Shuffle
 */
export function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    let rand = Math.random();
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const buffer = new Uint32Array(1);
      window.crypto.getRandomValues(buffer);
      rand = buffer[0] / (0xffffffff + 1);
    }
    const j = Math.floor(rand * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function distributeRoles(players: Player[], counts: RoleCounts): AssignedPlayer[] {
  const totalRoles = calculateTotalRoles(counts);
  if (totalRoles !== players.length) {
    throw new Error(`عدد الأدوار (${totalRoles}) لا يطابق عدد اللاعبين (${players.length})`);
  }

  // Create role deck array
  const roleDeck: RoleId[] = [];
  for (const [roleKey, count] of Object.entries(counts) as [RoleId, number][]) {
    for (let i = 0; i < count; i++) {
      roleDeck.push(roleKey);
    }
  }

  // Shuffle roles twice thoroughly
  const shuffledRoles = shuffleArray(shuffleArray(roleDeck));
  
  // Assign to players
  return players.map((player, idx) => ({
    ...player,
    roleId: shuffledRoles[idx],
    revealed: false,
    isAlive: true,
    isSilenced: false,
  }));
}
