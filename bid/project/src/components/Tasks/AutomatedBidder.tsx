import React, { useEffect, useState } from 'react';
import { Bot, AlertCircle, DollarSign } from 'lucide-react';
import { Task } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';

interface AutomatedBidderProps {
  task: Task;
  onBidPlaced?: () => void;
}

const AutomatedBidder: React.FC<AutomatedBidderProps> = ({ task, onBidPlaced }) => {
  const { addBid, currentUser } = useAppContext();
  const [isActive, setIsActive] = useState(false);
  const [bidStrategy, setBidStrategy] = useState<'aggressive' | 'conservative'>('conservative');
  const [lastBotBid, setLastBotBid] = useState<number | null>(null);
  const [userBidCount, setUserBidCount] = useState(0);
  const [botBidCount, setBotBidCount] = useState(0);
  const [bidHistory, setBidHistory] = useState<Array<{ amount: number; isBot: boolean }>>([]);
  const [minBid, setMinBid] = useState(1);

  // Reset state when task changes
  useEffect(() => {
    setLastBotBid(null);
    setUserBidCount(0);
    setBotBidCount(0);
    setBidHistory([]);
  }, [task.id]);

  // Bot's bidding logic with improved strategy
  const calculateBotBid = (currentBid: number): number => {
    const minDecrement = bidStrategy === 'aggressive' ? 2 : 1;
    const maxDecrement = bidStrategy === 'aggressive' ? 5 : 3;
    
    // Add some randomness to make it more realistic
    const randomFactor = Math.random();
    let decrement;
    
    if (randomFactor < 0.3) {
      // 30% chance of minimum decrement
      decrement = minDecrement;
    } else if (randomFactor < 0.8) {
      // 50% chance of random decrement
      decrement = Math.floor(Math.random() * (maxDecrement - minDecrement + 1)) + minDecrement;
    } else {
      // 20% chance of maximum decrement
      decrement = maxDecrement;
    }

    // Add strategy-based behavior
    if (bidStrategy === 'aggressive') {
      if (botBidCount > 5) {
        // Increase decrement to be more aggressive after several bids
        decrement += Math.min(botBidCount - 5, 3); // Cap the additional decrement at 3
      }
    } else {
      if (userBidCount > botBidCount) {
        // Be more conservative if user is bidding more frequently
        decrement = Math.max(1, decrement - 1);
      }
    }

    // Ensure the bid doesn't go below minimum
    const newBid = Math.max(currentBid - decrement, minBid);
    return newBid;
  };

  // Handle bot's turn
  useEffect(() => {
    if (!isActive || !currentUser) return;

    const currentBidAmount = task.currentBid?.amount || task.hourlyRate;
    
    // Don't bid if the current bid is already at minimum
    if (currentBidAmount <= minBid) {
      setIsActive(false);
      return;
    }

    const botBidding = setTimeout(() => {
      // Only bid if the last bid wasn't from the bot
      if (!lastBotBid || task.currentBid?.amount !== lastBotBid) {
        const newBotBid = calculateBotBid(currentBidAmount);
        
        if (newBotBid !== lastBotBid && newBotBid >= minBid) {
          addBid({
            amount: newBotBid,
            message: getBotMessage(newBotBid, currentBidAmount),
            taskId: task.id
          });
          
          setLastBotBid(newBotBid);
          setBotBidCount(prev => prev + 1);
          setBidHistory(prev => [...prev, { amount: newBotBid, isBot: true }]);
        }
      }
    }, Math.random() * 1000 + 1000); // Random delay between 1-2 seconds

    return () => clearTimeout(botBidding);
  }, [task.currentBid, isActive, lastBotBid]);

  const getBotMessage = (newAmount: number, currentAmount: number) => {
    const messages = [
      `I can complete this task efficiently at ${formatCurrency(newAmount)}/hr.`,
      "Based on my experience, I can offer this competitive rate.",
      "I'm confident in delivering quality work at this price.",
      "This rate reflects my expertise and commitment.",
      "I can start immediately at this rate.",
      "My track record justifies this competitive offer.",
      "This is a fair rate for the required expertise.",
      "I can guarantee quality work at this price point."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleUserBid = () => {
    if (!currentUser || !task.currentBid) return;

    const currentAmount = task.currentBid.amount;
    const newBid = Math.max(currentAmount - 1, minBid);
    
    if (newBid >= minBid) {
      addBid({
        amount: newBid,
        message: "I'd like to offer my services at this rate.",
        taskId: task.id
      });

      setUserBidCount(prev => prev + 1);
      setBidHistory(prev => [...prev, { amount: newBid, isBot: false }]);

      if (onBidPlaced) {
        onBidPlaced();
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Bot className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium">Automated Bidding Demo</h3>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Bot Strategy:</label>
          <select
            value={bidStrategy}
            onChange={(e) => setBidStrategy(e.target.value as 'aggressive' | 'conservative')}
            className="text-sm border rounded p-1"
            disabled={isActive}
          >
            <option value="conservative">Conservative</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-2">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
          <p className="text-blue-800 font-medium">Demo Mode</p>
        </div>
        <p className="text-sm text-blue-600">
          Practice bidding against an AI opponent. The bot will automatically counter your bids based on its strategy.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Current Bid:</span>
          <span className="font-bold text-xl">
            {formatCurrency(task.currentBid?.amount || task.hourlyRate)}/hr
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-600">Your Bids</p>
            <p className="font-medium">{userBidCount}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-600">Bot Bids</p>
            <p className="font-medium">{botBidCount}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`flex-1 px-4 py-2 rounded-md font-medium ${
              isActive
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            } transition-colors`}
          >
            {isActive ? 'Stop Auto-Bidding' : 'Start Auto-Bidding'}
          </button>
          
          <button
            onClick={handleUserBid}
            disabled={!isActive || (task.currentBid?.amount || task.hourlyRate) <= minBid}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Place Bid (-$1)
          </button>
        </div>
      </div>

      {bidHistory.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Bid History</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {bidHistory.slice().reverse().map((bid, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-2 rounded ${
                  bid.isBot ? 'bg-gray-50' : 'bg-blue-50'
                }`}
              >
                <span className="text-sm">
                  {bid.isBot ? 'Bot' : 'You'}
                </span>
                <span className="font-medium">
                  {formatCurrency(bid.amount)}/hr
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomatedBidder;