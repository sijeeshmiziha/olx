import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Firebase } from '../../firebase/config';
import PostCards from '../PostCards/PostCards';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import { CardSkeleton } from '../UI/Skeleton';
import { CATEGORIES, getSubcategories } from '../../data/categories';
import './CategoryPage.css';

function CategoryPage() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subcategory, setSubcategory] = useState('');

  const category = CATEGORIES.find(
    (c) =>
      c.id === categoryId ||
      c.name.toLowerCase().replace(/\s+/g, '-') === categoryId
  );
  const categoryName = category?.name || categoryId;
  const subcategories =
    category?.subcategories || getSubcategories(categoryName) || [];

  useEffect(() => {
    setLoading(true);
    Firebase.firestore()
      .collection('products')
      .where('category', '==', categoryName)
      .where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .get()
      .then((snapshot) => {
        let list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (subcategory) {
          list = list.filter(
            (p) => (p.subcategory || '').trim() === subcategory
          );
        }
        setProducts(list);
      })
      .finally(() => setLoading(false));
  }, [categoryName, subcategory]);

  const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: categoryName, to: `/category/${categoryId}` },
    ...(subcategory ? [{ label: subcategory }] : []),
  ].filter((item) => item.label);

  if (!category && !categoryId) {
    return null;
  }

  return (
    <div className="categoryPageWrap">
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="categoryPageTitle">{categoryName}</h1>
      {subcategories.length > 0 && (
        <div className="categoryPageTabs">
          <button
            type="button"
            className={`categoryPageTab ${!subcategory ? 'active' : ''}`}
            onClick={() => setSubcategory('')}
          >
            All
          </button>
          {subcategories.map((sub) => (
            <button
              type="button"
              key={sub}
              className={`categoryPageTab ${subcategory === sub ? 'active' : ''}`}
              onClick={() => setSubcategory(sub)}
            >
              {sub}
            </button>
          ))}
        </div>
      )}
      <div
        className={`categoryPageGrid ${!loading && products.length > 0 ? 'olxFadeIn' : ''}`}
      >
        {loading ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map((i) => <CardSkeleton key={i} />)
        ) : products.length === 0 ? (
          <p className="categoryPageEmpty">No ads in this category yet.</p>
        ) : (
          products.map((product, index) => (
            <div key={product.id || index} className="categoryPageCard">
              <PostCards product={product} index={index} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
