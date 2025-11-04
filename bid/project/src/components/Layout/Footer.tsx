import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">BidConnect</h3>
            <p className="text-sm text-gray-400">
              The platform connecting task owners with skilled bidders for efficient project completion.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">For Task Owners</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Post a Task</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Success Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">For Bidders</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Find Tasks</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Create Profile</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Payment Info</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Bidder Tips</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms & Privacy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-400 text-center">
          <p>&copy; {new Date().getFullYear()} BidConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;