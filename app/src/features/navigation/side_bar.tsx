import { useState } from 'react';
import { Menu, DollarSign, BarChart3, Upload, X } from 'lucide-react'; // Import X for close icon
import { Link } from 'react-router-dom';

function Sidebar() {
  // State for the desktop collapse feature. On screens >= md, this controls the width (expanded or collapsed).
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(false); 
  
  // State for the mobile/tablet overlay. This controls the visibility of the sidebar 
  // when the screen size is less than the 'md' breakpoint.
  const [isMobileOpen, setIsMobileOpen] = useState(false); 

  // Configuration array for all navigation items.
  const navItems = [
    { name: 'Catalogue', href: '/search', icon: DollarSign },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Uploads', href: '/upload', icon: Upload },
  ];

  // Helper to dynamically set the Tailwind class for desktop width based on the expanded state.
  const desktopWidthClass = isDesktopExpanded ? 'md:w-64' : 'md:w-20'; 
  
  // --- RENDERING ---
  return (
    <>
      {/* 1. MOBILE MENU BUTTON (Trigger) 
        - Fixed position, hidden on desktop (md:hidden).
        - Used to toggle the 'isMobileOpen' state.
      */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-stone-900 bg-white shadow-lg rounded-lg border border-gray-200"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* 2. MOBILE OVERLAY / BACKDROP (Click-away area) 
        - Only renders if the sidebar is open on a mobile screen.
        - Provides the background dimmer effect (bg-black/50) and closes the sidebar on click.
      */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMobileOpen(false)} 
          aria-hidden="true" // Hides the element from screen readers when open
        />
      )}
      
      {/* 3. SIDEBAR CONTAINER (Main Component) */}
      <div
        className={`
          // Mobile/Tablet Drawer Styling: Full height (h-screen), fixed, slides in from the left.
          fixed top-0 left-0 
          w-64 h-screen z-50 
          bg-stone-900 text-white 
          flex-shrink-0 
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} // Controls slide-in/out motion

          // Desktop/Tablet Styling: Overrides mobile styles from the 'md' breakpoint.
          md:relative md:translate-x-0 // Changes position to relative and prevents sliding effect.
          ${desktopWidthClass} // Sets the controlled desktop width (w-64 or w-20).
          md:border-r md:border-stone-700 
          md:shadow-none 
        `}
      >
        <div className="flex flex-col h-full">
          
          {/* 3a. Header and Collapse Button */}
          <div className={`
            flex justify-between items-center 
            p-4 transition-all duration-300 
            ${isDesktopExpanded ? 'justify-between' : 'md:justify-center'} // Centers button when collapsed
          `}>
            {/* Title/Branding (Hidden when desktop is collapsed, visible otherwise) */}
            {(isDesktopExpanded || isMobileOpen) && (
              <h1 className="text-xl font-extrabold text-white whitespace-nowrap">
                Pricebook
              </h1>
            )}

            {/* Close/Collapse Toggle Button */}
            <button
              onClick={() => {
                // Determine if we are on a mobile/tablet or desktop screen based on screen width.
                if (window.innerWidth < 768) { 
                  setIsMobileOpen(false); // Action: Close the sidebar overlay.
                } else {
                  setIsDesktopExpanded(!isDesktopExpanded); // Action: Toggle the desktop width state.
                }
              }}
              className="p-2 text-white hover:bg-stone-800 rounded-lg transition-colors"
              aria-label={isMobileOpen ? "Close Sidebar" : (isDesktopExpanded ? "Collapse Sidebar" : "Expand Sidebar")}
            >
              {/* Display 'X' (close) on mobile, and 'Menu' (toggle) on desktop. */}
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* 3b. Navigation Links */}
          <nav className="flex flex-col p-2 space-y-1">
            {navItems.map((item) => {
              // Determines if the text label should be visible (expanded on desktop OR open on mobile).
              const isLinkTextVisible = isDesktopExpanded || isMobileOpen; 

              return (
                <Link 
                  key={item.name} 
                  to={item.href}
                  // Clean-up: Always close the mobile sidebar state after clicking a link.
                  onClick={() => setIsMobileOpen(false)} 
                  className="
                    flex items-center 
                    py-3 rounded-lg 
                    text-base font-medium 
                    hover:bg-stone-800 
                    transition-all duration-300
                  "
                >
                  {/* Icon Container (The only element visible when fully collapsed on desktop) */}
                  <item.icon className={`
                    w-5 h-5 
                    transition-all duration-300 
                    // Positioning: Centers the icon when the sidebar is collapsed.
                    ${isLinkTextVisible ? 'mr-3 ml-2' : 'mx-auto'} 
                  `} />
                  
                  {/* Text Label (Conditionally rendered) */}
                  {isLinkTextVisible && (
                    <span className="whitespace-nowrap transition-opacity duration-300">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}; 

export default Sidebar