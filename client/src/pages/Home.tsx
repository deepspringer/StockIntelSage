import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AppState, AnalyzeCompanyResponse, GetSearchHistoryResponse } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchForm from "@/components/SearchForm";
import ResultsSection from "@/components/ResultsSection";
import LoadingSection from "@/components/LoadingSection";
import EmptyState from "@/components/EmptyState";

export default function Home() {
  const { toast } = useToast();
  const [state, setState] = useState<AppState>({
    searchQuery: "",
    isLoading: false,
    hasResults: false,
    analysisResult: null,
    error: null,
  });

  // Fetch search history
  const searchHistoryQuery = useQuery<GetSearchHistoryResponse>({
    queryKey: ["/api/search-history"],
    refetchOnWindowFocus: false,
  });

  // Company analysis mutation
  const analyzeCompanyMutation = useMutation({
    mutationFn: async (companyName: string) => {
      const res = await apiRequest(
        "POST", 
        "/api/analyze-company", 
        { companyName }
      );
      return res.json() as Promise<AnalyzeCompanyResponse>;
    },
    onMutate: (companyName) => {
      setState(prev => ({
        ...prev,
        searchQuery: companyName,
        isLoading: true,
        hasResults: false,
        error: null
      }));
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          hasResults: true,
          analysisResult: response.data,
          error: null
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          hasResults: false,
          error: response.error || "Failed to analyze company"
        }));
        toast({
          title: "Analysis Failed",
          description: response.error || "Failed to analyze company",
          variant: "destructive"
        });
      }
    },
    onError: (error: Error) => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        hasResults: false,
        error: error.message
      }));
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSearch = (companyName: string) => {
    if (!companyName.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a company name",
        variant: "destructive"
      });
      return;
    }

    analyzeCompanyMutation.mutate(companyName);
  };

  const handleExampleSearch = (example: string) => {
    handleSearch(example);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-medium text-neutral-dark mb-4">Company Analysis</h2>
            <p className="text-neutral-dark mb-6">
              Enter a company name to analyze news sentiment and financial data for stock prediction
            </p>
            
            <SearchForm
              searchQuery={state.searchQuery}
              onSearch={handleSearch}
              recentSearches={searchHistoryQuery.data?.data || []}
              isLoading={state.isLoading}
            />
          </div>
        </section>

        {state.isLoading && <LoadingSection />}
        
        {state.hasResults && state.analysisResult && (
          <ResultsSection analysisResult={state.analysisResult} />
        )}
        
        {!state.isLoading && !state.hasResults && (
          <EmptyState onExampleSearch={handleExampleSearch} />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
