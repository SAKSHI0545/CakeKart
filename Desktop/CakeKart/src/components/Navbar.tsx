import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { 
  ShoppingCart, 
  User, 
  Heart, 
  Menu, 
  X, 
  Cake,
  LogIn,
  UserPlus
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-primary p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Cake className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SweetDelights
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/cakes" className="text-foreground hover:text-primary transition-colors font-medium">
              Explore Cakes
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors font-medium">
              About Us
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Cart */}
                <Button
                  variant="elegant"
                  size="icon"
                  className="relative"
                  onClick={() => navigate('/cart')}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Button>

                {/* Favorites */}
                <Button variant="elegant" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>

                {/* User Menu */}
                <div className="relative group">
                  <Button variant="elegant" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                  
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-elegant opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="p-4 border-b border-border">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link to="/profile" className="block px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors">
                        My Profile
                      </Link>
                      <Link to="/orders" className="block px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors">
                        Order History
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin-dashboard" className="block px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors text-accent-foreground">
                          Admin Dashboard
                        </Link>
                      )}
                      <button 
                        onClick={logout}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button variant="default" size="sm" onClick={() => navigate('/signup')}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border/50">
          <div className="px-4 py-6 space-y-4">
            <Link 
              to="/cakes" 
              className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore Cakes
            </Link>
            <Link 
              to="/about" 
              className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;