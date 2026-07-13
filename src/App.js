import { useEffect, useState } from "react";
import "./App.css";
import { fallbackContent } from "./content/fallbackContent";
import { getSiteContent } from "./content/sanity";
import RichText from "./components/RichText";

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  );
}

function App() {
  const [showContent, setShowContent] = useState(false);
  const [content, setContent] = useState(fallbackContent);

  useEffect(() => {
    const controller = new AbortController();
    const loadContent = () => {
      getSiteContent(controller.signal).then((remoteContent) => {
        if (remoteContent) setContent(remoteContent);
      });
    };

    loadContent();
    window.addEventListener("focus", loadContent);
    const refreshTimer =
      process.env.NODE_ENV === "development"
        ? window.setInterval(loadContent, 5000)
        : undefined;

    return () => {
      controller.abort();
      window.removeEventListener("focus", loadContent);
      if (refreshTimer) window.clearInterval(refreshTimer);
    };
  }, []);

  useEffect(() => {
    if (!showContent) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setShowContent(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [showContent]);

  const backgroundStyle = {
    "--pattern-image": `url("${content.patternImage}")`,
    "--mobile-background": `url("${content.mobileBackground}")`,
  };

  return (
    <main className="site-shell" style={backgroundStyle}>
      <video
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
        poster={content.posterImage}
      >
        <source src={content.backgroundVideo} type="video/mp4" />
      </video>

      <div className="content-layer">
        {!showContent ? (
          <button className="info-button" onClick={() => setShowContent(true)}>
            {content.openLabel}
          </button>
        ) : (
          <section className="popup" role="dialog" aria-modal="true" aria-label={content.siteName}>
            <div className="popup-nav">
              <button className="close-button" autoFocus onClick={() => setShowContent(false)}>
                {content.closeLabel}
              </button>
            </div>

            <div className="popup-copy">
              <p className="intro">
                {content.introBeforeLogo}{" "}
                <img className="logo" src={content.inlineLogo} alt={content.siteName} />{" "}
                {content.introAfterLogo}
              </p>
              <RichText document={content.body} />
              <p>
                {content.ticketText}{" "}
                <a href={content.ticketUrl} target="_blank" rel="noreferrer noopener">
                  {content.ticketLinkLabel}
                </a>
                .
              </p>
            </div>

            <div className="social-links">
              <a
                href={content.instagramUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="social-link"
                aria-label={`${content.siteName} on Instagram`}
              >
                <InstagramIcon />
              </a>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
