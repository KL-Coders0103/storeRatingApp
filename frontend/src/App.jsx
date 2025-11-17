import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { useAuth } from './contexts/AuthContext.js'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Home from './pages/Home' 
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Stores from './pages/Stores'
import Profile from './pages/Profile'
import StoreOwnerDashboard from './pages/StoreOwnerDashboard'
import StoreRatings from './pages/StoreRatings'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminStores from './pages/AdminStores'

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/login" element={
        !user ? <Login /> : <Navigate to="/dashboard" />} 
      />
      <Route path="/register" element={
        !user ? <Register /> : <Navigate to="/dashboard" />} 
      />

      <Route path="/app" element={<Layout />}>
        <Route index element={
          <Navigate to="dashboard" />} 
        />
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>}
         />
        <Route path="stores" element={
          <ProtectedRoute>
            <Stores />
          </ProtectedRoute>}
        />
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>}
        />
        <Route path="store-owner/dashboard" element={
          <ProtectedRoute requiredRole="store_owner">
            <StoreOwnerDashboard />
          </ProtectedRoute>
        } />
        <Route path="store-owner/ratings" element={
          <ProtectedRoute requiredRole="store_owner">
            <StoreRatings />
          </ProtectedRoute>
        } />
        <Route path="admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="admin/users" element={
          <ProtectedRoute requiredRole="admin">
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="admin/stores" element={
          <ProtectedRoute requiredRole="admin">
            <AdminStores />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="/dashboard" element={<Navigate to="/app/dashboard" />} />
      <Route path="/stores" element={<Navigate to="/app/stores" />} />
      <Route path="/profile" element={<Navigate to="/app/profile" />} />
      <Route path="/store-owner/dashboard" element={<Navigate to="/app/store-owner/dashboard" />} />
      <Route path="/store-owner/ratings" element={<Navigate to="/app/store-owner/ratings" />} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App