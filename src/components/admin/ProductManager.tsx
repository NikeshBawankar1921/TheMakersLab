import React, { useState, useEffect } from 'react';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../../firebase/productService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import TextField from '../ui/TextField';

// Import the Product type from productService
import type { Product as ProductType } from '../../firebase/productService';

// Create a local type that extends the imported one for editing
type EditingProduct = Partial<ProductType>;

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form state
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Product type options
  const productTypes = [
    { id: 'component' as const, name: 'Electronic Component' },
    { id: 'project' as const, name: 'Electronics Project' },
    { id: 'course' as const, name: 'Course' }
  ];

  // Categories for each product type
  const categoryOptions = {
    component: [
      { id: 'controllers', name: 'Controllers' },
      { id: 'sensors', name: 'Sensors' },
      { id: 'actuators', name: 'Actuators' },
      { id: 'displays', name: 'Displays' },
      { id: 'basic', name: 'Basic Components' }
    ],
    project: [
      { id: 'robotics', name: 'Robotics' },
      { id: 'iot', name: 'IoT' },
      { id: 'home_automation', name: 'Home Automation' },
      { id: 'educational', name: 'Educational' }
    ],
    course: [
      { id: 'arduino', name: 'Arduino' },
      { id: 'iot', name: 'IoT' },
      { id: 'robotics', name: 'Robotics' },
      { id: 'programming', name: 'Programming' }
    ]
  };

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts);
        console.log("Fetched products:", fetchedProducts);
      } catch (err) {
        setError('Failed to load products. Please refresh the page and try again.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear any previous error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }

    // Special handling for productType - reset category when product type changes
    if (name === 'productType') {
      setEditingProduct(prev => {
        if (!prev) return null;
        
        // Ensure value is a valid product type
        const productType = ['component', 'project', 'course'].includes(value) 
          ? value as 'component' | 'project' | 'course' 
          : 'component';
        
        return { 
          ...prev, 
          productType,
          category: '' // Reset category when product type changes
        };
      });
      return;
    }
    
    if (name === 'stock') {
      setEditingProduct(prev => prev ? ({ ...prev, [name]: parseInt(value) || 0 }) : null);
    } else {
      setEditingProduct(prev => prev ? ({ ...prev, [name]: value }) : null);
    }
  };

  // Start editing a product
  const handleEdit = (product: ProductType) => {
    setFormErrors({});
    setError('');
    setSuccessMessage('');
    setEditingProduct(product);
  };

  // Validate form data
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!editingProduct?.name?.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!editingProduct?.price?.trim()) {
      errors.price = 'Price is required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(editingProduct.price)) {
      errors.price = 'Price must be a valid number';
    }
    
    if (!editingProduct?.productType) {
      errors.productType = 'Product type is required';
    }
    
    if (!editingProduct?.category) {
      errors.category = 'Category is required';
    }
    
    if (!editingProduct?.description?.trim()) {
      errors.description = 'Description is required';
    }
    
    // URL validation is optional since imageUrl can be empty
    if (editingProduct?.imageUrl && !isValidUrl(editingProduct.imageUrl)) {
      errors.imageUrl = 'Please enter a valid URL';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Helper function to validate URLs
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Create or update a product
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!editingProduct) return;
    
    // Validate form data
    if (!validateForm()) {
      setError('Please fix the form errors before saving');
      return;
    }
    
    try {
      setSaveLoading(true);
      console.log("Saving product:", editingProduct);
      
      if (editingProduct.id) {
        // Update existing product
        await updateProduct(editingProduct.id, editingProduct);
        console.log("Updated product with ID:", editingProduct.id);
        
        setProducts(prev => 
          prev.map(p => p.id === editingProduct.id ? { ...p, ...editingProduct } as ProductType : p)
        );
        
        setSuccessMessage(`Product "${editingProduct.name}" updated successfully`);
      } else {
        // Create new product with default product type if not specified
        const productData = {
          name: editingProduct.name || '',
          description: editingProduct.description || '',
          price: editingProduct.price || '',
          category: editingProduct.category || '',
          productType: editingProduct.productType || 'component',
          imageUrl: editingProduct.imageUrl || '', // Use the direct imageUrl
          stock: editingProduct.stock || 0
        } as Omit<ProductType, 'id'>;
        
        console.log("Creating new product with data:", productData);
        const productId = await addProduct(productData);
        console.log('New product created with ID:', productId);
        
        // Fetch updated products
        const updatedProducts = await getAllProducts();
        setProducts(updatedProducts);
        
        setSuccessMessage(`Product "${productData.name}" created successfully`);
      }
      
      setEditingProduct(null);
    } catch (err) {
      console.error('Error saving product:', err);
      setError(
        err instanceof Error 
          ? `Failed to save product: ${err.message}` 
          : 'Failed to save product. Please try again.'
      );
    } finally {
      setSaveLoading(false);
    }
  };

  // Delete a product
  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      setLoading(true);
      setError('');
      await deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      setSuccessMessage('Product deleted successfully');
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get appropriate categories based on selected product type
  const getCategories = () => {
    if (!editingProduct?.productType) return [];
    
    const productType = editingProduct.productType as keyof typeof categoryOptions;
    return categoryOptions[productType] || [];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button onClick={() => {
          setFormErrors({});
          setError('');
          setSuccessMessage('');
          setEditingProduct({
            productType: 'component',
            stock: 0
          });
        }}>Add New Product</Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500 bg-opacity-20 text-red-200 rounded-lg">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-6 p-4 bg-green-500 bg-opacity-20 text-green-200 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Product Edit Form */}
      {editingProduct && (
        <Card className="mb-8 p-6">
          <h3 className="text-xl font-bold mb-4">
            {editingProduct.id ? 'Edit Product' : 'Add New Product'}
          </h3>
          
          <form onSubmit={handleSave} className="space-y-4">
            {/* Product Type Selection */}
            <div className="mb-4">
              <label className="block text-gray-200 mb-2 text-sm font-medium">
                Product Type <span className="text-red-400">*</span>
              </label>
              <select
                name="productType"
                value={editingProduct.productType || ''}
                onChange={handleInputChange}
                className={`bg-primary-light bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300 w-full ${
                  formErrors.productType ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-accent-pink'
                }`}
                required
              >
                <option value="">Select Product Type</option>
                {productTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              {formErrors.productType && (
                <p className="mt-1 text-sm text-red-400">{formErrors.productType}</p>
              )}
            </div>

            <TextField
              label="Product Name"
              name="name"
              value={editingProduct.name || ''}
              onChange={handleInputChange}
              error={formErrors.name}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Price"
                name="price"
                value={editingProduct.price || ''}
                onChange={handleInputChange}
                error={formErrors.price}
                required
              />
              
              <TextField
                label="Stock"
                name="stock"
                type="number"
                value={editingProduct.stock?.toString() || '0'}
                onChange={handleInputChange}
                required
              />
              
              <div className="mb-4">
                <label className="block text-gray-200 mb-2 text-sm font-medium">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  name="category"
                  value={editingProduct.category || ''}
                  onChange={handleInputChange}
                  className={`bg-primary-light bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300 w-full ${
                    formErrors.category ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-accent-pink'
                  }`}
                  required
                  disabled={!editingProduct.productType}
                >
                  <option value="">Select Category</option>
                  {getCategories().map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.category}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-200 mb-2 text-sm font-medium">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={editingProduct.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className={`bg-primary-light bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300 w-full ${
                    formErrors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-accent-pink'
                  }`}
                  required
                ></textarea>
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.description}</p>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-4 mt-4">
              <h4 className="text-lg font-medium mb-3">Image Configuration</h4>
              <p className="text-sm text-gray-300 mb-4">
                Enter the complete URL of the image. You can upload images to any hosting service 
                like ImgBB, Cloudinary, or Imgur and paste the direct image URL here.
              </p>
              
              <TextField
                label="Image URL"
                name="imageUrl"
                value={editingProduct.imageUrl || ''}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                error={formErrors.imageUrl}
              />
              
              {editingProduct.imageUrl && isValidUrl(editingProduct.imageUrl) && (
                <div className="mt-3">
                  <p className="text-sm text-gray-300 mb-2">Image Preview:</p>
                  <div className="w-32 h-32 border border-gray-600 rounded overflow-hidden">
                    <img 
                      src={editingProduct.imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <Button 
                variant="secondary"
                type="button"
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                isLoading={saveLoading}
                disabled={saveLoading}
              >
                Save Product
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Products List */}
      {loading && !editingProduct ? (
        <div className="text-center py-12">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <Card key={product.id} className="flex flex-col">
              <div className="aspect-video bg-primary-light rounded-lg mb-4 overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/product-placeholder.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent-pink/30 to-accent-red/30 flex items-center justify-center">
                    <span className="text-5xl">📦</span>
                  </div>
                )}
              </div>
              
              <div className="mb-1 flex items-center">
                <span className="text-xs px-2 py-1 bg-primary-light rounded-full text-accent-pink mr-2">
                  {productTypes.find(t => t.id === product.productType)?.name || 'Component'}
                </span>
                <span className="text-xs px-2 py-1 bg-primary-light rounded-full text-accent-pink">
                  {product.category}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
              <p className="text-accent-pink mb-2">{product.price}</p>
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>
              
              <div className="mt-auto pt-4 flex justify-between border-t border-gray-700">
                <Button 
                  variant="secondary"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
          
          {products.length === 0 && !loading && (
            <div className="col-span-3 text-center py-12 text-gray-400">
              No products found. Click "Add New Product" to create one.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductManager; 