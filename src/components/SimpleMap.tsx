import React from 'react';
import { MapPin, Navigation, Star } from 'lucide-react';
import { Rooftop } from '@/types/rooftop';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface SimpleMapProps {
  rooftops: Rooftop[];
  onRooftopSelect?: (rooftop: Rooftop) => void;
  className?: string;
}

export const SimpleMap: React.FC<SimpleMapProps> = ({
  rooftops,
  onRooftopSelect,
  className = "h-96"
}) => {
  const handleGetDirections = (rooftop: Rooftop) => {
    const query = encodeURIComponent(rooftop.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className={`${className} w-full relative`}>
      {/* Map placeholder with NYC background */}
      <div className="h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg relative overflow-hidden">
        {/* NYC Skyline SVG Background */}
        <div className="absolute inset-0 flex items-end justify-center opacity-20">
          <svg viewBox="0 0 400 200" className="w-full h-3/4">
            <rect x="20" y="80" width="30" height="120" fill="#374151" />
            <rect x="60" y="60" width="25" height="140" fill="#4B5563" />
            <rect x="95" y="40" width="35" height="160" fill="#374151" />
            <rect x="140" y="20" width="40" height="180" fill="#4B5563" />
            <rect x="190" y="30" width="30" height="170" fill="#374151" />
            <rect x="230" y="50" width="35" height="150" fill="#4B5563" />
            <rect x="275" y="70" width="25" height="130" fill="#374151" />
            <rect x="310" y="45" width="30" height="155" fill="#4B5563" />
            <rect x="350" y="85" width="25" height="115" fill="#374151" />
          </svg>
        </div>

        {/* NYC Label */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">
              New York City - {rooftops.length} Rooftops
            </span>
          </div>
        </div>

        {/* Interactive Map Message */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="max-w-md mx-4">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Interactive Map View
              </h3>
              <p className="text-gray-600 mb-4">
                Browse rooftops below or click "Get Directions" to open in Google Maps
              </p>
              <Button 
                onClick={() => window.open('https://www.google.com/maps/search/rooftop+bars+nyc', '_blank')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Open in Google Maps
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rooftop List below map */}
      <div className="mt-6 space-y-4 max-h-96 overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Rooftop Locations ({rooftops.length})
        </h3>
        {rooftops.map((rooftop, index) => (
          <Card key={`${rooftop.name}-${index}`} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <img
                  src={rooftop.image_url || '/images/rooftops/hero-rooftop.jpg'}
                  alt={rooftop.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{rooftop.name}</h4>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {rooftop.neighborhood || 'NYC'}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {(4.0 + Math.random() * 1.0).toFixed(1)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {onRooftopSelect && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRooftopSelect(rooftop)}
                        >
                          Details
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleGetDirections(rooftop)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Navigation className="w-3 h-3 mr-1" />
                        Directions
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                    {rooftop.description}
                  </p>
                  {rooftop.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
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
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
