import { Card, CardType } from './gameState';

// Fisher-Yates shuffle algorithm
export function shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Generate a unique card ID
let cardIdCounter = 0;
function generateCardId(): string {
    return `card_${Date.now()}_${cardIdCounter++}`;
}

// Card definitions with quantities based on the game rules
export function createGameDeck(): Card[] {
    const deck: Card[] = [];

    // Oxygen cards (multiple copies)
    for (let i = 0; i < 10; i++) {
        deck.push({
            id: generateCardId(),
            type: 'OXYGEN_1',
            name: 'Oxygen (1)',
            description: 'Add 1 oxygen to your tank'
        });
    }

    for (let i = 0; i < 8; i++) {
        deck.push({
            id: generateCardId(),
            type: 'OXYGEN_2',
            name: 'Oxygen (2)',
            description: 'Add 2 oxygen to your tank'
        });
    }

    // Oxygen Siphon (steal oxygen)
    for (let i = 0; i < 4; i++) {
        deck.push({
            id: generateCardId(),
            type: 'GAME_DEFAULT',
            name: 'Oxygen Siphon',
            description: 'Steal 1 oxygen from another player'
        });
    }

    // Rocket Booster (move forward)
    for (let i = 0; i < 4; i++) {
        deck.push({
            id: generateCardId(),
            type: 'GAME_DEFAULT',
            name: 'Rocket Booster',
            description: 'Move forward 1 space'
        });
    }

    // Tether (pull another player back)
    for (let i = 0; i < 3; i++) {
        deck.push({
            id: generateCardId(),
            type: 'GAME_DEFAULT',
            name: 'Tether',
            description: 'Pull a player back 1 space'
        });
    }

    // Laser Blast
    for (let i = 0; i < 2; i++) {
        deck.push({
            id: generateCardId(),
            type: 'LASER',
            name: 'Laser Blast',
            description: 'Destroy a card in play'
        });
    }

    // Shield
    for (let i = 0; i < 5; i++) {
        deck.push({
            id: generateCardId(),
            type: 'SHIELD',
            name: 'Shield',
            description: 'Block an attack'
        });
    }

    // Hack Suit (prevents next oxygen loss)
    for (let i = 0; i < 3; i++) {
        deck.push({
            id: generateCardId(),
            type: 'GAME_DEFAULT',
            name: 'Hack Suit',
            description: 'Prevent next oxygen loss'
        });
    }

    return shuffle(deck);
}

export function createSpaceDeck(): Card[] {
    const deck: Card[] = [];

    // Blank Space (safe)
    for (let i = 0; i < 10; i++) {
        deck.push({
            id: generateCardId(),
            type: 'SPACE_DEFAULT',
            name: 'Blank Space',
            description: 'Safe - nothing happens'
        });
    }

    // Asteroid Field (all players lose 1 oxygen)
    for (let i = 0; i < 8; i++) {
        deck.push({
            id: generateCardId(),
            type: 'SPACE_DEFAULT',
            name: 'Asteroid Field',
            description: 'All players lose 1 oxygen'
        });
    }

    // Gravitational Anomaly (move back)
    for (let i = 0; i < 5; i++) {
        deck.push({
            id: generateCardId(),
            type: 'SPACE_DEFAULT',
            name: 'Gravitational Anomaly',
            description: 'Current player moves back 1 space'
        });
    }

    // Solar Flare (discard a card)
    for (let i = 0; i < 4; i++) {
        deck.push({
            id: generateCardId(),
            type: 'SOLAR_FLARE',
            name: 'Solar Flare',
            description: 'All players discard 1 card'
        });
    }

    // Meteoroid (targeted oxygen loss)
    for (let i = 0; i < 3; i++) {
        deck.push({
            id: generateCardId(),
            type: 'METEOROID',
            name: 'Meteoroid',
            description: 'Closest player to ship loses 2 oxygen'
        });
    }

    return shuffle(deck);
}
