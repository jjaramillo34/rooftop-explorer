export interface Rooftop {
  name: string;
  address: string;
  description: string;
  features: string[];
  image_url?: string | null;
  neighborhood?: string;
  tags?: string[];
  website?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
}

export interface RooftopData {
  extracted_information: string;
  specifications: Record<string, any>;
  pricing: Record<string, any>;
  features: string[];
  statistics: Record<string, any>;
  temporal_info: Record<string, any>;
  geographical_data: Record<string, any>;
  references: string[];
  rooftop_bars: Rooftop[];
}

export interface FilterOptions {
  neighborhood?: string;
  features?: string[];
  tags?: string[];
  searchTerm?: string;
}

export interface MapMarker {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  rooftop: Rooftop;
}
