import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Rocket, Skull, Zap, Wind, Shield } from "lucide-react"

export default function RulesPage() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-8 font-sans selection:bg-white selection:text-black">
            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link href="/">
                        <Button variant="ghost" className="text-zinc-500 hover:text-white pl-0 hover:bg-transparent">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Base
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Rocket className="w-5 h-5 text-white" />
                        <span className="font-pixel text-lg tracking-tight">MISSION PROTOCOLS</span>
                    </div>
                </div>

                {/* Main Title */}
                <div className="text-center space-y-4 py-8">
                    <h1 className="font-pixel text-3xl md:text-4xl leading-tight">
                        HOW TO SURVIVE SPACE
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-xl mx-auto">
                        You are stranded in space. Oxygen is leaking. The ship is just out of reach.
                        And your "friends" are trying to kill you.
                    </p>
                </div>

                {/* Goal Section */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 font-pixel text-xl">
                            <Rocket className="w-6 h-6 text-green-500" />
                            THE GOAL
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-zinc-300">
                        <p>
                            Be the <strong>first astronaut</strong> to reach the Ship (Position 6) and have enough Oxygen to survive.
                        </p>
                        <p className="text-sm text-zinc-400 border-l-2 border-zinc-700 pl-3">
                            <strong>Note:</strong> The path to the ship (Positions 0-5) is paved with <strong>Space Cards</strong>. You must traverse these dangerous sectors to reach safety.
                        </p>
                    </CardContent>
                </Card>

                {/* Turn Overview */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 font-pixel text-xl">
                            <Zap className="w-6 h-6 text-yellow-500" />
                            YOUR TURN
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 text-zinc-300">
                        <div className="space-y-2">
                            <h3 className="font-bold text-white">1. Draw Phase</h3>
                            <p>Draw 1 card from the Game Deck into your hand.</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-white">2. Action Phase (Optional)</h3>
                            <p>Play any number of Action cards from your hand. Use Laser Blasts to stun opponents, Shields to protect yourself, or special gadgets to gain an advantage.</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-white">3. Move Phase (Required)</h3>
                            <p>You MUST choose one:</p>
                            <ul className="list-disc list-inside pl-4 space-y-1 text-zinc-400">
                                <li><strong>Breathe:</strong> Stay in place. Cost: <span className="text-blue-400">1 Oxygen</span>.</li>
                                <li><strong>Travel:</strong> Move forward 1 space. Cost: <span className="text-blue-400">2 Oxygen</span>.</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-white">4. Space Phase</h3>
                            <p>If you moved, draw a Space Card. Good luck. Most of space is empty... or deadly.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Card Types */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 font-pixel text-lg">
                                <Wind className="w-5 h-5 text-blue-400" />
                                OXYGEN
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-zinc-400 text-sm">
                            Your life force. If it hits zero, you die. Use Oxygen cards to replenish your supply.
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 font-pixel text-lg">
                                <Zap className="w-5 h-5 text-red-500" />
                                WEAPONS
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-zinc-400 text-sm">
                            <strong>Laser Blast:</strong> Knock an opponent back 1 space. If they have no Shield, they move back.
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 font-pixel text-lg">
                                <Shield className="w-5 h-5 text-purple-500" />
                                DEFENSE
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-zinc-400 text-sm">
                            <strong>Shield:</strong> Block a Laser Blast or certain Space hazards. Keep these handy.
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 font-pixel text-lg">
                                <Skull className="w-5 h-5 text-zinc-500" />
                                SPACE
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-zinc-400 text-sm">
                            <strong>Wormholes, Asteroids, Aliens:</strong> The void is trying to kill you. Moving forward is dangerous.
                        </CardContent>
                    </Card>
                </div>

                {/* Footer */}
                <div className="text-center pt-8">
                    <Link href="/lobby">
                        <Button className="h-14 px-8 bg-white text-black hover:bg-zinc-200 font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:scale-105">
                            I'M READY TO DIE
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
