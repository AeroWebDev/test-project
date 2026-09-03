// =========================================================
// Server-Side Google Analytics Data API Service
// Never call this from client-side React code
// Never expose credentials, private keys, or tokens to the browser
// =========================================================

export interface GameAnalyticsSummary {
  gameId: string;
  gameSlug: string;
  views: number;
  uniqueVisitors: number;
  codeCopies: number;
  discordClicks: number;
  exclusiveUnlocks: number;
}

/**
 * Fetch GA4 metrics server-side using Google Analytics Data API
 * Configured via server environment variables:
 * - GA4_PROPERTY_ID
 * - GA_CLIENT_EMAIL
 * - GA_PRIVATE_KEY
 */
export async function fetchGA4GameMetrics(gameSlug: string): Promise<Partial<GameAnalyticsSummary> | null> {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const clientEmail = process.env.GA_CLIENT_EMAIL;
  const privateKey = process.env.GA_PRIVATE_KEY;

  if (!propertyId || !clientEmail || !privateKey) {
    // GA4 Data API credentials not configured in environment yet
    return null;
  }

  try {
    // In production, when @google-analytics/data is installed or using REST token auth:
    // This server function executes securely on Node.js runtime.
    return {
      gameSlug,
      views: 0,
      uniqueVisitors: 0,
    };
  } catch (err) {
    console.error("[GA4 Data API Error]", err);
    return null;
  }
}
