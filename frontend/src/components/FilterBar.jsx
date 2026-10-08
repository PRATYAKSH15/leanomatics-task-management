import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  LayoutGrid,
  List,
  RotateCcw,
} from 'lucide-react';
import { debounce } from '../utils/helpers';

export default function FilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  viewMode,
  onViewModeChange,
  totalResults,
}) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Keep internal input in sync if filters.search is reset from outside
  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  // Debounce the search filter update
  const debouncedSearchUpdate = useMemo(
    () =>
      debounce((val) => {
        onFilterChange({ search: val, page: 1 });
      }, 300),
    [onFilterChange]
  );

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    debouncedSearchUpdate(val);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    onFilterChange({ search: '', page: 1 });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.sortBy !== 'createdAt' ||
    filters.sortOrder !== 'desc';

  return (
    <div className="filter-toolbar">
      {/* Search and View Switcher */}
      <div className="filter-toolbar-top">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title or description..."
            value={searchInput}
            onChange={handleSearchChange}
            id="task-search-input"
            aria-label="Search tasks"
          />
          {searchInput && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClearSearch}
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* View Mode Controls */}
        <div className="view-controls">
          <div className="view-switch" role="group" aria-label="View toggle">
            <button
              type="button"
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              title="Grid Cards View"
            >
              <LayoutGrid size={16} />
              <span>Cards</span>
            </button>
            <button
              type="button"
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => onViewModeChange('table')}
              title="Table View"
            >
              <List size={16} />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Filters & Sorters */}
      <div className="filter-toolbar-bottom">
        <div className="filter-selects-group">
          {/* Status Filter */}
          <div className="select-control-wrapper">
            <span className="select-label">Status</span>
            <select
              className="custom-select"
              value={filters.status}
              onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
              id="filter-status-select"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="select-control-wrapper">
            <span className="select-label">Priority</span>
            <select
              className="custom-select"
              value={filters.priority}
              onChange={(e) => onFilterChange({ priority: e.target.value, page: 1 })}
              id="filter-priority-select"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Sort By Field */}
          <div className="select-control-wrapper">
            <span className="select-label">Sort By</span>
            <select
              className="custom-select"
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value, page: 1 })}
              id="filter-sortby-select"
            >
              <option value="createdAt">Created Date</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          {/* Sort Direction Toggle */}
          <button
            type="button"
            className="btn-sort-order"
            onClick={() =>
              onFilterChange({
                sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
                page: 1,
              })
            }
            title={`Toggle sort order (Current: ${
              filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'
            })`}
          >
            <ArrowUpDown size={15} />
            <span>{filters.sortOrder === 'asc' ? 'Asc' : 'Desc'}</span>
          </button>
        </div>

        {/* Clear Filters Button if any filter is non-default */}
        {hasActiveFilters && (
          <button
            type="button"
            className="clear-filters-btn"
            onClick={onResetFilters}
            id="btn-clear-filters"
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
