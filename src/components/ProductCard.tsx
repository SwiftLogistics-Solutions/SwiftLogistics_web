import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product }: any) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    addToCart(product);
    
    // Visual feedback
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.quantity < 10 && (
          <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-full font-medium">
            Only {product.quantity} left
          </div>
        )}
        {product.hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            SALE
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            {product.hasDiscount ? (
              <div className="flex flex-col">
                <span className="text-lg text-gray-500 line-through">
                  ${product.originalPrice?.toFixed(2)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-red-600">
                    ${product.discountedPrice?.toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                    {product.discountPercentage}% OFF
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-2xl font-bold text-black">
                ${product.price.toFixed(2)}
              </span>
            )}
            <span className="text-sm text-gray-500">
              {product.quantity} available
            </span>
          </div>
          <div className="text-right">
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize font-medium">
              {product.category}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button 
            onClick={handleAddToCart}
            disabled={isAdding || product.quantity === 0}
            className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Adding...
              </div>
            ) : product.quantity === 0 ? (
              'Out of Stock'
            ) : (
              'Add to Cart'
            )}
          </button>
          {/* <button className="w-full border border-gray-300 text-black py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
            View Details
          </button> */}
        </div>
      </div>
    </div>
  );
};
