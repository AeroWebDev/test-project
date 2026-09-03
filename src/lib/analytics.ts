// =============================================
// RoBcodes Analytics Layer (GA4 + Internal Telemetry)
// =============================================

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Safely send a Google Analytics 4 event
 */
export function trackGAEvent(eventName: string, params?: Record<string, any>) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  } catch (err) {
    // Fail silently so analytics never break user interactions
    console.debug("[GA4 Track Error]", err);
  }
}

/**
 * Send internal non-blocking beacon to RoBcodes analytics endpoint
 */
async function trackInternalEvent(eventType: string, payload: Record<string, any>) {
  try {
    if (typeof window === "undefined") return;

    const data = JSON.stringify({
      eventType,
      ...payload,
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
    });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/track", data);
    } else {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
        keepalive: true,
      }).catch(() => {});
    }
  } catch (err) {
    // Fail silently
    console.debug("[Internal Analytics Track Error]", err);
  }
}

// -------------------------------------------------------------
// Specialized Trackers
// -------------------------------------------------------------

/**
 * 1. Track Game View
 */
export function trackGameView(game: { id: string; slug: string; title?: string }) {
  const params = {
    game_id: String(game.id),
    game_slug: game.slug,
    game_name: game.title || game.slug,
  };

  trackGAEvent("game_view", params);
  trackInternalEvent("game_view", params);
}

/**
 * 2. Track Code Copy
 */
export function trackCodeCopy(params: { game_id: string; game_slug: string; code_id: string }) {
  trackGAEvent("code_copy", params);
  trackInternalEvent("code_copy", params);
}

/**
 * 3. Track Discord Click
 */
export function trackDiscordClick(params: { game_id?: string; game_slug?: string }) {
  trackGAEvent("discord_click", params);
  trackInternalEvent("discord_click", params);
}

/**
 * 4. Track Game Search
 */
export function trackGameSearch(searchTerm: string) {
  if (!searchTerm || !searchTerm.trim()) return;
  const params = { search_term: searchTerm.trim() };
  trackGAEvent("game_search", params);
  trackInternalEvent("game_search", params);
}

/**
 * 5. Track Game Card Click
 */
export function trackGameClick(params: { game_id: string; game_slug: string; source?: string }) {
  trackGAEvent("game_click", {
    game_id: String(params.game_id),
    game_slug: params.game_slug,
    source: params.source || "game_card",
  });
  trackInternalEvent("game_click", params);
}
