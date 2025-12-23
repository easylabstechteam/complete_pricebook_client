import { useState } from 'react';
import { Menu, DollarSign, BarChart3, Upload, X } from 'lucide-react'; 
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  // State for desktop collapse (width toggle)
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(false); 
  
  // State for mobile drawer visibility
  const [isMobileOpen, setIsMobileOpen] = useState(false); 

  // Get current path to highlight active links
  const location = useLocation();

  const navItems = [
    { name: 'Catalogue', href: '/', icon: DollarSign },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Uploads', href: '/upload', icon: Upload },
  ];

  const desktopWidthClass = isDesktopExpanded ? 'md:w-64' : 'md:w-20'; 
  const isLinkTextVisible = isDesktopExpanded || isMobileOpen;
  
  return (
    <>
      {/* 1. MOBILE MENU BUTTON - Brutalist Style */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-3 text-black bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-6 h-6 stroke-[3]" />
        </button>
      </div>

      {/* 2. MOBILE OVERLAY / BACKDROP */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}
      
      {/* 3. SIDEBAR CONTAINER */}
      <div
        className={`
          fixed top-0 left-0 
          w-64 h-screen z-50 
          bg-white text-black 
          flex-shrink-0 
          transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
          border-r-4 border-black
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 
          ${desktopWidthClass} 
        `}
      >
        <div className="flex flex-col h-full">
          
          {/* 3a. Header & Collapse Toggle */}
          <div className={`
            relative flex items-center p-6 mb-8
            ${isDesktopExpanded ? 'justify-between' : 'md:justify-center'}
          `}>
            {isLinkTextVisible && (
              <h1 className="text-2xl font-black uppercase tracking-tighter border-b-4 border-black leading-none">
                Pricebook
              </h1>
            )}

            <button
              onClick={() => {
                if (window.innerWidth < 768) setIsMobileOpen(false);
                else setIsDesktopExpanded(!isDesktopExpanded);
              }}
              className="p-2 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-all"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
            </button>
            
            {/* Version Tag - Visual Detail */}
            {isDesktopExpanded && (
              <span className="absolute -bottom-2 left-6 text-[9px] font-black uppercase tracking-[0.3em] opacity-30">
                v.2025.01
              </span>
            )}
          </div>

          {/* 3b. Navigation Links */}
          <nav className="flex flex-col px-3 space-y-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;

              return (
                <Link 
                  key={item.name} 
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)} 
                  className={`
                    group flex items-center 
                    py-4 px-2
                    text-sm font-black uppercase tracking-widest
                    border-2 transition-all duration-150
                    ${isActive 
                      ? "bg-black text-white border-black" 
                      : "bg-transparent text-black border-transparent hover:border-black hover:bg-black hover:text-white"
                    }
                  `}
                >
                  <item.icon className={`
                    w-5 h-5 stroke-[2.5]
                    ${isLinkTextVisible ? 'mr-4 ml-2' : 'mx-auto'} 
                  `} />
                  
                  {isLinkTextVisible && (
                    <span className="whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3c. Footer - System Status Branding */}
          {isDesktopExpanded && (
            <div className="mt-auto p-6 border-t-2 border-black">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-emerald-500 animate-pulse border border-black" />
                <span className="text-[10px] font-black uppercase tracking-tighter">System Online</span>
              </div>
              <div className="text-[10px] font-bold uppercase opacity-40 leading-tight">
                Market Analytics <br /> Internal Terminal
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Sidebar;