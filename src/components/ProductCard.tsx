import React from 'react';
import { Product } from '../firebase/productService';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';

interface ProductCardProps {
  product: Product;
  showDetailsButton?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showDetailsButton = true }) => {
  // Map product types to more user-friendly labels
  const productTypeLabels = {
    'component': 'Electronic Component',
    'project': 'Project Kit',
    'course': 'Course'
  };

  return (
    <Card className="flex flex-col h-full">
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
      
      <div className="mb-1 flex items-center flex-wrap gap-1">
        <span className="text-xs px-2 py-1 bg-primary-light rounded-full text-accent-pink mr-2">
          {productTypeLabels[product.productType] || 'Product'}
        </span>
        <span className="text-xs px-2 py-1 bg-primary-light rounded-full text-accent-pink">
          {product.category}
        </span>
      </div>
      
      <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
      <p className="text-accent-pink mb-2">₹{product.price}</p>
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>
      
      {showDetailsButton && (
        <div className="mt-auto pt-4 border-t border-gray-700">
          <Link to={`/product/${product.id}`}>
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
};

export default ProductCard; 