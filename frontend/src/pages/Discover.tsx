import { useState } from 'react';
import { Sparkles, Globe, Building2, Database, Loader2 } from 'lucide-react';
import SchemeCard from '../components/SchemeCard';
import { discoverSchemes, liveSearchSchemes } from '../services/api';
import type { Scheme, DiscoverResponse } from '../types';
import './Discover.css';

const PROFILE_TAGS = [
  'Farmer', 'Student', 'Teacher / Educator', 'Woman', 'Youth (18-35)', 
  'Senior Citizen 60+', 'BPL / Below Poverty Line', 'SC / ST / OBC', 
  'Minority Community', 'Differently Abled / Disabled', 'Unemployed', 
  'Entrepreneur / Self-Employed', 'Unorganized / Daily Wage Worker', 
  'Migrant Worker', 'Street Vendor', 'Artisan / Weaver', 'Ex-Serviceman', 
  'Widow / Destitute Woman', 'Pregnant / New Mother', 'Child (0-18)', 
  'Urban Poor', 'Fishermen',
];



const CATEGORIES = [
  'Any category', 'Agriculture', 'Education', 'Finance', 'Health', 'Housing',
  'Technology', 'Employment', 'Women & Children', 'Social Welfare', 'Youth & Seniors',
];

const STATES = [
  'All India', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const Discover = () => {
  const [searchMode, setSearchMode] = useState<'local' | 'live'>('local');
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [category, setCategory] = useState('Any category');
  const [state, setState] = useState('All India');
  const [keyword, setKeyword] = useState('');

  const [liveQuery, setLiveQuery] = useState('');
  const [liveResults, setLiveResults] = useState<Scheme[] | null>(null);

  const [results, setResults] = useState<DiscoverResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleProfile = (profile: string) => {
    setSelectedProfiles((prev) =>
      prev.includes(profile) ? prev.filter((p) => p !== profile) : [...prev, profile]
    );
  };

  const handleDiscover = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await discoverSchemes({
        profiles: selectedProfiles,
        category,
        state,
        keyword,
      });
      setResults(data);
    } catch (err) {
      console.error('Discover failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLiveSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveQuery.trim()) return;
    setLoading(true);
    try {
      const data = await liveSearchSchemes(liveQuery);
      setLiveResults(data);
    } catch (err) {
      console.error('Live search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="discover" id="discover-page">
      {/* Header */}
      <section className="discover__header" id="discover-header">
        <div className="container">
          <div className="badge badge-primary" style={{ marginBottom: 12 }}>
            <Sparkles size={14} /> AI-POWERED
          </div>
          <h1 className="heading-lg">Discover Schemes</h1>
          <p className="text-body" style={{ maxWidth: 500 }}>
            Use our AI matching engine to find schemes in our database, or try the
            Deep Search to actively scour the web for newly announced schemes.
          </p>
        </div>
      </section>

      <div className="container">
        <div className="discover__tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0' }}>
          <button
            className={`tab-btn ${searchMode === 'local' ? 'active' : ''}`}
            onClick={() => setSearchMode('local')}
            style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', color: searchMode === 'local' ? 'var(--primary-color)' : '#64748b', borderBottom: searchMode === 'local' ? '2px solid var(--primary-color)' : 'none' }}
          >
            Database Match
          </button>
          <button
            className={`tab-btn ${searchMode === 'live' ? 'active' : ''}`}
            onClick={() => setSearchMode('live')}
            style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', color: searchMode === 'live' ? 'var(--primary-color)' : '#64748b', borderBottom: searchMode === 'live' ? '2px solid var(--primary-color)' : 'none' }}
          >
            <Globe size={16} style={{ display: 'inline', marginRight: 4 }} /> Live Web Search
          </button>
        </div>

        <div className="discover__content">
          {searchMode === 'local' ? (
            <>
              {/* Profile Form */}
              <form className="discover__form card" onSubmit={handleDiscover} id="discover-form">
                <div className="card-body">
                  <h2 className="discover__form-title">
                    <span className="discover__form-icon">▽</span> Search Criteria
                  </h2>

                  {/* Who are you */}
                  <div className="discover__field">
                    <label className="discover__label">
                      <span style={{ marginRight: 6 }}>👤</span> Who are you? (Select all that apply)
                    </label>
                    <div className="discover__tags">
                      {PROFILE_TAGS.map((tag) => (
                        <button
                          type="button"
                          key={tag}
                          className={`tag ${selectedProfiles.includes(tag) ? 'active' : ''}`}
                          onClick={() => toggleProfile(tag)}
                          id={`discover-tag-${tag.toLowerCase().replace(/[\s/()]+/g, '-')}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scheme Sector / Goal */}
                  <div className="discover__field">
                    <label className="discover__label">
                      <span style={{ marginRight: 6 }}>🏛️</span> What are you looking for?
                    </label>
                    <select
                      className="select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      id="discover-category-select"
                    >
                      <option value="Any category">Any category</option>
                      <option value="Agriculture">Agriculture & Farming</option>
                      <option value="Education">Education & Scholarships</option>
                      <option value="Health">Healthcare & Wellness</option>
                      <option value="Finance">Financial Assistance & Loans</option>
                      <option value="Housing">Housing & Urban Development</option>
                      <option value="Employment">Jobs & Skills Training</option>
                      <option value="Women & Children">Women & Child Welfare</option>
                      <option value="Social Welfare">Social Security & Welfare</option>
                      <option value="Youth & Seniors">Youth & Senior Citizens</option>
                      <option value="Technology">Technology & Digital Services</option>
                    </select>
                  </div>

                  {/* State */}
                  <div className="discover__field">
                    <label className="discover__label">
                      <span style={{ marginRight: 6 }}>📍</span> Your State
                    </label>
                    <select
                      className="select"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      id="discover-state-select"
                    >
                      {STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Keyword */}
                  <div className="discover__field">
                    <label className="discover__label">
                      <span style={{ marginRight: 6 }}>🔍</span> Keyword (optional)
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. solar, toilet, startup..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      id="discover-keyword-input"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg btn-full"
                    disabled={loading}
                    id="discover-submit-btn"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="discover__spinner" /> Searching...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} /> Find My Schemes
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Results */}
              {results ? (
                <div className="discover__results animate-slide-up" id="discover-results">
                  {/* Stats */}
                  <div className="discover__stats">
                    <div className="discover__stat">
                      <Globe size={24} />
                      <div>
                        <div className="discover__stat-num">{results.state_count}</div>
                        <div className="discover__stat-label">All State Schemes</div>
                      </div>
                    </div>
                    <div className="discover__stat">
                      <Building2 size={24} />
                      <div>
                        <div className="discover__stat-num">{results.central_count}</div>
                        <div className="discover__stat-label">Central Schemes</div>
                      </div>
                    </div>
                    <div className="discover__stat">
                      <Database size={24} />
                      <div>
                        <div className="discover__stat-num">{results.total}</div>
                        <div className="discover__stat-label">Auto-Saved to DB</div>
                      </div>
                    </div>
                  </div>

                  {/* Scheme Cards */}
                  <div className="discover__results-grid">
                    {results.schemes.map((scheme) => (
                      <SchemeCard key={scheme.id} scheme={scheme} />
                    ))}
                  </div>

                  {results.total === 0 && (
                    <p className="text-center text-body" style={{ padding: '32px 0' }}>
                      No matching schemes found. Try adjusting your profile or criteria.
                    </p>
                  )}
                </div>
              ) : (
                <div className="discover__empty text-center" id="discover-empty">
                  <div className="discover__empty-icon">
                    <Sparkles size={48} />
                  </div>
                  <h3 className="heading-md">Select your profile to get started</h3>
                  <p className="text-body" style={{ maxWidth: 400, margin: '8px auto' }}>
                    Choose who you are, what you need, and your state. We'll instantly find
                    all government schemes you're eligible for — across all central and state governments.
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Live Search Form */}
              <form className="discover__form card" onSubmit={handleLiveSearch}>
                <div className="card-body" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                  <Globe size={48} style={{ color: 'var(--primary-color)', marginBottom: '1rem', display: 'inline-block' }} />
                  <h2 className="heading-md" style={{ marginBottom: '1rem' }}>Deep Web Search</h2>
                  <p className="text-body" style={{ maxWidth: 600, margin: '0 auto 2rem auto' }}>
                    Type what kind of scheme you're looking for. Our AI will scour the internet, extract verified scheme details, and save them for you. <br />
                    <strong style={{ color: '#f59e0b' }}>Note: This process takes 15-30 seconds.</strong>
                  </p>

                  <div className="discover__field" style={{ maxWidth: 600, margin: '0 auto 1.5rem auto' }}>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. latest schemes for EV subsidies in Maharashtra"
                      value={liveQuery}
                      onChange={(e) => setLiveQuery(e.target.value)}
                      style={{ padding: '1rem', fontSize: '1.1rem' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading || !liveQuery.trim()}
                    style={{ minWidth: 200 }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="discover__spinner" /> Scraping Web...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} /> Start Deep Search
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Live Search Results */}
              {liveResults && (
                <div className="discover__results animate-slide-up" style={{ marginTop: '2rem' }}>
                  <h3 className="heading-md" style={{ marginBottom: '1rem' }}>Discovered {liveResults.length} New Schemes</h3>
                  <div className="discover__results-grid">
                    {liveResults.map((scheme) => (
                      <SchemeCard key={scheme.id || Math.random()} scheme={scheme} />
                    ))}
                  </div>
                  {liveResults.length === 0 && !loading && (
                    <p className="text-center text-body">No new schemes found from the web.</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;
