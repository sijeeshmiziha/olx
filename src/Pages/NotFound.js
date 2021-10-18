import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import './NotFound.css';

function NotFound() {
  return (
    <Layout>
      <div className="notFoundWrap">
        <h1>404</h1>
        <p>Page not found</p>
        <Link to="/" className="notFoundLink">
          Go to Home
        </Link>
      </div>
    </Layout>
  );
}

export default NotFound;
