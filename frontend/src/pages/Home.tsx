import { Link } from 'react-router-dom';
import { Search, Shield, Users, BookOpen, ChevronRight, Code2, Heart, CheckCircle, ClipboardList } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home" id="home-page">
      {/* Hero Banner */}
      <section className="home__hero" id="home-hero">
        <div className="container">
          <div className="home__hero-badge">
            <span className="badge badge-primary">
              <span className="badge__dot"></span>
              Updated with latest 2024 Schemes
            </span>
          </div>

          <h1 className="home__hero-title heading-xl">
            Discover Government Schemes
            <br />
            <span className="home__hero-accent">Made Simple.</span>
          </h1>

          <p className="home__hero-subtitle text-body">
            Find exactly what you're eligible for in seconds. We break down complex
            government welfare programs into easy, actionable steps.
          </p>

          {/* Search Bar */}
          <div className="home__search-box">
            <div className="home__search-input-wrap">
              <Search size={20} className="home__search-icon" />
              <input
                type="text"
                className="home__search-input"
                placeholder="E.g., Schemes for students, farmers, housing..."
                id="home-search-input"
              />
            </div>
            <Link to="/schemes" className="btn btn-primary btn-lg" id="home-search-btn">
              Search Schemes
            </Link>
          </div>
        </div>
        {/* Decorative gradient */}
        <div className="home__hero-gradient" />
      </section>

      {/* Browse by Category */}
      <section className="section" id="home-categories">
        <div className="container">
          <div className="flex justify-between items-center" style={{ marginBottom: 24 }}>
            <div>
              <h2 className="heading-lg">Browse by Category</h2>
              <p className="text-body">Find schemes organized by sector and impact area.</p>
            </div>
            <Link to="/schemes" className="home__view-all" id="home-view-all">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="home__categories-grid">
            {[
              { icon: '🌾', name: 'Agriculture', count: 5 },
              { icon: '📚', name: 'Education', count: 4 },
              { icon: '💰', name: 'Finance', count: 5 },
              { icon: '🏥', name: 'Health', count: 1 },
              { icon: '🏠', name: 'Housing', count: 1 },
              { icon: '💻', name: 'Technology', count: 3 },
              { icon: '👥', name: 'Employment', count: 3 },
              { icon: '👩‍👧', name: 'Women & Children', count: 3 },
            ].map((cat) => (
              <Link
                to={`/schemes?category=${cat.name}`}
                key={cat.name}
                className="home__category-card card"
                id={`home-cat-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="home__category-icon">{cat.icon}</div>
                <h3 className="home__category-name">{cat.name}</h3>
                <p className="text-xs">{cat.count} schemes</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" style={{ background: 'var(--gray-50)' }} id="home-how-it-works">
        <div className="container text-center">
          <h2 className="heading-lg" style={{ marginBottom: 8 }}>How It Works</h2>
          <p className="text-body" style={{ marginBottom: 48 }}>Three simple steps to claim your benefits.</p>

          <div className="home__steps">
            <div className="home__step animate-fade-in">
              <div className="home__step-icon">
                <Search size={28} />
              </div>
              <div className="home__step-line" />
              <h3 className="heading-sm">1. Discover</h3>
              <p className="text-sm">Search or browse through hundreds of centralized and state schemes.</p>
            </div>
            <div className="home__step animate-fade-in" style={{ animationDelay: '0.15s' }}>
              <div className="home__step-icon">
                <ClipboardList size={28} />
              </div>
              <div className="home__step-line" />
              <h3 className="heading-sm">2. Check Eligibility</h3>
              <p className="text-sm">Read plain-English criteria and gather required documents.</p>
            </div>
            <div className="home__step animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="home__step-icon">
                <CheckCircle size={28} />
              </div>
              <h3 className="heading-sm">3. Apply</h3>
              <p className="text-sm">Follow our step-by-step guides to successfully submit your application.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" id="home-features">
        <div className="container">
          <h1 className="heading-xl text-center" style={{ marginBottom: 8 }}>
            Bridging the Gap Between Citizens and Government
          </h1>
          <p className="text-body text-center" style={{ maxWidth: 600, margin: '0 auto 48px' }}>
            We believe that every citizen deserves easy, understandable access to
            the welfare schemes and rights designed for their benefit.
          </p>

          <div className="home__features-grid">
            <div className="home__feature-card card">
              <div className="card-body text-center">
                <div className="home__feature-icon">
                  <Shield size={24} />
                </div>
                <h3 className="heading-sm">Our Mission</h3>
                <p className="text-sm">
                  To demystify bureaucratic language and make government entitlements
                  accessible to everyone, regardless of their background.
                </p>
              </div>
            </div>

            <div className="home__feature-card card">
              <div className="card-body text-center">
                <div className="home__feature-icon home__feature-icon--purple">
                  <Users size={24} />
                </div>
                <h3 className="heading-sm">For the People</h3>
                <p className="text-sm">
                  Built with a focus on accessibility, offering multilingual support
                  and text-to-speech for those who need it most.
                </p>
              </div>
            </div>

            <div className="home__feature-card card">
              <div className="card-body text-center">
                <div className="home__feature-icon home__feature-icon--green">
                  <BookOpen size={24} />
                </div>
                <h3 className="heading-sm">Trusted Info</h3>
                <p className="text-sm">
                  We aggregate and simplify information directly from official
                  government portals to ensure accuracy and reliability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Banner */}
      <section className="section" style={{ background: 'var(--gray-50)' }} id="home-opensource">
        <div className="container text-center">
          <div className="home__opensource-card">
            <h2 className="heading-lg">Open Source & Community Driven</h2>
            <p className="text-body" style={{ maxWidth: 600, margin: '12px auto 24px' }}>
              Schemes Made Simple is built as a public good. We welcome contributions
              from developers, legal experts, and citizens to help expand our database
              and improve the platform.
            </p>
            <div className="flex gap-16 justify-center">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <Code2 size={18} />
                View on GitHub
              </a>
              <Link to="/about" className="btn btn-primary">
                <Heart size={18} />
                Contribute
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
