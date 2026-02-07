import { useState, useEffect, useRef } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: "This app saved my connection! I had 20 minutes between flights and the wayfinding feature got me to my gate with 5 minutes to spare. Absolutely essential for ATL.",
    author: 'Sarah Mitchell',
    role: 'Frequent Business Traveler',
    avatar: 'SM',
    rating: 5,
  },
  {
    id: '2',
    quote: "As someone who travels through Atlanta weekly, ATL Navigator has become indispensable. The real-time flight updates and gate notifications are incredibly accurate.",
    author: 'Michael Chen',
    role: 'Management Consultant',
    avatar: 'MC',
    rating: 5,
  },
  {
    id: '3',
    quote: "The lounge information and wait time estimates are spot on. I can now plan my layovers perfectly and make the most of my time at the airport.",
    author: 'Emily Rodriguez',
    role: 'International Traveler',
    avatar: 'ER',
    rating: 5,
  },
  {
    id: '4',
    quote: "Finally, an airport app that actually works! The interactive map made navigating the international terminal so much easier for my first time at ATL.",
    author: 'David Thompson',
    role: 'Leisure Traveler',
    avatar: 'DT',
    rating: 4,
  },
  {
    id: '5',
    quote: "The connection assistant feature is a game-changer. It calculated the exact walking time between my gates and even suggested the fastest route.",
    author: 'Jennifer Park',
    role: 'Sales Executive',
    avatar: 'JP',
    rating: 5,
  },
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
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

  // Auto-rotate
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section ref={sectionRef} className="py-20 bg-[#0D2137] overflow-hidden">
      <div className="section-container">
        <div className="section-inner">
          {/* Header */}
          <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-display font-bold text-4xl sm:text-5xl mb-3">
              What Travelers Say
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join thousands of travelers who navigate Atlanta Airport with confidence.
            </p>
          </div>

          {/* Testimonial Carousel */}
          <div className={`relative max-w-4xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Quote Icon */}
            <div className="absolute -top-6 left-0 w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <Quote className="w-8 h-8 text-cyan-400" />
            </div>

            {/* Main Content */}
            <div className="relative min-h-[300px] flex items-center justify-center">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`absolute inset-0 flex flex-col items-center text-center transition-all duration-500 ${
                    index === activeIndex
                      ? 'opacity-100 translate-x-0'
                      : index < activeIndex
                      ? 'opacity-0 -translate-x-20'
                      : 'opacity-0 translate-x-20'
                  }`}
                >
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed mb-8 max-w-3xl">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-lg font-bold">
                      {testimonial.avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">{testimonial.author}</div>
                      <div className="text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setActiveIndex(index);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex ? 'w-8 bg-cyan-400' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-16 border-t border-white/10 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { value: '50K+', label: 'Active Users' },
              { value: '4.8', label: 'App Store Rating' },
              { value: '2M+', label: 'Navigation Sessions' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display font-bold text-3xl sm:text-4xl text-cyan-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
