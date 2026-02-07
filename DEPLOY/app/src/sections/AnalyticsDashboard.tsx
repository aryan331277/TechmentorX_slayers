import { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Plane, 
  Shield,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  MapPin
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { generateAnalytics } from '@/data/atlantaAirport';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: typeof Users;
  color: string;
  delay: number;
  isVisible: boolean;
}

function StatCard({ title, value, change, changeLabel, icon: Icon, color, delay, isVisible }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState('0');
  const isPositive = change >= 0;

  useEffect(() => {
    if (isVisible) {
      const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
      const suffix = value.replace(/[0-9.]/g, '');
      const duration = 1500;
      const steps = 60;
      const stepValue = numericValue / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= numericValue) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current).toLocaleString() + suffix);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  return (
    <div 
      className={`p-6 rounded-2xl glass-light border border-white/5 hover:border-white/10 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: color.replace('bg-', '') }}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="text-3xl font-display font-bold">{displayValue}</div>
        <div className="text-sm text-gray-400">{title}</div>
        <div className="text-xs text-gray-500">{changeLabel}</div>
      </div>
    </div>
  );
}

export function AnalyticsDashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [analytics, setAnalytics] = useState(generateAnalytics());
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

  // Refresh analytics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(generateAnalytics());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const stats: { title: string; value: string; change: number; changeLabel: string; icon: typeof Users; color: string }[] = [
    {
      title: 'Passenger Volume',
      value: analytics.passengerVolume.toLocaleString(),
      change: analytics.passengerVolumeChange,
      changeLabel: 'vs yesterday',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Average Wait Time',
      value: `${analytics.averageWaitTime} min`,
      change: analytics.waitTimeChange * -1,
      changeLabel: 'improvement',
      icon: Clock,
      color: 'bg-green-500',
    },
    {
      title: 'On-Time Performance',
      value: `${analytics.onTimeRate}%`,
      change: analytics.onTimeRateChange,
      changeLabel: 'vs last week',
      icon: Plane,
      color: 'bg-cyan-500',
    },
    {
      title: 'Security Queue',
      value: `${analytics.securityQueueTime} min`,
      change: -2, // Simulated improvement
      changeLabel: 'North: 8min, South: 16min',
      icon: Shield,
      color: 'bg-orange-500',
    },
  ];

  // Hourly traffic data for chart
  const hourlyData = analytics.hourlyTraffic.slice(6, 22); // 6 AM to 10 PM
  const maxTraffic = Math.max(...hourlyData.map(d => d.count));

  // Concourse traffic
  const concourseData = analytics.concourseTraffic;
  const maxConcourse = Math.max(...concourseData.map(d => d.count));

  return (
    <section ref={sectionRef} id="analytics" className="py-20 bg-[#0A1628]">
      <div className="section-container">
        <div className="section-inner">
          {/* Header */}
          <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div>
              <Badge className="mb-3 bg-purple-500/20 text-purple-400 border-purple-500/30">
                <BarChart3 className="w-3 h-3 mr-1" />
                B2B Analytics
              </Badge>
              <h2 className="font-display font-bold text-4xl sm:text-5xl mb-3">
                Airport Intelligence
              </h2>
              <p className="text-gray-400 max-w-xl">
                Real-time operational insights for airport authorities and airline partners.
                Monitor passenger flow, wait times, and performance metrics.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Activity className="w-4 h-4 text-green-400 animate-pulse" />
              Live data stream
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, index) => (
              <StatCard
                key={stat.title}
                {...stat}
                delay={index * 100}
                isVisible={isVisible}
              />
            ))}
          </div>

          {/* Charts Section */}
          <div className={`grid lg:grid-cols-2 gap-6 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Hourly Traffic Chart */}
            <div className="p-6 rounded-2xl glass-light border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg">Hourly Passenger Traffic</h3>
                  <p className="text-sm text-gray-400">Today vs Yesterday</p>
                </div>
                <Badge variant="outline" className="border-white/20">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-400" />
                  +12%
                </Badge>
              </div>

              {/* Bar Chart */}
              <div className="h-64 flex items-end justify-between gap-1">
                {hourlyData.map((data, index) => {
                  const height = (data.count / maxTraffic) * 100;
                  const isCurrentHour = data.hour === new Date().getHours();
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className={`w-full rounded-t transition-all duration-500 ${
                          isCurrentHour 
                            ? 'bg-gradient-to-t from-cyan-500 to-cyan-400' 
                            : 'bg-gradient-to-t from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                      <span className={`text-xs ${isCurrentHour ? 'text-cyan-400 font-medium' : 'text-gray-500'}`}>
                        {data.hour % 12 || 12}{data.hour < 12 ? 'a' : 'p'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10 text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-cyan-500" />
                    <span className="text-gray-400">Current Hour</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gray-600" />
                    <span className="text-gray-400">Other Hours</span>
                  </div>
                </div>
                <span className="text-gray-500">Peak: 5:00 PM</span>
              </div>
            </div>

            {/* Concourse Traffic */}
            <div className="p-6 rounded-2xl glass-light border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg">Traffic by Concourse</h3>
                  <p className="text-sm text-gray-400">Real-time passenger distribution</p>
                </div>
                <Badge variant="outline" className="border-white/20">
                  <MapPin className="w-3 h-3 mr-1 text-cyan-400" />
                  Live
                </Badge>
              </div>

              {/* Horizontal Bar Chart */}
              <div className="space-y-4">
                {concourseData.map((data, index) => {
                  const width = (data.count / maxConcourse) * 100;
                  const colors = [
                    'from-blue-500 to-cyan-500',
                    'from-cyan-500 to-teal-500',
                    'from-teal-500 to-green-500',
                    'from-green-500 to-lime-500',
                    'from-lime-500 to-yellow-500',
                    'from-yellow-500 to-orange-500',
                    'from-orange-500 to-red-500',
                  ];
                  
                  return (
                    <div key={data.concourse} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Concourse {data.concourse}</span>
                        <span className="text-gray-400">{data.count.toLocaleString()}</span>
                      </div>
                      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${colors[index]} transition-all duration-1000`}
                          style={{ width: isVisible ? `${width}%` : '0%' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Busiest Concourse</span>
                  <span className="font-medium text-cyan-400">Concourse C</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-400">Total Passengers</span>
                  <span className="font-medium">{analytics.passengerVolume.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className={`grid sm:grid-cols-3 gap-6 mt-6 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="p-4 rounded-xl glass-light border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="font-medium">TSA PreCheck</div>
                  <div className="text-xs text-gray-400">Average wait time</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-400">5 min</div>
              <div className="text-xs text-gray-500">85% faster than standard</div>
            </div>

            <div className="p-4 rounded-xl glass-light border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Plane className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="font-medium">Active Flights</div>
                  <div className="text-xs text-gray-400">Currently at gates</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-cyan-400">147</div>
              <div className="text-xs text-gray-500">87% on-time departure</div>
            </div>

            <div className="p-4 rounded-xl glass-light border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="font-medium">Peak Hour</div>
                  <div className="text-xs text-gray-400">Expected today</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-400">5:00 PM</div>
              <div className="text-xs text-gray-500">~12,500 passengers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
