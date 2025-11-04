import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Layout from '../components/Layout/Layout';
import BidCard from '../components/Tasks/BidCard';
import BidForm from '../components/Tasks/BidForm';
import { formatCurrency, formatDate } from '../../utils/format';

const TaskDetailPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { getTaskById, getBidsForTask, getUserById, currentUser } = useAppContext();
  
  if (!taskId) {
    navigate('/');
    return null;
  }
  
  const task = getTaskById(taskId);
  
  if (!task) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Not Found</h2>
            <p className="text-gray-600 mb-6">The task you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Tasks
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  const bids = getBidsForTask(task.id);
  const owner = getUserById(task.ownerId);
  const isOwner = currentUser?.id === task.ownerId;
  const hoursLeft = Math.ceil((new Date(task.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60));
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to all tasks
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {task.status}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center text-gray-700">
                  <DollarSign size={18} className="mr-1" />
                  <span className="font-semibold text-lg">{formatCurrency(task.hourlyRate)}/hr</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <Clock size={18} className="mr-1" />
                  <span className={hoursLeft < 3 ? "text-red-600 font-medium" : ""}>
                    {hoursLeft} hours left
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-3">Description</h2>
                <div className="prose max-w-none text-gray-700">
                  <p>{task.description}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={owner?.avatarUrl || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'} 
                    alt={owner?.fullName || 'Task Owner'}
                    className="w-10 h-10 rounded-full mr-3 object-cover" 
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{owner?.fullName}</h3>
                    <p className="text-sm text-gray-500">Task Owner</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Current Bids</h2>
              <div className="space-y-4">
                {bids.map((bid) => (
                  <BidCard
                    key={bid.id}
                    bid={bid}
                    isOwner={isOwner}
                  />
                ))}
                {bids.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No bids yet. Be the first to bid!</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            {!isOwner && (
              <div className="sticky top-4">
                <BidForm task={task} />
              </div>
            )}
            
            {isOwner && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-800 mb-2">This is your task</h3>
                <p className="text-blue-700 mb-4">You'll receive notifications when bidders place their bids.</p>
                <button 
                  className="w-full px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
                >
                  Edit Task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TaskDetailPage;