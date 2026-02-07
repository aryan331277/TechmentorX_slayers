import { useState, useEffect, useRef } from 'react';
import { 
  Plane, 
  Clock, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import type { Flight } from '@/types/airport';
import { generateFlights, getFlightStatusLabel, airlines } from '@/data/atlantaAirport';
import { toast } from 'sonner';

interface FlightCardProps {
  flight: Flight;
  type: 'departure' | 'arrival';
  index: number;
}

function FlightCard({ flight, type, index }: FlightCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const statusColors = {
    ON_TIME: 'bg-green-500/20 text-green-400 border-green-500/30',
    DELAYED: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
    BOARDING: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 animate-boarding',
    DEPARTED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    ARRIVED: 'bg-green-500/20 text-green-400 border-green-500/30',
    SCHEDULED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    LANDED: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  const StatusIcon = () => {
    switch (flight.status) {
      case 'ON_TIME':
      case 'ARRIVED':
      case 'LANDED':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'DELAYED':
        return <Clock className="w-4 h-4" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      case 'BOARDING':
        return <Plane className="w-4 h-4 animate-pulse" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div
      className={`group relative p-4 rounded-xl glass-light border border-white/5 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer ${
        isHovered ? 'scale-[1.02] shadow-lg shadow-cyan-500/10' : ''
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        toast.info(`${flight.flightNumber} Details`, {
          description: `${flight.airline.name} | ${type === 'departure' ? 'To' : 'From'} ${type === 'departure' ? flight.destination : flight.origin} | Gate ${flight.gate}`,
        });
      }}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Flight Info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
            <span className="font-mono font-bold text-sm text-cyan-400">
              {flight.airline.code}
            </span>
          </div>
          <div>
            <div className="font-mono font-semibold text-lg">{flight.flightNumber}</div>
            <div className="text-sm text-gray-400">{flight.airline.name}</div>
          </div>
        </div>

        {/* Route */}
        <div className="hidden sm:flex flex-col items-center">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{type === 'departure' ? 'ATL' : flight.originCode}</span>
            <ArrowRight className="w-4 h-4" />
            <span>{type === 'departure' ? flight.destinationCode : 'ATL'}</span>
          </div>
          <div className="text-xs text-gray-500">
            {type === 'departure' ? flight.destination : flight.origin}
          </div>
        </div>

        {/* Time & Gate */}
        <div className="text-right">
          <div className="font-mono font-semibold">
            {flight.actualTime || flight.scheduledTime}
          </div>
          <div className="text-sm text-gray-400">Gate {flight.gate}</div>
        </div>

        {/* Status */}
        <Badge 
          className={`${statusColors[flight.status]} flex items-center gap-1 px-3 py-1`}
        >
          <StatusIcon />
          {getFlightStatusLabel(flight.status)}
        </Badge>
      </div>

      {/* Expanded Details on Hover */}
      {isHovered && (
        <div className="mt-3 pt-3 border-t border-white/10 text-sm text-gray-400 animate-fade-in">
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-1">
              <Plane className="w-4 h-4" />
              {flight.aircraft}
            </span>
            {flight.baggageClaim && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Baggage {flight.baggageClaim}
              </span>
            )}
            {flight.isInternational && (
              <Badge variant="outline" className="text-xs border-orange-500/30 text-orange-400">
                International
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function FlightStatus() {
  const [departures, setDepartures] = useState<Flight[]>([]);
  const [arrivals, setArrivals] = useState<Flight[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState<string>('ALL');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadFlights = () => {
    const allFlights = generateFlights();
    
    // Split into departures and arrivals (simulated)
    const deps = allFlights.filter((_, i) => i % 2 === 0).slice(0, 12);
    const arrs = allFlights.filter((_, i) => i % 2 === 1).slice(0, 12);
    
    setDepartures(deps);
    setArrivals(arrs);
    setLastUpdated(new Date());
  };

  const refreshFlights = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      loadFlights();
      setIsRefreshing(false);
      toast.success('Flight data updated');
    }, 1000);
  };

  useEffect(() => {
    loadFlights();
    
    // Auto-refresh every 2 minutes
    intervalRef.current = setInterval(() => {
      loadFlights();
    }, 120000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const filterFlights = (flightList: Flight[]) => {
    return flightList.filter(flight => {
      const matchesSearch = 
        flight.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flight.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flight.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flight.gate.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesAirline = selectedAirline === 'ALL' || flight.airline.code === selectedAirline;
      
      return matchesSearch && matchesAirline;
    });
  };

  const filteredDepartures = filterFlights(departures);
  const filteredArrivals = filterFlights(arrivals);

  return (
    <section id="flights" className="py-20 bg-[#0A1628]">
      <div className="section-container">
        <div className="section-inner">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="font-display font-bold text-4xl sm:text-5xl mb-3">
                Live Flight Status
              </h2>
              <p className="text-gray-400">
                Real-time departures and arrivals at Hartsfield-Jackson Atlanta International Airport
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Updated {Math.floor((Date.now() - lastUpdated.getTime()) / 60000)} min ago
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 hover:bg-white/10"
                onClick={refreshFlights}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search flights, destinations, gates..."
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                value={selectedAirline}
                onChange={(e) => setSelectedAirline(e.target.value)}
              >
                <option value="ALL">All Airlines</option>
                {airlines.map(airline => (
                  <option key={airline.code} value={airline.code}>
                    {airline.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="departures" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/5 mb-8">
              <TabsTrigger 
                value="departures"
                className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
              >
                <Plane className="w-4 h-4 mr-2 rotate-45" />
                Departures ({filteredDepartures.length})
              </TabsTrigger>
              <TabsTrigger 
                value="arrivals"
                className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
              >
                <Plane className="w-4 h-4 mr-2 -rotate-135" />
                Arrivals ({filteredArrivals.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="departures" className="space-y-3">
              {filteredDepartures.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No flights found matching your criteria</p>
                </div>
              ) : (
                filteredDepartures.map((flight, index) => (
                  <FlightCard 
                    key={flight.id} 
                    flight={flight} 
                    type="departure"
                    index={index}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="arrivals" className="space-y-3">
              {filteredArrivals.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No flights found matching your criteria</p>
                </div>
              ) : (
                filteredArrivals.map((flight, index) => (
                  <FlightCard 
                    key={flight.id} 
                    flight={flight} 
                    type="arrival"
                    index={index}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-white/10">
            <span className="text-sm text-gray-500">Status:</span>
            {[
              { status: 'ON_TIME', label: 'On Time', color: 'bg-green-500' },
              { status: 'DELAYED', label: 'Delayed', color: 'bg-yellow-500' },
              { status: 'BOARDING', label: 'Boarding', color: 'bg-cyan-500' },
              { status: 'DEPARTED', label: 'Departed', color: 'bg-blue-500' },
              { status: 'CANCELLED', label: 'Cancelled', color: 'bg-red-500' },
            ].map(({ status, label, color }) => (
              <div key={status} className="flex items-center gap-2 text-sm text-gray-400">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
