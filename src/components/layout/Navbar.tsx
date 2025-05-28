import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  BarChart3, 
  FileText, 
  User, 
  Car, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const closeMenu = () => {
    setIsOpen(false);
  };
  
  const handleLogout = () => {
    logout();
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-blue-800 font-bold text-xl">
                SisFotocomp
              </Link>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link 
                to="/" 
                className={`inline-flex items-center px-3 py-2 text-sm font-medium border-b-2 ${
                  isActive('/') 
                    ? 'border-blue-700 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <BarChart3 size={16} className="mr-1.5" />
                Dashboard
              </Link>
              
              <Link 
                to="/fines" 
                className={`inline-flex items-center px-3 py-2 text-sm font-medium border-b-2 ${
                  isActive('/fines') || location.pathname.startsWith('/fines/') 
                    ? 'border-blue-700 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <FileText size={16} className="mr-1.5" />
                Multas
              </Link>
              
              {/* <Link 
                to="/vehicles" 
                className={`inline-flex items-center px-3 py-2 text-sm font-medium border-b-2 ${
                  isActive('/vehicles') || location.pathname.startsWith('/vehicles/') 
                    ? 'border-blue-700 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Car size={16} className="mr-1.5" />
                Vehículos
              </Link> */}
              
              <Link 
                to="/users" 
                className={`inline-flex items-center px-3 py-2 text-sm font-medium border-b-2 ${
                  isActive('/users') 
                    ? 'border-blue-700 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <User size={16} className="mr-1.5" />
                Usuarios
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-4">
                {user?.name || ''}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                icon={<LogOut size={16} />}
              >
                Salir
              </Button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') 
                  ? 'bg-blue-50 border-l-4 border-blue-700 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <BarChart3 size={16} className="mr-2" />
                Dashboard
              </div>
            </Link>
            
            <Link
              to="/fines"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/fines') || location.pathname.startsWith('/fines/') 
                  ? 'bg-blue-50 border-l-4 border-blue-700 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <FileText size={16} className="mr-2" />
                Multas
              </div>
            </Link>
            
            <Link
              to="/vehicles"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/vehicles') || location.pathname.startsWith('/vehicles/')
                  ? 'bg-blue-50 border-l-4 border-blue-700 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <Car size={16} className="mr-2" />
                Vehículos
              </div>
            </Link>
            
            <Link
              to="/users"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/users') 
                  ? 'bg-blue-50 border-l-4 border-blue-700 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                Usuarios
              </div>
            </Link>
            
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <div className="flex items-center">
                    <LogOut size={16} className="mr-2" />
                    Cerrar sesión
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;