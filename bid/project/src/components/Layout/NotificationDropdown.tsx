import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { timeAgo } from '../../utils/format';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, currentUser, markNotificationAsRead, getTaskById } = useAppContext();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const userNotifications = notifications
    .filter(notification => notification.userId === currentUser.id)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const handleNotificationClick = (notification: any) => {
    markNotificationAsRead(notification.id);
    
    if (notification.type === 'new-task' && notification.relatedId) {
      navigate(`/task/${notification.relatedId}`);
    } else if (notification.type === 'new-bid' && notification.relatedId) {
      const bid = notification.relatedId;
      const task = getTaskById(bid.taskId);
      if (task) {
        navigate(`/task/${task.id}`);
      }
    }
    
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
      <div className="py-2">
        <div className="px-4 py-2 text-sm text-gray-700 bg-gray-100 font-medium">
          Notifications
        </div>
        
        {userNotifications.length === 0 ? (
          <div className="px-4 py-3 text-sm text-gray-500">
            No notifications yet
          </div>
        ) : (
          userNotifications.map(notification => (
            <div 
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                !notification.isRead ? 'bg-blue-50' : ''
              }`}
            >
              <p className="text-sm text-gray-800">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">{timeAgo(notification.createdAt)}</p>
            </div>
          ))
        )}
        
        {userNotifications.length > 0 && (
          <div className="px-4 py-2 text-xs text-center">
            <button 
              className="text-blue-600 hover:text-blue-800 font-medium"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;