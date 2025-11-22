// // src/components/BlogCard.jsx
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";

// export default function BlogCard({ blog }) {
//   return (
//     <motion.div
//       whileHover={{ y: -4 }}
//       transition={{ duration: 0.2 }}
//       className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
//     >
//       <Link to={`/blog/${blog.id}`}>
//         <img
//           src={blog.image}
//           alt={blog.title}
//           className="w-full h-48 object-cover"
//         />
//         <div className="p-4">
//           <p className="text-xs text-indigo-600 font-semibold mb-1">
//             {blog.category}
//           </p>
//           <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
//             {blog.title}
//           </h3>
//           <p className="text-sm text-gray-600 line-clamp-2">
//             {blog.description}
//           </p>
//           <div className="mt-3 text-xs text-gray-500 flex justify-between">
//             <span>
//               By <span className="font-medium">{blog.author}</span>
//             </span>
//             <span>{blog.date}</span>
//           </div>
//         </div>
//       </Link>
//     </motion.div>
//   );
// }

// src/components/BlogCard.jsx
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";

// export default function BlogCard({ blog }) {
//   console.log(blog);
//   return (
//     <motion.div
//       whileHover={{ y: -6, scale: 1.02 }}
//       transition={{ duration: 0.3, ease: "easeOut" }}
//       className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer group"
//     >
//       <Link to={`/blog/${blog._id || blog.id}`}>
//         {/* Image Section */}
//         <div className="relative overflow-hidden">
//           <img
//             src={blog.imageUrl}
//             alt={blog.title}
//             className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
//           />

//           {/* Category Badge */}
//           {blog.category && (
//             <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
//               {blog.category}
//             </span>
//           )}
//         </div>

//         {/* Content Section */}
//         <div className="p-5">
//           <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
//             {blog.title}
//           </h3>
//           <p className="text-sm text-gray-600 line-clamp-2 mb-3">
//             {blog.description}
//           </p>

//           {/* Footer Info */}
//           <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
//             <span>
//               By{" "}
//               <span className="font-medium text-gray-700">
//                 {blog.author || "Unknown"}
//               </span>
//             </span>
//             <span>{blog.date || "—"}</span>
//           </div>
//         </div>
//       </Link>
//     </motion.div>
//   );
// }

// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";

// export default function BlogCard({ blog }) {
//   // Convert HTML content to plain text (for short description)
//   const plainText = blog.content?.replace(/<[^>]+>/g, "").slice(0, 100) + "...";

//   const formattedDate = blog.publishedAt
//     ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       })
//     : "";

//   return (
//     <motion.div
//       whileHover={{ y: -6, scale: 1.02 }}
//       transition={{ duration: 0.3, ease: "easeOut" }}
//       className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer group"
//     >
//       <Link to={`/blog/${blog.id || blog._id}`}>
//         {/* Image Section */}
//         <div className="relative overflow-hidden">
//           <img
//             src={blog.imageUrl}
//             alt={blog.title}
//             className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
//           />

//           {/* Tags badge (first tag only for preview) */}
//           {blog.tags?.length > 0 && (
//             <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
//               {blog.tags[0]}
//             </span>
//           )}
//         </div>

//         {/* Content Section */}
//         <div className="p-5">
//           <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
//             {blog.title}
//           </h3>

//           <p className="text-sm text-gray-600 line-clamp-2 mb-3">{plainText}</p>

//           {/* Footer Info */}
//           <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
//             <span>
//               By{" "}
//               <span className="font-medium text-gray-700 capitalize">
//                 {blog.author || "Unknown"}
//               </span>
//             </span>
//             <span>{formattedDate}</span>
//           </div>
//         </div>
//       </Link>
//     </motion.div>
//   );
// }

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  // Extract plain text for short preview
  const plainText =
    blog.content
      ?.replace(/<[^>]+>/g, "")
      .slice(0, 150)
      ?.trim() + "...";

  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100 cursor-pointer group"
    >
      <Link to={`/kb/${blog.slug || blog._id}`}>
        <div className="p-5 sm:p-6">
          {/* Blog Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {blog.title}
          </h2>

          {/* Subtitle (optional) */}
          {blog.subtitle && (
            <p className="text-base text-gray-600 font-medium mb-2 line-clamp-1 italic">
              {blog.subtitle}
            </p>
          )}

          {/* Short Description */}
          <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3">
            {plainText}
          </p>

          {/* Footer Info */}
          <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500 border-t border-gray-100 pt-3">
            <span>
              By{" "}
              <span className="font-medium text-gray-700 capitalize">
                {blog.author || "Unknown"}
              </span>
            </span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
