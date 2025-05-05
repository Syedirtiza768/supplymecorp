"use client";

import Link from "next/link";
import Container1 from "@/components/custom/Container1";
import TeamSlider from "@/components/custom/sliders/TeamSlider/TeamSlider";
import EmployeeReviewsSlider from "@/components/custom/sliders/EmployeeReviewsSlider/EmployeeReviewsSlider";

const About = () => {
  return (
    <div className="mb-20">
      {/* Page Title Section */}
      <div className="text-center py-10">
        <h2 className="font-bold text-2xl">About Us</h2>
        <p className="text-gray2 text-sm">
          Home <span className="tracking-[-2px]">&gt;&gt;</span> About Us{" "}
        </p>
      </div>

      {/* About R&R General Supply */}
      <Container1 headingTitle={"About R&R General Supply"}>
        <div className="w-full ">
          <img
            src="/images/about/about1.PNG"
            className="w-full lg:h-[500px] object-cover object-center"
            alt=""
          />
          <p className="md:w-[70%] mx-auto text-center text-lg px-5 py-10 text-gray2 font-semibold leading-normal">
            Welcome to R&R General Supply. We have proudly served Astoria,
            Queens and the rest of the five boroughs since we first opened our
            doors in 1926. We are happy to meet our clients. many and diverse
            needs with a variety of of maintenance, repair, and industrial
            supplies. From those who manage just a single building to the
            biggest names in real estate, R&R General Supply is here to ensure
            their clients have the tools they need to get the job done. <br />
            <br />
            Most importantly, regardless of their size, our customers all
            receive the same outstanding level of personal service. If you judge
            a company by the company it keeps, we are definitely in good company
          </p>
        </div>
      </Container1>

      {/* Meet Our Team */}
      <div className="mt-10"></div>
      <Container1 headingTitle={"Meet Our Team"}>
        <div className="w-full ">
          <TeamSlider />
        </div>
      </Container1>

      {/* Reviews Slider */}
      <div className="mt-20 w-[90%] md:w-[80%] mx-auto">
        <EmployeeReviewsSlider />
      </div>
    </div>
  );
};

export default About;
