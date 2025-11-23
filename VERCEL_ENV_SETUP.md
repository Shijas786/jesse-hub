# Vercel Environment Variables Setup

**CRITICAL:** These are the EXACT environment variable names your backend code expects. Use these exact names in Vercel.

## Required Environment Variables

Go to your Vercel project → **Settings** → **Environment Variables** and add:

### Backend Variables (Server-side only)

1. **COVALENT_KEY** (or COVALENT_API_KEY as fallback)
   - Value: Your Covalent API key (e.g., `cqt_rQGWXhx8dr9YwfBmjMhKjTCR8BvC`)
   - Used by API routes to fetch token data
   - **DO NOT use NEXT_PUBLIC_ prefix** - this is server-side only

2. **NEYNAR_API_KEY**
   - Value: Your Neynar API key
   - Used by API routes to fetch Farcaster profiles
   - **DO NOT use NEXT_PUBLIC_ prefix** - this is server-side only

### Frontend Variables (Client-side accessible)

3. **NEXT_PUBLIC_JESSE_TOKEN_ADDRESS**
   - Value: `0x50f88fe97f72cd3e75b9eb4f747f59bceba80d59`
   - This is the Jesse token contract address on Base
   - **MUST have NEXT_PUBLIC_ prefix** - used in client components

4. **NEXT_PUBLIC_JESSE_GM_CONTRACT_ADDRESS**
   - Value: Your deployed JesseGM contract address
   - Used for GM streak tracking
   - **MUST have NEXT_PUBLIC_ prefix** - used in client components

5. **NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID**
   - Value: Your WalletConnect Cloud project ID
   - Get one at https://cloud.reown.com
   - **MUST have NEXT_PUBLIC_ prefix** - used in client components

6. **NEXT_PUBLIC_JESSE_CHAIN_ID** (optional)
   - Value: `8453` (Base mainnet)
   - Defaults to 8453 if not set
   - **MUST have NEXT_PUBLIC_ prefix** - used in client components

## Summary

**Backend (API routes):**
- `COVALENT_KEY` (or `COVALENT_API_KEY`)
- `NEYNAR_API_KEY`

**Frontend (client components):**
- `NEXT_PUBLIC_JESSE_TOKEN_ADDRESS`
- `NEXT_PUBLIC_JESSE_GM_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
- `NEXT_PUBLIC_JESSE_CHAIN_ID` (optional)

## How to Add in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable above with the EXACT names shown
4. Make sure to select **Production**, **Preview**, and **Development** environments
5. **Clear build cache** and redeploy

## Verify Setup

After adding the variables and redeploying:

1. Check Vercel Function logs when hitting `/api/holders`
2. Should see successful API calls, not "Missing environment variable" errors
3. `/api/holders` should return 200 with JSON data
4. `/api/leaderboards/gm` should return 200 with JSON data
5. Home page should show token stats

## Troubleshooting

If you see "Missing environment variable" errors:

1. **Double-check the variable names** - they must match exactly (case-sensitive)
2. **Verify they're set for the correct environment** (Production/Preview/Development)
3. **Clear build cache** in Vercel before redeploying
4. **Check Function logs** in Vercel to see the exact error message
