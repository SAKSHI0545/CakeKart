import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SplineBackground from '@/components/SplineBackground';
import Hero from '@/components/Hero';
import CakeCard from '@/components/CakeCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useCakes } from '@/hooks/useCakes';
import { 
  ArrowRight, 
  Star, 
  Gift, 
  Clock, 
  Shield,
  Truck,
  Award,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { cakes, loading, error } = useCakes();

  // Get featured cakes from database (top 4 by rating)
  const featuredCakes = cakes.slice(0, 4);

  const handleAddToCart = (cakeId: string) => {
    const cake = cakes.find(c => c.id === cakeId);
    if (cake) {
      const cartItem = {
        id: cake.id,
        cakeId: cake.id,
        name: cake.name,
        price: cake.price,
        image: cake.image_url || '/placeholder.svg',
        quantity: 1
      };
      addToCart(cartItem);
      toast.success(`${cake.name} added to cart!`);
    }
  };

  const handleQuickView = (cakeId: string) => {
    navigate(`/cakes/${cakeId}`);
  };

  const handleWhatsAppOrder = (cakeId: string) => {
    const cake = cakes.find(c => c.id === cakeId);
    if (cake) {
      toast.success('Redirecting to WhatsApp...');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Spline Background */}
      <SplineBackground />
      
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="content-overlay py-20 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-primary">Sweet Delights?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're committed to delivering the finest cakes with exceptional service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8" />,
                title: 'Premium Quality',
                description: 'Made with finest ingredients and traditional recipes'
              },
              {
                icon: <Truck className="h-8 w-8" />,
                title: 'Fast Delivery',
                description: 'Same-day delivery available in select areas'
              },
              {
                icon: <Gift className="h-8 w-8" />,
                title: 'Custom Designs',
                description: 'Personalized cakes for your special occasions'
              },
              {
                icon: <Award className="h-8 w-8" />,
                title: 'Award Winning',
                description: 'Recognized for excellence in taste and presentation'
              }
            ].map((feature, index) => (
              <Card key={index} className="card-elegant text-center group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-primary p-3 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-primary-foreground">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cakes Section */}
      <section className="content-overlay py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured <span className="text-primary">Cakes</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Our most loved cakes, handpicked for you
              </p>
            </div>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/cakes')}
              className="mt-6 md:mt-0"
            >
              View All Cakes
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Failed to load featured cakes</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCakes.map((cake) => (
                <CakeCard
                  key={cake.id}
                  cake={cake}
                  onAddToCart={handleAddToCart}
                  onQuickView={handleQuickView}
                  onWhatsAppOrder={handleWhatsAppOrder}
                  user={user}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="content-overlay py-20 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-accent text-accent-foreground mb-4">
                <Clock className="h-4 w-4 mr-2" />
                Limited Time Offer
              </Badge>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Get <span className="text-accent">20% OFF</span><br />
                on your first order!
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8">
                New to Sweet Delights? Enjoy a special discount on your first cake order. 
                Use code <strong>WELCOME20</strong> at checkout.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => navigate('/cakes')}
                >
                  Order Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up Free
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <Card className="card-elegant p-8 text-center">
                <div className="bg-gradient-primary p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Gift className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-4">Special Birthday Package</h3>
                <p className="text-muted-foreground mb-6">
                  Cake + Decorations + Free Delivery
                </p>
                <div className="text-3xl font-bold text-primary mb-2">₹1,299</div>
                <p className="text-sm text-muted-foreground line-through">₹1,599</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="content-overlay py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our <span className="text-primary">Customers Say</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Over 10,000 happy customers and counting!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                review: 'Absolutely delicious cakes! The chocolate truffle was a hit at my daughter\'s birthday party.',
                rating: 5,
                image: '/api/placeholder/60/60'
              },
              {
                name: 'Raj Patel',
                review: 'Best delivery service in the city. Fresh cakes delivered right on time, every time.',
                rating: 5,
                image: '/api/placeholder/60/60'
              },
              {
                name: 'Anita Gupta',
                review: 'The custom design exceeded our expectations. Perfect for our anniversary celebration!',
                rating: 5,
                image: '/api/placeholder/60/60'
              }
            ].map((testimonial, index) => (
              <Card key={index} className="card-elegant text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.review}"
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">Verified Customer</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="content-overlay py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Order Your Perfect Cake?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8">
            Browse our extensive collection or contact us for custom orders
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="hero"
              onClick={() => navigate('/cakes')}
            >
              Browse Cakes
            </Button>
            <Button 
              variant="outline" 
              size="hero"
              className="border-white text-white hover:bg-white hover:text-primary"
              onClick={() => navigate('/contact')}
            >
              Custom Order
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;