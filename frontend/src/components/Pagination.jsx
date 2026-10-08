import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  onLimitChange,
}) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  // Generate page numbers array
  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination-wrapper">
      {/* Summary Info */}
      <div className="pagination-info">
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{' '}
        <strong>{totalItems}</strong> tasks
      </div>

      {/* Page Navigation & Size Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Limit Selector */}
        <div className="page-size-selector">
          <span>Show:</span>
          <select
            className="custom-select"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            style={{ border: '1px solid var(--border-light)', borderRadius: '6px', padding: '0.25rem 0.5rem' }}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="pagination-buttons">
          <button
            type="button"
            className="btn-page"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            title="Previous Page"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {startPage > 1 && (
            <>
              <button
                type="button"
                className="btn-page"
                onClick={() => onPageChange(1)}
              >
                1
              </button>
              {startPage > 2 && <span style={{ color: 'var(--text-dim)', padding: '0 4px' }}>...</span>}
            </>
          )}

          {pages.map((p) => (
            <button
              key={p}
              type="button"
              className={`btn-page ${p === currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span style={{ color: 'var(--text-dim)', padding: '0 4px' }}>...</span>}
              <button
                type="button"
                className="btn-page"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            type="button"
            className="btn-page"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            title="Next Page"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
