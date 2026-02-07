import { useState, useEffect, useRef } from 'react';
import { 
  Navigation, 
  Clock, 
  Bell, 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  Zap,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features: { id: string; title: string; description: string; icon: typeof Navigation; color: string; image: string }[] = [
  {
    id: 'wayfinding',
    title: 'Real-Time Wayfinding',
    description: 'Get turn-by-turn directions to any gate, restaurant, or service with live walking time estimates. Our intelligent routing system considers your current location and provides the fastest path through the airport.',
    icon: Navigation,
    color: 'from-cyan-500 to-blue-500',
    image: 'wayfinding',
  },
  {
    id: 'connection',
    title: 'Connection Assistant',
    description: 'Tight connection? We\'ll guide you on the fastest route between gates with time to spare. Get alerts when it\'s time to head to your next gate and track your progress in real-time.',
    icon: Clock,
    color: 'from-orange-500 to-red-500',
    image: 'connection',
  },
  {
    id: 'alerts',
    title: 'Flight Alerts',
    description: 'Get instant notifications for gate changes, delays, and boarding announcements. Never miss an important update about your flight with push notifications sent directly to your device.',
    icon: Bell,
    color: 'from-green-500 to-emerald-500',
    image: 'alerts',
  },
  {
    id: 'recommendations',
    title: 'Personalized Recommendations',
    description: 'Discover restaurants and shops near your gate based on your preferences and available time. Get curated suggestions for dining, shopping, and relaxation options.',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    image: 'recommendations',
  },
];

export function Features() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const activeFeature = features[activeIndex];

  return (
    <section ref={sectionRef} className="py-20 bg-[#0D2137] overflow-hidden">
      <div className="section-container">
        <div className="section-inner">
          {/* Header */}
          <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-display font-bold text-4xl sm:text-5xl mb-3">
              Features to Enhance Your Journey
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Smart tools designed to make your airport experience smoother, faster, and more enjoyable.
            </p>
          </div>

          {/* Feature Carousel */}
          <div className={`relative transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Content */}
              <div className="order-2 lg:order-1 space-y-6">
                {/* Feature Indicator */}
                <div className="flex items-center gap-2 mb-4">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        index === activeIndex ? 'w-8 bg-cyan-400' : 'w-4 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>

                {/* Feature Content */}
                <div className="relative min-h-[250px]">
                  {features.map((feature, index) => (
                    <div
                      key={feature.id}
                      className={`absolute inset-0 transition-all duration-500 ${
                        index === activeIndex
                          ? 'opacity-100 translate-x-0'
                          : index < activeIndex
                          ? 'opacity-0 -translate-x-10'
                          : 'opacity-0 translate-x-10'
                      }`}
                    >
                      {/* Icon */}
                      <div className={'inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br mb-4 ' + feature.color}>
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>

                      <h3 className="font-display font-bold text-3xl mb-4">
                        {feature.title}
                      </h3>

                      <p className="text-gray-400 text-lg leading-relaxed mb-6">
                        {feature.description}
                      </p>

                      <Button className="btn-primary">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-4 pt-4">
                  <button
                    onClick={prevSlide}
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-400 ml-2">
                    {activeIndex + 1} / {features.length}
                  </span>
                </div>
              </div>

              {/* Visual */}
              <div className="order-1 lg:order-2 relative">
                <div className="relative aspect-square max-w-md mx-auto">
                  {/* Background Glow */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${activeFeature.color} opacity-20 blur-3xl transition-all duration-500`} />
                  
                  {/* Main Visual */}
                  <div className="relative h-full rounded-3xl overflow-hidden glass-light border border-white/10">
                    {/* Feature-specific visual representation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={'w-32 h-32 rounded-full bg-gradient-to-br opacity-30 blur-xl transition-all duration-500 ' + activeFeature.color} />
                    </div>
                    
                    {/* Icon in center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className={'w-24 h-24 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-2xl transition-all duration-500 ' + activeFeature.color}>
                          <activeFeature.icon className="w-12 h-12 text-white" />
                        </div>
                        
                        {/* Floating elements */}
                        <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-float">
                          <MapPin className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
                          <Zap className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div className="absolute top-1/2 -right-8 w-6 h-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                          <Heart className="w-3 h-3 text-pink-400" />
                        </div>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                          <div className={'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center ' + activeFeature.color}>
                            <activeFeature.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{activeFeature.title}</div>
                            <div className="text-xs text-gray-400">ATL Navigator Feature</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => setActiveIndex(index)}
                className={`p-4 rounded-xl text-left transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-white/10 border border-cyan-500/30'
                    : 'bg-white/5 border border-transparent hover:bg-white/10'
                }`}
              >
                <div className={'inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br mb-3 ' + feature.color}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold mb-1">{feature.title}</h4>
                <p className="text-xs text-gray-400 line-clamp-2">{feature.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
