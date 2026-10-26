/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { PlayerManagerScreen } from './components/PlayerManagerScreen';
import { RoleSetupScreen } from './components/RoleSetupScreen';
import { SecretPassScreen } from './components/SecretPassScreen';
import { SecretRevealScreen } from './components/SecretRevealScreen';
import { GameRunningScreen } from './components/GameRunningScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { PresetsScreen } from './components/PresetsScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { RulesModal } from './components/RulesModal';

import {
  Player,
  AssignedPlayer,
  RoleCounts,
  AppScreen,
  GameRoundHistory,
  PlayerPreset,
} from './types/mafia';
import { getRecommendedRoleSetup } from './data/roles';
import { distributeRoles } from './utils/gameLogic';
import {
  loadCurrentPlayers,
  saveCurrentPlayers,
  loadLastRoundPlayers,
  saveLastRoundPlayers,
  loadSavedPresets,
  savePresets,
  loadGameHistory,
  addGameToHistory,
  clearGameHistory,
  loadSavedRoleCounts,
  saveSavedRoleCounts,
} from './utils/storage';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('HOME');
  const [rulesOpen, setRulesOpen] = useState<boolean>(false);

  // Players State
  const [players, setPlayers] = useState<Player[]>(() => loadCurrentPlayers());
  const [lastRoundPlayerNames, setLastRoundPlayerNames] = useState<string[]>(() =>
    loadLastRoundPlayers()
  );

  // Role Configuration State
  const [roleCounts, setRoleCounts] = useState<RoleCounts>(() => {
    const saved = loadSavedRoleCounts();
    return saved || getRecommendedRoleSetup(players.length || 7);
  });

  // Active Assigned Players in current round
  const [assignedPlayers, setAssignedPlayers] = useState<AssignedPlayer[]>([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState<number>(0);
  const [isPassPhase, setIsPassPhase] = useState<boolean>(true);

  // Presets & History State
  const [presets, setPresets] = useState<PlayerPreset[]>(() => loadSavedPresets());
  const [history, setHistory] = useState<GameRoundHistory[]>(() => loadGameHistory());

  // Save current players when updated
  const handleUpdatePlayers = (updated: Player[]) => {
    setPlayers(updated);
    saveCurrentPlayers(updated);
    // If roles were unconfigured or player count changed, update recommended
    if (Object.values(roleCounts).reduce((a, b) => a + b, 0) !== updated.length) {
      const rec = getRecommendedRoleSetup(updated.length);
      setRoleCounts(rec);
      saveSavedRoleCounts(rec);
    }
  };

  const handleUpdateRoleCounts = (counts: RoleCounts) => {
    setRoleCounts(counts);
    saveSavedRoleCounts(counts);
  };

  // Restore Last Round Players
  const handleRestoreLastRound = (): boolean => {
    if (lastRoundPlayerNames && lastRoundPlayerNames.length > 0) {
      const restored: Player[] = lastRoundPlayerNames.map((name, idx) => ({
        id: 'p_restored_' + idx + '_' + Date.now(),
        name,
      }));
      handleUpdatePlayers(restored);
      return true;
    }
    return false;
  };

  // Save Preset
  const handleSaveAsPreset = (presetName: string) => {
    const newPreset: PlayerPreset = {
      id: 'preset_' + Date.now(),
      name: presetName,
      players: players.map((p) => p.name),
      createdAt: Date.now(),
    };
    const updated = [newPreset, ...presets];
    setPresets(updated);
    savePresets(updated);
  };

  const handleDeletePreset = (id: string) => {
    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    savePresets(updated);
  };

  const handleLoadPreset = (playerNames: string[]) => {
    const loaded: Player[] = playerNames.map((name, idx) => ({
      id: 'p_preset_' + idx + '_' + Date.now(),
      name,
    }));
    handleUpdatePlayers(loaded);
    setScreen('PLAYERS');
  };

  // Start Distribution & Secret Reveal Flow
  const handleStartDistribution = () => {
    try {
      const distributed = distributeRoles(players, roleCounts);
      setAssignedPlayers(distributed);
      setCurrentRevealIndex(0);
      setIsPassPhase(true);
      setScreen('REVEAL_PASS');
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // Turn Flow in Secret Reveal
  const handleReadyToReveal = () => {
    setIsPassPhase(false);
    setScreen('REVEAL_CARD');
  };

  const handleNextPlayer = () => {
    const nextIdx = currentRevealIndex + 1;
    setCurrentRevealIndex(nextIdx);
    setIsPassPhase(true);
    setScreen('REVEAL_PASS');
  };

  const handleFinishReveals = () => {
    // All cards revealed! Save player names as last round players
    const names = players.map((p) => p.name);
    setLastRoundPlayerNames(names);
    saveLastRoundPlayers(names);
    setScreen('GAME_RUNNING');
  };

  // Alive & Silenced Tracking during game
  const handleTogglePlayerAlive = (playerId: string) => {
    setAssignedPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, isAlive: !p.isAlive } : p))
    );
  };

  const handleTogglePlayerSilenced = (playerId: string) => {
    setAssignedPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, isSilenced: !p.isSilenced } : p))
    );
  };

  // End Round & Go to Summary
  const handleEndRoundAndShowSummary = () => {
    setScreen('SUMMARY');
  };

  // Save Round to History
  const handleSaveToHistory = (winner: 'CIVILIAN' | 'MAFIA' | 'UNDECIDED') => {
    addGameToHistory({
      players: players.map((p) => p.name),
      roleCounts,
      winner,
    });
    setHistory(loadGameHistory());
  };

  // Play Again with Same Players
  const handlePlayAgainSamePlayers = () => {
    // Keep current players, route directly to RoleSetup or re-shuffle
    setScreen('ROLES');
  };

  const handleLoadPlayersFromHistory = (names: string[]) => {
    const loaded: Player[] = names.map((name, idx) => ({
      id: 'p_hist_' + idx + '_' + Date.now(),
      name,
    }));
    handleUpdatePlayers(loaded);
    setScreen('PLAYERS');
  };

  const handleClearHistory = () => {
    clearGameHistory();
    setHistory([]);
  };

  const hasActiveRound = assignedPlayers.length > 0 && screen !== 'SUMMARY';

  return (
    <div className="min-h-screen mafia-bg-ambient flex flex-col font-['Cairo',sans-serif] text-slate-100 antialiased selection:bg-[#d4af37]/30 selection:text-white">
      {/* Top Header */}
      <Header
        currentScreen={screen}
        onNavigate={(target) => setScreen(target)}
        onOpenRules={() => setRulesOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full pb-8">
        {screen === 'HOME' && (
          <HomeScreen
            playerCount={players.length}
            hasActiveRound={hasActiveRound}
            onNavigate={(target) => setScreen(target)}
            onOpenRules={() => setRulesOpen(true)}
          />
        )}

        {screen === 'PLAYERS' && (
          <PlayerManagerScreen
            players={players}
            onUpdatePlayers={handleUpdatePlayers}
            onRestoreLastRound={handleRestoreLastRound}
            hasLastRoundPlayers={lastRoundPlayerNames.length > 0}
            onSaveAsPreset={handleSaveAsPreset}
            onNavigate={(target) => setScreen(target)}
          />
        )}

        {screen === 'ROLES' && (
          <RoleSetupScreen
            playerCount={players.length}
            roleCounts={roleCounts}
            onUpdateRoleCounts={handleUpdateRoleCounts}
            onStartDistribution={handleStartDistribution}
            onNavigate={(target) => setScreen(target)}
          />
        )}

        {screen === 'REVEAL_PASS' && assignedPlayers.length > 0 && (
          <SecretPassScreen
            nextPlayerName={assignedPlayers[currentRevealIndex]?.name || ''}
            playerIndex={currentRevealIndex}
            totalPlayers={assignedPlayers.length}
            onReadyToReveal={handleReadyToReveal}
          />
        )}

        {screen === 'REVEAL_CARD' && assignedPlayers.length > 0 && (
          <SecretRevealScreen
            player={assignedPlayers[currentRevealIndex]}
            playerIndex={currentRevealIndex}
            totalPlayers={assignedPlayers.length}
            isLastPlayer={currentRevealIndex >= assignedPlayers.length - 1}
            onNextPlayer={handleNextPlayer}
            onFinishReveals={handleFinishReveals}
          />
        )}

        {screen === 'GAME_RUNNING' && (
          <GameRunningScreen
            players={assignedPlayers}
            onTogglePlayerAlive={handleTogglePlayerAlive}
            onTogglePlayerSilenced={handleTogglePlayerSilenced}
            onEndRoundAndShowSummary={handleEndRoundAndShowSummary}
            onNavigate={(target) => setScreen(target)}
          />
        )}

        {screen === 'SUMMARY' && (
          <SummaryScreen
            players={assignedPlayers}
            roleCounts={roleCounts}
            onSaveToHistory={handleSaveToHistory}
            onPlayAgainSamePlayers={handlePlayAgainSamePlayers}
            onNavigate={(target) => setScreen(target)}
          />
        )}

        {screen === 'PRESETS' && (
          <PresetsScreen
            presets={presets}
            onLoadPreset={handleLoadPreset}
            onDeletePreset={handleDeletePreset}
            onNavigate={(target) => setScreen(target)}
          />
        )}

        {screen === 'HISTORY' && (
          <HistoryScreen
            history={history}
            onLoadPlayersFromHistory={handleLoadPlayersFromHistory}
            onClearHistory={handleClearHistory}
            onNavigate={(target) => setScreen(target)}
          />
        )}
      </main>

      {/* Rules Modal (Globally Accessible) */}
      <RulesModal isOpen={rulesOpen} onClose={() => setRulesOpen(false)} />
    </div>
  );
}
