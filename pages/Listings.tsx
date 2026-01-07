import React, { useState, useMemo } from 'react';
import { Property, ListingType, PropertyType } from '../types';
import PropertyCard from '../components/PropertyCard';
import { Filter, SlidersHorizontal, MapPin } from 'lucide-react';

interface ListingsProps {
  properties: Property[];
  type: ListingType;
}

const Listings: React.FC<ListingsProps> = ({ properties, type }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType | 'All'>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]); // Max 5 Cr default
  
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesType = p.listingType === type;
      const matchesSearch = p.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = propertyType === 'All' || p.type === propertyType;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];

      return matchesType && matchesSearch && matchesCategory && matchesPrice;
    });
  }, [properties, type, searchTerm, propertyType, priceRange]);

  const maxPriceValue = type === 'rent' ? 500000 : 100000000; // 5 Lakhs rent or 10 Cr buy
  
  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
            Properties for {type}
          </h1>
          <p className="text-gray-500">
            {filteredProperties.length} listings found matching your criteria
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-brand-brown">
                <Filter size={20} />
                <h2 className="font-bold text-lg">Filters</h2>
              </div>

              {/* Location Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="City or Locality"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <div className="space-y-2">
                  {['All', 'Apartment', 'Villa', 'Plot', 'Commercial', 'Studio'].map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="propType"
                        checked={propertyType === t}
                        onChange={() => setPropertyType(t as PropertyType | 'All')}
                        className="text-brand-green focus:ring-brand-green"
                      />
                      <span className="text-sm text-gray-600">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (Max: {type === 'rent' ? `₹${priceRange[1]/1000}k` : `₹${priceRange[1]/10000000}Cr`})
                </label>
                <input
                  type="range"
                  min="0"
                  max={maxPriceValue}
                  step={type === 'rent' ? 1000 : 100000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-green"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Min</span>
                  <span>Max</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSearchTerm('');
                  setPropertyType('All');
                  setPriceRange([0, maxPriceValue]);
                }}
                className="w-full py-2 text-sm text-brand-green font-medium border border-brand-green rounded-lg hover:bg-brand-green hover:text-white transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:w-3/4">
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal className="text-gray-400" size={30} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No properties found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters to see more results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;
