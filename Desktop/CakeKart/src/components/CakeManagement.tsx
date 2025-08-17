import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Cake, Category, useCakes } from '@/hooks/useCakes';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  X,
  Eye,
  Calendar,
  Percent,
  Tag,
  Image as ImageIcon,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface CakeFormData {
  name: string;
  description: string;
  price: number;
  category_id: string;
  ingredients: string[];
  allergens: string[];
  preparation_time: number;
  discount_percentage: number;
  discount_start_date: string;
  discount_end_date: string;
  available: boolean;
}

const CakeManagement = () => {
  const { cakes, categories, loading, refetch } = useCakes();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCake, setEditingCake] = useState<Cake | null>(null);
  const [formData, setFormData] = useState<CakeFormData>({
    name: '',
    description: '',
    price: 0,
    category_id: '',
    ingredients: [],
    allergens: [],
    preparation_time: 60,
    discount_percentage: 0,
    discount_start_date: '',
    discount_end_date: '',
    available: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [ingredientInput, setIngredientInput] = useState('');
  const [allergenInput, setAllergenInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Set up real-time subscription for cakes
    const channel = supabase
      .channel('cake-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cakes'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category_id: '',
      ingredients: [],
      allergens: [],
      preparation_time: 60,
      discount_percentage: 0,
      discount_start_date: '',
      discount_end_date: '',
      available: true
    });
    setImageFile(null);
    setEditingCake(null);
    setIngredientInput('');
    setAllergenInput('');
  };

  const handleEdit = (cake: Cake) => {
    setEditingCake(cake);
    setFormData({
      name: cake.name,
      description: cake.description,
      price: cake.price,
      category_id: cake.category_id || '',
      ingredients: cake.ingredients,
      allergens: cake.allergens,
      preparation_time: cake.preparation_time || 60,
      discount_percentage: (cake as any).discount_percentage || 0,
      discount_start_date: (cake as any).discount_start_date ? new Date((cake as any).discount_start_date).toISOString().split('T')[0] : '',
      discount_end_date: (cake as any).discount_end_date ? new Date((cake as any).discount_end_date).toISOString().split('T')[0] : '',
      available: cake.available
    });
    setIsFormOpen(true);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `cakes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('cake-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('cake-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = editingCake?.image_url || null;

      // Upload new image if provided
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          toast.error('Failed to upload image');
          return;
        }
      }

      const cakeData = {
        ...formData,
        image_url: imageUrl,
        category_id: formData.category_id || null, // Convert empty string to null
        discount_start_date: formData.discount_start_date || null,
        discount_end_date: formData.discount_end_date || null,
      };

      if (editingCake) {
        // Update existing cake
        const { error } = await supabase
          .from('cakes')
          .update(cakeData)
          .eq('id', editingCake.id);

        if (error) throw error;
        toast.success('Cake updated successfully!');
      } else {
        // Create new cake
        const { error } = await supabase
          .from('cakes')
          .insert([cakeData]);

        if (error) throw error;
        toast.success('Cake created successfully!');
      }

      setIsFormOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error('Error saving cake:', error);
      toast.error('Failed to save cake');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cakeId: string) => {
    if (!confirm('Are you sure you want to delete this cake?')) return;

    try {
      const { error } = await supabase
        .from('cakes')
        .delete()
        .eq('id', cakeId);

      if (error) throw error;
      toast.success('Cake deleted successfully!');
      refetch();
    } catch (error) {
      console.error('Error deleting cake:', error);
      toast.error('Failed to delete cake');
    }
  };

  const addIngredient = () => {
    if (ingredientInput.trim() && !formData.ingredients.includes(ingredientInput.trim())) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()]
      }));
      setIngredientInput('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(i => i !== ingredient)
    }));
  };

  const addAllergen = () => {
    if (allergenInput.trim() && !formData.allergens.includes(allergenInput.trim())) {
      setFormData(prev => ({
        ...prev,
        allergens: [...prev.allergens, allergenInput.trim()]
      }));
      setAllergenInput('');
    }
  };

  const removeAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.filter(a => a !== allergen)
    }));
  };

  const calculateDiscountedPrice = (price: number, discountPercentage: number) => {
    return price - (price * discountPercentage / 100);
  };

  const isDiscountActive = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return false;
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  if (loading) {
    return <div className="p-8 text-center">Loading cake management...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Cake Management</h2>
          <p className="text-muted-foreground">Add, edit, and manage your cake catalog</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Cake
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCake ? 'Edit Cake' : 'Add New Cake'}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Cake Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category_id} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  required
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prep-time">Prep Time (minutes)</Label>
                  <Input
                    id="prep-time"
                    type="number"
                    min="15"
                    value={formData.preparation_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, preparation_time: parseInt(e.target.value) || 60 }))}
                  />
                </div>
              </div>

              {/* Discount Date Range */}
              {formData.discount_percentage > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount-start">Discount Start Date</Label>
                    <Input
                      id="discount-start"
                      type="date"
                      value={formData.discount_start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount_start_date: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="discount-end">Discount End Date</Label>
                    <Input
                      id="discount-end"
                      type="date"
                      value={formData.discount_end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount_end_date: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {/* Price Preview */}
              {formData.discount_percentage > 0 && formData.price > 0 && (
                <Card className="p-4 bg-accent/20">
                  <div className="flex items-center gap-2 text-sm">
                    <Percent className="h-4 w-4" />
                    <span>Price Preview:</span>
                    <span className="line-through text-muted-foreground">₹{formData.price}</span>
                    <span className="font-bold text-green-600">
                      ₹{calculateDiscountedPrice(formData.price, formData.discount_percentage).toFixed(2)}
                    </span>
                    <Badge variant="secondary">{formData.discount_percentage}% OFF</Badge>
                  </div>
                </Card>
              )}

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Cake Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                  {(editingCake?.image_url || imageFile) && (
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">
                        {imageFile ? 'New image selected' : 'Current image'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ingredients */}
              <div className="space-y-2">
                <Label>Ingredients</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add ingredient"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                  />
                  <Button type="button" onClick={addIngredient} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.ingredients.map((ingredient) => (
                    <Badge key={ingredient} variant="secondary" className="flex items-center gap-1">
                      {ingredient}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeIngredient(ingredient)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Allergens */}
              <div className="space-y-2">
                <Label>Allergens</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add allergen"
                    value={allergenInput}
                    onChange={(e) => setAllergenInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergen())}
                  />
                  <Button type="button" onClick={addAllergen} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.allergens.map((allergen) => (
                    <Badge key={allergen} variant="destructive" className="flex items-center gap-1">
                      {allergen}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeAllergen(allergen)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Available Toggle */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, available: !!checked }))}
                />
                <Label htmlFor="available">Available for order</Label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : editingCake ? 'Update Cake' : 'Create Cake'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cakes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cakes.map((cake) => {
          const discountActive = isDiscountActive((cake as any).discount_start_date, (cake as any).discount_end_date);
          const discountPercentage = (cake as any).discount_percentage || 0;
          
          return (
            <Card key={cake.id} className="card-elegant overflow-hidden">
              {/* Cake Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/20">
                {cake.image_url ? (
                  <img 
                    src={cake.image_url} 
                    alt={cake.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                
                {/* Discount Badge */}
                {discountPercentage > 0 && discountActive && (
                  <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                    {discountPercentage}% OFF
                  </Badge>
                )}
                
                {/* Status Badge */}
                <Badge 
                  className={`absolute top-2 left-2 ${
                    cake.available ? 'bg-green-500' : 'bg-gray-500'
                  } text-white`}
                >
                  {cake.available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>

              {/* Cake Details */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg truncate">{cake.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{cake.description}</p>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  {discountPercentage > 0 && discountActive ? (
                    <>
                      <span className="text-lg font-bold text-green-600">
                        ₹{calculateDiscountedPrice(cake.price, discountPercentage).toFixed(2)}
                      </span>
                      <span className="text-sm line-through text-muted-foreground">
                        ₹{cake.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold">₹{cake.price}</span>
                  )}
                </div>

                {/* Meta Information */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {cake.preparation_time || 60}min
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {cake.category?.name || 'No category'}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(cake)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(cake.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {cakes.length === 0 && (
        <Card className="card-elegant p-8 text-center">
          <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No cakes yet</h3>
          <p className="text-muted-foreground mb-4">Start building your cake catalog by adding your first cake.</p>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Cake
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CakeManagement;