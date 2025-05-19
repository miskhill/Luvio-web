import React, { useState } from "react";
import styled from "styled-components";
import logoImage from "./images/Screenshot 2025-05-12 at 10.39.53.png";
import About from "./components/About";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Logo = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Tagline = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const LogoImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 2rem;
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

const BandsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 2rem;
`;

const Band = styled.div<{ color: string }>`
  width: 100px;
  height: 100px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #e9e2c8;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const Heading = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Subheading = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const Info = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const BandInfo = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const ColorText = styled.span<{ color: string }>`
  color: ${(props) => props.color};
`;

const Price = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const Footer = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Hashtag = styled.span`
  margin-right: 10px;
`;

const SocialLinksContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 2rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  color: #e9e2c8;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const SocialIcon = styled.span`
  margin-right: 5px;
`;

function App() {
  const [activeTab, setActiveTab] = useState<"home" | "about">("home");

  return (
    <Container>
      <Logo>LUVIO</Logo>
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
            Buy a LUVIO band for just £1 and wear it at clubs and pubs to signal
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
