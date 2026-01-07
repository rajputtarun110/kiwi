import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PostProperty from './pages/PostProperty';
import PropertyDetails from './pages/PropertyDetails';
import { Property } from './types';

// Initial Mock Data
const INITIAL_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Luxury Villa with Private Pool',
    description: 'Experience luxury living in this sprawling 4BHK villa situated in the quiet suburbs. Features a private pool, landscaped gardens, and smart home automation.',
    price: 45000000,
    location: 'Sector 150',
    city: 'Noida',
    type: 'Villa',
    listingType: 'sale',
    bedrooms: 4,
    bathrooms: 5,
    area: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1771&q=80',
    amenities: ['Pool', 'Garden', 'Smart Home', '24x7 Security'],
    ownerContact: '+91 98765 43210',
    datePosted: '2023-10-15',
    isFeatured: true
  },
  {
    id: '2',
    title: 'Modern 2BHK in City Center',
    description: 'A cozy and modern apartment perfect for young professionals. Close to metro station and shopping malls.',
    price: 35000,
    location: 'Sector 18',
    city: 'Noida',
    type: 'Apartment',
    listingType: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1680&q=80',
    amenities: ['Gym', 'Parking', 'Clubhouse'],
    ownerContact: '+91 98765 43211',
    datePosted: '2023-10-20',
    isFeatured: true
  },
  {
    id: '3',
    title: 'Spacious 3BHK High Rise',
    description: 'Enjoy panoramic views of the city from this 25th floor apartment. Premium fittings and access to all society amenities.',
    price: 12500000,
    location: 'Sector 137',
    city: 'Noida',
    type: 'Apartment',
    listingType: 'sale',
    bedrooms: 3,
    bathrooms: 3,
    area: 1850,
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80',
    amenities: ['Gym', 'Pool', 'Tennis Court', 'Power Backup'],
    ownerContact: '+91 98765 43212',
    datePosted: '2023-10-22',
  },
  {
    id: '4',
    title: 'Commercial Office Space',
    description: 'Plug and play office space suitable for startups. Includes conference rooms and cafeteria.',
    price: 85000,
    location: 'Sector 62',
    city: 'Noida',
    type: 'Commercial',
    listingType: 'rent',
    bedrooms: 0,
    bathrooms: 2,
    area: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80',
    amenities: ['Cafeteria', 'Conference Room', 'Central AC'],
    ownerContact: '+91 98765 43213',
    datePosted: '2023-10-25',
  },
  {
    id: '5',
    title: 'Premium Plot in Gated Community',
    description: 'Build your dream home on this corner plot located in a lush green gated community.',
    price: 6500000,
    location: 'Greater Noida West',
    city: 'Noida',
    type: 'Plot',
    listingType: 'sale',
    bedrooms: 0,
    bathrooms: 0,
    area: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1932&q=80',
    amenities: ['Park', 'Security', 'Water Connection'],
    ownerContact: '+91 98765 43214',
    datePosted: '2023-10-28',
  }
];

function App() {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);

  const addProperty = (newProperty: Property) => {
    setProperties(prev => [newProperty, ...prev]);
  };

  const featuredProperties = properties.filter(p => p.isFeatured || p.price > 10000000).slice(0, 3);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home featuredProperties={featuredProperties} />} />
            <Route path="/buy" element={<Listings properties={properties} type="sale" />} />
            <Route path="/rent" element={<Listings properties={properties} type="rent" />} />
            <Route path="/sell" element={<PostProperty onAddProperty={addProperty} />} />
            <Route path="/property/:id" element={<PropertyDetails properties={properties} />} />
          </Routes>
        </main>
        <footer className="bg-brand-brown text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Kiwi Sqft</h3>
              <p className="text-brand-lightGreen/80 text-sm leading-relaxed mb-2">
                Kiwi Sqft is a complete property platform that brings buyers, sellers, and agents together at one trusted place. Buyers can explore the best property options and connect with the right agents based on their requirements. 
              </p>
              <p className="text-brand-lightGreen/80 text-sm leading-relaxed mb-2">
                Sellers can list their property directly or choose a professional agent to help them sell faster and smarter.
              </p>
              <p className="text-brand-lightGreen/80 text-sm leading-relaxed">
                Whether you are buying, selling, or listing as an agent, Kiwi Sqft makes the entire property journey simple, transparent, and efficient.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#/buy" className="hover:text-white">Buy Property</a></li>
                <li><a href="#/sell" className="hover:text-white">Sell Property</a></li>
                <li><a href="#/rent" className="hover:text-white">Rent Property</a></li>
                <li><a href="#" className="hover:text-white">Property Valuation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-sm text-gray-300">123, Green Park, Sector 62, Noida - 201301</p>
              <p className="text-sm text-gray-300 mt-2">support@kiwisqft.com</p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
            © 2024 Kiwi Sqft. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;