import React from 'react';
import { Search, ShoppingBag, User, LogOut } from 'lucide-react';

export const Header = ({ user, onLogout, searchTerm, onSearchChange }: any) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-black" />
            <span className="text-2xl font-bold text-black">BagMarket</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* User Menu */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-black" />
                <span className="text-gray-800 font-medium">{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:text-black hover:bg-gray-100 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
