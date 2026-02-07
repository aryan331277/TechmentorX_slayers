import { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Plane, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 3D Globe Component
function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
    }
  });

  // Generate random points for the globe
  const points = new Float32Array(2000 * 3);
  for (let i = 0; i < 2000; i++) {
    const phi = Math.acos(-1 + (2 * i) / 2000);
    const theta = Math.sqrt(2000 * Math.PI) * phi;
    points[i * 3] = Math.cos(theta) * Math.sin(phi) * 2;
    points[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * 2;
    points[i * 3 + 2] = Math.cos(phi) * 2;
  }

  return (
    <group>
      {/* Main Sphere */}
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <MeshDistortMaterial
          color="#1E3A5F"
          emissive="#0A1628"
          roughness={0.4}
          metalness={0.8}
          distort={0.1}
          speed={0.5}
        />
      </Sphere>
      
      {/* Dot Matrix */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[points, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#00D4FF"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
      
      {/* Atlanta Marker */}
      <mesh position={[0.8, 0.5, 1.7]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#FF6B35" />
      </mesh>
      
      {/* Glow Ring */}
      <mesh position={[0.8, 0.5, 1.7]} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.1, 0.15, 32]} />
        <meshBasicMaterial color="#FF6B35" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Flight Paths */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 2.2;
        const y = Math.sin(angle * 0.5) * 1;
        const z = Math.sin(angle) * 2.2;
        return (
          <mesh key={i} position={[x * 0.5, y * 0.5, z * 0.5]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#00D4FF" />
          </mesh>
        );
      })}
    </group>
  );
}

// Animated Flight Particles
function FlightParticles() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 2.5 + Math.sin(i * 0.5) * 0.3;
        const x = Math.cos(angle + Date.now() * 0.0001) * radius;
        const y = Math.sin(angle * 0.3) * 0.5;
        const z = Math.sin(angle + Date.now() * 0.0001) * radius;
        return (
          <mesh key={i} position={[x, y, z]}>
            <coneGeometry args={[0.03, 0.1, 8]} />
            <meshBasicMaterial color="#00D4FF" />
          </mesh>
        );
      })}
    </group>
  );
}

export function Hero() {
  const [searchPlaceholder, setSearchPlaceholder] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const placeholders = [
    'Search flights (e.g., DL404)...',
    'Find gates (e.g., A17)...',
    'Discover restaurants...',
    'Locate lounges...',
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setSearchPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-hero-gradient">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 212, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Floating Planes */}
        <div className="absolute top-20 left-0 opacity-10">
          <Plane className="w-16 h-16 text-cyan-400 animate-plane-fly" />
        </div>
        <div className="absolute top-40 left-0 opacity-10" style={{ animationDelay: '5s' }}>
          <Plane className="w-12 h-12 text-cyan-400 animate-plane-fly" style={{ animationDelay: '5s' }} />
        </div>
      </div>

      <div className="section-container relative z-10 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-5rem)]">
          {/* Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light"
              style={{ animationDelay: '0.2s' }}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">World's Busiest Airport</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 
                className={`font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <span className="text-white">Navigate</span>
              </h1>
              <h1 
                className={`font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Atlanta Airport
                </span>
              </h1>
              <h1 
                className={`font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <span className="text-white">Like a Pro</span>
              </h1>
            </div>

            {/* Subheadline */}
            <p 
              className={`text-lg sm:text-xl text-gray-400 max-w-xl transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              Real-time terminal maps, flight tracking, and personalized navigation 
              for Hartsfield-Jackson Atlanta International Airport.
            </p>

            {/* Search Bar */}
            <div 
              className={`relative max-w-xl transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={searchRef}
                  type="text"
                  className="search-input pl-12 pr-32 py-4 text-base"
                  placeholder={placeholders[searchPlaceholder]}
                />
                <Button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-4"
                  onClick={() => scrollToSection('#flights')}
                >
                  Search
                </Button>
              </div>
              {/* Quick Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {['Gates', 'Flights', 'Food', 'Lounges'].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full glass-light text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    onClick={() => {
                      if (searchRef.current) {
                        searchRef.current.value = tag;
                        searchRef.current.focus();
                      }
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div 
              className={`flex flex-wrap gap-4 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <Button 
                className="btn-primary flex items-center gap-2"
                onClick={() => scrollToSection('#map')}
              >
                <MapPin className="w-5 h-5" />
                Explore Interactive Map
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline"
                className="btn-secondary flex items-center gap-2"
                onClick={() => scrollToSection('#flights')}
              >
                <Plane className="w-5 h-5" />
                View Live Flights
              </Button>
            </div>

            {/* Stats */}
            <div 
              className={`flex flex-wrap gap-8 pt-4 transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              {[
                { value: '192', label: 'Gates' },
                { value: '7', label: 'Concourses' },
                { value: '2,700+', label: 'Daily Flights' },
                { value: '107M', label: 'Passengers/Year' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-display font-bold text-2xl sm:text-3xl text-cyan-400">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Globe */}
          <div 
            className={`hidden lg:block h-[500px] xl:h-[600px] transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}
          >
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00D4FF" />
              <Globe />
              <FlightParticles />
              <OrbitControls 
                enableZoom={false} 
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
              />
            </Canvas>
          </div>

          {/* Mobile Globe Placeholder */}
          <div className="lg:hidden flex justify-center">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 animate-pulse" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30" />
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-cyan-400/40 to-blue-400/40 flex items-center justify-center">
                <Plane className="w-16 h-16 text-cyan-400" />
              </div>
              {/* Orbiting dots */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-cyan-400 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 60}deg) translateX(120px) translateY(-50%)`,
                    animation: `pulse-glow 2s ease-in-out ${i * 0.3}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A1628] to-transparent" />
    </section>
  );
}
