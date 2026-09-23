CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" varchar(50) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
