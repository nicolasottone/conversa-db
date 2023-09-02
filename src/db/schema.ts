import { json, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const table = pgTable('conversa_db', {
  id: serial('id').primaryKey(),
  filename: text('file_name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  data: json('data'),
})
