import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Edit,
  Save,
  X,
  Heart,
  ShoppingBag,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  if (!user) {
    return <div>Please login to view profile</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = () => {
    // In a real app, this would call an API to update user data
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || ''
    });
    setIsEditing(false);
  };

  // Mock user statistics
  const userStats = {
    totalOrders: 12,
    favoriteItems: 5,
    accountAge: '2 years',
    totalSpent: 15640
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="card-elegant">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="default" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <div className="bg-gradient-primary p-6 rounded-full">
                    <User className="h-12 w-12 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <Badge className="mt-2">
                      {user.role === 'admin' ? 'Administrator' : 'Customer'}
                    </Badge>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="pl-10"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="pl-10"
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>
                </div>

                {/* Account Security */}
                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-medium mb-4">Account Security</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Enable 2FA
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Statistics */}
            <Card className="card-elegant">
              <h3 className="text-lg font-semibold mb-4">Account Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <ShoppingBag className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Orders</p>
                      <p className="text-xs text-muted-foreground">All time</p>
                    </div>
                  </div>
                  <span className="font-bold text-lg">{userStats.totalOrders}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Heart className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Favorite Items</p>
                      <p className="text-xs text-muted-foreground">Saved cakes</p>
                    </div>
                  </div>
                  <span className="font-bold text-lg">{userStats.favoriteItems}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Clock className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Member Since</p>
                      <p className="text-xs text-muted-foreground">Account age</p>
                    </div>
                  </div>
                  <span className="font-bold text-lg">{userStats.accountAge}</span>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold text-primary">₹{userStats.totalSpent.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="card-elegant">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  View Order History
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  My Favorites
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  Manage Addresses
                </Button>
              </div>
            </Card>

            {/* Preferences */}
            <Card className="card-elegant">
              <h3 className="text-lg font-semibold mb-4">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Notifications</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SMS Updates</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Marketing Emails</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;