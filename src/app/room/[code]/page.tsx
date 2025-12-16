"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/trpc"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Loader2, Play, Copy, Rocket, Pencil, X } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useWebSocket } from "@/lib/websocket/client"

interface Player {
    userId: string
    name: string
    isReady: boolean
}

interface RoomState {
    code: string
    hostId: string
    players: Player[]
    status: string
}

export default function RoomPage() {
    const params = useParams()
    const code = params.code as string
    const router = useRouter()
    const { data: session } = authClient.useSession()

    // Local state for room data (synced via WebSocket)
    const [room, setRoom] = useState<RoomState | null>(null)

    // Error state
    const [error, setError] = useState<string | null>(null)

    // Name editing state
    const [isEditingName, setIsEditingName] = useState(false)
    const [newName, setNewName] = useState("")
    const [displayName, setDisplayName] = useState<string>("")

    // WebSocket Hook
    const { isConnected, sendMessage, on } = useWebSocket(code, session?.user?.id, session?.user?.name)

    // Sync displayName with session
    useEffect(() => {
        if (session?.user?.name && !displayName) {
            setDisplayName(session.user.name)
        }
    }, [session?.user?.name, displayName])

    // Initial fetch to get room data (and check existence)
    const { data: initialRoom, isLoading, error: queryError } = api.room.getRoomState.useQuery(
        { code },
        {
            refetchOnWindowFocus: false,
            retry: false
        }
    )

    // Sync initial data
    useEffect(() => {
        if (initialRoom && !room) {
            setRoom({
                code: initialRoom.code,
                hostId: initialRoom.hostId,
                players: initialRoom.players.map(p => ({
                    userId: p.userId || '',
                    name: p.name,
                    isReady: p.isReady
                })),
                status: initialRoom.status
            })
        }
    }, [initialRoom, room])

    // WebSocket Event Listeners
    useEffect(() => {
        const unsubscribeUpdate = on('ROOM_UPDATE', (data: RoomState) => {
            console.log('Room update received:', data)
            setRoom(data)
            setError(null) // Clear error if we got room data
        })

        const unsubscribeStart = on('GAME_STARTED', (data: any) => {
            console.log('🎮 GAME_STARTED event received in waiting room:', data)
            // Navigate to game page
            router.push(`/game/${code}`)
        })

        const unsubscribeError = on('ERROR', (data: any) => {
            console.error('WebSocket error:', data)
            setError(data.message || 'An error occurred')
        })

        return () => {
            unsubscribeUpdate()
            unsubscribeStart()
            unsubscribeError()
        }
    }, [on, router, code])

    // Auto-join mutation for direct URL access (DB record)
    const joinRoomMutation = api.room.join.useMutation()

    useEffect(() => {
        if (initialRoom && session) {
            const isPlayerInRoom = initialRoom.players.some(
                p => p.userId === session.user.id
            )

            if (!isPlayerInRoom && !joinRoomMutation.isPending) {
                joinRoomMutation.mutate({ code })
            }
        }
    }, [initialRoom, session, code])

    const updateNameMutation = api.user.updateName.useMutation({
        onSuccess: (data) => {
            setIsEditingName(false)
            setDisplayName(data.name)
        },
        onError: (error) => {
            alert(error.message || "Failed to update name")
        }
    })

    const startEditingName = () => {
        setNewName(displayName || session?.user?.name || "")
        setIsEditingName(true)
    }

    const saveName = () => {
        if (!newName.trim()) return
        updateNameMutation.mutate({ name: newName })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (queryError || !initialRoom) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-destructive">Error</CardTitle>
                        <CardDescription>{queryError?.message || "Room not found"}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <button
                            onClick={() => router.push("/lobby")}
                            className="w-full bg-secondary py-2 rounded-md font-bold"
                        >
                            Back to Lobby
                        </button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Use local room state if available, otherwise fallback to initial
    const currentRoom = room || {
        code: initialRoom.code,
        hostId: initialRoom.hostId,
        players: initialRoom.players.map(p => ({
            userId: p.userId || '',
            name: p.name,
            isReady: p.isReady
        })),
        status: initialRoom.status
    }

    const currentPlayer = currentRoom.players.find(p => p.userId === session?.user.id)
    const isHost = currentRoom.hostId === session?.user.id
    const allReady = currentRoom.players.length > 0 && currentRoom.players.every(p => p.isReady)

    const handleToggleReady = () => {
        sendMessage('TOGGLE_READY')
    }

    const handleStartGame = () => {
        sendMessage('START_GAME')
    }

    const copyCode = () => {
        navigator.clipboard.writeText(code)
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 font-sans selection:bg-white selection:text-black">
            <div className="w-full max-w-[500px] space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white text-black rounded-md flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                            <Rocket className="w-4 h-4" />
                        </div>

                        {isEditingName ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="h-8 w-32 bg-zinc-900 border border-zinc-700 rounded px-2 text-sm text-white focus:outline-none focus:border-white font-pixel"
                                    autoFocus
                                />
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-zinc-900" onClick={saveName}>
                                    <Check className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-zinc-900" onClick={() => setIsEditingName(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 group cursor-pointer" onClick={startEditingName}>
                                <span className="font-pixel text-sm tracking-tight text-zinc-300 group-hover:text-white transition-colors">
                                    {displayName || session?.user?.name || "COMMANDER"}
                                </span>
                                <Pencil className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                            </div>
                        )}
                    </div>
                    <div className={`flex items-center gap-2 text-[10px] font-mono uppercase border rounded-full px-3 py-1 transition-colors ${isConnected ? 'border-green-900 bg-green-900/20 text-green-500' : 'border-yellow-900 bg-yellow-900/20 text-yellow-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                        {isConnected ? 'Live Uplink' : 'Connecting...'}
                    </div>
                </div>

                <Card className="border-border bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="text-center pb-2 pt-8 space-y-4">
                        <div className="space-y-2">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Mission Encryption Key</span>
                            <div
                                onClick={copyCode}
                                className="group relative flex items-center justify-center gap-4 text-5xl font-mono font-bold tracking-[0.2em] text-white cursor-pointer hover:scale-105 transition-transform"
                                title="Click to copy"
                            >
                                {code}
                                <Copy className="absolute -right-8 w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-wider px-1">
                                <span>Crew Roster ({currentRoom.players.length}/5)</span>
                                <span>Status</span>
                            </div>
                            <div className="space-y-2">
                                {currentRoom.players.map((player) => (
                                    <div
                                        key={player.userId}
                                        className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${player.userId === session?.user.id ? "border-white/20 bg-white/5" : "border-zinc-800/50 bg-zinc-900/20"}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${player.isReady ? "text-green-500 bg-green-500" : "text-yellow-500 bg-yellow-500"}`} />
                                            <div className="flex flex-col">
                                                <span className={`font-medium text-sm ${player.userId === session?.user.id ? "text-white" : "text-zinc-400"}`}>
                                                    {player.name}
                                                </span>
                                                <span className="text-[10px] text-zinc-600 font-mono uppercase">
                                                    {player.userId === currentRoom.hostId ? "Mission Commander" : "Specialist"}
                                                </span>
                                            </div>
                                        </div>
                                        {player.isReady && (
                                            <div className="bg-green-500/10 text-green-500 p-1.5 rounded-full">
                                                <Check className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-zinc-800/50">
                            <Button
                                onClick={handleToggleReady}
                                disabled={!isConnected}
                                className={`w-full h-14 font-bold text-lg rounded-xl transition-all ${currentPlayer?.isReady ? "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white" : "bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]"}`}
                            >
                                {currentPlayer?.isReady ? "Stand By" : "Ready for Launch"}
                            </Button>

                            {isHost && (
                                <Button
                                    onClick={handleStartGame}
                                    disabled={!allReady || !isConnected}
                                    className="w-full h-14 bg-green-500 text-black hover:bg-green-400 font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.2)] disabled:opacity-50 disabled:shadow-none disabled:bg-zinc-900 disabled:text-zinc-600"
                                >
                                    <Play className="w-5 h-5 mr-2 fill-current" />
                                    Initiate Launch
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-[10px] text-zinc-700 font-mono uppercase tracking-widest">
                    Waiting for all crew members to confirm readiness
                </p>
            </div>
        </div>
    )
}
