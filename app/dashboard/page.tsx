'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { mockDealers } from '@/lib/mockData';
import Header from '@/components/Header';
import DashboardStats from '@/components/DashboardStats';
import DealerCard from '@/components/DealerCard';
import DealerDetails from '@/components/DealerDetails';
import { Dealer } from '@/lib/types';
import { Search, Filter, Plus, LayoutGrid, List } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const currentUser = useStore((state) => state.currentUser);
  const dealers = useStore((state) => state.dealers);
  const addDealer = useStore((state) => state.addDealer);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
      return;
    }

    // Load mock data on first render
    if (dealers.length === 0) {
      mockDealers.forEach(dealer => addDealer(dealer));
    }
  }, [currentUser, router, dealers.length, addDealer]);

  if (!currentUser) {
    return null;
  }

  const filteredDealers = dealers.filter(dealer => {
    const matchesSearch =
      dealer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || dealer.status === statusFilter;

    // Role-based filtering
    if (currentUser.role === 'bd_manager') {
      return matchesSearch && matchesStatus;
    }

    // Other departments only see their assigned tasks
    const departmentStatusMap = {
      fcu: 'fcu_review',
      credit: 'credit_review',
      ops: 'ops_review',
      app_support: 'app_support',
    };

    const relevantStatus = departmentStatusMap[currentUser.role as keyof typeof departmentStatusMap];
    return matchesSearch && matchesStatus && dealer.status === relevantStatus;
  });

  const isGodMode = currentUser.role === 'bd_manager';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* God Mode Dashboard */}
        {isGodMode && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">God Mode Dashboard</h2>
              <p className="text-gray-600">Complete visibility across all departments</p>
            </div>
            <DashboardStats dealers={dealers} />
          </>
        )}

        {/* Department Dashboard */}
        {!isGodMode && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">My Task Queue</h2>
            <p className="text-gray-600">Dealers assigned to {currentUser.role.replace('_', ' ').toUpperCase()}</p>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search dealers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ecofy-primary focus:border-transparent"
              />
            </div>

            {isGodMode && (
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-ecofy-primary focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="fcu_review">FCU Review</option>
                  <option value="credit_review">Credit Review</option>
                  <option value="ops_review">Ops Review</option>
                  <option value="app_support">App Support</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-ecofy-primary text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-ecofy-primary text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {isGodMode && (
              <button className="bg-ecofy-primary hover:bg-ecofy-secondary text-white font-medium px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Plus className="w-5 h-5" />
                <span>New Dealer</span>
              </button>
            )}
          </div>
        </div>

        {/* Dealers Grid/List */}
        {filteredDealers.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No dealers found</p>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-3'
          }>
            {filteredDealers.map((dealer) => (
              <DealerCard
                key={dealer.id}
                dealer={dealer}
                onClick={() => setSelectedDealer(dealer)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dealer Details Modal */}
      {selectedDealer && (
        <DealerDetails
          dealer={selectedDealer}
          onClose={() => setSelectedDealer(null)}
        />
      )}
    </div>
  );
}
