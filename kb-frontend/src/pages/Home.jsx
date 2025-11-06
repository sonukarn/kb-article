// import { motion } from "framer-motion";
// import { useState } from "react";
// import BlogCard from "../components/BlogCard";

// export default function Home() {
//   const [search, setSearch] = useState("");

//   const categories = [
//     "Technology",
//     "Business",
//     "Design",
//     "Marketing",
//     "AI",
//     "Cloud",
//   ];

//   const blogs = Array.from({ length: 6 }).map((_, i) => ({
//     id: i,
//     title: `How to Build a Scalable App ${i + 1}`,
//     description:
//       "Learn how to design and deploy a scalable app using modern tools.",
//     author: "John Doe",
//     date: "Oct 8, 2025",
//     category: categories[i % categories.length],
//     image: `https://source.unsplash.com/random/400x300?tech,${i}`,
//   }));

//   return (
//     <div className="pt-20 pb-16 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Search Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="max-w-4xl mx-auto text-center mt-10"
//       >
//         <h1 className="text-4xl font-bold text-gray-800 mb-3">
//           Discover Knowledge
//         </h1>
//         <p className="text-gray-600 mb-8">
//           Explore articles, guides, and tutorials written by experts.
//         </p>

//         <div className="relative max-w-2xl mx-auto">
//           <input
//             type="text"
//             placeholder="Search articles by title, description, or keyword..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
//           />
//           <button className="absolute right-2 top-1.5 bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition">
//             Search
//           </button>
//         </div>
//       </motion.div>

//       {/* Categories */}
//       <div className="max-w-6xl mx-auto mt-12">
//         <h2 className="text-lg font-semibold text-gray-700 mb-4 px-3">
//           Browse by Category
//         </h2>
//         <div className="flex flex-wrap gap-3 px-3">
//           {categories.map((cat, i) => (
//             <motion.div
//               key={i}
//               whileHover={{ scale: 1.05 }}
//               className="px-4 py-2 bg-white rounded-full shadow hover:bg-indigo-50 cursor-pointer text-sm font-medium text-gray-700"
//             >
//               {cat}
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Blogs Grid */}
//       <div className="max-w-6xl mx-auto mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 px-3">
//         {blogs.map((b) => (
//           <BlogCard key={b.id} blog={b} />
//         ))}
//       </div>
//     </div>
//   );
// }

// import { useState, useMemo } from "react";
// import { motion } from "framer-motion";
// import BlogCard from "../components/BlogCard";
// import { useGetPublishedPostsQuery } from "@/features/posts/postApi";

// export default function Home() {
//   const [search, setSearch] = useState("");
//   const [activeCategory, setActiveCategory] = useState("All");

//   const categories = [
//     "All",
//     "Technology",
//     "Business",
//     "Design",
//     "Marketing",
//     "AI",
//     "Cloud",
//   ];

//   // Fetch posts from backend
//   const { data: posts, isLoading, isError } = useGetPublishedPostsQuery();

//   // Filter logic (future ready for search + category)
//   const filteredPosts = useMemo(() => {
//     if (!posts) return [];

//     return posts.filter((post) => {
//       const matchCategory =
//         activeCategory === "All" || post.category === activeCategory;
//       const matchSearch =
//         post.title.toLowerCase().includes(search.toLowerCase()) ||
//         post.description.toLowerCase().includes(search.toLowerCase());
//       return matchCategory && matchSearch;
//     });
//   }, [posts, search, activeCategory]);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <p className="text-gray-600 text-lg">Loading posts...</p>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <p className="text-red-500 text-lg">Failed to load posts.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Header Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="max-w-4xl mx-auto text-center"
//       >
//         <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
//           Discover Knowledge
//         </h1>
//         <p className="text-gray-600 mb-8">
//           Explore articles, guides, and insights written by experts.
//         </p>

//         {/* Search Input */}
//         <div className="relative max-w-2xl mx-auto">
//           <input
//             type="text"
//             placeholder="Search articles..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm bg-white"
//           />
//           <button className="absolute right-2 top-1.5 bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition">
//             Search
//           </button>
//         </div>
//       </motion.div>

//       {/* Categories Filter */}
//       <div className="max-w-6xl mx-auto mt-12">
//         <h2 className="text-lg font-semibold text-gray-700 mb-4 px-3">
//           Browse by Category
//         </h2>
//         <div className="flex flex-wrap gap-3 px-3">
//           {categories.map((cat) => (
//             <motion.button
//               key={cat}
//               whileHover={{ scale: 1.05 }}
//               onClick={() => setActiveCategory(cat)}
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

//       {/* Blog Grid */}
//       <div className="max-w-6xl mx-auto mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 px-3">
//         {filteredPosts.length > 0 ? (
//           filteredPosts.map((b) => <BlogCard key={b.id} blog={b} />)
//         ) : (
//           <p className="col-span-full text-center text-gray-500 text-lg">
//             No articles found.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect, useCallback } from "react";
// import { motion } from "framer-motion";
// import debounce from "lodash.debounce";
// import axios from "axios";
// import BlogCard from "../components/BlogCard";
// import axiosPublic from "@/api/axiosPublic";

// export default function Home() {
//   const [search, setSearch] = useState("");
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [posts, setPosts] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState(false);

//   const categories = [
//     "All",
//     "Technology",
//     "Business",
//     "Design",
//     "Marketing",
//     "AI",
//     "Cloud",
//   ];

//   // Function to fetch posts
//   const fetchPosts = async (category, searchText) => {
//     setIsLoading(true);
//     setIsError(false);

//     try {
//       const params = {};
//       if (category && category !== "All") params.category = category;
//       if (searchText) params.search = searchText;

//       const res = await axiosPublic.get("/posts", {
//         params,
//       });
//       setPosts(res.data);
//     } catch (err) {
//       console.error("Error fetching posts:", err);
//       setIsError(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Debounce search input
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

//   // Fetch initial posts
//   useEffect(() => {
//     fetchPosts(activeCategory, search);
//   }, []);

//   return (
//     <div className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Header */}
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

//       {/* Categories */}
//       <div className="max-w-6xl mx-auto mt-12">
//         <div className="flex flex-wrap gap-3 px-3">
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
//       <div className="max-w-6xl mx-auto mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 px-3">
//         {isLoading ? (
//           <p className="col-span-full text-center text-gray-600 text-lg">
//             Loading posts...
//           </p>
//         ) : isError ? (
//           <p className="col-span-full text-center text-red-500 text-lg">
//             Failed to load posts.
//           </p>
//         ) : posts && posts.length > 0 ? (
//           posts.map((b) => <BlogCard key={b.id} blog={b} />)
//         ) : (
//           <p className="col-span-full text-center text-gray-500 text-lg">
//             No articles found.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect, useCallback } from "react";
// import { motion } from "framer-motion";
// import debounce from "lodash.debounce";
// import axiosPublic from "@/api/axiosPublic";
// import BlogCard from "../components/BlogCard";

// export default function Home() {
//   const [search, setSearch] = useState("");
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [posts, setPosts] = useState([]);
//   const [recent, setRecent] = useState([]); // 🆕 for sidebar
//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState(false);

//   const categories = [
//     "All",
//     "Technology",
//     "Business",
//     "Design",
//     "Marketing",
//     "AI",
//     "Cloud",
//   ];

//   // ✅ Function to fetch posts (unchanged)
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

//   // ✅ Fetch recent posts for sidebar
//   const fetchRecent = async () => {
//     try {
//       const res = await axiosPublic.get("/posts");
//       // You could slice to get last 5 or 6
//       setRecent(res.data.slice(0, 5));
//     } catch (err) {
//       console.error("Error fetching recent posts:", err);
//     }
//   };

//   // ✅ Debounce search input
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

//   // ✅ Fetch initial posts & recent
//   useEffect(() => {
//     fetchPosts(activeCategory, search);
//     fetchRecent();
//   }, []);

//   return (
//     <div className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Header */}
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

//       {/* Categories */}
//       <div className="max-w-6xl mx-auto mt-12">
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

//       {/* Two-column layout */}
//       <div className="max-w-[1400px] mx-auto mt-12 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
//         {/* LEFT: Posts */}
//         <div>
//           {isLoading ? (
//             <p className="text-center text-gray-600 text-lg">Loading posts...</p>
//           ) : isError ? (
//             <p className="text-center text-red-500 text-lg">
//               Failed to load posts.
//             </p>
//           ) : posts && posts.length > 0 ? (
//             <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-6">
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

//         {/* RIGHT: Sidebar */}
//         <aside className="hidden lg:block space-y-6">
//           <div className="bg-white rounded-xl shadow-sm p-5 sticky top-28">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">
//               Recent Articles
//             </h3>
//             {recent.length > 0 ? (
//               <ul className="space-y-4">
//                 {recent.map((r) => (
//                   <li
//                     key={r.id}
//                     className="border-b border-gray-100 pb-3 last:border-none cursor-pointer hover:text-indigo-600 transition"
//                   >
//                     <p className="font-medium text-gray-900 text-sm line-clamp-2">
//                       {r.title}
//                     </p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {new Date(r.publishedAt || r.createdAt).toLocaleDateString()}
//                     </p>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-500 text-sm">No recent posts found.</p>
//             )}
//           </div>

//           {/* Optional: Featured or Popular */}
//           <div className="bg-white rounded-xl shadow-sm p-5">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">
//               Featured Topic
//             </h3>
//             <p className="text-gray-600 text-sm">
//               Stay ahead with insights on AI, technology, and innovation shaping
//               the future.
//             </p>
//           </div>
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
import { Link } from "react-router-dom";

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [posts, setPosts] = useState([]);
  const [recent, setRecent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const categories = [
    "All",
    "Technology",
    "Business",
    "Design",
    "Marketing",
    "AI",
    "Cloud",
  ];

  // ✅ Function to fetch posts (unchanged)
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

  // ✅ Fetch recent posts for sidebar
  const fetchRecent = async () => {
    try {
      const res = await axiosPublic.get("/posts");
      setRecent(res.data.slice(0, 5));
    } catch (err) {
      console.error("Error fetching recent posts:", err);
    }
  };

  // ✅ Debounce search input
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

  // ✅ Fetch initial posts & recent
  useEffect(() => {
    fetchPosts(activeCategory, search);
    fetchRecent();
  }, []);

  return (
    <div className="pt-8 pb-16 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
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

      {/* Categories */}
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

      {/* Two-column layout */}
      <div className="max-w-[1300px] mx-auto mt-10 grid grid-cols-1 lg:grid-cols-[2.3fr_0.5fr] gap-8 px-3">
        {/* LEFT: Posts */}
        <div>
          {isLoading ? (
            <p className="text-center text-gray-600 text-lg">
              Loading posts...
            </p>
          ) : isError ? (
            <p className="text-center text-red-500 text-lg">
              Failed to load posts.
            </p>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* RIGHT: Sidebar */}
        <aside className="hidden lg:block space-y-6">
          {/* Recent Articles */}
          <div className="bg-white rounded-xl shadow-sm p-4 sticky top-28">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Recent Articles
            </h3>
            {recent.length > 0 ? (
              <ul className="space-y-3">
                {recent.map((r) => (
                  <li key={r.id} className="last:border-none">
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

          {/* Featured / Popular */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Featured Topic
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Stay ahead with insights on AI, technology, and innovation shaping
              the future.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
