import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../services/AuthContext';
import './Login.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, login, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/home');
    }
  }, [user, isLoading, navigate]);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    state: '',
    age: '',
    occupation: '',
    gender: '',
    income: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Login Request
        const params = new URLSearchParams();
        params.append('username', formData.username);
        params.append('password', formData.password);

        const response = await axios.post(`${API_BASE_URL}/auth/login`, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        // After successful login, fetch user profile
        const token = response.data.access_token;
        const userRes = await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        login(token, userRes.data);
        navigate('/profile');
      } else {
        // Register Request
        const registerData = {
          ...formData,
          age: formData.age ? parseInt(formData.age) : null
        };
        await axios.post(`${API_BASE_URL}/auth/register`, registerData);
        
        // Auto login after register
        const params = new URLSearchParams();
        params.append('username', formData.username);
        params.append('password', formData.password);
        
        const loginRes = await axios.post(`${API_BASE_URL}/auth/login`, params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        const token = loginRes.data.access_token;
        const userRes = await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        login(token, userRes.data);
        navigate('/profile');
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{isLogin ? 'Sign in to access your personalized schemes' : 'Join us to get scheme recommendations'}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label>State</label>
                <select name="state" value={formData.state} onChange={handleChange} required>
                  <option value="">Select State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                  <option value="Ladakh">Ladakh</option>
                  <option value="Lakshadweep">Lakshadweep</option>
                  <option value="Puducherry">Puducherry</option>
                </select>
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Enter age" />
              </div>
              <div className="form-group">
                <label>Occupation / Category</label>
                <select name="occupation" value={formData.occupation} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Student">Student</option>
                  <option value="Teacher / Educator">Teacher / Educator</option>
                  <option value="Woman">Woman</option>
                  <option value="Youth (18-35)">Youth (18-35)</option>
                  <option value="Senior Citizen 60+">Senior Citizen 60+</option>
                  <option value="BPL / Below Poverty Line">BPL / Below Poverty Line</option>
                  <option value="SC / ST / OBC">SC / ST / OBC</option>
                  <option value="Minority Community">Minority Community</option>
                  <option value="Differently Abled / Disabled">Differently Abled / Disabled</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Entrepreneur / Self-Employed">Entrepreneur / Self-Employed</option>
                  <option value="Unorganized / Daily Wage Worker">Unorganized / Daily Wage Worker</option>
                  <option value="Migrant Worker">Migrant Worker</option>
                  <option value="Street Vendor">Street Vendor</option>
                  <option value="Artisan / Weaver">Artisan / Weaver</option>
                  <option value="Ex-Serviceman">Ex-Serviceman</option>
                  <option value="Widow / Destitute Woman">Widow / Destitute Woman</option>
                  <option value="Pregnant / New Mother">Pregnant / New Mother</option>
                  <option value="Child (0-18)">Child (0-18)</option>
                  <option value="Urban Poor">Urban Poor</option>
                  <option value="Fishermen">Fishermen</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" className="submit-btn">
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>

        <div className="toggle-mode">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register here' : 'Sign in here'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
