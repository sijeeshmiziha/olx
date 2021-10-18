import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './InfoPages.css';

function LegalPrivacy() {
  return (
    <div className="infoPage">
      <Header />
      <div className="infoPageLayout">
        <div className="infoHero">
          <h1>Legal & Privacy</h1>
          <p>Terms of Service, Privacy Policy, and Cookie Policy for OLX.</p>
        </div>

        <div className="infoSection">
          <nav className="legalNav" aria-label="Legal sections">
            <a href="#terms">Terms of Service</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#cookies">Cookie Policy</a>
          </nav>
        </div>

        <div id="terms" className="infoSection">
          <h2>Terms of Service</h2>
          <p>
            By using OLX, you agree to these Terms of Service. Please read them
            carefully.
          </p>
          <h3>1. Use of the service</h3>
          <p>
            OLX provides a platform for users to list, browse, and exchange
            goods and services. You must be at least 18 years old (or the age of
            majority in your country) to use the service. You are responsible
            for your account and the content you post.
          </p>
          <h3>2. Listings and conduct</h3>
          <p>
            You may not list prohibited items or use the platform for illegal
            activity. You must provide accurate descriptions and comply with
            local laws. OLX may remove content that violates our policies.
          </p>
          <h3>3. Transactions</h3>
          <p>
            OLX is a venue for connecting buyers and sellers. We are not a party
            to transactions between users. You are responsible for your own
            dealings, including payment and delivery. Use caution and meet in
            safe, public places when possible.
          </p>
          <h3>4. Intellectual property</h3>
          <p>
            The OLX name, logo, and related marks are owned by OLX Group. You
            may not use them without our written permission. You retain
            ownership of content you post and grant us a license to use it to
            operate the service.
          </p>
        </div>

        <div id="privacy" className="infoSection">
          <h2>Privacy Policy</h2>
          <p>
            We care about your privacy. This policy explains what data we
            collect and how we use it.
          </p>
          <h3>Information we collect</h3>
          <p>
            We collect information you provide (e.g. account details, listings,
            messages), information from your use of the service (e.g. device,
            IP, browsing behaviour), and information from third parties where
            applicable (e.g. login via social providers).
          </p>
          <h3>How we use it</h3>
          <p>
            We use your information to provide and improve the service,
            personalize your experience, communicate with you, ensure safety and
            security, and comply with legal obligations.
          </p>
          <h3>Sharing</h3>
          <p>
            We may share data with service providers who help us operate the
            platform, with other users as part of the service (e.g. your profile
            to buyers/sellers), and when required by law.
          </p>
          <h3>Your rights</h3>
          <p>
            Depending on your location, you may have rights to access, correct,
            delete, or port your data, or to object to or restrict certain
            processing. Contact us to exercise these rights.
          </p>
        </div>

        <div id="cookies" className="infoSection">
          <h2>Cookie Policy</h2>
          <p>
            We use cookies and similar technologies to run the service and
            improve your experience.
          </p>
          <h3>What we use</h3>
          <p>
            We use essential cookies (e.g. to keep you logged in), functional
            cookies (e.g. preferences), and analytics cookies (to understand how
            the service is used and improve it).
          </p>
          <h3>Managing cookies</h3>
          <p>
            You can control cookies through your browser settings. Disabling
            some cookies may affect the functionality of the site.
          </p>
        </div>

        <div className="infoSection">
          <p>
            For questions about these policies, please{' '}
            <Link to="/contact" className="infoLink">
              contact us
            </Link>
            .
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LegalPrivacy;
