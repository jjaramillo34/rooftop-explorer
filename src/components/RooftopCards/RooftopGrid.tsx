import React from 'react';
import { MapPin, Star, Clock, Heart, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Rooftop } from '@/types/rooftop';

interface RooftopGridProps {
  rooftops: Rooftop[];
  onRooftopSelect: (rooftop: Rooftop) => void;
  onLike?: (rooftop: Rooftop) => void;
  layout?: 'grid' | 'list';
}

const RooftopCard: React.FC<{
  rooftop: Rooftop;
  onSelect: () => void;
  onLike?: () => void;
  layout: 'grid' | 'list';
  index: number;
}> = ({ rooftop, onSelect, onLike, layout, index }) => {
  const rating = 4.0 + Math.random() * 1.0;

  if (layout === 'list') {
    return (
      <div className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex">
            {/* Image */}
            <div className="relative w-48 h-32 flex-shrink-0">
              <img
                src={rooftop.image_url || '/images/rooftops/hero-rooftop.jpg'}
                alt={rooftop.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-white/90 text-gray-900 text-xs">
                  <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {rating.toFixed(1)}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <CardContent className="flex-1 p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{rooftop.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {rooftop.neighborhood || 'NYC'}
                  </div>
                </div>
                {onLike && (
                  <Button variant="ghost" size="sm" onClick={onLike}>
                    <Heart className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                {rooftop.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-1 mb-3">
                {rooftop.features.slice(0, 3).map((feature, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {rooftop.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{rooftop.features.length - 3}
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-green-600">
                  <Clock className="w-4 h-4 mr-1" />
                  Open Now
                </div>
                <Button onClick={onSelect} size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={rooftop.image_url || '/images/rooftops/hero-rooftop.jpg'}
            alt={rooftop.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Overlay badges */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-900">
              <MapPin className="w-3 h-3 mr-1" />
              {rooftop.neighborhood || 'NYC'}
            </Badge>
          </div>
          
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-900">
              <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
              {rating.toFixed(1)}
            </Badge>
          </div>

          {/* Hover actions */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex space-x-2">
              <Button onClick={onSelect} size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
                View Details
              </Button>
              {onLike && (
                <Button variant="outline" size="sm" onClick={onLike} className="bg-white/90">
                  <Heart className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <div className="mb-3">
            <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
              {rooftop.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {rooftop.description}
            </p>
          </div>

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

          {/* Tags */}
          {rooftop.tags && rooftop.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {rooftop.tags.slice(0, 2).map((tag, idx) => (
                <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs capitalize">
                  {tag.replace(/[_-]/g, ' ')}
                </Badge>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-green-600">
              <Clock className="w-4 h-4 mr-1" />
              Open Now
            </div>
            <Button variant="ghost" size="sm" onClick={onSelect}>
              <Navigation className="w-4 h-4 mr-1" />
              Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const RooftopGrid: React.FC<RooftopGridProps> = ({
  rooftops,
  onRooftopSelect,
  onLike,
  layout = 'grid'
}) => {
  if (rooftops.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooftops found</h3>
        <p className="text-gray-600 max-w-md">
          Try adjusting your filters or search terms to discover amazing rooftops in NYC.
        </p>
      </div>
    );
  }

  return (
    <div className={`
      ${layout === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'space-y-4'
      }
    `}>
      {rooftops.map((rooftop, index) => (
        <RooftopCard
          key={`${rooftop.name}-${index}`}
          rooftop={rooftop}
          onSelect={() => onRooftopSelect(rooftop)}
          onLike={onLike ? () => onLike(rooftop) : undefined}
          layout={layout}
          index={index}
        />
      ))}
    </div>
  );
};
