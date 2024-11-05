import { useState, useCallback } from 'react';

interface WebResult {
  title: string;
  snippet: string;
  url: string;
}

export const useWebSearch = () => {
  const [results, setResults] = useState<WebResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // For demo purposes, simulating API call with mock data
      // In production, replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockResults: WebResult[] = [
        {
          title: `Latest information about ${query}`,
          snippet: `Comprehensive analysis and recent developments regarding ${query}. This summary includes key points and relevant data from multiple sources.`,
          url: 'https://example.com/1',
        },
        {
          title: `Understanding ${query} - In-depth Guide`,
          snippet: `Detailed explanation of ${query} with expert insights and practical applications. Learn about the most important aspects and current trends.`,
          url: 'https://example.com/2',
        },
        {
          title: `${query} - Research and Analysis`,
          snippet: `Scientific research and analytical data about ${query}. Includes statistical information and expert opinions from leading authorities in the field.`,
          url: 'https://example.com/3',
        },
      ];

      setResults(mockResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch results');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    search,
    results,
    isLoading,
    error,
  };
};