// import {
//   useGetCategoriesQuery,
//   useApproveCategoryMutation,
//   useRejectCategoryMutation,
//   useDeleteCategoryMutation,
// } from "@/features/categories/categoryApi";

// import { toast } from "sonner";

// export default function CategoriesAdmin() {
//   const { data } = useGetCategoriesQuery(); // fetch all
//   const categories = data?.categories || [];

//   const [approveCategory] = useApproveCategoryMutation();
//   const [rejectCategory] = useRejectCategoryMutation();
//   const [deleteCategory] = useDeleteCategoryMutation();

//   return (
//     <div>
//       <h2 className="text-2xl font-semibold mb-4">Manage Categories</h2>

//       <div className="grid grid-cols-1 gap-4">
//         {categories.map((cat) => (
//           <div key={cat.id} className="p-4 border rounded-lg bg-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-medium">{cat.name}</p>
//                 <p
//                   className={`text-xs mt-1 ${
//                     cat.status === "APPROVED"
//                       ? "text-green-600"
//                       : cat.status === "PENDING"
//                       ? "text-yellow-600"
//                       : "text-red-600"
//                   }`}
//                 >
//                   Status: {cat.status}
//                 </p>
//               </div>

//               <div className="flex gap-2">
//                 {cat.status === "PENDING" && (
//                   <>
//                     <button
//                       onClick={() =>
//                         approveCategory(cat.id)
//                           .unwrap()
//                           .then(() => toast.success("Approved"))
//                       }
//                       className="px-3 py-1 bg-green-600 text-white rounded"
//                     >
//                       Approve
//                     </button>

//                     <button
//                       onClick={() =>
//                         rejectCategory(cat.id)
//                           .unwrap()
//                           .then(() => toast.info("Rejected"))
//                       }
//                       className="px-3 py-1 bg-yellow-600 text-white rounded"
//                     >
//                       Reject
//                     </button>
//                   </>
//                 )}

//                 <button
//                   onClick={() =>
//                     deleteCategory(cat.id)
//                       .unwrap()
//                       .then(() => toast.error("Deleted"))
//                   }
//                   className="px-3 py-1 bg-red-600 text-white rounded"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// import {
//   useGetCategoriesQuery,
//   useApproveCategoryMutation,
//   useRejectCategoryMutation,
//   useDeleteCategoryMutation,
// } from "@/features/categories/categoryApi";

// import { toast } from "sonner";

// export default function Categories() {
//   // ✅ Fetch ALL categories (approved + pending + rejected)
//   const { data } = useGetCategoriesQuery("ALL");
//   const categories = data?.categories || [];

//   const [approveCategory] = useApproveCategoryMutation();
//   const [rejectCategory] = useRejectCategoryMutation();
//   const [deleteCategory] = useDeleteCategoryMutation();

//   return (
//     <div>
//       <h2 className="text-2xl font-semibold mb-4">Manage Categories</h2>

//       <div className="grid grid-cols-1 gap-4">
//         {categories.map((cat) => (
//           <div key={cat.id} className="p-4 border rounded-lg bg-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-medium">{cat.name}</p>

//                 <p
//                   className={`text-xs mt-1 ${
//                     cat.status === "APPROVED"
//                       ? "text-green-600"
//                       : cat.status === "PENDING"
//                       ? "text-yellow-600"
//                       : "text-red-600"
//                   }`}
//                 >
//                   Status: {cat.status}
//                 </p>
//               </div>

//               <div className="flex gap-2">
//                 {/* ✅ Approve / Reject buttons only for pending */}
//                 {cat.status === "PENDING" && (
//                   <>
//                     <button
//                       onClick={() =>
//                         approveCategory(cat.id)
//                           .unwrap()
//                           .then(() => toast.success("Category Approved"))
//                       }
//                       className="px-3 py-1 bg-green-600 text-white rounded"
//                     >
//                       Approve
//                     </button>

//                     <button
//                       onClick={() =>
//                         rejectCategory(cat.id)
//                           .unwrap()
//                           .then(() => toast.info("Category Rejected"))
//                       }
//                       className="px-3 py-1 bg-yellow-600 text-white rounded"
//                     >
//                       Reject
//                     </button>
//                   </>
//                 )}

//                 {/* ✅ Delete category */}
//                 <button
//                   onClick={() =>
//                     deleteCategory(cat.id)
//                       .unwrap()
//                       .then(() => toast.error("Category Deleted"))
//                   }
//                   className="px-3 py-1 bg-red-600 text-white rounded"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import {
  useGetCategoriesQuery,
  useApproveCategoryMutation,
  useRejectCategoryMutation,
  useDeleteCategoryMutation,
  useCreateCategoryMutation,
  useRenameCategoryMutation,
} from "@/features/categories/categoryApi";
import { toast } from "sonner";
import { Pencil, Check, X } from "lucide-react";

export default function Categories() {
  const [filter, setFilter] = useState("ALL");
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const { data, isLoading, refetch } = useGetCategoriesQuery(filter);
  const categories = data?.categories || [];

  const [approveCategory] = useApproveCategoryMutation();
  const [rejectCategory] = useRejectCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [createCategory] = useCreateCategoryMutation();
  const [renameCategory] = useRenameCategoryMutation();

  // ✅ Create new category
  const handleCreate = async () => {
    if (!newCategory.trim()) return toast.error("Please enter a category name");
    try {
      await createCategory({ name: newCategory }).unwrap();
      toast.success("Category created (pending approval)");
      setNewCategory("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create category");
    }
  };

  // ✅ Approve category
  const handleApprove = async (id) => {
    try {
      await approveCategory(id).unwrap();
      toast.success("Category approved");
      refetch();
    } catch {
      toast.error("Failed to approve category");
    }
  };

  // ✅ Reject category
  const handleReject = async (id) => {
    try {
      await rejectCategory(id).unwrap();
      toast.info("Category rejected");
      refetch();
    } catch {
      toast.error("Failed to reject category");
    }
  };

  // ✅ Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category? Posts will be detached."))
      return;
    try {
      await deleteCategory(id).unwrap();
      toast.error("Category deleted");
      refetch();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  // ✅ Start inline edit
  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  // ✅ Save rename
  const handleRename = async (id) => {
    if (!editName.trim()) return toast.error("Category name cannot be empty");
    try {
      await renameCategory({ id, name: editName }).unwrap();
      toast.success("Category renamed successfully");
      setEditingId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Rename failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-semibold text-gray-800">
          Manage Categories
        </h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
        >
          <option value="ALL">All</option>
          <option value="APPROVED">Approved</option>
          <option value="PENDING">Pending</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Create new category */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white border border-gray-200 p-4 rounded-xl shadow-sm mb-8">
        <input
          type="text"
          placeholder="Enter new category name..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          onClick={handleCreate}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md transition"
        >
          + Create Category
        </button>
      </div>

      {/* Loading / Empty states */}
      {isLoading && (
        <p className="text-center text-gray-500 py-10">Loading categories...</p>
      )}

      {!isLoading && categories.length === 0 && (
        <p className="text-center text-gray-600 py-10">
          No categories found for this filter.
        </p>
      )}

      {/* Category Table */}
      {!isLoading && categories.length > 0 && (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  Name
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  Created At
                </th>
                <th className="text-right px-6 py-3 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  {/* ✅ Editable Name Cell */}
                  <td className="px-6 py-3 font-medium text-gray-800 flex items-center gap-2">
                    {editingId === cat.id ? (
                      <>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm flex-1 focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          onClick={() => handleRename(cat.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        {cat.name}
                        <button
                          onClick={() => startEdit(cat)}
                          className="text-gray-500 hover:text-indigo-600"
                        >
                          <Pencil size={16} />
                        </button>
                      </>
                    )}
                  </td>

                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        cat.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : cat.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {cat.status}
                    </span>
                  </td>

                  <td className="px-6 py-3 text-gray-500">
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-3 text-right space-x-2">
                    {cat.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() => handleApprove(cat.id)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(cat.id)}
                          className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
