# LogicCore

LogicCore is a pnpm workspace for experimenting with generated worlds backed by
SpacetimeDB. The repository contains a Next.js application, typed SpacetimeDB
bindings, a tRPC API layer, and deterministic world generation utilities.

## Workspace layout

```text
apps/
  web/                  Next.js app router application
packages/
  spacetimedb/          Generated SpacetimeDB TypeScript bindings
  trpc/                 tRPC routers and server-side context
  world/                Deterministic world generation utilities
```

## Tech stack

- [pnpm](https://pnpm.io/) workspaces
- [Turbo](https://turbo.build/) task orchestration
- [Next.js](https://nextjs.org/) 16 and React 19
- [tRPC](https://trpc.io/) with TanStack Query
- [SpacetimeDB](https://spacetimedb.com/) for world persistence and live data
- [Ultracite](https://www.ultracite.ai/) for linting and formatting
- [Vitest](https://vitest.dev/) for package tests

## Getting started

Install dependencies:

```bash
pnpm install
```

Copy the example environment file and fill in the SpacetimeDB values:

```bash
cp .env.example .env
```

Required server-side variables:

```env
SPACETIMEDB_HOST=
SPACETIMEDB_DB_NAME=
```

Optional client-side variables override the browser connection defaults used by
the web app:

```env
NEXT_PUBLIC_SPACETIMEDB_HOST=
NEXT_PUBLIC_SPACETIMEDB_DB_NAME=
```

Start the development servers:

```bash
pnpm dev
```

The web app runs from `apps/web` and is available at
[http://localhost:3000](http://localhost:3000) by default.

## Common commands

Run these commands from the repository root:

```bash
pnpm dev        # Start workspace development tasks
pnpm build      # Build the workspace
pnpm test       # Run package tests
pnpm check      # Check formatting and lint rules with Ultracite
pnpm fix        # Auto-fix formatting and lint issues with Ultracite
pnpm generate   # Regenerate SpacetimeDB bindings
```

## Application routes

- `/worlds` lists worlds from SpacetimeDB.
- `/worlds/[slug]` is the world detail route.
- `/admin/world/generate` provides a form for creating a world from a numeric
  seed.

## Packages

### `@logiccore/world`

Provides deterministic world generation. The exported `generateWorld` function
builds chunk data from a seed, world size, and chunk size, including biome,
geology, richness, ore modifiers, and generated region names.

### `@logiccore/spacetimedb`

Contains generated TypeScript bindings for the SpacetimeDB module. Regenerate
these files with:

```bash
pnpm generate
```

### `@logiccore/trpc`

Defines the tRPC API surface used by the web app. Current world operations
include listing worlds, adding a world by seed, and deleting a world by id.

## Code quality

This repository uses Ultracite for formatting and linting:

```bash
pnpm check
pnpm fix
```

Run `pnpm check` before opening a pull request.
