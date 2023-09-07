import React from "react";

import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

const BlogCard = ({ title, content, cover, createdAt, author, _id }) => {
  return (
    <div className="mt-10 bg-white flex flex-col md:flex-row gap-[60px] max-w-[970px] justify-between items-center lg:mx-[195px] md:mx-[100px] sm:mx-20 mx-5">
      <div className="flex flex-col gap-5 mt-5 max-w-[610px] w-full">
        <div className="flex flex-wrap gap-5">
          <span className="px-[12px] py-2.5 rounded-md bg-[#EBF2FE] items-center justify-center flex-shrink-0 text-sm leading-[120%] font-semibold uppercase ">
            {author.username}
          </span>
          <time className="px-[12px] py-2.5 rounded-md items-center justify-center flex-shrink-0 text-sm leading-[120%] font-semibold uppercase">
            {formatISO9075(new Date(createdAt))}
          </time>
        </div>
        <Link to={`/blog/${_id}`}>
          <h1 className="font-bold text-[28px] leading-[130%]  text-[#232E52] ">
            {title}
          </h1>
        </Link>
        <p
          className="text-lg line-clamp-3 font-normal leading-[150%] text-[#232E52]"
          dangerouslySetInnerHTML={{ __html: content }}
        ></p>
      </div>
      <div>
        <img
          src={cover}
          alt="blog"
          className="max-w-[600px] w-full h-full max-h-[210px] rounded-lg  mx-auto"
        />
      </div>
    </div>
  );
};

export default BlogCard;
