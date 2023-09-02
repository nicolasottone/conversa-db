CREATE TABLE IF NOT EXISTS "conversa_db" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"data" json
);
