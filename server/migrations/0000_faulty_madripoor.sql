CREATE TABLE "app-tourbit"."tourbit_directory" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "app-tourbit"."tourbit_directory_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"key" varchar(255) NOT NULL,
	"parentKey" varchar(255),
	"type" varchar(20) DEFAULT 'folder' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tourbit_directory_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "app-tourbit"."tourbit" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"schemaJSON" text DEFAULT '{}' NOT NULL
);
