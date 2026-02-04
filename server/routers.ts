import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { nanoid } from "nanoid";
import { SignJWT } from "jose";
import { ENV } from "./_core/env";

// Middleware para verificar que el usuario sea Admin
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Solo administradores pueden realizar esta acción" });
  }
  return next({ ctx });
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============= USERS MANAGEMENT =============
  users: router({
    list: adminProcedure.query(async () => {
      return await db.getAllUsers();
    }),
    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email().optional(),
          password: z.string().min(6),
          role: z.enum(["admin", "user"]),
        })
      )
      .mutation(async ({ input }) => {
        const openId = `local_${nanoid()}`;
        
        await db.upsertUser({
          openId,
          name: input.name,
          email: input.email,
          loginMethod: "manual",
          role: input.role,
        });
        
        return { success: true, openId, password: input.password };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(1).optional(),
          email: z.string().email().optional(),
          role: z.enum(["admin", "user"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateUser(id, data);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteUser(input.id);
        return { success: true };
      }),
  }),

  // ============= EVENTS =============
  events: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllEvents();
    }),
    upcoming: protectedProcedure.query(async () => {
      return await db.getUpcomingEvents();
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getEventById(input.id);
      }),
    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          date: z.date(),
          showTime: z.string(),
          soundCheckTime: z.string().optional(),
          location: z.string().min(1),
          locationMapUrl: z.string().optional(),
          uniformDescription: z.string().optional(),
          uniformImageUrl: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const id = await db.createEvent(input);
        return { success: true, id };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).optional(),
          date: z.date().optional(),
          showTime: z.string().optional(),
          soundCheckTime: z.string().optional(),
          location: z.string().optional(),
          locationMapUrl: z.string().optional(),
          uniformDescription: z.string().optional(),
          uniformImageUrl: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateEvent(id, data);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteEvent(input.id);
        return { success: true };
      }),
  }),

  // ============= NEWS =============
  news: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllNews();
    }),
    urgent: protectedProcedure.query(async () => {
      return await db.getUrgentNews();
    }),
    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          content: z.string().min(1),
          isUrgent: z.boolean(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const id = await db.createNews({
          ...input,
          isUrgent: input.isUrgent ? 1 : 0,
          createdBy: ctx.user.id,
        });
        return { success: true, id };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).optional(),
          content: z.string().min(1).optional(),
          isUrgent: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, isUrgent, ...rest } = input;
        const data = { ...rest, ...(isUrgent !== undefined ? { isUrgent: isUrgent ? 1 : 0 } : {}) };
        await db.updateNews(id, data);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteNews(input.id);
        return { success: true };
      }),
  }),

  // ============= ATTENDANCES =============
  attendances: router({
    myAttendances: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserAttendances(ctx.user.id);
    }),
    byEvent: protectedProcedure
      .input(z.object({ eventId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAttendancesByEvent(input.eventId);
      }),
    upsert: protectedProcedure
      .input(
        z.object({
          eventId: z.number(),
          status: z.enum(["confirmed", "declined", "pending"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await db.upsertAttendance({
          eventId: input.eventId,
          userId: ctx.user.id,
          status: input.status,
        });
        return { success: true };
      }),
  }),

  // ============= RESOURCES =============
  resources: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllResources();
    }),
    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          type: z.enum(["audio", "document", "video"]),
          url: z.string().url(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const id = await db.createResource({
          ...input,
          createdBy: ctx.user.id,
        });
        return { success: true, id };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).optional(),
          description: z.string().optional(),
          type: z.enum(["audio", "document", "video"]).optional(),
          url: z.string().url().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateResource(id, data);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteResource(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
