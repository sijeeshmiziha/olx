import React, { useState, useContext } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { ToastContext } from '../../contextStore/ToastContext';
import './InfoPages.css';

function ContactUs() {
  const { addToast } = useContext(ToastContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder: in production would send to backend or email service
    addToast('Thank you for your message. We will get back to you soon.', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="infoPage">
      <Header />
      <div className="infoPageLayout">
        <div className="infoHero">
          <h1>Contact Us</h1>
          <p>Have a question or feedback? We would love to hear from you.</p>
        </div>

        <div className="infoSection">
          <h2>Send us a message</h2>
          <form className="infoForm" onSubmit={handleSubmit}>
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your name"
            />
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
            <label htmlFor="contact-subject">Subject</label>
            <select
              id="contact-subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">Select a subject</option>
              <option value="general">General enquiry</option>
              <option value="support">Account or listing support</option>
              <option value="safety">Safety or reporting</option>
              <option value="business">Business / partnerships</option>
              <option value="other">Other</option>
            </select>
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Your message..."
            />
            <button type="submit" className="infoBtn">
              Send message
            </button>
          </form>
        </div>

        <div className="infoSection">
          <h2>Other ways to reach us</h2>
          <p>
            <strong>Support:</strong> For help with your account or listings,
            use the Help Centre or in-app support.
          </p>
          <p>
            <strong>Office:</strong> OLX Group, India. For formal
            correspondence, please use the contact form above.
          </p>
          <p>
            <strong>Social:</strong> Follow us for updates and community news.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ContactUs;
