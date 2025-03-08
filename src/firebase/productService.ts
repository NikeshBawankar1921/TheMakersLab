import { database } from './config';
import { ref, set, get, push, update, remove, DatabaseReference, DataSnapshot } from 'firebase/database';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  stock: number;
  productType: 'component' | 'project' | 'course';
}

// Simplified path directly to products collection
const PRODUCTS_REF = 'products';

// Add a new product
export const addProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
  try {
    console.log("Adding product to path:", PRODUCTS_REF);
    const newProductRef = push(ref(database, PRODUCTS_REF));
    const productId = newProductRef.key as string;
    
    console.log("Product data being saved:", { ...product, id: productId });
    await set(newProductRef, {
      id: productId,
      ...product
    });
    
    console.log("Product created successfully with ID:", productId);
    return productId;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Get a product by ID
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const snapshot = await get(ref(database, `${PRODUCTS_REF}/${productId}`));
    if (snapshot.exists()) {
      return snapshot.val() as Product;
    }
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    console.log("Fetching products from path:", PRODUCTS_REF);
    const snapshot = await get(ref(database, PRODUCTS_REF));
    if (snapshot.exists()) {
      const productsObj = snapshot.val();
      // Convert data and ensure productType is set for older entries
      const products = Object.values(productsObj).map((product: any) => ({
        ...product,
        productType: product.productType || 'component' // Default to component for old data
      })) as Product[];
      console.log("Products fetched successfully:", products.length);
      return products;
    }
    console.log("No products found in database");
    return [];
  } catch (error) {
    console.error('Error getting all products:', error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const allProducts = await getAllProducts();
    return allProducts.filter(product => product.category === category);
  } catch (error) {
    console.error('Error getting products by category:', error);
    throw error;
  }
};

// Get products by type
export const getProductsByType = async (productType: 'component' | 'project' | 'course'): Promise<Product[]> => {
  try {
    const allProducts = await getAllProducts();
    return allProducts.filter(product => product.productType === productType);
  } catch (error) {
    console.error('Error getting products by type:', error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (productId: string, updates: Partial<Product>): Promise<void> => {
  try {
    console.log("Updating product at path:", `${PRODUCTS_REF}/${productId}`);
    console.log("Update data:", updates);
    await update(ref(database, `${PRODUCTS_REF}/${productId}`), updates);
    console.log("Product updated successfully:", productId);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Update product image URL
export const updateProductImageUrl = async (productId: string, imageUrl: string): Promise<void> => {
  try {
    console.log("Updating image URL for product:", productId);
    await update(ref(database, `${PRODUCTS_REF}/${productId}`), { imageUrl });
    console.log("Product image URL updated successfully:", productId);
  } catch (error) {
    console.error('Error updating product image:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    console.log("Deleting product with ID:", productId);
    await remove(ref(database, `${PRODUCTS_REF}/${productId}`));
    console.log("Product deleted successfully:", productId);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export default {
  addProduct,
  getProductById,
  getAllProducts,
  getProductsByCategory,
  getProductsByType,
  updateProduct,
  updateProductImageUrl,
  deleteProduct
}; 