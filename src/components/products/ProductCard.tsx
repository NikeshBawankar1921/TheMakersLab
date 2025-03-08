import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { validateImageUrl } from '../../firebase/imageService';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  stock: number;
  onAddToCart?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  category,
  stock,
  onAddToCart
}) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImageUrl = '/images/product-placeholder.jpg';
  
  const handleImageError = () => {
    setImageError(true);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="aspect-square bg-primary-light rounded-lg mb-4 overflow-hidden">
        {!imageError ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent-pink/30 to-accent-red/30 flex items-center justify-center">
            <span className="text-5xl">📦</span>
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{description}</p>
      
      <div className="mt-auto pt-4 flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-white">{price}</span>
          <div className="text-xs text-gray-400 mt-1">
            {stock > 0 ? (
              <span className="text-green-400">In Stock ({stock})</span>
            ) : (
              <span className="text-red-400">Out of Stock</span>
            )}
          </div>
        </div>
        <Button 
          onClick={handleAddToCart}
          disabled={stock === 0}
        >
          {stock > 0 ? 'Add to Cart' : 'Sold Out'}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard; 