import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Task } from '../../types';
import { formatCurrency } from '../../utils/format';

interface BidFormProps {
  task: Task;
  onSuccess?: () => void;
}

const BidForm: React.FC<BidFormProps> = ({ task, onSuccess }) => {
  const { addBid, currentUser, getUserById } = useAppContext();
  
  const [amount, setAmount] = useState(
    task.currentBid ? (task.currentBid.amount - 1).toString() : task.hourlyRate.toString()
  );
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!amount.trim()) newErrors.amount = 'Bid amount is required';
    else {
      const bidAmount = Number(amount);
      if (isNaN(bidAmount) || bidAmount <= 0) {
        newErrors.amount = 'Bid amount must be a positive number';
      }
      if (bidAmount >= task.hourlyRate) {
        newErrors.amount = 'Bid amount must be lower than the current rate';
      }
      if (bidAmount < task.thresholdLimit) {
        newErrors.amount = `Bid amount cannot be lower than the threshold limit of ${formatCurrency(task.thresholdLimit)}`;
      }
    }
    
    if (!message.trim()) newErrors.message = 'Message is required';
    else if (message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    return newErrors;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    if (!currentUser) {
      return;
    }
    
    addBid({
      amount: Number(amount),
      message,
      taskId: task.id
    });
    
    setAmount((prev) => (Number(prev) - 1).toString());
    setMessage('');
    setErrors({});
    
    if (onSuccess) {
      onSuccess();
    }
  };
  
  const currentBidder = task.currentBid ? getUserById(task.currentBid.bidderId) : null;
  const currentBidDisplay = task.currentBid 
    ? `Current bid: ${formatCurrency(task.currentBid.amount)}/hr by ${currentBidder?.name}`
    : `Starting at: ${formatCurrency(task.hourlyRate)}/hr`;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Place Your Bid</h3>
      
      <div className="mb-4 p-3 bg-blue-50 rounded-md">
        <p className="text-blue-800 font-medium">{currentBidDisplay}</p>
        <p className="text-sm text-blue-600 mt-1">
          Minimum bid: {formatCurrency(task.thresholdLimit)}/hr
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Your Hourly Rate
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              id="amount"
              type="number"
              min={task.thresholdLimit}
              max={task.hourlyRate - 1}
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full pl-7 px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your hourly rate"
            />
          </div>
          {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Why are you the best person for this task?
          </label>
          <textarea
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe your experience, skills, and why you should be chosen for this task."
          />
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Submit Bid
          </button>
        </div>
      </form>
    </div>
  );
};

export default BidForm;