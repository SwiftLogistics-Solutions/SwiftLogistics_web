import React, { useState, useMemo, useEffect } from 'react';
import { Filter, ShoppingBag, Gift, ShoppingCart, Loader2 } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  stock: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  originalPrice?: number;
  discountedPrice?: number;
  hasDiscount?: boolean;
  discountPercentage?: number;
  offerCode?: string;
}

export const Dashboard = ({ searchTerm }: { searchTerm: string }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [offers, setOffers] = useState<any[]>([]);

  // Dynamically generate categories from products
  const categories = useMemo(() => {
    if (products.length === 0) return ['all'];
    
    const uniqueCategories = Array.from(new Set(products.map(product => product.category)));
    return ['all', ...uniqueCategories.sort()];
  }, [products]);

  // Function to apply discounts to products
  const applyDiscounts = (products: Product[], offers: any[]) => {
    return products.map(product => {
      // Find applicable active offers
      const applicableOffer = offers.find(offer => 
        offer.status === 'active' && 
        (offer.applicableProducts.includes('All Products') || 
         offer.applicableProducts.includes(product.name) ||
         offer.applicableProducts.includes(product.category))
      );

      if (applicableOffer) {
        let discountedPrice = product.price;
        
        if (applicableOffer.type === 'percentage') {
          discountedPrice = product.price * (1 - applicableOffer.value / 100);
        } else if (applicableOffer.type === 'fixed_amount') {
          discountedPrice = Math.max(0, product.price - applicableOffer.value);
        }

        return {
          ...product,
          originalPrice: product.price,
          discountedPrice: discountedPrice,
          hasDiscount: true,
          discountPercentage: applicableOffer.type === 'percentage' ? applicableOffer.value : Math.round(((product.price - discountedPrice) / product.price) * 100),
          offerCode: applicableOffer.code
        };
      }

      return { ...product, hasDiscount: false };
    });
  };

  // Fetch products and offers from API
  useEffect(() => {
    const fetchProductsAndOffers = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch products
        const productsResponse = await fetch('/product');
        if (!productsResponse.ok) {
          throw new Error(`HTTP error! status: ${productsResponse.status}`);
        }
        const productsData = await productsResponse.json();
        
        // Map API response to match expected format
        const mappedProducts = productsData.products.map((product: any) => ({
          ...product,
          id: product._id, // Map _id to id for consistency
          quantity: product.stock // Map stock to quantity for consistency
        }));

        // Fetch offers
        let offersData = [];
        try {
          const offersResponse = await fetch('/product/offers', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
          if (offersResponse.ok) {
            const rawOffersData = await offersResponse.json();
            const rawOffers = Array.isArray(rawOffersData) ? rawOffersData : (rawOffersData.offers || rawOffersData.data || []);
            
            // Transform offers data
            offersData = rawOffers.map((item: any, index: number) => ({
              id: item.id || `offer-${index}`,
              name: item.name || item.title || 'Unnamed Offer',
              type: (item.type && ['percentage', 'fixed_amount'].includes(item.type)) ? item.type : 'percentage',
              value: typeof item.value === 'number' ? item.value : (item.discount || 0),
              code: item.code || item.couponCode || `CODE${index}`,
              status: (item.status && ['active', 'expired'].includes(item.status)) ? item.status : 'active',
              applicableProducts: Array.isArray(item.applicableProducts) ? item.applicableProducts : 
                                 (Array.isArray(item.applicable_products) ? item.applicable_products : ['All Products'])
            }));
          }
        } catch (offerError) {
          console.log('Could not fetch offers, continuing without discounts');
        }

        setOffers(offersData);
        
        // Apply discounts to products
        const productsWithDiscounts = applyDiscounts(mappedProducts, offersData);
        setProducts(productsWithDiscounts);
        
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndOffers();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((product: Product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product: Product) => product.category === selectedCategory);
    }

    return filtered;
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Premium Bag Collection</h1>
          <p className="text-gray-600">Discover our curated selection of high-quality bags</p>
        </div>

        {/* Filters + Navigation buttons */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            
            {/* Left side - filters */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-black">Category:</span>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 capitalize ${
                      selectedCategory === category
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'All Bags' : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Right side - navigation buttons */}
            <div className="flex items-center space-x-4">
              {/* Order Management button */}
              <button
                onClick={() => navigate('/ordermanagement')}
                className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-colors duration-200"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                My Orders
              </button>

              {/* Promotion button */}
              <button
                onClick={() => navigate('/promotions')}
                className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-colors duration-200"
              >
                <Gift className="h-5 w-5 mr-2" />
                Promotions
              </button>

              {/* Cart button */}
              <button
                onClick={() => navigate('/cart')}
                className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-colors duration-200"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-gray-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Products</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Product count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {products.length} bags
                {searchTerm && <span> for "<span className="font-medium text-black">{searchTerm}</span>"</span>}
              </p>
            </div>

            {/* Product grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product: Product) => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No bags found</h3>
                <p className="text-gray-600">{searchTerm ? 'Try adjusting your search terms or filters' : 'No bags match the selected category'}</p>
                {(searchTerm || selectedCategory !== 'all') && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};