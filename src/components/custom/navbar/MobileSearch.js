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
            <form onSubmit={handleSearch} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Search Products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full py-2 px-5 outline-none text-black border-2 border-gray1 focus:border-first rounded"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-secondary py-2 px-4 text-white rounded hover:bg-secondary/80"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-primary py-2 px-4 rounded hover:bg-primary/80"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileSearch;
