import React from "react";

export default function LoadingSection() {
  return (
    <section className="mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center flex-col py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <h3 className="text-lg font-medium text-neutral-dark mb-2">Analyzing Company Data</h3>
          <p className="text-gray-500 text-center max-w-md">
            We're gathering news, analyzing sentiment, and evaluating financial metrics for your company. This may take a moment...
          </p>
          
          <div className="w-full max-w-md mt-8">
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="material-icons text-primary mr-2">search</span>
                <span className="text-sm">Gathering recent news articles...</span>
              </div>
              <div className="flex items-center">
                <span className="material-icons text-primary mr-2">analytics</span>
                <span className="text-sm">Processing financial data...</span>
              </div>
              <div className="flex items-center opacity-50">
                <span className="material-icons text-gray-400 mr-2">psychology</span>
                <span className="text-sm">Performing sentiment analysis...</span>
              </div>
              <div className="flex items-center opacity-50">
                <span className="material-icons text-gray-400 mr-2">insights</span>
                <span className="text-sm">Generating price prediction model...</span>
              </div>
              <div className="flex items-center opacity-50">
                <span className="material-icons text-gray-400 mr-2">description</span>
                <span className="text-sm">Creating comprehensive report...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
