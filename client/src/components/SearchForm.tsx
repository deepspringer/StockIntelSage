import React, { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchFormProps {
  searchQuery: string;
  onSearch: (companyName: string) => void;
  recentSearches: string[];
  isLoading: boolean;
}

export default function SearchForm({ 
  searchQuery,
  onSearch,
  recentSearches,
  isLoading
}: SearchFormProps) {
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  const handleRecentSearch = (company: string) => {
    setInputValue(company);
    onSearch(company);
  };

  return (
    <>
      <form id="companySearchForm" className="mb-4" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-icons text-gray-400"></span>
              </span>
              <Input
                type="text"
                id="companyName"
                placeholder="Enter company name (e.g., Apple, Tesla, Microsoft)"
                className="w-full pl-10 pr-4 py-3"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
            disabled={isLoading || !inputValue.trim()}
          >
            <span>Analyze</span>
          </Button>
        </div>
      </form>

      {recentSearches.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-neutral-dark mb-2">Recent Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((company, index) => (
              <button
                key={`${company}-${index}`}
                className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-neutral-dark transition-colors"
                onClick={() => handleRecentSearch(company)}
                disabled={isLoading}
              >
                {company}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
