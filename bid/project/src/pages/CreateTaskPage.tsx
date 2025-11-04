import React from 'react';
import Layout from '../components/Layout/Layout';
import TaskForm from '../components/Tasks/TaskForm';

const CreateTaskPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Task</h1>
          <p className="text-gray-600">
            Describe your task in detail to attract the best bidders.
          </p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
          <TaskForm />
        </div>
        
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Tips for Great Task Descriptions</h3>
          <ul className="list-disc pl-5 text-blue-800 space-y-1">
            <li>Be specific about requirements and deliverables</li>
            <li>Set a realistic budget for the work involved</li>
            <li>Provide examples or references if possible</li>
            <li>Clearly state your timeline and deadline expectations</li>
            <li>Specify the skills or experience needed</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTaskPage;