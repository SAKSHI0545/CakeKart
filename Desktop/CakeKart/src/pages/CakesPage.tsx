import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CakeCard from '@/components/CakeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useCakes } from '@/hooks/useCakes';
import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  Grid3X3,
  List,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const CakesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { cakes, categories: dbCategories, loading, error } = useCakes();
  const navigate = useNavigate();

  // Transform database categories for UI
  const categories = useMemo(() => {
    if (loading || !dbCategories.length) {
      return [{ id: 'all', name: 'All Cakes', count: 0 }];
    }
    
    return [
      { id: 'all', name: 'All Cakes', count: cakes.length },
      ...dbCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        count: cakes.filter(cake => cake.category_id === cat.id).length
      }))
    ];
  }, [dbCategories, cakes, loading]);

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: '0-500', name: 'Under ₹500' },
    { id: '500-1000', name: '₹500 - ₹1000' },
    { id: '1000-1500', name: '₹1000 - ₹1500' },
    { id: '1500+', name: 'Above ₹1500' }
  ];

  const sortOptions = [
    { id: 'popular', name: 'Most Popular' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'newest', name: 'Newest First' }
  ];

  const filteredCakes = useMemo(() => {
    let filtered = cakes;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(cake =>
        cake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cake.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cake.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(cake => cake.category_id === selectedCategory);
    }

    // Price filter
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(p => 
        p.includes('+') ? Infinity : parseInt(p)
      );
      filtered = filtered.filter(cake => {
        const price = cake.price * 100; // Convert to paise for comparison
        if (priceRange === '1500+') return price >= 150000;
        return price >= min * 100 && price <= max * 100;
      });
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default: // popular
        filtered.sort((a, b) => b.review_count - a.review_count);
    }

    return filtered;
  }, [cakes, searchTerm, selectedCategory, priceRange, sortBy]);

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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading delicious cakes...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <Card className="card-elegant text-center max-w-md">
          <p className="text-destructive mb-4">Failed to load cakes: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Our <span className="text-primary">Delicious Cakes</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover the perfect cake for every occasion
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <Card className="card-elegant">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="h-5 w-5" />
                <h3 className="font-semibold">Filters</h3>
              </div>

              {/* Search */}
              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search cakes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Separator className="my-4" />

              {/* Categories */}
              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium">Category</label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <Badge variant="secondary" className="ml-2">
                          {category.count}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range</label>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setPriceRange(range.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        priceRange === range.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                    >
                      {range.name}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Showing {filteredCakes.length} of {cakes.length} cakes
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="flex border border-border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results */}
            {filteredCakes.length === 0 ? (
              <Card className="card-elegant text-center py-12">
                <p className="text-muted-foreground">No cakes found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setPriceRange('all');
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredCakes.map((cake) => (
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
        </div>
      </div>
    </div>
  );
};

export default CakesPage;