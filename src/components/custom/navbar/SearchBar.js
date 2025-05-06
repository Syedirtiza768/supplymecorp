"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Reset searching state when URL changes
  useEffect(() => {
    setIsSearching(false);
  }, [pathname, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      router.push(
        `/shop?query=${encodeURIComponent(
          searchQuery
        )}&page=1&limit=10&sortBy=id&sortOrder=DESC`
      );
    }
  };

  return (
    <div className="bg-yellow-500 hidden lg:flex gap-5">
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
    </div>
  );
};

export default SearchBar;
