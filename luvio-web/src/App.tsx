import React, { useState } from "react";
import styled from "styled-components";
import logoImage from "./images/Screenshot 2025-05-12 at 10.39.53.png";
import About from "./components/About";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #111;
  color: #e9e2c8; /* Light gold/cream color for text */
  text-align: center;
`;

const LOGO_WIDTH = "8.5em";

const LogoBlock = styled.div`
  width: ${LOGO_WIDTH};
  margin: 0 auto 0.5rem auto;
`;

const Logo = styled.h1`
  font-size: 5rem;
  margin-bottom: 0;
  font-weight: bold;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.1em;
`;

const LogoLetter = styled.span<{ color?: string }>`
  color: ${(props) => props.color || "#e9e2c8"};
`;

const LogoO = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.2em;
  height: 1.2em;
  background: #e9e2c8;
  border-radius: 50%;
  position: relative;
  margin-left: 0.1em;
  margin-right: 0.1em;
  font-size: 0.9em;
`;

const Heart = styled.span`
  color: #111;
  font-size: 0.7em;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const Tagline = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const LogoImage = styled.img`
  max-width: 80%;
  height: auto;
  margin-bottom: 3rem;
  border-radius: 8px;
`;

const BandsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Band = styled.div<{ color: string }>`
  width: 180px;
  height: 40px;
  background-color: ${(props) => props.color};
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.9rem;
`;

const Heading = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Subheading = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 2rem;
`;

const Info = styled.div`
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
`;

const BandInfo = styled.div`
  margin-bottom: 1.5rem;
`;

const ColorText = styled.span<{ color: string }>`
  color: ${(props) => props.color};
  font-weight: bold;
`;

const Price = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Footer = styled.div`
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const Hashtag = styled.span`
  margin: 0 10px;
`;

const SocialLinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
  gap: 10px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e9e2c8;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #e84118;
  }
`;

const SocialIcon = styled.div`
  margin-right: 10px;
  font-size: 1.5rem;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 2rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  font-size: 1.2rem;
  background-color: ${(props) => (props.active ? "#e84118" : "transparent")};
  color: #e9e2c8;
  border: 2px solid #e84118;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.active ? "#e84118" : "rgba(232, 65, 24, 0.2)"};
  }
`;

const LogoTagline = styled.div`
  font-size: 1.1rem;
  color: #e9e2c8;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  text-align: left;
  letter-spacing: 0.02em;
  font-weight: 500;
  width: 100%;
  white-space: nowrap;
`;

function App() {
  const [activeTab, setActiveTab] = useState<"home" | "about">("home");

  return (
    <Container>
      <LogoBlock>
        <Logo>
          <LogoLetter>L</LogoLetter>
          <LogoLetter color="#e74c3c">U</LogoLetter>
          <LogoLetter color="#f1c40f">V</LogoLetter>
          <LogoLetter color="#2ecc71">I</LogoLetter>
          <LogoO>
            <Heart>♡</Heart>
          </LogoO>
        </Logo>
        <LogoTagline>Connection. Consent. Community.</LogoTagline>
      </LogoBlock>
      <Tagline>The Wristband That Speaks Before You Do</Tagline>

      <TabContainer>
        <Tab active={activeTab === "home"} onClick={() => setActiveTab("home")}>
          Home
        </Tab>
        <Tab
          active={activeTab === "about"}
          onClick={() => setActiveTab("about")}
        >
          About Us
        </Tab>
      </TabContainer>

      {activeTab === "home" ? (
        <>
          <LogoImage src={logoImage} alt="Luvio Wristbands" />

          <BandsContainer>
            <Band color="#e74c3c">NOT INTERESTED</Band>
            <Band color="#f1c40f">MAYBE I'LL APPROACH</Band>
            <Band color="#2ecc71">COME SAY HI</Band>
          </BandsContainer>

          <Heading>Going out tonight?</Heading>
          <Subheading>Let your band do the talking.</Subheading>

          <Info>
            Buy a LUVIO band for just £2 and wear it at clubs and pubs to signal
            your vibe:
          </Info>

          <BandInfo>
            <ColorText color="#e74c3c">RED</ColorText> – Not looking for a
            relationship. Please don't approach.
          </BandInfo>
          <BandInfo>
            <ColorText color="#f1c40f">YELLOW</ColorText> – Might be open...,
            but I'll make the first move.
          </BandInfo>
          <BandInfo>
            <ColorText color="#2ecc71">GREEN</ColorText> – Open to connection.
            Feel free to come say hello.
          </BandInfo>

          <Price>Available at the bar for just £2</Price>

          <Footer>
            Join the vibe. Wear your color. Find your people.
            <div>
              <Hashtag>#LuvioBand</Hashtag>
              <Hashtag>#LetItShow</Hashtag>
            </div>
          </Footer>

          <SocialLinksContainer>
            <SocialLink href="mailto:Luvioband@outlook.com">
              <SocialIcon>✉️</SocialIcon>
              Contact us: Luvioband@outlook.com
            </SocialLink>

            <SocialLink
              href="https://www.instagram.com/luvioband?igsh=MXB3M20xb3Z1MGtrOQ=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon>📸</SocialIcon>
              Follow us on Insta: @luvioband
            </SocialLink>
          </SocialLinksContainer>
        </>
      ) : (
        <About />
      )}
    </Container>
  );
}

export default App;
