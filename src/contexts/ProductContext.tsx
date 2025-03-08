import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getAllProducts, 
  getProductsByType,
  Product
} from '../firebase/productService';

interface ProductContextType {
  products: Product[];
  componentProducts: Product[];
  projectProducts: Product[];
  courseProducts: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | null>(null);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [componentProducts, setComponentProducts] = useState<Product[]>([]);
  const [projectProducts, setProjectProducts] = useState<Product[]>([]);
  const [courseProducts, setCourseProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all products
      const allProducts = await getAllProducts();
      setProducts(allProducts);
      
      // Filter products by type
      setComponentProducts(allProducts.filter(product => product.productType === 'component'));
      setProjectProducts(allProducts.filter(product => product.productType === 'project'));
      setCourseProducts(allProducts.filter(product => product.productType === 'course'));
      
      console.log('Products fetched and categorized:', {
        all: allProducts.length,
        components: allProducts.filter(product => product.productType === 'component').length,
        projects: allProducts.filter(product => product.productType === 'project').length,
        courses: allProducts.filter(product => product.productType === 'course').length
      });
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const refreshProducts = async () => {
    return fetchProducts();
  };

  const value = {
    products,
    componentProducts,
    projectProducts,
    courseProducts,
    loading,
    error,
    refreshProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider; 