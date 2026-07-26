import argon2 from "argon2";
import { drizzle } from "drizzle-orm/node-postgres/driver";
import { env } from "../src/config/env";
import { eventParticipants, events, relations, users } from "../src/db/schema";

const db = drizzle(env.DATABASE_URL, { relations });

async function seed() {
  console.log("Seeding database...");

  const insertedUsers = await db
    .insert(users)
    .values([
      {
        email: "user1@mail.com",
        passwordHash: await argon2.hash("user1@mail.com"),
        name: "user1",
      },
      {
        email: "user2@mail.com",
        passwordHash: await argon2.hash("user2@mail.com"),
        name: "user2",
      },
    ])
    .onConflictDoNothing()
    .returning();

  const [user1, user2] = await Promise.all([
    db.query.users.findFirst({ where: { email: "user1@mail.com" } }),
    db.query.users.findFirst({ where: { email: "user2@mail.com" } }),
  ]);

  if (!user1 || !user2) {
    console.error("Failed to find or create users");
    process.exit(1);
  }

  const insertedEvents = await db
    .insert(events)
    .values([
      {
        title: "React Meetup Moscow",
        description: "Встреча посвящённая React 19 и новым возможностям серверных компонентов.",
        capacity: 50,
        address: "Москва, ул. Тверская, 1",
        startsAt: new Date("2026-08-15T18:00:00+03:00"),
        ownerId: user1.id,
      },
      {
        title: "TypeScript Workshop",
        description: "Практический воркшоп по продвинутым типам TypeScript и шаблонным литералам.",
        capacity: 30,
        address: "Москва, ул. Арбат, 10",
        startsAt: new Date("2026-08-20T14:00:00+03:00"),
        ownerId: user2.id,
      },
      {
        title: "DevOps Day",
        description: "День посвящённый CI/CD, Docker, Kubernetes и автоматизации инфраструктуры.",
        capacity: 100,
        address: "Москва, Ленинградский пр-т, 80",
        startsAt: new Date("2026-09-01T10:00:00+03:00"),
        ownerId: user1.id,
      },
      {
        title: "AI/ML Meetup",
        description: "Обсуждаем последние новости в области ИИ и машинного обучения.",
        capacity: 75,
        address: "Москва, ул. Ленинская Слобода, 26",
        startsAt: new Date("2026-09-10T19:00:00+03:00"),
        ownerId: user1.id,
      },
      {
        title: "Hackathon: Smart City",
        description: "Хакатон по созданию решений для умного города. Призы от спонсоров!",
        capacity: 200,
        address: "Москва, Кутузовский пр-т, 36",
        startsAt: new Date("2026-09-20T09:00:00+03:00"),
        ownerId: user2.id,
      },
    ])
    .returning();

  if (insertedEvents.length > 0) {
    const [reactMeetup] = insertedEvents;

    await db.insert(eventParticipants).values([
      { eventId: reactMeetup.id, userId: user2.id },
      { eventId: reactMeetup.id, userId: user1.id },
    ]);
  }

  console.log(`Created ${insertedUsers.length} users`);
  console.log(`Created ${insertedEvents.length} events`);
  console.log("Seeding completed!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
