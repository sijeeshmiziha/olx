import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Banner from '../Components/Banner/Banner';
import CategoryGrid from '../Components/Home/CategoryGrid';
import LocationBanner from '../Components/Home/LocationBanner';
import QuickMenu from '../Components/Home/QuickMenu';
import Layout from '../Components/Layout/Layout';
import NearbyAds from '../Components/Location/NearbyAds';
import Posts from '../Components/Posts/Posts';
import { LocationContext } from '../contextStore/LocationContext';
import { Firebase } from '../firebase/config';
import { seededShuffle } from '../utils/seededShuffle';
import './Home.css';

const QUICK_MENU_COUNT = 8;

/**
 * Sort products by admin-assigned marketingScore (desc) then by createdAt (desc).
 * Products with a higher marketingScore appear first in the Quick Menu.
 * Products without a score default to 0 and fall back to chronological order.
 * The marketingScore field (0–100) is set by admins via Firebase Console.
 */
function sortByMarketingScore(list) {
  return [...list].sort((a, b) => {
    const scoreA = Number(a.marketingScore) || 0;
    const scoreB = Number(b.marketingScore) || 0;
    if (scoreA !== scoreB) return scoreB - scoreA;
    // Same score — newest first
    const dateA = a.createdAt?.toDate
      ? a.createdAt.toDate()
      : new Date(a.createdAt || 0);
    const dateB = b.createdAt?.toDate
      ? b.createdAt.toDate()
      : new Date(b.createdAt || 0);
    return dateB - dateA;
  });
}

function Home() {
  const { browseLocation } = useContext(LocationContext);
  const history = useHistory();
  const [visitSeed] = useState(() => Date.now());
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    setProductsLoading(true);
    Firebase.firestore()
      .collection('products')
      .where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .get()
      .then((snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAllProducts(list);
      })
      .catch(() => setAllProducts([]))
      .finally(() => setProductsLoading(false));
  }, []);

  // Quick Menu: top candidates by marketingScore, then time-seeded shuffle for variety per visit
  const quickMenuProducts = seededShuffle(
    sortByMarketingScore(allProducts).slice(0, QUICK_MENU_COUNT * 2),
    visitSeed
  ).slice(0, QUICK_MENU_COUNT);

  // Fresh Recommendations: time-seeded shuffle so order varies per visit
  const freshProducts = seededShuffle(allProducts, visitSeed);

  return (
    <Layout>
      <div className="homeParentDiv">
        <LocationBanner />
        <CategoryGrid
          onSelectCategory={(name, id) =>
            history.push(
              id ? `/category/${id}` : `/search?q=${encodeURIComponent(name)}`
            )
          }
        />
        <Banner />
        <QuickMenu products={quickMenuProducts} loading={productsLoading} />
        <Posts
          allPosts={allProducts}
          freshPosts={freshProducts}
          loading={productsLoading}
        />
        {browseLocation?.city && (
          <NearbyAds
            city={browseLocation.city}
            state={browseLocation.state}
            limit={8}
          />
        )}
      </div>
    </Layout>
  );
}

export default Home;
