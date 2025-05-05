"use client";
import React, { useEffect, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
} from "react-icons/md";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";

export default function ProductSlider1({ data }) {
  const [myIndex, setMyIndex] = useState(0);
  const sliderRef = useRef();

  return (
    <div className="h-[220px] w-full relative flex items-center justify-center">
      <div className="h-[40%] pr-5">
        <MdOutlineArrowBackIosNew
          onClick={() => sliderRef.current?.slidePrev()}
          className="cursor-pointer text-gray1"
          size={30}
        />
      </div>
      <Swiper
        ref={sliderRef}
        breakpoints={{
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 6 },
        }}
        slidesPerView={1}
        spaceBetween={10}
        onSwiper={(it) => (sliderRef.current = it)}
        modules={[Navigation]}
        className="h-full w-full bg-transparent z-10 bg-red"
      >
        {data.map((item) => (
          <SwiperSlide key={item.title}>
            <Link href={"#"}>
              <div className="h-[70%] w-full bg-[#f2f2f2] p-5">
                <img
                  src={item.img}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <p className="text-center text-gray2 mt-2">
                {item.title} <br />({item.quantity} Items)
              </p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="h-[40%] pl-5">
        <MdOutlineArrowForwardIos
          onClick={() => sliderRef.current?.slideNext()}
          className="cursor-pointer text-gray1"
          size={30}
        />
      </div>
    </div>
  );
}
