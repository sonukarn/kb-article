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

// import { useParams, Link } from "react-router-dom";
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
//         className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100"
//       >
//         <div className="p-8 sm:p-10">
//           {/* Tags */}
//           {blog.tags?.length > 0 && (
//             <div className="flex flex-wrap gap-2 mb-4">
//               {blog.tags.map((tag, i) => (
//                 <span
//                   key={i}
//                   className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full"
//                 >
//                   {tag}
//                 </span>
//               ))}
//             </div>
//           )}

//           {/* Title */}
//           <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 leading-tight">
//             {blog.title}
//           </h1>

//           {/* Author and Date */}
//           <div className="text-sm text-gray-500 mb-8">
//             By{" "}
//             <span className="font-semibold text-gray-700">{blog.author}</span> •{" "}
//             {formattedDate}
//           </div>

//           {/* Content */}
//           <div
//             className="prose prose-indigo max-w-none text-gray-700"
//             dangerouslySetInnerHTML={{ __html: blog.content }}
//           />

//           {/* Back Link */}
//           <div className="mt-8">
//             <Link
//               to="/"
//               className="text-indigo-600 hover:text-indigo-800 font-medium transition"
//             >
//               &larr; Back to Blogs
//             </Link>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  useGetPostByIdQuery,
  useGetPublishedPostsQuery,
} from "@/features/posts/postApi";

export default function BlogDetails() {
  const { id } = useParams();
  const { data: blog, isLoading, isError } = useGetPostByIdQuery(id);
  const { data: recent = [] } = useGetPublishedPostsQuery(); // 🆕 recent sidebar

  if (isLoading) return <div className="pt-20 text-center">Loading...</div>;
  if (isError || !blog)
    return <div className="pt-20 text-center">Post not found</div>;

  const formattedDate = new Date(blog.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="pt-4 pb-16 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[2.4fr_0.6fr] gap-10 px-2">
        {/* LEFT: Main Article */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100 p-6 sm:p-10"
        >
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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            {blog.title}
          </h1>

          {/* Author and Date */}
          <div className="text-sm text-gray-500 mb-6">
            By{" "}
            <span className="font-semibold text-gray-700">
              {blog.author || "Anonymous"}
            </span>{" "}
            • {formattedDate}
          </div>

          {/* Image (optional) */}
          {blog.imageUrl && (
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full rounded-lg mb-8 object-cover max-h-[420px]"
            />
          )}

          {/* Content */}
          <div
            className="prose prose-indigo max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Back Link */}
          <div className="mt-10">
            <Link
              to="/"
              className="text-indigo-600 hover:text-indigo-800 font-medium transition"
            >
              &larr; Back to Articles
            </Link>
          </div>
        </motion.div>

        {/* RIGHT: Sidebar */}
        <aside className="hidden md:block space-y-6">
          {/* Recent Articles */}
          <div className="bg-white rounded-xl shadow-sm p-5 sticky top-28">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Recent Articles
            </h3>
            {recent.length > 0 ? (
              <ul className="space-y-3">
                {recent
                  .filter((r) => r.id !== blog.id)
                  .slice(0, 5)
                  .map((r) => (
                    <li key={r.id}>
                      <Link
                        to={`/blog/${r.id}`}
                        className="block hover:text-indigo-600 transition"
                      >
                        <p className="font-medium text-gray-900 text-sm line-clamp-2">
                          {r.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(
                            r.publishedAt || r.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </Link>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No recent posts found.</p>
            )}
          </div>

          {/* Featured / Insight Section */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
              Featured Insight
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Explore how technology and creativity merge to shape the modern
              digital landscape. Stay inspired with the latest expert thoughts.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
