import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Eye,
  MessageCircle 
} from 'lucide-react';
import { Cake } from '@/hooks/useCakes';

// Import images
import chocolateTruffleCake from '@/assets/chocolate-truffle-cake.jpg';
import redVelvetCake from '@/assets/red-velvet-cake.jpg';
import strawberryDreamCake from '@/assets/strawberry-dream-cake.jpg';
import mangoBlissCake from '@/assets/mango-bliss-cake.jpg';

interface CakeCardProps {
  cake: Cake;
  onAddToCart?: (cakeId: string) => void;
  onQuickView?: (cakeId: string) => void;
  onWhatsAppOrder?: (cakeId: string) => void;
  user?: any;
}

const CakeCard = ({ 
  cake, 
  onAddToCart, 
  onQuickView, 
  onWhatsAppOrder,
  user 
}: CakeCardProps) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      // Redirect to login
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    try {
      await onAddToCart?.(cake.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToFavorites = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsFavorite(!isFavorite);
    // Add to cart when clicking heart
    handleAddToCart();
  };

  console.log('CakeCard rendering:', cake.name, 'with image:', cake.image_url); // Debug log

  const handleWhatsAppOrder = () => {
    const message = `Hi! I'd like to order the ${cake.name} for ₹${cake.price}. Please let me know the availability and delivery details.`;
    const whatsappUrl = `https://wa.me/918888888888?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onWhatsAppOrder?.(cake.id);
  };

  // Helper function to get the correct image URL
  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return '/placeholder.svg';
    
    // If it's a full Supabase storage URL, return it directly
    if (imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Map the database image names to imported images (for old static images)
    const imageMap: { [key: string]: string } = {
      'chocolate-truffle-cake.jpg': chocolateTruffleCake,
      'red-velvet-cake.jpg': redVelvetCake,
      'strawberry-dream-cake.jpg': strawberryDreamCake,
      'mango-bliss-cake.jpg': mangoBlissCake,
    };
    
    return imageMap[imageUrl] || '/placeholder.svg';
  };

  return (
    <Card className="card-product group">
      <div className="relative overflow-hidden">
        {/* Image */}
        <img 
          src={getImageUrl(cake.image_url)} 
          alt={cake.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        
        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
          <Button
            variant="secondary"
            size="icon"
            className="bg-background/90 hover:bg-background"
            onClick={() => onQuickView?.(cake.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            className="bg-background/90 hover:bg-background"
            onClick={handleAddToFavorites}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {new Date(cake.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
            <Badge className="bg-accent text-accent-foreground">New</Badge>
          )}
          {cake.review_count > 100 && (
            <Badge className="bg-primary text-primary-foreground">Bestseller</Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <div className="text-xs text-muted-foreground uppercase tracking-wider">
          {cake.category?.name || 'Uncategorized'}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
          {cake.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {cake.description}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-2">
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
            <span className="text-sm font-medium ml-1">{cake.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({cake.review_count} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">
            ₹{cake.price}
          </span>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          {user ? (
            <Button 
              className="flex-1" 
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isLoading ? 'Adding...' : 'Add to Cart'}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleWhatsAppOrder}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Order via WhatsApp
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CakeCard;