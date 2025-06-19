import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Layout/Header';
import { SimpleSwipeCards } from '@/components/SimpleSwipeCards';
import { RooftopGrid } from '@/components/RooftopCards/RooftopGrid';
import { SimpleMap } from '@/components/SimpleMap';
import { FilterPanel, SearchBar } from '@/components/Filters/FilterPanel';
import { RooftopDetail } from '@/components/Rooftop/RooftopDetail';
import { rooftopService } from '@/services/rooftopService';
import { Rooftop, FilterOptions } from '@/types/rooftop';
import { Loader2, MapPin } from 'lucide-react';

function App() {
  const [rooftops, setRooftops] = useState<Rooftop[]>([]);
  const [filteredRooftops, setFilteredRooftops] = useState<Rooftop[]>([]);
  const [selectedRooftop, setSelectedRooftop] = useState<Rooftop | null>(null);
  const [likedRooftops, setLikedRooftops] = useState<Rooftop[]>([]);
  const [currentView, setCurrentView] = useState<'cards' | 'map' | 'list'>('cards');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  
  const { toast } = useToast();

  // Load rooftops on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await rooftopService.loadRooftops();
        setRooftops(data);
        setFilteredRooftops(data);
        setError(null);
      } catch (err) {
        setError('Failed to load rooftop data. Please try again.');
        console.error('Failed to load rooftops:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters whenever filters change
  useEffect(() => {
    const filtered = rooftopService.filterRooftops(filters);
    setFilteredRooftops(filtered);
  }, [filters, rooftops]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleSearch = (searchTerm: string) => {
    setFilters({ ...filters, searchTerm });
  };

  const handleLike = (rooftop: Rooftop) => {
    setLikedRooftops(prev => {
      const isAlreadyLiked = prev.some(r => r.name === rooftop.name);
      if (isAlreadyLiked) {
        toast({
          title: "Already in favorites",
          description: `${rooftop.name} is already in your favorites!`,
        });
        return prev;
      }
      
      toast({
        title: "Added to favorites!",
        description: `${rooftop.name} has been added to your favorites.`,
      });
      return [...prev, rooftop];
    });
  };

  const handlePass = (rooftop: Rooftop) => {
    console.log('Passed on:', rooftop.name);
  };

  const handleRooftopSelect = (rooftop: Rooftop) => {
    setSelectedRooftop(rooftop);
    setShowDetail(true);
  };

  const handleGetDirections = (rooftop: Rooftop) => {
    const query = encodeURIComponent(rooftop.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Amazing Rooftops</h2>
          <p className="text-gray-600">Discovering the best rooftop experiences in NYC...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const MainContent = () => {
    const content = (() => {
      switch (currentView) {
        case 'map':
          return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <SimpleMap
                rooftops={filteredRooftops}
                onRooftopSelect={handleRooftopSelect}
                className="h-96"
              />
            </div>
          );
        case 'list':
          return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <RooftopGrid
                rooftops={filteredRooftops}
                onRooftopSelect={handleRooftopSelect}
                onLike={handleLike}
                layout="list"
              />
            </div>
          );
        default:
          return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Hero Section for Swipe Cards */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Discover NYC's Best Rooftops
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                  Swipe through amazing rooftop bars and restaurants. Like what you see? Save it to your favorites!
                </p>
                
                {/* Swipe Cards */}
                <div className="mb-12">
                  <SimpleSwipeCards
                    rooftops={filteredRooftops}
                    onLike={handleLike}
                    onPass={handlePass}
                    onViewDetails={handleRooftopSelect}
                  />
                </div>
              </div>

              {/* Regular Grid */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    All Rooftops ({filteredRooftops.length})
                  </h3>
                  <div className="text-sm text-gray-600">
                    {filters.searchTerm && `Showing results for "${filters.searchTerm}"`}
                    {filters.neighborhood && ` in ${filters.neighborhood}`}
                  </div>
                </div>
                <RooftopGrid
                  rooftops={filteredRooftops}
                  onRooftopSelect={handleRooftopSelect}
                  onLike={handleLike}
                  layout="grid"
                />
              </div>
            </div>
          );
      }
    })();

    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          onViewChange={setCurrentView}
          currentView={currentView}
          onSearchToggle={() => setShowSearch(!showSearch)}
          onFilterToggle={() => setShowFilters(true)}
        />
        
        <SearchBar
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
          onSearch={handleSearch}
          currentSearch={filters.searchTerm || ''}
        />

        {content}

        <FilterPanel
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          onFiltersChange={handleFiltersChange}
          neighborhoods={rooftopService.getNeighborhoods()}
          popularFeatures={rooftopService.getPopularFeatures()}
          currentFilters={filters}
        />

        <RooftopDetail
          rooftop={selectedRooftop}
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
          onLike={handleLike}
          onGetDirections={handleGetDirections}
        />
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
