import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './InfoPages.css';

function AboutOlxGroup() {
  return (
    <div className="infoPage">
      <Header />
      <div className="infoPageLayout">
        <div className="infoHero">
          <h1>About OLX Group</h1>
          <p>
            OLX Group connects local people to buy, sell or exchange used goods
            and services, making it easy for everyone to find what they need.
          </p>
        </div>

        <div className="infoSection">
          <h2>Our Mission</h2>
          <p>
            We help people upgrade their lives by making it simple to buy and
            sell locally. Whether you are decluttering, upgrading, or finding a
            deal, OLX is the trusted marketplace that brings buyers and sellers
            together.
          </p>
        </div>

        <div className="infoSection">
          <h2>Global Presence</h2>
          <p>
            OLX operates in multiple countries, serving millions of users. Our
            platform is available across India, Pakistan, and other markets,
            with a focus on local, trusted transactions.
          </p>
          <div className="infoGrid">
            <div className="infoCard">
              <h3>Markets</h3>
              <p>Active in multiple countries with localized experiences.</p>
            </div>
            <div className="infoCard">
              <h3>Users</h3>
              <p>Millions of people use OLX to buy and sell every month.</p>
            </div>
            <div className="infoCard">
              <h3>Listings</h3>
              <p>From electronics to vehicles to household items and more.</p>
            </div>
          </div>
        </div>

        <div className="infoSection">
          <h2>Our Values</h2>
          <ul>
            <li>
              <strong>Trust:</strong> We build a safe environment for local
              trading.
            </li>
            <li>
              <strong>Simplicity:</strong> Easy to list, search, and connect.
            </li>
            <li>
              <strong>Local first:</strong> We empower local communities and
              economies.
            </li>
            <li>
              <strong>Innovation:</strong> We keep improving the experience for
              buyers and sellers.
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AboutOlxGroup;
