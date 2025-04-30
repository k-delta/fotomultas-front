import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import ConsultPage from './pages/ConsultPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import FinesPage from './pages/FinesPage';
import FineDetailPage from './pages/FineDetailPage';
import FineCreatePage from './pages/FineCreatePage';
import VehiclesPage from './pages/VehiclesPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import UsersPage from './pages/UsersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/consult" element={<ConsultPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          
          <Route path="fines">
            <Route index element={<FinesPage />} />
            <Route path="new" element={<FineCreatePage />} />
            <Route path=":id" element={<FineDetailPage />} />
          </Route>
          
          <Route path="vehicles">
            <Route index element={<VehiclesPage />} />
            <Route path=":plate" element={<VehicleDetailPage />} />
          </Route>
          
          <Route path="users" element={<UsersPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;