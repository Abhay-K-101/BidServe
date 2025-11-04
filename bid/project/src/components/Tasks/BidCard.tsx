import React from 'react';
import { DollarSign, Check, X } from 'lucide-react';
import { Bid } from '../../types';
import { formatCurrency, timeAgo } from '../../utils/format';
import { useAppContext } from '../../context/AppContext';

interface BidCardProps {
  bid: Bid;
  isOwner: boolean;
  onAcceptBid?: (bidId: string) => void;
  onRejectBid?: (bidId: string) => void;
}

const BidCard: React.FC<BidCardProps> = ({
  bid,
  isOwner,
  onAcceptBid,
  onRejectBid,
}) => {
  const { getUserById } = useAppContext() || {};
  const bidder = getUserById?.(bid.bidderId);

  const handleAccept = () => {
    console.log('Accepting bid:', bid.id);
    if (onAcceptBid) onAcceptBid(bid.id);
  };

  const handleReject = () => {
    console.log('Rejecting bid:', bid.id);
    if (onRejectBid) onRejectBid(bid.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <img
            src={
              bidder?.profilePicture ||
              'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'
            }
            alt={bidder?.name || 'Bidder'}
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
          <div>
            <h4 className="font-medium text-gray-900">
              {bidder?.name || 'Unknown User'}
            </h4>
            <div className="flex items-center">
              <span
                className={`w-2 h-2 rounded-full mr-1 ${
                  bidder?.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}
              ></span>
              <span className="text-xs text-gray-500 mr-2">
                {bidder?.isOnline ? 'Online' : 'Offline'}
              </span>
              <span className="text-xs text-gray-500">
                {timeAgo(bid.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
          <DollarSign size={16} className="mr-1" />
          <span className="font-bold">{formatCurrency(bid.amount)}/hr</span>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-gray-700">{bid.message}</p>
      </div>

      {isOwner && bid.status === 'pending' && (
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleReject}
            className="flex items-center px-3 py-1 text-sm bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded transition-colors"
          >
            <X size={16} className="mr-1" />
            Reject
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="flex items-center px-3 py-1 text-sm bg-green-50 text-green-600 hover:bg-green-100 font-medium rounded transition-colors"
          >
            <Check size={16} className="mr-1" />
            Accept
          </button>
        </div>
      )}

      {bid.status !== 'pending' && (
        <div className="flex justify-end">
          <span
            className={`text-sm px-3 py-1 rounded-full ${
              bid.status === 'accepted'
                ? 'bg-green-100 text-green-800'
                : bid.status === 'rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
          </span>
        </div>
      )}
    </div>
  );
};

export default BidCard;