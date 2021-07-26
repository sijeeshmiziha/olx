import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AllPostContext } from '../../contextStore/AllPostContext';
import Pagination from '../Pagination/Pagination';
import PostCards from '../PostCards/PostCards';
import './allposts.css';

function AllPosts() {
  const { allPost } = useContext(AllPostContext);
  const length = allPost.length;
  const history = useHistory();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allPost.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allPost.length / itemsPerPage);

  const displayPosts = currentItems.map((product, index) => (
    <div className="allPostCard" key={product?.id || index}>
      <PostCards product={product} index={index} />
    </div>
  ));

  if (length === 0) {
    history.push('/');
    return null;
  }

  return (
    <div className="allPostsPage">
      <div className="allPostsContainer">
        <div className="allPostsHeading">
          <h2>All Ads</h2>
          <span className="allPostsCount">{allPost.length} results</span>
        </div>
        <div className="allPostsGrid">{displayPosts}</div>
        {totalPages > 1 && (
          <Pagination
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </div>
  );
}

export default AllPosts;
