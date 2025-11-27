"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Rocket, Skull, Wind, Zap, Shield, Settings, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useWebSocket } from "@/lib/websocket/client"
import { authClient } from "@/lib/auth-client"

// Mock hand (will be replaced in Phase 3)
const MOCK_HAND = ["OXYGEN_1", "LASER", "SHIELD", "OXYGEN_2"]

interface Player {
    userId: string
    name: string
    oxygen: number
    position: number
    isSelf: boolean
    cards: number
    isDead: boolean
}

export default function GamePage() {
    const params = useParams()
    const { data: session } = authClient.useSession()
    const code = params.code as string

    // WebSocket connection
    const { isConnected, on } = useWebSocket(code, session?.user?.id, session?.user?.name)

    // Real player state
    const [players, setPlayers] = useState<Player[]>([])

    // Game state (deck counts, etc.)
    const [gameDeckCount, setGameDeckCount] = useState(0)
    const [spaceDeckCount, setSpaceDeckCount] = useState(0)

    // Mock game data (will be replaced later)
    const [selectedCard, setSelectedCard] = useState<number | null>(null)
    const [hand, setHand] = useState<any[]>([]) // Now stores full card objects
    const [draggedCard, setDraggedCard] = useState<number | null>(null)
    const [dragOverCard, setDragOverCard] = useState<number | null>(null)

    // Listen to ROOM_UPDATE to sync players
    useEffect(() => {
        const unsubscribe = on('ROOM_UPDATE', (data: any) => {
            if (data.players) {
                // Convert room players to game players format
                const gamePlayers: Player[] = data.players.map((p: any) => ({
                    userId: p.userId,
                    name: p.name,
                    oxygen: 6, // Starting oxygen
                    position: 0, // Everyone starts at position 0
                    isSelf: p.userId === session?.user?.id,
                    cards: 4, // Starting hand size
                    isDead: false
                }))
                setPlayers(gamePlayers)
            }
        })

        return unsubscribe
    }, [on, session?.user?.id])

    // Listen to GAME_STARTED to update with actual game state
    useEffect(() => {
        const unsubscribe = on('GAME_STARTED', (data: any) => {
            console.log('Game started with state:', data)
            if (data.gameState) {
                const gameState = data.gameState

                // Update deck counts
                setGameDeckCount(gameState.gameDeck.length)
                setSpaceDeckCount(gameState.spaceDeck.length)

                // Update players with real game state
                const gamePlayers: Player[] = gameState.players.map((p: any) => ({
                    userId: p.userId,
                    name: p.name,
                    oxygen: p.oxygen,
                    position: p.position,
                    isSelf: p.userId === session?.user?.id,
                    cards: p.hand.length,
                    isDead: p.isDead
                }))
                setPlayers(gamePlayers)

                // Update hand if this is the current player
                const currentPlayerState = gameState.players.find((p: any) => p.userId === session?.user?.id)
                if (currentPlayerState && currentPlayerState.hand) {
                    // Store full card objects
                    setHand(currentPlayerState.hand)
                }

                console.log('Initialized players:', gamePlayers)
                console.log('Game deck:', gameState.gameDeck.length, 'cards')
                console.log('Space deck:', gameState.spaceDeck.length, 'cards')
                console.log('Your hand:', currentPlayerState?.hand)
            }
        })

        return unsubscribe
    }, [on, session?.user?.id])



    return (
        <div className="min-h-screen bg-black flex flex-col font-sans selection:bg-white selection:text-black">

            {/* Top Bar */}
            <header className="h-14 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-white" />
                    <span className="font-pixel text-lg text-white tracking-widest">SELFISH</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-mono text-zinc-400">TURN:</span>
                        <span className="text-xs font-bold text-white">COMMANDER (YOU)</span>
                    </div>
                    <div className="text-xs font-mono text-zinc-500">
                        ACTION PHASE
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-xs font-mono text-zinc-500">
                        ROOM: <span className="text-zinc-300">{params.code as string}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-white">
                            <Settings className="w-4 h-4" />
                        </Button>
                        <Link href="/lobby">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-950/20">
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content - 3 Column Layout */}
            <main className="flex-1 flex overflow-hidden">

                {/* Left Column: Decks (Game & Space) */}
                <div className="w-48 border-r border-zinc-800 bg-[#151515] p-2 pb-24 flex flex-col shrink-0 overflow-y-auto">

                    {/* Game Deck */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-2 border-b border-zinc-800/30">
                        <div className="w-16 h-24 rounded-lg border-2 border-zinc-700 bg-zinc-800 relative shadow-xl group cursor-pointer hover:-translate-y-1 transition-transform">
                            <div className="absolute inset-0 flex items-center justify-center opacity-10"
                                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '8px 8px' }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-pixel text-[10px] text-zinc-500">GAME</span>
                            </div>
                            {gameDeckCount > 0 && (
                                <div className="absolute -top-2 -right-2 bg-white text-black font-bold text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                                    {gameDeckCount}
                                </div>
                            )}
                            {/* Stack effect */}
                            <div className="absolute -bottom-1 -right-1 w-full h-full rounded-lg border-2 border-zinc-800 bg-zinc-800 -z-10" />
                        </div>
                        <span className="text-[9px] font-mono text-zinc-500 tracking-widest">GAME DECK</span>
                    </div>

                    {/* Game Discard */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-2 border-b border-zinc-800/30">
                        <div className="w-16 h-24 rounded-lg border-2 border-zinc-700 bg-zinc-900/50 flex items-center justify-center relative">
                            <span className="text-[9px] text-zinc-600 font-mono">EMPTY</span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-500 tracking-widest">DISCARD</span>
                    </div>

                    {/* Space Deck */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-2 border-b border-zinc-800/30">
                        <div className="w-16 h-24 rounded-lg border-2 border-zinc-800 bg-black relative shadow-xl group cursor-pointer hover:-translate-y-1 transition-transform">
                            <div className="absolute inset-0 flex items-center justify-center opacity-30"
                                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '4px 4px' }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-pixel text-[10px] text-zinc-500">SPACE</span>
                            </div>
                            {spaceDeckCount > 0 && (
                                <div className="absolute -top-2 -right-2 bg-purple-500 text-white font-bold text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                                    {spaceDeckCount}
                                </div>
                            )}
                            {/* Stack effect */}
                            <div className="absolute -bottom-1 -right-1 w-full h-full rounded-lg border-2 border-zinc-800 bg-zinc-900 -z-10" />
                        </div>
                        <span className="text-[9px] font-mono text-zinc-500 tracking-widest">SPACE DECK</span>
                    </div>

                    {/* Space Discard */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-2">
                        <div className="w-16 h-24 rounded-lg border-2 border-zinc-800 bg-zinc-900/50 flex items-center justify-center relative">
                            <span className="text-[9px] text-zinc-600 font-mono">EMPTY</span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-500 tracking-widest">DISCARD</span>
                    </div>

                </div>

                {/* Center Column: The Board */}
                <div className="flex-1 bg-[#1a1a1a] relative flex flex-col overflow-hidden">
                    {/* Background Texture */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                    />

                    {/* Shared Ship Zone (Top) */}
                    <div className="h-24 border-b border-green-500/30 bg-green-500/5 flex items-center justify-center relative shrink-0">
                        <div className="absolute top-2 left-2 text-[10px] font-mono text-green-500/50 tracking-widest">THE SHIP</div>

                        {/* Players on Ship (Pos 6) */}
                        <div className="flex gap-4">
                            {players.filter(p => p.position === 6).map(player => (
                                <div key={player.userId} className="relative group">
                                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-lg border-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center justify-center bg-green-500 text-black border-green-400 transform transition-all duration-500 hover:scale-110`}>
                                        <Rocket className="w-6 h-6 md:w-8 md:h-8" />
                                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                            <span className="text-[10px] font-bold text-green-400 bg-black/50 px-2 py-0.5 rounded-full border border-green-900">
                                                {player.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {players.filter(p => p.position === 6).length === 0 && (
                                <div className="text-green-500/20 font-mono text-xs animate-pulse">
                                    WAITING FOR SURVIVORS...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Board Area */}
                    <div className="flex-1 p-4 pb-16 flex justify-center items-center overflow-hidden">
                        <div className="flex gap-2 md:gap-4 h-full w-full max-w-5xl justify-center relative">

                            {/* Y-Axis Labels (Left Side) */}
                            <div className="flex flex-col justify-between h-full py-2 text-[10px] font-mono text-zinc-600 text-right pr-2 select-none w-12 shrink-0">
                                {[5, 4, 3, 2, 1, 0].map(pos => (
                                    <div key={pos} className="flex-1 flex items-center justify-end border-b border-transparent">POS {pos}</div>
                                ))}
                            </div>

                            {/* Player Lanes */}
                            {players.map((player) => (
                                <div key={player.userId} className="relative flex flex-col h-full flex-1 max-w-[140px] group">

                                    {/* The Track */}
                                    <div className="flex-1 flex flex-col-reverse relative border-x border-zinc-800/30 bg-zinc-900/20">

                                        {/* Positions 0-5 */}
                                        {[0, 1, 2, 3, 4, 5].map((pos) => (
                                            <div key={pos} className="flex-1 flex items-center justify-center relative min-h-0 p-1">
                                                {/* The Card Slot */}
                                                <div className={`w-full h-full max-h-[95%] rounded border transition-all duration-300 ${player.position >= pos && player.position < 6
                                                    ? 'border-zinc-700 bg-zinc-900/50' // Traversed/Current
                                                    : 'border-zinc-800/30 bg-transparent' // Future
                                                    }`}>
                                                    {/* Card Back Pattern for Future/Current */}
                                                    <div className="w-full h-full opacity-10"
                                                        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 0, transparent 50%)', backgroundSize: '6px 6px' }}
                                                    />
                                                </div>

                                                {/* Player Avatar if here */}
                                                {player.position === pos && !player.isDead && (
                                                    <div className="absolute z-20 transform transition-all duration-500 hover:scale-110">
                                                        <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg border-2 shadow-xl flex items-center justify-center ${player.isSelf ? 'bg-white border-white text-black' : 'bg-zinc-800 border-zinc-600 text-zinc-300'
                                                            }`}>
                                                            <span className="font-pixel text-sm md:text-lg">{player.name.charAt(0)}</span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Dead Marker */}
                                                {player.position === pos && player.isDead && (
                                                    <div className="absolute z-20">
                                                        <Skull className="w-6 h-6 md:w-8 md:h-8 text-zinc-600" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                    </div>

                                    {/* Player Name Label at Bottom */}
                                    <div className="text-center pt-2 shrink-0">
                                        <div className={`text-[9px] md:text-[10px] font-bold truncate px-1 ${player.isSelf ? 'text-white' : 'text-zinc-500'}`}>
                                            {player.isSelf ? 'YOU' : player.name}
                                        </div>
                                        <div className="flex justify-center gap-1 mt-0.5">
                                            <div className="flex items-center gap-0.5 text-[8px] text-blue-400">
                                                <Wind className="w-2 h-2" /> {player.oxygen}
                                            </div>
                                            <div className="flex items-center gap-0.5 text-[8px] text-zinc-400">
                                                <div className="w-1 h-1.5 bg-zinc-700 rounded-[1px]" /> {player.cards}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))}

                        </div>
                    </div>
                </div>

                {/* Right Column: Log Only */}
                <div className="w-64 border-l border-zinc-800 bg-[#151515] p-2 pb-24 flex flex-col gap-3 shrink-0 overflow-auto">
                    {/* Event Log */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="p-3 border-b border-zinc-800 bg-zinc-900/50">
                            <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">Mission Log</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 font-mono text-xs">
                            <div className="text-zinc-400">
                                <span className="text-zinc-600">[10:42]</span> Game started.
                            </div>
                            <div className="text-zinc-300">
                                <span className="text-blue-500">Commander</span> drew <span className="text-white">Oxygen Tank</span>.
                            </div>
                            <div className="text-zinc-300">
                                <span className="text-zinc-500">Officer Ripley</span> moved to <span className="text-zinc-500">Pos 1</span>.
                            </div>
                            <div className="text-red-400">
                                <span className="text-zinc-500">Cadet Jenkins</span> was hit by <span className="text-red-500">Meteoroid</span>!
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {/* Bottom Bar: Hand */}
            <footer className="h-52 border-t border-zinc-800 bg-zinc-950 p-3 flex shrink-0 z-20 relative">

                {/* Hand (Full Width) */}
                <div className="flex-1 bg-zinc-900/30 rounded-lg border border-zinc-800/50 p-2 flex flex-col">
                    <div className="flex justify-between items-center px-2 mb-2">
                        <span className="text-xs font-mono uppercase text-zinc-500 tracking-widest">Your Hand</span>
                        <span className="text-xs font-mono text-zinc-600">{hand.length} Cards</span>
                    </div>
                    <div className="flex-1 overflow-x-auto flex items-center gap-3 px-2">
                        {hand.map((card, idx) => (
                            <div
                                key={idx}
                                draggable
                                onDragStart={(e) => {
                                    setDraggedCard(idx)
                                    e.dataTransfer.effectAllowed = 'move'
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault()
                                    setDragOverCard(idx)
                                }}
                                onDrop={(e) => {
                                    e.preventDefault()
                                    if (draggedCard !== null && draggedCard !== idx) {
                                        const newHand = [...hand]
                                        const [removed] = newHand.splice(draggedCard, 1)
                                        newHand.splice(idx, 0, removed)
                                        setHand(newHand)
                                    }
                                    setDraggedCard(null)
                                    setDragOverCard(null)
                                }}
                                onDragEnd={() => {
                                    setDraggedCard(null)
                                    setDragOverCard(null)
                                }}
                                onClick={() => setSelectedCard(idx === selectedCard ? null : idx)}
                                className={`
                                    w-20 h-28 shrink-0 rounded-lg border-2 flex flex-col items-center justify-between p-2 cursor-move transition-all duration-200 hover:-translate-y-2
                                    ${draggedCard === idx ? 'opacity-40 scale-95' : ''}
                                    ${dragOverCard === idx && draggedCard !== idx ? 'ring-2 ring-blue-400' : ''}
                                    ${selectedCard === idx ? 'border-white bg-zinc-800 shadow-[0_0_15px_rgba(255,255,255,0.1)] -translate-y-2' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'}
                                `}
                            >
                                <div className="w-full flex justify-between items-start">
                                    <span className="text-[8px] font-pixel text-zinc-500">
                                        {card.type?.includes('OXYGEN') ? 'SUPPLY' : 'ACTION'}
                                    </span>
                                </div>

                                <div className="text-center">
                                    {card.type?.includes('OXYGEN') && <Wind className="w-5 h-5 text-blue-500 mx-auto mb-1" />}
                                    {card.type === 'LASER' && <Zap className="w-5 h-5 text-red-500 mx-auto mb-1" />}
                                    {card.type === 'SHIELD' && <Shield className="w-5 h-5 text-purple-500 mx-auto mb-1" />}

                                    <span className="font-bold text-[9px] block leading-tight text-zinc-200">
                                        {card.type === 'OXYGEN_1' ? '+1 O₂' :
                                            card.type === 'OXYGEN_2' ? '+2 O₂' :
                                                card.name || 'Card'}
                                    </span>
                                </div>

                                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className={`h-full w-full ${card.type?.includes('OXYGEN') ? 'bg-blue-500' :
                                        card.type === 'LASER' ? 'bg-red-500' : 'bg-purple-500'
                                        }`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </footer>
        </div>
    )
}
