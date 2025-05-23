import React from "react";

export default function Header() {
  return (
    <header className="bg-secondary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="material-icons text-2xl">insights</span>
          <h1 className="text-xl font-medium">StockSense AI</h1>
        </div>
        <div>
          <a 
            href="https://platform.openai.com/docs/overview" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary/90 px-3 py-1 rounded text-sm flex items-center"
          >
            <span className="material-icons text-sm mr-1">help_outline</span>
            Help
          </a>
        </div>
      </div>
    </header>
  );
}
