import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Users, 
  Award,
  Clock,
  Cake,
  Star,
  Gift,
  ChefHat
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="bg-gradient-primary text-primary-foreground mb-4">
            <Heart className="h-4 w-4 mr-2" />
            About Sweet Delights
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="text-primary">Sweet Story</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            For over a decade, Sweet Delights has been crafting extraordinary cakes that bring joy to life's most precious moments. 
            Every cake tells a story, and we're honored to be part of yours.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6">From Passion to Perfection</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Sweet Delights began in 2010 with a simple dream: to create cakes that not only taste incredible 
                but also create unforgettable memories. Our founder, Chef Priya Sharma, started this journey in 
                her home kitchen with just a passion for baking and a commitment to quality.
              </p>
              <p>
                What started as a small home-based business has grown into one of India's most trusted cake brands, 
                serving over 10,000 happy customers and creating more than 50,000 delicious memories.
              </p>
              <p>
                Today, we continue to handcraft each cake with the same love and attention to detail that 
                made us who we are. Every ingredient is carefully selected, every design thoughtfully created, 
                and every cake baked fresh to order.
              </p>
            </div>
          </div>
          <div className="relative">
            <Card className="card-elegant p-8">
              <div className="text-center">
                <div className="bg-gradient-primary p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <ChefHat className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Chef Priya Sharma</h3>
                <p className="text-primary font-medium mb-4">Founder & Head Baker</p>
                <p className="text-sm text-muted-foreground">
                  "Every cake is a canvas for creativity and a vessel for love. 
                  We don't just bake cakes; we craft experiences."
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Heart className="h-8 w-8" />,
                title: 'Made with Love',
                description: 'Every cake is crafted with passion and care, ensuring each bite is filled with love.'
              },
              {
                icon: <Award className="h-8 w-8" />,
                title: 'Premium Quality',
                description: 'We use only the finest ingredients sourced from trusted suppliers worldwide.'
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: 'Fresh & Timely',
                description: 'All cakes are baked fresh to order and delivered right on time, every time.'
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: 'Customer First',
                description: 'Your satisfaction is our priority. We go above and beyond to exceed expectations.'
              }
            ].map((value, index) => (
              <Card key={index} className="card-elegant text-center group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-primary p-3 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-primary-foreground">
                    {value.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            { number: '10,000+', label: 'Happy Customers', icon: <Users className="h-6 w-6" /> },
            { number: '50,000+', label: 'Cakes Delivered', icon: <Cake className="h-6 w-6" /> },
            { number: '4.9/5', label: 'Average Rating', icon: <Star className="h-6 w-6" /> },
            { number: '12+', label: 'Years Experience', icon: <Award className="h-6 w-6" /> }
          ].map((stat, index) => (
            <Card key={index} className="card-elegant text-center">
              <div className="bg-accent/20 p-2 rounded-full w-fit mx-auto mb-3">
                <div className="text-accent">
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-primary mb-1">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Mission Section */}
        <Card className="card-elegant text-center p-12 bg-gradient-hero">
          <div className="max-w-3xl mx-auto">
            <Gift className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To create extraordinary cakes that bring families together, celebrate life's special moments, 
              and spread joy one slice at a time. We believe that every celebration deserves a perfect cake, 
              and every cake should be a work of art that tastes as amazing as it looks.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;