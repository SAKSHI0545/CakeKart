import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders, Order } from '@/contexts/OrderContext';
import { 
  Package, 
  Search,
  Filter,
  Eye,
  MessageCircle,
  Clock,
  Check,
  Truck,
  X,
  ChefHat,
  Calendar,
  ArrowRight
} from 'lucide-react';

const OrderHistoryPage = () => {
  const { user } = useAuth();
  const { getOrdersByCustomer } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (!user) {
    return <div>Please login to view order history</div>;
  }

  const userOrders = getOrdersByCustomer(user.id);
  
  // Filter orders
  const filteredOrders = userOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'confirmed': return <Check className="h-3 w-3" />;
      case 'preparing': return <ChefHat className="h-3 w-3" />;
      case 'ready': return <Package className="h-3 w-3" />;
      case 'delivered': return <Truck className="h-3 w-3" />;
      case 'cancelled': return <X className="h-3 w-3" />;
      default: return <Package className="h-3 w-3" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending': return 'Your order is being reviewed';
      case 'confirmed': return 'Order confirmed and will be prepared soon';
      case 'preparing': return 'Your delicious cake is being prepared';
      case 'ready': return 'Your order is ready for pickup/delivery';
      case 'delivered': return 'Order successfully delivered';
      case 'cancelled': return 'Order was cancelled';
      default: return 'Order status unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReorder = (order: Order) => {
    // In a real app, this would add items back to cart
    const orderItems = order.items.map((item) => `${item.name} (${item.quantity}x)`).join(', ');
    const message = `Hi! I'd like to reorder: ${orderItems}. Order ID: ${order.id}`;
    const whatsappUrl = `https://wa.me/918888888888?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Order History</h1>
          <p className="text-muted-foreground">
            Track your orders and view past purchases
          </p>
        </div>

        {/* Filters */}
        <Card className="card-elegant mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders or cakes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-sm min-w-40"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="card-elegant text-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">No orders found</h2>
            <p className="text-muted-foreground mb-8">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'You haven\'t placed any orders yet'
              }
            </p>
            <Button onClick={() => window.location.href = '/cakes'}>
              Browse Cakes
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="card-elegant">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit mt-2 sm:mt-0`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>

                    {/* Status Message */}
                    <div className="mb-4 p-3 bg-accent/20 rounded-lg">
                      <p className="text-sm font-medium">{getStatusMessage(order.status)}</p>
                    </div>

                    {/* Items */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Items ({order.items.length})</h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 p-2 bg-accent/10 rounded-lg">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Qty: {item.quantity} | ₹{item.price * item.quantity}
                              </p>
                              {item.customizations?.size && (
                                <p className="text-xs text-muted-foreground">Size: {item.customizations.size}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="font-medium text-sm mb-1">Delivery Date</h5>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {order.deliveryDate} | {order.deliveryTime}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-1">Total Amount</h5>
                        <p className="text-lg font-bold text-primary">₹{order.total}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-40">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReorder(order)}
                      className="w-full"
                    >
                      <MessageCircle className="h-3 w-3 mr-2" />
                      Reorder
                    </Button>
                    
                    {order.status === 'delivered' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                      >
                        <Eye className="h-3 w-3 mr-2" />
                        Review
                      </Button>
                    )}
                    
                    {(order.status === 'pending' || order.status === 'confirmed') && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-destructive hover:text-destructive"
                      >
                        <X className="h-3 w-3 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>

                {/* Order Timeline for active orders */}
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h5 className="font-medium mb-3">Order Progress</h5>
                    <div className="flex items-center space-x-4 overflow-x-auto">
                      {['pending', 'confirmed', 'preparing', 'ready', 'delivered'].map((step, index) => {
                        const isCompleted = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'].indexOf(order.status) >= index;
                        const isCurrent = order.status === step;
                        
                        return (
                          <div key={step} className="flex items-center space-x-2 min-w-max">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                              isCompleted 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted text-muted-foreground'
                            } ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                              {getStatusIcon(step)}
                            </div>
                            <span className={`text-xs font-medium ${
                              isCompleted ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {step.charAt(0).toUpperCase() + step.slice(1)}
                            </span>
                            {index < 4 && (
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;