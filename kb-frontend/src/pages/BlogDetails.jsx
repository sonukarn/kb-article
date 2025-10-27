// import { useParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useGetPostByIdQuery } from "@/features/posts/postApi";

// export default function BlogDetails() {
//   const { id } = useParams();
//   const { data: blog, isLoading, isError } = useGetPostByIdQuery(id);

//   if (isLoading) return <div className="pt-20 text-center">Loading...</div>;
//   if (isError || !blog)
//     return <div className="pt-20 text-center">Post not found</div>;

//   const formattedDate = new Date(blog.publishedAt).toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });

//   return (
//     <div className="pt-20 pb-20 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden"
//       >
//         <img
//           src={blog.imageUrl}
//           alt={blog.title}
//           className="w-full h-80 object-cover"
//         />

//         <div className="p-8 sm:p-10">
//           <div className="flex flex-wrap gap-2 mb-4">
//             {blog.tags.map((tag, i) => (
//               <span
//                 key={i}
//                 className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full"
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>

//           <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 leading-tight">
//             {blog.title}
//           </h1>

//           <div className="text-sm text-gray-500 mb-8">
//             By{" "}
//             <span className="font-semibold text-gray-700">{blog.author}</span> •{" "}
//             {formattedDate}
//           </div>

//           <div
//             className="prose prose-indigo max-w-none text-gray-700"
//             dangerouslySetInnerHTML={{ __html: blog.content }}
//           />
//         </div>
//       </motion.div>
//     </div>
//   );
// }

import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useGetPostByIdQuery } from "@/features/posts/postApi";

export default function BlogDetails() {
  const { id } = useParams();
  const { data: blog, isLoading, isError } = useGetPostByIdQuery(id);

  if (isLoading) return <div className="pt-20 text-center">Loading...</div>;
  if (isError || !blog)
    return <div className="pt-20 text-center">Post not found</div>;

  const formattedDate = new Date(blog.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="pt-20 pb-20 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100"
      >
        <div className="p-8 sm:p-10">
          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 leading-tight">
            {blog.title}
          </h1>

          {/* Author and Date */}
          <div className="text-sm text-gray-500 mb-8">
            By{" "}
            <span className="font-semibold text-gray-700">{blog.author}</span> •{" "}
            {formattedDate}
          </div>

          {/* Content */}
          <div
            className="prose prose-indigo max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Back Link */}
          <div className="mt-8">
            <Link
              to="/"
              className="text-indigo-600 hover:text-indigo-800 font-medium transition"
            >
              &larr; Back to Blogs
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
