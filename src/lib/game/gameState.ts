// Game State Types

export type CardType =
    | 'OXYGEN_1'
    | 'OXYGEN_2'
    | 'LASER'
    | 'SHIELD'
    | 'TRACTOR_BEAM'
    | 'HOLE_IN_TANK'
    | 'METEOROID'
    | 'SOLAR_FLARE'
    | 'GAME_DEFAULT' // Placeholder for generic game cards
    | 'SPACE_DEFAULT' // Placeholder for generic space cards

export interface Card {
    id: string
    type: CardType
    name: string
    description: string
}

export interface PlayerState {
    userId: string
    name: string
    position: number // 0-5 = space, 6 = ship
    oxygen: number
    hand: Card[]
    isDead: boolean
    isReady: boolean
    isConnected: boolean
}

export interface GameState {
    roomCode: string
    players: PlayerState[]
    gameDeck: Card[]
    spaceDeck: Card[]
    gameDiscard: Card[]
    spaceDiscard: Card[]

    // Game-level state
    gamePhase: 'PLAYING' | 'GAME_OVER'

    // Turn-level state (only valid when gamePhase = 'PLAYING')
    currentTurn: string // userId of current player
    turnPhase: 'DRAW' | 'ACTION' | 'MOVE' | 'SPACE_EVENT'

    // Track actions in current turn (prevents cheating)
    currentTurnActions: {
        drawnCard: boolean
        playedCards: string[] // card IDs that have been played
        movedThisTurn: boolean
    }

    step: number // Total number of turns played
    winner?: string // userId of winner
}

export interface RoomState {
    code: string
    hostId: string
    players: Map<string, {
        ws: any // WebSocket connection
        userId: string
        name: string
        isReady: boolean
    }>
    gameState: GameState | null
    createdAt: Date
}
