import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatePropertyDescription } from '../services/geminiService';
import { Property, ListingType, PropertyType } from '../types';
import { Sparkles, Upload, Loader2, CheckCircle } from 'lucide-react';

interface PostPropertyProps {
  onAddProperty: (property: Property) => void;
}

const PostProperty: React.FC<PostPropertyProps> = ({ onAddProperty }) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Apartment' as PropertyType,
    listingType: 'sale' as ListingType,
    price: '',
    city: '',
    location: '',
    bedrooms: '2',
    bathrooms: '2',
    area: '',
    description: '',
    amenitiesInput: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.location || !formData.type) {
      alert("Please fill in Title, Type and Location first.");
      return;
    }

    setIsGenerating(true);
    const amenities = formData.amenitiesInput.split(',').map(s => s.trim()).filter(Boolean);
    
    try {
      const description = await generatePropertyDescription(
        formData.title,
        formData.type,
        formData.location,
        amenities.length > 0 ? amenities : ['Modern', 'Spacious', 'Prime Location']
      );
      setFormData(prev => ({ ...prev, description }));
    } catch (error) {
      console.error(error);
      alert("Failed to generate description. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newProperty: Property = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      price: parseInt(formData.price),
      location: formData.location,
      city: formData.city,
      type: formData.type,
      listingType: formData.listingType,
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      area: parseInt(formData.area),
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', // Placeholder
      amenities: formData.amenitiesInput.split(',').map(s => s.trim()),
      ownerContact: 'Hidden for Demo',
      datePosted: new Date().toISOString(),
      isFeatured: true // New listings featured for demo
    };

    setTimeout(() => {
      onAddProperty(newProperty);
      setIsSubmitting(false);
      navigate(newProperty.listingType === 'sale' ? '/buy' : '/rent');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-beige py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-brand-green/10">
          <div className="bg-brand-brown p-8 text-center text-white">
            <h1 className="text-3xl font-bold mb-2">Post Your Property</h1>
            <p className="text-brand-lightGreen/80">Sell or Rent your property to millions of users.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-bold text-gray-800">Property Details</h2>
                 <span className="bg-brand-lightGreen text-brand-green text-xs font-bold px-3 py-1 rounded-full">Step 1 of 2</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">I want to</label>
                  <select 
                    name="listingType" 
                    value={formData.listingType} 
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                  >
                    <option value="sale">Sell</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                   <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Luxury 3BHK Apartment in Indiranagar"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                   />
                </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                   <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Noida"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                   />
                </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Locality / Area</label>
                   <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Sector 62"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                   />
                </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Area (sq ft)</label>
                   <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g. 1500"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                   />
                </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Expected Price (₹)</label>
                   <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 8500000"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                   />
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                   <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    min="1"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                   />
                </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                   <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    min="1"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                   />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8 mb-8">
              <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-bold text-gray-800">Enhance Your Listing</h2>
                 <span className="flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
                    <Sparkles size={12} /> AI Powered
                 </span>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (Comma separated)</label>
                <input
                  type="text"
                  name="amenitiesInput"
                  value={formData.amenitiesInput}
                  onChange={handleChange}
                  placeholder="Gym, Pool, Security, Garden..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                  placeholder="Describe your property..."
                ></textarea>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={isGenerating}
                  className="absolute bottom-3 right-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 px-3 rounded-md flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {isGenerating ? 'Magic Writing...' : 'AI Write'}
                </button>
              </div>
            </div>

            {/* Fake Image Upload UI */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-8 hover:bg-gray-50 transition-colors cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Click to upload property images</p>
              <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>

            <div className="flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-8 py-3 bg-brand-green text-white rounded-lg font-bold hover:bg-emerald-800 transition-all flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Posting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} /> Post Property
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default PostProperty;