import React, { useState } from 'react';
import { ShoppingBag, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

interface SignUpPageProps {
  onSignUp: (email: string, password: string, name: string) => void;
  onSwitchToLogin: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUp, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onSignUp(formData.email, formData.password, formData.name);
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white rounded-full">
              <ShoppingBag className="h-8 w-8 text-black" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-black">Join SwiftLogistics</h1>
          <p className="text-gray-600 mt-2">Create your account to start shopping</p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white border-2 border-white rounded-2xl shadow-2xl p-8">
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 focus:border-black transition-colors duration-200 text-black placeholder-gray-500 bg-white ${
                    errors.name ? 'border-red-500' : 'border-gray-400'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-600" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 focus:border-black transition-colors duration-200 text-black placeholder-gray-500 bg-white ${
                    errors.email ? 'border-red-500' : 'border-gray-400'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-600" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 focus:border-black transition-colors duration-200 text-black placeholder-gray-500 bg-white ${
                    errors.password ? 'border-red-500' : 'border-gray-400'
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-black transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-600" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 focus:border-black transition-colors duration-200 text-black placeholder-gray-500 bg-white ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-400'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-black transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="h-4 w-4 text-black focus:ring-black border-gray-400 rounded mt-1 bg-white"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                I agree to the{' '}
                <button type="button" className="text-black hover:text-gray-600 transition-colors duration-200 font-medium underline">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-black hover:text-gray-600 transition-colors duration-200 font-medium underline">
                  Privacy Policy
                </button>
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-700">
              Already have an account?{' '}
              <button 
                onClick={onSwitchToLogin}
                className="text-black font-medium hover:text-gray-600 transition-colors duration-200 underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-white rounded-lg border-2 border-white">
          <p className="text-xs text-gray-700 text-center">
            <strong className="text-black">Demo:</strong> Fill out the form to create your account
          </p>
        </div>
      </div>
    </div>
  );
};