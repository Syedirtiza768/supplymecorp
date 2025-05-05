"use client";
const SearchBar = () => {
  return (
    <div className="bg-yellow-500 hidden lg:flex gap-5">
      <input
        type="text"
        placeholder="Search Products..."
        className="w-[200px] py-2 px-5  outline-none border-2 border-white focus:border-first
                        md:w-[400px] lg:w-[500px]"
      />
      <button className="bg-second px-5  hover:bg-first">Search</button>
    </div>
  );
};

export default SearchBar;
