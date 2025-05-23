import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} StockSense AI. Financial analysis powered by AI.
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 text-center md:text-right">
              Disclaimer: This tool provides analysis based on available data. Investment decisions should be made with professional advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
