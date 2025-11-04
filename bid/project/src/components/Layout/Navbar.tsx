import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Menu, X, User, LogOut } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import NotificationDropdown from './NotificationDropdown';

const Navbar: React.FC = () => {
  const { currentUser, notifications } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  const unreadNotifications = notifications.filter(n => !n.isRead && n.userId === currentUser?.id);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">BidConnect</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') 
                  ? 'bg-blue-800 text-white' 
                  : 'text-gray-300 hover:bg-blue-700 hover:text-white transition-colors'
              }`}
            >
              Browse Tasks
            </Link>
            <Link 
              to="/create-task" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/create-task') 
                  ? 'bg-blue-800 text-white' 
                  : 'text-gray-300 hover:bg-blue-700 hover:text-white transition-colors'
              }`}
            >
              Post a Task
            </Link>
            <Link 
              to="/profile" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/profile') 
                  ? 'bg-blue-800 text-white' 
                  : 'text-gray-300 hover:bg-blue-700 hover:text-white transition-colors'
              }`}
            >
              My Profile
            </Link>
            
            {currentUser && (
              <div className="relative">
                <button 
                  onClick={toggleNotifications}
                  className="relative p-2 rounded-full hover:bg-blue-700 focus:outline-none transition-colors"
                >
                  <Bell size={20} />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-xs text-white text-center">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <NotificationDropdown 
                    onClose={() => setShowNotifications(false)} 
                  />
                )}
              </div>
            )}
            
            {currentUser && (
              <div className="flex items-center ml-3">
                <div className="relative">
                  <img 
                    src={currentUser.profilePicture || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'} 
                    alt="Profile" 
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex md:hidden items-center">
            {currentUser && (
              <div className="relative mr-2">
                <button 
                  onClick={toggleNotifications}
                  className="relative p-2 rounded-full hover:bg-blue-700 focus:outline-none transition-colors"
                >
                  <Bell size={20} />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-xs text-white text-center">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <NotificationDropdown 
                    onClose={() => setShowNotifications(false)} 
                  />
                )}
              </div>
            )}
            
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-800">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-gray-300 hover:bg-blue-600 hover:text-white transition-colors'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Tasks
            </Link>
            <Link
              to="/create-task"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/create-task') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-gray-300 hover:bg-blue-600 hover:text-white transition-colors'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Post a Task
            </Link>
            <Link
              to="/profile"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/profile') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-gray-300 hover:bg-blue-600 hover:text-white transition-colors'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              My Profile
            </Link>
            
            {currentUser && (
              <div className="pt-4 pb-3 border-t border-blue-700">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img 
                      src={currentUser.profilePicture || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'} 
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover" 
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{currentUser.name}</div>
                    <div className="text-sm font-medium text-blue-300">{currentUser.email}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;