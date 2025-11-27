"use client"

import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Rocket, User } from "lucide-react"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { data: session, isPending } = authClient.useSession()

    // Auto-redirect if already logged in
    useEffect(() => {
        if (!isPending && session) {
            router.replace("/lobby")
        }
    }, [session, isPending, router])

    const handleEmailLogin = async () => {
        setLoading(true)
        await authClient.signIn.email({
            email,
            password
        }, {
            onSuccess: () => {
                router.push("/lobby")
            },
            onError: (ctx) => {
                alert(ctx.error.message)
                setLoading(false)
            }
        })
    }

    const handleSignUp = async () => {
        setLoading(true)
        await authClient.signUp.email({
            email,
            password,
            name: email.split("@")[0]
        }, {
            onSuccess: () => {
                router.push("/lobby")
            },
            onError: (ctx) => {
                alert(ctx.error.message)
                setLoading(false)
            }
        })
    }

    const handleGuestLogin = async () => {
        setLoading(true)
        console.log("Starting Guest Login...")
        try {
            const res = await authClient.signIn.anonymous()
            console.log("Guest Login Result:", res)
            if (res.error) {
                throw res.error
            }
            console.log("Redirecting to /lobby...")
            router.push("/lobby")
        } catch (err: any) {
            // If user is already signed in anonymously, just redirect
            if (err?.code === 'ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY' || err?.status === 400) {
                console.log("Already anonymous, redirecting...")
                router.push("/lobby")
                return
            }

            console.error("Guest Login Exception:", err)
            alert(err.message || "Failed to login")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans selection:bg-white selection:text-black">
            <div className="w-full max-w-[400px] space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-white text-black rounded-lg flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        <Rocket className="w-6 h-6" />
                    </div>
                    <h1 className="font-pixel text-2xl tracking-tight">MISSION CONTROL</h1>
                    <p className="text-zinc-500 text-sm">Authenticate to access ship systems.</p>
                </div>

                <Card className="border-border bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Identity</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 text-white placeholder:text-zinc-700 focus:border-white focus:ring-0 transition-colors outline-none"
                                    placeholder="astronaut@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Passcode</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 text-white placeholder:text-zinc-700 focus:border-white focus:ring-0 transition-colors outline-none"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="pt-2 flex gap-3">
                                <Button
                                    onClick={handleEmailLogin}
                                    disabled={loading}
                                    className="flex-1 bg-white text-black hover:bg-zinc-200 h-10 font-semibold"
                                >
                                    Login
                                </Button>
                                <Button
                                    onClick={handleSignUp}
                                    disabled={loading}
                                    variant="outline"
                                    className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white h-10"
                                >
                                    Sign Up
                                </Button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-zinc-800" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                                <span className="bg-card px-2 text-zinc-600">Alternative Access</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleGuestLogin}
                            disabled={loading}
                            variant="outline"
                            className="w-full h-12 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition-all group"
                        >
                            <User className="w-4 h-4 mr-2 group-hover:text-white transition-colors" />
                            Guest Access
                        </Button>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-zinc-700 font-mono">
                    SECURE CONNECTION ESTABLISHED
                </p>
            </div>
        </div>
    )
}
