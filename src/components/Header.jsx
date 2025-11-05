import { Bell } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function Header() {
  const { notifications } = useApp();

  return (
    <>
      <header className="glass sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-md">
                <svg 
                  className="w-6 h-6 text-indigo-500" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <rect x="4" y="2" width="16" height="20" rx="2"/>
                  <line x1="4" y1="10" x2="20" y2="10"/>
                  <line x1="8" y1="6" x2="8" y2="8"/>
                  <line x1="8" y1="14" x2="8" y2="16"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  SaveTheFridge
                </h1>
                <p className="text-xs text-gray-600">Your Virtual Fridge</p>
              </div>
            </div>
            
            {notifications.length > 0 && (
              <div className="relative">
                <div className="animate-pulse">
                  <Bell className="w-6 h-6 text-gray-700" />
                </div>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {notifications.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-l-4 border-yellow-500 p-3 animate-slide-up">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2">
              <svg 
                className="w-5 h-5 text-yellow-700" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p className="text-sm font-semibold text-yellow-800">
                {notifications.length} product{notifications.length > 1 ? 's' : ''} expiring soon!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
