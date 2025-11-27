import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CardData } from "@/lib/data"
import { LucideIcon } from "lucide-react"

export function FrontendGameCard({ data, icon: Icon }: { data: CardData; icon: LucideIcon }) {
    return (
        <Card className={`overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg h-full flex flex-col ${data.type === 'space' ? 'bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800' : 'bg-gradient-to-br from-blue-100 to-blue-300 dark:from-blue-900 dark:to-blue-800'}`}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="font-pixel text-sm leading-tight max-w-[80%]">{data.name}</CardTitle>
                <span className="text-xs font-semibold bg-background/50 px-2 py-1 rounded-full">x{data.quantity}</span>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <div className="aspect-square relative mb-4 bg-background/20 rounded-lg flex items-center justify-center overflow-hidden group">
                    <div className="relative z-10 p-4 transition-transform duration-300 group-hover:scale-110">
                        <Icon size={64} strokeWidth={1.5} className="text-foreground/80 drop-shadow-md" />
                    </div>
                    {/* Decorative background elements to give it a "space" feel */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/50 to-transparent dark:from-white/10" />
                </div>
                <p className="text-sm text-muted-foreground mt-auto">{data.description}</p>
            </CardContent>
        </Card>
    )
}
