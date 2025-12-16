import { Dealer } from '@/lib/types';
import StatusBadge from './StatusBadge';
import { Calendar, MapPin, Building2, User } from 'lucide-react';
import { format } from 'date-fns';

interface DealerCardProps {
  dealer: Dealer;
  onClick: () => void;
}

export default function DealerCard({ dealer, onClick }: DealerCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{dealer.name}</h3>
          <p className="text-sm text-gray-600">{dealer.company}</p>
        </div>
        <StatusBadge status={dealer.status} />
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span>{dealer.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>{dealer.city}, {dealer.state}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4" />
          <span className="text-xs">{dealer.currentDepartment}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span className="text-xs">{format(new Date(dealer.updatedAt), 'MMM dd, yyyy HH:mm')}</span>
        </div>
      </div>
    </div>
  );
}
