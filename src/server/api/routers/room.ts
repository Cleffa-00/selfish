import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const roomRouter = createTRPCRouter({
    create: protectedProcedure
        .mutation(async ({ ctx }) => {
            const userId = ctx.session.user.id;

            // Auto-leave: Remove user from all other rooms before creating a new one
            await ctx.prisma.player.deleteMany({
                where: { userId: userId }
            });

            // Generate unique 4-letter code
            let code = "";
            let isUnique = false;
            while (!isUnique) {
                code = Math.random().toString(36).substring(2, 6).toUpperCase();
                const existing = await ctx.prisma.room.findUnique({ where: { code } });
                if (!existing) isUnique = true;
            }

            const room = await ctx.prisma.room.create({
                data: {
                    code,
                    hostId: ctx.session.user.id,
                    status: "WAITING",
                    players: {
                        create: {
                            name: ctx.session.user.name || "Host",
                            userId: ctx.session.user.id,
                            isReady: true, // Host is always ready? Or maybe not.
                        }
                    }
                },
            });

            return { roomId: room.id, code: room.code };
        }),

    join: protectedProcedure
        .input(z.object({ code: z.string().length(4) }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const room = await ctx.prisma.room.findUnique({
                where: { code: input.code.toUpperCase() },
                include: { players: true }
            });

            if (!room) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Room not found" });
            }

            if (room.status !== "WAITING") {
                throw new TRPCError({ code: "FORBIDDEN", message: "Game already started" });
            }

            // Check if already joined
            const existingPlayer = room.players.find(p => p.userId === userId);
            if (existingPlayer) {
                return { roomId: room.id, code: room.code };
            }

            // Auto-leave: Remove user from all other rooms before joining this one
            await ctx.prisma.player.deleteMany({
                where: {
                    userId: userId,
                    roomId: { not: room.id } // Don't delete from current room (edge case)
                }
            });

            await ctx.prisma.player.create({
                data: {
                    name: ctx.session.user.name || "Player",
                    userId: ctx.session.user.id,
                    roomId: room.id,
                }
            });

            return { roomId: room.id, code: room.code };
        }),

    getRoomState: protectedProcedure
        .input(z.object({ code: z.string() }))
        .query(async ({ ctx, input }) => {
            const room = await ctx.prisma.room.findUnique({
                where: { code: input.code.toUpperCase() },
                include: { players: true }
            });

            if (!room) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            return room;
        }),

    startGame: protectedProcedure
        .input(z.object({ roomId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const room = await ctx.prisma.room.findUnique({
                where: { id: input.roomId },
                include: { players: true }
            });

            if (!room) throw new TRPCError({ code: "NOT_FOUND" });
            if (room.hostId !== ctx.session.user.id) {
                throw new TRPCError({ code: "FORBIDDEN", message: "Only host can start game" });
            }

            // Update room status
            await ctx.prisma.room.update({
                where: { id: input.roomId },
                data: { status: "PLAYING" }
            });

            // Initialize GameState in DB (optional, if we want persistence)
            // For now, we rely on WebSocket memory state, but good to have a record
            await ctx.prisma.gameState.create({
                data: {
                    roomId: room.id,
                    data: JSON.stringify({}), // Empty initial state, will be populated by WS
                    step: 0
                }
            });

            return true;
        })
});
