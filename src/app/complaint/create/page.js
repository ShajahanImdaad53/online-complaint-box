'use client';

export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import CreateComplaintContent from './create-content';

export default function CreateComplaintPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-semibold">Loading complaint form...</p>
        </div>
      </div>
    }>
      <CreateComplaintContent />
    </Suspense>
  );
}
