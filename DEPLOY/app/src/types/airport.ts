// Atlanta Airport (ATL) - Comprehensive Type Definitions

export type Concourse = 'T' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'DOMESTIC';

export type FlightStatus = 
  | 'ON_TIME' 
  | 'DELAYED' 
  | 'BOARDING' 
  | 'DEPARTED' 
  | 'CANCELLED' 
  | 'ARRIVED' 
  | 'SCHEDULED'
  | 'LANDED';

export type ServiceType = 
  | 'RESTAURANT' 
  | 'CAFE' 
  | 'BAR' 
  | 'SHOP' 
  | 'DUTY_FREE' 
  | 'LOUNGE' 
  | 'SPA' 
  | 'SERVICE'
  | 'MEDICAL'
  | 'CHILDREN'
  | 'BUSINESS'
  | 'RELIGIOUS';

export type InfrastructureType =
  | 'GATE'
  | 'SECURITY'
  | 'CHECKIN'
  | 'BAGGAGE'
  | 'RESTROOM'
  | 'ATM'
  | 'CHARGING'
  | 'ELEVATOR'
  | 'ESCALATOR'
  | 'EXIT'
  | 'INFO';

export interface Coordinates {
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
}

export interface Gate {
  id: string;
  number: string;
  concourse: Concourse;
  coordinates: Coordinates;
  currentFlight?: Flight;
  status: FlightStatus;
  walkingTimeFromCenter: number; // minutes
  amenities: string[];
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: Airline;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  scheduledTime: string;
  actualTime?: string;
  gate: string;
  status: FlightStatus;
  baggageClaim?: string;
  aircraft: string;
  isInternational: boolean;
}

export interface Airline {
  code: string;
  name: string;
  logo: string;
  terminal: Concourse[];
}

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  concourse: Concourse;
  gate: string;
  coordinates: Coordinates;
  hours: string;
  rating: number;
  reviewCount: number;
  description: string;
  image?: string;
  phone?: string;
  cuisine?: string;
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  features: string[];
}

export interface Infrastructure {
  id: string;
  name: string;
  type: InfrastructureType;
  concourse: Concourse;
  coordinates: Coordinates;
  description?: string;
  hours?: string;
  accessibility?: boolean;
}

export interface SecurityCheckpoint {
  id: string;
  name: string;
  concourse: Concourse;
  coordinates: Coordinates;
  waitTime: number; // minutes
  status: 'OPEN' | 'CLOSED' | 'LIMITED';
  features: string[]; // TSA PreCheck, CLEAR, etc.
}

export interface Lounge {
  id: string;
  name: string;
  concourse: Concourse;
  gate: string;
  coordinates: Coordinates;
  operator: string;
  hours: string;
  amenities: string[];
  accessMethods: string[];
  capacity: 'LOW' | 'MEDIUM' | 'HIGH' | 'FULL';
  image?: string;
}

export interface TerminalMap {
  concourse: Concourse;
  name: string;
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  gates: Gate[];
  services: Service[];
  infrastructure: Infrastructure[];
  lounges: Lounge[];
  securityCheckpoints: SecurityCheckpoint[];
}

export interface Connection {
  fromGate: string;
  toGate: string;
  walkingTime: number;
  distance: number; // meters
  path: Coordinates[];
  instructions: string[];
}

export interface Analytics {
  timestamp: string;
  passengerVolume: number;
  passengerVolumeChange: number;
  averageWaitTime: number;
  waitTimeChange: number;
  onTimeRate: number;
  onTimeRateChange: number;
  securityQueueTime: number;
  securityNorthTime: number;
  securitySouthTime: number;
  hourlyTraffic: { hour: number; count: number }[];
  concourseTraffic: { concourse: Concourse; count: number }[];
}

export interface MapLayer {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  color: string;
}

export interface UserPreferences {
  defaultConcourse: Concourse;
  favoriteServices: string[];
  accessibilityMode: boolean;
  language: string;
  notifications: boolean;
}
