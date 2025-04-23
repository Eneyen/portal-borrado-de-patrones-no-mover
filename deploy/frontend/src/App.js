import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PatronesProvider } from './context/PatronesContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PatternList from './components/PatternList';
import PatternDetail from './components/PatternDetail';
import AddPattern from './components/AddPattern';
import Profile from './components/Profile';
import Instructions from './components/Instructions';
import NotFound from './components/NotFound';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <PatronesProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/patrones" element={<PrivateRoute><PatternList /></PrivateRoute>} />
            <Route path="/patrones/:id" element={<PrivateRoute><PatternDetail /></PrivateRoute>} />
            <Route path="/nuevo-patron" element={<PrivateRoute><AddPattern /></PrivateRoute>} />
            <Route path="/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/instrucciones" element={<PrivateRoute><Instructions /></PrivateRoute>} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
      </PatronesProvider>
    </AuthProvider>
  );
}

export default App;
