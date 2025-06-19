import { RooftopData, Rooftop, FilterOptions } from '../types/rooftop';

// NYC neighborhood coordinates for geocoding fallback
const neighborhoodCoords: Record<string, { lat: number; lng: number }> = {
  'Midtown': { lat: 40.7589, lng: -73.9851 },
  'Times Square': { lat: 40.7580, lng: -73.9855 },
  'Chelsea': { lat: 40.7465, lng: -73.9971 },
  'SoHo': { lat: 40.7230, lng: -73.9985 },
  'TriBeCa': { lat: 40.7195, lng: -74.0094 },
  'Lower East Side': { lat: 40.7154, lng: -73.9857 },
  'Upper East Side': { lat: 40.7736, lng: -73.9566 },
  'Upper West Side': { lat: 40.7870, lng: -73.9754 },
  'Greenwich Village': { lat: 40.7335, lng: -74.0027 },
  'East Village': { lat: 40.7265, lng: -73.9816 },
  'Financial District': { lat: 40.7074, lng: -74.0113 },
  'Brooklyn': { lat: 40.6782, lng: -73.9442 },
  'Williamsburg': { lat: 40.7081, lng: -73.9571 },
  'DUMBO': { lat: 40.7033, lng: -73.9889 },
  'Long Island City': { lat: 40.7505, lng: -73.9370 }
};

// Image mapping for rooftops (using our downloaded images)
const imageMapping: Record<string, string> = {
  'Bar 54': '/images/rooftops/times-square-rooftop.jpg',
  'Bar Cima': '/images/rooftops/hero-rooftop.jpg',
  'Creatures Rooftop': '/images/rooftops/rooftop-restaurant.jpg',
  'default_luxury': '/images/rooftops/rooftop-night.webp',
  'default_cocktail': '/images/rooftops/cocktail-rooftop.jpg',
  'default_pool': '/images/rooftops/rooftop-pool.jpg',
  'default_brooklyn': '/images/rooftops/brooklyn-rooftop.jpg',
  'default_sunset': '/images/rooftops/sunset-rooftop.jpg'
};

export class RooftopService {
  private static instance: RooftopService;
  private rooftops: Rooftop[] = [];
  private isLoaded = false;

  static getInstance(): RooftopService {
    if (!RooftopService.instance) {
      RooftopService.instance = new RooftopService();
    }
    return RooftopService.instance;
  }

  async loadRooftops(): Promise<Rooftop[]> {
    if (this.isLoaded) {
      return this.rooftops;
    }

    try {
      const response = await fetch('/data/rooftop_data_final.json');
      const data: RooftopData = await response.json();
      
      this.rooftops = data.rooftop_bars.map((rooftop, index) => ({
        ...rooftop,
        neighborhood: this.extractNeighborhood(rooftop.address, rooftop.description),
        tags: this.extractTags(rooftop.features, rooftop.description),
        image_url: this.assignImage(rooftop.name, index),
        latitude: this.getLatitude(rooftop.address, rooftop.name),
        longitude: this.getLongitude(rooftop.address, rooftop.name)
      }));

      this.isLoaded = true;
      return this.rooftops;
    } catch (error) {
      console.error('Failed to load rooftop data:', error);
      throw new Error('Failed to load rooftop data');
    }
  }

  getRooftops(): Rooftop[] {
    return this.rooftops;
  }

  filterRooftops(options: FilterOptions): Rooftop[] {
    let filtered = this.rooftops;

    if (options.searchTerm) {
      const searchLower = options.searchTerm.toLowerCase();
      filtered = filtered.filter(rooftop =>
        rooftop.name.toLowerCase().includes(searchLower) ||
        rooftop.description.toLowerCase().includes(searchLower) ||
        rooftop.address.toLowerCase().includes(searchLower) ||
        rooftop.features.some(feature => feature.toLowerCase().includes(searchLower))
      );
    }

    if (options.neighborhood) {
      filtered = filtered.filter(rooftop =>
        rooftop.neighborhood?.toLowerCase() === options.neighborhood?.toLowerCase()
      );
    }

    if (options.features && options.features.length > 0) {
      filtered = filtered.filter(rooftop =>
        options.features!.some(feature =>
          rooftop.features.some(rooftopFeature =>
            rooftopFeature.toLowerCase().includes(feature.toLowerCase())
          )
        )
      );
    }

    if (options.tags && options.tags.length > 0) {
      filtered = filtered.filter(rooftop =>
        options.tags!.some(tag =>
          rooftop.tags?.some(rooftopTag =>
            rooftopTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    return filtered;
  }

  getNeighborhoods(): string[] {
    const neighborhoods = new Set(
      this.rooftops.map(r => r.neighborhood).filter(Boolean)
    );
    return Array.from(neighborhoods) as string[];
  }

  getPopularFeatures(): string[] {
    const featureCount: Record<string, number> = {};
    
    this.rooftops.forEach(rooftop => {
      rooftop.features.forEach(feature => {
        const key = feature.toLowerCase();
        featureCount[key] = (featureCount[key] || 0) + 1;
      });
    });

    return Object.entries(featureCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([feature]) => feature);
  }

  private extractNeighborhood(address: string, description: string): string {
    const addressLower = address.toLowerCase();
    const descriptionLower = description.toLowerCase();
    
    for (const [neighborhood] of Object.entries(neighborhoodCoords)) {
      if (
        addressLower.includes(neighborhood.toLowerCase()) ||
        descriptionLower.includes(neighborhood.toLowerCase())
      ) {
        return neighborhood;
      }
    }

    // Fallback based on street patterns
    if (addressLower.includes('w 4') || addressLower.includes('west 4')) return 'Times Square';
    if (addressLower.includes('w 2') || addressLower.includes('west 2')) return 'Chelsea';
    if (addressLower.includes('broadway')) return 'Midtown';
    if (addressLower.includes('brooklyn')) return 'Brooklyn';
    
    return 'Midtown'; // Default fallback
  }

  private extractTags(features: string[], description: string): string[] {
    const tags: string[] = [];
    const allText = (features.join(' ') + ' ' + description).toLowerCase();
    
    if (allText.includes('pool')) tags.push('pool');
    if (allText.includes('party') || allText.includes('vibrant')) tags.push('party');
    if (allText.includes('winter') || allText.includes('indoor')) tags.push('winter-open');
    if (allText.includes('sunset') || allText.includes('view')) tags.push('great-views');
    if (allText.includes('cocktail') || allText.includes('mixology')) tags.push('cocktails');
    if (allText.includes('restaurant') || allText.includes('dining')) tags.push('dining');
    if (allText.includes('intimate') || allText.includes('romantic')) tags.push('romantic');
    if (allText.includes('group') || allText.includes('large')) tags.push('groups');
    
    return tags;
  }

  private assignImage(name: string, index: number): string {
    // Check for specific venue mapping
    if (imageMapping[name]) {
      return imageMapping[name];
    }

    // Assign based on index rotation
    const images = [
      imageMapping.default_luxury,
      imageMapping.default_cocktail,
      imageMapping.default_pool,
      imageMapping.default_brooklyn,
      imageMapping.default_sunset
    ];

    return images[index % images.length];
  }

  private getLatitude(address: string, name: string): number {
    const neighborhood = this.extractNeighborhood(address, '');
    const coords = neighborhoodCoords[neighborhood] || neighborhoodCoords['Midtown'];
    
    // Add slight variation to avoid markers overlapping
    return coords.lat + (Math.random() - 0.5) * 0.01;
  }

  private getLongitude(address: string, name: string): number {
    const neighborhood = this.extractNeighborhood(address, '');
    const coords = neighborhoodCoords[neighborhood] || neighborhoodCoords['Midtown'];
    
    // Add slight variation to avoid markers overlapping
    return coords.lng + (Math.random() - 0.5) * 0.01;
  }
}

export const rooftopService = RooftopService.getInstance();
