import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import SchemeCard from '../components/SchemeCard';
import { getSchemes, getCategories } from '../services/api';
import type { Scheme, Category } from '../types';
import './AllSchemes.css';

const INDIAN_STATES = [
  'All', 'Central', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const AllSchemes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'All');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : []
  );
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  // Sync filter state from URL params (e.g. when AI widget navigates here)
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    if (urlCategory) {
      setSelectedCategories([urlCategory]);
    }
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    loadSchemes();
  }, [page, selectedState, selectedCategories, searchQuery]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const data = await getSchemes({
        page,
        per_page: 10,
        category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
        state: selectedState !== 'All' ? selectedState : undefined,
        search: searchQuery || undefined,
      });
      setSchemes(data.schemes);
      setTotalPages(data.total_pages);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to load schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadSchemes();
  };

  return (
    <div className="all-schemes" id="allschemes-page">
      <section className="all-schemes__header" id="allschemes-header">
        <div className="container">
          <h1 className="heading-lg">Welfare Schemes</h1>
          <p className="text-body">Find and filter government schemes tailored to you.</p>
        </div>
      </section>

      <div className="container">
        <div className="all-schemes__layout">
          {/* Sidebar Filters */}
          <aside className="all-schemes__sidebar" id="allschemes-sidebar">
            <div className="all-schemes__filter-section">
              <h3 className="all-schemes__filter-title">
                <Filter size={16} /> Filters
              </h3>
            </div>

            {/* State */}
            <div className="all-schemes__filter-section">
              <label className="all-schemes__filter-label">State / Region</label>
              <select
                className="select"
                value={selectedState}
                onChange={(e) => { setSelectedState(e.target.value); setPage(1); }}
                id="allschemes-state-select"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s === 'All' ? 'All States' : s}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="all-schemes__filter-section">
              <label className="all-schemes__filter-label">Category</label>
              <div className="all-schemes__checkboxes">
                {categories.map((cat) => (
                  <label key={cat.name} className="all-schemes__checkbox" id={`allschemes-cat-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => toggleCategory(cat.name)}
                    />
                    <span>{cat.icon} {cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="all-schemes__main">
            {/* Search */}
            <form className="all-schemes__search" onSubmit={handleSearch} id="allschemes-search-form">
              <div className="all-schemes__search-wrap">
                <Search size={18} className="all-schemes__search-icon" />
                <input
                  type="text"
                  className="input"
                  placeholder="Search by keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  id="allschemes-search-input"
                />
              </div>
              <button type="submit" className="btn btn-primary" id="allschemes-search-btn">Search</button>
            </form>

            {/* Results */}
            {loading ? (
              <div className="all-schemes__loading">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton" style={{ height: 180, borderRadius: 16 }} />
                ))}
              </div>
            ) : schemes.length === 0 ? (
              <div className="all-schemes__empty">
                <p>No schemes found matching your criteria.</p>
              </div>
            ) : (
              <>
                <div className="all-schemes__grid">
                  {schemes.map((scheme) => (
                    <SchemeCard key={scheme.id} scheme={scheme} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="all-schemes__pagination" id="allschemes-pagination">
                  <button
                    className="btn btn-outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    id="allschemes-prev"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <span className="all-schemes__page-info">Page {page} of {totalPages}</span>
                  <button
                    className="btn btn-outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    id="allschemes-next"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AllSchemes;
