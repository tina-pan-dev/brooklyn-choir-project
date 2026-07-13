import { fallbackContent } from "./fallbackContent";

const projectId = process.env.REACT_APP_SANITY_PROJECT_ID;
const dataset = process.env.REACT_APP_SANITY_DATASET || "production";
const apiVersion = "2025-02-19";
const apiHost = process.env.NODE_ENV === "development" ? "api" : "apicdn";

const query = `*[_type == "siteContent"][0]{
  siteName,
  openLabel,
  closeLabel,
  introBeforeLogo,
  introAfterLogo,
  body,
  ticketText,
  ticketLinkLabel,
  ticketUrl,
  instagramUrl,
  "inlineLogo": inlineLogo.asset->url,
  "backgroundVideo": backgroundVideo.asset->url,
  "posterImage": posterImage.asset->url,
  "mobileBackground": mobileBackground.asset->url,
  "patternImage": patternImage.asset->url
}`;

export async function getSiteContent(signal) {
  if (!projectId) return null;

  const params = new URLSearchParams({ query, perspective: "published" });
  const url = `https://${projectId}.${apiHost}.sanity.io/v${apiVersion}/data/query/${dataset}?${params}`;

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`Sanity returned ${response.status}`);

    const { result } = await response.json();
    if (!result) return null;

    const remoteContent = Object.fromEntries(
      Object.entries(result).filter(
        ([, value]) => value !== null && value !== undefined
      )
    );
    return { ...fallbackContent, ...remoteContent };
  } catch (error) {
    if (error.name !== "AbortError") {
      console.warn("Sanity content could not be loaded; using local content.", error);
    }
    return null;
  }
}
