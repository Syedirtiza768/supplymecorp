"use client";

import Link from "next/link";
import MediaItem from "./MediaItem";

const Media = () => {
  return (
    <div className="mb-20">
      {/* Page Title Section */}
      <div className="text-center py-10">
        <h2 className="font-bold text-2xl">Media</h2>
        <p className="text-gray2 text-sm">
          Home <span className="tracking-[-2px]">&gt;&gt;</span> Media{" "}
        </p>
      </div>

      {/* Media Items */}
      <div className="w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <MediaItem img="/images/media/media1.PNG" />
        <MediaItem img="/images/media/media1.PNG" />
        <MediaItem img="/images/media/media1.PNG" />
        <MediaItem img="/images/media/media1.PNG" />
        <MediaItem img="/images/media/media1.PNG" />
        <MediaItem img="/images/media/media1.PNG" />
        <MediaItem img="/images/media/media1.PNG" />
        <MediaItem img="/images/media/media1.PNG" />
      </div>

      {/* Pagination */}
      <div className="mx-auto w-full  text-center py-10 space-x-3">
        <Link
          href={"#"}
          className="bg-second text-white py-2 px-4 rounded-md hover:bg-black"
        >
          1
        </Link>
        <Link
          href={"#"}
          className="bg-second text-white py-2 px-4 rounded-md hover:bg-black"
        >
          2
        </Link>
      </div>
    </div>
  );
};

export default Media;
