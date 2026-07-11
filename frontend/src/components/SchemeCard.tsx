import type { Scheme } from '../types';
import { ExternalLink, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import './SchemeCard.css';

interface SchemeCardProps {
  scheme: Scheme;
}

const CATEGORY_COLORS: Record<string, string> = {
  Agriculture: '#16a34a',
  Education: '#2563eb',
  Finance: '#d97706',
  Health: '#dc2626',
  Housing: '#7c3aed',
  Technology: '#0891b2',
  'Youth & Seniors': '#4f46e5',
  'Women & Children': '#db2777',
  Employment: '#059669',
  'Social Welfare': '#6366f1',
};

const SchemeCard = ({ scheme }: SchemeCardProps) => {
  const borderColor = CATEGORY_COLORS[scheme.category || ''] || '#3366ff';

  return (
    <div
      className="scheme-card card"
      style={{ borderTopColor: borderColor }}
      id={`scheme-card-${scheme.id}`}
    >
      <div className="card-body">
        <h3 className="scheme-card__title">{scheme.title}</h3>
        <p className="scheme-card__desc">{scheme.description?.slice(0, 180)}...</p>

        {scheme.source && (
          <div className="scheme-card__source">
            <FileText size={14} />
            <span>{scheme.source}</span>
          </div>
        )}

        <div className="scheme-card__footer">
          <Link
            to={`/scheme/${scheme.id}`}
            className="scheme-card__link"
          >
            View Details
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SchemeCard;
