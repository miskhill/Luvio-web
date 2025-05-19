import React from "react";
import styled from "styled-components";
import aboutImage from "../images/783c5782-8d4d-4ea3-aee3-48615623eeb2.jpeg";

const AboutContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  line-height: 1.6;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #e84118;
  margin-bottom: 2rem;
  text-align: center;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const Paragraph = styled.p`
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
`;

const ColorCode = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem auto;
  gap: 1rem;
  max-width: 400px;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const ColorDot = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  flex-shrink: 0;
`;

const ColorText = styled.span`
  font-size: 1.1rem;
  color: #e9e2c8;
`;

const VisionSection = styled.div`
  margin: 2rem 0;
  padding: 2rem;
  background-color: rgba(232, 65, 24, 0.1);
  border-radius: 8px;
`;

const BeliefSection = styled.div`
  margin-top: 2rem;
  font-style: italic;
`;

const Belief = styled.p`
  margin-bottom: 1rem;
`;

const AboutImage = styled.img`
  width: 50%;
  max-width: 300px;
  height: auto;
  border-radius: 12px;
  margin: 2rem auto;
  display: block;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const About = () => {
  return (
    <AboutContainer>
      <Title>🌐 About Luvio</Title>
      <AboutImage src={aboutImage} alt="Luvio Wristbands" />

      <Section>
        <Paragraph>
          Luvio is more than a wristband — it's a quiet revolution in how we
          connect.
        </Paragraph>

        <Paragraph>
          Born from the desire to make social interaction more respectful,
          intentional, and anxiety-free, Luvio was created to help people signal
          their vibe before the first word is ever spoken. Whether you're
          looking to meet new friends, flirt a little, or simply enjoy the
          moment without unwanted pressure, Luvio gives you the power to express
          yourself — silently, clearly, and on your terms.
        </Paragraph>
      </Section>

      <Section>
        <Paragraph>
          We've all felt that awkward hesitation: "Should I go say hi?" "Are
          they open to chatting, or just here to chill?" "Am I reading this
          situation right?"
        </Paragraph>

        <Paragraph>
          Luvio answers those questions with a simple, color-coded wristband —
        </Paragraph>

        <ColorCode>
          <ColorDot color="#e74c3c" />
          <ColorText>Red: Taken / Not interested</ColorText>
        </ColorCode>
        <ColorCode>
          <ColorDot color="#f1c40f" />
          <ColorText>Yellow: I'll make the first move</ColorText>
        </ColorCode>
        <ColorCode>
          <ColorDot color="#2ecc71" />
          <ColorText>Green: Open to talk! Come say hi</ColorText>
        </ColorCode>
      </Section>

      <VisionSection>
        <Paragraph>
          But we're not just here for parties or dating events.
        </Paragraph>

        <Paragraph>
          Our bigger vision is community. We imagine a world where you can walk
          into a festival, a book club, a café, or even a university campus —
          and instantly feel who's open to meaningful conversation. A world
          where connection is clearer. Consent is visible. And community is
          something you wear with pride.
        </Paragraph>
      </VisionSection>

      <Section>
        <Paragraph>
          Luvio is for anyone tired of the noise, the guesswork, or the swipe
          fatigue. It's for introverts and extroverts, romantics and realists,
          flirts and friends. It's for people who want to meet others with
          clarity, comfort, and consent at the heart of it all.
        </Paragraph>
      </Section>

      <BeliefSection>
        <Belief>We believe in soft signals with strong boundaries.</Belief>
        <Belief>We believe a small band can make a big impact.</Belief>
        <Belief>
          We believe in connection — real, respectful, human connection.
        </Belief>
      </BeliefSection>

      <Paragraph
        style={{ textAlign: "center", fontWeight: "bold", marginTop: "2rem" }}
      >
        Join the movement. Wear your vibe. Let it show.
      </Paragraph>
    </AboutContainer>
  );
};

export default About;
