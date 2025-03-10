import { database } from './config';
import { ref, set, get, update, remove, query, orderByChild, equalTo } from 'firebase/database';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
  imageUrl?: string;
  productType?: string;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: string;
  items: OrderItem[];
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod?: string;
  trackingNumber?: string;
}

const ORDERS_REF = 'orders';

// Create a new order
export const createOrder = async (order: Omit<Order, 'id'>): Promise<string> => {
  try {
    // Generate a unique ID
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const orderRef = ref(database, `${ORDERS_REF}/${orderId}`);
    
    const newOrder: Order = {
      ...order,
      id: orderId,
      date: order.date || new Date().toISOString(),
      status: order.status || 'Pending'
    };
    
    await set(orderRef, newOrder);
    
    // Add to user's order history
    // This functionality is handled by userService.addOrderToHistory
    
    return orderId;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const snapshot = await get(ref(database, `${ORDERS_REF}/${orderId}`));
    
    if (snapshot.exists()) {
      return snapshot.val() as Order;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};

// Get all orders for a user
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const ordersRef = ref(database, ORDERS_REF);
    const userOrdersQuery = query(ordersRef, orderByChild('userId'), equalTo(userId));
    const snapshot = await get(userOrdersQuery);
    
    if (snapshot.exists()) {
      const orders: Order[] = [];
      snapshot.forEach((childSnapshot) => {
        orders.push(childSnapshot.val() as Order);
      });
      
      // Sort by date, newest first
      return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    return [];
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
  try {
    await update(ref(database, `${ORDERS_REF}/${orderId}`), { status });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Update order tracking information
export const updateOrderTracking = async (orderId: string, trackingNumber: string): Promise<void> => {
  try {
    await update(ref(database, `${ORDERS_REF}/${orderId}`), { trackingNumber });
  } catch (error) {
    console.error('Error updating order tracking:', error);
    throw error;
  }
};

export default {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  updateOrderTracking
}; 