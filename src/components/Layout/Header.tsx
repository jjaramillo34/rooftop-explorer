import React from 'react';
import { MapPin, Search, Filter, Grid3X3, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onViewChange: (view: 'cards' | 'map' | 'list') => void;
  currentView: 'cards' | 'map' | 'list';
  onSearchToggle: () => void;
  onFilterToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onViewChange,
  currentView,
  onSearchToggle,
  onFilterToggle,
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">RoofTopExplorer</h1>
              <p className="text-xs text-gray-500">Discover NYC's Best Rooftops</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onSearchToggle}
              className="p-2"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Filter Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onFilterToggle}
              className="p-2"
            >
              <Filter className="w-5 h-5" />
            </Button>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={currentView === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('cards')}
                className="p-2"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={currentView === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('map')}
                className="p-2"
              >
                <Map className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
