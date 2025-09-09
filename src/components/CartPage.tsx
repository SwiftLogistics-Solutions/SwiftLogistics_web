import React, { useState } from 'react';
import { Minus, Plus, X, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color: string;
  size: string;
}

function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 1,
            name: "Executive Leather Briefcase",
            price: 299,
            quantity: 1,
            image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400",
            color: "Black",
            size: "Large"
        },
        {
            id: 2,
            name: "Minimalist Crossbody Bag",
            price: 159,
            quantity: 2,
            image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400",
            color: "White",
            size: "Medium"
        },
        {
            id: 3,
            name: "Premium Tote Collection",
            price: 449,
            quantity: 1,
            image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400",
            color: "Black",
            size: "Standard"
        }
    ]);

    const [isLoading, setIsLoading] = useState(false);

    const updateQuantity = (id: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeItem = (id: number) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 25;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

        const navigate = useNavigate();
  
        const handleCheckout = async () => {
            setIsLoading(true);

            // Simulate processing time before connecting to your order page
            setTimeout(() => {
                console.log('Connecting to order page...');
                setIsLoading(false);
                // Navigate to order management page
                navigate('/ordermanagement');
            }, 1000);
        };

const handleshopping = async () => {
            setIsLoading(true);

            // Simulate processing time before connecting to your order page
            setTimeout(() => {
                console.log('Connecting to order page...');
                setIsLoading(false);
                // Navigate to order management page
                navigate('/dashboard');
            }, 1000);
    };
    


        if (cartItems.length === 0) {
            return (
                <div className="min-h-screen bg-white">
                    {/* Header */}
                    <div className="border-b border-gray-200 bg-white">
                        <div className="max-w-6xl mx-auto px-4 py-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-black rounded-full">
                                        <ShoppingBag className="h-6 w-6 text-white" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-black">SwiftLogistics</h1>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <ShoppingBag className="w-5 h-5" />
                                    <span className="text-sm font-medium">Cart (0)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Empty Cart Content */}
                    <div className="max-w-md mx-auto px-4 py-16">
                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-gray-50 rounded-full">
                                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-black mb-4">Your cart is empty</h2>
                            <p className="text-gray-600 mb-8">Discover our premium collection of handcrafted bags</p>
                            <button className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-200">
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-white">
                {/* Header */}
                <div className="border-b border-gray-200 bg-white">
                    <div className="max-w-6xl mx-auto px-4 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-black rounded-full">
                                    <ShoppingBag className="h-6 w-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-black">SwiftLogistics</h1>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                                <ShoppingBag className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                    Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Back Button */}
                    <div className="mb-8">
                        <button className="flex items-center text-gray-600 hover:text-black transition-colors duration-200 font-medium">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Continue Shopping
                        </button>
                    </div>

                    <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-8">
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-black">Shopping Cart</h2>
                                    <p className="text-gray-600 mt-1">Review your selected items</p>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="p-6">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                                    />
                                                </div>
                      
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-bold text-black mb-2">{item.name}</h3>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                                                        <span className="bg-gray-50 px-2 py-1 rounded">Color: {item.color}</span>
                                                        <span className="bg-gray-50 px-2 py-1 rounded">Size: {item.size}</span>
                                                    </div>
                        
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-200"
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                            </button>
                                                            <span className="text-sm font-medium w-8 text-center bg-gray-50 py-1 px-2 rounded">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-200"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        </div>
                          
                                                        <div className="flex items-center space-x-4">
                                                            <span className="text-lg font-bold text-black">
                                                                ${(item.price * item.quantity).toFixed(2)}
                                                            </span>
                                                            <button
                                                                onClick={() => removeItem(item.id)}
                                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-4 mt-8 lg:mt-0">
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sticky top-8">
                                <h3 className="text-lg font-bold text-black mb-6">Order Summary</h3>
              
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="text-black font-medium">${subtotal.toFixed(2)}</span>
                                    </div>
                
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="text-black font-medium">
                                            {shipping === 0 ? (
                                                <span className="text-green-600 font-medium">Free</span>
                                            ) : (
                                                `$${shipping.toFixed(2)}`
                                            )}
                                        </span>
                                    </div>
                
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="text-black font-medium">${tax.toFixed(2)}</span>
                                    </div>
                
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-bold text-black">Total</span>
                                            <span className="text-lg font-bold text-black">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {shipping > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
                                        <p className="text-sm text-gray-600 mb-2">
                                            Add <span className="font-medium text-black">${(500 - subtotal).toFixed(2)}</span> more for free shipping
                                        </p>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-black h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleCheckout}
                                    disabled={isLoading}
                                    className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Processing...
                                        </div>
                                    ) : (
                                        'Proceed to Checkout'
                                    )}
                                </button>
              
                                <button onClick={handleshopping} className="w-full border border-gray-300 text-black py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-200">
                                    Continue Shopping
                                </button>

                                {/* Trust Badges */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="text-xs text-gray-600 space-y-2">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                            <span>Secure checkout with SSL encryption</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                            <span>Free returns within 30 days</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                            <span>Premium customer support</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


export default CartPage;