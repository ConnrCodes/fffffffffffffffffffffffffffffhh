import React, { useState } from 'react';
import { Search, User, Phone, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { searchByName, searchByPhone } from '../services/osintService';

interface OsintResult {
  name?: string;
  addresses?: string[];
  phones?: string[];
  error?: string;
}

const OsintLookup = () => {
  const [searchType, setSearchType] = useState<'name' | 'phone'>('name');
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<OsintResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchInput.trim() || isSearching) return;
    
    setIsSearching(true);
    setError(null);
    setResults(null);

    try {
      const searchResults = searchType === 'phone' 
        ? await searchByPhone(searchInput)
        : await searchByName(searchInput);

      if (searchResults.error) {
        setError(searchResults.error);
      } else {
        setResults(searchResults);
      }
    } catch (error) {
      setError('Search failed. Please try again.');
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-black/80 rounded-lg p-4 backdrop-blur-sm border border-emerald-500/30">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-emerald-400" />
        <h2 className="text-emerald-400 font-semibold">OSINT Search</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSearchType('name')}
            className={`px-4 py-2 rounded-lg ${
              searchType === 'name' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-emerald-900/20 text-emerald-300'
            }`}
          >
            <User className="w-4 h-4 inline-block mr-2" />
            Name
          </button>
          <button
            onClick={() => setSearchType('phone')}
            className={`px-4 py-2 rounded-lg ${
              searchType === 'phone' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-emerald-900/20 text-emerald-300'
            }`}
          >
            <Phone className="w-4 h-4 inline-block mr-2" />
            Phone
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              searchType === 'name' 
                ? "Enter name..." 
                : "Enter phone number..."
            }
            className="flex-1 bg-emerald-900/20 border border-emerald-500/30 rounded-lg px-4 py-2 text-emerald-100 placeholder-emerald-400/50"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchInput.trim()}
            className="px-3 py-2 bg-emerald-500 text-white rounded-lg disabled:opacity-50 flex items-center gap-1"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {results && !error && (
          <div className="bg-emerald-900/20 rounded-lg p-4 space-y-4">
            {results.name && (
              <div className="flex items-center gap-2 text-emerald-300">
                <User className="w-4 h-4" />
                <span>{results.name}</span>
              </div>
            )}

            {results.addresses && results.addresses.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-emerald-400 text-sm">Addresses:</h3>
                {results.addresses.map((address, index) => (
                  <div key={index} className="flex items-center gap-2 text-emerald-300">
                    <MapPin className="w-4 h-4" />
                    <span>{address}</span>
                  </div>
                ))}
              </div>
            )}

            {results.phones && results.phones.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-emerald-400 text-sm">Phone Numbers:</h3>
                {results.phones.map((phone, index) => (
                  <div key={index} className="flex items-center gap-2 text-emerald-300">
                    <Phone className="w-4 h-4" />
                    <span>{phone}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OsintLookup;