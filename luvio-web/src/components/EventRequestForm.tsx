import React, { useState, FormEvent } from "react";
import styled from "styled-components";

const FormContainer = styled.div`
  max-width: 800px;
  width: 100%;
  padding: 2rem;
  border-radius: 8px;
  background-color: #222;
  margin: 0 auto;
`;

const FormTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #e84118;
  text-align: center;
`;

const FormSection = styled.div`
  margin-bottom: 2.5rem;
  border-bottom: 1px solid #333;
  padding-bottom: 2rem;

  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  color: #e9e2c8;
`;

const FormGroup = styled.div`
  margin-bottom: 1.8rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.8rem;
  font-size: 1.2rem;
  color: #e9e2c8;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #444;
  background-color: #333;
  color: #e9e2c8;
  font-size: 1.1rem;

  &:focus {
    outline: none;
    border-color: #e84118;
    box-shadow: 0 0 0 2px rgba(232, 65, 24, 0.2);
  }

  &::placeholder {
    color: #666;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #444;
  background-color: #333;
  color: #e9e2c8;
  font-size: 1.1rem;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #e84118;
    box-shadow: 0 0 0 2px rgba(232, 65, 24, 0.2);
  }

  &::placeholder {
    color: #666;
  }
`;

const CheckboxGroup = styled.div`
  margin-bottom: 0.8rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  cursor: pointer;
  font-size: 1.1rem;
  color: #e9e2c8;
`;

const Checkbox = styled.input`
  margin-right: 0.8rem;
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: #e84118;
`;

const ColorBandInput = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const ColorEmoji = styled.span`
  margin-right: 0.8rem;
  font-size: 1.5rem;
`;

const NumberInput = styled.input`
  width: 80px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #444;
  background-color: #333;
  color: #e9e2c8;
  margin-left: 0.8rem;
  font-size: 1.1rem;

  &:focus {
    outline: none;
    border-color: #e84118;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
`;

const SubmitButton = styled.button`
  background-color: #e84118;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 14px 32px;
  font-size: 1.3rem;
  cursor: pointer;
  transition: background-color 0.3s;
  display: block;
  margin: 0 auto;
  font-weight: bold;
  text-transform: uppercase;

  &:hover {
    background-color: #c23616;
  }

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const RequiredIndicator = styled.span`
  color: #e84118;
  margin-left: 5px;
`;

const EventRequestForm = () => {
  const [formData, setFormData] = useState({
    // Event Information
    eventName: "",
    eventDate: "",
    eventLocation: "",
    eventType: "",
    eventTypeOther: "",
    guestCount: "",

    // Wristbands
    needWristbands: false,
    redBands: 0,
    yellowBands: 0,
    greenBands: 0,
    shippingAddress: "",

    // Contact Details
    name: "",
    email: "",
    phone: "",

    // Extra Info
    extraInfo: "",
  });

  const [eventTypeChecked, setEventTypeChecked] = useState({
    social: false,
    dating: false,
    community: false,
    other: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    if (name === "needWristbands") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (name.startsWith("eventType-")) {
      const eventType = name.replace("eventType-", "");
      setEventTypeChecked({
        ...eventTypeChecked,
        [eventType]: checked,
      });

      if (eventType !== "other") {
        setFormData({
          ...formData,
          eventType: checked ? eventType : "",
        });
      } else {
        setFormData({
          ...formData,
          eventType: checked ? "other" : "",
        });
      }
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value) || 0,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Required fields validation
    if (
      !formData.eventName ||
      !formData.eventDate ||
      !formData.eventLocation ||
      !formData.name ||
      !formData.email
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Create email body
    let emailBody = `🎉 EVENT INFORMATION\n`;
    emailBody += `Event Name: ${formData.eventName}\n`;
    emailBody += `Event Date & Time: ${formData.eventDate}\n`;
    emailBody += `Event Location: ${formData.eventLocation}\n`;

    // Event Type
    emailBody += `Type of Event: `;
    if (eventTypeChecked.social) emailBody += "Social / Mixer\n";
    else if (eventTypeChecked.dating) emailBody += "Dating\n";
    else if (eventTypeChecked.community) emailBody += "Community / Club\n";
    else if (eventTypeChecked.other)
      emailBody += `Other: ${formData.eventTypeOther}\n`;
    else emailBody += "Not specified\n";

    emailBody += `Estimated Number of Guests: ${formData.guestCount}\n\n`;

    // Wristbands
    emailBody += `🎟️ WRISTBANDS\n`;
    emailBody += `Need wristbands: ${formData.needWristbands ? "Yes" : "No"}\n`;

    if (formData.needWristbands) {
      emailBody += `Red bands: ${formData.redBands}\n`;
      emailBody += `Yellow bands: ${formData.yellowBands}\n`;
      emailBody += `Green bands: ${formData.greenBands}\n`;
      emailBody += `Shipping Address: ${formData.shippingAddress}\n\n`;
    }

    // Contact Details
    emailBody += `👤 CONTACT DETAILS\n`;
    emailBody += `Name: ${formData.name}\n`;
    emailBody += `Email: ${formData.email}\n`;
    emailBody += `Phone: ${formData.phone || "Not provided"}\n\n`;

    // Extra Info
    if (formData.extraInfo) {
      emailBody += `📝 EXTRA INFO\n${formData.extraInfo}\n`;
    }

    // Encode for mailto
    const encodedBody = encodeURIComponent(emailBody);
    const subject = encodeURIComponent(`Event Request: ${formData.eventName}`);

    // Open mailto link
    window.location.href = `mailto:Luvioband@outlook.com?subject=${subject}&body=${encodedBody}`;
  };

  return (
    <FormContainer>
      <FormTitle>Event Request Form</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>🎉 Event Information</SectionTitle>

          <FormGroup>
            <Label>
              Event Name <RequiredIndicator>*</RequiredIndicator>
            </Label>
            <Input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              placeholder="e.g. Luvio Uni Mixer"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              Event Date & Time <RequiredIndicator>*</RequiredIndicator>
            </Label>
            <Input
              type="text"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleInputChange}
              placeholder="When is it happening?"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              Event Location <RequiredIndicator>*</RequiredIndicator>
            </Label>
            <Input
              type="text"
              name="eventLocation"
              value={formData.eventLocation}
              onChange={handleInputChange}
              placeholder="Venue name or address (or 'online')"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Type of Event</Label>
            <CheckboxGroup>
              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  name="eventType-social"
                  checked={eventTypeChecked.social}
                  onChange={handleCheckboxChange}
                />
                Social / Mixer
              </CheckboxLabel>

              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  name="eventType-dating"
                  checked={eventTypeChecked.dating}
                  onChange={handleCheckboxChange}
                />
                Dating
              </CheckboxLabel>

              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  name="eventType-community"
                  checked={eventTypeChecked.community}
                  onChange={handleCheckboxChange}
                />
                Community / Club
              </CheckboxLabel>

              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  name="eventType-other"
                  checked={eventTypeChecked.other}
                  onChange={handleCheckboxChange}
                />
                Other:
                <Input
                  type="text"
                  name="eventTypeOther"
                  value={formData.eventTypeOther}
                  onChange={handleInputChange}
                  placeholder="Please specify"
                  style={{ width: "200px", marginLeft: "10px" }}
                  disabled={!eventTypeChecked.other}
                />
              </CheckboxLabel>
            </CheckboxGroup>
          </FormGroup>

          <FormGroup>
            <Label>Estimated Number of Guests</Label>
            <Input
              type="text"
              name="guestCount"
              value={formData.guestCount}
              onChange={handleInputChange}
              placeholder="Rough guess is fine"
            />
          </FormGroup>
        </FormSection>

        <FormSection>
          <SectionTitle>🎟️ Wristbands</SectionTitle>

          <FormGroup>
            <Label>Do you need wristbands provided?</Label>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                name="needWristbands"
                checked={formData.needWristbands}
                onChange={handleCheckboxChange}
              />
              Yes, we need wristbands
            </CheckboxLabel>
          </FormGroup>

          {formData.needWristbands && (
            <>
              <FormGroup>
                <Label>How many of each color?</Label>
                <ColorBandInput>
                  <ColorEmoji>🔴</ColorEmoji> Red
                  <NumberInput
                    type="number"
                    name="redBands"
                    value={formData.redBands}
                    onChange={handleNumberChange}
                    min="0"
                  />
                </ColorBandInput>

                <ColorBandInput>
                  <ColorEmoji>🟡</ColorEmoji> Yellow
                  <NumberInput
                    type="number"
                    name="yellowBands"
                    value={formData.yellowBands}
                    onChange={handleNumberChange}
                    min="0"
                  />
                </ColorBandInput>

                <ColorBandInput>
                  <ColorEmoji>🟢</ColorEmoji> Green
                  <NumberInput
                    type="number"
                    name="greenBands"
                    value={formData.greenBands}
                    onChange={handleNumberChange}
                    min="0"
                  />
                </ColorBandInput>
              </FormGroup>

              <FormGroup>
                <Label>Shipping Address</Label>
                <TextArea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  placeholder="Only if we're sending wristbands"
                />
              </FormGroup>
            </>
          )}
        </FormSection>

        <FormSection>
          <SectionTitle>👤 Contact Details</SectionTitle>

          <FormGroup>
            <Label>
              Your Name <RequiredIndicator>*</RequiredIndicator>
            </Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              Your Email <RequiredIndicator>*</RequiredIndicator>
            </Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Phone (optional)</Label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </FormGroup>
        </FormSection>

        <FormSection>
          <SectionTitle>📝 Extra Info (Optional)</SectionTitle>

          <FormGroup>
            <Label>Anything else you'd like us to know?</Label>
            <TextArea
              name="extraInfo"
              value={formData.extraInfo}
              onChange={handleInputChange}
              placeholder="Special requests, partnership ideas, etc."
            />
          </FormGroup>
        </FormSection>

        <SubmitButton type="submit">Submit Request</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default EventRequestForm;
