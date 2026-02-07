import { useState, useEffect } from 'react';
import { 
  Coffee, 
  ShoppingBag, 
  DoorOpen, 
  Star, 
  Clock, 
  MapPin, 
  ChevronRight,
  Filter,
  Search,
  Utensils,
  Wine,
  Zap,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { Service, ServiceType, Lounge } from '@/types/airport';
import { allServices, lounges } from '@/data/atlantaAirport';
import { toast } from 'sonner';

type FilterType = 'ALL' | ServiceType | 'LOUNGE';

interface ServiceCardProps {
  item: Service | Lounge;
  type: 'service' | 'lounge';
  index: number;
}

function ServiceCard({ item, type, index }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isService = type === 'service';
  const service = isService ? item as Service : null;
  const lounge = !isService ? item as Lounge : null;

  const getIcon = () => {
    if (!isService) return DoorOpen;
    switch (service?.type) {
      case 'RESTAURANT': return Utensils;
      case 'CAFE': return Coffee;
      case 'BAR': return Wine;
      case 'SHOP': return ShoppingBag;
      case 'DUTY_FREE': return ShoppingBag;
      case 'SPA': return Heart;
      case 'LOUNGE': return DoorOpen;
      default: return Zap;
    }
  };

  const Icon = getIcon();

  const getTypeColor = () => {
    if (!isService) return 'bg-yellow-500/20 text-yellow-400';
    switch (service?.type) {
      case 'RESTAURANT': return 'bg-orange-500/20 text-orange-400';
      case 'CAFE': return 'bg-amber-500/20 text-amber-400';
      case 'BAR': return 'bg-purple-500/20 text-purple-400';
      case 'SHOP': return 'bg-pink-500/20 text-pink-400';
      case 'DUTY_FREE': return 'bg-cyan-500/20 text-cyan-400';
      case 'SPA': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden glass-light border border-white/5 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer ${
        isHovered ? 'scale-[1.02] shadow-xl shadow-cyan-500/10' : ''
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        toast.info(isService ? service?.name : lounge?.name, {
          description: isService 
            ? `${service?.type} • ${service?.concourse} • ${service?.hours}`
            : `${lounge?.operator} • ${lounge?.concourse} • ${lounge?.hours}`,
        });
      }}
    >
      {/* Image Placeholder */}
      <div className="relative h-40 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-16 h-16 text-gray-600 group-hover:text-cyan-400 transition-colors duration-300" />
        </div>
        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'}`} />
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${getTypeColor()} text-xs font-medium`}>
            {isService ? service?.type : 'LOUNGE'}
          </Badge>
        </div>

        {/* Rating */}
        {isService && service?.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-medium">{service.rating}</span>
          </div>
        )}

        {/* Price Range */}
        {isService && service?.priceRange && (
          <div className="absolute bottom-3 left-3 text-xs text-gray-300">
            {service.priceRange}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 group-hover:text-cyan-400 transition-colors">
          {isService ? service?.name : lounge?.name}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{isService ? service?.concourse : lounge?.concourse}</span>
          <span className="text-gray-600">•</span>
          <span>{isService ? service?.gate : lounge?.gate}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <Clock className="w-4 h-4" />
          <span>{isService ? service?.hours : lounge?.hours}</span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1">
          {(isService ? service?.features : lounge?.amenities)?.slice(0, 3).map((feature, i) => (
            <span 
              key={i}
              className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400"
            >
              {feature}
            </span>
          ))}
          {(isService ? service?.features : lounge?.amenities)?.length! > 3 && (
            <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">
              +{(isService ? service?.features : lounge?.amenities)?.length! - 3}
            </span>
          )}
        </div>

        {/* Lounge-specific info */}
        {!isService && lounge && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{lounge.operator}</span>
              <Badge 
                className={`text-xs ${
                  lounge.capacity === 'LOW' ? 'bg-green-500/20 text-green-400' :
                  lounge.capacity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}
              >
                {lounge.capacity}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ServicesDirectory() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('services');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const filters: { id: FilterType; label: string; icon: typeof Filter }[] = [
    { id: 'ALL', label: 'All', icon: Filter },
    { id: 'RESTAURANT', label: 'Dining', icon: Utensils },
    { id: 'CAFE', label: 'Coffee', icon: Coffee },
    { id: 'BAR', label: 'Bars', icon: Wine },
    { id: 'SHOP', label: 'Shopping', icon: ShoppingBag },
    { id: 'DUTY_FREE', label: 'Duty Free', icon: ShoppingBag },
    { id: 'LOUNGE', label: 'Lounges', icon: DoorOpen },
  ];

  const allItems = [
    ...allServices.map(s => ({ ...s, itemType: 'service' as const })),
    ...lounges.map(l => ({ ...l, itemType: 'lounge' as const })),
  ];

  const filteredItems = allItems.filter(item => {
    const matchesFilter = activeFilter === 'ALL' || 
      (activeFilter === 'LOUNGE' ? item.itemType === 'lounge' : 
       item.itemType === 'service' && (item as Service).type === activeFilter);
    
    const matchesSearch = searchQuery === '' ||
      (item.itemType === 'service' ? (item as Service).name : (item as Lounge).name)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.concourse.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="services" className="py-20 bg-[#0A1628]">
      <div className="section-container">
        <div className="section-inner">
          {/* Header */}
          <div className={`text-center mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-display font-bold text-4xl sm:text-5xl mb-3">
              Explore Airport Services
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover restaurants, shops, lounges, and amenities across all concourses 
              at Hartsfield-Jackson Atlanta International Airport.
            </p>
          </div>

          {/* Search and Filters */}
          <div className={`flex flex-col lg:flex-row gap-4 mb-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search services, restaurants, lounges..."
                className="pl-10 bg-white/5 border-white/10 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeFilter === filter.id
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <filter.icon className="w-4 h-4" />
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className={`mb-6 text-sm text-gray-400 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            Showing {filteredItems.length} {activeFilter === 'ALL' ? 'services' : activeFilter.toLowerCase()}
          </div>

          {/* Services Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.itemType === 'service' ? (item as Service).id : (item as Lounge).id}
                className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${300 + index * 50}ms` }}
              >
                <ServiceCard
                  item={item.itemType === 'service' ? item as Service : item as Lounge}
                  type={item.itemType}
                  index={index}
                />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No services found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Load More */}
          {filteredItems.length > 0 && filteredItems.length < allItems.length && (
            <div className="text-center mt-10">
              <Button 
                variant="outline" 
                className="border-white/20 hover:bg-white/10"
                onClick={() => toast.info('More services coming soon!')}
              >
                Load More Services
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
