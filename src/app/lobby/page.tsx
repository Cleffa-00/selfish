"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/trpc"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Rocket, Users, ArrowRight, LogOut, Pencil, Check, X } from "lucide-react"

export default function LobbyPage() {
    const [joinCode, setJoinCode] = useState("")
    const [isEditingName, setIsEditingName] = useState(false)
    const [newName, setNewName] = useState("")
    const [displayName, setDisplayName] = useState<string>("") // Added displayName state
    const router = useRouter()
    const { data: session, isPending, error } = authClient.useSession()

    // Sync displayName with session
    useEffect(() => { // Changed from useState to useEffect
        if (session?.user?.name && !displayName) { // Only set if session name exists and displayName is not yet set
            setDisplayName(session.user.name)
        }
    }, [session?.user?.name, displayName]) // Dependency array for useEffect

    const createRoomMutation = api.room.create.useMutation({
        onSuccess: (data) => {
            router.push(`/room/${data.code}`)
        }
    })

    const joinRoomMutation = api.room.join.useMutation({
        onSuccess: (data) => {
            router.push(`/room/${data.code}`)
        },
        onError: (error) => {
            alert(error.message)
        }
    })

    const handleCreateRoom = () => {
        createRoomMutation.mutate()
    }

    const handleJoinRoom = () => {
        if (joinCode.length !== 4) return
        joinRoomMutation.mutate({ code: joinCode })
    }

    const handleLogout = async () => {
        await authClient.signOut()
        router.push("/login")
    }

    const updateNameMutation = api.user.updateName.useMutation({
        onSuccess: (data) => {
            setIsEditingName(false)
            // Update local display immediately
            setDisplayName(data.name) // Updated to set displayName
        },
        onError: (error) => {
            alert(error.message || "Failed to update name")
        }
    })

    const startEditingName = () => {
        setNewName(displayName || session?.user?.name || "") // Updated to use displayName
        setIsEditingName(true)
    }

    const saveName = () => {
        if (!newName.trim()) return
        updateNameMutation.mutate({ name: newName })
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 font-sans selection:bg-white selection:text-black">
            <div className="w-full max-w-[400px] space-y-8 animate-in fade-in zoom-in-95 duration-500">
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
                                    {displayName || session?.user?.name || "COMMANDER"} {/* Updated to use displayName */}
                                </span>
                                <Pencil className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                            </div>
                        )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="text-zinc-500 hover:text-white hover:bg-zinc-900">
                        <LogOut className="w-4 h-4" />
                    </Button>
                </div>

                <Card className="border-border bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="text-center pb-2 pt-8">
                        <CardTitle className="font-pixel text-xl tracking-tight uppercase">Mission Selection</CardTitle>
                        <CardDescription className="text-zinc-500">Choose your protocol</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                        <div className="space-y-4">
                            <Button
                                onClick={handleCreateRoom}
                                disabled={createRoomMutation.isPending}
                                className="w-full h-16 bg-white text-black hover:bg-zinc-200 font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Rocket className="w-5 h-5 mr-3" />
                                Initialize New Mission
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-zinc-800" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                                <span className="bg-card px-2 text-zinc-600">Or join existing squad</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                    maxLength={4}
                                    className="flex-1 h-14 text-center text-2xl font-mono tracking-[0.5em] rounded-xl border border-zinc-800 bg-zinc-900/50 text-white uppercase placeholder:text-zinc-800 focus:border-white focus:ring-0 outline-none transition-all"
                                    placeholder="CODE"
                                />
                                <Button
                                    onClick={handleJoinRoom}
                                    disabled={joinCode.length !== 4 || joinRoomMutation.isPending}
                                    className="h-14 w-14 rounded-xl bg-zinc-800 text-white hover:bg-white hover:text-black border border-zinc-700 hover:border-white transition-all"
                                >
                                    <ArrowRight className="w-6 h-6" />
                                </Button>
                            </div>
                            <p className="text-[10px] text-center text-zinc-600 font-mono uppercase">
                                Awaiting 4-digit encryption key
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-[10px] text-zinc-500 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        SYSTEMS ONLINE
                    </div>
                </div>
            </div>
        </div>
    )
}
