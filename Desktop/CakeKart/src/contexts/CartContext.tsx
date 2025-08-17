import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string;
  cakeId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customizations?: {
    size?: string;
    message?: string;
    flavor?: string;
  };
}

interface CartContextType {
  items: CartItem[];
  addToCart: (cake: any, quantity?: number, customizations?: any) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load cart from localStorage when user changes
  useEffect(() => {
    if (user) {
      const storedCart = localStorage.getItem(`cart_${user.id}`);
      if (storedCart) {
        try {
          setItems(JSON.parse(storedCart));
        } catch (error) {
          console.error('Error parsing stored cart:', error);
          setItems([]);
        }
      }
    } else {
      setItems([]);
    }
  }, [user]);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (user && items.length > 0) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(items));
    } else if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
  }, [items, user]);

  const addToCart = (cake: any, quantity = 1, customizations = {}) => {
    const itemId = `${cake.id}_${JSON.stringify(customizations)}`;
    
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === itemId);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: itemId,
          cakeId: cake.id,
          name: cake.name,
          price: cake.price,
          image: cake.image,
          quantity,
          customizations
        };
        return [...currentItems, newItem];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;