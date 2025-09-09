import React, { useState } from 'react';
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

  const handleLogin = (email: string, password: string) => {
    const user: User = {
      id: '1',
      email,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
    };
    setAuthState({ user, isAuthenticated: true });
  };

  const handleSignUp = (email: string, password: string, name: string) => {
    const user: User = { id: Date.now().toString(), email, name };
    setAuthState({ user, isAuthenticated: true });
  };

  const handleLogout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    setSearchTerm('');
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
