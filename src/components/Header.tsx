import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Plus, Bell, Settings, Menu, X } from 'lucide-react';

interface HeaderProps {
  credits?: number;
  onSearch?: (query: string) => void;
  onAddNew?: () => void;
  onSettingsClick?: () => void;
  onNotificationClick?: () => void;
  onProjectsClick?: () => void;
  onDatastoreClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  credits = 350,
  onSearch,
  onAddNew,
  onSettingsClick,
  onNotificationClick,
  onProjectsClick,
  onDatastoreClick
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-[#090909]  container mx-auto">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1
              className="flex items-center space-x-2 text-xl sm:text-2xl font-bold text-white cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => navigate('/')}
            >
              <img
                src="https://res.cloudinary.com/dpfheortu/image/upload/e_background_removal/f_png/v1753686417/Screenshot_2025-07-28_at_12.35.38_PM_sdmg9t.png"
                alt="Kuberns Logo"
                className="w-8 h-8 object-contain"
              />
              <span>Kuberns</span>
            </h1>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Quick Search"
              onChange={handleSearchChange}
              className="bg-[#151515] text-white pl-10 pr-4 py-2 rounded-lg w-64 xl:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          {/* Mobile Search Toggle */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-2"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Settings Button - Hidden on mobile, shown on tablet+ */}
            <button 
              onClick={onSettingsClick}
              className="hidden sm:block text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Credits Display - Responsive text */}
            <div className="hidden sm:flex items-center space-x-2 text-blue-400">
              <span className="text-sm font-medium">⚡ {credits}</span>
              <span className="hidden md:inline text-xs text-gray-500 uppercase tracking-wide">Credits Left</span>
            </div>

            {/* Add New Button - Responsive */}
            <button 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors duration-200 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add New</span>
            </button>

            {/* Notifications Button */}
            <button 
              onClick={onNotificationClick}
              className="text-gray-400 hover:text-white transition-colors duration-200 relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>

            {/* User Avatar */}
            <div className="w-8 h-8 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600 transition-colors duration-200"></div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchExpanded && (
          <div className="lg:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Quick Search"
                onChange={handleSearchChange}
                className="bg-[#151515] text-white pl-10 pr-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Bar - Responsive */}
      <div className={`px-4 sm:px-6 py-2 ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
        <div className="flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0">
          <nav className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
            <button 
              onClick={() => navigate('/')}
              className={`flex items-center space-x-2 px-3 py-2 md:py-1 rounded transition-all duration-200 w-full md:w-auto justify-start ${
                location.pathname === '/' 
                  ? 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span className="text-sm">🏠</span>
              <span className="font-medium">Dashboard</span>
            </button>
            <button 
              onClick={() => navigate('/deployments')}
              className={`flex items-center space-x-2 px-3 py-2 md:py-1 rounded transition-all duration-200 w-full md:w-auto justify-start ${
                location.pathname === '/deployments' 
                  ? 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span className="text-sm">📋</span>
              <span className="font-medium">Deployments</span>
            </button>
            <button 
              onClick={onDatastoreClick}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 px-3 py-2 md:py-1 rounded hover:bg-gray-700 w-full md:w-auto justify-start"
            >
              <span className="text-sm">📁</span>
              <span className="font-medium">Datastore</span>
            </button>
            
            {/* Mobile-only items */}
            <div className="md:hidden space-y-2 pt-2 border-t border-gray-700">
              <button 
                onClick={onSettingsClick}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 px-3 py-2 rounded hover:bg-gray-700 w-full justify-start"
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium">Settings</span>
              </button>
              <div className="flex items-center space-x-2 text-blue-400 px-3 py-2">
                <span className="text-sm font-medium">⚡ {credits} Credits Left</span>
              </div>
            </div>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
            <button className="hover:text-white transition-colors duration-200 text-left md:text-center py-1">
              Documentation
            </button>
            <button className="hover:text-white transition-colors duration-200 text-left md:text-center py-1">
              Support
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;