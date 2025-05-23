import React from "react";

interface EmptyStateProps {
  onExampleSearch: (example: string) => void;
}

export default function EmptyState({ onExampleSearch }: EmptyStateProps) {
  const handleExampleClick = (example: string) => {
    onExampleSearch(example);
  };

  return (
    <section className="mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center flex-col py-16">
          <div className="bg-[#F5F7FA] p-4 rounded-full mb-4">
            <span className="material-icons text-4xl text-primary">business</span>
          </div>
          <h3 className="text-xl font-medium text-neutral-dark mb-2">Enter a Company Name to Begin</h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            Search for any publicly traded company to receive AI-powered sentiment analysis and stock price predictions.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button 
              className="bg-[#F5F7FA] hover:bg-neutral-200 px-4 py-2 rounded-full text-sm text-neutral-dark transition-colors"
              onClick={() => handleExampleClick("Apple")}
            >
              Try "Apple"
            </button>
            <button 
              className="bg-[#F5F7FA] hover:bg-neutral-200 px-4 py-2 rounded-full text-sm text-neutral-dark transition-colors"
              onClick={() => handleExampleClick("Tesla")}
            >
              Try "Tesla"
            </button>
            <button 
              className="bg-[#F5F7FA] hover:bg-neutral-200 px-4 py-2 rounded-full text-sm text-neutral-dark transition-colors"
              onClick={() => handleExampleClick("Amazon")}
            >
              Try "Amazon"
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
