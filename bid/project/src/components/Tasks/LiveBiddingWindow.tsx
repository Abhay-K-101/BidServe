import React from 'react';
import { Clock, ArrowDown } from 'lucide-react';
import { Task } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';
import BidCard from './BidCard';
import AutomatedBidder from './AutomatedBidder';

interface LiveBiddingWindowProps {
  task: Task;
}

const LiveBiddingWindow: React.FC<LiveBiddingWindowProps> = ({ task }) => {
  const { getBidsForTask, currentUser, updateBidStatus } = useAppContext() || {};
  const bids = getBidsForTask ? getBidsForTask(task.id) : [];
  const timeLeft = Math.ceil((new Date(task.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60));
  const isExpiringSoon = timeLeft <= 2;
  const isOwner = currentUser?.id === task.ownerId;

  const handleAcceptBid = (bidId: string) => {
    updateBidStatus && updateBidStatus(bidId, 'accepted');
  };

  const handleRejectBid = (bidId: string) => {
    updateBidStatus && updateBidStatus(bidId, 'rejected');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-900 to-black p-4">
        <h3 className="text-lg font-semibold text-white">Live Bidding</h3>
        <div className="flex items-center mt-2 text-white">
          <Clock size={16} className="mr-1" />
          <span className={isExpiringSoon ? "text-red-400 font-medium" : "text-gray-300"}>
            {timeLeft} hours remaining
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-blue-900">
            <p className="font-medium">Starting Rate</p>
            <p className="text-2xl font-bold">{formatCurrency(task.hourlyRate)}/hr</p>
          </div>
          {task.currentBid && (
            <div className="text-green-700">
              <p className="font-medium">Current Bid</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">{formatCurrency(task.currentBid.amount)}/hr</p>
                <ArrowDown size={20} className="ml-2 text-green-500" />
              </div>
            </div>
          )}
        </div>

        {!isOwner && <AutomatedBidder task={task} />}

        {isOwner && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-medium">
              As the task owner, you can review and accept/reject bids.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {bids.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No bids yet. Be the first to bid!</p>
            </div>
          ) : (
            bids.map((bid) => (
              <BidCard
                key={bid.id}
                bid={bid}
                isOwner={isOwner}
                onAcceptBid={handleAcceptBid}
                onRejectBid={handleRejectBid}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveBiddingWindow;
