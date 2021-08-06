import React from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import AnalyticsSummary from '../Analytics/AnalyticsSummary';
import MyOffers from '../Offers/MyOffers';
import ReceivedOffers from '../Offers/ReceivedOffers';
import '../Profile/Profile.css';
import SavedSearches from '../Search/SavedSearches';
import WatchlistPage from '../Watchlist/WatchlistPage';
import './Dashboard.css';
import MyAds from './MyAds';
import SavedAds from './SavedAds';
import Settings from './Settings';

function Dashboard() {
  return (
    <div className="profilePage">
      <AnalyticsSummary />
      <nav className="dashboardTabs">
        <NavLink
          exact
          to="/dashboard"
          className="dashboardTab"
          activeClassName="active"
        >
          My Ads
        </NavLink>
        <NavLink
          to="/dashboard/saved"
          className="dashboardTab"
          activeClassName="active"
        >
          Saved Ads
        </NavLink>
        <NavLink
          to="/dashboard/offers"
          className="dashboardTab"
          activeClassName="active"
        >
          Offers
        </NavLink>
        <NavLink
          to="/dashboard/watchlist"
          className="dashboardTab"
          activeClassName="active"
        >
          Watchlist
        </NavLink>
        <NavLink
          to="/dashboard/saved-searches"
          className="dashboardTab"
          activeClassName="active"
        >
          Saved searches
        </NavLink>
        <NavLink
          to="/dashboard/transactions"
          className="dashboardTab"
          activeClassName="active"
        >
          Transactions
        </NavLink>
        <NavLink
          to="/dashboard/addresses"
          className="dashboardTab"
          activeClassName="active"
        >
          Addresses
        </NavLink>
        <NavLink
          to="/dashboard/settings"
          className="dashboardTab"
          activeClassName="active"
        >
          Settings
        </NavLink>
      </nav>
      <div className="dashboardContent">
        <Switch>
          <Route exact path="/dashboard" component={MyAds} />
          <Route path="/dashboard/saved" component={SavedAds} />
          <Route path="/dashboard/offers" component={OffersDashboard} />
          <Route path="/dashboard/watchlist" component={WatchlistPage} />
          <Route path="/dashboard/saved-searches" component={SavedSearches} />
          <Route path="/dashboard/settings" component={Settings} />
        </Switch>
      </div>
    </div>
  );
}

function OffersDashboard() {
  return (
    <>
      <nav className="dashboardTabs dashboardTabsSub">
        <NavLink
          exact
          to="/dashboard/offers"
          className="dashboardTab"
          activeClassName="active"
        >
          Sent
        </NavLink>
        <NavLink
          to="/dashboard/offers/received"
          className="dashboardTab"
          activeClassName="active"
        >
          Received
        </NavLink>
      </nav>
      <Switch>
        <Route exact path="/dashboard/offers" component={MyOffers} />
        <Route path="/dashboard/offers/received" component={ReceivedOffers} />
      </Switch>
    </>
  );
}

export default Dashboard;
