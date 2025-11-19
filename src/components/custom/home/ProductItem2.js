"use client";
// This component is used in home and shop page for showing products in large size

import { useRouter } from "next/navigation";
import Rating from "../Rating";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import WishlistButton from "../WishlistButton";

const ProductItem2 = ({
  title,
  price,
  oldPrice,
  rating,
  img,
  discount,
  link,
  url,
  id,
  hideButton,
}) => {
  const router = useRouter();

  return (
    (link || url) ? (
      <Link href={link || url} className="block group" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="relative w-full min-h-max p-5 flex items-center flex-col border border-gray1 cursor-pointer">
          {discount && (
            <div className="absolute top-0 left-0">
              <div className=" bg-red text-white pl-1   text-xs flex items-center justify-center">
                <span className="">-{discount}%</span>
                <div className="h-0 w-0 border-t-[12px] border-r-[20px] border-b-[12px] border-solid border-t-transparent border-b-transparent border-l-transparent "></div>
              </div>
            </div>
          )}
          <div className="absolute top-2 right-2 z-10">
            <WishlistButton productId={id} iconSize={20} />
          </div>
          <img src={img} alt="" className="h-[140px] object-contain" />
          <div className="mt-5 w-full flex flex-col items-center gap-3">
            <h3 className="text-gray2 text-center" style={{width: '230px', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'normal', wordBreak: 'break-word'}}>{title}</h3>
            <Button className="w-full bg-primary hover:bg-primary-700 text-white" onClick={(e) => { e.preventDefault(); window.location.href = link || url; }}>
              View Details
            </Button>
          </div>
        </div>
      </Link>
    ) : (
      <div className="relative w-full min-h-max p-5 flex items-center flex-col border border-gray1">
        {discount && (
          <div className="absolute top-0 left-0">
            <div className=" bg-red text-white pl-1   text-xs flex items-center justify-center">
              <span className="">-{discount}%</span>
              <div className="h-0 w-0 border-t-[12px] border-r-[20px] border-b-[12px] border-solid border-t-transparent border-b-transparent border-l-transparent "></div>
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton productId={id} iconSize={20} />
        </div>
        <img src={img} alt="" className="h-[140px] object-contain" />
        <div className="mt-5 w-full flex flex-col items-center gap-3">
          <h3 className="text-gray2 text-center" style={{width: '230px', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'normal', wordBreak: 'break-word'}}>{title}</h3>
          <Button className="w-full bg-primary hover:bg-primary-700 text-white" disabled={hideButton === true}>
            View Details
          </Button>
        </div>
      </div>
    )
  );
};

export default ProductItem2;
