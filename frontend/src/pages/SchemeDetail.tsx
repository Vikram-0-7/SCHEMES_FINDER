import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Building, ArrowLeft, ExternalLink, Share2, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { getScheme } from '../services/api';
import type { Scheme } from '../types';
import './SchemeDetail.css';

const SchemeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'apply'>('overview');

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        if (id) {
          const data = await getScheme(parseInt(id));
          setScheme(data);
        }
      } catch (err) {
        console.error('Error fetching scheme:', err);
        setError('Failed to load scheme details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchScheme();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: scheme?.title || 'Scheme',
        text: scheme?.description || 'Check out this scheme',
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="scheme-detail-container loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="scheme-detail-container error-container">
        <p>{error || 'Scheme not found.'}</p>
        <Link to="/schemes" className="btn btn-primary">Back to Schemes</Link>
      </div>
    );
  }

  return (
    <div className="scheme-detail-container">
      {/* Header Section */}
      <div className="scheme-header">
        <div className="scheme-header-content">
          <Link to="/schemes" className="back-link">
            <ArrowLeft size={16} /> Back to all schemes
          </Link>
          <h1 className="scheme-title">{scheme.title}</h1>
          <div className="scheme-meta">
            {scheme.source && (
              <span className="meta-item">
                <Building size={16} /> {scheme.source}
              </span>
            )}
            {scheme.created_at && (
              <span className="meta-item">
                <Calendar size={16} /> Launched: {new Date(scheme.created_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="scheme-content-wrapper">
        <div className="scheme-main-content">
          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'eligibility' ? 'active' : ''}`}
              onClick={() => setActiveTab('eligibility')}
            >
              Eligibility & Docs
            </button>
            <button
              className={`tab-btn ${activeTab === 'apply' ? 'active' : ''}`}
              onClick={() => setActiveTab('apply')}
            >
              How to Apply
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="tab-pane">
                <h3 className="section-title">About this scheme</h3>
                <div className="content-card">
                  <p>{scheme.description || 'No description available.'}</p>
                </div>

                <h3 className="section-title">Key Benefits</h3>
                <div className="benefits-grid">
                  {scheme.benefits ? (
                    scheme.benefits.split('\n').filter(b => b.trim()).map((benefit, idx) => (
                      <div key={idx} className="benefit-card">
                        <CheckCircle2 size={18} className="text-success" />
                        <span>{benefit}</span>
                      </div>
                    ))
                  ) : (
                    <div className="content-card"><p>Benefits details not specified.</p></div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'eligibility' && (
              <div className="tab-pane">
                <h3 className="section-title">Who is eligible?</h3>
                <div className="eligibility-list">
                  {scheme.eligibility ? (
                    scheme.eligibility.split('\n').filter(e => e.trim()).map((item, idx) => (
                      <div key={idx} className="eligibility-item">
                        <span className="item-number">{idx + 1}</span>
                        <span>{item}</span>
                      </div>
                    ))
                  ) : (
                    <div className="content-card"><p>Eligibility criteria not specified.</p></div>
                  )}
                </div>

                <h3 className="section-title mt-6">Required Documents</h3>
                <div className="docs-grid">
                  {scheme.documents_required ? (
                    scheme.documents_required.split('\n').filter(d => d.trim()).map((doc, idx) => (
                      <div key={idx} className="doc-card">
                        <FileText size={18} className="text-muted" />
                        <span>{doc}</span>
                      </div>
                    ))
                  ) : (
                    <div className="content-card"><p>Required documents not specified.</p></div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'apply' && (
              <div className="tab-pane">
                <h3 className="section-title">Application Process</h3>
                <div className="process-list">
                  {scheme.application_process ? (
                    scheme.application_process.split('\n').filter(p => p.trim()).map((step, idx) => (
                      <div key={idx} className="process-step">
                        <div className="step-number">{idx + 1}</div>
                        <div className="step-content">
                          <p>{step}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="content-card">
                      <p>Detailed application process is not available at the moment.</p>
                      {scheme.application_url && (
                        <p className="mt-2">Please visit the official portal for instructions.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="scheme-sidebar">
          <div className="sidebar-card action-card">
            <h3 className="sidebar-title">Ready to apply?</h3>
            <p className="sidebar-text">Make sure you have all required documents ready before proceeding.</p>
            
            {scheme.application_url ? (
              <a
                href={scheme.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-block mb-3"
              >
                Apply on Official Portal <ExternalLink size={16} className="ml-2 inline" />
              </a>
            ) : (
              <button disabled className="btn btn-primary btn-block mb-3 disabled-btn">
                Application Closed/Offline
              </button>
            )}
            
            <button onClick={handleShare} className="btn btn-outline btn-block share-btn">
              <Share2 size={16} className="mr-2" /> Share Scheme
            </button>
          </div>

          <div className="sidebar-card note-card">
            <div className="note-header">
              <AlertCircle size={18} className="text-warning mr-2" />
              <h4 className="note-title">Important Note</h4>
            </div>
            <p className="sidebar-text text-sm">
              Information provided here is simplified for ease of understanding. Always refer to the official government guidelines for final authoritative criteria.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetail;
