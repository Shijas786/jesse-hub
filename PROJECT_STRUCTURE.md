# Jesse Hub Project Structure & Implementation Notes

## 1. High-Level Overview
- **Framework**: Next.js 14 (App Router) with React Server Components where possible.
- **Styling**: TailwindCSS + custom gradients and animations defined in `tailwind.config.ts` and `src/app/globals.css` to achieve the doodles/Base aesthetic.
- **Animation**: Framer Motion components (see `src/components/**`).
- **State/Data**: `@tanstack/react-query` via custom hooks in `src/hooks` for API consumption, with focus on mobile-first UI.
- **Web3/Wagmi**: Wallet interactions handled in `src/components/Providers.tsx` (Reown AppKit + Wagmi config).
- **APIs**: All backend logic lives in `src/app/api/**` (Next.js Route Handlers). GoldRush (Covalent) SDK centralised in `src/lib/goldrush.ts`, legacy helpers in `src/lib/covalent.ts` for holder detail views, plus Neynar + config helpers.

## 2. Directory Map (Key Areas)
| Path | Purpose |
| ---- | ------- |
| `src/app` | Page routes (home, gm, holders, traders, missions, leaderboards) + API routes. |
| `src/app/api` | Serverless routes for holders, traders, missions, leaderboards, debugging. |
| `src/components` | UI atoms/sections: cartoons, buttons, nav, page-specific subsections, shared tiles, charts. |
| `src/hooks` | React Query hooks (e.g. `useHolders`, `useTraderAnalytics`) standardising API access + retry behaviour. |
| `src/lib` | Runtime helpers: GoldRush client, legacy Covalent wrappers, Neynar client, server-side aggregations (`lib/server/*`), config/env access. |
| `src/utils` | Pure helpers for stats (badges, GM streaks, holder behaviour, formatters). |
| `contracts` | `JesseGM.sol` + Hardhat config for the GM contract. |
| `VERCEL_ENV_SETUP.md` | Deployment/env-var checklist for Vercel. |

## 3. Frontend Implementation Summary
- **Layout**: `src/app/layout.tsx` wires global styles, fonts, `<Providers />`, and the floating `BottomNav` component.
- **Home (`src/app/page.tsx`)**: Hero, quick stats, missions preview built from `src/components/home/*` with animated Jesse mascot + stat bubbles.
- **GM Page**: `src/components/gm/*` handles fire streak animations, GM button interactions, leaderboard previews.
- **Holders & Holder Profile**: `src/components/holders/*` render list cards, profile view, stats, badge rows, activity timelines, filters.
- **Traders**: `src/components/traders/*` includes leaderboard tabs, cards for profit/scalpers/losers, detailed trader analytics view.
- **Missions & Leaderboards**: Game-like mission list, XP progress, multiple leaderboard tabs with doodle tabs + animations.
- **Shared Components**: `CartoonButton`, `DoodleCard`, `AnimatedMascot`, `FloatingStickers`, `IdentityPill`, `MetricTile`, `BottomNav`, etc., reused across pages for consistent style.

## 4. Backend & Data Flow
### GoldRush SDK (Primary)
- `src/lib/goldrush.ts`
  - Lazily instantiates `GoldRushClient` with `GOLDRUSH_API_KEY`/`COVALENT_KEY`/`COVALENT_API_KEY`.
  - Provides:
    - `getTokenHolders(tokenAddress, pageNumber, pageSize)` → wraps `BalanceService.getTokenHoldersV2ForTokenAddress`.
    - `getJesseTransfersForAddress(wallet, tokenAddress)` → wraps `getErc20TransfersForWalletAddress` + filters to JESSE contract.
    - `getTokenBalanceForAddress(wallet, tokenAddress)` → wraps `getTokenBalancesForWalletAddress` and returns quote info.

### Server Aggregations
- `src/lib/server/traders.ts`: Uses the above helpers to build `TraderAnalytics` objects (buy/sell quote, realized profit, current value, scalper score). Throws early if `JESSE_TOKEN_ADDRESS` (or `NEXT_PUBLIC_…`) is missing.
- `src/lib/server/holders.ts`: Legacy path still using `src/lib/covalent.ts` for richer analytics (behaviour maps, GM streaks, Farcaster lookups).

### API Routes of Interest
- `/api/holders` (`src/app/api/holders/route.ts`): Returns top holders + aggregate stats using GoldRush helper. Explicit errors if config missing.
- `/api/traders` (`src/app/api/traders/route.ts`): Uses `fetchTraderAnalytics()` to return profit/scalpers/winners/losers slices.
- `/api/leaderboards/traders`: Reuses analytics to build scalper/rekt/whale boards.
- `/api/jesse/*`: Internal helpers for the frontend (top holders, holder detail, traders) – still available for older React Query hooks.
- `/api/holders/[address]` & `/api/traders/[address]`: Detailed analytics driven by legacy Covalent helper (`lib/covalent.ts`) + utility builders.
- `/api/missions`: Requires `export const dynamic = 'force-dynamic'` (already set) to avoid caching issues on Vercel.
- `/api/debug`: Echoes env availability for quick production checks.

### Data Consumers
- Hooks in `src/hooks/*.ts` call the API routes with React Query for caching + retries, mapping results into UI-ready shapes.

## 5. Environment Variables (Vercel)
| Variable | Purpose |
| -------- | ------- |
| `GOLDRUSH_API_KEY` / `COVALENT_KEY` / `COVALENT_API_KEY` | GoldRush SDK auth. Only one required. |
| `JESSE_TOKEN_ADDRESS` **or** `NEXT_PUBLIC_JESSE_TOKEN_ADDRESS` | ERC-20 contract. Backends now fall back to the public var if the server var is missing. |
| `NEXT_PUBLIC_JESSE_GM_CONTRACT_ADDRESS` | For GM streak events. |
| `NEXT_PUBLIC_JESSE_CHAIN_ID` | Default Base chain id (8453). |
| `NEYNAR_API_KEY` | Farcaster profile lookups. |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` (via Reown) | Required for wallet connect (currently missing -> APKT008 log). |

Use `/api/debug` locally or on Vercel to confirm availability. After editing env vars, clear the Vercel build cache before redeploying to avoid stale bundles.

## 6. Typical Failure Modes & Diagnostics
1. **500 from holders/traders routes**
   - Usually missing GoldRush key or token env. Check `/api/debug` and Vercel settings.
   - Inspect server logs: new handlers log `{ error: 'Failed to load ...', message }` with reason.
2. **GoldRush SDK method errors**
   - Ensure we rely on the non-`ByPage` methods (already fixed). If SDK updates, adjust wrappers.
3. **Legacy Covalent helpers**
   - Holder profile routes still use `src/lib/covalent.ts`. Ensure `requireEnv('covalentKey')` resolves (same env var list as above).
4. **Reown AppKit warnings (APKT008)**
   - Set a project ID at https://dashboard.reown.com and provide `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`.
5. **Static/dynamic mismatch**
   - All API routes export `dynamic = 'force-dynamic'` when they call external APIs; double-check if creating new ones.

## 7. Deployment Checklist
1. Ensure env vars are defined in Vercel (matching names exactly).
2. Clear build cache when env names change.
3. Run `npm run build` locally (optionally overriding envs like `JESSE_TOKEN_ADDRESS=0x... npm run build`).
4. Verify `/api/holders`, `/api/traders`, `/api/leaderboards/*` locally or via deployed URL (responses now include detailed error JSON if something fails).

## 8. Recent Implementations
- Complete UI redesign with doodle/Base theme (new shared components, BottomNav, motion effects).
- **FULL migration from legacy Covalent helpers to GoldRush SDK** - All API routes now use `src/lib/goldrush.ts` exclusively:
  - `/api/missions` → uses `getGmEvents()` and `getHolderTransfers()` from GoldRush
  - `/api/leaderboards/gm` → uses `getGmEvents()` from GoldRush
  - `/api/traders/[address]` → uses `getHolderTransfers()` from GoldRush
  - `/api/holders/[address]` → uses `getTokenHoldersLegacy()`, `getHolderTransfers()`, `getGmEvents()`, `getAddressTokenBalance()` from GoldRush
- Trader analytics refactor (`lib/server/traders.ts`) feeding `/api/traders` + leaderboards.
- Env handling improvements so backend reads either `JESSE_TOKEN_ADDRESS` or the public variant.
- Enhanced `/api/debug` route showing all required env vars with warnings summary.
- Improved React Query retry logic (no retries on 4xx errors, single retry for 5xx).
- Added `ApiErrorFallback` component for graceful error UI.

## 9. GoldRush Helpers (Complete List)
All helpers in `src/lib/goldrush.ts`:
- `getTokenHolders(tokenAddress, pageNumber, pageSize)` → New format for `/api/holders`
- `getTokenHoldersLegacy(pageSize)` → Legacy format for holder detail routes
- `getHolderTransfers(walletAddress, tokenAddress, pageSize)` → Legacy TransferItem[] format
- `getJesseTransfersForAddress(walletAddress, tokenAddress, pageSize)` → Raw GoldRush format for trader analytics
- `getTokenBalanceForAddress(walletAddress, tokenAddress)` → Raw format
- `getAddressTokenBalance(walletAddress, tokenAddress)` → Legacy format for holder detail
- `getGmEvents(gmContractAddress, pageSize)` → GM event logs from contract

**All routes now use GoldRush SDK exclusively. Legacy `src/lib/covalent.ts` is deprecated but kept for reference.**

Use this document as the canonical map when triaging "real problems" (API 500s, env drift, etc.).
