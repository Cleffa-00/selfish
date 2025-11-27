import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CardData } from "@/lib/data"
import Image from "next/image"

export function GameCard({ data, priority = false }: { data: CardData; priority?: boolean }) {
    return (
        <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-zinc-500 h-full flex flex-col bg-card border-border group">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="font-pixel text-xs sm:text-sm leading-tight max-w-[80%] text-foreground/90 group-hover:text-foreground transition-colors">
                    {data.name}
                </CardTitle>
                <span className="text-[10px] font-bold bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full font-mono">
                    x{data.quantity}
                </span>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <div className="aspect-square relative mb-4 bg-black/40 rounded-lg flex items-center justify-center overflow-hidden border border-white/5">
                    {data.image ? (
                        <Image
                            src={data.image}
                            alt={data.name}
                            fill
                            priority={priority}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="object-contain p-4 opacity-90 group-hover:opacity-100 transition-opacity"
                            style={{ imageRendering: 'pixelated' }}
                        />
                    ) : (
                        <div className="w-10 h-10 bg-current opacity-10" />
                    )}
                </div>
                <p className="text-xs text-muted-foreground mt-auto leading-relaxed">
                    {data.description}
                </p>
            </CardContent>
        </Card>
    )
}
