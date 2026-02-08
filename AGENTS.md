# Agent Notes (Tauri + React + TS)

This repo is a Tauri v2 desktop app (Vite + React + TypeScript frontend, Rust backend).
- Frontend: `src/` (React 19 + Vite)
- Backend: `src-tauri/` (Tauri v2)
- Package manager: Bun (`bun.lock`)
- Lint/format: Biome (`biome.json`)

## Repo Layout
- `src/main.tsx`: app bootstrap
- `src/App.tsx`: app root component
- `src/components/ui/`: UI primitives (shadcn-style; lowercase filenames)
- `src/lib/utils.ts`: shared helpers (`cn()` for Tailwind)
- `src-tauri/src/lib.rs`: Tauri builder + commands
- `src-tauri/src/main.rs`: binary entrypoint
- `src-tauri/tauri.conf.json`: dev/build wiring (`beforeDevCommand`, `beforeBuildCommand`)

## Commands (from repo root)

## Workflow Requirements
- After completing a task (before handing off), run `bun run type-check` and `bunx biome check`. 
### Install
```bash
bun install
```

### Dev
```bash
# Vite only
bun run dev

# Desktop (runs Vite per tauri.conf.json)
bun run tauri dev

# Tauri environment/debug info
bun run tauri info
```
Notes: Vite is pinned to port `1420` and Tauri HMR uses `1421` (see `vite.config.ts`).

### Build / Bundle
```bash
# frontend (runs tsc then vite build)
bun run build

# desktop bundle (runs bun run build first)
bun run tauri build

# preview built frontend
bun run preview
```

### Lint / Format (Biome)
```bash
# check only (no writes)
bunx biome check

# fix (writes)
bun run lint:fix  # == bunx biome check --write

# single file
bunx biome check src/App.tsx
bunx biome check --write src/App.tsx
```

### TypeScript (explicit typecheck)
```bash
bun run type-check

# equivalent
bunx tsc -p tsconfig.json --noEmit
```

### Rust (fmt / clippy / tests)
```bash
cargo fmt --manifest-path src-tauri/Cargo.toml
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings
cargo test --manifest-path src-tauri/Cargo.toml
```

#### Run A Single Rust Test
```bash
# substring match
cargo test --manifest-path src-tauri/Cargo.toml test_name_substring

# exact module path
cargo test --manifest-path src-tauri/Cargo.toml module::submodule::test_name

# show stdout/stderr
cargo test --manifest-path src-tauri/Cargo.toml test_name_substring -- --nocapture
```

### JS/TS Tests
No JS/TS test runner is configured (no `vitest/jest/playwright` config found).

## Project Conventions
- Prefer `@/` alias for intra-app imports; avoid deep `../../..` when possible.
- JSON imports are enabled in TS (`resolveJsonModule: true`); keep them lightweight.
- Keep UI primitives generic/reusable; app-specific UI belongs outside `src/components/ui/`.

## Git Hygiene
- Don’t commit secrets (no `.env` files are present today).
- Don’t hand-edit lockfiles; use Bun (`bun add`, `bun remove`, `bun install`).

## Code Style Guidelines

### General
- Let Biome handle formatting/import organization; avoid manual formatting.
- Keep diffs small; avoid broad refactors unless requested.
- Keep files ASCII unless the file already uses Unicode.

### Formatting (enforced by Biome)
- Indent: 2 spaces; quotes: single; semicolons: `asNeeded`.
- Prefer `const`; prefer `import type` for types.
- Use `// biome-ignore ...` sparingly and only with a reason.

### Imports
- Prefer alias imports via `@/*` for app code (`tsconfig.json`, `vite.config.ts`).
- Keep imports grouped (Biome will largely enforce): `node:*` -> external -> `@/` -> relative.
- Type-only imports:
```ts
import { type Foo } from 'pkg'
```

### TypeScript / React
- `strict: true` is on; avoid `any` (use `unknown` + narrowing).
- Prefer function components (PascalCase); keep components small and focused.
- For DOM wrapper props, prefer `React.ComponentProps<'button'>`-style typing.
- For variant-based components, use CVA (`class-variance-authority`) + `VariantProps`.

### Naming
- TS: `camelCase` values/functions, `PascalCase` components/types.
- UI primitive filenames are lowercase (e.g. `src/components/ui/button.tsx`).
- Rust: `snake_case` modules/functions, `UpperCamelCase` types.

### Error Handling
- Frontend: handle async errors from Tauri APIs with `try/catch`; don’t swallow rejections.
- Rust/Tauri commands: return `Result<_, _>` when failure is possible; avoid `unwrap()`.

### CSS / Tailwind
- Tailwind v4 is driven by `src/index.css` (`@import "tailwindcss"`).
- Use `cn()` from `src/lib/utils.ts` to merge conditional classes.

## Tauri Notes
- Keep `#[tauri::command]` functions thin; push logic into plain Rust functions/modules.
- Be mindful of Windows behavior; bundling target is `nsis` (`src-tauri/tauri.conf.json`).
