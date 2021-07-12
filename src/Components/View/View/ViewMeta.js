import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { sanitizeForJsonLd } from '../../../utils/sanitize';

export default function ViewMeta({ postContent, imageList }) {
  const safeName = sanitizeForJsonLd(postContent.name, 200);
  const safeDescription = sanitizeForJsonLd(postContent.description, 160)
    || sanitizeForJsonLd(`${postContent.name} - ${postContent.category}`, 160);
  const pageTitle = `${safeName} - OLX`;
  const pageDescription = safeDescription;
  const ogImage = imageList[0] || '';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: safeName,
    description: pageDescription,
    image: Array.isArray(imageList) ? imageList : [],
    category: sanitizeForJsonLd(postContent.category, 100),
    offers: { '@type': 'Offer', price: postContent.price, priceCurrency: 'INR' },
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <nav className="viewBreadcrumb">
        <Link to="/">Home</Link>
        <span className="viewBreadcrumbSep">›</span>
        {postContent.category && (
          <Link to={`/search?category=${encodeURIComponent(postContent.category)}`}>{postContent.category}</Link>
        )}
        <span className="viewBreadcrumbSep">›</span>
        <span className="viewBreadcrumbCurrent">{postContent.name}</span>
      </nav>
    </>
  );
}
