import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../services/AuthContext';
import './Profile.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

const Profile: React.FC = () => {
  const { user, token, logout, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loadingSchemes, setLoadingSchemes] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (token) {
      fetchPersonalizedSchemes();
    }
  }, [token]);

  const fetchPersonalizedSchemes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/personalized/schemes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchemes(response.data);
    } catch (error) {
      console.error('Error fetching personalized schemes', error);
    } finally {
      setLoadingSchemes(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading || !user) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Welcome, {user.username}!</h1>
          <p>{user.email}</p>
          <div className="profile-details">
            {user.state && <span className="detail-badge">{user.state}</span>}
            {user.occupation && <span className="detail-badge">{user.occupation}</span>}
            {user.age && <span className="detail-badge">{user.age} Years Old</span>}
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="personalized-section">
        <h2>Your Personalized Schemes</h2>
        {loadingSchemes ? (
          <p>Finding the best schemes for you...</p>
        ) : schemes.length > 0 ? (
          <div className="schemes-grid">
            {schemes.map((scheme: any) => (
              <div 
                key={scheme.id} 
                className="scheme-card"
                onClick={() => navigate(`/scheme/${scheme.id}`)}
              >
                <div className="scheme-title">{scheme.title}</div>
                <div className="scheme-desc">{scheme.description}</div>
                <div className="scheme-meta">
                  <span>{scheme.state}</span>
                  <span>{scheme.category}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No personalized schemes found at the moment. Try exploring the Discover section.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
