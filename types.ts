export type PropertyType = 'Apartment' | 'Villa' | 'Plot' | 'Commercial' | 'Studio';
export type ListingType = 'sale' | 'rent';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  type: PropertyType;
  listingType: ListingType;
  bedrooms: number;
  bathrooms: number;
  area: number; // in sq ft
  imageUrl: string;
  amenities: string[];
  ownerContact: string;
  isFeatured?: boolean;
  datePosted: string;
}

export interface FilterState {
  search: string;
  listingType: ListingType;
  propertyType: PropertyType | 'All';
  minPrice: number;
  maxPrice: number;
}
