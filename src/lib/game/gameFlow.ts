// Helper functions for game state management

import { GameState } from './gameState';

/**
 * Advance to the next turn phase
 */
export function advanceTurnPhase(gameState: GameState): void {
    const { turnPhase } = gameState;

    switch (turnPhase) {
        case 'DRAW':
            gameState.turnPhase = 'ACTION';
            break;
        case 'ACTION':
            gameState.turnPhase = 'MOVE';
            break;
        case 'MOVE':
            gameState.turnPhase = 'SPACE_EVENT';
            break;
        case 'SPACE_EVENT':
            // Move to next player
            nextPlayer(gameState);
            break;
    }
}

/**
 * Move to the next player and reset turn
 */
export function nextPlayer(gameState: GameState): void {
    const currentIndex = gameState.players.findIndex(p => p.userId === gameState.currentTurn);
    let nextIndex = (currentIndex + 1) % gameState.players.length;

    // Skip dead or disconnected players
    let attempts = 0;
    while (attempts < gameState.players.length) {
        const player = gameState.players[nextIndex];
        if (!player.isDead && player.isConnected) {
            gameState.currentTurn = player.userId;
            gameState.turnPhase = 'DRAW';
            gameState.currentTurnActions = {
                drawnCard: false,
                playedCards: [],
                movedThisTurn: false
            };
            gameState.step++;
            return;
        }
        nextIndex = (nextIndex + 1) % gameState.players.length;
        attempts++;
    }

    // No valid players left - game over
    gameState.gamePhase = 'GAME_OVER';
}

/**
 * Check if game should end and determine winner
 */
export function checkGameOver(gameState: GameState): boolean {
    // Check if any player reached the ship (position 6)
    const winner = gameState.players.find(p => p.position === 6 && !p.isDead);
    if (winner) {
        gameState.gamePhase = 'GAME_OVER';
        gameState.winner = winner.userId;
        return true;
    }

    // Check if all players are dead
    const alivePlayers = gameState.players.filter(p => !p.isDead);
    if (alivePlayers.length === 0) {
        gameState.gamePhase = 'GAME_OVER';
        // No winner - everyone died
        return true;
    }

    return false;
}
