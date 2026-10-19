import React, { useEffect, useState } from "react";
import { apiService, CharityImpactResponse } from "../services/api";
import { useNavigation } from "../App";
import "./CharityImpact.scss";

function formatPledge(totalPledgedPence: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(totalPledgedPence / 100);
}

function useCharityImpact() {
  const [impact, setImpact] = useState<CharityImpactResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let mounted = true;
    apiService.getCharityImpact()
      .then((response) => {
        if (!mounted) return;
        setImpact(response);
        setFailed(false);
      })
      .catch(() => {
        if (mounted) setFailed(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  return { impact, loading, failed };
}

function LiveTotal({ impact, loading, failed }: ReturnType<typeof useCharityImpact>) {
  if (loading) {
    return <p className="charity-total charity-total--status" aria-live="polite">Loading our current pledge…</p>;
  }
  if (failed || !impact) {
    return <p className="charity-total charity-total--status" aria-live="polite">Live total temporarily unavailable</p>;
  }
  return (
    <p className="charity-total" aria-live="polite">
      {formatPledge(impact.totalPledgedPence, impact.currency)} <span>pledged so far</span>
    </p>
  );
}

export function CharityHomeCard() {
  const impactState = useCharityImpact();
  const { navigateTo } = useNavigation();

  return (
    <section className="charity-home" aria-labelledby="charity-home-heading">
      <div className="charity-home__copy">
        <p className="eyebrow" id="charity-home-heading">Luvio x Mind</p>
        <h2>Every band can help make a difference.</h2>
        <p>
          £1 from every individual band sold through our website goes towards supporting Mind.
          A three-band pack adds £3 to the pledge.
        </p>
        <button className="button button--secondary" type="button" onClick={() => navigateTo("charity")}>
          See our charity impact
        </button>
      </div>
      <div className="charity-home__total">
        <span className="charity-home__label">Live fundraising total</span>
        <LiveTotal {...impactState} />
        <span className="charity-home__source">Calculated from eligible paid website orders.</span>
      </div>
    </section>
  );
}

export function CharityPage() {
  const impactState = useCharityImpact();
  const donations = impactState.impact?.donations || [];

  return (
    <main id="main-content" className="page charity-page">
      <header className="page-intro charity-intro">
        <p className="eyebrow">Luvio x Mind</p>
        <h1 className="page-title">Making a difference together.</h1>
        <p className="page-lead">
          Connection is about more than meeting new people. It is also about building a community
          where people feel welcome, included and supported.
        </p>
      </header>

      <section className="charity-impact-panel" aria-labelledby="fundraising-total-title">
        <div>
          <p className="eyebrow" id="fundraising-total-title">Our fundraising total</p>
          <LiveTotal {...impactState} />
        </div>
        <p>This live figure is the cumulative amount pledged through eligible online band sales.</p>
      </section>

      <div className="charity-content-grid">
        <section aria-labelledby="pledge-title">
          <h2 id="pledge-title">How the pledge works</h2>
          <p>
            Every individual band in a successfully paid website order adds £1 to the total. A
            pack of three bands adds £3. Failed, abandoned and unpaid checkouts are not included.
          </p>
          <p>
            The counter shows money pledged, which may not yet have been transferred. We aim to
            donate accumulated funds monthly and keep the record transparent. Refunds do not
            reduce the pledge; Luvio absorbs that contribution.
          </p>
        </section>

        <aside className="charity-fact" aria-label="What the total means">
          <strong>£1 per band</strong>
          <span>from eligible, completed and paid website orders</span>
        </aside>
      </div>

      <section className="charity-section" aria-labelledby="donations-title">
        <h2 id="donations-title">Completed donations</h2>
        {donations.length > 0 ? (
          <ul className="donation-list">
            {donations.map((donation) => (
              <li key={`${donation.period}-${donation.paidAt}`}>
                <span>{donation.period}</span>
                <strong>{formatPledge(donation.amountPence, "GBP")}</strong>
                <span>Donated {new Date(donation.paidAt).toLocaleDateString("en-GB")}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No completed monthly donations have been recorded yet.</p>
        )}
      </section>

      <section className="charity-section charity-section--mind" aria-labelledby="mind-title">
        <div>
          <p className="eyebrow">Mental health support</p>
          <h2 id="mind-title">About Mind</h2>
          <p>
            Learn more about mental health support and the charity&apos;s work on the official Mind
            website. This pledge does not imply an official partnership or endorsement.
          </p>
        </div>
        <a className="button button--secondary" href="https://www.mind.org.uk/" target="_blank" rel="noopener noreferrer">
          Visit official Mind website
        </a>
      </section>
    </main>
  );
}
