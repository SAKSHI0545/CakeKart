import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  ShoppingCart, 
  MessageCircle,
  Plus,
  Minus,
  Cake,
  Clock,
  Truck
} from 'lucide-react';
import { toast } from 'sonner';
import chocolateTruffleImage from '@/assets/chocolate-truffle-cake.jpg';
import strawberryDreamImage from '@/assets/strawberry-dream-cake.jpg';
import redVelvetImage from '@/assets/red-velvet-cake.jpg';
import mangoBlissImage from '@/assets/mango-bliss-cake.jpg';

const CakeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('1kg');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('original');
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock cake data - in real app this would come from API
  const cakes = [
    {
      id: '1',
      name: 'Chocolate Truffle Delight',
      price: 899,
      originalPrice: 1099,
      image: chocolateTruffleImage,
      rating: 4.9,
      reviewCount: 156,
      category: 'Chocolate',
      isNew: true,
      isBestseller: true,
      description: 'Rich chocolate truffle cake with Belgian cocoa and fresh cream layers',
      longDescription: 'Indulge in our signature Chocolate Truffle Delight, a masterpiece of Belgian chocolate artistry. This decadent cake features layers of moist chocolate sponge infused with premium cocoa, alternating with silky smooth chocolate truffle cream. Each bite delivers an intense chocolate experience that melts in your mouth, finished with a glossy chocolate ganache and delicate chocolate shavings.',
      ingredients: ['Belgian Dark Chocolate', 'Fresh Cream', 'Cocoa Powder', 'Vanilla Extract', 'Farm Fresh Eggs', 'Premium Butter'],
      allergens: ['Eggs', 'Dairy', 'Gluten'],
      availableSizes: [
        { size: '500g', price: 599, serves: '4-6 people' },
        { size: '1kg', price: 899, serves: '8-10 people' },
        { size: '1.5kg', price: 1299, serves: '12-15 people' },
        { size: '2kg', price: 1699, serves: '16-20 people' }
      ],
      flavors: [
        { id: 'original', name: 'Original Chocolate', price: 0 },
        { id: 'dark', name: 'Extra Dark Chocolate', price: 50 },
        { id: 'white', name: 'White Chocolate', price: 50 }
      ]
    }
  ];

  const cake = cakes.find(c => c.id === id);

  useEffect(() => {
    if (!cake) {
      navigate('/cakes');
    }
  }, [cake, navigate]);

  if (!cake) {
    return null;
  }

  const selectedSizeData = cake.availableSizes.find(s => s.size === selectedSize);
  const selectedFlavorData = cake.flavors.find(f => f.id === selectedFlavor);
  const totalPrice = (selectedSizeData?.price || cake.price) + (selectedFlavorData?.price || 0);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    const customizations = {
      size: selectedSize,
      flavor: selectedFlavorData?.name,
      message: customMessage
    };

    addToCart({
      ...cake,
      price: totalPrice
    }, quantity, customizations);

    toast.success(`${cake.name} added to cart!`);
  };

  const handleWhatsAppOrder = () => {
    const orderDetails = `
🎂 *Cake Order Details*

*Cake:* ${cake.name}
*Size:* ${selectedSize} (${selectedSizeData?.serves})
*Flavor:* ${selectedFlavorData?.name}
*Quantity:* ${quantity}
*Total Price:* ₹${totalPrice * quantity}
${customMessage ? `*Custom Message:* ${customMessage}` : ''}

I'd like to place this order. Please confirm availability and delivery details.`;

    const whatsappUrl = `https://wa.me/918888888888?text=${encodeURIComponent(orderDetails)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/cakes')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cakes
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl">
              <img 
                src={cake.image} 
                alt={cake.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {cake.isNew && (
                  <Badge className="bg-accent text-accent-foreground">New</Badge>
                )}
                {cake.isBestseller && (
                  <Badge className="bg-primary text-primary-foreground">Bestseller</Badge>
                )}
                {cake.originalPrice && (
                  <Badge variant="destructive">
                    {Math.round(((cake.originalPrice - cake.price) / cake.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>

              {/* Favorite Button */}
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 right-4 bg-background/90 hover:bg-background"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
              </Button>
            </div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="card-elegant text-center py-4">
                <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs font-medium">Fresh Baked</p>
                <p className="text-xs text-muted-foreground">Daily</p>
              </Card>
              <Card className="card-elegant text-center py-4">
                <Truck className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs font-medium">Free Delivery</p>
                <p className="text-xs text-muted-foreground">Above ₹999</p>
              </Card>
              <Card className="card-elegant text-center py-4">
                <Cake className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs font-medium">Custom Design</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </Card>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                {cake.category}
              </div>
              <h1 className="text-3xl font-bold mb-4">{cake.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < Math.floor(cake.rating) 
                          ? 'fill-accent text-accent' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  ))}
                  <span className="text-sm font-medium ml-2">{cake.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({cake.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-primary">
                  ₹{totalPrice}
                </span>
                {cake.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{cake.originalPrice}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {cake.longDescription}
              </p>
            </div>

            <Separator />

            {/* Customization Options */}
            <div className="space-y-6">
              {/* Size Selection */}
              <div>
                <Label className="text-base font-medium">Choose Size</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {cake.availableSizes.map((size) => (
                    <button
                      key={size.size}
                      onClick={() => setSelectedSize(size.size)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        selectedSize === size.size
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="font-medium">{size.size}</div>
                      <div className="text-sm text-muted-foreground">{size.serves}</div>
                      <div className="text-sm font-medium">₹{size.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Flavor Selection */}
              <div>
                <Label className="text-base font-medium">Choose Flavor</Label>
                <div className="space-y-2 mt-3">
                  {cake.flavors.map((flavor) => (
                    <button
                      key={flavor.id}
                      onClick={() => setSelectedFlavor(flavor.id)}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        selectedFlavor === flavor.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{flavor.name}</span>
                        {flavor.price > 0 && (
                          <span className="text-sm">+₹{flavor.price}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Message */}
              <div>
                <Label htmlFor="message" className="text-base font-medium">
                  Custom Message (Optional)
                </Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal message for the cake..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="mt-3"
                  rows={3}
                />
              </div>

              {/* Quantity */}
              <div>
                <Label className="text-base font-medium">Quantity</Label>
                <div className="flex items-center space-x-3 mt-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-medium text-lg px-4">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                {user ? (
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-1"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart - ₹{totalPrice * quantity}
                  </Button>
                ) : (
                  <Button 
                    onClick={() => navigate('/login')}
                    className="flex-1"
                  >
                    Login to Add to Cart
                  </Button>
                )}
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleWhatsAppOrder}
                className="w-full"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Order via WhatsApp
              </Button>
            </div>

            {/* Additional Information */}
            <Card className="card-elegant">
              <h3 className="font-semibold mb-3">Ingredients</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {cake.ingredients.map((ingredient, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {ingredient}
                  </Badge>
                ))}
              </div>
              
              <h3 className="font-semibold mb-3">Allergen Information</h3>
              <div className="flex flex-wrap gap-2">
                {cake.allergens.map((allergen, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    Contains {allergen}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CakeDetailPage;