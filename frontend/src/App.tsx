import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import AllSchemes from './pages/AllSchemes';
import Discover from './pages/Discover';
import LegalHelper from './pages/LegalHelper';
import About from './pages/About';
import SchemeDetail from './pages/SchemeDetail';
import Login from './pages/Login';
import Profile from './pages/Profile';
import { AuthProvider } from './services/AuthContext';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <div className="app">
      {!isAuthPage && <Navbar />}
      <main className="app__main">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/schemes" element={<AllSchemes />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/legal-helper" element={<LegalHelper />} />
          <Route path="/about" element={<About />} />
          <Route path="/scheme/:id" element={<SchemeDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
      {/* AI Copilot — persists across all pages except login/register */}
      {!isAuthPage && <ChatWidget />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
