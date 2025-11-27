import { createTRPCRouter } from "@/server/api/trpc";
import { roomRouter } from "@/server/api/routers/room";
import { userRouter } from "@/server/api/routers/user";

export const appRouter = createTRPCRouter({
    room: roomRouter,
    user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
