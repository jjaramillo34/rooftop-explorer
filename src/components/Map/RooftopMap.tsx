import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import { Rooftop } from '@/types/rooftop';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, ExternalLink } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
const createCustomIcon = () => {
  return new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    `),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'custom-marker'
  });
};

// Component to fit map bounds to markers
const FitBounds: React.FC<{ rooftops: Rooftop[] }> = ({ rooftops }) => {
  const map = useMap();

  useEffect(() => {
    if (rooftops.length > 0) {
      const bounds = new LatLngBounds([]);
      rooftops.forEach(rooftop => {
        if (rooftop.latitude && rooftop.longitude) {
          bounds.extend([rooftop.latitude, rooftop.longitude]);
        }
      });
      
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [map, rooftops]);

  return null;
};

interface RooftopMapProps {
  rooftops: Rooftop[];
  onRooftopSelect?: (rooftop: Rooftop) => void;
  selectedRooftop?: Rooftop | null;
  className?: string;
}

export const RooftopMap: React.FC<RooftopMapProps> = ({
  rooftops,
  onRooftopSelect,
  selectedRooftop,
  className = "h-96"
}) => {
  const mapRef = useRef<any>(null);
  
  // NYC center coordinates
  const nycCenter: [number, number] = [40.7128, -73.9060];

  const customIcon = createCustomIcon();

  const handleMarkerClick = (rooftop: Rooftop) => {
    if (onRooftopSelect) {
      onRooftopSelect(rooftop);
    }
  };

  // Filter rooftops with valid coordinates
  const validRooftops = rooftops.filter(r => r.latitude && r.longitude);

  return (
    <div className={`${className} w-full rounded-lg overflow-hidden shadow-lg relative`}>
      <MapContainer
        center={nycCenter}
        zoom={12}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FitBounds rooftops={validRooftops} />
        
        {validRooftops.map((rooftop, index) => (
          <Marker
            key={`${rooftop.name}-${index}`}
            position={[rooftop.latitude!, rooftop.longitude!]}
            icon={customIcon}
            eventHandlers={{
              click: () => handleMarkerClick(rooftop)
            }}
          >
            <Popup className="custom-popup">
              <div className="w-72 p-2">
                {/* Image */}
                <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                  <img
                    src={rooftop.image_url || '/images/rooftops/hero-rooftop.jpg'}
                    alt={rooftop.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-white/90 text-gray-900 text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      4.{Math.floor(Math.random() * 5 + 2)}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {rooftop.name}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {rooftop.neighborhood || 'NYC'}
                  </div>

                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                    {rooftop.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {rooftop.features.slice(0, 2).map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {rooftop.features.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{rooftop.features.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => onRooftopSelect?.(rooftop)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-xs"
                    >
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="p-2">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map overlay info */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg z-[1000]">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-900">
            {validRooftops.length} Rooftops
          </span>
        </div>
      </div>
    </div>
  );
};

// CSS styles to inject for custom markers and popups
const style = document.createElement('style');
style.textContent = `
  .custom-marker {
    background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
    border: 2px solid white;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
  
  .custom-marker svg {
    color: white;
    transform: rotate(45deg);
  }
  
  .custom-popup .leaflet-popup-content-wrapper {
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    border: none;
    padding: 0;
  }
  
  .custom-popup .leaflet-popup-content {
    margin: 0;
    border-radius: 12px;
  }
  
  .custom-popup .leaflet-popup-tip {
    background: white;
    border: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;
document.head.appendChild(style);
