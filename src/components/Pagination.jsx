import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  const maxPageButtons = 5; // How many page numbers to show at once

  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) {
    return null; // Don't render if only one page
  }

  return (
    <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
      <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="button">
        처음
      </button>
      
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          disabled={currentPage === number}
          className={`button ${currentPage === number ? 'button-primary' : ''}`}
          style={{ minWidth: '40px' }}
        >
          {number}
        </button>
      ))}

      <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className="button">
        마지막
      </button>
    </div>
  );
}

export default Pagination;