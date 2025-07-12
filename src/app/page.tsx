import Link from 'next/link';
import { Link2, BarChart3, Shield, Clock, Globe, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional URL
            <span className="text-blue-600"> Shortening</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create custom short links with advanced analytics, password protection,
            and custom domains. Perfect for businesses and professionals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signin"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Get Started Free
            </Link>
            <Link
              href="#features"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need to manage your links
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features to help you create, manage, and track your short links
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Link2 className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Short Links</h3>
            <p className="text-gray-600">
              Create memorable, branded short links with custom codes that reflect your brand.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
            <p className="text-gray-600">
              Track clicks, geographic data, referrers, and more with detailed analytics dashboards.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Password Protection</h3>
            <p className="text-gray-600">
              Secure your links with password protection to control access to your content.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="text-orange-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Link Expiration</h3>
            <p className="text-gray-600">
              Set expiration dates for your links to automatically disable them after a certain time.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Globe className="text-red-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Domains</h3>
            <p className="text-gray-600">
              Use your own domain for short links to maintain brand consistency. (Premium)
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="text-yellow-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Optimized for speed with edge caching and global CDN for instant redirects worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who trust Zyppd for their URL shortening needs.
          </p>
          <Link
            href="/auth/signin"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold inline-block"
          >
            Start Free Today
          </Link>
        </div>
      </div>
    </div>
  );
}