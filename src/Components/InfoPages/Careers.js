import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './InfoPages.css';

function Careers() {
  return (
    <div className="infoPage">
      <Header />
      <div className="infoPageLayout">
        <div className="infoHero">
          <h1>Careers at OLX</h1>
          <p>
            Join us in building the future of local commerce. We are looking for
            passionate people who want to make an impact.
          </p>
        </div>

        <div className="infoSection">
          <h2>Why Join OLX</h2>
          <p>
            We offer a dynamic environment where you can grow, learn, and work
            on products that touch millions of users every day.
          </p>
          <div className="infoGrid">
            <div className="infoCard">
              <h3>Growth</h3>
              <p>Learn from experts and take on new challenges every day.</p>
            </div>
            <div className="infoCard">
              <h3>Impact</h3>
              <p>Your work directly helps millions of buyers and sellers.</p>
            </div>
            <div className="infoCard">
              <h3>Culture</h3>
              <p>Collaborative, inclusive, and driven by our values.</p>
            </div>
          </div>
        </div>

        <div className="infoSection">
          <h2>Job Categories</h2>
          <p>
            We hire across engineering, product, design, operations, and more.
          </p>
          <ul>
            <li>Engineering & Technology</li>
            <li>Product Management</li>
            <li>Design (UX/UI)</li>
            <li>Marketing</li>
            <li>Customer Support</li>
            <li>Operations</li>
          </ul>
        </div>

        <div className="infoSection">
          <h2>Open Positions</h2>
          <p>
            Check back soon for open roles, or send your resume to
            careers@olx.com.
          </p>
          <p>
            We are always interested in meeting talented people. Even if there
            is no perfect match today, we would love to hear from you.
          </p>
        </div>

        <div className="infoSection">
          <h2>Benefits</h2>
          <ul>
            <li>Competitive salary and equity</li>
            <li>Health and wellness programs</li>
            <li>Flexible work arrangements</li>
            <li>Learning and development budget</li>
            <li>Team events and offsites</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Careers;
