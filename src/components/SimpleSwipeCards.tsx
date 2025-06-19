import React, { useState, useRef, useCallback } from 'react';
import { Heart, X, MapPin, Star, Navigation } from 'lucide-react';
import { Rooftop } from '@/types/rooftop';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SimpleSwipeCardsProps {
  rooftops: Rooftop[];
  onLike: (rooftop: Rooftop) => void;
  onPass: (rooftop: Rooftop) => void;
  onViewDetails: (rooftop: Rooftop) => void;
}

interface TouchPosition {
  x: number;
  y: number;
}

export const SimpleSwipeCards: React.FC<SimpleSwipeCardsProps> = ({
  rooftops,
  onLike,
  onPass,
  onViewDetails,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedRooftops, setLikedRooftops] = useState<Rooftop[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState<TouchPosition>({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleLike = useCallback(() => {
    const currentRooftop = rooftops[currentIndex];
    setLikedRooftops(prev => [...prev, currentRooftop]);
    onLike(currentRooftop);
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, rooftops, onLike]);

  const handlePass = useCallback(() => {
    const currentRooftop = rooftops[currentIndex];
    onPass(currentRooftop);
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, rooftops, onPass]);

  const resetDrag = useCallback(() => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartPosition({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPosition.x;
    const deltaY = touch.clientY - startPosition.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
  }, [isDragging, startPosition]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;

    const swipeThreshold = 100;
    const { x, y } = dragOffset;

    // Determine swipe direction
    if (Math.abs(x) > Math.abs(y)) {
      // Horizontal swipe
      if (x > swipeThreshold) {
        // Swipe right - Like
        handleLike();
      } else if (x < -swipeThreshold) {
        // Swipe left - Pass
        handlePass();
      }
    }

    resetDrag();
  }, [isDragging, dragOffset, handleLike, handlePass, resetDrag]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setStartPosition({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startPosition.x;
    const deltaY = e.clientY - startPosition.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
  }, [isDragging, startPosition]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    const swipeThreshold = 100;
    const { x, y } = dragOffset;

    // Determine swipe direction
    if (Math.abs(x) > Math.abs(y)) {
      // Horizontal swipe
      if (x > swipeThreshold) {
        // Swipe right - Like
        handleLike();
      } else if (x < -swipeThreshold) {
        // Swipe left - Pass
        handlePass();
      }
    }

    resetDrag();
  }, [isDragging, dragOffset, handleLike, handlePass, resetDrag]);

  // Calculate rotation and scale based on drag
  const rotation = dragOffset.x * 0.1; // Rotate based on horizontal drag
  const scale = 1 - Math.abs(dragOffset.x) * 0.001; // Slight scale down while dragging

  if (currentIndex >= rooftops.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center bg-white rounded-2xl shadow-xl p-8">
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

  const currentRooftop = rooftops[currentIndex];
  const rating = 4.0 + Math.random() * 1.0;

  // Determine swipe direction for visual feedback
  const isSwipingRight = dragOffset.x > 50;
  const isSwipingLeft = dragOffset.x < -50;

  return (
    <div className="max-w-sm mx-auto">
      <div 
        ref={cardRef}
        className={`bg-white rounded-2xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing transition-transform duration-200 ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg) scale(${scale})`,
          touchAction: 'none', // Prevent default touch behaviors
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={resetDrag}
      >
        {/* Swipe direction indicators */}
        {isSwipingRight && (
          <div className="absolute inset-0 bg-green-500/20 rounded-2xl flex items-center justify-center z-10">
            <div className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold">
              <Heart className="w-6 h-6 inline mr-2" />
              LIKE
            </div>
          </div>
        )}
        
        {isSwipingLeft && (
          <div className="absolute inset-0 bg-red-500/20 rounded-2xl flex items-center justify-center z-10">
            <div className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
              <X className="w-6 h-6 inline mr-2" />
              PASS
            </div>
          </div>
        )}

        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={currentRooftop.image_url || '/images/rooftops/hero-rooftop.jpg'}
            alt={currentRooftop.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Floating badges */}
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-white/90 text-gray-900">
              <MapPin className="w-3 h-3 mr-1" />
              {currentRooftop.neighborhood || 'NYC'}
            </Badge>
          </div>
          
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/90 text-gray-900">
              <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
              {rating.toFixed(1)}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentRooftop.name}</h2>
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
              {currentRooftop.description}
            </p>
          </div>

          {/* Features */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {currentRooftop.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {currentRooftop.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{currentRooftop.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Tags */}
          {currentRooftop.tags && currentRooftop.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {currentRooftop.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} className="text-xs bg-blue-100 text-blue-800 capitalize">
                    {tag.replace(/[_-]/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePass}
              className="w-14 h-14 rounded-full border-2 border-red-200 hover:border-red-300 hover:bg-red-50"
            >
              <X className="w-6 h-6 text-red-500" />
            </Button>
            
            <Button
              onClick={() => onViewDetails(currentRooftop)}
              size="lg"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Navigation className="w-4 h-4 mr-2" />
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
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          {currentIndex + 1} of {rooftops.length} rooftops
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / rooftops.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Swipe instructions */}
      <div className="mt-4 text-center text-xs text-gray-400">
        <p>Swipe left to pass • Swipe right to like</p>
      </div>
    </div>
  );
};
