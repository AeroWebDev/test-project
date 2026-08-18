import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export default function SEO({
  title = "RoBcodes | Latest Roblox Game Codes & Rewards 2026",
  description = "Find active, daily-verified Roblox game codes for Blox Fruits, Blade Ball, King Legacy, Anime Defenders and 100+ top Roblox games. One-tap copy codes instantly!",
  keywords = "roblox codes, roblox game codes, blox fruits codes, blade ball codes, king legacy codes, anime defenders codes, roblox redeem codes 2026",
  canonical,
  ogType = "website",
  ogImage = "",
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // 2. Helper to set or update meta tag
    const setMetaTag = (nameOrProperty: string, value: string, isProperty = false) => {
      const selector = isProperty
        ? `meta[property="${nameOrProperty}"]`
        : `meta[name="${nameOrProperty}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;

      if (!element) {
        element = document.createElement("meta");
        if (isProperty) {
          element.setAttribute("property", nameOrProperty);
        } else {
          element.setAttribute("name", nameOrProperty);
        }
        document.head.appendChild(element);
      }
      element.setAttribute("content", value);
    };

    // Standard Metas
    setMetaTag("description", description);
    setMetaTag("keywords", keywords);

    // Open Graph Metas
    setMetaTag("og:title", title, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:type", ogType, true);
    setMetaTag("og:image", ogImage, true);
    setMetaTag("og:url", canonical || window.location.href, true);

    // Twitter Card Metas
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", title);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", ogImage);

    // Canonical link
    let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonical || window.location.href);

    // JSON-LD Script tag
    const scriptId = "json-ld-schema";
    let jsonLdScript = document.getElementById(scriptId) as HTMLScriptElement;
    if (jsonLd) {
      if (!jsonLdScript) {
        jsonLdScript = document.createElement("script");
        jsonLdScript.id = scriptId;
        jsonLdScript.type = "application/ld+json";
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.textContent = JSON.stringify(jsonLd);
    } else if (jsonLdScript) {
      jsonLdScript.remove();
    }
  }, [title, description, keywords, canonical, ogType, ogImage, jsonLd]);

  return null;
}
