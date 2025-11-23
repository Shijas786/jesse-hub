# Vercel Environment Variables Setup

Add these environment variables in your Vercel project settings:

## Required Variables

1. **NEXT_PUBLIC_JESSE_TOKEN_ADDRESS**
   - Value: `0x50f88fe97f72cd3e75b9eb4f747f59bceba80d59`
   - This is the Jesse token contract address on Base

2. **COVALENT_KEY** (or COVALENT_API_KEY as fallback)
   - Value: Your Covalent API key (e.g., `cqt_rQGWXhx8dr9YwfBmjMhKjTCR8BvC`)
   - Used for fetching token balances, transfers, and pricing data
   - **IMPORTANT:** Use `COVALENT_KEY` as the primary name in Vercel

3. **NEYNAR_API_KEY**
   - Value: Your Neynar API key
   - Used for fetching Farcaster profiles linked to wallet addresses

4. **NEXT_PUBLIC_JESSE_GM_CONTRACT_ADDRESS**
   - Value: Your deployed JesseGM contract address
   - Used for GM streak tracking

5. **NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID**
   - Value: Your WalletConnect Cloud project ID
   - Get one at https://cloud.reown.com

6. **NEXT_PUBLIC_JESSE_CHAIN_ID** (optional)
   - Value: `8453` (Base mainnet)
   - Defaults to 8453 if not set

## How to Add in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable above
4. Make sure to select **Production**, **Preview**, and **Development** environments
5. Redeploy your project

## Verify Setup

After adding the variables, check:
- `/api/holders` should return holder data
- `/api/leaderboards/gm` should return GM streak leaderboard
- Home page should show token stats

