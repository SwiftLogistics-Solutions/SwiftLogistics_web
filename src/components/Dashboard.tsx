import React, { useState, useMemo } from 'react';
import { Filter, Grid, List, ShoppingBag } from 'lucide-react';
import { ProductCard } from './ProductCard';

export const Dashboard = ({ searchTerm }: { searchTerm: string }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');

  const categories = ['all', 'handbags', 'totes', 'crossbody', 'backpacks', 'clutches', 'business', 'messenger'];

  const mockProducts = [
    { id: '1', name: 'Premium Leather Handbag', price: 299.99, image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', quantity: 15, category: 'handbags', description: 'Elegant leather handbag perfect for professional settings' },
    { id: '2', name: 'Canvas Tote Bag', price: 49.99, image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg', quantity: 32, category: 'totes', description: 'Versatile canvas tote for everyday use' },
    { id: '3', name: 'Designer Crossbody', price: 189.99, image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', quantity: 8, category: 'crossbody', description: 'Stylish crossbody bag with adjustable strap' },
    { id: '4', name: 'Travel Backpack', price: 129.99, image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg', quantity: 22, category: 'backpacks', description: 'Spacious travel backpack with multiple compartments' },
    { id: '5', name: 'Evening Clutch', price: 89.99, image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', quantity: 12, category: 'clutches', description: 'Elegant evening clutch for special occasions' },
    { id: '6', name: 'Business Portfolio', price: 249.99, image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg', quantity: 6, category: 'business', description: 'Professional portfolio bag for business meetings' },
    { id: '7', name: 'Casual Messenger', price: 79.99, image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg', quantity: 18, category: 'messenger', description: 'Casual messenger bag perfect for daily commute' },
    { id: '8', name: 'Luxury Shoulder Bag', price: 399.99, image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', quantity: 4, category: 'shoulder', description: 'Premium luxury shoulder bag with gold accents' },
  ];

  const filteredProducts = useMemo(() => {
    let filtered = mockProducts;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'quantity': return b.quantity - a.quantity;
        default: return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Premium Bag Collection</h1>
          <p className="text-gray-600">Discover our curated selection of high-quality bags</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
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

            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="quantity">Most Available</option>
              </select>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors duration-200 ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors duration-200 ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {mockProducts.length} bags
            {searchTerm && <span> for "<span className="font-medium text-black">{searchTerm}</span>"</span>}
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
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
      </div>
    </div>
  );
};
