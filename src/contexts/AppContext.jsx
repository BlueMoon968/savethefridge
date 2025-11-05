import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentView, setCurrentView] = useState('fridge');
  const [products, setProducts] = useState([]);
  const [scannedProduct, setScannedProduct] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Load products from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('saveTheFridgeProducts');
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading products:', error);
      }
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('saveTheFridgeProducts', JSON.stringify(products));
    checkExpirations();
  }, [products]);

  // Check for expiring products
  const checkExpirations = () => {
    const now = new Date();
    const newNotifications = [];

    products.forEach(product => {
      const expiryDate = new Date(product.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
      
      if (product.reminderDays >= daysUntilExpiry && daysUntilExpiry >= 0) {
        newNotifications.push({
          id: product.id,
          name: product.name,
          daysLeft: daysUntilExpiry
        });
      }
    });

    setNotifications(newNotifications);

    // Send browser notification if there are expiring items
    if (newNotifications.length > 0 && Notification.permission === 'granted') {
      const count = newNotifications.length;
      new Notification('SaveTheFridge Alert', {
        body: `${count} product${count > 1 ? 's' : ''} expiring soon!`,
        icon: '/vite.svg',
        badge: '/vite.svg'
      });
    }
  };

  const addProduct = (product) => {
    setProducts([...products, { ...product, id: Date.now() }]);
  };

  const removeProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateProduct = (id, updates) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const value = {
    currentView,
    setCurrentView,
    products,
    addProduct,
    removeProduct,
    updateProduct,
    scannedProduct,
    setScannedProduct,
    notifications
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
