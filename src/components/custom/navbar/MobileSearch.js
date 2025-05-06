"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoSearchOutline } from "react-icons/io5";

const MobileSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/shop?query=${encodeURIComponent(
          searchQuery
        )}&page=1&limit=10&sortBy=id&sortOrder=DESC`
      );
      setIsOpen(false);
    }
  };

  return (
    <div className="lg:hidden">
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="p-2">
          <IoSearchOutline size={24} />
        </button>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg p-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search Products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 py-2 px-5 outline-none border-2 border-gray1 focus:border-first rounded"
              />
              <button
                type="submit"
                className="bg-second px-5 text-white rounded hover:bg-first"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-gray-200 px-3 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileSearch;
