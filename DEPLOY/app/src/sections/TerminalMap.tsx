import { useState, useRef } from 'react';
import { 
  Navigation, 
  Coffee, 
  ShoppingBag, 
  Plane, 
  Shield, 
  DoorOpen,
  Search,
  X,
  ChevronRight,
  Clock,
  Filter,
  Zap,
  Footprints
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { Concourse, Gate, Service, Lounge, SecurityCheckpoint } from '@/types/airport';
import { 
  generateGates, 
  allServices, 
  lounges, 
  securityCheckpoints,
  getFlightStatusColor,
  generateFlights
} from '@/data/atlantaAirport';
import { toast } from 'sonner';

interface MapLayer {
  id: string;
  name: string;
  icon: typeof Plane;
  enabled: boolean;
  color: string;
}

interface SelectedItem {
  type: 'gate' | 'service' | 'lounge' | 'security';
  data: Gate | Service | Lounge | SecurityCheckpoint;
}

export function TerminalMap() {
  const [selectedConcourse, setSelectedConcourse] = useState<Concourse>('A');
  const [layers, setLayers] = useState<MapLayer[]>([
    { id: 'gates', name: 'Gates', icon: Plane, enabled: true, color: '#00D4FF' },
    { id: 'dining', name: 'Dining', icon: Coffee, enabled: true, color: '#FF6B35' },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag, enabled: true, color: '#9C27B0' },
    { id: 'lounges', name: 'Lounges', icon: DoorOpen, enabled: true, color: '#FFD600' },
    { id: 'security', name: 'Security', icon: Shield, enabled: true, color: '#00C853' },
    { id: 'services', name: 'Services', icon: Zap, enabled: false, color: '#8B9CAD' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [showPathfinding, setShowPathfinding] = useState(false);
  const [fromGate, setFromGate] = useState('');
  const [toGate, setToGate] = useState('');
  const [zoom, setZoom] = useState(1);
  const mapRef = useRef<HTMLDivElement>(null);

  const concourses: { id: Concourse; name: string; description: string }[] = [
    { id: 'DOMESTIC', name: 'Domestic Terminal', description: 'Main check-in and security' },
    { id: 'T', name: 'Concourse T', description: 'Delta, American, United' },
    { id: 'A', name: 'Concourse A', description: 'Primarily Delta' },
    { id: 'B', name: 'Concourse B', description: 'Primarily Delta' },
    { id: 'C', name: 'Concourse C', description: 'Southwest, Delta' },
    { id: 'D', name: 'Concourse D', description: 'American, Southwest, Spirit' },
    { id: 'E', name: 'Concourse E', description: 'Domestic & International' },
    { id: 'F', name: 'Concourse F', description: 'International Terminal' },
  ];

  const gates = generateGates();
  const flights = generateFlights();

  // Get gates for selected concourse
  const concourseGates = gates.filter(g => g.concourse === selectedConcourse);
  
  // Get services for selected concourse
  const concourseServices = allServices.filter(s => s.concourse === selectedConcourse);
  
  // Get lounges for selected concourse
  const concourseLounges = lounges.filter(l => l.concourse === selectedConcourse);
  
  // Get security for selected concourse
  const concourseSecurity = securityCheckpoints.filter(s => s.concourse === selectedConcourse);

  const toggleLayer = (layerId: string) => {
    setLayers(prev => prev.map(l => 
      l.id === layerId ? { ...l, enabled: !l.enabled } : l
    ));
  };

  const handleGateClick = (gate: Gate) => {
    const flight = flights.find(f => f.gate === gate.number);
    setSelectedItem({ 
      type: 'gate', 
      data: { ...gate, currentFlight: flight } as Gate 
    });
  };

  const calculateWalkingTime = (from: string, to: string) => {
    const fromGate = gates.find(g => g.number === from);
    const toGate = gates.find(g => g.number === to);
    
    if (!fromGate || !toGate) return null;
    
    if (fromGate.concourse === toGate.concourse) {
      const gateDiff = Math.abs(parseInt(fromGate.number.slice(1)) - parseInt(toGate.number.slice(1)));
      return Math.max(2, gateDiff * 0.5);
    }
    
    // Different concourses - estimate based on concourse distance
    const concourseOrder = ['DOMESTIC', 'T', 'A', 'B', 'C', 'D', 'E', 'F'];
    const fromIdx = concourseOrder.indexOf(fromGate.concourse);
    const toIdx = concourseOrder.indexOf(toGate.concourse);
    const concourseDiff = Math.abs(fromIdx - toIdx);
    
    return 5 + concourseDiff * 3;
  };

  const findPath = () => {
    const time = calculateWalkingTime(fromGate, toGate);
    if (time) {
      toast.success(`Walking time from ${fromGate} to ${toGate}`, {
        description: `Approximately ${Math.round(time)} minutes walking time`,
      });
    } else {
      toast.error('Invalid gate numbers');
    }
  };

  const filteredItems = searchQuery ? [
    ...concourseGates.filter(g => 
      g.number.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    ...concourseServices.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    ...concourseLounges.filter(l => 
      l.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  ] : [];

  return (
    <section id="map" className="py-20 bg-[#0D2137]">
      <div className="section-container">
        <div className="section-inner">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-4xl sm:text-5xl mb-3">
              Interactive Terminal Map
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Navigate Hartsfield-Jackson Atlanta International Airport with our interactive map. 
              Find gates, services, and get walking directions.
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search gates, restaurants, lounges..."
                className="pl-10 bg-white/5 border-white/10 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Pathfinding Toggle */}
            <Button
              variant="outline"
              className={`border-white/20 ${showPathfinding ? 'bg-cyan-500/20 border-cyan-500' : ''}`}
              onClick={() => setShowPathfinding(!showPathfinding)}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Directions
            </Button>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              >
                -
              </Button>
              <span className="text-sm text-gray-400 w-12 text-center">{Math.round(zoom * 100)}%</span>
              <Button
                variant="outline"
                size="sm"
                className="border-white/20"
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              >
                +
              </Button>
            </div>
          </div>

          {/* Pathfinding Panel */}
          {showPathfinding && (
            <div className="mb-6 p-4 rounded-xl glass-light animate-slide-in-up">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">From:</span>
                  <Input
                    type="text"
                    placeholder="e.g., A17"
                    className="w-24 bg-white/5 border-white/10 text-white"
                    value={fromGate}
                    onChange={(e) => setFromGate(e.target.value.toUpperCase())}
                  />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">To:</span>
                  <Input
                    type="text"
                    placeholder="e.g., F8"
                    className="w-24 bg-white/5 border-white/10 text-white"
                    value={toGate}
                    onChange={(e) => setToGate(e.target.value.toUpperCase())}
                  />
                </div>
                <Button className="btn-primary" onClick={findPath}>
                  <Footprints className="w-4 h-4 mr-2" />
                  Calculate
                </Button>
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchQuery && filteredItems.length > 0 && (
            <div className="mb-6 p-4 rounded-xl glass-light max-h-60 overflow-y-auto">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Search Results</h4>
              <div className="space-y-2">
                {filteredItems.map((item: any, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between"
                    onClick={() => {
                      if ('number' in item) {
                        handleGateClick(item as Gate);
                      } else if ('operator' in item) {
                        setSelectedItem({ type: 'lounge', data: item as Lounge });
                      } else {
                        setSelectedItem({ type: 'service', data: item as Service });
                      }
                      setSearchQuery('');
                    }}
                  >
                    <div>
                      <div className="font-medium">{'number' in item ? `Gate ${item.number}` : item.name}</div>
                      <div className="text-sm text-gray-400">
                        {'number' in item ? item.concourse : `${item.type} • ${item.concourse}`}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Map Area */}
          <div className="grid lg:grid-cols-[200px_1fr_250px] gap-6">
            {/* Concourse Selector */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Select Concourse</h4>
              {concourses.map((concourse) => (
                <button
                  key={concourse.id}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedConcourse === concourse.id
                      ? 'bg-cyan-500/20 border border-cyan-500/50'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                  onClick={() => setSelectedConcourse(concourse.id)}
                >
                  <div className="font-medium">{concourse.name}</div>
                  <div className="text-xs text-gray-400">{concourse.description}</div>
                </button>
              ))}
            </div>

            {/* Map */}
            <div 
              ref={mapRef}
              className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-[#0A1628] border border-white/10"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
            >
              {/* Map Background */}
              <div className="absolute inset-0">
                {/* Grid */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(0, 212, 255, 0.5) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0, 212, 255, 0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                  }}
                />
                
                {/* Concourse Layout */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Central Spine */}
                  <div className="absolute w-4 h-[80%] bg-gradient-to-b from-gray-700 to-gray-800 rounded-full" />
                  
                  {/* Gate Arms */}
                  {selectedConcourse !== 'DOMESTIC' && (
                    <>
                      {/* North Arm */}
                      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[60%] h-3 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-full" />
                      {/* South Arm */}
                      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[60%] h-3 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-full" />
                    </>
                  )}
                </div>

                {/* Gates */}
                {layers.find(l => l.id === 'gates')?.enabled && concourseGates.map((gate) => {
                  const flight = flights.find(f => f.gate === gate.number);
                  const statusColor = flight ? getFlightStatusColor(flight.status) : '#8B9CAD';
                  
                  return (
                    <button
                      key={gate.id}
                      className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-2 border-white/50 flex items-center justify-center text-xs font-mono font-bold transition-all hover:scale-150 hover:z-10"
                      style={{
                        left: `${gate.coordinates.x}%`,
                        top: `${gate.coordinates.y}%`,
                        backgroundColor: statusColor,
                        boxShadow: `0 0 10px ${statusColor}50`,
                      }}
                      onClick={() => handleGateClick(gate)}
                      title={`Gate ${gate.number}`}
                    >
                      {gate.number.slice(1)}
                    </button>
                  );
                })}

                {/* Services */}
                {layers.find(l => l.id === 'dining')?.enabled && concourseServices
                  .filter(s => s.type === 'RESTAURANT' || s.type === 'CAFE' || s.type === 'BAR')
                  .map((service) => (
                    <button
                      key={service.id}
                      className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-orange-500 border-2 border-white/50 flex items-center justify-center transition-all hover:scale-150 hover:z-10"
                      style={{
                        left: `${service.coordinates.x}%`,
                        top: `${service.coordinates.y}%`,
                      }}
                      onClick={() => setSelectedItem({ type: 'service', data: service })}
                      title={service.name}
                    >
                      <Coffee className="w-3 h-3 text-white" />
                    </button>
                  ))}

                {/* Shopping */}
                {layers.find(l => l.id === 'shopping')?.enabled && concourseServices
                  .filter(s => s.type === 'SHOP' || s.type === 'DUTY_FREE')
                  .map((service) => (
                    <button
                      key={service.id}
                      className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-purple-500 border-2 border-white/50 flex items-center justify-center transition-all hover:scale-150 hover:z-10"
                      style={{
                        left: `${service.coordinates.x}%`,
                        top: `${service.coordinates.y}%`,
                      }}
                      onClick={() => setSelectedItem({ type: 'service', data: service })}
                      title={service.name}
                    >
                      <ShoppingBag className="w-3 h-3 text-white" />
                    </button>
                  ))}

                {/* Lounges */}
                {layers.find(l => l.id === 'lounges')?.enabled && concourseLounges.map((lounge) => (
                  <button
                    key={lounge.id}
                    className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-yellow-500 border-2 border-white/50 flex items-center justify-center transition-all hover:scale-150 hover:z-10"
                    style={{
                      left: `${lounge.coordinates.x}%`,
                      top: `${lounge.coordinates.y}%`,
                    }}
                    onClick={() => setSelectedItem({ type: 'lounge', data: lounge })}
                    title={lounge.name}
                  >
                    <DoorOpen className="w-3 h-3 text-white" />
                  </button>
                ))}

                {/* Security */}
                {layers.find(l => l.id === 'security')?.enabled && concourseSecurity.map((security) => (
                  <button
                    key={security.id}
                    className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-green-500 border-2 border-white/50 flex items-center justify-center transition-all hover:scale-150 hover:z-10"
                    style={{
                      left: `${security.coordinates.x}%`,
                      top: `${security.coordinates.y}%`,
                    }}
                    onClick={() => setSelectedItem({ type: 'security', data: security })}
                    title={security.name}
                  >
                    <Shield className="w-3 h-3 text-white" />
                  </button>
                ))}
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 p-3 rounded-lg glass-light text-xs">
                <div className="font-semibold mb-2">{concourses.find(c => c.id === selectedConcourse)?.name}</div>
                <div className="space-y-1 text-gray-400">
                  <div>{concourseGates.length} Gates</div>
                  <div>{concourseServices.length} Services</div>
                  <div>{concourseLounges.length} Lounges</div>
                </div>
              </div>
            </div>

            {/* Layer Controls & Details */}
            <div className="space-y-4">
              {/* Layer Toggles */}
              <div className="p-4 rounded-xl glass-light">
                <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Layers
                </h4>
                <div className="space-y-2">
                  {layers.map((layer) => (
                    <label 
                      key={layer.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <layer.icon className="w-4 h-4" style={{ color: layer.color }} />
                        <span className="text-sm">{layer.name}</span>
                      </div>
                      <Switch
                        checked={layer.enabled}
                        onCheckedChange={() => toggleLayer(layer.id)}
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Selected Item Details */}
              {selectedItem && (
                <div className="p-4 rounded-xl glass-light animate-slide-in-up">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">
                      {selectedItem.type === 'gate' && `Gate ${(selectedItem.data as Gate).number}`}
                      {selectedItem.type === 'service' && (selectedItem.data as Service).name}
                      {selectedItem.type === 'lounge' && (selectedItem.data as Lounge).name}
                      {selectedItem.type === 'security' && (selectedItem.data as SecurityCheckpoint).name}
                    </h4>
                    <button 
                      className="text-gray-400 hover:text-white"
                      onClick={() => setSelectedItem(null)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {selectedItem.type === 'gate' && (
                    <div className="space-y-2 text-sm">
                      {(selectedItem.data as Gate).currentFlight && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Flight:</span>
                            <span className="font-mono">{(selectedItem.data as Gate).currentFlight?.flightNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Destination:</span>
                            <span>{(selectedItem.data as Gate).currentFlight?.destination}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Status:</span>
                            <Badge 
                              className="text-xs"
                              style={{ 
                                backgroundColor: `${getFlightStatusColor((selectedItem.data as Gate).currentFlight?.status || 'SCHEDULED')}20`,
                                color: getFlightStatusColor((selectedItem.data as Gate).currentFlight?.status || 'SCHEDULED'),
                                borderColor: `${getFlightStatusColor((selectedItem.data as Gate).currentFlight?.status || 'SCHEDULED')}40`,
                              }}
                            >
                              {(selectedItem.data as Gate).currentFlight?.status}
                            </Badge>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Walking time:</span>
                        <span>{(selectedItem.data as Gate).walkingTimeFromCenter} min from center</span>
                      </div>
                    </div>
                  )}

                  {selectedItem.type === 'service' && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span>{(selectedItem.data as Service).type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Hours:</span>
                        <span>{(selectedItem.data as Service).hours}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rating:</span>
                        <span className="flex items-center gap-1">
                          ⭐ {(selectedItem.data as Service).rating}
                        </span>
                      </div>
                      {(selectedItem.data as Service).cuisine && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Cuisine:</span>
                          <span>{(selectedItem.data as Service).cuisine}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedItem.type === 'lounge' && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Operator:</span>
                        <span>{(selectedItem.data as Lounge).operator}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Hours:</span>
                        <span>{(selectedItem.data as Lounge).hours}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Capacity:</span>
                        <Badge 
                          className={`text-xs ${
                            (selectedItem.data as Lounge).capacity === 'LOW' ? 'bg-green-500/20 text-green-400' :
                            (selectedItem.data as Lounge).capacity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {(selectedItem.data as Lounge).capacity}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {selectedItem.type === 'security' && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Wait Time:</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {(selectedItem.data as SecurityCheckpoint).waitTime} min
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <Badge 
                          className={`text-xs ${
                            (selectedItem.data as SecurityCheckpoint).status === 'OPEN' ? 'bg-green-500/20 text-green-400' :
                            (selectedItem.data as SecurityCheckpoint).status === 'LIMITED' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {(selectedItem.data as SecurityCheckpoint).status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        {(selectedItem.data as SecurityCheckpoint).features.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Gate Status Legend */}
              <div className="p-4 rounded-xl glass-light">
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Gate Status</h4>
                <div className="space-y-2 text-xs">
                  {[
                    { color: '#00C853', label: 'On Time' },
                    { color: '#FFD600', label: 'Delayed' },
                    { color: '#00D4FF', label: 'Boarding' },
                    { color: '#2979FF', label: 'Departed' },
                    { color: '#FF1744', label: 'Cancelled' },
                    { color: '#8B9CAD', label: 'No Flight' },
                  ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full border border-white/30"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-gray-400">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
