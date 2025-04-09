import React from 'react';
import UnifiedForm from "@/components/UnifiedForm";
import { ToastTest } from '@/components/ToastTest';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            نظام الاستقالة
          </h1>
        </div>
        <ToastTest />
        <UnifiedForm />
      </div>
    </div>
  );
};

export default Index;
