import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrderContext';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart,
  MessageCircle,
  Calendar,
  Clock,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { createOrder } = useOrders();
  
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal >= 999 ? 0 : 50;
  const total = subtotal + deliveryFee;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      toast.success('Item removed from cart');
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    toast.success('Item removed from cart');
  };

  const handlePlaceOrder = () => {
    if (!deliveryDate || !deliveryTime || !deliveryAddress) {
      toast.error('Please fill in all delivery details');
      return;
    }

    // Create order in the system
    const orderId = createOrder({
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone,
      items: items.map(item => ({
        id: item.id,
        cakeId: item.cakeId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        customizations: item.customizations
      })),
      subtotal,
      deliveryFee,
      total,
      deliveryDate,
      deliveryTime,
      deliveryAddress,
      specialInstructions
    });

    // Create WhatsApp order message
    const orderSummary = items.map(item => {
      const customizations = item.customizations;
      let itemText = `• ${item.name} (${item.quantity}x) - ₹${item.price * item.quantity}`;
      
      if (customizations?.size) itemText += `\n  Size: ${customizations.size}`;
      if (customizations?.flavor) itemText += `\n  Flavor: ${customizations.flavor}`;
      if (customizations?.message) itemText += `\n  Message: "${customizations.message}"`;
      
      return itemText;
    }).join('\n\n');

    const orderMessage = `🎂 *New Order from Sweet Delights*

*Order ID:* ${orderId}

*Customer Details:*
Name: ${user.name}
Email: ${user.email}
Phone: ${user.phone || 'Not provided'}

*Order Items:*
${orderSummary}

*Order Summary:*
Subtotal: ₹${subtotal}
Delivery Fee: ₹${deliveryFee}
*Total: ₹${total}*

*Delivery Details:*
📅 Date: ${deliveryDate}
⏰ Time: ${deliveryTime}
📍 Address: ${deliveryAddress}

${specialInstructions ? `*Special Instructions:*\n${specialInstructions}` : ''}

Please confirm this order and provide the estimated preparation time.`;

    const whatsappUrl = `https://wa.me/918624891891?text=${encodeURIComponent(orderMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after successful order
    clearCart();
    toast.success('Order placed successfully! We\'ll contact you shortly.');
    navigate('/orders'); // Redirect to order history
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/cakes')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>

          <Card className="card-elegant text-center py-16">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Add some delicious cakes to get started!
            </p>
            <Button onClick={() => navigate('/cakes')}>
              Browse Cakes
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/cakes')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <p className="text-muted-foreground">
                {items.length} item{items.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>
          </div>
          
          {items.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => {
                clearCart();
                toast.success('Cart cleared');
              }}
            >
              Clear Cart
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="card-elegant">
                <div className="flex items-start space-x-4">
                  {/* Image */}
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    
                    {/* Customizations */}
                    {item.customizations && (
                      <div className="space-y-1 mb-3">
                        {item.customizations.size && (
                          <Badge variant="secondary" className="text-xs mr-2">
                            Size: {item.customizations.size}
                          </Badge>
                        )}
                        {item.customizations.flavor && (
                          <Badge variant="secondary" className="text-xs mr-2">
                            Flavor: {item.customizations.flavor}
                          </Badge>
                        )}
                        {item.customizations.message && (
                          <div className="text-xs text-muted-foreground mt-2">
                            Message: "{item.customizations.message}"
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-lg">₹{item.price * item.quantity}</div>
                        <div className="text-sm text-muted-foreground">₹{item.price} each</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary and Delivery Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="card-elegant">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                {subtotal < 999 && (
                  <div className="text-xs text-muted-foreground">
                    Add ₹{999 - subtotal} more for free delivery
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </Card>

            {/* Delivery Details */}
            <Card className="card-elegant">
              <h3 className="font-semibold text-lg mb-4">Delivery Details</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Delivery Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">
                    <Clock className="h-4 w-4 inline mr-2" />
                    Delivery Time *
                  </Label>
                  <select
                    id="time"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    required
                  >
                    <option value="">Select time</option>
                    <option value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM</option>
                    <option value="12:00 PM - 3:00 PM">12:00 PM - 3:00 PM</option>
                    <option value="3:00 PM - 6:00 PM">3:00 PM - 6:00 PM</option>
                    <option value="6:00 PM - 9:00 PM">6:00 PM - 9:00 PM</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Delivery Address *
                  </Label>
                  <textarea
                    id="address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your complete delivery address..."
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background resize-none"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <textarea
                    id="instructions"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special delivery instructions..."
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background resize-none"
                    rows={2}
                  />
                </div>
              </div>
            </Card>

            {/* Place Order Button */}
            <Button 
              onClick={handlePlaceOrder}
              className="w-full"
              size="lg"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Place Order via WhatsApp
            </Button>
            
            <div className="text-xs text-center text-muted-foreground">
              Your order will be sent via WhatsApp for confirmation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;