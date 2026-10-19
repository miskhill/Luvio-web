import React, { createContext, useContext, useEffect, useState } from "react";
import logoImageMain from "./images/Luvio logo2.jpeg";
import bandsImage from "./images/783c5782-8d4d-4ea3-aee3-48615623eeb2.jpeg";
import About from "./components/About";
import EventRequestForm from "./components/EventRequestForm";
import Shop from "./components/Shop";
import { CharityHomeCard, CharityPage } from "./components/CharityImpact";
import "./App.scss";

export type TabType = "home" | "about" | "request" | "shop" | "charity";

interface NavigationContextType {
  activeTab: TabType;
  navigateTo: (tab: TabType) => void;
}

const tabPaths: Record<TabType, string> = {
  home: "/",
  about: "/about",
  request: "/events",
  shop: "/shop",
  charity: "/charity",
};

const navigationItems: Array<{ tab: TabType; label: string }> = [
  { tab: "home", label: "How it works" },
  { tab: "shop", label: "Shop" },
  { tab: "about", label: "About us" },
  { tab: "request", label: "Events" },
  { tab: "charity", label: "Charity impact" },
];

function tabFromLocation(): TabType {
  const params = new URLSearchParams(window.location.search);
  if (params.get("checkout") || params.get("payment")) return "shop";
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const match = (Object.entries(tabPaths) as Array<[TabType, string]>).find(
    ([, tabPath]) => tabPath === path
  );
  return match?.[0] || "home";
}

export const NavigationContext = createContext<NavigationContextType>({
  activeTab: "home",
  navigateTo: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

function HomePage() {
  const { navigateTo } = useNavigation();

  return (
    <main id="main-content" className="home-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__content">
          <p className="eyebrow">Connection. Consent. Community.</p>
          <h1 id="hero-title">The Wristband That Speaks Before You Do.</h1>
          <p className="hero__lead">
            A simple colour-coded wristband that helps people share whether they are open to a
            conversation—before anyone has to guess.
          </p>
          <div className="button-row">
            <button className="button button--primary" type="button" onClick={() => navigateTo("shop")}>
              Shop bands
            </button>
            <button className="button button--secondary" type="button" onClick={() => navigateTo("request")}>
              Bring Luvio to an event
            </button>
          </div>
          <p className="hero__price">Individual bands from £2.50</p>
        </div>
        <div className="hero__visual">
          <img
            className="hero__bands-image"
            src={bandsImage}
            alt="Red, yellow and green Luvio wristbands"
          />
          <span className="hero__image-caption">Choose the signal that feels right for you.</span>
        </div>
      </section>

      <section className="section how-it-works" aria-labelledby="how-it-works-title">
        <div className="section-heading">
          <p className="eyebrow">Wear your vibe</p>
          <h2 id="how-it-works-title">Three colours. One clear conversation starter.</h2>
          <p>Look for the colour, respect the signal, and let the wearer stay in control.</p>
        </div>
        <div className="signal-grid">
          <article className="signal-card signal-card--red">
            <span className="signal-card__marker" aria-hidden="true" />
            <h3>Red</h3>
            <strong>Taken / not interested</strong>
            <p>Respect the signal and do not approach romantically.</p>
          </article>
          <article className="signal-card signal-card--yellow">
            <span className="signal-card__marker" aria-hidden="true" />
            <h3>Yellow</h3>
            <strong>Wait for my signal</strong>
            <p>The wearer makes the first move.</p>
          </article>
          <article className="signal-card signal-card--green">
            <span className="signal-card__marker" aria-hidden="true" />
            <h3>Green</h3>
            <strong>Open to talk</strong>
            <p>Come say hi, then keep listening and respect the response.</p>
          </article>
        </div>
        <p className="consent-note">
          A band shares a social intention. It never implies consent to physical contact or
          guarantees romantic interest.
        </p>
      </section>

      <CharityHomeCard />

      <section className="section event-callout" aria-labelledby="event-callout-title">
        <div>
          <p className="eyebrow">For venues and organisers</p>
          <h2 id="event-callout-title">Make meeting people feel easier at your next event.</h2>
          <p>
            Tell us about your pub night, club event, festival or community gathering and the
            wristbands you may need.
          </p>
        </div>
        <button className="button button--secondary" type="button" onClick={() => navigateTo("request")}>
          Start an event enquiry
        </button>
      </section>
    </main>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<TabType>(tabFromLocation);

  useEffect(() => {
    const syncTabFromLocation = () => setActiveTab(tabFromLocation());
    window.addEventListener("popstate", syncTabFromLocation);
    return () => window.removeEventListener("popstate", syncTabFromLocation);
  }, []);

  const navigateTo = (tab: TabType) => {
    const destination = tabPaths[tab];
    if (`${window.location.pathname}${window.location.search}` !== destination) {
      window.history.pushState({}, "", destination);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <NavigationContext.Provider value={{ activeTab, navigateTo }}>
      <div className="site-shell">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <header className="site-header">
          <button className="brand" type="button" onClick={() => navigateTo("home")} aria-label="Luvio home">
            <img src={logoImageMain} alt="Luvio — Connection. Consent. Community." />
          </button>
          <nav className="primary-nav" aria-label="Primary navigation">
            {navigationItems.map(({ tab, label }) => (
              <button
                className={`primary-nav__item${tab === "shop" ? " primary-nav__item--shop" : ""}`}
                type="button"
                key={tab}
                aria-current={activeTab === tab ? "page" : undefined}
                onClick={() => navigateTo(tab)}
              >
                {label}
              </button>
            ))}
          </nav>
        </header>

        {activeTab === "home" ? <HomePage /> :
          activeTab === "about" ? <About /> :
          activeTab === "request" ? <EventRequestForm /> :
          activeTab === "charity" ? <CharityPage /> : <Shop />}

        <footer className="site-footer">
          <div><strong>Luvio</strong><span>Connection. Consent. Community.</span></div>
          <div className="site-footer__links">
            <a href="mailto:Luvioband@outlook.com">Luvioband@outlook.com</a>
            <a href="https://www.instagram.com/luvioband?igsh=MXB3M20xb3Z1MGtrOQ==" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </footer>
      </div>
    </NavigationContext.Provider>
  );
}

export default App;
