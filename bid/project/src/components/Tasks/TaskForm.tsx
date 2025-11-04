import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const TaskForm: React.FC = () => {
  const { addTask } = useAppContext();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [thresholdLimit, setThresholdLimit] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!hourlyRate.trim()) newErrors.hourlyRate = 'Hourly rate is required';
    else if (isNaN(Number(hourlyRate)) || Number(hourlyRate) <= 0) {
      newErrors.hourlyRate = 'Hourly rate must be a positive number';
    }
    if (!thresholdLimit.trim()) newErrors.thresholdLimit = 'Threshold limit is required';
    else if (isNaN(Number(thresholdLimit)) || Number(thresholdLimit) <= 0) {
      newErrors.thresholdLimit = 'Threshold limit must be a positive number';
    } else if (Number(thresholdLimit) >= Number(hourlyRate)) {
      newErrors.thresholdLimit = 'Threshold limit must be lower than hourly rate';
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
    
    // In a real app, would handle file upload here
    const attachmentUrl = attachment ? URL.createObjectURL(attachment) : undefined;
    
    // Set expiration to 24 hours from now
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    addTask({
      title,
      description,
      hourlyRate: Number(hourlyRate),
      thresholdLimit: Number(thresholdLimit),
      expiresAt,
      attachmentUrl
    });
    
    navigate('/');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Task Title*
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Website Design for Small Business"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Task Description*
        </label>
        <textarea
          id="description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe your task in detail. Include requirements, expected deliverables, and any specific skills needed."
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>
      
      <div>
        <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
          Starting Hourly Rate ($)*
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">$</span>
          </div>
          <input
            id="hourlyRate"
            type="number"
            min="1"
            step="1"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            className={`w-full pl-7 px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              errors.hourlyRate ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 50"
          />
        </div>
        {errors.hourlyRate && <p className="mt-1 text-sm text-red-600">{errors.hourlyRate}</p>}
      </div>

      <div>
        <label htmlFor="thresholdLimit" className="block text-sm font-medium text-gray-700 mb-1">
          Threshold Limit ($)*
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">$</span>
          </div>
          <input
            id="thresholdLimit"
            type="number"
            min="1"
            step="1"
            value={thresholdLimit}
            onChange={(e) => setThresholdLimit(e.target.value)}
            className={`w-full pl-7 px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              errors.thresholdLimit ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 30"
          />
        </div>
        {errors.thresholdLimit && <p className="mt-1 text-sm text-red-600">{errors.thresholdLimit}</p>}
        <p className="mt-1 text-sm text-gray-500">Bidding will stop when it reaches this amount</p>
      </div>
      
      <div>
        <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-1">
          Attachment (Optional)
        </label>
        <div className="border border-dashed border-gray-300 rounded-md px-6 py-8 flex justify-center">
          <div className="space-y-1 text-center">
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PDF, DOC, DOCX, PNG, JPG up to 10MB</p>
          </div>
        </div>
        {attachment && (
          <p className="mt-2 text-sm text-gray-600">
            Selected file: {attachment.name}
          </p>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Post Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;