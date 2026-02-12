<!-- Copilot / AI agent guidance (reusable Shopify theme template) -->
## Purpose
Short, actionable instructions for AI coding agents working on Shopify themes. Designed to be reused across future Shopify projects.

## Overview
- Project type: Shopify Online Store 2.0 theme using Liquid templates + static ES modules in `assets/`.
- Key folders: `layout/`, `templates/`, `sections/`, `blocks/`, `snippets/` (Liquid), `assets/` (browser ES modules), `locales/` (translations).

## Core conventions (must-follow)
- CLI: This project uses **Shopify CLI v2**. Local preview command: `shopify theme dev` (use this to test Liquid + assets locally).
- No bundler: There is no `package.json` or bundler. Add JS as files under `assets/` and expose them via the importmap in `snippets/scripts.liquid` using `{{ 'file.js' | asset_url }}` (see `snippets/scripts.liquid`).
- Import aliases: Use `@theme/*` aliases in code and map them in `snippets/scripts.liquid` importmap. When adding assets, update that importmap to avoid broken imports.
- Naming: Web components follow `*-component` tag names and are defined with `customElements.define`. Files named `component-*.js` usually register custom elements.
- Base component: `assets/component.js` provides `Component` base class — use `ref` attributes and follow its `refs`/`requiredRefs` patterns.
- Events: Use `assets/events.js` (`ThemeEvents`, `CartUpdateEvent`, etc.) for cross-component communication. Prefer dispatching those events instead of ad-hoc DOM messaging.

## Liquid & section patterns
- Schema-driven settings: Blocks/sections declare a JSON `schema` at the bottom. Avoid changing `schema` keys lightly — they affect the Shopify Editor UI.
- Shared CSS variables: Use snippets like `snippets/size-style.liquid`, `snippets/spacing-style.liquid`, `snippets/border-override.liquid` to expose size/spacing CSS variables instead of inlining many style rules.
- Images: Use `image_url` + `image_tag` with `widths` and `sizes` for responsive images (example: `blocks/image.liquid`).

## Section rendering & AJAX
- Partial updates: Backend responses often include `sections` HTML fragments. Client code uses `section-renderer.js` and `morphSection()` to replace fragments in-place — keep server-side `section` ids stable.
- Theme routes: `Theme.routes` (defined in `snippets/scripts.liquid`) centralizes endpoints like `cart_add_url`, `cart_change_url`, `search_url`. Use these instead of hardcoding routes.

## Developer workflow & runbook
- Local preview (Shopify CLI v2):
```bash
shopify theme dev
```
- Push changes to store (requires authenticated CLI):
```bash
shopify theme push
```
- When adding JS files:
  - Place in `assets/`, then add an alias entry in `snippets/scripts.liquid` importmap.
  - Reference modules via `import { X } from '@theme/your-file'`.
- External libs: Prefer CDN usage for large third-party libs (example: GSAP is included via CDN in `snippets/scripts.liquid`).

## Security & limitations (what I can't do)
- I cannot authenticate with your Shopify admin or push to your store without your local CLI credentials.
- I cannot execute Shopify server-side Liquid rendering — I can only perform static Liquid edits and reasoning. Verify runtime behavior with `shopify theme dev` or in a store preview.
- Features that require live store responses (cart `sections` fragments, product availability from storefront) must be tested against a running theme/store.
- Because there is no build step, avoid introducing code that requires bundlers or NPM-only transforms unless you add a documented build pipeline and update the importmap.

## Best practices for edits (short checklist)
- Update `snippets/scripts.liquid` importmap when adding new top-level `assets/*.js` modules.
- Keep `schema` stable; when changing it, coordinate with the store editor and translations (`locales/*.json`).
- Use `Theme.events` for cross-component messages and `section-renderer` for partial updates.
- Register custom element names ending with `-component` and keep `refs` attributes consistent with `assets/component.js` expectations.

## Files to inspect when onboarding
- `snippets/scripts.liquid` — importmap + `Theme` global (routes/translations).
- `assets/component.js` — base web component implementation and declarative event delegation.
- `assets/events.js` — centralized theme events.
- `assets/section-renderer.js` — morphing / section updates.
- `snippets/size-style.liquid`, `snippets/spacing-style.liquid`, `snippets/border-override.liquid` — styling helpers.
- Representative block: `blocks/image.liquid` (schema + responsive image usage).

## When to ask the maintainer
- Confirm preferred deploy workflow (`shopify theme dev` vs CI-based `theme push`).
- Provide store/test credentials when setting up CI deploy (these must be added to repo secrets; do not add them to code).

If you'd like, I can now:
- Add a short `README.dev.md` with `shopify theme dev` instructions and recommended browser checks, or
- Insert a GitHub Actions template for automated `shopify theme push` (requires secrets).
Tell me which and I’ll apply it.
<!-- Copilot / AI agent guidance for the `bon-enfant-club` Shopify theme -->
## Purpose
Concise guide for AI coding agents working on this Shopify theme. Focus on discoverable, actionable patterns so changes are safe and consistent.

## Big picture
- This repository is a Shopify theme (Liquid + static `assets/*` modules). Primary areas:
  - `layout/`, `templates/`, `sections/`, `blocks/`, `snippets/` — Liquid structure and composition.
  - `assets/` — ES module JavaScript files (custom elements, utilities, events).
  - `locales/` — translation keys referenced via `t:` in Liquid.

## Key conventions & patterns (explicit examples)
- Module importmap: `snippets/scripts.liquid` defines an `importmap` mapping `@theme/*` to files in `assets/`. Edit that file when adding new top-level module aliases.
- JS modules are loaded directly in browser as ES modules (no bundler required here). Example: `assets/component.js` is referenced as `@theme/component` in the importmap.
- Custom elements: JS defines and registers web components named like `cart-items-component`. Files with prefix `component-*.js` usually register elements (`customElements.define`). See `assets/component.js` and `assets/component-cart-items.js`.
- Event system: a central `assets/events.js` exports `ThemeEvents` and Event subclasses (e.g., `CartUpdateEvent`). Other modules listen/dispatch these events for cross-component communication.
- Section rendering / progressive updates: look for `assets/section-renderer.js` and uses of `morphSection` / `sectionRenderer` in JS. Many fetch responses include `sections` HTML fragments which are morphed into the DOM (e.g., `assets/component-cart-items.js` uses `parsedResponseText.sections[this.sectionId]`).
- Liquid block/section settings: blocks and sections define a JSON `schema` (bottom of each block/section file). Code references `block.settings` / `section.settings` and commonly uses `render 'size-style', settings: block.settings` to convert settings to CSS variables. Example: `blocks/image.liquid` + `snippets/size-style.liquid`.
- CSS variables & helper snippets: reusable CSS is produced by snippets such as `snippets/spacing-style.liquid`, `snippets/size-style.liquid`, and `snippets/border-override.liquid`. When changing how spacing/size is exposed, update these snippets and callers.
- Translations: Liquid uses `t:` keys (e.g., `t:settings.image`) and `locales/` contains translation files; prefer adding new keys via `locales/*.json` when adding user-facing strings.

## Data flows and integration points
- Cart & AJAX endpoints: JS uses `Theme.routes` (set inline in `snippets/scripts.liquid`) to call endpoints like `cart_add_url`, `cart_change_url`, `cart_update_url` — responses may contain `sections` for partial replacement.
- Image handling: `blocks/image.liquid` uses `image_url` + `image_tag` filters with responsive `widths` and `sizes` variables — follow this pattern when adding images to sections.
- Asset URLs: use `{{ 'file.js' | asset_url }}` to reference raw assets; importmap uses those URLs to let modules import each other via `@theme/*` aliases.

## Developer workflow notes (discoverable)
- There is no `package.json` or obvious build script in the repo. The theme serves `assets/*.js` directly via the importmap — editing `assets/*.js` is sufficient for runtime changes in the browser (after uploading the theme or using theme dev tooling).
- If you add new module files, also update `snippets/scripts.liquid` importmap and ensure consumers import via the `@theme/*` alias you chose.
- Deployment / preview: repository does not include CI/deploy scripts. Typical flows for this repo are Shopify Theme Editor or `shopify theme dev` / `shopify theme push` (not present in repo). Ask the maintainer for their preferred deploy workflow before automating uploads.

## Safe edit checklist for AI agents
- When editing Liquid templates (`sections/`, `blocks/`, `snippets/`):
  - Keep existing `schema` entries intact unless explicitly changing settings; those drive the editor UI.
  - Prefer `render 'snippet', settings: block.settings` pattern when adding style variables.
- When editing/adding JS modules:
  - Register custom elements with `customElements.define('your-name-component', Class)` and follow existing `-component` naming.
  - Use `Theme.events` and dispatch `CartUpdateEvent` / `VariantUpdateEvent` for cross-component updates.
  - If adding a module file to `assets/`, add an alias entry to `snippets/scripts.liquid` importmap.
- When adding UI text, add corresponding `locales/*.json` key and reference via `t:` in Liquid.

## Files to inspect for context (quick links)
- `snippets/scripts.liquid` — module importmap + Theme global data (routes/translations).
- `assets/component.js` — base Component class; event delegation & ref patterns.
- `assets/events.js` — theme-wide custom event types.
- `assets/section-renderer.js` — section morphing / rendering behaviour.
- `snippets/size-style.liquid`, `snippets/spacing-style.liquid`, `snippets/border-override.liquid` — common styling helpers.
- `blocks/image.liquid` — representative block: schema, responsive image usage, `render` snippet pattern.

## When to ask the maintainer
- Preferred deploy/preview workflow (Shopify CLI, Theme Kit, or manual upload).
- Any custom linting/formatting or pre-commit hooks not checked into the repo.

If anything above is unclear or you'd like more precise run/push commands tailored to a specific developer workflow (Shopify CLI, Theme Kit), tell me which tool you use and I will update this doc accordingly.
