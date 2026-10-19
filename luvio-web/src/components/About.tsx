import React from "react";
import aboutImage from "../images/783c5782-8d4d-4ea3-aee3-48615623eeb2.jpeg";
import { useNavigation } from "../App";
import "./About.scss";

const About = () => {
  const { navigateTo } = useNavigation();

  return (
    <main id="main-content" className="page about-page">
      <header className="page-intro about-intro">
        <div>
          <p className="eyebrow">About Luvio</p>
          <h1 className="page-title">A small signal for more respectful connection.</h1>
          <p className="page-lead">
            Luvio helps take some of the guesswork out of meeting people by letting the wearer
            communicate their social intention before a conversation begins.
          </p>
        </div>
        <img src={aboutImage} alt="Three Luvio wristbands in red, yellow and green" />
      </header>

      <section className="about-section" aria-labelledby="why-luvio">
        <div>
          <p className="eyebrow">Why Luvio</p>
          <h2 id="why-luvio">Clearer signals. Less guesswork.</h2>
        </div>
        <div className="about-section__copy">
          <p>
            It can be hard to know whether somebody wants to chat, would rather make the first
            move, or simply wants to enjoy their night without romantic attention. A Luvio band
            offers a quiet, easy-to-read starting point.
          </p>
          <p>
            The idea is simple: notice the colour, respect what it means and keep listening to the
            person wearing it. The band begins a conversation; it never replaces communication or
            consent.
          </p>
        </div>
      </section>

      <section className="about-signals" aria-labelledby="about-signals-title">
        <h2 id="about-signals-title">The three signals</h2>
        <div className="about-signals__grid">
          <article className="about-signal about-signal--red">
            <h3>Red</h3>
            <strong>Taken / not interested</strong>
            <p>Respect the signal and do not approach romantically.</p>
          </article>
          <article className="about-signal about-signal--yellow">
            <h3>Yellow</h3>
            <strong>Wait for my signal</strong>
            <p>The wearer makes the first move.</p>
          </article>
          <article className="about-signal about-signal--green">
            <h3>Green</h3>
            <strong>Open to talk</strong>
            <p>Come say hi, without assuming anything more.</p>
          </article>
        </div>
      </section>

      <section className="about-section about-section--vision" aria-labelledby="our-purpose">
        <div>
          <p className="eyebrow">Our purpose</p>
          <h2 id="our-purpose">Connection, consent and community.</h2>
        </div>
        <div className="about-section__copy">
          <p>
            Luvio is designed for pubs, clubs, festivals, campuses and community events—anywhere
            people want a friendlier way to connect in person.
          </p>
          <p>
            We believe in soft signals with strong boundaries, and in social spaces where people
            can feel more comfortable expressing what they want.
          </p>
        </div>
      </section>

      <section className="about-cta">
        <div>
          <h2>Wear your vibe. Respect theirs.</h2>
          <p>Choose a band for yourself or bring Luvio to your next event.</p>
        </div>
        <div className="button-row">
          <button className="button button--primary" type="button" onClick={() => navigateTo("shop")}>
            Shop bands
          </button>
          <button className="button button--secondary" type="button" onClick={() => navigateTo("request")}>
            Event enquiries
          </button>
        </div>
      </section>
    </main>
  );
};

export default About;
