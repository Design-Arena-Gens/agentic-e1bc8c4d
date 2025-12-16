'use client';

import { Dealer } from '@/lib/types';
import StatusBadge from './StatusBadge';
import { X, FileText, Download, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '@/lib/store';
import { useState } from 'react';

interface DealerDetailsProps {
  dealer: Dealer;
  onClose: () => void;
}

export default function DealerDetails({ dealer, onClose }: DealerDetailsProps) {
  const currentUser = useStore((state) => state.currentUser);
  const updateDealerStatus = useStore((state) => state.updateDealerStatus);
  const [note, setNote] = useState('');

  const canTakeAction = currentUser && (
    (currentUser.role === 'bd_manager') ||
    (currentUser.role === 'fcu' && dealer.status === 'fcu_review') ||
    (currentUser.role === 'credit' && dealer.status === 'credit_review') ||
    (currentUser.role === 'ops' && dealer.status === 'ops_review') ||
    (currentUser.role === 'app_support' && dealer.status === 'app_support')
  );

  const handleApprove = () => {
    if (!note.trim()) {
      alert('Please add a note before approving');
      return;
    }

    const nextStatus = getNextStatus(dealer.status);
    updateDealerStatus(dealer.id, nextStatus, currentUser?.role.toUpperCase() || 'System', note);
    setNote('');
    alert('Dealer approved and moved to next stage');
  };

  const handleReject = () => {
    if (!note.trim()) {
      alert('Please add a reason for rejection');
      return;
    }

    updateDealerStatus(dealer.id, 'rejected', currentUser?.role.toUpperCase() || 'System', note);
    setNote('');
    alert('Dealer rejected');
  };

  const getNextStatus = (currentStatus: Dealer['status']): Dealer['status'] => {
    const flow: Record<string, Dealer['status']> = {
      'pending': 'fcu_review',
      'fcu_review': 'credit_review',
      'credit_review': 'ops_review',
      'ops_review': 'app_support',
      'app_support': 'approved',
    };
    return flow[currentStatus] || currentStatus;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{dealer.name}</h2>
            <p className="text-sm text-gray-600">{dealer.company}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status & Current Department */}
          <div className="flex items-center space-x-4">
            <StatusBadge status={dealer.status} />
            <span className="text-sm text-gray-600">Current: {dealer.currentDepartment}</span>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{dealer.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium">{dealer.phone}</p>
              </div>
              <div>
                <p className="text-gray-600">GST Number</p>
                <p className="font-medium">{dealer.gstNumber}</p>
              </div>
              <div>
                <p className="text-gray-600">PAN Number</p>
                <p className="font-medium">{dealer.panNumber}</p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Address</h3>
            <p className="text-sm text-gray-800">{dealer.address}</p>
            <p className="text-sm text-gray-800">{dealer.city}, {dealer.state} - {dealer.pincode}</p>
          </div>

          {/* Documents */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Documents</h3>
            <div className="grid grid-cols-1 gap-3">
              {dealer.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-ecofy-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-600">{doc.type.replace('_', ' ').toUpperCase()}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Timeline</h3>
            <div className="space-y-4">
              {dealer.timeline.map((event, index) => (
                <div key={event.id} className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.status === 'approved' ? 'bg-green-100' :
                      event.status === 'rejected' ? 'bg-red-100' :
                      event.status === 'in_progress' ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      {event.status === 'approved' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {event.status === 'rejected' && <XCircle className="w-4 h-4 text-red-600" />}
                      {event.status === 'in_progress' && <Clock className="w-4 h-4 text-blue-600" />}
                      {event.status === 'pending' && <Clock className="w-4 h-4 text-gray-600" />}
                    </div>
                    {index < dealer.timeline.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">{event.action}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(event.timestamp), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.department} - {event.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Section */}
          {canTakeAction && dealer.status !== 'approved' && dealer.status !== 'rejected' && (
            <div className="bg-ecofy-accent border border-ecofy-light rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Take Action</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add notes or comments..."
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-ecofy-primary focus:border-transparent mb-3"
                rows={3}
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleApprove}
                  className="flex-1 bg-ecofy-primary hover:bg-ecofy-secondary text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Approve & Forward
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
