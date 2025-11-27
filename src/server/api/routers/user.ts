import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
    updateName: protectedProcedure
        .input(z.object({ name: z.string().min(1).max(50) }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            // Update user in database
            const updatedUser = await ctx.prisma.user.update({
                where: { id: userId },
                data: { name: input.name },
            });

            // Also update all Player records for this user (in all rooms)
            // This ensures the name is synced across all active rooms
            await ctx.prisma.player.updateMany({
                where: { userId: userId },
                data: { name: input.name },
            });

            return { success: true, name: updatedUser.name };
        }),
});
