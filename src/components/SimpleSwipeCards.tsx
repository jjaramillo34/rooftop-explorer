import React, { useState, useRef, useCallback } from 'react';
import { Heart, X, MapPin, Star, Navigation, ArrowLeft, ArrowRight, MousePointer } from 'lucide-react';
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
  const [showDesktopHints, setShowDesktopHints] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleLike = useCallback(() => {
    const currentRooftop = rooftops[currentIndex];
    setLikedRooftops(prev => [...prev, currentRooftop]);
    onLike(currentRooftop);
    setCurrentIndex(prev => prev + 1);
    setShowDesktopHints(false); // Hide hints after first interaction
  }, [currentIndex, rooftops, onLike]);

  const handlePass = useCallback(() => {
    const currentRooftop = rooftops[currentIndex];
    onPass(currentRooftop);
    setCurrentIndex(prev => prev + 1);
    setShowDesktopHints(false); // Hide hints after first interaction
  }, [currentIndex, rooftops, onPass]);

  const resetDrag = useCallback(() => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartPosition({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
    setShowDesktopHints(false);
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
    setShowDesktopHints(false);
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
    <div className="max-w-sm mx-auto relative">
      {/* Desktop Drag Hints - Only show on desktop and when not dragging */}
      {showDesktopHints && !isDragging && (
        <>
          {/* Left Arrow Hint */}
          <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 z-20">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center animate-bounce">
                <ArrowLeft className="w-6 h-6 text-red-500" />
              </div>
              <div className="text-xs font-medium text-red-500 bg-white px-2 py-1 rounded-full shadow-sm">
                Pass
              </div>
            </div>
          </div>

          {/* Right Arrow Hint */}
          <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 z-20">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <ArrowRight className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-xs font-medium text-green-500 bg-white px-2 py-1 rounded-full shadow-sm">
                Like
              </div>
            </div>
          </div>

          {/* Center Drag Hint */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-3 text-white">
                <MousePointer className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-medium">Click & drag to explore</span>
              </div>
            </div>
          </div>
        </>
      )}

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

        {/* Drag Direction Arrows - Show when dragging */}
        {isDragging && Math.abs(dragOffset.x) > 20 && (
          <>
            {dragOffset.x > 0 && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
                <div className="bg-green-500 text-white p-2 rounded-full animate-pulse">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            )}
            {dragOffset.x < 0 && (
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <div className="bg-red-500 text-white p-2 rounded-full animate-pulse">
                  <ArrowLeft className="w-6 h-6" />
                </div>
              </div>
            )}
          </>
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

      {/* Cool Progress & Stats Section */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100/50">
        {/* Progress Bar with Animation */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Rooftop Explorer
            </span>
            <span className="text-sm font-bold text-blue-600">
              {currentIndex + 1} of {rooftops.length}
            </span>
          </div>
          <div className="relative w-full bg-white rounded-full h-3 shadow-inner border border-gray-200">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${((currentIndex + 1) / rooftops.length) * 100}%` }}
            />
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{likedRooftops.length}</div>
            <div className="text-xs text-gray-500">Liked</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{currentIndex - likedRooftops.length}</div>
            <div className="text-xs text-gray-500">Passed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {rooftops.length - currentIndex}
            </div>
            <div className="text-xs text-gray-500">Remaining</div>
          </div>
        </div>

        {/* Interactive Swipe Instructions */}
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2 text-red-500">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <X className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium">Swipe Left</span>
          </div>
          
          <div className="flex-1 text-center">
            <div className="inline-flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-gray-600">Drag to explore</span>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-green-500">
            <span className="text-xs font-medium">Swipe Right</span>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Completion Percentage */}
        <div className="mt-3 text-center">
          <div className="text-xs text-gray-500">
            {Math.round(((currentIndex + 1) / rooftops.length) * 100)}% Complete
          </div>
        </div>
      </div>
    </div>
  );
};
