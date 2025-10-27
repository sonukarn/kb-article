// import { useState } from "react";
// import { useCreatePostMutation } from "@/features/posts/postApi";
// import { useNavigate } from "react-router-dom";
// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css"; // ✅ correct

// export default function CreatePost() {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [tags, setTags] = useState("");
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   const [createPost, { isLoading }] = useCreatePostMutation();
//   const navigate = useNavigate();

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("content", content);
//     formData.append("tags", tags);
//     if (image) formData.append("image", image);

//     try {
//       const res = await createPost(formData).unwrap();
//       alert("✅ Post submitted for review!");
//       navigate("/"); // redirect after success
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to create post");
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Post</h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Title
//           </label>
//           <input
//             type="text"
//             placeholder="Enter post title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Content
//           </label>
//           <ReactQuill
//             theme="snow"
//             value={content}
//             onChange={setContent}
//             placeholder="Write your article here..."
//             className="bg-white mt-2"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Tags (comma separated)
//           </label>
//           <input
//             type="text"
//             placeholder="e.g. tech, javascript, webdev"
//             value={tags}
//             onChange={(e) => setTags(e.target.value)}
//             className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Upload Image
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             className="mt-1"
//           />
//           {imagePreview && (
//             <img
//               src={imagePreview}
//               alt="preview"
//               className="mt-3 w-full h-64 object-cover rounded-md border"
//             />
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={isLoading}
//           className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
//         >
//           {isLoading ? "Submitting..." : "Submit Post"}
//         </button>
//       </form>
//     </div>
//   );
// }

// import { useState } from "react";
// import { useCreatePostMutation } from "@/features/posts/postApi";
// import { useNavigate } from "react-router-dom";
// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";

// export default function CreatePost() {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [tags, setTags] = useState("");
//   const [category, setCategory] = useState(""); // <-- new state
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   const [createPost, { isLoading }] = useCreatePostMutation();
//   const navigate = useNavigate();

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!category) {
//       alert("❌ Please select a category");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("content", content);
//     formData.append("tags", tags);
//     formData.append("category", category); // <-- send category to backend
//     if (image) formData.append("image", image);

//     try {
//       await createPost(formData).unwrap();
//       alert("✅ Post submitted for review!");
//       navigate("/");
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to create post");
//     }
//   };

//   const categories = [
//     "Technology",
//     "Business",
//     "Design",
//     "Marketing",
//     "AI",
//     "Cloud",
//   ]; // <-- predefined categories

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Post</h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Title
//           </label>
//           <input
//             type="text"
//             placeholder="Enter post title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Category
//           </label>
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
//             required
//           >
//             <option value="">-- Select Category --</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Content
//           </label>
//           <ReactQuill
//             theme="snow"
//             value={content}
//             onChange={setContent}
//             placeholder="Write your article here..."
//             className="bg-white mt-2"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Tags (comma separated)
//           </label>
//           <input
//             type="text"
//             placeholder="e.g. tech, javascript, webdev"
//             value={tags}
//             onChange={(e) => setTags(e.target.value)}
//             className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Upload Image
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             className="mt-1"
//           />
//           {imagePreview && (
//             <img
//               src={imagePreview}
//               alt="preview"
//               className="mt-3 w-full h-64 object-cover rounded-md border"
//             />
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={isLoading}
//           className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
//         >
//           {isLoading ? "Submitting..." : "Submit Post"}
//         </button>
//       </form>
//     </div>
//   );
// }

// import { useState } from "react";
// import {
//   useCreatePostMutation,
//   useGenerateContentMutation,
// } from "@/features/posts/postApi";
// import { useNavigate } from "react-router-dom";
// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";
// import { toast } from "sonner";

// export default function CreatePost() {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [tags, setTags] = useState("");
//   const [category, setCategory] = useState("");
//   // const [image, setImage] = useState(null);
//   // const [imagePreview, setImagePreview] = useState(null);

//   const [createPost, { isLoading }] = useCreatePostMutation();
//   const [generateContent, { isLoading: isGenerating }] =
//     useGenerateContentMutation();
//   const navigate = useNavigate();

//   // const handleImageChange = (e) => {
//   //   // const file = e.target.files[0];
//   //   // if (file) {
//   //   //   setImage(file);
//   //   //   setImagePreview(URL.createObjectURL(file));
//   //   // }
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!category) {
//       toast.error("Please select a category");
//       return;
//     }

//     try {
//       await createPost({
//         title,
//         content,
//         tags,
//         category,
//       }).unwrap();
//       toast.success("Post submitted for review!");
//       navigate("/");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to create post");
//     }
//   };

//   const handleGenerateAI = async () => {
//     if (!title) {
//       toast.error("Please enter a title first!");
//       return;
//     }

//     try {
//       const prompt = `${title}${
//         category ? ` in the category of ${category}` : ""
//       }`;
//       const res = await generateContent(prompt).unwrap();
//       setContent(res.content);
//       toast.success("AI content generated successfully!");
//     } catch (err) {
//       console.error("AI generation failed:", err);
//       toast.error("Failed to generate content");
//     }
//   };

//   const categories = [
//     "Technology",
//     "Business",
//     "Design",
//     "Marketing",
//     "AI",
//     "Cloud",
//   ];

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Post</h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Title */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Title
//           </label>
//           <input
//             type="text"
//             placeholder="Enter post title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
//             required
//           />
//         </div>

//         {/* Category */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Category
//           </label>
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
//             required
//           >
//             <option value="">-- Select Category --</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Content with AI button */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Content
//           </label>
//           <div className="flex items-start gap-3">
//             <ReactQuill
//               theme="snow"
//               value={content}
//               onChange={setContent}
//               placeholder="Write your article here..."
//               className="bg-white mt-2 flex-1"
//             />
//             <button
//               type="button"
//               onClick={handleGenerateAI}
//               disabled={isGenerating}
//               className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 mt-2"
//             >
//               {isGenerating ? "Generating..." : "AI Generate"}
//             </button>
//           </div>
//         </div>

//         {/* Tags */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Tags (comma separated)
//           </label>
//           <input
//             type="text"
//             placeholder="e.g. tech, javascript, webdev"
//             value={tags}
//             onChange={(e) => setTags(e.target.value)}
//             className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
//           />
//         </div>

//         {/* Image */}
//         {/* <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Upload Image
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             className="mt-1"
//           />
//           {imagePreview && (
//             <img
//               src={imagePreview}
//               alt="preview"
//               className="mt-3 w-full h-64 object-cover rounded-md border"
//             />
//           )}
//         </div> */}

//         <button
//           type="submit"
//           disabled={isLoading}
//           className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
//         >
//           {isLoading ? "Submitting..." : "Submit Post"}
//         </button>
//       </form>
//     </div>
//   );
// }

import { useState } from "react";
import {
  useCreatePostMutation,
  useGenerateContentMutation,
} from "@/features/posts/postApi";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "sonner";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");

  const [createPost, { isLoading }] = useCreatePostMutation();
  const [generateContent, { isLoading: isGenerating }] =
    useGenerateContentMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    try {
      await createPost({
        title,
        content,
        tags,
        category,
      }).unwrap();
      toast.success("Post submitted for review!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create post");
    }
  };

  const handleGenerateAI = async () => {
    if (!title) {
      toast.error("Please enter a title first!");
      return;
    }

    try {
      const prompt = `${title}${
        category ? ` in the category of ${category}` : ""
      }`;
      const res = await generateContent(prompt).unwrap();
      setContent(res.content);
      toast.success("AI content generated successfully!");
    } catch (err) {
      console.error("AI generation failed:", err);
      toast.error("Failed to generate content");
    }
  };

  const categories = [
    "Technology",
    "Business",
    "Design",
    "Marketing",
    "AI",
    "Cloud",
  ];

  // Custom toolbar modules
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "align",
    "blockquote",
    "code-block",
    "list",
    // "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full text-4xl font-[Playfair_Display] text-gray-900 focus:outline-none border-none mb-6 placeholder-gray-400"
      />

      {/* Category + AI Button */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleGenerateAI}
          disabled={isGenerating}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md disabled:opacity-50 transition-all"
        >
          {isGenerating ? "Generating..." : "✨ AI Generate"}
        </button>
      </div>

      {/* Rich Text Editor */}
      <div className="relative border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          placeholder="Start writing your story..."
          className="text-gray-800 font-[Inter] min-h-[300px]"
        /> */}
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          placeholder="Start writing your story..."
          // className="text-gray-800 font-[Inter] quill-editor"
          className="max-h-[300px] overflow-y-auto rounded-lg border border-gray-200 focus-within:border-gray-400 transition-all text-gray-800 font-[Inter] quill-editor"
        />
      </div>

      {/* Tags */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Tags (comma separated)
        </label>
        <input
          type="text"
          placeholder="e.g. tech, javascript, webdev"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-md disabled:opacity-50 transition-all"
        >
          {isLoading ? "Submitting..." : "Publish Post"}
        </button>
      </div>
    </div>
  );
}
