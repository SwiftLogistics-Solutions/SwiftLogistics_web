import React, { useState } from 'react';
import { Minus, Plus, X, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext';

function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, getTotalItems, getTotalPrice, checkout, clearCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [isHighPriority, setIsHighPriority] = useState(false);

    const handleUpdateQuantity = (id: string, newQuantity: number) => {
        updateQuantity(id, newQuantity);
    };



    const subtotal = getTotalPrice();
    const shipping: number = 0; // Free shipping for all orders
    const priorityFee = isHighPriority ? 15 : 0; // $15 for high priority
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + priorityFee + tax;

        const navigate = useNavigate();
  
        const handleCheckout = async () => {
            setIsLoading(true);

            try {
                // Generate a unique order ID
                const orderID = `O${Date.now()}`;
                
                // Get customer ID from localStorage (assuming it was stored during login)
                const userData = localStorage.getItem('userData');
                let customerId = null;

                if (userData) {
                    try {
                        const user = JSON.parse(userData);
                        customerId = user.customer_id || user.uid || user.id;
                    } catch (parseError) {
                        console.error('Error parsing user data:', parseError);
                    }
                }

                if (!customerId) {
                    alert('Customer ID not found. Please log in again.');
                    return;
                }

                // Create order payload
                const orderPayload = {
                    orderID: orderID,
                    customer_id: customerId,
                    totalAmount: total,
                    itemsCount: cartItems.length,
                    priority: isHighPriority ? "high" : "low",
                    items: cartItems.map(item => ({
                        product_id: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price
                    }))
                };

                console.log('Sending order to API:', orderPayload);

                // Call the new order API
                const response = await fetch('/neworder', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },
                    body: JSON.stringify(orderPayload)
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Order created successfully:', result);
                    
                    // Decrement product stock for each ordered item
                    for (const item of cartItems) {
                        try {
                            const decrementResponse = await fetch('/product/decrement-count', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    productId: item.id,
                                    quantity: item.quantity
                                })
                            });
                            
                            if (!decrementResponse.ok) {
                                console.error(`Failed to decrement stock for product ${item.id}`);
                            }
                        } catch (error) {
                            console.error(`Error decrementing stock for product ${item.id}:`, error);
                        }
                    }
                    
                    // Clear cart after successful order
                    clearCart();
                    
                    // Navigate to order management page
                    navigate('/ordermanagement');
                } else {
                    const errorData = await response.json();
                    console.error('Failed to create order:', errorData);
                    alert('Failed to process order. Please try again.');
                }
            } catch (error) {
                console.error('Checkout error:', error);
                alert('An error occurred during checkout. Please try again.');
            } finally {
                setIsLoading(false);
            }
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
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-200"
                            >
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
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center text-gray-600 hover:text-black transition-colors duration-200 font-medium"
                        >
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
                                    <div className="flex items-center justify-between mt-1">
                                        <p className="text-gray-600">Review your selected items</p>
                                        <div className="flex items-center space-x-2">
                                            <span className={`text-sm px-2 py-1 rounded-full ${
                                                cartItems.length >= 5 
                                                    ? 'bg-red-100 text-red-700' 
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {cartItems.length}/5 products
                                            </span>
                                        </div>
                                    </div>
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
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <h3 className="text-lg font-bold text-black">{item.name}</h3>
                                                        {item.hasDiscount && (
                                                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                                                SALE
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                                                        <span className="bg-gray-50 px-2 py-1 rounded">Category: {item.category}</span>
                                                        <span className="bg-gray-50 px-2 py-1 rounded">In Stock: {item.maxStock}</span>
                                                        {item.hasDiscount && item.originalPrice && (
                                                            <span className="bg-green-50 px-2 py-1 rounded text-green-700">
                                                                Save ${((item.originalPrice - item.price) * item.quantity).toFixed(2)}
                                                            </span>
                                                        )}
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
                                                            <div className="text-right">
                                                                {item.hasDiscount && item.originalPrice ? (
                                                                    <div className="space-y-1">
                                                                        <div className="text-sm text-gray-500 line-through">
                                                                            ${(item.originalPrice * item.quantity).toFixed(2)}
                                                                        </div>
                                                                        <div className="text-lg font-bold text-red-600">
                                                                            ${(item.price * item.quantity).toFixed(2)}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-lg font-bold text-black">
                                                                        ${(item.price * item.quantity).toFixed(2)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <button
                                                                onClick={() => removeFromCart(item.id)}
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

                                    {/* Total Savings Display */}
                                    {(() => {
                                        const totalSavings = cartItems.reduce((total, item) => {
                                            if (item.hasDiscount && item.originalPrice) {
                                                return total + ((item.originalPrice - item.price) * item.quantity);
                                            }
                                            return total;
                                        }, 0);
                                        
                                        return totalSavings > 0 ? (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-green-600">Total Savings</span>
                                                <span className="text-green-600 font-medium">-${totalSavings.toFixed(2)}</span>
                                            </div>
                                        ) : null;
                                    })()}
                
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="text-black font-medium">Free</span>
                                    </div>

                                    {isHighPriority && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Priority Processing</span>
                                            <span className="text-black font-medium">${priorityFee.toFixed(2)}</span>
                                        </div>
                                    )}
                
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

                                {/* Cart Limit Warning */}
                                {(() => {
                                    const totalProducts = cartItems.length;
                                    if (totalProducts >= 5) {
                                        return (
                                            <div className="bg-red-50 p-3 rounded-lg mb-4 border border-red-200">
                                                <p className="text-red-700 text-sm font-medium">⚠️ Maximum product limit reached (5 products)</p>
                                                <p className="text-red-600 text-xs mt-1">Remove a product to add a different one</p>
                                            </div>
                                        );
                                    } else if (totalProducts >= 4) {
                                        return (
                                            <div className="bg-yellow-50 p-3 rounded-lg mb-4 border border-yellow-200">
                                                <p className="text-yellow-700 text-sm font-medium">⚠️ Almost at limit ({totalProducts}/5 products)</p>
                                                <p className="text-yellow-600 text-xs mt-1">You can add {5 - totalProducts} more product(s)</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}

                                {/* Priority Selection */}
                                <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium text-black">High Priority Processing</h4>
                                            <p className="text-xs text-gray-600">Get your order processed within 24 hours (+$15)</p>
                                        </div>
                                        <button
                                            onClick={() => setIsHighPriority(!isHighPriority)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                                                isHighPriority ? 'bg-black' : 'bg-gray-300'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                                    isHighPriority ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>

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