import React, { useContext } from 'react';
import './pagination.css';
import { AllPostContext } from '../../contextStore/AllPostContext';

function Pagination({ setCurrentPage, currentPage, totalPages }) {
  const { allPost } = useContext(AllPostContext);

  // Fallback: compute totalPages from context if not provided
  const itemsPerPage = 12;
  const pages = totalPages || Math.ceil(allPost.length / itemsPerPage);
  const active = currentPage || 1;

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const pageNumbers = [];
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      if (active > 3) pageNumbers.push('...');
      const start = Math.max(2, active - 1);
      const end = Math.min(pages - 1, active + 1);
      for (let i = start; i <= end; i++) pageNumbers.push(i);
      if (active < pages - 2) pageNumbers.push('...');
      pageNumbers.push(pages);
    }
    return pageNumbers;
  };

  return (
    <div className="pagination">
      <button
        className="paginationBtn paginationPrev"
        disabled={active <= 1}
        onClick={() => handlePageClick(active - 1)}
        aria-label="Previous page"
      >
        &lsaquo;
      </button>

      {getPageNumbers().map((item, idx) =>
        item === '...' ? (
          <span key={`ellipsis-${idx}`} className="paginationEllipsis">
            &hellip;
          </span>
        ) : (
          <button
            key={item}
            className={`paginationBtn paginationPage ${
              active === item ? 'paginationActive' : ''
            }`}
            onClick={() => handlePageClick(item)}
          >
            {item}
          </button>
        )
      )}

      <button
        className="paginationBtn paginationNext"
        disabled={active >= pages}
        onClick={() => handlePageClick(active + 1)}
        aria-label="Next page"
      >
        &rsaquo;
      </button>
    </div>
  );
}

export default Pagination;
