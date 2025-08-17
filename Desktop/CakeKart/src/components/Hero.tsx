import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Star, 
  Users, 
  Award,
  Sparkles
} from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Content */}
      <div className="content-overlay max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="flex justify-center">
            <Badge className="bg-gradient-primary text-primary-foreground px-4 py-2 text-sm font-medium animate-bounce-soft">
              <Sparkles className="h-4 w-4 mr-2" />
              Premium Handcrafted Cakes
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Sweet Delights
              </span>
              <br />
              <span className="text-foreground">
                Delivered with Love
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience the magic of handcrafted cakes made with premium ingredients. 
              From birthdays to celebrations, we create memories one slice at a time.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 py-8">
            <div className="flex items-center space-x-2 text-sm">
              <div className="bg-accent/20 p-2 rounded-full">
                <Star className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="font-semibold">4.9/5 Rating</div>
                <div className="text-muted-foreground">From 2000+ reviews</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <div className="bg-primary/20 p-2 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold">10,000+</div>
                <div className="text-muted-foreground">Happy customers</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <div className="bg-accent/20 p-2 rounded-full">
                <Award className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="font-semibold">Same Day</div>
                <div className="text-muted-foreground">Delivery available</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              variant="hero" 
              size="hero"
              onClick={() => navigate('/cakes')}
              className="min-w-[200px]"
            >
              Explore Cakes
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button 
              variant="elegant" 
              size="lg"
              onClick={() => navigate('/about')}
              className="min-w-[200px]"
            >
              Our Story
            </Button>
          </div>

          {/* Additional Info */}
          <div className="pt-8 text-sm text-muted-foreground">
            <p>✨ Free delivery on orders above ₹999 • 🎂 Custom designs available • 📱 Easy WhatsApp ordering</p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float hidden lg:block"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-bounce-soft hidden lg:block"></div>
      <div className="absolute top-1/2 left-5 w-16 h-16 bg-primary/5 rounded-full blur-lg animate-pulse hidden md:block"></div>
    </section>
  );
};

export default Hero;