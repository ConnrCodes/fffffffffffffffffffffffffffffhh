import React from 'react';
import { Globe, ExternalLink, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface WebResult {
  title: string;
  snippet: string;
  url: string;
}

interface Props {
  query: string;
  results: WebResult[];
  isLoading: boolean;
}

const WebResults: React.FC<Props> = ({ query, results, isLoading }) => {
  if (!query) return null;

  return (
    <div className="bg-black/80 rounded-lg p-6 backdrop-blur-sm border border-blue-500/30">
      <h2 className="text-blue-400 text-lg font-semibold mb-4 flex items-center">
        <Globe className="w-5 h-5 mr-2" />
        Web Intelligence
      </h2>

      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-blue-300">
          <Search className="w-4 h-4" />
          <span className="text-sm opacity-70">Query:</span>
          <span className="font-medium">{query}</span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-20 bg-blue-900/20 rounded animate-pulse"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result, index) => (
              <motion.div
                key={index}
                className="bg-blue-900/20 p-4 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-medium flex items-center"
                >
                  {result.title}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
                <p className="text-blue-200 text-sm mt-2">{result.snippet}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebResults;