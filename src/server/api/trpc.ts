import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth"; // Import Better Auth instance
import { headers } from "next/headers";

const prisma = new PrismaClient();

export const createTRPCContext = async (opts: { headers: Headers }) => {
    const session = await auth.api.getSession({
        headers: opts.headers
    });
    console.log("tRPC Context Session:", session ? "Found User: " + session.user.id : "No Session");
    console.log("Headers:", Object.fromEntries(opts.headers.entries()));

    return {
        prisma,
        session,
        ...opts,
    };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
        ctx: {
            // infers the `session` as non-nullable
            session: { ...ctx.session, user: ctx.session.user },
        },
    });
});
