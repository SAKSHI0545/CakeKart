import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Category, useCakes } from '@/hooks/useCakes';
import { 
  Plus, 
  Edit, 
  Trash2, 
  FolderPlus,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';

interface CategoryFormData {
  name: string;
  description: string;
}

const CategoryManagement = () => {
  const { categories, refetch } = useCakes();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Set up real-time subscription for categories
    const channel = supabase
      .channel('category-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
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
      description: ''
    });
    setImageFile(null);
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setIsFormOpen(true);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `categories/${fileName}`;

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
      let imageUrl = editingCategory?.image_url || null;

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

      const categoryData = {
        ...formData,
        image_url: imageUrl
      };

      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);

        if (error) throw error;
        toast.success('Category updated successfully!');
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert([categoryData]);

        if (error) throw error;
        toast.success('Category created successfully!');
      }

      setIsFormOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This will affect all cakes in this category.')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
      toast.success('Category deleted successfully!');
      refetch();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Category Management</h2>
          <p className="text-muted-foreground">Organize your cakes into categories</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Birthday Cakes, Wedding Cakes"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this category"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Category Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                  {(editingCategory?.image_url || imageFile) && (
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">
                        {imageFile ? 'New image selected' : 'Current image'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="card-elegant overflow-hidden">
            {/* Category Image */}
            <div className="relative h-32 bg-gradient-to-br from-primary/10 to-accent/20">
              {category.image_url ? (
                <img 
                  src={category.image_url} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FolderPlus className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Category Details */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(category)}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card className="card-elegant p-8 text-center">
          <FolderPlus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No categories yet</h3>
          <p className="text-muted-foreground mb-4">Create categories to organize your cake catalog.</p>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Category
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CategoryManagement;