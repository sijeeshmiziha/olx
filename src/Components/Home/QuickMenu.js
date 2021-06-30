import React from 'react';
import { Link } from 'react-router-dom';
import PostCards from '../PostCards/PostCards';
import { CardSkeleton } from '../UI/Skeleton';
import '../DynamicPosts/dynamicposts.css';

function QuickMenu({ products = [], loading = false }) {
  return (
    <div className="dynamicPostsWrapper">
      <div className="dynamicPostsInner">
        <div className="dynamicPostsHeading">
          <span>Quick menu</span>
          <Link to="/viewmore">View more</Link>
        </div>
        <div className="dynamicPostsCards">
          {loading
            ? [1, 2, 3, 4].map((i) => (
                <div className="dynamicPostsCardSlot" key={i}>
                  <CardSkeleton />
                </div>
              ))
            : (products || []).map((product, index) => (
                <div className="dynamicPostsCardSlot" key={product.id || index}>
                  <PostCards product={product} index={index} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default QuickMenu;
