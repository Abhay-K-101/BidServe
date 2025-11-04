import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, DollarSign, User } from 'lucide-react';
import { Task } from '../../types';
import { formatCurrency, truncateText } from '../../utils/format';
import { useAppContext } from '../../context/AppContext';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const navigate = useNavigate();
  const { getBidsForTask, getUserById } = useAppContext();
  
  const bids = getBidsForTask(task.id);
  const owner = getUserById(task.ownerId);
  const currentBidder = task.currentBid ? getUserById(task.currentBid.bidderId) : null;
  
  const navigateToTask = () => {
    navigate(`/task/${task.id}`);
  };
  
  const timeLeft = Math.ceil((new Date(task.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60));
  const isExpiringSoon = timeLeft <= 2;
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={navigateToTask}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
          <span className={`${
            task.status === 'expired' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
          } text-xs font-medium px-2.5 py-0.5 rounded-full`}>
            {task.status}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4">{truncateText(task.description, 100)}</p>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center text-gray-700">
            <DollarSign size={16} className="mr-1" />
            <span className="font-semibold">{formatCurrency(task.hourlyRate)}/hr</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <Clock size={16} className="mr-1" />
            <span className={isExpiringSoon ? "text-red-600 font-medium" : ""}>
              {timeLeft} hours left
            </span>
          </div>
          
          {task.currentBid && (
            <div className="flex items-center text-green-700 bg-green-50 px-2 py-1 rounded-full">
              <span className="text-sm">Current bid: {formatCurrency(task.currentBid.amount)}/hr</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <img 
                src={owner?.profilePicture || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'} 
                alt={owner?.name}
                className="w-8 h-8 rounded-full mr-2 object-cover" 
              />
              <div>
                <span className="text-sm text-gray-600">{owner?.name}</span>
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-1 ${
                    owner?.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}></span>
                  <span className="text-xs text-gray-500">
                    {owner?.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
            
            {currentBidder && (
              <div className="flex items-center">
                <User size={16} className="text-blue-600 mr-1" />
                <span className="text-sm text-gray-600">
                  Current bidder: {currentBidder.name}
                </span>
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            {bids.length} {bids.length === 1 ? 'bid' : 'bids'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;