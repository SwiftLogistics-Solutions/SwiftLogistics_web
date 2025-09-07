import React, { useState, useEffect } from 'react';
import { 
  Percent, 
  Calendar, 
  Clock, 
  Tag, 
  Gift, 
  Star, 
  TrendingUp,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  ShoppingBag,
  DollarSign
} from 'lucide-react';

// Types
type PromotionType = 'percentage' | 'fixed_amount' | 'buy_one_get_one' | 'free_shipping';
type PromotionStatus = 'active' | 'scheduled' | 'expired' | 'paused';

interface Promotion {
  id: string;
  name: string;
  description: string;
  type: PromotionType;
  value: number; // percentage or fixed amount
  code: string;
  startDate: string;
  endDate: string;
  status: PromotionStatus;
  usageCount: number;
  usageLimit?: number;
  minimumOrderAmount?: number;
  applicableProducts: string[];
  createdDate: string;
}

// Mock Data
const mockPromotions: Promotion[] = [
  {
    id: '1',
    name: 'New Year Sale',
    description: 'Start the year with amazing savings on premium bags',
    type: 'percentage',
    value: 25,
    code: 'NEWYEAR25',
    startDate: '2025-01-01T00:00:00Z',
    endDate: '2025-01-31T23:59:59Z',
    status: 'active',
    usageCount: 156,
    usageLimit: 500,
    minimumOrderAmount: 100,
    applicableProducts: ['Premium Business Briefcase', 'Executive Briefcase Set'],
    createdDate: '2024-12-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Student Discount',
    description: 'Special discount for students on backpacks and laptop bags',
    type: 'percentage',
    value: 15,
    code: 'STUDENT15',
    startDate: '2025-01-01T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    status: 'active',
    usageCount: 89,
    usageLimit: 1000,
    minimumOrderAmount: 50,
    applicableProducts: ['Travel Backpack Pro', 'Leather Laptop Bag'],
    createdDate: '2024-12-01T09:00:00Z'
  },
  {
    id: '3',
    name: 'Free Shipping Weekend',
    description: 'Free shipping on all orders this weekend',
    type: 'free_shipping',
    value: 0,
    code: 'FREESHIP',
    startDate: '2025-01-11T00:00:00Z',
    endDate: '2025-01-12T23:59:59Z',
    status: 'scheduled',
    usageCount: 0,
    usageLimit: 200,
    minimumOrderAmount: 75,
    applicableProducts: ['All Products'],
    createdDate: '2025-01-05T14:30:00Z'
  },
  {
    id: '4',
    name: 'Buy 2 Get 1 Free',
    description: 'Buy any 2 sports bags and get the third one free',
    type: 'buy_one_get_one',
    value: 100,
    code: 'BUY2GET1',
    startDate: '2025-01-15T00:00:00Z',
    endDate: '2025-01-22T23:59:59Z',
    status: 'scheduled',
    usageCount: 0,
    usageLimit: 100,
    minimumOrderAmount: 150,
    applicableProducts: ['Sports Duffel Bag', 'Gym Equipment Bag'],
    createdDate: '2025-01-08T11:15:00Z'
  },
  {
    id: '5',
    name: 'Holiday Special',
    description: 'Holiday season special discount on designer bags',
    type: 'fixed_amount',
    value: 50,
    code: 'HOLIDAY50',
    startDate: '2024-12-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    status: 'expired',
    usageCount: 234,
    usageLimit: 300,
    minimumOrderAmount: 200,
    applicableProducts: ['Designer Handbag Collection'],
    createdDate: '2024-11-15T16:45:00Z'
  },
  {
    id: '6',
    name: 'Flash Sale',
    description: '48-hour flash sale on selected items',
    type: 'percentage',
    value: 30,
    code: 'FLASH30',
    startDate: '2025-01-20T00:00:00Z',
    endDate: '2025-01-22T00:00:00Z',
    status: 'paused',
    usageCount: 45,
    usageLimit: 150,
    minimumOrderAmount: 80,
    applicableProducts: ['Travel Backpack Pro', 'Sports Duffel Bag'],
    createdDate: '2025-01-18T08:20:00Z'
  }
];

export const PromotionsPage: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PromotionStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<PromotionType | 'all'>('all');

  // Status configuration
  const statusConfig = {
    active: {
      label: 'Active',
      bgColor: 'bg-black',
      textColor: 'text-white',
      icon: TrendingUp
    },
    scheduled: {
      label: 'Scheduled',
      bgColor: 'bg-gray-600',
      textColor: 'text-white',
      icon: Calendar
    },
    expired: {
      label: 'Expired',
      bgColor: 'bg-gray-300',
      textColor: 'text-gray-800',
      icon: Clock
    },
    paused: {
      label: 'Paused',
      bgColor: 'bg-gray-400',
      textColor: 'text-white',
      icon: Eye
    }
  };

  // Type configuration
  const typeConfig = {
    percentage: {
      label: 'Percentage Off',
      icon: Percent,
      color: 'text-black'
    },
    fixed_amount: {
      label: 'Fixed Amount',
      icon: DollarSign,
      color: 'text-gray-700'
    },
    buy_one_get_one: {
      label: 'BOGO',
      icon: Gift,
      color: 'text-gray-600'
    },
    free_shipping: {
      label: 'Free Shipping',
      icon: ShoppingBag,
      color: 'text-gray-800'
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPromotionValue = (promotion: Promotion) => {
    switch (promotion.type) {
      case 'percentage':
        return `${promotion.value}% OFF`;
      case 'fixed_amount':
        return `${formatCurrency(promotion.value)} OFF`;
      case 'buy_one_get_one':
        return 'BUY 2 GET 1 FREE';
      case 'free_shipping':
        return 'FREE SHIPPING';
      default:
        return '';
    }
  };

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || promotion.status === statusFilter;
    const matchesType = typeFilter === 'all' || promotion.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusCounts = (): {
  total: number;
  active: number;
  scheduled: number;
  expired: number;
  paused: number;
} => {
  const counts = promotions.reduce((acc, promotion) => {
    acc[promotion.status] = (acc[promotion.status] || 0) + 1;
    return acc;
  }, {} as Record<PromotionStatus, number>);

  return {
    total: promotions.length,
    active: counts.active || 0,
    scheduled: counts.scheduled || 0,
    expired: counts.expired || 0,
    paused: counts.paused || 0,
  };
};


  const statusCounts = getStatusCounts();

  // Status Badge Component
  const StatusBadge: React.FC<{ status: PromotionStatus }> = ({ status }) => {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-300 ${config.bgColor} ${config.textColor}`}>
        <Icon size={14} />
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    );
  };

  // Promotion Card Component
  const PromotionCard: React.FC<{ promotion: Promotion }> = ({ promotion }) => {
    const daysRemaining = getDaysRemaining(promotion.endDate);
    const typeConfig_ = typeConfig[promotion.type];
    const TypeIcon = typeConfig_.icon;

    return (
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-all duration-200">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gray-100 p-2 rounded-lg">
                <TypeIcon size={20} className={typeConfig_.color} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black">{promotion.name}</h3>
                <p className="text-gray-600">{promotion.description}</p>
              </div>
            </div>
          </div>
          <StatusBadge status={promotion.status} />
        </div>

        {/* Promotion Value */}
        <div className="bg-black text-white p-4 rounded-lg mb-4 text-center">
          <div className="text-3xl font-bold mb-1">{getPromotionValue(promotion)}</div>
          <div className="text-sm opacity-75">Use code: <span className="font-mono font-bold">{promotion.code}</span></div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} />
            <div>
              <p className="text-sm font-medium">Start Date</p>
              <p className="text-sm">{formatDate(promotion.startDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} />
            <div>
              <p className="text-sm font-medium">End Date</p>
              <p className="text-sm">{formatDate(promotion.endDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users size={16} />
            <div>
              <p className="text-sm font-medium">Usage</p>
              <p className="text-sm">{promotion.usageCount} / {promotion.usageLimit || '∞'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign size={16} />
            <div>
              <p className="text-sm font-medium">Min. Order</p>
              <p className="text-sm">{promotion.minimumOrderAmount ? formatCurrency(promotion.minimumOrderAmount) : 'No minimum'}</p>
            </div>
          </div>
        </div>

        {/* Time Remaining */}
        {promotion.status === 'active' && daysRemaining > 0 && (
          <div className="bg-gray-100 p-3 rounded border mb-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-800">
                {daysRemaining === 1 ? 'Last day!' : `${daysRemaining} days remaining`}
              </span>
            </div>
          </div>
        )}

        {/* Applicable Products */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-800 mb-2">Applicable Products:</p>
          <div className="flex flex-wrap gap-2">
            {promotion.applicableProducts.map((product, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border"
              >
                {product}
              </span>
            ))}
          </div>
        </div>

        {/* Usage Progress */}
        {promotion.usageLimit && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Usage Progress</span>
              <span className="text-sm text-gray-600">
                {Math.round((promotion.usageCount / promotion.usageLimit) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-black h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((promotion.usageCount / promotion.usageLimit) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border-2 border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors text-sm">
            <Edit size={14} />
            Edit
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border-2 border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors text-sm">
            <Eye size={14} />
            View Details
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border-2 border-red-300 rounded-lg bg-white hover:border-red-400 transition-colors text-sm text-red-600">
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="bg-black p-2 rounded-lg">
                <Percent size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">SwiftLogistic</h1>
                <p className="text-gray-600">Promotions & Discounts</p>
              </div>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              <Plus size={16} />
              <span>Create Promotion</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-600">Total Promotions</p>
            <p className="text-2xl font-bold text-black">{statusCounts.total || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-black">{statusCounts.active || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-600">Scheduled</p>
            <p className="text-2xl font-bold text-gray-600">{statusCounts.scheduled || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-600">Expired</p>
            <p className="text-2xl font-bold text-gray-400">{statusCounts.expired || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-600">Paused</p>
            <p className="text-2xl font-bold text-gray-500">{statusCounts.paused || 0}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  placeholder="Search promotions by name, code, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-600" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as PromotionStatus | 'all')}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="expired">Expired</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Tag size={20} className="text-gray-600" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as PromotionType | 'all')}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="percentage">Percentage Off</option>
                  <option value="fixed_amount">Fixed Amount</option>
                  <option value="buy_one_get_one">BOGO</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Promotions List */}
        <div className="space-y-6">
          {filteredPromotions.length === 0 ? (
            <div className="bg-white p-12 rounded-lg border-2 border-gray-200 text-center">
              <Percent size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No promotions found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            filteredPromotions.map((promotion) => (
              <PromotionCard key={promotion.id} promotion={promotion} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};