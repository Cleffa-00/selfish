import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/GameCard";
import { SPACE_CARDS, ACTION_CARDS } from "@/lib/data";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-white selection:text-black">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 text-center border-b border-border/40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-background to-background pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="relative z-10 space-y-10 max-w-4xl mx-auto">
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            <h1 className="font-pixel text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl">
              SELFISH
              <span className="block text-xl sm:text-2xl md:text-3xl mt-6 text-zinc-500 font-sans font-light tracking-[0.2em] uppercase">
                Space Edition
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed font-light">
              You are floating in space. Oxygen is running low. <br className="hidden sm:block" />
              The only way home is through the ship... <br className="hidden sm:block" />
              <span className="text-white font-medium">and there's only enough air for one.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <Button className="h-12 px-8 bg-white text-black hover:bg-zinc-200 font-bold text-lg rounded-full transition-all hover:scale-105">
                  Play Now
                </Button>
              </Link>
              <Link href="/rules">
                <Button variant="outline" className="h-12 px-8 border-zinc-700 text-zinc-300 hover:bg-zinc-900 hover:text-white hover:border-white rounded-full transition-all">
                  How to Play
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-6 h-10 border-2 border-zinc-700 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-zinc-500 rounded-full" />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <main className="container mx-auto py-32 px-6 space-y-32">
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-border/40 pb-6">
            <div>
              <h2 className="font-pixel text-2xl md:text-3xl text-white mb-2">Space Cards</h2>
              <p className="text-zinc-500">Hazards and anomalies you'll encounter in the void.</p>
            </div>
            <div className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
              Database: {SPACE_CARDS.length} Entries
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {SPACE_CARDS.map((card, index) => (
              <GameCard key={card.id} data={card} priority={index < 4} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-border/40 pb-6">
            <div>
              <h2 className="font-pixel text-2xl md:text-3xl text-white mb-2">Action Cards</h2>
              <p className="text-zinc-500">Tools and tactics to ensure your survival (at others' expense).</p>
            </div>
            <div className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
              Database: {ACTION_CARDS.length} Entries
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {ACTION_CARDS.map((card) => (
              <GameCard key={card.id} data={card} />
            ))}
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border/40 text-center">
        <p className="text-sm text-zinc-600 font-mono">
          UNOFFICIAL FAN PROJECT • SELFISH: SPACE EDITION
        </p>
      </footer>
    </div>
  );
}
