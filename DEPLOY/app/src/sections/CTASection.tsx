import { useState, useEffect, useRef } from 'react';
import { Plane, Apple, Play, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function CTASection() {
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

  const handleDownload = (platform: string) => {
    toast.info(`${platform} download coming soon!`, {
      description: 'Sign up to be notified when the app launches.',
    });
  };

  return (
    <section ref={sectionRef} className="py-20 bg-[#0A1628] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        
        {/* Animated Planes */}
        <div className="absolute top-20 left-0 opacity-5">
          <Plane className="w-24 h-24 text-cyan-400 animate-plane-fly" />
        </div>
        <div className="absolute bottom-20 left-0 opacity-5" style={{ animationDelay: '7s' }}>
          <Plane className="w-16 h-16 text-cyan-400 animate-plane-fly" style={{ animationDelay: '7s' }} />
        </div>
        <div className="absolute top-1/2 left-0 opacity-5" style={{ animationDelay: '12s' }}>
          <Plane className="w-20 h-20 text-cyan-400 animate-plane-fly" style={{ animationDelay: '12s' }} />
        </div>
      </div>

      <div className="section-container relative z-10">
        <div className="section-inner">
          <div className={`text-center max-w-3xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">Coming Soon</span>
            </div>

            {/* Headline */}
            <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl mb-6">
              Ready to Navigate
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Atlanta Like a Pro?
              </span>
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
              Download the ATL Navigator app and take control of your airport experience. 
              Real-time updates, interactive maps, and personalized recommendations.
            </p>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                className="w-full sm:w-auto px-8 py-6 bg-white text-black hover:bg-gray-100 rounded-xl flex items-center gap-3 transition-all hover:scale-105"
                onClick={() => handleDownload('App Store')}
              >
                <Apple className="w-7 h-7" />
                <div className="text-left">
                  <div className="text-xs text-gray-600">Download on the</div>
                  <div className="font-semibold text-lg">App Store</div>
                </div>
              </Button>

              <Button
                className="w-full sm:w-auto px-8 py-6 bg-white text-black hover:bg-gray-100 rounded-xl flex items-center gap-3 transition-all hover:scale-105"
                onClick={() => handleDownload('Google Play')}
              >
                <Play className="w-7 h-7 fill-black" />
                <div className="text-left">
                  <div className="text-xs text-gray-600">Get it on</div>
                  <div className="font-semibold text-lg">Google Play</div>
                </div>
              </Button>
            </div>

            {/* Web App Link */}
            <div className="mt-8">
              <button 
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 mx-auto transition-colors"
                onClick={() => toast.success('You\'re already using the web app!')}
              >
                Or continue using the web app
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Features Preview */}
            <div className={`grid sm:grid-cols-3 gap-6 mt-16 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {[
                { icon: Plane, title: 'Real-Time Flights', desc: 'Live updates on departures & arrivals' },
                { icon: Sparkles, title: 'Smart Navigation', desc: 'Turn-by-turn directions to any gate' },
                { icon: ArrowRight, title: 'Connection Help', desc: 'Never miss a tight connection' },
              ].map((feature, index) => (
                <div key={index} className="p-4 rounded-xl glass-light">
                  <feature.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
