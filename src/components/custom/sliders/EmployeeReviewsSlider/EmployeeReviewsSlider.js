"use client";
import React, { useEffect, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function EmployeeReviewsSlider({ data }) {
  const [myIndex, setMyIndex] = useState(0);
  const sliderRef = useRef();

  useEffect(() => {
    sliderRef.current.swiper.slideTo(myIndex);
  }, [myIndex]);

  return (
    <div>
      <div className="w-full relative p-10">
        <Swiper
          ref={sliderRef}
          slidesPerView={1}
          pagination={{
            clickable: true,
          }}
          modules={[Navigation, Pagination]}
          className="h-full w-full bg-transparent"
          style={{
            "--swiper-pagination-color": "#a38127",
            "--swiper-pagination-bullet-inactive-color": "#999999",
            "--swiper-pagination-bullet-inactive-opacity": "1",
            "--swiper-pagination-bullet-size": "13px",
          }}
        >
          {/* { data?.map((item) => ( */}
          <SwiperSlide>
            <div className="w-full h-full flex flex-col items-center justify-center ">
              <div className=" border-2 border-second rounded-full">
                <img
                  src="/images/team/team1.PNG"
                  className="h-[100px] rounded-full object-cover object-center"
                  alt=""
                />
              </div>
              <h3 className=" text-black font-bold text-xl mt-5">
                Carilona Delgado
              </h3>
              <p className="text-gray2 mt-1">Director</p>
              <div className="relative bg-[#f1f1f1] md:w-[70%] max-w-[1000px] min-h-[160px] p-10 lg:px-20  rounded-3xl mt-5 flex items-center justify-center mb-20">
                <span className="absolute top-[-17px] left-20 text-second font-bold text-7xl">
                  &apos;&apos;
                </span>
                <p className="text-center italic text-gray2">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui
                  blanditiis praesentium voluptatum deleniti atque corrupti quos
                  dolores et quas molestias excepturi sint occaecati cupiditate
                  non pro
                </p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="w-full h-full flex flex-col items-center justify-center ">
              <div className=" border-2 border-second rounded-full">
                <img
                  src="/images/team/team1.PNG"
                  className="h-[100px] rounded-full object-cover object-center"
                  alt=""
                />
              </div>
              <h3 className=" text-black font-bold text-xl mt-5">
                Carilona Delgado
              </h3>
              <p className="text-gray2 mt-1">Director</p>
              <div className="relative bg-[#f1f1f1] md:w-[70%] max-w-[1000px] min-h-[160px] p-10 lg:px-20  rounded-3xl mt-5 flex items-center justify-center mb-20">
                <span className="absolute top-[-17px] left-20 text-second font-bold text-7xl">
                  &apos;&apos;
                </span>
                <p className="text-center italic text-gray2">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui
                  blanditiis praesentium voluptatum deleniti atque corrupti quos
                  dolores et quas molestias excepturi sint occaecati cupiditate
                  non pro
                </p>
              </div>
            </div>
          </SwiperSlide>

          {/* ))} */}
        </Swiper>
      </div>
    </div>
  );
}
