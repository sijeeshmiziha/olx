import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Post.css';
import { Firebase } from '../../firebase/config';
import { CardSkeleton } from '../UI/Skeleton';
import PostCards from '../PostCards/PostCards';
import { AllPostContext } from '../../contextStore/AllPostContext';

const INITIAL_COUNT = 8;
const LOAD_MORE_COUNT = 8;

function Posts({
  allPosts: allPostsProp,
  freshPosts: freshPostsProp,
  loading: loadingProp,
}) {
  const { setAllPost } = useContext(AllPostContext);
  const [postsDesc, setPostsDesc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const fromHome = allPostsProp != null;

  useEffect(() => {
    if (fromHome) {
      setAllPost(allPostsProp || []);
      setLoading(loadingProp);
    } else {
      setLoading(true);
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
          setPostsDesc(list);
          setAllPost(list);
          setLoading(false);
        });
    }
  }, [fromHome, allPostsProp, loadingProp, setAllPost]);

  const listForDisplay = useMemo(
    () => (fromHome ? freshPostsProp || [] : postsDesc),
    [fromHome, freshPostsProp, postsDesc]
  );
  const visiblePosts = useMemo(
    () => listForDisplay.slice(0, visibleCount),
    [listForDisplay, visibleCount]
  );
  const hasMore = visibleCount < listForDisplay.length;

  const handleLoadMore = () => {
    setVisibleCount((c) =>
      Math.min(c + LOAD_MORE_COUNT, listForDisplay.length)
    );
  };

  const cards = visiblePosts.map((product, index) => (
    <div className="freshRecommendationCard" key={product.id || index}>
      <PostCards product={product} index={index} />
    </div>
  ));

  return (
    <div className="postParentDiv">
      <div className="recommendations">
        <div className="recommendationsHeading">
          <span>Fresh recommendations</span>
          <Link to="/viewmore">View more</Link>
        </div>
        <div
          className={`freshRecommendationGrid ${!loading ? 'olxFadeIn' : ''}`}
        >
          {loading
            ? [1, 2, 3, 4, 5, 6, 7, 8].map((i) => <CardSkeleton key={i} />)
            : cards}
        </div>
        {!loading && hasMore && (
          <div className="loadMoreWrap">
            <button
              type="button"
              className="loadMoreBtn"
              onClick={handleLoadMore}
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Posts;
