import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders, Order } from '@/contexts/OrderContext';
import CakeManagement from '@/components/CakeManagement';
import CategoryManagement from '@/components/CategoryManagement';
import { 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp,
  Eye,
  Edit,
  Check,
  X,
  Clock,
  Truck,
  ChefHat,
  Search,
  Filter,
  Calendar,
  MoreHorizontal,
  Download,
  Cake,
  FolderOpen,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { getAllOrders, updateOrderStatus } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!user || user.role !== 'admin') {
    return <div>Access Denied</div>;
  }

  const allOrders = getAllOrders();
  
  // Filter orders based on search and status
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Dashboard statistics
  const stats = {
    totalOrders: allOrders.length,
    pendingOrders: allOrders.filter(o => o.status === 'pending').length,
    totalRevenue: allOrders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0),
    todayOrders: allOrders.filter(o => 
      new Date(o.createdAt).toDateString() === new Date().toDateString()
    ).length
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(`Order status updated to ${newStatus}`);
    setSelectedOrder(null);
  };

  const getStatusColor = (status: Order['status']) => {
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

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'confirmed': return <Check className="h-3 w-3" />;
      case 'preparing': return <ChefHat className="h-3 w-3" />;
      case 'ready': return <Package className="h-3 w-3" />;
      case 'delivered': return <Truck className="h-3 w-3" />;
      case 'cancelled': return <X className="h-3 w-3" />;
      default: return <MoreHorizontal className="h-3 w-3" />;
    }
  };

  const exportOrdersToCSV = () => {
    const headers = [
      'Order ID',
      'Customer Name',
      'Email',
      'Phone',
      'Status',
      'Total Amount',
      'Items',
      'Delivery Date',
      'Delivery Time',
      'Address',
      'Created At',
      'Special Instructions'
    ];

    const csvData = allOrders.map(order => [
      order.id,
      order.customerName,
      order.customerEmail,
      order.customerPhone || '',
      order.status,
      order.total,
      order.items.map(item => `${item.name} (x${item.quantity})`).join('; '),
      order.deliveryDate,
      order.deliveryTime,
      order.deliveryAddress,
      new Date(order.createdAt).toLocaleDateString(),
      order.specialInstructions || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Orders exported successfully!');
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your bakery business operations</p>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="cakes" className="flex items-center gap-2">
              <Cake className="h-4 w-4" />
              Cakes
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="card-elegant">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <div className="bg-gradient-primary p-2 rounded-full">
                    <Package className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
              </Card>

              <Card className="card-elegant">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                  </div>
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </Card>

              <Card className="card-elegant">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="card-elegant">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Today's Orders</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.todayOrders}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button onClick={exportOrdersToCSV} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Orders
              </Button>
            </div>
          </TabsContent>

          {/* Cakes Management Tab */}
          <TabsContent value="cakes">
            <CakeManagement />
          </TabsContent>

          {/* Categories Management Tab */}
          <TabsContent value="categories">
            <CategoryManagement />
          </TabsContent>

          {/* Orders Management Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Orders List */}
              <div className="lg:col-span-2">
                <Card className="card-elegant">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-xl font-semibold">Recent Orders</h2>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search orders..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full sm:w-64"
                        />
                      </div>
                      
                      {/* Status Filter */}
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredOrders.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No orders found
                      </div>
                    ) : (
                      filteredOrders.map((order) => (
                        <div key={order.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-medium">Order #{order.id}</h3>
                              <p className="text-sm text-muted-foreground">{order.customerName}</p>
                            </div>
                            <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-muted-foreground">Total: </span>
                              <span className="font-medium">₹{order.total}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Items: </span>
                              <span className="font-medium">{order.items.length}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Delivery: </span>
                              <span className="font-medium">{order.deliveryDate}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Time: </span>
                              <span className="font-medium">{order.deliveryTime}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            
                            {order.status === 'pending' && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Confirm
                              </Button>
                            )}
                            
                            {order.status === 'confirmed' && (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleStatusUpdate(order.id, 'preparing')}
                              >
                                <ChefHat className="h-3 w-3 mr-1" />
                                Start Preparing
                              </Button>
                            )}
                            
                            {order.status === 'preparing' && (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleStatusUpdate(order.id, 'ready')}
                              >
                                <Package className="h-3 w-3 mr-1" />
                                Mark Ready
                              </Button>
                            )}
                            
                            {order.status === 'ready' && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleStatusUpdate(order.id, 'delivered')}
                              >
                                <Truck className="h-3 w-3 mr-1" />
                                Delivered
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>

              {/* Order Details Sidebar */}
              <div>
                <Card className="card-elegant sticky top-24">
                  <h3 className="text-lg font-semibold mb-4">Order Details</h3>
                  
                  {selectedOrder ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Order #{selectedOrder.id}</h4>
                        <Badge className={`${getStatusColor(selectedOrder.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(selectedOrder.status)}
                          {selectedOrder.status}
                        </Badge>
                      </div>

                      <Separator />

                      <div>
                        <h5 className="font-medium mb-2">Customer</h5>
                        <div className="text-sm space-y-1">
                          <p>{selectedOrder.customerName}</p>
                          <p className="text-muted-foreground">{selectedOrder.customerEmail}</p>
                          {selectedOrder.customerPhone && (
                            <p className="text-muted-foreground">{selectedOrder.customerPhone}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Items</h5>
                        <div className="space-y-2">
                          {selectedOrder.items.map((item, index) => (
                            <div key={index} className="text-sm p-2 bg-accent/20 rounded">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-muted-foreground">
                                Qty: {item.quantity} | ₹{item.price * item.quantity}
                              </div>
                              {item.customizations && (
                                <div className="text-xs mt-1 space-y-1">
                                  {item.customizations.size && <div>Size: {item.customizations.size}</div>}
                                  {item.customizations.flavor && <div>Flavor: {item.customizations.flavor}</div>}
                                  {item.customizations.message && <div>Message: "{item.customizations.message}"</div>}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Delivery</h5>
                        <div className="text-sm space-y-1">
                          <p><strong>Date:</strong> {selectedOrder.deliveryDate}</p>
                          <p><strong>Time:</strong> {selectedOrder.deliveryTime}</p>
                          <p><strong>Address:</strong> {selectedOrder.deliveryAddress}</p>
                          {selectedOrder.specialInstructions && (
                            <p><strong>Instructions:</strong> {selectedOrder.specialInstructions}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Payment</h5>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>₹{selectedOrder.subtotal}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Delivery:</span>
                            <span>₹{selectedOrder.deliveryFee}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Total:</span>
                            <span>₹{selectedOrder.total}</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h5 className="font-medium mb-2">Update Status</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {['confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map((status) => (
                            <Button
                              key={status}
                              variant={selectedOrder.status === status ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleStatusUpdate(selectedOrder.id, status as Order['status'])}
                              disabled={selectedOrder.status === status}
                              className="text-xs"
                            >
                              {getStatusIcon(status as Order['status'])}
                              <span className="ml-1 capitalize">{status}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select an order to view details</p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;