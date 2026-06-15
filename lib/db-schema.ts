import { pgTable, text, uuid, timestamp, decimal, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const propertyStatusEnum = pgEnum('property_status', ['available', 'sold']);
export const serviceTypeEnum = pgEnum('service_type', ['survey', 'plot_booking', 'mutation_forms']);
export const leadStatusEnum = pgEnum('lead_status', ['new', 'contacted']);

// Properties table
export const properties = pgTable('properties', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  location: text('location').notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  imageUrls: text('image_urls').array().default([]),
  description: text('description').default(''),
  status: propertyStatusEnum('status').notNull().default('available'),
  amenities: text('amenities').array().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Leads table
export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  serviceType: serviceTypeEnum('service_type').notNull(),
  status: leadStatusEnum('status').notNull().default('new'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
