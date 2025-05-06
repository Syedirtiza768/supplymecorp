"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";

// Separate component that uses useSearchParams
const SearchBarContent = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Import useSearchParams inside the component that will be wrapped in Suspense
  const { useSearchParams } = require("next/navigation");
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Reset searching state when URL changes
  useEffect(() => {
    setIsSearching(false);
  }, [pathname, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      onSearch(searchQuery);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-5">
      <input
        type="text"
        placeholder="Search Products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-[200px] py-2 px-5 outline-none border-2 border-white focus:border-first
                      md:w-[400px] lg:w-[500px] text-black"
        disabled={isSearching}
      />
      <button
        type="submit"
        className={`bg-second px-5 hover:bg-first ${
          isSearching ? "opacity-70 cursor-not-allowed" : ""
        }`}
        disabled={isSearching}
      >
        {isSearching ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

// Main component that doesn't directly use useSearchParams
const SearchBar = () => {
  const router = useRouter();

  const handleSearch = (query) => {
    router.push(
      `/shop?query=${encodeURIComponent(
        query
      )}&page=1&limit=10&sortBy=id&sortOrder=DESC`
    );
  };

  return (
    <div className="bg-yellow-500 hidden lg:flex gap-5">
      <Suspense
        fallback={<div className="w-full flex gap-5">Loading search...</div>}
      >
        <SearchBarContent onSearch={handleSearch} />
      </Suspense>
    </div>
  );
};

export default SearchBar;
