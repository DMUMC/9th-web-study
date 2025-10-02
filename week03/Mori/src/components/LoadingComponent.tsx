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
        <>
          {children}
        </>
      )}
    </>
  )
}
