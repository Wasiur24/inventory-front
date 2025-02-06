
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart, BarChart, LogOut,Tag } from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['admin'] },
  { icon: Package, label: 'Products', path: '/products', roles: ['admin'] },
  { icon: Tag, label: 'Categories', path: '/categories', roles: ['admin'] },
  { icon: Users, label: 'Suppliers', path: '/suppliers', roles: ['admin'] },
  { icon: ShoppingCart, label: 'Purchases', path: '/purchases', roles: ['admin'] },
  { icon: BarChart, label: 'Sales', path: '/sales', roles: ['admin'] },
  { icon: BarChart, label: 'Sales', path: '/salesuser', roles: [ 'user'] },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem('user'));

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="h-full w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <Package className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-semibold">Society Store</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems
            .filter((item) => item.roles.includes(user?.role)) // Filter based on user role
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {user?.name?.[0] || 'U'}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg w-full"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
