import { FormEvent } from 'react';
import { Mail, MapPin, Phone, Send, Star } from 'lucide-react';

const COMPANY_EMAIL = 'info@napco.lk';
const COMPANY_PHONE = '+94112910015';

function buildMailto(subject: string, body: string) {
  return `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

export default function ContactFormSection() {
  const handleFeedbackSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get('feedbackName') || '');
    const email = String(formData.get('feedbackEmail') || '');
    const rating = String(formData.get('feedbackRating') || 'Not selected');
    const message = String(formData.get('feedbackMessage') || '');

    const subject = `NAPCO Website Feedback - ${rating} Stars`;

    const body = `
Feedback Submission

Name: ${name}
Email: ${email}
Rating: ${rating} Stars

Message:
${message}
    `.trim();

    window.location.href = buildMailto(subject, body);
  };

  const handleEnquirySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get('enquiryName') || '');
    const email = String(formData.get('enquiryEmail') || '');
    const phone = String(formData.get('enquiryPhone') || '');
    const service = String(formData.get('enquiryService') || '');
    const message = String(formData.get('enquiryMessage') || '');

    const subject = `NAPCO Website Enquiry - ${service || 'General Enquiry'}`;

    const body = `
Enquiry Submission

Name: ${name}
Email: ${email}
Phone: ${phone}
Service Interested In: ${service}

Message:
${message}
    `.trim();

    window.location.href = buildMailto(subject, body);
  };

  return (
    <section className="contact-form-section" id="contact-form">
      <div className="contact-form-section__bg" />

      <div className="contact-form-section__inner">
        <div className="contact-form-section__heading" data-reveal>
          <span>Get in Touch</span>

          <h2>
            Send feedback
            <br />
            or make an enquiry.
          </h2>

          <p>
            Whether you want to share your experience or discuss a new printing
            project, NAPCO is ready to connect with you.
          </p>
        </div>

        <div className="contact-info-cards" data-reveal>
          <a href={`tel:${COMPANY_PHONE}`} className="contact-info-card">
            <span>
              <Phone size={24} />
            </span>

            <div>
              <small>Phone</small>
              <strong>+94 11 2910015</strong>
            </div>
          </a>

          <a href={`mailto:${COMPANY_EMAIL}`} className="contact-info-card">
            <span>
              <Mail size={24} />
            </span>

            <div>
              <small>Email</small>
              <strong>info@napco.lk</strong>
            </div>
          </a>

          <div className="contact-info-card">
            <span>
              <MapPin size={24} />
            </span>

            <div>
              <small>Address</small>
              <strong>
                No. 17, Fathima Mawatha, Off Makola Road, Kiribathgoda, Sri
                Lanka.
              </strong>
            </div>
          </div>
        </div>

        <div className="contact-forms-grid">
          <form
            className="contact-form-card"
            onSubmit={handleFeedbackSubmit}
            data-reveal
          >
            <div className="contact-form-card__top">
              <span>Feedback</span>
              <h3>Share your experience</h3>
              <p>
                Tell us how we did. Your feedback helps us improve our printing
                quality and customer service.
              </p>
            </div>

            <div className="contact-form-card__fields">
              <label>
                Your Name
                <input
                  type="text"
                  name="feedbackName"
                  placeholder="Enter your name"
                  required
                />
              </label>

              <label>
                Email Address
                <input
                  type="email"
                  name="feedbackEmail"
                  placeholder="Enter your email"
                  required
                />
              </label>

              <div className="contact-rating">
                <small>Your Rating</small>

                <div className="contact-rating__stars">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating}>
                      <input
                        type="radio"
                        name="feedbackRating"
                        value={rating}
                        required
                      />
                      <Star size={28} />
                    </label>
                  ))}
                </div>
              </div>

              <label>
                Feedback Message
                <textarea
                  name="feedbackMessage"
                  placeholder="Write your feedback here"
                  rows={6}
                  required
                />
              </label>
            </div>

            <button type="submit" className="contact-form-card__button">
              Send Feedback
              <Send size={18} />
            </button>
          </form>

          <form
            className="contact-form-card contact-form-card--enquiry"
            onSubmit={handleEnquirySubmit}
            data-reveal
          >
            <div className="contact-form-card__top">
              <span>Enquiry</span>
              <h3>Request a print quote</h3>
              <p>
                Send us your project details for newspapers, books, brochures,
                labels, annual reports, calendars, diaries or packaging work.
              </p>
            </div>

            <div className="contact-form-card__fields">
              <label>
                Your Name
                <input
                  type="text"
                  name="enquiryName"
                  placeholder="Enter your name"
                  required
                />
              </label>

              <div className="contact-form-card__split">
                <label>
                  Email Address
                  <input
                    type="email"
                    name="enquiryEmail"
                    placeholder="Enter your email"
                    required
                  />
                </label>

                <label>
                  Phone Number
                  <input
                    type="tel"
                    name="enquiryPhone"
                    placeholder="Enter your phone"
                  />
                </label>
              </div>

              <label>
                Service Type
                <select name="enquiryService" required defaultValue="">
                  <option value="" disabled>
                    Select a service
                  </option>
                  <option value="Newspaper Printing">
                    Newspaper Printing
                  </option>
                  <option value="Books and Publishing">
                    Books and Publishing
                  </option>
                  <option value="Brochures and Catalogues">
                    Brochures and Catalogues
                  </option>
                  <option value="Posters and Leaflets">
                    Posters and Leaflets
                  </option>
                  <option value="Calendars and Diaries">
                    Calendars and Diaries
                  </option>
                  <option value="Labels and Annual Reports">
                    Labels and Annual Reports
                  </option>
                  <option value="Commercial Printing">
                    Commercial Printing
                  </option>
                  <option value="Printing and Packaging">
                    Printing and Packaging
                  </option>
                </select>
              </label>

              <label>
                Enquiry Message
                <textarea
                  name="enquiryMessage"
                  placeholder="Tell us about your printing requirement"
                  rows={6}
                  required
                />
              </label>
            </div>

            <button type="submit" className="contact-form-card__button">
              Send Enquiry
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}