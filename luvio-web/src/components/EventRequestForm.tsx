import React, { FormEvent, useState } from "react";
import "./EventRequestForm.scss";

const EventRequestForm = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    eventLocation: "",
    eventType: "",
    eventTypeOther: "",
    guestCount: "",
    needWristbands: false,
    redBands: 0,
    yellowBands: 0,
    greenBands: 0,
    shippingAddress: "",
    name: "",
    email: "",
    phone: "",
    extraInfo: "",
  });
  const [submissionMessage, setSubmissionMessage] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: Math.max(0, parseInt(value, 10) || 0) }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const eventTypeLabel: Record<string, string> = {
      social: "Social / Mixer",
      dating: "Dating",
      community: "Community / Club",
    };

    let emailBody = "🎉 EVENT INFORMATION\n";
    emailBody += `Event Name: ${formData.eventName}\n`;
    emailBody += `Event Date & Time: ${formData.eventDate}\n`;
    emailBody += `Event Location: ${formData.eventLocation}\n`;
    emailBody += `Type of Event: ${
      formData.eventType === "other"
        ? `Other: ${formData.eventTypeOther}`
        : eventTypeLabel[formData.eventType] || "Not specified"
    }\n`;
    emailBody += `Estimated Number of Guests: ${formData.guestCount}\n\n`;
    emailBody += "🎟️ WRISTBANDS\n";
    emailBody += `Need wristbands: ${formData.needWristbands ? "Yes" : "No"}\n`;

    if (formData.needWristbands) {
      emailBody += `Red bands: ${formData.redBands}\n`;
      emailBody += `Yellow bands: ${formData.yellowBands}\n`;
      emailBody += `Green bands: ${formData.greenBands}\n`;
      emailBody += `Shipping Address: ${formData.shippingAddress}\n\n`;
    }

    emailBody += "👤 CONTACT DETAILS\n";
    emailBody += `Name: ${formData.name}\n`;
    emailBody += `Email: ${formData.email}\n`;
    emailBody += `Phone: ${formData.phone || "Not provided"}\n\n`;
    if (formData.extraInfo) emailBody += `📝 EXTRA INFO\n${formData.extraInfo}\n`;

    setSubmissionMessage("Your email app should open with your enquiry ready to send.");
    const subject = encodeURIComponent(`Event Request: ${formData.eventName}`);
    window.location.href = `mailto:Luvioband@outlook.com?subject=${subject}&body=${encodeURIComponent(emailBody)}`;
  };

  return (
    <main id="main-content" className="page event-page">
      <header className="page-intro event-intro">
        <p className="eyebrow">Events and venues</p>
        <h1 className="page-title">Bring Luvio to your next event.</h1>
        <p className="page-lead">
          Planning a pub night, club event, festival or community gathering? Share the details
          below and we will help you work out what you need.
        </p>
      </header>

      <div className="event-layout">
        <aside className="event-aside">
          <p className="eyebrow">What happens next</p>
          <ol>
            <li>Tell us about your event and audience.</li>
            <li>Choose whether you need wristbands supplied.</li>
            <li>Your email app opens with the request ready for you to review and send.</li>
          </ol>
          <p>Required fields are marked with an asterisk.</p>
        </aside>

        <form className="event-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Event information</legend>
            <div className="form-grid">
              <div className="form-field form-field--wide">
                <label htmlFor="eventName">Event name <span aria-hidden="true">*</span></label>
                <input id="eventName" type="text" name="eventName" value={formData.eventName} onChange={handleInputChange} placeholder="e.g. Luvio Uni Mixer" required />
              </div>
              <div className="form-field">
                <label htmlFor="eventDate">Event date and time <span aria-hidden="true">*</span></label>
                <input id="eventDate" type="text" name="eventDate" value={formData.eventDate} onChange={handleInputChange} placeholder="When is it happening?" required />
              </div>
              <div className="form-field">
                <label htmlFor="eventLocation">Event location <span aria-hidden="true">*</span></label>
                <input id="eventLocation" type="text" name="eventLocation" value={formData.eventLocation} onChange={handleInputChange} placeholder="Venue, address or online" required />
              </div>
              <fieldset className="form-field form-field--wide choice-fieldset">
                <legend>Type of event</legend>
                <div className="choice-grid">
                  {[
                    ["social", "Social / Mixer"],
                    ["dating", "Dating"],
                    ["community", "Community / Club"],
                    ["other", "Other"],
                  ].map(([value, label]) => (
                    <label className="choice" key={value}>
                      <input type="radio" name="eventType" value={value} checked={formData.eventType === value} onChange={handleInputChange} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                {formData.eventType === "other" && (
                  <div className="form-field nested-field">
                    <label htmlFor="eventTypeOther">Please specify</label>
                    <input id="eventTypeOther" type="text" name="eventTypeOther" value={formData.eventTypeOther} onChange={handleInputChange} />
                  </div>
                )}
              </fieldset>
              <div className="form-field form-field--wide">
                <label htmlFor="guestCount">Estimated number of guests</label>
                <input id="guestCount" type="text" name="guestCount" value={formData.guestCount} onChange={handleInputChange} placeholder="A rough estimate is fine" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Wristbands</legend>
            <label className="choice choice--panel">
              <input
                type="checkbox"
                name="needWristbands"
                checked={formData.needWristbands}
                onChange={(event) => setFormData((current) => ({ ...current, needWristbands: event.target.checked }))}
              />
              <span><strong>We need wristbands supplied</strong><small>Tell us the quantity of each colour below.</small></span>
            </label>

            {formData.needWristbands && (
              <div className="wristband-fields">
                <div className="quantity-grid">
                  {[
                    ["redBands", "Red", "red"],
                    ["yellowBands", "Yellow", "yellow"],
                    ["greenBands", "Green", "green"],
                  ].map(([name, label, colour]) => (
                    <div className={`quantity-field quantity-field--${colour}`} key={name}>
                      <label htmlFor={name}>{label}</label>
                      <input id={name} type="number" name={name} value={formData[name as keyof typeof formData] as number} onChange={handleNumberChange} min="0" inputMode="numeric" />
                    </div>
                  ))}
                </div>
                <div className="form-field">
                  <label htmlFor="shippingAddress">Shipping address</label>
                  <textarea id="shippingAddress" name="shippingAddress" value={formData.shippingAddress} onChange={handleInputChange} placeholder="Only needed if we are sending wristbands" />
                </div>
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend>Contact details</legend>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="name">Your name <span aria-hidden="true">*</span></label>
                <input id="name" type="text" name="name" autoComplete="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-field">
                <label htmlFor="email">Your email <span aria-hidden="true">*</span></label>
                <input id="email" type="email" name="email" autoComplete="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-field form-field--wide">
                <label htmlFor="phone">Phone <span className="optional">Optional</span></label>
                <input id="phone" type="tel" name="phone" autoComplete="tel" value={formData.phone} onChange={handleInputChange} />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Anything else?</legend>
            <div className="form-field">
              <label htmlFor="extraInfo">Extra information <span className="optional">Optional</span></label>
              <textarea id="extraInfo" name="extraInfo" value={formData.extraInfo} onChange={handleInputChange} placeholder="Special requests, partnership ideas or anything else we should know" />
            </div>
          </fieldset>

          <div className="form-submit">
            <p>Your request is only sent after you review it in your email app.</p>
            <button className="button button--primary" type="submit">Prepare event request</button>
          </div>
          <p className="form-status" aria-live="polite">{submissionMessage}</p>
        </form>
      </div>
    </main>
  );
};

export default EventRequestForm;
