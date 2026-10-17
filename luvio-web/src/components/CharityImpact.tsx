import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { apiService, CharityImpactResponse } from "../services/api";
import { useNavigation } from "../App";

const HomeCard = styled.section`
  width: min(100%, 760px);
  margin: 0 auto 3rem;
  padding: 2rem;
  border: 1px solid rgba(232, 65, 24, 0.65);
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(232, 65, 24, 0.16), rgba(34, 34, 34, 0.96));
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.24);
`;

const Eyebrow = styled.p`
  margin: 0 0 0.65rem;
  color: #f47755;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

const Total = styled.p`
  margin: 0 0 0.9rem;
  color: #e9e2c8;
  font-size: clamp(2rem, 6vw, 3.35rem);
  font-weight: 700;
  line-height: 1.08;
`;

const SupportingText = styled.p`
  max-width: 620px;
  margin: 0 auto;
  color: #d6d0bc;
  font-size: 1.05rem;
  line-height: 1.65;
`;

const ImpactButton = styled.button`
  margin-top: 1.4rem;
  padding: 0.8rem 1.4rem;
  border: 2px solid #e84118;
  border-radius: 999px;
  background: #e84118;
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: #c23616;
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid #f1c40f;
    outline-offset: 3px;
  }
`;

const Page = styled.main`
  width: min(100%, 900px);
  padding: clamp(1.5rem, 5vw, 4rem);
  border-radius: 18px;
  background: #222;
  text-align: left;
`;

const PageTitle = styled.h1`
  margin: 0 0 1.25rem;
  color: #e84118;
  font-size: clamp(2.2rem, 7vw, 4rem);
  line-height: 1.05;
`;

const Lead = styled.p`
  margin: 0 0 1.25rem;
  color: #e9e2c8;
  font-size: clamp(1.1rem, 3vw, 1.35rem);
  line-height: 1.65;
`;

const TotalPanel = styled.div`
  margin: 2.25rem 0;
  padding: clamp(1.5rem, 5vw, 2.5rem);
  border-left: 5px solid #e84118;
  border-radius: 0 14px 14px 0;
  background: #181818;
`;

const SectionTitle = styled.h2`
  margin: 2.25rem 0 0.8rem;
  color: #e9e2c8;
  font-size: 1.6rem;
`;

const BodyText = styled.p`
  margin: 0 0 1rem;
  color: #d6d0bc;
  font-size: 1.05rem;
  line-height: 1.7;
`;

const MindLink = styled.a`
  color: #f47755;
  font-weight: 700;

  &:focus-visible {
    outline: 3px solid #f1c40f;
    outline-offset: 3px;
  }
`;

const DonationList = styled.ul`
  margin: 0;
  padding-left: 1.3rem;
  color: #d6d0bc;
  line-height: 1.7;
`;

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

    apiService
      .getCharityImpact()
      .then((response) => {
        if (!mounted) return;
        setImpact(response);
        setFailed(false);
      })
      .catch(() => {
        if (!mounted) return;
        setFailed(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { impact, loading, failed };
}

function LiveTotal({ impact, loading, failed }: ReturnType<typeof useCharityImpact>) {
  if (loading) return <Total aria-live="polite">Loading our current pledge…</Total>;
  if (failed || !impact) {
    return <Total aria-live="polite">Live total temporarily unavailable</Total>;
  }

  return (
    <Total aria-live="polite">
      {formatPledge(impact.totalPledgedPence, impact.currency)} pledged so far
    </Total>
  );
}

export function CharityHomeCard() {
  const impactState = useCharityImpact();
  const { navigateTo } = useNavigation();

  return (
    <HomeCard aria-labelledby="charity-home-heading">
      <Eyebrow id="charity-home-heading">Luvio x Mind</Eyebrow>
      <LiveTotal {...impactState} />
      <SupportingText>
        £1 from every individual band sold through our website goes towards supporting Mind.
      </SupportingText>
      <ImpactButton type="button" onClick={() => navigateTo("charity")}>
        Discover our charity impact
      </ImpactButton>
    </HomeCard>
  );
}

export function CharityPage() {
  const impactState = useCharityImpact();
  const donations = impactState.impact?.donations || [];

  return (
    <Page>
      <Eyebrow>Luvio x Mind</Eyebrow>
      <PageTitle>Making a Difference Together</PageTitle>
      <Lead>
        At Luvio, we believe connection is about more than meeting new people. It is about building
        a community where people feel welcome, included and supported.
      </Lead>
      <BodyText>That is why we want Luvio to give something back.</BodyText>

      <TotalPanel>
        <Eyebrow>Our fundraising total</Eyebrow>
        <LiveTotal {...impactState} />
        <SupportingText>
          This is the cumulative amount pledged to Mind through eligible online band sales.
        </SupportingText>
      </TotalPanel>

      <SectionTitle>How the pledge works</SectionTitle>
      <BodyText>
        Every individual band in a successfully paid website order adds £1 to the total. A pack of
        three bands adds £3. Failed, abandoned and unpaid checkouts are not included.
      </BodyText>
      <BodyText>
        The counter shows money pledged, which may not yet have been transferred. We aim to donate
        accumulated funds monthly and keep the record transparent. Refunds do not reduce the pledge;
        Luvio absorbs that contribution.
      </BodyText>

      <SectionTitle>Completed donations</SectionTitle>
      {donations.length > 0 ? (
        <DonationList>
          {donations.map((donation) => (
            <li key={`${donation.period}-${donation.paidAt}`}>
              {donation.period}: {formatPledge(donation.amountPence, "GBP")} donated on{" "}
              {new Date(donation.paidAt).toLocaleDateString("en-GB")}
            </li>
          ))}
        </DonationList>
      ) : (
        <BodyText>No completed monthly donations have been recorded yet.</BodyText>
      )}

      <SectionTitle>About Mind</SectionTitle>
      <BodyText>
        Learn more about mental health support and the charity&apos;s work on the{" "}
        <MindLink href="https://www.mind.org.uk/" target="_blank" rel="noopener noreferrer">
          official Mind website
        </MindLink>
        . This pledge does not imply an official partnership or endorsement.
      </BodyText>
    </Page>
  );
}
