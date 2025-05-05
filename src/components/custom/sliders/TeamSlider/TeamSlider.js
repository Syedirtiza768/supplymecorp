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
``;
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";

export default function TeamSlider({ data }) {
  const [myIndex, setMyIndex] = useState(0);
  const sliderRef = useRef();

  return (
    <div className="h-[300px] w-full relative flex items-center justify-center">
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
          1024: { slidesPerView: 5 },
        }}
        slidesPerView={1}
        spaceBetween={20}
        onSwiper={(it) => (sliderRef.current = it)}
        modules={[Navigation]}
        className="h-full w-full bg-transparent z-10 bg-red"
      >
        {/* { data.map((item) => ( */}
        <SwiperSlide>
          <Link href={"#"}>
            <div className="flex flex-col items-center justify-start w-full h-full">
              <div className="flex-1 w-full ">
                <img
                  src="/images/team/team1.PNG"
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <p className="text-center text-gray2 mt-2 font-semibold">
                John Wayn <br />
                (CEO)
              </p>
            </div>
          </Link>
        </SwiperSlide>

        <SwiperSlide>
          <Link href={"#"}>
            <div className="flex flex-col items-center justify-start w-full h-full">
              <div className="flex-1 w-full ">
                <img
                  src="/images/team/team1.PNG"
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <p className="text-center text-gray2 mt-2 font-semibold">
                John Wayn <br />
                (CEO)
              </p>
            </div>
          </Link>
        </SwiperSlide>

        <SwiperSlide>
          <Link href={"#"}>
            <div className="flex flex-col items-center justify-start w-full h-full">
              <div className="flex-1 w-full ">
                <img
                  src="/images/team/team1.PNG"
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <p className="text-center text-gray2 mt-2 font-semibold">
                John Wayn <br />
                (CEO)
              </p>
            </div>
          </Link>
        </SwiperSlide>

        <SwiperSlide>
          <Link href={"#"}>
            <div className="flex flex-col items-center justify-start w-full h-full">
              <div className="flex-1 w-full ">
                <img
                  src="/images/team/team1.PNG"
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <p className="text-center text-gray2 mt-2 font-semibold">
                John Wayn <br />
                (CEO)
              </p>
            </div>
          </Link>
        </SwiperSlide>

        <SwiperSlide>
          <Link href={"#"}>
            <div className="flex flex-col items-center justify-start w-full h-full">
              <div className="flex-1 w-full ">
                <img
                  src="/images/team/team1.PNG"
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <p className="text-center text-gray2 mt-2 font-semibold">
                John Wayn <br />
                (CEO)
              </p>
            </div>
          </Link>
        </SwiperSlide>

        <SwiperSlide>
          <Link href={"#"}>
            <div className="flex flex-col items-center justify-start w-full h-full">
              <div className="flex-1 w-full ">
                <img
                  src="/images/team/team1.PNG"
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <p className="text-center text-gray2 mt-2 font-semibold">
                John Wayn <br />
                (CEO)
              </p>
            </div>
          </Link>
        </SwiperSlide>

        <SwiperSlide>
          <Link href={"#"}>
            <div className="flex flex-col items-center justify-start w-full h-full">
              <div className="flex-1 w-full ">
                <img
                  src="/images/team/team1.PNG"
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <p className="text-center text-gray2 mt-2 font-semibold">
                John Wayn <br />
                (CEO)
              </p>
            </div>
          </Link>
        </SwiperSlide>

        {/* ))}  */}
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
