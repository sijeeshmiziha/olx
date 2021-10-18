import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './InfoPages.css';

const faqItems = [
  {
    category: 'Buying',
    questions: [
      {
        q: 'How do I contact a seller?',
        a: 'Open the listing and use the "Chat" or "Contact" button to send a message. Always communicate through the OLX app or website for your safety.',
      },
      {
        q: 'How do I know if a seller is trustworthy?',
        a: "Check the seller's profile for ratings, member since date, and number of active listings. Meet in a safe, public place when possible.",
      },
    ],
  },
  {
    category: 'Selling',
    questions: [
      {
        q: 'How do I post an ad?',
        a: 'Click "Sell" in the header, choose a category, add photos and details, set your price, and publish. You can edit or delete the ad from My OLX.',
      },
      {
        q: 'How do I boost my ad?',
        a: 'From the Dashboard, go to My Ads, find your listing, and use the "Boost" option to get more visibility.',
      },
    ],
  },
  {
    category: 'Account',
    questions: [
      {
        q: 'How do I reset my password?',
        a: 'On the login page, use "Forgot password" and enter your email. You will receive a link to set a new password.',
      },
      {
        q: 'How do I delete my account?',
        a: 'Go to Profile > Settings (or Contact Us) and request account deletion. We will process it as per our Privacy Policy.',
      },
    ],
  },
  {
    category: 'Safety',
    questions: [
      {
        q: 'What should I do if I see a suspicious ad?',
        a: 'Use the "Report" option on the listing. We review reports and take action against policy violations.',
      },
      {
        q: 'Is it safe to pay in advance?',
        a: 'We recommend meeting in person and paying when you receive the item. Be cautious of requests for advance payment or wiring money.',
      },
    ],
  },
];

function HelpCenter() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  let id = 0;
  return (
    <div className="infoPage">
      <Header />
      <div className="infoPageLayout">
        <div className="infoHero">
          <h1>Help Centre</h1>
          <p>
            Find answers to common questions about buying, selling, and using
            OLX.
          </p>
        </div>

        <div className="infoSection">
          <h2>Search tips</h2>
          <p>
            Use the search bar on the homepage to find items by keyword. You can
            filter by location, category, and price. Save your searches from the
            search results page to get notified about new listings.
          </p>
        </div>

        <div className="infoSection">
          <h2>Frequently asked questions</h2>
          {faqItems.map(({ category, questions }) => (
            <div key={category}>
              <h3>{category}</h3>
              {questions.map(({ q, a }) => {
                const currentId = ++id;
                const isOpen = openId === currentId;
                return (
                  <div key={currentId}>
                    <button
                      type="button"
                      className="infoAccordionHeader"
                      onClick={() => toggle(currentId)}
                      aria-expanded={isOpen}
                    >
                      {q}
                    </button>
                    {isOpen && (
                      <div className="infoAccordionContent">
                        <p>{a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="infoSection">
          <h2>Still need help?</h2>
          <p>
            If you could not find your answer here, please{' '}
            <Link to="/contact" className="infoLink">
              contact us
            </Link>{' '}
            and we will get back to you as soon as possible.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HelpCenter;
