import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  RefreshCw, 
  Bell, 
  X, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  Clock,
  Truck,
  XCircle,
  Calendar,
  MapPin,
  Hash,
  DollarSign
} from 'lucide-react';

// Types
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

type OrderStatus = 
  | 'pending'
  | 'ready-to-deliver' 
  | 'on-delivery' 
  | 'delivered';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  status: OrderStatus;
  orderDate: string;
  estimatedDelivery: string;
  totalAmount: number;
  shippingAddress: string;
  trackingNumber?: string;
}

interface Notification {
  id: string;
  orderId: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Status configuration
  const statusConfig = {
    pending: {
      icon: Clock,
      label: 'Pending',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      iconColor: 'text-gray-600'
    },
    'ready-to-deliver': {
      icon: Package,
      label: 'Ready to Deliver',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      iconColor: 'text-gray-600'
    },
    'on-delivery': {
      icon: Truck,
      label: 'On Delivery',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      iconColor: 'text-gray-600'
    },
    delivered: {
      icon: CheckCircle,
      label: 'Delivered',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      iconColor: 'text-gray-600'
    }
  };

  const notificationIcons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle
  };

  const notificationStyles = {
    info: 'bg-gray-100 border-gray-300 text-gray-800',
    success: 'bg-black text-white border-gray-800',
    warning: 'bg-gray-800 text-white border-gray-600',
    error: 'bg-gray-600 text-white border-gray-400'
  };

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Get customer ID from localStorage
      const userData = localStorage.getItem('userData');
      const customerId = localStorage.getItem('customer_id');
      
      let customerID = customerId;
      
      // If no customer_id in localStorage, try to get it from userData
      if (!customerID && userData) {
        try {
          const user = JSON.parse(userData);
          customerID = user.customer_id || user.uid || user.id;
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
        }
      }
      
      if (!customerID) {
        throw new Error('Customer ID not found. Please log in again.');
      }
      
      console.log('Fetching orders for customer ID:', customerID);
      
      // Make API call to get orders
      const response = await fetch(`/cms/getOrders/${customerID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          // No orders found for this customer
          setOrders([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Orders API response:', data);
      
      // Handle different possible response structures
      let ordersToProcess = [];
      if (data.orders) {
        if (Array.isArray(data.orders)) {
          // If orders is an array
          ordersToProcess = data.orders;
        } else {
          // If orders is a single object, wrap it in an array
          ordersToProcess = [data.orders];
        }
      }
      
      // Transform API response to match our Order interface
      const transformedOrders = ordersToProcess.map((apiOrder: any) => {
        // Handle the nested items structure: items.item[]
        let orderItems = [];
        if (apiOrder.items) {
          if (Array.isArray(apiOrder.items)) {
            // If items is already an array
            orderItems = apiOrder.items;
          } else if (apiOrder.items.item && Array.isArray(apiOrder.items.item)) {
            // If items has nested item array (as in your API response)
            orderItems = apiOrder.items.item;
          }
        }

        return {
          id: apiOrder.orderID || apiOrder._id || apiOrder.id,
          orderNumber: apiOrder.orderID || `SL-${apiOrder._id}`,
          customerName: apiOrder.customerName || 'Customer',
          customerEmail: apiOrder.customerEmail || '',
          items: orderItems.map((item: any) => ({
            id: item.product_id || item.id,
            name: item.name || 'Unknown Product',
            quantity: item.quantity || 1,
            price: item.price || 0,
            image: item.image || 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400'
          })),
          status: apiOrder.status || 'pending',
          orderDate: apiOrder.created_at || apiOrder.orderDate || apiOrder.createdAt || new Date().toISOString(),
          estimatedDelivery: apiOrder.estimatedDelivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          totalAmount: apiOrder.totalAmount || 0,
          shippingAddress: apiOrder.shippingAddress || 'No address provided',
          trackingNumber: apiOrder.trackingNumber || undefined
        };
      });
      
      setOrders(transformedOrders);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error instanceof Error ? error.message : 'Failed to load orders');
      // Fallback to empty orders array instead of mock data
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchOrders();
  }, []);

  // Simulate real-time order status updates (only if we have orders)
  useEffect(() => {
    if (orders.length === 0) return;
    
    const interval = setInterval(() => {
      const randomOrderIndex = Math.floor(Math.random() * orders.length);
      const currentOrder = orders[randomOrderIndex];
      
      if (currentOrder && Math.random() > 0.8) { // 20% chance to update
        const possibleStatuses: OrderStatus[] = ['ready-to-deliver', 'on-delivery', 'delivered'];
        const currentStatusIndex = possibleStatuses.indexOf(currentOrder.status);
        
        if (currentStatusIndex < possibleStatuses.length - 1 && currentStatusIndex >= 0) {
          const newStatus = possibleStatuses[currentStatusIndex + 1];
          updateOrderStatus(currentOrder.id, newStatus);
        }
      }
    }, 8000); // Check every 8 seconds

    return () => clearInterval(interval);
  }, [orders]);

  useEffect(() => {
    if (notifications.length > 0) {
      setIsNotificationOpen(true);
    }
  }, [notifications]);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      )
    );

    // Create notification
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const newNotification: Notification = {
        id: `${orderId}-${Date.now()}`,
        orderId,
        message: `Order ${order.orderNumber} status updated to ${newStatus.toUpperCase()}`,
        timestamp: new Date().toISOString(),
        type: newStatus === 'delivered' ? 'success' : 'info'
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Keep only 5 latest
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setIsRefreshing(false);
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

const getStatusCounts = (): Record<OrderStatus, number> & { total: number } => {
  const initialCounts: Record<OrderStatus, number> = {
    pending: 0,
    'ready-to-deliver': 0,
    'on-delivery': 0,
    delivered: 0,
  };

  const counts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, { ...initialCounts });

  return {
    total: orders.length,
    ...counts,
  };
};

const statusCounts = getStatusCounts();


  // Order Status Component
  const OrderStatusBadge: React.FC<{ status: OrderStatus; className?: string }> = ({ status, className = '' }) => {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-300 ${config.bgColor} ${config.textColor} ${className}`}>
        <Icon size={16} className={config.iconColor} />
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    );
  };

  // Order Card Component
  const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-all duration-200">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Hash size={16} className="text-gray-600" />
              <h3 className="text-lg font-bold text-black">{order.orderNumber}</h3>
            </div>
            <p className="text-gray-600">{order.customerName}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Order Items */}
        <div className="mb-4">
          <h4 className="font-semibold text-black mb-2">Items:</h4>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded border">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded border"
                />
                <div className="flex-1">
                  <p className="font-medium text-black">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-black">{formatCurrency(item.price)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} />
            <span className="text-sm">Ordered: {formatDate(order.orderDate)}</span>
          </div>
          {/* <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} />
            <span className="text-sm">Est. Delivery: {formatDate(order.estimatedDelivery)}</span>
          </div> */}
          {/* <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} />
            <span className="text-sm">{order.shippingAddress}</span>
          </div> */}
          <div className="flex items-center gap-2 text-black">
            <DollarSign size={16} />
            <span className="text-sm font-semibold">Total: {formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        {/* Tracking Number */}
        {order.trackingNumber && (
          <div className="bg-gray-100 p-3 rounded border">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="bg-black p-2 rounded-lg">
                <Package size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">SwiftLogistic</h1>
                <p className="text-gray-600">Order Management System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={`text-gray-700 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="text-gray-700">Refresh</span>
              </button>
              
              {/* Notification System */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2 border-2 border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors"
                >
                  <Bell size={20} className="text-gray-700" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notification Panel */}
                {isNotificationOpen && (
                  <div className="absolute top-14 right-0 w-96 max-h-80 bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="bg-gray-100 p-3 border-b border-gray-300">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-black">Order Updates</h3>
                        <button
                          onClick={() => setIsNotificationOpen(false)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <X size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No new notifications
                        </div>
                      ) : (
                        notifications.map((notification) => {
                          const Icon = notificationIcons[notification.type];
                          return (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-gray-200 ${notificationStyles[notification.type]} relative group`}
                            >
                              <div className="flex items-start gap-3">
                                <Icon size={16} className="mt-1" />
                                <div className="flex-1">
                                  <p className="text-sm">{notification.message}</p>
                                  <p className="text-xs opacity-75 mt-1">
                                    {formatTime(notification.timestamp)}
                                  </p>
                                </div>
                                <button
                                  onClick={() => dismissNotification(notification.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black hover:bg-opacity-20 rounded"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-black">{statusCounts.total || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-gray-600">{statusCounts.pending || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-600">Ready to Deliver</p>
            <p className="text-2xl font-bold text-gray-600">{statusCounts['ready-to-deliver'] || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-600">On Delivery</p>
            <p className="text-2xl font-bold text-gray-600">{statusCounts['on-delivery'] || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-600">Delivered</p>
            <p className="text-2xl font-bold text-gray-600">{statusCounts.delivered || 0}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  placeholder="Search by order number or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="ready-to-deliver">Ready to Deliver</option>
                <option value="on-delivery">On Delivery</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="bg-white p-12 rounded-lg border-2 border-gray-200 text-center">
              <RefreshCw size={48} className="mx-auto text-gray-400 mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Loading orders...</h3>
              <p className="text-gray-500">Please wait while we fetch your orders.</p>
            </div>
          ) : error ? (
            <div className="bg-white p-12 rounded-lg border-2 border-red-200 text-center">
              <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
              <h3 className="text-lg font-semibold text-red-600 mb-2">Error loading orders</h3>
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-lg border-2 border-gray-200 text-center">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {orders.length === 0 ? 'No orders yet' : 'No orders found'}
              </h3>
              <p className="text-gray-500">
                {orders.length === 0 
                  ? 'Start shopping to see your orders here!' 
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};