// import { useState, useEffect, useCallback } from "react";
// import { motion } from "framer-motion";
// import debounce from "lodash.debounce";
// import axiosPublic from "@/api/axiosPublic";
// import BlogCard from "../components/BlogCard";
// import { Link } from "react-router-dom";
// import { useGetCategoriesQuery } from "@/features/categories/categoryApi";

// export default function Home() {
//   const [search, setSearch] = useState("");
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [posts, setPosts] = useState([]);
//   const [recent, setRecent] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState(false);

//   // ✅ Fetch approved categories for homepage filter
//   const { data: catData } = useGetCategoriesQuery("APPROVED");
//   const approvedCategories = catData?.categories || [];

//   // ✅ Dynamic categories array
//   const categories = ["All", ...approvedCategories.map((c) => c.name)];

//   const fetchPosts = async (category, searchText) => {
//     setIsLoading(true);
//     setIsError(false);
//     try {
//       const params = {};
//       if (category && category !== "All") params.category = category;
//       if (searchText) params.search = searchText;

//       const res = await axiosPublic.get("/posts", { params });
//       setPosts(res.data);
//     } catch (err) {
//       console.error("Error fetching posts:", err);
//       setIsError(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchRecent = async () => {
//     try {
//       const res = await axiosPublic.get("/posts");
//       setRecent(res.data.slice(0, 5));
//     } catch (err) {
//       console.error("Error fetching recent posts:", err);
//     }
//   };

//   const debounceSearch = useCallback(
//     debounce((value) => {
//       fetchPosts(activeCategory, value);
//     }, 500),
//     [activeCategory]
//   );

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearch(value);
//     debounceSearch(value);
//   };

//   const handleCategoryClick = (cat) => {
//     setActiveCategory(cat);
//     fetchPosts(cat, search);
//   };

//   useEffect(() => {
//     fetchPosts(activeCategory, search);
//     fetchRecent();
//   }, []);

//   return (
//     <div className="pt-8 pb-16 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <motion.div className="max-w-4xl mx-auto text-center">
//         <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
//           Discover Knowledge
//         </h1>
//         <p className="text-gray-600 mb-8">
//           Explore articles, guides, and insights written by experts.
//         </p>

//         <div className="relative max-w-2xl mx-auto">
//           <input
//             type="text"
//             placeholder="Search articles..."
//             value={search}
//             onChange={handleSearchChange}
//             className="w-full px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm bg-white"
//           />
//         </div>
//       </motion.div>

//       {/* ✅ Dynamic Categories */}
//       <div className="max-w-6xl mx-auto mt-10">
//         <div className="flex flex-wrap gap-3 px-3 justify-center lg:justify-start">
//           {categories.map((cat) => (
//             <motion.button
//               key={cat}
//               onClick={() => handleCategoryClick(cat)}
//               className={`px-5 py-2 rounded-full text-sm font-medium shadow-sm transition ${
//                 activeCategory === cat
//                   ? "bg-indigo-600 text-white"
//                   : "bg-white text-gray-700 hover:bg-indigo-50"
//               }`}
//             >
//               {cat}
//             </motion.button>
//           ))}
//         </div>
//       </div>

//       {/* Posts */}
//       <div className="max-w-[1300px] mx-auto mt-10 grid grid-cols-1 lg:grid-cols-[2.3fr_0.5fr] gap-8 px-3">
//         <div>
//           {isLoading ? (
//             <p className="text-center text-gray-600 text-lg">
//               Loading posts...
//             </p>
//           ) : isError ? (
//             <p className="text-center text-red-500 text-lg">
//               Failed to load posts.
//             </p>
//           ) : posts && posts.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {posts.map((b) => (
//                 <BlogCard key={b.id} blog={b} />
//               ))}
//             </div>
//           ) : (
//             <p className="text-center text-gray-500 text-lg">
//               No articles found.
//             </p>
//           )}
//         </div>

//         {/* Right Sidebar */}
//         <aside className="hidden lg:block space-y-6">
//           <div className="bg-white rounded-xl shadow-sm p-4 sticky top-28">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
//               Recent Articles
//             </h3>
//             {recent.length > 0 ? (
//               <ul className="space-y-3">
//                 {recent.map((r) => (
//                   <li key={r.id}>
//                     <Link
//                       // to={`/blog/${r.id}`}
//                       to={`/kb/${r.slug}`}
//                       className="block hover:text-indigo-600 transition"
//                     >
//                       <p className="font-medium text-gray-900 text-sm line-clamp-2">
//                         {r.title}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {new Date(
//                           r.publishedAt || r.createdAt
//                         ).toLocaleDateString()}
//                       </p>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-500 text-sm">No recent posts found.</p>
//             )}
//           </div>

//           {/* <div className="bg-white rounded-xl shadow-sm p-4">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
//               Featured Topic
//             </h3>
//             <p className="text-gray-600 text-sm leading-relaxed">
//               Stay ahead with insights on AI, technology, and innovation shaping
//               the future.
//             </p>
//           </div> */}
//         </aside>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import axiosPublic from "@/api/axiosPublic";
import BlogCard from "../components/BlogCard";
import { useGetCategoriesQuery } from "@/features/categories/categoryApi";

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // ✅ Fetch approved categories for homepage filter
  const { data: catData } = useGetCategoriesQuery("APPROVED");
  const approvedCategories = catData?.categories || [];

  // ✅ Dynamic categories array
  const categories = ["All", ...approvedCategories.map((c) => c.name)];

  const fetchPosts = async (category, searchText) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const params = {};
      if (category && category !== "All") params.category = category;
      if (searchText) params.search = searchText;

      const res = await axiosPublic.get("/posts", { params });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const debounceSearch = useCallback(
    debounce((value) => {
      fetchPosts(activeCategory, value);
    }, 500),
    [activeCategory]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    debounceSearch(value);
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    fetchPosts(cat, search);
  };

  useEffect(() => {
    fetchPosts(activeCategory, search);
  }, []); // run once on mount

  return (
    <div className="pt-8 pb-16 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          Discover Knowledge
        </h1>
        <p className="text-gray-600 mb-8">
          Explore articles, guides, and insights written by experts.
        </p>

        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={handleSearchChange}
            className="w-full px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm bg-white"
          />
        </div>
      </motion.div>

      {/* ✅ Dynamic Categories */}
      <div className="max-w-6xl mx-auto mt-10">
        <div className="flex flex-wrap gap-3 px-3 justify-center lg:justify-start">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium shadow-sm transition ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-indigo-50"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Posts - full width, responsive grid */}
      <div className="max-w-6xl mx-auto mt-10 px-3">
        {isLoading ? (
          <p className="text-center text-gray-600 text-lg">Loading posts...</p>
        ) : isError ? (
          <p className="text-center text-red-500 text-lg">
            Failed to load posts.
          </p>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((b) => (
              <BlogCard key={b.id} blog={b} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No articles found.
          </p>
        )}
      </div>
    </div>
  );
}
