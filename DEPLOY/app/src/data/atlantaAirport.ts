// Hartsfield-Jackson Atlanta International Airport (ATL) - Real Data
// World's busiest airport by passenger traffic

import type { 
  Concourse, 
  Flight, 
  FlightStatus, 
  Service, 
  Gate, 
  Lounge, 
  SecurityCheckpoint,
  Infrastructure,
  Airline,
  Analytics
} from '@/types/airport';

// Airlines operating at ATL
export const airlines: Airline[] = [
  { code: 'DL', name: 'Delta Air Lines', logo: '/airlines/delta.png', terminal: ['T', 'A', 'B', 'C', 'D', 'E', 'F'] },
  { code: 'AA', name: 'American Airlines', logo: '/airlines/american.png', terminal: ['T', 'D'] },
  { code: 'UA', name: 'United Airlines', logo: '/airlines/united.png', terminal: ['T'] },
  { code: 'WN', name: 'Southwest Airlines', logo: '/airlines/southwest.png', terminal: ['C', 'D'] },
  { code: 'NK', name: 'Spirit Airlines', logo: '/airlines/spirit.png', terminal: ['D'] },
  { code: 'F9', name: 'Frontier Airlines', logo: '/airlines/frontier.png', terminal: ['D'] },
  { code: 'AS', name: 'Alaska Airlines', logo: '/airlines/alaska.png', terminal: ['D'] },
  { code: 'AC', name: 'Air Canada', logo: '/airlines/aircanada.png', terminal: ['F'] },
  { code: 'AF', name: 'Air France', logo: '/airlines/airfrance.png', terminal: ['F'] },
  { code: 'BA', name: 'British Airways', logo: '/airlines/british.png', terminal: ['F'] },
  { code: 'LH', name: 'Lufthansa', logo: '/airlines/lufthansa.png', terminal: ['F'] },
  { code: 'KL', name: 'KLM', logo: '/airlines/klm.png', terminal: ['F'] },
  { code: 'VS', name: 'Virgin Atlantic', logo: '/airlines/virgin.png', terminal: ['F'] },
  { code: 'QR', name: 'Qatar Airways', logo: '/airlines/qatar.png', terminal: ['F'] },
  { code: 'EK', name: 'Emirates', logo: '/airlines/emirates.png', terminal: ['F'] },
];

// Generate gates for each concourse
export const generateGates = (): Gate[] => {
  const gates: Gate[] = [];
  
  // Concourse T: Gates T1-T18
  for (let i = 1; i <= 18; i++) {
    gates.push({
      id: `T${i}`,
      number: `T${i}`,
      concourse: 'T',
      coordinates: { x: 20 + (i * 3), y: 50 },
      status: 'SCHEDULED',
      walkingTimeFromCenter: 2 + Math.floor(i / 5),
      amenities: ['Charging', 'Seating']
    });
  }
  
  // Concourse A: Gates A1-A34
  for (let i = 1; i <= 34; i++) {
    gates.push({
      id: `A${i}`,
      number: `A${i}`,
      concourse: 'A',
      coordinates: { x: 25 + (i * 2), y: 35 },
      status: 'SCHEDULED',
      walkingTimeFromCenter: 5 + Math.floor(i / 6),
      amenities: ['Charging', 'Seating', 'Restroom']
    });
  }
  
  // Concourse B: Gates B1-B36
  for (let i = 1; i <= 36; i++) {
    gates.push({
      id: `B${i}`,
      number: `B${i}`,
      concourse: 'B',
      coordinates: { x: 25 + (i * 2), y: 65 },
      status: 'SCHEDULED',
      walkingTimeFromCenter: 6 + Math.floor(i / 6),
      amenities: ['Charging', 'Seating', 'Restroom']
    });
  }
  
  // Concourse C: Gates C1-C44
  for (let i = 1; i <= 44; i++) {
    gates.push({
      id: `C${i}`,
      number: `C${i}`,
      concourse: 'C',
      coordinates: { x: 30 + (i * 1.8), y: 25 },
      status: 'SCHEDULED',
      walkingTimeFromCenter: 7 + Math.floor(i / 7),
      amenities: ['Charging', 'Seating', 'Restroom']
    });
  }
  
  // Concourse D: Gates D1-D46
  for (let i = 1; i <= 46; i++) {
    gates.push({
      id: `D${i}`,
      number: `D${i}`,
      concourse: 'D',
      coordinates: { x: 30 + (i * 1.7), y: 75 },
      status: 'SCHEDULED',
      walkingTimeFromCenter: 8 + Math.floor(i / 7),
      amenities: ['Charging', 'Seating', 'Restroom']
    });
  }
  
  // Concourse E: Gates E1-E38
  for (let i = 1; i <= 38; i++) {
    gates.push({
      id: `E${i}`,
      number: `E${i}`,
      concourse: 'E',
      coordinates: { x: 35 + (i * 2), y: 15 },
      status: 'SCHEDULED',
      walkingTimeFromCenter: 10 + Math.floor(i / 6),
      amenities: ['Charging', 'Seating', 'Restroom', 'Food']
    });
  }
  
  // Concourse F (International): Gates F1-F16
  for (let i = 1; i <= 16; i++) {
    gates.push({
      id: `F${i}`,
      number: `F${i}`,
      concourse: 'F',
      coordinates: { x: 40 + (i * 3.5), y: 85 },
      status: 'SCHEDULED',
      walkingTimeFromCenter: 10 + Math.floor(i / 4),
      amenities: ['Charging', 'Seating', 'Restroom', 'Duty Free', 'Lounges']
    });
  }
  
  return gates;
};

// Real flights data (sample based on actual ATL flights)
export const generateFlights = (): Flight[] => {
  const flights: Flight[] = [
    // Delta Flights
    { id: 'DL404', flightNumber: 'DL404', airline: airlines[0], origin: 'Atlanta', originCode: 'ATL', destination: 'New York-LGA', destinationCode: 'LGA', scheduledTime: '06:30', gate: 'A17', status: 'BOARDING', aircraft: 'B737-800', isInternational: false },
    { id: 'DL8805', flightNumber: 'DL8805', airline: airlines[0], origin: 'Atlanta', originCode: 'ATL', destination: 'Boston', destinationCode: 'BOS', scheduledTime: '06:25', gate: 'B12', status: 'ON_TIME', aircraft: 'A321', isInternational: false },
    { id: 'DL8836', flightNumber: 'DL8836', airline: airlines[0], origin: 'Atlanta', originCode: 'ATL', destination: 'Seattle', destinationCode: 'SEA', scheduledTime: '17:30', gate: 'C22', status: 'SCHEDULED', aircraft: 'B767-300', isInternational: false },
    { id: 'DL215', flightNumber: 'DL215', airline: airlines[0], origin: 'Atlanta', originCode: 'ATL', destination: 'Los Angeles', destinationCode: 'LAX', scheduledTime: '07:15', gate: 'A25', status: 'ON_TIME', aircraft: 'B757-200', isInternational: false },
    { id: 'DL142', flightNumber: 'DL142', airline: airlines[0], origin: 'Atlanta', originCode: 'ATL', destination: 'Paris-CDG', destinationCode: 'CDG', scheduledTime: '18:20', gate: 'F8', status: 'SCHEDULED', aircraft: 'A350-900', isInternational: true },
    { id: 'DL30', flightNumber: 'DL30', airline: airlines[0], origin: 'Atlanta', originCode: 'ATL', destination: 'London-LHR', destinationCode: 'LHR', scheduledTime: '19:55', gate: 'F12', status: 'SCHEDULED', aircraft: 'A330-300', isInternational: true },
    { id: 'DL83', flightNumber: 'DL83', airline: airlines[0], origin: 'Atlanta', originCode: 'ATL', destination: 'Amsterdam', destinationCode: 'AMS', scheduledTime: '17:45', gate: 'F4', status: 'DELAYED', actualTime: '18:30', aircraft: 'A330-200', isInternational: true },
    { id: 'DL521', flightNumber: 'DL521', airline: airlines[0], origin: 'Atlanta', originCode: 'ATL', destination: 'Chicago-ORD', destinationCode: 'ORD', scheduledTime: '08:00', gate: 'T6', status: 'ON_TIME', aircraft: 'B717', isInternational: false },
    { id: 'DL789', flightNumber: 'DL789', airline: airlines[0], origin: 'Atlanta', originCode: 'ATL', destination: 'Miami', destinationCode: 'MIA', scheduledTime: '09:30', gate: 'B28', status: 'CANCELLED', aircraft: 'B737-800', isInternational: false },
    { id: 'DL1123', flightNumber: 'DL1123', airline: airlines[0], origin: 'Atlanta', originCode: 'ATL', destination: 'Denver', destinationCode: 'DEN', scheduledTime: '10:15', gate: 'C15', status: 'ON_TIME', aircraft: 'A321', isInternational: false },
    
    // American Airlines
    { id: 'AA2770', flightNumber: 'AA2770', airline: airlines[1], origin: 'Atlanta', originCode: 'ATL', destination: 'Dallas-DFW', destinationCode: 'DFW', scheduledTime: '06:07', gate: 'T12', status: 'DEPARTED', aircraft: 'B737-800', isInternational: false },
    { id: 'AA3671', flightNumber: 'AA3671', airline: airlines[1], origin: 'Atlanta', originCode: 'ATL', destination: 'Chicago-ORD', destinationCode: 'ORD', scheduledTime: '06:00', gate: 'T14', status: 'DEPARTED', aircraft: 'E175', isInternational: false },
    { id: 'AA5063', flightNumber: 'AA5063', airline: airlines[1], origin: 'Atlanta', originCode: 'ATL', destination: 'Washington-DCA', destinationCode: 'DCA', scheduledTime: '06:00', gate: 'T8', status: 'ON_TIME', aircraft: 'CRJ700', isInternational: false },
    { id: 'AA4446', flightNumber: 'AA4446', airline: airlines[1], origin: 'Atlanta', originCode: 'ATL', destination: 'New York-LGA', destinationCode: 'LGA', scheduledTime: '06:10', gate: 'T16', status: 'DELAYED', actualTime: '06:45', aircraft: 'E175', isInternational: false },
    { id: 'AA4628', flightNumber: 'AA4628', airline: airlines[1], origin: 'Atlanta', originCode: 'ATL', destination: 'Philadelphia', destinationCode: 'PHL', scheduledTime: '06:30', gate: 'D8', status: 'ON_TIME', aircraft: 'E175', isInternational: false },
    
    // United Airlines
    { id: 'UA375', flightNumber: 'UA375', airline: airlines[2], origin: 'Atlanta', originCode: 'ATL', destination: 'Newark', destinationCode: 'EWR', scheduledTime: '06:30', gate: 'T10', status: 'ON_TIME', aircraft: 'A320', isInternational: false },
    { id: 'UA8569', flightNumber: 'UA8569', airline: airlines[2], origin: 'Atlanta', originCode: 'ATL', destination: 'Toronto', destinationCode: 'YYZ', scheduledTime: '06:10', gate: 'F2', status: 'ON_TIME', aircraft: 'CRJ200', isInternational: true },
    { id: 'UA1205', flightNumber: 'UA1205', airline: airlines[2], origin: 'Atlanta', originCode: 'ATL', destination: 'San Francisco', destinationCode: 'SFO', scheduledTime: '11:30', gate: 'D22', status: 'SCHEDULED', aircraft: 'B737-900', isInternational: false },
    
    // Southwest Airlines
    { id: 'WN203', flightNumber: 'WN203', airline: airlines[3], origin: 'Atlanta', originCode: 'ATL', destination: 'Denver', destinationCode: 'DEN', scheduledTime: '06:00', gate: 'C30', status: 'DEPARTED', aircraft: 'B737-700', isInternational: false },
    { id: 'WN2747', flightNumber: 'WN2747', airline: airlines[3], origin: 'Atlanta', originCode: 'ATL', destination: 'Chicago-MDW', destinationCode: 'MDW', scheduledTime: '06:10', gate: 'C35', status: 'ON_TIME', aircraft: 'B737-800', isInternational: false },
    { id: 'WN1309', flightNumber: 'WN1309', airline: airlines[3], origin: 'Atlanta', originCode: 'ATL', destination: 'New York-LGA', destinationCode: 'LGA', scheduledTime: '06:15', gate: 'C40', status: 'ON_TIME', aircraft: 'B737-700', isInternational: false },
    { id: 'WN2918', flightNumber: 'WN2918', airline: airlines[3], origin: 'Atlanta', originCode: 'ATL', destination: 'Dallas-DAL', destinationCode: 'DAL', scheduledTime: '06:20', gate: 'C42', status: 'DELAYED', actualTime: '07:00', aircraft: 'B737-800', isInternational: false },
    
    // Spirit Airlines
    { id: 'NK1659', flightNumber: 'NK1659', airline: airlines[4], origin: 'Atlanta', originCode: 'ATL', destination: 'Newark', destinationCode: 'EWR', scheduledTime: '05:45', gate: 'D15', status: 'DEPARTED', aircraft: 'A320', isInternational: false },
    { id: 'NK221', flightNumber: 'NK221', airline: airlines[4], origin: 'Atlanta', originCode: 'ATL', destination: 'Orlando', destinationCode: 'MCO', scheduledTime: '06:00', gate: 'D18', status: 'ON_TIME', aircraft: 'A321', isInternational: false },
    { id: 'NK447', flightNumber: 'NK447', airline: airlines[4], origin: 'Atlanta', originCode: 'ATL', destination: 'Las Vegas', destinationCode: 'LAS', scheduledTime: '13:20', gate: 'D25', status: 'SCHEDULED', aircraft: 'A320', isInternational: false },
    
    // Frontier Airlines
    { id: 'F94473', flightNumber: 'F94473', airline: airlines[5], origin: 'Atlanta', originCode: 'ATL', destination: 'St. Louis', destinationCode: 'STL', scheduledTime: '06:00', gate: 'D30', status: 'ON_TIME', aircraft: 'A320', isInternational: false },
    { id: 'F91234', flightNumber: 'F91234', airline: airlines[5], origin: 'Atlanta', originCode: 'ATL', destination: 'Denver', destinationCode: 'DEN', scheduledTime: '14:30', gate: 'D35', status: 'SCHEDULED', aircraft: 'A321', isInternational: false },
    
    // International Airlines
    { id: 'BA226', flightNumber: 'BA226', airline: airlines[9], origin: 'Atlanta', originCode: 'ATL', destination: 'London-LHR', destinationCode: 'LHR', scheduledTime: '20:15', gate: 'F14', status: 'SCHEDULED', aircraft: 'B777-200', isInternational: true },
    { id: 'AF681', flightNumber: 'AF681', airline: airlines[8], origin: 'Atlanta', originCode: 'ATL', destination: 'Paris-CDG', destinationCode: 'CDG', scheduledTime: '17:25', gate: 'F6', status: 'ON_TIME', aircraft: 'A350-900', isInternational: true },
    { id: 'LH445', flightNumber: 'LH445', airline: airlines[10], origin: 'Atlanta', originCode: 'ATL', destination: 'Frankfurt', destinationCode: 'FRA', scheduledTime: '17:40', gate: 'F10', status: 'SCHEDULED', aircraft: 'A340-600', isInternational: true },
    { id: 'QR756', flightNumber: 'QR756', airline: airlines[13], origin: 'Atlanta', originCode: 'ATL', destination: 'Doha', destinationCode: 'DOH', scheduledTime: '20:30', gate: 'F16', status: 'SCHEDULED', aircraft: 'B777-300ER', isInternational: true },
    { id: 'EK524', flightNumber: 'EK524', airline: airlines[14], origin: 'Atlanta', originCode: 'ATL', destination: 'Dubai', destinationCode: 'DXB', scheduledTime: '21:00', gate: 'F2', status: 'SCHEDULED', aircraft: 'A380-800', isInternational: true },
  ];
  
  return flights;
};

// Restaurants and Dining
export const restaurants: Service[] = [
  // Concourse A
  { id: 'a-shake-shack', name: 'Shake Shack', type: 'RESTAURANT', concourse: 'A', gate: 'A28', coordinates: { x: 70, y: 35 }, hours: '6:00 AM - 10:30 PM', rating: 4.5, reviewCount: 2847, description: 'Modern roadside burger stand serving premium burgers, hot dogs, frozen custard, shakes, and more.', cuisine: 'American', priceRange: '$$', features: ['Burgers', 'Shakes', 'Vegetarian Options'] },
  { id: 'a-chick-fil-a', name: 'Chick-fil-A', type: 'RESTAURANT', concourse: 'A', gate: 'A11', coordinates: { x: 50, y: 35 }, hours: '5:30 AM - 10:00 PM', rating: 4.7, reviewCount: 5234, description: 'Quick-service restaurant specializing in chicken sandwiches, nuggets, and waffle fries.', cuisine: 'Fast Food', priceRange: '$', features: ['Chicken', 'Breakfast', 'Closed Sundays'] },
  { id: 'a-pf-changs', name: 'P.F. Chang\'s', type: 'RESTAURANT', concourse: 'A', gate: 'A18', coordinates: { x: 80, y: 35 }, hours: '6:30 AM - 10:00 PM', rating: 4.2, reviewCount: 1892, description: 'Asian-inspired cuisine with farm-to-wok cooking philosophy.', cuisine: 'Asian', priceRange: '$$$', features: ['Chinese', 'Gluten-Free Options', 'Full Bar'] },
  { id: 'a-varasanos', name: 'Varasano\'s Pizzeria', type: 'RESTAURANT', concourse: 'A', gate: 'A33', coordinates: { x: 95, y: 35 }, hours: '7:00 AM - 10:00 PM', rating: 4.3, reviewCount: 1456, description: 'Authentic Neapolitan-style pizza with live piano ambiance.', cuisine: 'Italian', priceRange: '$$', features: ['Pizza', 'Live Music', 'Full Bar'] },
  { id: 'a-starbucks', name: 'Starbucks', type: 'CAFE', concourse: 'A', gate: 'A2', coordinates: { x: 30, y: 35 }, hours: '4:30 AM - 10:00 PM', rating: 4.1, reviewCount: 3210, description: 'World-famous coffeehouse chain offering espresso drinks, coffee, tea, and light bites.', cuisine: 'Coffee', priceRange: '$$', features: ['Coffee', 'WiFi', 'Mobile Order'] },
  { id: 'a-goldbergs', name: 'Goldberg\'s Bagels', type: 'CAFE', concourse: 'A', gate: 'A16', coordinates: { x: 60, y: 35 }, hours: '4:00 AM - 10:00 PM', rating: 4.4, reviewCount: 987, description: 'New York-style bagels, sandwiches, and coffee.', cuisine: 'Breakfast', priceRange: '$', features: ['Bagels', 'Breakfast', 'Kosher'] },
  
  // Concourse B
  { id: 'b-paschals', name: 'Paschal\'s', type: 'RESTAURANT', concourse: 'B', gate: 'B24', coordinates: { x: 85, y: 65 }, hours: '6:00 AM - 11:00 PM', rating: 4.4, reviewCount: 2134, description: 'Historic Southern restaurant famous for fried chicken and soul food since 1947.', cuisine: 'Southern', priceRange: '$$', features: ['Fried Chicken', 'Soul Food', 'Full Bar'] },
  { id: 'b-fresh-to-order', name: 'Fresh To Order', type: 'RESTAURANT', concourse: 'B', gate: 'B18', coordinates: { x: 55, y: 65 }, hours: '6:00 AM - 10:00 PM', rating: 4.2, reviewCount: 876, description: 'Fast-casual restaurant with chef-inspired menu.', cuisine: 'American', priceRange: '$$', features: ['Healthy Options', 'Salads', 'Sandwiches'] },
  { id: 'b-starbucks', name: 'Starbucks', type: 'CAFE', concourse: 'B', gate: 'B15', coordinates: { x: 45, y: 65 }, hours: '24 hours', rating: 4.0, reviewCount: 2890, description: 'World-famous coffeehouse chain - 24 hour location.', cuisine: 'Coffee', priceRange: '$$', features: ['Coffee', 'WiFi', '24 Hours'] },
  { id: 'b-sweetwater', name: 'SweetWater Bar & Grill', type: 'BAR', concourse: 'B', gate: 'B31', coordinates: { x: 95, y: 65 }, hours: '6:00 AM - 10:00 PM', rating: 4.3, reviewCount: 1234, description: 'Local Atlanta brewery featuring craft beers and American fare.', cuisine: 'American', priceRange: '$$', features: ['Craft Beer', 'Burgers', 'Local Favorite'] },
  { id: 'b-bobbys-burger', name: 'Bobby\'s Burger Palace', type: 'RESTAURANT', concourse: 'B', gate: 'B26', coordinates: { x: 75, y: 65 }, hours: '6:00 AM - 10:00 PM', rating: 4.1, reviewCount: 756, description: 'Celebrity chef Bobby Flay\'s burger joint.', cuisine: 'American', priceRange: '$$', features: ['Burgers', 'Milkshakes', 'Crunchified'] },
  
  // Concourse C
  { id: 'c-five-guys', name: 'Five Guys', type: 'RESTAURANT', concourse: 'C', gate: 'C41', coordinates: { x: 95, y: 25 }, hours: '6:00 AM - 10:00 PM', rating: 4.5, reviewCount: 3421, description: 'Famous for burgers, fries, and unlimited toppings.', cuisine: 'Fast Food', priceRange: '$$', features: ['Burgers', 'Peanuts', 'Customizable'] },
  { id: 'c-chick-fil-a', name: 'Chick-fil-A', type: 'RESTAURANT', concourse: 'C', gate: 'C21', coordinates: { x: 55, y: 25 }, hours: '5:30 AM - 10:00 PM', rating: 4.8, reviewCount: 6234, description: 'Quick-service chicken restaurant.', cuisine: 'Fast Food', priceRange: '$', features: ['Chicken', 'Waffle Fries', 'Breakfast'] },
  { id: 'c-carrabbas', name: 'Carrabba\'s Italian Grill', type: 'RESTAURANT', concourse: 'C', gate: 'C30', coordinates: { x: 70, y: 25 }, hours: '9:00 AM - 10:30 PM', rating: 4.2, reviewCount: 1567, description: 'Italian-American cuisine with wood-fired grill specialties.', cuisine: 'Italian', priceRange: '$$$', features: ['Pasta', 'Steak', 'Full Bar'] },
  { id: 'c-longhorn', name: 'LongHorn Steakhouse', type: 'RESTAURANT', concourse: 'C', gate: 'C13', coordinates: { x: 40, y: 25 }, hours: '5:30 AM - 10:00 PM', rating: 4.3, reviewCount: 2134, description: 'Western-themed steakhouse with fresh, never frozen steaks.', cuisine: 'Steakhouse', priceRange: '$$$', features: ['Steak', 'Grill', 'Full Bar'] },
  { id: 'c-starbucks', name: 'Starbucks', type: 'CAFE', concourse: 'C', gate: 'C37', coordinates: { x: 85, y: 25 }, hours: '24 hours', rating: 4.0, reviewCount: 2567, description: '24-hour coffee location.', cuisine: 'Coffee', priceRange: '$$', features: ['Coffee', '24 Hours', 'WiFi'] },
  { id: 'c-la-madeleine', name: 'La Madeleine', type: 'CAFE', concourse: 'C', gate: 'C7', coordinates: { x: 25, y: 25 }, hours: '24 hours', rating: 4.2, reviewCount: 1456, description: 'French bakery and cafe with pastries, soups, and sandwiches.', cuisine: 'French', priceRange: '$$', features: ['Pastries', '24 Hours', 'Coffee'] },
  { id: 'c-bantam-biddy', name: 'Bantam & Biddy', type: 'RESTAURANT', concourse: 'C', gate: 'C38', coordinates: { x: 78, y: 25 }, hours: '8:00 AM - 10:00 PM', rating: 4.4, reviewCount: 987, description: 'Chef Shaun Doty\'s Southern chicken restaurant.', cuisine: 'Southern', priceRange: '$$', features: ['Chicken', 'Southern', 'Brunch'] },
  
  // Concourse D
  { id: 'd-chipotle', name: 'Chipotle Mexican Grill', type: 'RESTAURANT', concourse: 'D', gate: 'D27', coordinates: { x: 85, y: 75 }, hours: '9:00 AM - 10:00 PM', rating: 4.3, reviewCount: 4532, description: 'Fast-casual Mexican with burritos, bowls, and tacos.', cuisine: 'Mexican', priceRange: '$', features: ['Burritos', 'Bowls', 'Fresh'] },
  { id: 'd-buffalo-wild-wings', name: 'Buffalo Wild Wings', type: 'RESTAURANT', concourse: 'D', gate: 'D20', coordinates: { x: 60, y: 75 }, hours: '9:00 AM - 10:00 PM', rating: 4.0, reviewCount: 2134, description: 'Sports bar with wings, beer, and multiple screens.', cuisine: 'American', priceRange: '$$', features: ['Wings', 'Sports', 'Beer'] },
  { id: 'd-chicken-beer', name: 'Chicken + Beer', type: 'RESTAURANT', concourse: 'D', gate: 'D5', coordinates: { x: 25, y: 75 }, hours: '7:00 AM - 10:00 PM', rating: 4.5, reviewCount: 1567, description: 'Ludacris-owned restaurant featuring Southern comfort food.', cuisine: 'Southern', priceRange: '$$', features: ['Southern', 'Celebrity Chef', 'Local'] },
  { id: 'd-grindhouse', name: 'Grindhouse Burgers', type: 'RESTAURANT', concourse: 'D', gate: 'D31', coordinates: { x: 95, y: 75 }, hours: '5:00 AM - 10:00 PM', rating: 4.4, reviewCount: 1234, description: 'Gourmet burgers with creative toppings and milkshakes.', cuisine: 'American', priceRange: '$$', features: ['Burgers', 'Milkshakes', 'Creative'] },
  { id: 'd-wolfgang', name: 'Wolfgang Puck Express', type: 'RESTAURANT', concourse: 'D', gate: 'D8', coordinates: { x: 30, y: 75 }, hours: '8:00 AM - 10:00 PM', rating: 4.2, reviewCount: 876, description: 'Celebrity chef\'s casual dining with pizzas, sandwiches, and salads.', cuisine: 'American', priceRange: '$$', features: ['Pizza', 'Celebrity Chef', 'Quick'] },
  
  // Concourse E
  { id: 'e-one-flew-south', name: 'One Flew South', type: 'RESTAURANT', concourse: 'E', gate: 'E15', coordinates: { x: 60, y: 15 }, hours: 'Mon-Fri 7AM-10PM, Sat 11AM-9PM, Sun 11AM-10PM', rating: 4.6, reviewCount: 2134, description: 'Upscale Southern cuisine and sushi bar.', cuisine: 'Southern', priceRange: '$$$$', features: ['Fine Dining', 'Sushi', 'Craft Cocktails'] },
  { id: 'e-mcdonalds', name: 'McDonald\'s', type: 'RESTAURANT', concourse: 'E', gate: 'E12', coordinates: { x: 45, y: 15 }, hours: '24 hours', rating: 3.8, reviewCount: 3456, description: 'World\'s largest fast-food chain.', cuisine: 'Fast Food', priceRange: '$', features: ['Burgers', '24 Hours', 'Breakfast'] },
  { id: 'e-panda', name: 'Panda Express', type: 'RESTAURANT', concourse: 'E', gate: 'E8', coordinates: { x: 35, y: 15 }, hours: '8:00 AM - 10:00 PM', rating: 4.0, reviewCount: 1876, description: 'Fast-casual Chinese food.', cuisine: 'Chinese', priceRange: '$', features: ['Chinese', 'Quick', 'Value'] },
  { id: 'e-caribou', name: 'Caribou Coffee', type: 'CAFE', concourse: 'E', gate: 'E22', coordinates: { x: 75, y: 15 }, hours: '6:00 AM - 11:30 PM', rating: 4.2, reviewCount: 987, description: 'Premium coffeehouse with espresso drinks and baked goods.', cuisine: 'Coffee', priceRange: '$$', features: ['Coffee', 'Espresso', 'Bakery'] },
  
  // Concourse F (International)
  { id: 'f-ecco', name: 'Ecco', type: 'RESTAURANT', concourse: 'F', gate: 'F10', coordinates: { x: 70, y: 85 }, hours: '11:00 AM - 10:30 PM', rating: 4.5, reviewCount: 1234, description: 'Upscale European restaurant with house-made pastas and wood-fired dishes.', cuisine: 'European', priceRange: '$$$$', features: ['Fine Dining', 'Pasta', 'Full Bar'] },
  { id: 'f-jekyll', name: 'Jekyll Island Seafood', type: 'RESTAURANT', concourse: 'F', gate: 'F9', coordinates: { x: 60, y: 85 }, hours: '11:00 AM - 10:00 PM', rating: 4.3, reviewCount: 876, description: 'Fresh seafood with Georgia coastal influences.', cuisine: 'Seafood', priceRange: '$$$', features: ['Seafood', 'Oysters', 'Full Bar'] },
  { id: 'f-pei-wei', name: 'Pei Wei', type: 'RESTAURANT', concourse: 'F', gate: 'F6', coordinates: { x: 45, y: 85 }, hours: '8:00 AM - 11:00 PM', rating: 4.1, reviewCount: 1234, description: 'Fast-casual Asian kitchen with wok-fired dishes.', cuisine: 'Asian', priceRange: '$$', features: ['Asian', 'Wok', 'Gluten-Free'] },
  { id: 'f-burger-king', name: 'Burger King', type: 'RESTAURANT', concourse: 'F', gate: 'F2', coordinates: { x: 30, y: 85 }, hours: '24 hours', rating: 3.7, reviewCount: 2134, description: 'Global fast-food burger chain.', cuisine: 'Fast Food', priceRange: '$', features: ['Burgers', '24 Hours', 'Value'] },
  { id: 'f-starbucks', name: 'Starbucks', type: 'CAFE', concourse: 'F', gate: 'F4', coordinates: { x: 50, y: 85 }, hours: '4:45 AM - 10:00 PM', rating: 4.0, reviewCount: 1567, description: 'Coffeehouse in international terminal.', cuisine: 'Coffee', priceRange: '$$', features: ['Coffee', 'WiFi', 'Mobile Order'] },
  
  // Domestic Terminal
  { id: 'dom-starbucks', name: 'Starbucks', type: 'CAFE', concourse: 'DOMESTIC', gate: 'NE Atrium', coordinates: { x: 50, y: 50 }, hours: '24 hours', rating: 4.0, reviewCount: 4567, description: '24-hour coffee in domestic terminal.', cuisine: 'Coffee', priceRange: '$$', features: ['Coffee', '24 Hours', 'WiFi'] },
  { id: 'dom-ihop', name: 'IHOP Express', type: 'RESTAURANT', concourse: 'DOMESTIC', gate: 'SW Atrium', coordinates: { x: 40, y: 50 }, hours: '5:00 AM - 11:00 PM', rating: 4.0, reviewCount: 1876, description: 'Famous pancakes and breakfast all day.', cuisine: 'Breakfast', priceRange: '$$', features: ['Breakfast', 'Pancakes', 'Family'] },
  { id: 'dom-tgi-fridays', name: 'TGI Fridays', type: 'RESTAURANT', concourse: 'DOMESTIC', gate: 'North Baggage', coordinates: { x: 60, y: 50 }, hours: '7:30 AM - 11:00 PM', rating: 4.1, reviewCount: 2134, description: 'Casual American restaurant and bar.', cuisine: 'American', priceRange: '$$', features: ['American', 'Bar', 'Appetizers'] },
  { id: 'dom-burger-king', name: 'Burger King', type: 'RESTAURANT', concourse: 'DOMESTIC', gate: 'SE Atrium', coordinates: { x: 45, y: 55 }, hours: '5:00 AM - 2:30 AM', rating: 3.8, reviewCount: 1567, description: 'Fast-food burgers and fries.', cuisine: 'Fast Food', priceRange: '$', features: ['Burgers', 'Late Night', 'Value'] },
  { id: 'dom-popeyes', name: 'Popeyes', type: 'RESTAURANT', concourse: 'DOMESTIC', gate: 'SE Atrium', coordinates: { x: 55, y: 45 }, hours: '6:00 AM - 10:00 PM', rating: 4.2, reviewCount: 2345, description: 'Louisiana-style fried chicken.', cuisine: 'Fast Food', priceRange: '$', features: ['Chicken', 'Spicy', 'Biscuits'] },
];

// Shopping and Retail
export const shops: Service[] = [
  // Concourse A
  { id: 'a-brookstone', name: 'Brookstone', type: 'SHOP', concourse: 'A', gate: 'A20', coordinates: { x: 75, y: 38 }, hours: '24 hours', rating: 4.1, reviewCount: 567, description: 'Innovative travel products, electronics, and massage chairs.', features: ['Electronics', 'Travel', 'Gadgets'] },
  { id: 'a-mac', name: 'MAC Cosmetics', type: 'SHOP', concourse: 'A', gate: 'A15', coordinates: { x: 55, y: 38 }, hours: '6:30 AM - 9:30 PM', rating: 4.4, reviewCount: 432, description: 'Professional makeup and cosmetics.', features: ['Cosmetics', 'Beauty', 'Makeup'] },
  { id: 'a-tumi', name: 'TUMI', type: 'SHOP', concourse: 'A', gate: 'A25', coordinates: { x: 85, y: 38 }, hours: '6:30 AM - 9:30 PM', rating: 4.5, reviewCount: 345, description: 'Premium luggage, bags, and travel accessories.', features: ['Luggage', 'Business', 'Premium'] },
  { id: 'a-inmotion', name: 'InMotion Entertainment', type: 'SHOP', concourse: 'A', gate: 'A11', coordinates: { x: 45, y: 38 }, hours: '6:00 AM - 10:00 PM', rating: 4.0, reviewCount: 234, description: 'Electronics, headphones, and entertainment for travel.', features: ['Electronics', 'Headphones', 'Travel'] },
  
  // Concourse B
  { id: 'b-beauty-lounge', name: 'The Beauty Lounge', type: 'SHOP', concourse: 'B', gate: 'B15', coordinates: { x: 50, y: 68 }, hours: '6:30 AM - 10:00 PM', rating: 4.3, reviewCount: 298, description: 'Lancome and Kiehl\'s beauty products.', features: ['Beauty', 'Skincare', 'Luxury'] },
  { id: 'b-sunglass', name: 'Sunglass Icon', type: 'SHOP', concourse: 'B', gate: 'B22', coordinates: { x: 70, y: 68 }, hours: '6:30 AM - 9:30 PM', rating: 4.1, reviewCount: 187, description: 'Designer sunglasses and eyewear.', features: ['Sunglasses', 'Designer', 'Eyewear'] },
  
  // Concourse C
  { id: 'c-krispy-kreme', name: 'Krispy Kreme', type: 'SHOP', concourse: 'C', gate: 'C30', coordinates: { x: 70, y: 28 }, hours: '5:00 AM - 9:00 PM', rating: 4.6, reviewCount: 2345, description: 'Fresh, hot doughnuts and coffee.', features: ['Doughnuts', 'Coffee', 'Souvenirs'] },
  { id: 'c-savannah', name: 'Savannah\'s Candy Kitchen', type: 'SHOP', concourse: 'C', gate: 'C38', coordinates: { x: 85, y: 28 }, hours: '7:00 AM - 10:00 PM', rating: 4.5, reviewCount: 876, description: 'Southern candies, pralines, and treats.', features: ['Candy', 'Pralines', 'Gifts'] },
  
  // Concourse D
  { id: 'd-atl-shops', name: 'ATL Shops by Hudson', type: 'SHOP', concourse: 'D', gate: 'D20', coordinates: { x: 65, y: 78 }, hours: '5:00 AM - 10:00 PM', rating: 4.0, reviewCount: 543, description: 'News, gifts, snacks, and travel essentials.', features: ['News', 'Gifts', 'Snacks'] },
  
  // Concourse E
  { id: 'e-coach', name: 'Coach', type: 'SHOP', concourse: 'E', gate: 'E12', coordinates: { x: 50, y: 18 }, hours: '6:30 AM - 10:00 PM', rating: 4.3, reviewCount: 432, description: 'Luxury handbags, accessories, and leather goods.', features: ['Handbags', 'Luxury', 'Leather'] },
  { id: 'e-michael-kors', name: 'Michael Kors', type: 'SHOP', concourse: 'E', gate: 'E8', coordinates: { x: 40, y: 18 }, hours: '6:30 AM - 10:00 PM', rating: 4.2, reviewCount: 387, description: 'Designer handbags, watches, and accessories.', features: ['Designer', 'Handbags', 'Watches'] },
  
  // Concourse F (Duty Free)
  { id: 'f-duty-free', name: 'Duty Free Americas', type: 'DUTY_FREE', concourse: 'F', gate: 'F10', coordinates: { x: 60, y: 88 }, hours: '4:30 AM - 11:00 PM', rating: 4.3, reviewCount: 1234, description: 'Tax-free liquor, tobacco, cosmetics, and luxury goods.', features: ['Duty Free', 'Liquor', 'Luxury', 'Cosmetics'] },
  { id: 'f-sephora', name: 'Sephora', type: 'SHOP', concourse: 'F', gate: 'F6', coordinates: { x: 45, y: 88 }, hours: '6:00 AM - 10:00 PM', rating: 4.5, reviewCount: 876, description: 'Beauty retailer with cosmetics, skincare, and fragrances.', features: ['Beauty', 'Cosmetics', 'Fragrances'] },
  { id: 'f-coach', name: 'Coach', type: 'SHOP', concourse: 'F', gate: 'F14', coordinates: { x: 75, y: 88 }, hours: '6:30 AM - 10:00 PM', rating: 4.3, reviewCount: 456, description: 'Luxury handbags and accessories.', features: ['Handbags', 'Luxury', 'Gifts'] },
];

// Lounges
export const lounges: Lounge[] = [
  // Delta Sky Clubs
  { id: 'sky-club-a17', name: 'Delta Sky Club', concourse: 'A', gate: 'A17', coordinates: { x: 58, y: 32 }, operator: 'Delta Air Lines', hours: '5:00 AM - 10:00 PM', amenities: ['Food & Beverages', 'Bar', 'WiFi', 'Workstations', 'Showers', 'Conference Rooms'], accessMethods: ['Delta Sky Club Membership', 'Amex Platinum', 'Delta Reserve Card', 'Day Pass $50'], capacity: 'HIGH' },
  { id: 'sky-club-a-upper', name: 'Delta Sky Club', concourse: 'A', gate: 'A3', coordinates: { x: 35, y: 32 }, operator: 'Delta Air Lines', hours: '5:30 AM - 10:00 PM', amenities: ['Food & Beverages', 'Bar', 'WiFi', 'Private Workstations', 'Conference Rooms'], accessMethods: ['Delta Sky Club Membership', 'Amex Platinum', 'Delta Reserve Card'], capacity: 'MEDIUM' },
  { id: 'sky-club-t6', name: 'Delta Sky Club', concourse: 'T', gate: 'T6', coordinates: { x: 25, y: 47 }, operator: 'Delta Air Lines', hours: '4:30 AM - 9:00 PM', amenities: ['Food & Beverages', 'Bar', 'WiFi', 'Conference Rooms'], accessMethods: ['Delta Sky Club Membership', 'Amex Platinum', 'Delta Reserve Card'], capacity: 'MEDIUM' },
  { id: 'sky-club-b18', name: 'Delta Sky Club', concourse: 'B', gate: 'B18', coordinates: { x: 60, y: 62 }, operator: 'Delta Air Lines', hours: '5:00 AM - 10:00 PM', amenities: ['Food & Beverages', 'Bar', 'WiFi', 'Grab & Go'], accessMethods: ['Delta Sky Club Membership', 'Amex Platinum', 'Delta Reserve Card'], capacity: 'HIGH' },
  { id: 'sky-club-c37', name: 'Delta Sky Club', concourse: 'C', gate: 'C37', coordinates: { x: 88, y: 22 }, operator: 'Delta Air Lines', hours: '5:00 AM - 10:00 PM', amenities: ['Food & Beverages', 'Bar', 'WiFi', 'Quiet Spaces'], accessMethods: ['Delta Sky Club Membership', 'Amex Platinum', 'Delta Reserve Card'], capacity: 'MEDIUM' },
  { id: 'sky-club-d18', name: 'Delta Sky Club - Centerpoint', concourse: 'D', gate: 'D18', coordinates: { x: 55, y: 72 }, operator: 'Delta Air Lines', hours: '6:00 AM - 10:00 PM', amenities: ['Food & Beverages', 'Bar', 'WiFi', 'Phone Booths', '500+ Seats', 'Southern Cuisine'], accessMethods: ['Delta Sky Club Membership', 'Amex Platinum', 'Delta Reserve Card'], capacity: 'LOW' },
  { id: 'sky-club-d27', name: 'Delta Sky Club', concourse: 'D', gate: 'D27', coordinates: { x: 80, y: 72 }, operator: 'Delta Air Lines', hours: '5:00 AM - 10:00 PM', amenities: ['Food & Beverages', 'Large Bar', 'WiFi', 'Private Seating'], accessMethods: ['Delta Sky Club Membership', 'Amex Platinum', 'Delta Reserve Card'], capacity: 'HIGH' },
  { id: 'sky-club-e15', name: 'Delta Sky Club', concourse: 'E', gate: 'E15', coordinates: { x: 65, y: 12 }, operator: 'Delta Air Lines', hours: '6:00 AM - 10:00 PM', amenities: ['Food & Beverages', 'Bar', 'WiFi', 'Showers', 'Excellent Dining'], accessMethods: ['Delta Sky Club Membership', 'Amex Platinum', 'Delta Reserve Card'], capacity: 'MEDIUM' },
  { id: 'sky-club-f', name: 'Delta Sky Club', concourse: 'F', gate: 'F6', coordinates: { x: 50, y: 82 }, operator: 'Delta Air Lines', hours: '6:00 AM - 12:00 AM', amenities: ['Food & Beverages', 'Bar', 'WiFi', 'Outdoor Observation Deck', 'Showers', 'Best Food'], accessMethods: ['Delta Sky Club Membership', 'Amex Platinum', 'Delta Reserve Card'], capacity: 'HIGH' },
  
  // Other Lounges
  { id: 'centurion-e11', name: 'The Centurion Lounge', concourse: 'E', gate: 'E11', coordinates: { x: 55, y: 12 }, operator: 'American Express', hours: '6:00 AM - 10:00 PM', amenities: ['Premium Food', 'The Reserve Bar', 'Showers', '3 Outdoor Terraces', 'Work Booths', 'Olive Tree'], accessMethods: ['Amex Platinum', 'Amex Business Platinum', 'Amex Centurion', 'Delta Reserve (when flying Delta)'], capacity: 'MEDIUM' },
  { id: 'club-atl-f', name: 'The Club at ATL', concourse: 'F', gate: 'F4', coordinates: { x: 40, y: 82 }, operator: 'Priority Pass', hours: '6:00 AM - 10:00 PM', amenities: ['Light Snacks', 'Bar', 'WiFi', 'Showers', 'Atlanta Skyline Views', 'Workstations'], accessMethods: ['Priority Pass', 'Amex Platinum', 'Day Pass $50'], capacity: 'HIGH' },
  { id: 'admirals-t', name: 'American Airlines Admirals Club', concourse: 'T', gate: 'T10', coordinates: { x: 35, y: 47 }, operator: 'American Airlines', hours: '5:30 AM - 9:30 PM', amenities: ['Snacks', 'Bar', 'WiFi', 'Workstations'], accessMethods: ['Admirals Club Membership', 'AA First/Business Class', 'OneWorld Sapphire/Emerald'], capacity: 'MEDIUM' },
  { id: 'united-t', name: 'United Club', concourse: 'T', gate: 'T12', coordinates: { x: 40, y: 47 }, operator: 'United Airlines', hours: '5:00 AM - 9:30 PM', amenities: ['Snacks', 'Bar', 'WiFi', 'Workstations'], accessMethods: ['United Club Membership', 'United First/Business Class', 'Star Alliance Gold'], capacity: 'MEDIUM' },
  { id: 'minute-suites-f', name: 'Minute Suites', concourse: 'F', gate: 'F8', coordinates: { x: 65, y: 82 }, operator: 'Minute Suites', hours: '24 hours', amenities: ['Private Suites', 'Daybeds', 'Shower', 'Workstation', 'Naps'], accessMethods: ['Hourly Rental', 'Priority Pass (1 hour)'], capacity: 'MEDIUM' },
];

// Security Checkpoints
export const securityCheckpoints: SecurityCheckpoint[] = [
  { id: 'sec-main', name: 'Main Security Checkpoint', concourse: 'DOMESTIC', coordinates: { x: 50, y: 52 }, waitTime: 15, status: 'OPEN', features: ['TSA PreCheck', 'Standard Screening'] },
  { id: 'sec-north', name: 'North Security Checkpoint', concourse: 'DOMESTIC', coordinates: { x: 45, y: 48 }, waitTime: 8, status: 'OPEN', features: ['TSA PreCheck', 'CLEAR', 'Standard Screening'] },
  { id: 'sec-south', name: 'South Security Checkpoint', concourse: 'DOMESTIC', coordinates: { x: 55, y: 52 }, waitTime: 18, status: 'OPEN', features: ['TSA PreCheck', 'Standard Screening'] },
  { id: 'sec-lower-north', name: 'Lower North Security Checkpoint', concourse: 'DOMESTIC', coordinates: { x: 42, y: 45 }, waitTime: 12, status: 'OPEN', features: ['TSA PreCheck', 'Standard Screening'] },
  { id: 'sec-international', name: 'International Security Checkpoint', concourse: 'F', coordinates: { x: 55, y: 80 }, waitTime: 10, status: 'OPEN', features: ['TSA PreCheck', 'CLEAR', 'Standard Screening'] },
];

// Infrastructure
export const infrastructure: Infrastructure[] = [
  // Restrooms
  { id: 'rest-a-center', name: 'Restrooms', type: 'RESTROOM', concourse: 'A', coordinates: { x: 65, y: 35 }, accessibility: true },
  { id: 'rest-b-center', name: 'Restrooms', type: 'RESTROOM', concourse: 'B', coordinates: { x: 65, y: 65 }, accessibility: true },
  { id: 'rest-c-center', name: 'Restrooms', type: 'RESTROOM', concourse: 'C', coordinates: { x: 55, y: 25 }, accessibility: true },
  { id: 'rest-d-center', name: 'Restrooms', type: 'RESTROOM', concourse: 'D', coordinates: { x: 55, y: 75 }, accessibility: true },
  { id: 'rest-e-center', name: 'Restrooms', type: 'RESTROOM', concourse: 'E', coordinates: { x: 50, y: 15 }, accessibility: true },
  { id: 'rest-f-center', name: 'Restrooms', type: 'RESTROOM', concourse: 'F', coordinates: { x: 55, y: 85 }, accessibility: true },
  
  // Charging Stations
  { id: 'charge-a', name: 'Charging Station', type: 'CHARGING', concourse: 'A', coordinates: { x: 60, y: 35 } },
  { id: 'charge-b', name: 'Charging Station', type: 'CHARGING', concourse: 'B', coordinates: { x: 60, y: 65 } },
  { id: 'charge-c', name: 'Charging Station', type: 'CHARGING', concourse: 'C', coordinates: { x: 50, y: 25 } },
  { id: 'charge-d', name: 'Charging Station', type: 'CHARGING', concourse: 'D', coordinates: { x: 50, y: 75 } },
  { id: 'charge-e', name: 'Charging Station', type: 'CHARGING', concourse: 'E', coordinates: { x: 45, y: 15 } },
  { id: 'charge-f', name: 'Charging Station', type: 'CHARGING', concourse: 'F', coordinates: { x: 50, y: 85 } },
  
  // ATMs
  { id: 'atm-a', name: 'ATM', type: 'ATM', concourse: 'A', coordinates: { x: 45, y: 35 } },
  { id: 'atm-b', name: 'ATM', type: 'ATM', concourse: 'B', coordinates: { x: 45, y: 65 } },
  { id: 'atm-c', name: 'ATM', type: 'ATM', concourse: 'C', coordinates: { x: 35, y: 25 } },
  { id: 'atm-d', name: 'ATM', type: 'ATM', concourse: 'D', coordinates: { x: 35, y: 75 } },
  { id: 'atm-e', name: 'ATM', type: 'ATM', concourse: 'E', coordinates: { x: 30, y: 15 } },
  { id: 'atm-f', name: 'ATM', type: 'ATM', concourse: 'F', coordinates: { x: 35, y: 85 } },
  
  // Information Desks
  { id: 'info-domestic', name: 'Information Desk', type: 'INFO', concourse: 'DOMESTIC', coordinates: { x: 50, y: 50 }, hours: '24 hours' },
  { id: 'info-a', name: 'Information Desk', type: 'INFO', concourse: 'A', coordinates: { x: 50, y: 35 }, hours: '5:00 AM - 11:00 PM' },
  { id: 'info-f', name: 'Information Desk', type: 'INFO', concourse: 'F', coordinates: { x: 55, y: 85 }, hours: '5:00 AM - 11:00 PM' },
  
  // Baggage Claim
  { id: 'bag-domestic-north', name: 'North Baggage Claim', type: 'BAGGAGE', concourse: 'DOMESTIC', coordinates: { x: 45, y: 55 } },
  { id: 'bag-domestic-south', name: 'South Baggage Claim', type: 'BAGGAGE', concourse: 'DOMESTIC', coordinates: { x: 55, y: 45 } },
  { id: 'bag-f', name: 'International Baggage Claim', type: 'BAGGAGE', concourse: 'F', coordinates: { x: 60, y: 90 } },
];

// Generate analytics data
export const generateAnalytics = (): Analytics => {
  const now = new Date();
  const hourlyTraffic = [];
  for (let i = 0; i < 24; i++) {
    hourlyTraffic.push({
      hour: i,
      count: Math.floor(Math.random() * 8000) + 2000 + (i >= 6 && i <= 20 ? 5000 : 0)
    });
  }
  
  return {
    timestamp: now.toISOString(),
    passengerVolume: 104258,
    passengerVolumeChange: 12,
    averageWaitTime: 18,
    waitTimeChange: -3,
    onTimeRate: 87.3,
    onTimeRateChange: 2.1,
    securityQueueTime: 12,
    securityNorthTime: 8,
    securitySouthTime: 16,
    hourlyTraffic,
    concourseTraffic: [
      { concourse: 'T', count: 15234 },
      { concourse: 'A', count: 18765 },
      { concourse: 'B', count: 16543 },
      { concourse: 'C', count: 19876 },
      { concourse: 'D', count: 14567 },
      { concourse: 'E', count: 12345 },
      { concourse: 'F', count: 10928 },
    ]
  };
};

// Combine all services
export const allServices: Service[] = [...restaurants, ...shops];

// Get services by concourse
export const getServicesByConcourse = (concourse: Concourse): Service[] => {
  return allServices.filter(s => s.concourse === concourse);
};

// Get lounges by concourse
export const getLoungesByConcourse = (concourse: Concourse): Lounge[] => {
  return lounges.filter(l => l.concourse === concourse);
};

// Get gates by concourse
export const getGatesByConcourse = (concourse: Concourse): Gate[] => {
  return generateGates().filter(g => g.concourse === concourse);
};

// Get flight status color
export const getFlightStatusColor = (status: FlightStatus): string => {
  switch (status) {
    case 'ON_TIME': return '#00C853';
    case 'DELAYED': return '#FFD600';
    case 'CANCELLED': return '#FF1744';
    case 'BOARDING': return '#00D4FF';
    case 'DEPARTED': return '#2979FF';
    case 'ARRIVED': return '#00C853';
    case 'LANDED': return '#00C853';
    default: return '#8B9CAD';
  }
};

// Get flight status label
export const getFlightStatusLabel = (status: FlightStatus): string => {
  switch (status) {
    case 'ON_TIME': return 'On Time';
    case 'DELAYED': return 'Delayed';
    case 'CANCELLED': return 'Cancelled';
    case 'BOARDING': return 'Boarding';
    case 'DEPARTED': return 'Departed';
    case 'ARRIVED': return 'Arrived';
    case 'LANDED': return 'Landed';
    case 'SCHEDULED': return 'Scheduled';
    default: return 'Unknown';
  }
};
