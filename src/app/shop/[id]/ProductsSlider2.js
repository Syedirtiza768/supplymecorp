"use client";
import React, { useEffect, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
} from "react-icons/md";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";

export default function ProductSlider2({ data, setSliderImg }) {
  const [myIndex, setMyIndex] = useState(0);
  const sliderRef = useRef();

  return (
    <div className="h-[70px] w-full relative flex items-center justify-center">
      <div className="h-[40%] ">
        <MdOutlineArrowBackIosNew
          onClick={() => sliderRef.current?.slidePrev()}
          className="cursor-pointer text-gray2"
          size={30}
        />
      </div>
      <Swiper
        ref={sliderRef}
        breakpoints={{
          768: { slidesPerView: 3 },
        }}
        slidesPerView={2}
        spaceBetween={10}
        onSwiper={(it) => (sliderRef.current = it)}
        modules={[Navigation]}
        className="h-full w-full bg-transparent z-10 "
      >
        {data.map((item) => (
          <SwiperSlide key={item.title}>
            <div
              className="h-full w-full bg-[#f2f2f2] cursor-pointer"
              onClick={() => setSliderImg(item.img)}
            >
              <img
                src={item.img}
                alt=""
                className="h-full w-full object-contain bg-white border border-gray1 "
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="h-[40%]">
        <MdOutlineArrowForwardIos
          onClick={() => sliderRef.current?.slideNext()}
          className="cursor-pointer text-gray2"
          size={30}
        />
      </div>
    </div>
  );
}
