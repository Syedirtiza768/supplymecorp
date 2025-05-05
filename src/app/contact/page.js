"use client";

import Link from "next/link";
import Container1 from "@/components/custom/Container1";
import TeamSlider from "@/components/custom/sliders/TeamSlider/TeamSlider";
import EmployeeReviewsSlider from "@/components/custom/sliders/EmployeeReviewsSlider/EmployeeReviewsSlider";
import { AiOutlineHeart } from "react-icons/ai";

const Contact = () => {
  return (
    <div className="mb-20">
      {/* Page Title Section */}
      <div className="text-center py-10">
        <h2 className="font-bold text-2xl">Contact Us</h2>
        <p className="text-gray2 text-sm">
          Home <span className="tracking-[-2px]">&gt;&gt;</span> Contact Us{" "}
        </p>
      </div>

      {/* Get In Touch Section */}
      <Container1 headingTitle={"Get In Touch"}>
        <div className="flex flex-col lg:flex-row  justify-between w-full h-full gap-10 md:p-5 pb-20">
          {/* Left Section */}
          <div className="w-full lg:w-[50%]  h-full">
            <p className="text-gray2 text-sm">
              top by and visit us or feel free to use the contact information
              below to reach out to us with any questions or concerns
            </p>

            <div className="flex mt-10 px-5 gap-3">
              <AiOutlineHeart className="text-second" size={30} />
              <div>
                <h3 className="font-bold text-2xl">Address:</h3>
                <p className="text-gray2 font-semibold">
                  18-07 Astoria Boulevard <br />
                  Long Island City, NY 11102
                </p>
              </div>
            </div>

            <div className="flex mt-10 px-5 gap-3">
              <AiOutlineHeart className="text-second" size={30} />
              <div>
                <h3 className="font-bold text-2xl">Hotline:</h3>
                <p className="text-gray2 font-semibold">
                  (718) 278-8480
                  <br />
                  Long Island City, NY 11102
                </p>
              </div>
            </div>

            <div className="flex mt-10 px-5 gap-3">
              <AiOutlineHeart className="text-second" size={30} />
              <div>
                <h3 className="font-bold text-2xl">Email Us:</h3>
                <p className="text-gray2 font-semibold">
                  orders@rrgeneralsupply.com
                  <br />
                  Long Island City, NY 11102
                </p>
              </div>
            </div>

            <div className="flex mt-10 px-5 gap-3">
              <AiOutlineHeart className="text-second" size={30} />
              <div>
                <h3 className="font-bold text-2xl">Opening Time:</h3>
                <p className="text-gray2 font-semibold">
                  Monday - Friday 7 AM - 5 PM
                  <br />
                  Saturday 8 AM - 2 PM <br />
                  Sundays CLOSED
                </p>
              </div>
            </div>
          </div>
          {/* Right Section */}
          <div className="w-full lg:w-[50%] flex flex-col gap-5 md:gap-10 md:p-10">
            <div className="flex flex-col md:flex-row w-full gap-5">
              <input
                type="text"
                className="w-full outline-none py-2 px-5 text-gray2 border border-gray1 rounded-md"
                placeholder="Your Name*"
              />

              <input
                type="email"
                className="w-full outline-none py-2 px-5 text-gray2 border border-gray1 rounded-md"
                placeholder="Your Email*"
              />
            </div>

            <input
              type="text"
              className="w-full outline-none py-2 px-5 text-gray2 border border-gray1 rounded-md"
              placeholder="Subject*"
            />

            <textarea
              name=""
              id=""
              placeholder="Your Message*"
              className="w-full outline-none py-2 px-5 text-gray2 border border-gray1 rounded-md min-h-[200px]"
            ></textarea>

            <button className="bg-second text-white rounded-md hover:bg-opacity-80 py-2 px-5 w-full">
              Submit
            </button>
          </div>
        </div>
      </Container1>
    </div>
  );
};

export default Contact;
