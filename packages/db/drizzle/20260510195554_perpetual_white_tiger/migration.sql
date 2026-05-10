CREATE TABLE `generated_worlds` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`seed` integer,
	`size` integer,
	`chunkSize` integer,
	`chunksWide` integer,
	`chunksHigh` integer
);
--> statement-breakpoint
CREATE TABLE `users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`email` text NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE `world_chunks` (
	`world_id` integer NOT NULL,
	`chunk_x` integer NOT NULL,
	`chunk_y` integer NOT NULL,
	`biome` text NOT NULL,
	`geology` text NOT NULL,
	`richness` real NOT NULL,
	`gold_modifier` real DEFAULT 1 NOT NULL,
	`silver_modifier` real DEFAULT 1 NOT NULL,
	`copper_modifier` real DEFAULT 1 NOT NULL,
	`iron_modifier` real DEFAULT 1 NOT NULL,
	`coal_modifier` real DEFAULT 1 NOT NULL,
	`region_name` text NOT NULL,
	CONSTRAINT `world_chunks_pk` PRIMARY KEY(`world_id`, `chunk_x`, `chunk_y`),
	CONSTRAINT `fk_world_chunks_world_id_generated_worlds_id_fk` FOREIGN KEY (`world_id`) REFERENCES `generated_worlds`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX `world_chunks_world_id_idx` ON `world_chunks` (`world_id`);