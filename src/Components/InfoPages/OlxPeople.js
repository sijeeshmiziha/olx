import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './InfoPages.css';

function OlxPeople() {
  return (
    <div className="infoPage">
      <Header />
      <div className="infoPageLayout">
        <div className="infoHero">
          <h1>OLX People</h1>
          <p>
            Meet the people behind OLX — the team and culture that make our
            marketplace a trusted place for millions.
          </p>
        </div>

        <div className="infoSection">
          <h2>Our Culture</h2>
          <p>
            We believe in ownership, collaboration, and putting our users first.
            Our teams work across product, engineering, design, and operations
            to build a safe and easy experience for buying and selling.
          </p>
        </div>

        <div className="infoSection">
          <h2>Leadership</h2>
          <p>
            Our leadership team brings experience from global tech and local
            markets, focused on growing OLX in a responsible and sustainable
            way.
          </p>
          <div className="infoGrid">
            <div className="infoCard">
              <h3>Product & Technology</h3>
              <p>
                Building a reliable, fast platform for millions of transactions.
              </p>
            </div>
            <div className="infoCard">
              <h3>Operations</h3>
              <p>Keeping the marketplace safe and trustworthy every day.</p>
            </div>
            <div className="infoCard">
              <h3>Growth & Marketing</h3>
              <p>
                Connecting more buyers and sellers in their local communities.
              </p>
            </div>
          </div>
        </div>

        <div className="infoSection">
          <h2>Employee Stories</h2>
          <p>
            Our people come from diverse backgrounds and bring different skills.
            What unites us is the mission to make local commerce simple and
            accessible for everyone.
          </p>
          <p>
            Interested in joining? Check out our{' '}
            <Link to="/careers" className="infoLink">
              Careers
            </Link>{' '}
            page.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default OlxPeople;
