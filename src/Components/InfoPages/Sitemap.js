import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './InfoPages.css';

const sitemapGroups = [
  {
    title: 'Main',
    links: [
      { to: '/', label: 'Home' },
      { to: '/search', label: 'Search' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/login', label: 'Login' },
      { to: '/signup', label: 'Sign up' },
      { to: '/dashboard', label: 'My OLX / Dashboard' },
      { to: '/create', label: 'Create listing' },
    ],
  },
  {
    title: 'User',
    links: [
      { to: '/messages', label: 'Messages' },
      { to: '/notifications', label: 'Notifications' },
    ],
  },
  {
    title: 'About & support',
    links: [
      { to: '/about', label: 'About OLX Group' },
      { to: '/careers', label: 'Careers' },
      { to: '/contact', label: 'Contact Us' },
      { to: '/people', label: 'OLX People' },
      { to: '/help', label: 'Help' },
      { to: '/legal', label: 'Legal & Privacy' },
    ],
  },
];

function Sitemap() {
  return (
    <div className="infoPage">
      <Header />
      <div className="infoPageLayout">
        <div className="infoHero">
          <h1>Sitemap</h1>
          <p>Find all main sections and pages on OLX in one place.</p>
        </div>

        <div className="infoSection">
          {sitemapGroups.map((group) => (
            <div key={group.title} className="sitemapGroup">
              <h3>{group.title}</h3>
              <ul>
                {group.links.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Sitemap;
