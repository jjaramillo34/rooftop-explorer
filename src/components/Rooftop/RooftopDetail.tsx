import React from 'react';
import { X, MapPin, Star, Clock, Phone, Globe, Heart, Share, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Rooftop } from '@/types/rooftop';

interface RooftopDetailProps {
  rooftop: Rooftop | null;
  isOpen: boolean;
  onClose: () => void;
  onLike?: (rooftop: Rooftop) => void;
  onGetDirections?: (rooftop: Rooftop) => void;
}

export const RooftopDetail: React.FC<RooftopDetailProps> = ({
  rooftop,
  isOpen,
  onClose,
  onLike,
  onGetDirections
}) => {
  if (!rooftop) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: rooftop.name,
          text: rooftop.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleGetDirections = () => {
    if (onGetDirections) {
      onGetDirections(rooftop);
    } else {
      // Fallback to Google Maps
      const query = encodeURIComponent(rooftop.address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  const rating = 4.0 + Math.random() * 1.0; // Simulated rating

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Hero Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={rooftop.image_url || '/images/rooftops/hero-rooftop.jpg'}
            alt={rooftop.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Action buttons overlay */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button variant="secondary" size="sm" onClick={handleShare} className="bg-white/90">
              <Share className="w-4 h-4" />
            </Button>
            {onLike && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => onLike(rooftop)}
                className="bg-white/90 hover:bg-red-50 hover:text-red-600"
              >
                <Heart className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-2xl font-bold text-white mb-2">{rooftop.name}</h1>
            <div className="flex items-center space-x-4 text-white/90">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{rooftop.neighborhood || 'NYC'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
            <p className="text-gray-700 leading-relaxed">{rooftop.description}</p>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-green-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Open Now</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Until 11:00 PM</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-blue-600">
                  <Navigation className="w-4 h-4" />
                  <span className="text-sm font-medium">0.8 miles</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">From your location</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Contact & Location</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-900">{rooftop.address}</p>
                  <p className="text-sm text-gray-500">{rooftop.neighborhood || 'New York, NY'}</p>
                </div>
              </div>
              
              {rooftop.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <a 
                    href={`tel:${rooftop.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {rooftop.phone}
                  </a>
                </div>
              )}
              
              {rooftop.website && (
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <a 
                    href={rooftop.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Features & Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {rooftop.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tags */}
          {rooftop.tags && rooftop.tags.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Atmosphere</h2>
              <div className="flex flex-wrap gap-2">
                {rooftop.tags.map((tag, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-800 capitalize">
                    {tag.replace(/[_-]/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button 
              onClick={handleGetDirections}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Get Directions
            </Button>
            <Button variant="outline" className="flex-1">
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
