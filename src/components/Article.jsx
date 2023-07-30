import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../Context";

const Article = () => {
  const { id } = useParams();

  const { userInfo } = useContext(UserContext);
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://express-write.onrender.com/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError("Error fetching the blog post");
      });
  }, [id]);

  const { title, content, cover, createdAt, author } = blog;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

 

  return (
    <div className=" px-0 py-20 relative min-h-[80vh] max-w-[1440px]">
      <div className="bg-[#232E52] pb-20 pt-20">
        <div className="px-5 md:px-[120px]">
          <p className="text-white mb-10 max-w-[950px] text-[36px] leading-[120%] tracking-[-1.56px]">
            {title}
          </p>
          <div className="flex flex-wrap gap-5 mb-10">
            <span className="px-[12px] py-2.5 rounded-md items-center justify-center flex-shrink-0 text-sm leading-[120%] font-medium uppercase text-[#232e52] bg-white">
              {author?.username}
            </span>
            {userInfo?.id === author?._id && (
              <span className="text-center">
                <Link
                  to={`/blog/${id}/edit`}
                  className="bg-white px-5 py-2 gap-4 text-[#232e52] decoration-0 rounded-md flex justify-center items-center"
                >
                  Edit
                  <i className="uil uil-edit-alt text-[#232e52] text-lg"></i>
                </Link>
              </span>
            )}
            <span className="px-[12px] py-2.5 rounded-md items-center justify-center flex-shrink-0 text-sm leading-[120%] font-medium uppercase text-white">
              <time className="px-[12px] py-2.5 rounded-md items-center justify-center flex-shrink-0 text-sm leading-[120%] font-semibold uppercase">
                {formatISO9075(new Date(createdAt))}
              </time>
            </span>
          </div>
        </div>
      </div>

      <div className="mx-5 sm:mx-20 lg:mx-24 max-w-[970px]  flex flex-col gap-10 mt-20">
        <div className="w-full h-[400px]">
          <img
            src={`https://express-write.onrender.com/` + cover}
            alt="article"
            className="w-full h-full object-cover mx-auto"
          />
        </div>
        <span
          className="text-lg font-normal leading-[150%] text-[#232E52]"
          dangerouslySetInnerHTML={{ __html: content }}
        ></span>
      </div>
    </div>
  );
};

export default Article;
