import React from 'react'
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingComponentProps {
  isPending: boolean;
  children: React.ReactNode;
}

export const LoadingComponent = ({ isPending, children }: LoadingComponentProps) => {
  return (
    <>
      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}
      {!isPending && (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {children}
        </div>
      )}
    </>
  )
}
