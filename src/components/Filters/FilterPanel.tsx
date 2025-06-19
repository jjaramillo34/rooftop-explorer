import React, { useState, useEffect } from 'react';
import { Search, X, Filter, MapPin, Tag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { FilterOptions } from '@/types/rooftop';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: FilterOptions) => void;
  neighborhoods: string[];
  popularFeatures: string[];
  currentFilters: FilterOptions;
}

const popularTags = [
  'cocktails',
  'great-views',
  'romantic',
  'party',
  'pool',
  'winter-open',
  'dining',
  'groups'
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  onFiltersChange,
  neighborhoods,
  popularFeatures,
  currentFilters
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(currentFilters);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleSearchChange = (value: string) => {
    const newFilters = { ...localFilters, searchTerm: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleNeighborhoodChange = (neighborhood: string) => {
    const newFilters = {
      ...localFilters,
      neighborhood: localFilters.neighborhood === neighborhood ? undefined : neighborhood
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleFeatureToggle = (feature: string) => {
    const currentFeatures = localFilters.features || [];
    const newFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    
    const newFilters = { ...localFilters, features: newFeatures };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = localFilters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    const newFilters = { ...localFilters, tags: newTags };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters: FilterOptions = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Boolean(
    localFilters.searchTerm ||
    localFilters.neighborhood ||
    (localFilters.features && localFilters.features.length > 0) ||
    (localFilters.tags && localFilters.tags.length > 0)
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-96 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filter Rooftops</span>
              </SheetTitle>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  Clear All
                </Button>
              )}
            </div>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Search */}
            <div>
              <label className="text-sm font-medium text-gray-900 mb-2 block">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search rooftops, features..."
                  value={localFilters.searchTerm || ''}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
                {localFilters.searchTerm && (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Neighborhoods */}
            <div>
              <label className="text-sm font-medium text-gray-900 mb-3 block flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Neighborhoods
              </label>
              <div className="grid grid-cols-2 gap-2">
                {neighborhoods.map((neighborhood) => (
                  <Button
                    key={neighborhood}
                    variant={localFilters.neighborhood === neighborhood ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleNeighborhoodChange(neighborhood)}
                    className="justify-start text-xs"
                  >
                    {neighborhood}
                  </Button>
                ))}
              </div>
            </div>

            {/* Popular Features */}
            <div>
              <label className="text-sm font-medium text-gray-900 mb-3 block flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Features
              </label>
              <div className="space-y-2">
                {popularFeatures.slice(0, 8).map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={localFilters.features?.includes(feature) || false}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                    />
                    <label
                      htmlFor={feature}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                    >
                      {feature.replace(/[_-]/g, ' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium text-gray-900 mb-3 block flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Vibes & Atmosphere
              </label>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={localFilters.tags?.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag.replace(/[_-]/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-6">
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={onClose} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const SearchBar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSearch: (term: string) => void;
  currentSearch: string;
}> = ({ isOpen, onClose, onSearch, currentSearch }) => {
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 left-0 right-0 bg-white shadow-lg border-b z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            autoFocus
            placeholder="Search rooftops, neighborhoods, features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-12 h-12 text-lg"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </form>
      </div>
    </div>
  );
};
