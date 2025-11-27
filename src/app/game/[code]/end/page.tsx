"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket, Skull, Trophy, RotateCcw, Home, AlertTriangle } from "lucide-react"
import { useState } from "react"

// Mock Data Types
type GameResult = "YOU_WON" | "OTHER_WON" | "NO_WINNER"

// Mock Data Generators
const GET_MOCK_RESULTS = (scenario: GameResult) => {
    const baseStandings = [
        { rank: 1, name: "Commander (You)", status: "ESCAPED", position: 6, isSelf: true },
        { rank: 2, name: "Officer Ripley", status: "SUFFOCATED", position: 5, isSelf: false },
        { rank: 3, name: "Cadet Jenkins", status: "DRIFTING", position: 0, isSelf: false },
    ]

    switch (scenario) {
        case "YOU_WON":
            return {
                winner: { name: "Commander (You)", isSelf: true },
                standings: baseStandings
            }
        case "OTHER_WON":
            return {
                winner: { name: "Officer Ripley", isSelf: false },
                standings: [
                    { rank: 1, name: "Officer Ripley", status: "ESCAPED", position: 6, isSelf: false },
                    { rank: 2, name: "Commander (You)", status: "SUFFOCATED", position: 4, isSelf: true },
                    { rank: 3, name: "Cadet Jenkins", status: "DRIFTING", position: 0, isSelf: false },
                ]
            }
        case "NO_WINNER":
            return {
                winner: null,
                standings: [
                    { rank: 1, name: "Officer Ripley", status: "SUFFOCATED", position: 5, isSelf: false },
                    { rank: 2, name: "Commander (You)", status: "FROZEN", position: 3, isSelf: true },
                    { rank: 3, name: "Cadet Jenkins", status: "DRIFTING", position: 0, isSelf: false },
                ]
            }
    }
}

export default function GameEndPage() {
    const params = useParams()
    const code = params.code as string
    const router = useRouter()

    // Debug State for Previewing Scenarios
    const [scenario, setScenario] = useState<GameResult>("YOU_WON")
    const results = GET_MOCK_RESULTS(scenario)

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-sans selection:bg-white selection:text-black relative">

            {/* Debug Controls (Temporary) */}
            <div className="absolute top-4 right-4 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setScenario("YOU_WON")} className="text-xs h-7">You Win</Button>
                <Button size="sm" variant="outline" onClick={() => setScenario("OTHER_WON")} className="text-xs h-7">Other Win</Button>
                <Button size="sm" variant="outline" onClick={() => setScenario("NO_WINNER")} className="text-xs h-7">No Winner</Button>
            </div>

            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-700">

                {/* Header Section */}
                <div className="text-center space-y-2">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full border mb-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] ${!results.winner
                            ? "bg-red-500/10 border-red-500/50 shadow-red-900/20"
                            : results.winner.isSelf
                                ? "bg-green-500/10 border-green-500/50 shadow-green-900/20"
                                : "bg-yellow-500/10 border-yellow-500/50 shadow-yellow-900/20"
                        }`}>
                        {!results.winner ? (
                            <Skull className="w-8 h-8 text-red-500" />
                        ) : results.winner.isSelf ? (
                            <Rocket className="w-8 h-8 text-green-500" />
                        ) : (
                            <Trophy className="w-8 h-8 text-yellow-500" />
                        )}
                    </div>

                    <h1 className="font-pixel text-3xl text-white tracking-tight">
                        {!results.winner ? "MISSION FAILED" : "MISSION COMPLETE"}
                    </h1>
                    <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
                        Protocol {code} Terminated
                    </p>
                </div>

                {/* Main Result Card */}
                <Card className={`bg-zinc-900/50 border-zinc-800 overflow-hidden relative ${!results.winner ? "border-red-900/30" : ""
                    }`}>
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-transparent opacity-50 ${!results.winner
                            ? "via-red-500"
                            : results.winner.isSelf
                                ? "via-green-500"
                                : "via-yellow-500"
                        }`} />

                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-zinc-400 text-sm font-normal uppercase tracking-widest">
                            {!results.winner ? "Status Report" : "Survivor"}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="text-center pb-8">
                        {!results.winner ? (
                            <>
                                <div className="text-2xl font-bold text-red-500 mb-1">
                                    ALL CREW LOST
                                </div>
                                <div className="text-zinc-500 text-xs font-pixel">
                                    NO SURVIVORS DETECTED
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-2xl font-bold text-white mb-1">
                                    {results.winner.name}
                                </div>
                                <div className={`text-xs font-pixel animate-pulse ${results.winner.isSelf ? "text-green-500" : "text-yellow-500"
                                    }`}>
                                    {results.winner.isSelf ? "YOU WON" : "WON THE GAME"}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Standings */}
                <div className="space-y-3">
                    <div className="text-xs font-mono text-zinc-600 uppercase tracking-widest px-2">Final Status Report</div>
                    {results.standings.map((player) => (
                        <div
                            key={player.rank}
                            className={`flex items-center justify-between p-4 rounded-lg border ${player.isSelf ? 'bg-zinc-800/50 border-zinc-700' : 'bg-zinc-900/30 border-zinc-800'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-6 h-6 rounded flex items-center justify-center font-pixel text-xs ${player.rank === 1 && results.winner
                                        ? 'bg-yellow-500 text-black'
                                        : 'bg-zinc-800 text-zinc-500'
                                    }`}>
                                    {player.rank}
                                </div>
                                <div>
                                    <div className={`text-sm font-bold ${player.isSelf ? 'text-white' : 'text-zinc-400'}`}>
                                        {player.name}
                                    </div>
                                    <div className="text-[10px] text-zinc-500 font-mono">
                                        Last Known Pos: {player.position}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {player.status === "ESCAPED" ? (
                                    <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                                        ESCAPED <Rocket className="w-3 h-3" />
                                    </span>
                                ) : (
                                    <span className="text-xs font-bold text-zinc-600 flex items-center gap-1">
                                        {player.status} <Skull className="w-3 h-3" />
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <Link href="/lobby" className="w-full">
                        <Button variant="outline" className="w-full h-14 border-zinc-700 text-zinc-400 hover:bg-zinc-900 hover:text-white hover:border-zinc-500">
                            <Home className="w-4 h-4 mr-2" />
                            Lobby
                        </Button>
                    </Link>
                    <Button className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Play Again
                    </Button>
                </div>

            </div>
        </div>
    )
}
