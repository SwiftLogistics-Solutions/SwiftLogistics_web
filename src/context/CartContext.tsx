import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  hasDiscount?: boolean;
  quantity: number;
  image: string;
  category: string;
  description: string;
  maxStock: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: any) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // If item exists, increase quantity (but don't exceed stock)
        const newQuantity = Math.min(existingItem.quantity + 1, product.quantity || product.stock);
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Check if adding new product would exceed the 5 different products limit
        if (prevItems.length >= 5) {
          alert('Maximum 5 different products allowed per order. Please remove a product to add a different one.');
          return prevItems;
        }
        
        // Add new item to cart - use discounted price if available
        const cartItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.hasDiscount ? product.discountedPrice : product.price,
          originalPrice: product.hasDiscount ? product.originalPrice : undefined,
          hasDiscount: product.hasDiscount || false,
          quantity: 1,
          image: product.image,
          category: product.category,
          description: product.description,
          maxStock: product.quantity || product.stock
        };
        return [...prevItems, cartItem];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = Math.min(quantity, item.maxStock);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const checkout = async () => {
    try {
      // Create order payload
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price, // This already contains the discounted price
          originalPrice: item.originalPrice,
          hasDiscount: item.hasDiscount
        })),
        totalAmount: getTotalPrice(),
        status: 'pending'
      };

      console.log('Processing checkout with data:', orderData);

      // Here you would make the API call to save the order to database
      const response = await fetch('http://localhost:5999/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        console.log('Order saved to database successfully');
        clearCart(); // Clear cart after successful checkout
        return Promise.resolve();
      } else {
        throw new Error('Failed to process checkout');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    checkout
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
