import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import { getProductRef } from '../firebase/collections';
import { formatPrice } from '../utils/formatters';
import './Compare.css';

function Compare() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = location.search
      ? new URLSearchParams(location.search).get('ids')?.split(',').slice(0, 3) || []
      : location.state?.ids?.slice(0, 3) || [];
    if (ids.length === 0) {
      setLoading(false);
      return;
    }
    Promise.all(ids.map((id) => getProductRef(id.trim()).get()))
      .then((docs) => {
        setProducts(
          docs
            .filter((d) => d.exists)
            .map((d) => ({ id: d.id, ...d.data() }))
        );
      })
      .finally(() => setLoading(false));
  }, [location.search, location.state]);

  return (
    <Layout>
      <div className="comparePage">
        <h1>Compare ads</h1>
        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>Add ad IDs in the URL: /compare?ids=id1,id2</p>
        ) : (
          <div className="compareGrid">
            {products.map((p) => (
              <div key={p.id} className="compareCard">
                <Link to={`/ad/${p.id}`} className="compareCardImage">
                  <img src={p.images?.[0] || p.url} alt="" />
                </Link>
                <h3 className="compareCardTitle">{p.name}</h3>
                <p className="compareCardPrice">{formatPrice(p.price)}</p>
                <p className="compareCardMeta">
                  {p.category}
                  {p.condition && ` · ${p.condition}`}
                </p>
                <Link to={`/ad/${p.id}`}>View ad</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Compare;
