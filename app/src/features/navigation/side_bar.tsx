import { useState } from 'react';
import { Menu, DollarSign, BarChart3, Upload, ChevronLeft, ChevronRight } from 'lucide-react'; 
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";

function Sidebar() {
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(false); 
  const [isMobileOpen, setIsMobileOpen] = useState(false); 
  const location = useLocation();

  const navItems = [
    { name: 'Catalogue', href: '/', icon: DollarSign },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Uploads', href: '/upload', icon: Upload },
  ];

  const isLinkTextVisible = isDesktopExpanded || isMobileOpen;
  
  return (
    <>
      {/* 1. MOBILE HEADER - Strict Monochrome */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-40 md:hidden flex items-center px-4 justify-between">
        <h1 className="text-lg font-bold text-black tracking-tighter">PRICEBOOK</h1>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-black hover:bg-gray-100 rounded-md transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* 2. MOBILE OVERLAY */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}
      
      {/* 3. SIDEBAR CONTAINER */}
      <div
        className={cn(
          "fixed top-0 left-0 h-screen z-50 bg-white flex-shrink-0 transition-all duration-300 ease-in-out border-r border-gray-200",
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full',
          "md:relative md:translate-x-0",
          isDesktopExpanded ? 'md:w-64' : 'md:w-20'
        )}
      >
        <div className="flex flex-col h-full">
          
          {/* 3a. Header & Toggle */}
          <div className={cn(
            "h-16 flex items-center px-6 border-b border-gray-50 mb-4",
            isDesktopExpanded ? 'justify-between' : 'justify-center'
          )}>
            {isLinkTextVisible && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-black rounded-sm flex items-center justify-center">
                  <span className="text-white font-bold text-xs">C</span>
                </div>
                <h1 className="text-base font-bold text-black tracking-tight uppercase">
                  PRICEBOOK
                </h1>
              </div>
            )}

            <button
              onClick={() => {
                if (window.innerWidth < 768) setIsMobileOpen(false);
                else setIsDesktopExpanded(!isDesktopExpanded);
              }}
              className="hidden md:flex p-1.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-md transition-all"
            >
              {isDesktopExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* 3b. Navigation Links - Grey to Black transition */}
          <nav className="flex flex-col px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;

              return (
                <Link 
                  key={item.name} 
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)} 
                  className={cn(
                    "group flex items-center py-2.5 px-3 rounded-md text-[13px] transition-all duration-200",
                    isActive 
                      ? "bg-gray-100 text-black font-semibold" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-black font-medium"
                  )}
                >
                  <item.icon className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-black" : "text-gray-400 group-hover:text-black",
                    isLinkTextVisible ? 'mr-3' : 'mx-auto' 
                  )} />
                  
                  {isLinkTextVisible && (
                    <span className="whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3c. Footer - Low Profile Status */}
          {isDesktopExpanded && (
            <div className="mt-auto p-4 m-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                <span className="text-[10px] font-bold text-black uppercase tracking-wider">Secure Node</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium leading-tight">
                Market Terminal <br /> 2025.v1
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Sidebar;