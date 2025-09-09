import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { OrderManagement } from './components/OrderManagement';
import { PromotionsPage } from './components/PromotionsPage';
import CartPage from './components/CartPage';

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const [searchTerm, setSearchTerm] = useState<string>('');

  // Check for existing authentication on app load
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const authToken = localStorage.getItem('authToken');
    
    if (userData && authToken) {
      try {
        const user = JSON.parse(userData);
        setAuthState({
          user: {
            id: user.uid || user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
          },
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    // This function is called after successful API login from LoginPage
    // The user data should already be stored in localStorage by LoginPage
    const userData = localStorage.getItem('userData');
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setAuthState({
          user: {
            id: user.uid || user.id,
            email: user.email,
            name: user.name || email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          },
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Fallback to basic user object
        const user: User = {
          id: '1',
          email,
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        };
        setAuthState({ user, isAuthenticated: true });
      }
    } else {
      // Fallback if no stored data
      const user: User = {
        id: '1',
        email,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      };
      setAuthState({ user, isAuthenticated: true });
    }
  };

  const handleSignUp = (email: string, password: string, name: string) => {
    const user: User = { id: Date.now().toString(), email, name };
    setAuthState({ user, isAuthenticated: true });
  };

  const handleLogout = async () => {
    try {
      // Get user data and token from localStorage
      const userData = localStorage.getItem('userData');
      const authToken = localStorage.getItem('authToken');
      if (userData && authToken) {
        const user = JSON.parse(userData);
        
        // Call logout API
        await fetch('/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user.uid,
            idToken: authToken,
          }),
        
        });
      }
      
      // Clear local storage and update state regardless of API response
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setAuthState({ user: null, isAuthenticated: false });
      setSearchTerm('');
    } catch (error) {
      console.error('Logout error:', error);
      // Still log out locally even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setAuthState({ user: null, isAuthenticated: false });
      setSearchTerm('');
    }
  };

  const handleSearchChange = (term: string) => setSearchTerm(term);

  return (
    <Router>
      <AppRoutes
        authState={authState}
        handleLogin={handleLogin}
        handleSignUp={handleSignUp}
        handleLogout={handleLogout}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />
    </Router>
  );
}

function AppRoutes({
  authState,
  handleLogin,
  handleSignUp,
  handleLogout,
  searchTerm,
  handleSearchChange,
}: {
  authState: AuthState;
  handleLogin: (email: string, password: string) => void;
  handleSignUp: (email: string, password: string, name: string) => void;
  handleLogout: () => void;
  searchTerm: string;
  handleSearchChange: (term: string) => void;
}) {
  const navigate = useNavigate();

  return (
    <>
      {authState.isAuthenticated && (
        <Header
          user={authState.user}
          onLogout={handleLogout}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
      )}

      <Routes>
        {!authState.isAuthenticated ? (
          <>
            <Route
              path="/login"
              element={<LoginPage onLogin={handleLogin} onSwitchToSignUp={() => navigate('/signup')} />}
            />
            <Route
              path="/signup"
              element={<SignUpPage onSignUp={handleSignUp} onSwitchToLogin={() => navigate('/login')} />}
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/dashboard" element={<Dashboard searchTerm={searchTerm} />} />
            <Route path="/ordermanagement" element={<OrderManagement />} />
              <Route path="/promotions" element={<PromotionsPage />} />
                          <Route path="/cart" element={<CartPage />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
