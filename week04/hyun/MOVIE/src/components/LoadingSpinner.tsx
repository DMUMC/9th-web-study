import React from 'react';

const LoadingSpinner = () => {
    return (
        <div
            className="size-12 animate-spin rounded-full border-6 border-t-transparent border-[#0064FF]"
            role="status"
        >
            <span className="sr-only">로딩 중 ...</span>
        </div>
    );
};

export default LoadingSpinner;
