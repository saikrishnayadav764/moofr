import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignupPage from './components/LoginSignupPage';
import SearchPage from './components/SearchPage';
import BreweryInfoPage from './components/BreweryInfoPage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignupPage />} />
        <Route path="/search" element={<ProtectedRoute element={SearchPage} />} />
        <Route path="/brewery/:id" element={<ProtectedRoute element={BreweryInfoPage} />} />
      </Routes>
    </Router>
  );
};

export default App;
