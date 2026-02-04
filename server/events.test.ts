import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@ayombe.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createMusicianContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "musician-user",
    email: "musician@ayombe.com",
    name: "Musician User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Events Router", () => {
  it("should allow admin to create event", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.events.create({
      title: "Concierto de Prueba",
      date: new Date("2026-03-15T20:00:00"),
      showTime: "20:00",
      soundCheckTime: "18:00",
      location: "Plaza Central",
      locationMapUrl: "https://maps.google.com/test",
      uniformDescription: "Camisa blanca, pantalón negro",
      notes: "Evento de prueba",
    });

    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
  });

  it("should allow musicians to list events", async () => {
    const ctx = createMusicianContext();
    const caller = appRouter.createCaller(ctx);

    const events = await caller.events.list();
    expect(Array.isArray(events)).toBe(true);
  });

  it("should prevent musicians from creating events", async () => {
    const ctx = createMusicianContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.events.create({
        title: "Unauthorized Event",
        date: new Date(),
        showTime: "20:00",
        location: "Test Location",
      })
    ).rejects.toThrow("Solo administradores pueden realizar esta acción");
  });
});

describe("News Router", () => {
  it("should allow admin to create urgent news", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.news.create({
      title: "Ensayo Cancelado",
      content: "El ensayo de hoy ha sido cancelado por motivos de fuerza mayor",
      isUrgent: true,
    });

    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
  });

  it("should allow musicians to read urgent news", async () => {
    const ctx = createMusicianContext();
    const caller = appRouter.createCaller(ctx);

    const urgentNews = await caller.news.urgent();
    expect(Array.isArray(urgentNews)).toBe(true);
  });

  it("should prevent musicians from creating news", async () => {
    const ctx = createMusicianContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.news.create({
        title: "Unauthorized News",
        content: "This should fail",
        isUrgent: false,
      })
    ).rejects.toThrow("Solo administradores pueden realizar esta acción");
  });
});

describe("Attendances Router", () => {
  it("should allow musicians to confirm attendance", async () => {
    const ctx = createMusicianContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.attendances.upsert({
      eventId: 1,
      status: "confirmed",
    });

    expect(result.success).toBe(true);
  });

  it("should allow musicians to decline attendance", async () => {
    const ctx = createMusicianContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.attendances.upsert({
      eventId: 1,
      status: "declined",
    });

    expect(result.success).toBe(true);
  });
});
