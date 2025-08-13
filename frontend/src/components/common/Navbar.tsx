
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';

export const Navbar: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    ];

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/tasks" className="flex items-center space-x-2">
                        <CheckSquare className="w-8 h-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">Todo Manager</span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex space-x-8">
                        {navItems.map(({ path, label, icon: Icon }) => (
                            <Link
                                key={path}
                                to={path}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === path
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};