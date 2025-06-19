import React, { useState, useEffect } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { Heart, X, MapPin, Star, Clock, Users } from 'lucide-react';
import { Rooftop } from '@/types/rooftop';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SwipeCardsProps {
  rooftops: Rooftop[];
  onLike: (rooftop: Rooftop) => void;
  onPass: (rooftop: Rooftop) => void;
  onViewDetails: (rooftop: Rooftop) => void;
}

const SwipeCard: React.FC<{
  rooftop: Rooftop;
  onLike: () => void;
  onPass: () => void;
  onViewDetails: () => void;
  isTop: boolean;
}> = ({ rooftop, onLike, onPass, onViewDetails, isTop }) => {
  const controls = useAnimation();
  const [exitX, setExitX] = useState(0);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      setExitX(200);
      controls.start({ x: 200, opacity: 0 });
      setTimeout(onLike, 150);
    } else if (info.offset.x < -threshold) {
      setExitX(-200);
      controls.start({ x: -200, opacity: 0 });
      setTimeout(onPass, 150);
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  const handleLike = () => {
    setExitX(200);
    controls.start({ x: 200, opacity: 0 });
    setTimeout(onLike, 150);
  };

  const handlePass = () => {
    setExitX(-200);
    controls.start({ x: -200, opacity: 0 });
    setTimeout(onPass, 150);
  };

  return (
    <motion.div
      className={`absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing ${
        isTop ? 'z-20' : 'z-10'
      }`}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 20 }}
      whileDrag={{ scale: 1.05 }}
      style={{
        opacity: isTop ? 1 : 0.8,
      }}
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={rooftop.image_url || '/images/rooftops/hero-rooftop.jpg'}
          alt={rooftop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Floating badges */}
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-gray-900">
            <MapPin className="w-3 h-3 mr-1" />
            {rooftop.neighborhood || 'NYC'}
          </Badge>
        </div>
        
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/90 text-gray-900">
            <Star className="w-3 h-3 mr-1" />
            4.{Math.floor(Math.random() * 5 + 2)}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{rooftop.name}</h2>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {rooftop.description}
          </p>
        </div>

        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {rooftop.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {rooftop.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{rooftop.features.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Tags */}
        {rooftop.tags && rooftop.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {rooftop.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} className="text-xs bg-blue-100 text-blue-800">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Quick info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Open Now
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            Reservations
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {isTop && (
        <div className="absolute bottom-6 left-6 right-6 flex justify-center space-x-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePass}
            className="w-14 h-14 rounded-full border-2 border-red-200 hover:border-red-300 hover:bg-red-50"
          >
            <X className="w-6 h-6 text-red-500" />
          </Button>
          
          <Button
            onClick={onViewDetails}
            size="lg"
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            View Details
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleLike}
            className="w-14 h-14 rounded-full border-2 border-green-200 hover:border-green-300 hover:bg-green-50"
          >
            <Heart className="w-6 h-6 text-green-500" />
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export const SwipeCards: React.FC<SwipeCardsProps> = ({
  rooftops,
  onLike,
  onPass,
  onViewDetails,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedRooftops, setLikedRooftops] = useState<Rooftop[]>([]);

  const handleLike = (rooftop: Rooftop) => {
    setLikedRooftops(prev => [...prev, rooftop]);
    onLike(rooftop);
    setCurrentIndex(prev => prev + 1);
  };

  const handlePass = (rooftop: Rooftop) => {
    onPass(rooftop);
    setCurrentIndex(prev => prev + 1);
  };

  const handleViewDetails = (rooftop: Rooftop) => {
    onViewDetails(rooftop);
  };

  if (currentIndex >= rooftops.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          You've explored all rooftops!
        </h3>
        <p className="text-gray-600 mb-4">
          You liked {likedRooftops.length} rooftop{likedRooftops.length !== 1 ? 's' : ''}
        </p>
        <Button 
          onClick={() => setCurrentIndex(0)}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          Explore Again
        </Button>
      </div>
    );
  }

  return (
    <div className="relative h-96 max-w-sm mx-auto">
      {/* Show current and next card */}
      {[currentIndex + 1, currentIndex].map((index, stackIndex) => {
        if (index >= rooftops.length) return null;
        
        return (
          <SwipeCard
            key={`${index}-${rooftops[index].name}`}
            rooftop={rooftops[index]}
            onLike={() => handleLike(rooftops[index])}
            onPass={() => handlePass(rooftops[index])}
            onViewDetails={() => handleViewDetails(rooftops[index])}
            isTop={stackIndex === 1}
          />
        );
      })}
    </div>
  );
};
