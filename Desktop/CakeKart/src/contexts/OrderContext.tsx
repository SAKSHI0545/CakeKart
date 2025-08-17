import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface OrderItem {
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

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryDate: string;
  deliveryTime: string;
  deliveryAddress: string;
  specialInstructions?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => string;
  updateOrderStatus: (orderId: string, status: Order['status'], notes?: string) => void;
  getOrdersByCustomer: (customerId: string) => Order[];
  getAllOrders: () => Order[];
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider = ({ children }: OrderProviderProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  // Load orders from localStorage on mount
  useEffect(() => {
    const storedOrders = localStorage.getItem('sweet_delights_orders');
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch (error) {
        console.error('Error parsing stored orders:', error);
        setOrders([]);
      }
    } else {
      // Initialize with some mock orders for demo
      const mockOrders: Order[] = [
        {
          id: 'order_1',
          customerId: '2',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '+91 9876543210',
          items: [
            {
              id: 'item_1',
              cakeId: '1',
              name: 'Chocolate Truffle Delight',
              price: 899,
              image: '/api/placeholder/300/300',
              quantity: 1,
              customizations: {
                size: '1kg',
                flavor: 'Original Chocolate',
                message: 'Happy Birthday!'
              }
            }
          ],
          subtotal: 899,
          deliveryFee: 0,
          total: 899,
          deliveryDate: '2024-12-15',
          deliveryTime: '3:00 PM - 6:00 PM',
          deliveryAddress: '123 Main Street, Apartment 4B, Mumbai - 400001',
          specialInstructions: 'Please call before delivery',
          status: 'pending',
          createdAt: '2024-12-10T10:30:00Z',
          updatedAt: '2024-12-10T10:30:00Z'
        },
        {
          id: 'order_2',
          customerId: '2',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          items: [
            {
              id: 'item_2',
              cakeId: '2',
              name: 'Strawberry Dream',
              price: 799,
              image: '/api/placeholder/300/300',
              quantity: 2,
              customizations: {
                size: '500g',
                flavor: 'Original'
              }
            }
          ],
          subtotal: 1598,
          deliveryFee: 0,
          total: 1598,
          deliveryDate: '2024-12-08',
          deliveryTime: '12:00 PM - 3:00 PM',
          deliveryAddress: '123 Main Street, Apartment 4B, Mumbai - 400001',
          status: 'delivered',
          createdAt: '2024-12-05T14:20:00Z',
          updatedAt: '2024-12-08T15:30:00Z'
        }
      ];
      setOrders(mockOrders);
      localStorage.setItem('sweet_delights_orders', JSON.stringify(mockOrders));
    }
  }, []);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('sweet_delights_orders', JSON.stringify(orders));
    }
  }, [orders]);

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): string => {
    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders(currentOrders => [...currentOrders, newOrder]);
    return newOrder.id;
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], notes?: string) => {
    setOrders(currentOrders =>
      currentOrders.map(order =>
        order.id === orderId
          ? { 
              ...order, 
              status, 
              updatedAt: new Date().toISOString(),
              notes: notes || order.notes
            }
          : order
      )
    );
  };

  const getOrdersByCustomer = (customerId: string): Order[] => {
    return orders.filter(order => order.customerId === customerId);
  };

  const getAllOrders = (): Order[] => {
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const value = {
    orders,
    createOrder,
    updateOrderStatus,
    getOrdersByCustomer,
    getAllOrders,
    getOrderById
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;