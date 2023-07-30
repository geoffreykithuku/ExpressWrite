import React from "react";
import Blog from "./Blog";
import image from "./blog-image.jpg";
const Hero = () => {
  return (
    <>
      <div className=" px-0 py-20 relative ">
        <div className="px-5 md:px-[120px]">
          <h1 className="font-semibold text-base mb-10 tracking-[0.8px]">
            Welcome to ExpressWrite Blog
          </h1>
          <p className="  max-w-[950px] text-3xl leading-[120%] tracking-[-1.56px]">
            Explore a world of creativity, knowledge, and inspiration through
            our diverse collection of articles and stories.
          </p>
        </div>
      </div>
      <Blog />
    </>
  );
};

export default Hero;
