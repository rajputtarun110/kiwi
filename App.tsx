
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PostProperty from './pages/PostProperty';
import PropertyDetails from './pages/PropertyDetails';
import FindAgent from './pages/FindAgent';
import Settings from './pages/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import PropertyManagement from './pages/admin/PropertyManagement';
import UserManagement from './pages/admin/UserManagement';
import AdminPeople from './pages/admin/AdminPeople'; 
import { Property, User } from './types';

const API_URL = 'http://localhost:3001/api';

const App: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data from Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propsRes, usersRes] = await Promise.all([
          fetch(`${API_URL}/properties`),
          fetch(`${API_URL}/users`)
        ]);
        
        const propsData = await propsRes.json();
        const usersData = await usersRes.json();

        setProperties(propsData);
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddProperty = async (newProperty: Property) => {
    try {
      const res = await fetch(`${API_URL}/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProperty)
      });
      if (res.ok) {
        setProperties((prev) => [newProperty, ...prev]);
      }
    } catch (error) {
      console.error("Error posting property:", error);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-brand-green font-bold text-xl">Loading Kiwi Sqft...</div>;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home featuredProperties={properties.filter(p => p.isFeatured && p.status === 'Approved')} />} />
        <Route path="/buy" element={<Listings properties={properties.filter(p => p.status === 'Approved')} type="sale" />} />
        <Route path="/rent" element={<Listings properties={properties.filter(p => p.status === 'Approved')} type="rent" />} />
        
        {/* User Post Property Route */}
        <Route path="/sell" element={<PostProperty onAddProperty={handleAddProperty} isAdmin={false} />} />
        
        <Route path="/property/:id" element={<PropertyDetails properties={properties} />} />
        <Route path="/find-agent" element={<FindAgent />} />
        <Route path="/settings" element={<Settings />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
           <Route index element={<AdminDashboard properties={properties} />} />
           
           <Route path="properties" element={<PropertyManagement properties={properties} setProperties={setProperties} />} />
           
           <Route path="post-property" element={<PostProperty onAddProperty={handleAddProperty} isAdmin={true} />} />

           <Route path="people" element={<UserManagement users={users} setUsers={setUsers} />} />
           
           <Route path="leads" element={<AdminPeople />} />
           <Route path="analytics" element={<AdminDashboard properties={properties} />} />
           <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
    