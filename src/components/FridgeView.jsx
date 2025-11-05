import { Trash2, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getDaysUntilExpiry, getExpiryStatus, formatDate } from '../utils/productUtils';
import Credits from './Credits'

export default function FridgeView() {
  const { products, removeProduct } = useApp();

  const sortedProducts = [...products].sort((a, b) => 
    new Date(a.expiryDate) - new Date(b.expiryDate)
  );

  const handleRemove = (id, name) => {
    if (window.confirm(`Remove "${name}" from your fridge?`)) {
      removeProduct(id);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="2" width="16" height="20" rx="2"/>
            <line x1="4" y1="10" x2="20" y2="10"/>
            <line x1="8" y1="6" x2="8" y2="8"/>
            <line x1="8" y1="14" x2="8" y2="16"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Your fridge is empty
        </h2>
        <p className="text-gray-600">
          Tap the scan button below to add products
        </p>
        <Credits />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Products ({products.length})
        </h2>
        <span className="text-sm text-gray-600 font-medium">
          Sorted by expiry
        </span>
      </div>
      
      {sortedProducts.map((product, index) => {
        const daysLeft = getDaysUntilExpiry(product.expiryDate);
        const status = getExpiryStatus(daysLeft);
        
        return (
          <div 
            key={product.id} 
            className="card overflow-hidden animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex">
              {product.image && (
                <div className="w-28 h-28 flex-shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {product.brand}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(product.id, product.name)}
                    className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className={`badge ${status.color}`}>
                    <span>{status.icon}</span>
                    <span>{status.text}</span>
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(product.expiryDate)}
                  </span>
                </div>
              </div>
            </div>
            <Credits />
          </div>
        );
      })}
    </div>
  );
}
