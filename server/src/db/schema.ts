import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  integer,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";

import { defineRelations } from "drizzle-orm";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const events = pgTable(
  "events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),
    capacity: integer("capacity").notNull(),
    address: varchar("address", { length: 255 }).notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [check("capacity_check", sql`"capacity" > 0`)], // Если пользователь попытается вставить событие с capacity <= 0, база данных отклонит запись
);

export const eventParticipants = pgTable(
  "event_participants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("UQ_EVENT_PARTICIPANTS_EVENT_USER").on(t.eventId, t.userId), // чтобы один пользователь не мог записаться на одно событие дважды
  ],
);

export const relations = defineRelations(
  { users, events, eventParticipants },
  (r) => ({
    users: {
      // Один пользователь → много событий
      events: r.many.events({
        from: r.users.id,
        to: r.events.ownerId,
      }),
      // Один пользователь → много участий в событиях
      eventParticipations: r.many.eventParticipants({
        from: r.users.id,
        to: r.eventParticipants.userId,
      }),
    },

    events: {
      // Одно событие → один владелец (user)
      owner: r.one.users({
        from: r.events.ownerId,
        to: r.users.id,
      }),
      // Одно событие → много участников
      participants: r.many.eventParticipants({
        from: r.events.id,
        to: r.eventParticipants.eventId,
      }),
    },

    eventParticipants: {
      // Одна запись участия → один пользователь
      user: r.one.users({
        from: r.eventParticipants.userId,
        to: r.users.id,
      }),
      // Одна запись участия → одно событие
      event: r.one.events({
        from: r.eventParticipants.eventId,
        to: r.events.id,
        optional: false,
      }),
    },
  }),
);
