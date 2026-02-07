import { useState } from 'react';
import { Plane, Menu, X, Map, Clock, Coffee, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  scrollY: number;
}

export function Header({ scrollY }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrolled = scrollY > 50;

  const navLinks = [
    { label: 'Live Flights', href: '#flights', icon: Clock },
    { label: 'Terminal Map', href: '#map', icon: Map },
    { label: 'Services', href: '#services', icon: Coffee },
    { label: 'Analytics', href: '#analytics', icon: BarChart3 },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a 
            href="#" 
            className="flex items-center gap-3 group"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="relative">
              <Plane 
                className={`w-8 h-8 transition-all duration-500 ${
                  isScrolled ? 'text-cyan-400' : 'text-white'
                } group-hover:rotate-12`}
              />
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight">
                ATL Navigator
              </span>
              <span className="text-xs text-gray-400 hidden sm:block">
                Hartsfield-Jackson Airport
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors group"
              >
                <span className="flex items-center gap-2">
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-white/10"
              onClick={() => scrollToSection('#map')}
            >
              Explore Map
            </Button>
            <Button 
              className="btn-primary"
              onClick={() => scrollToSection('#flights')}
            >
              View Flights
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 glass border-b border-white/10 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <nav className="section-container py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors py-2"
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </button>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
              onClick={() => scrollToSection('#map')}
            >
              Explore Map
            </Button>
            <Button 
              className="w-full btn-primary"
              onClick={() => scrollToSection('#flights')}
            >
              View Flights
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
