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

import {
  useGetCategoriesQuery,
  useApproveCategoryMutation,
  useRejectCategoryMutation,
  useDeleteCategoryMutation,
} from "@/features/categories/categoryApi";

import { toast } from "sonner";

export default function Categories() {
  // ✅ Fetch ALL categories (approved + pending + rejected)
  const { data } = useGetCategoriesQuery("ALL");
  const categories = data?.categories || [];

  const [approveCategory] = useApproveCategoryMutation();
  const [rejectCategory] = useRejectCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Categories</h2>

      <div className="grid grid-cols-1 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="p-4 border rounded-lg bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{cat.name}</p>

                <p
                  className={`text-xs mt-1 ${
                    cat.status === "APPROVED"
                      ? "text-green-600"
                      : cat.status === "PENDING"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  Status: {cat.status}
                </p>
              </div>

              <div className="flex gap-2">
                {/* ✅ Approve / Reject buttons only for pending */}
                {cat.status === "PENDING" && (
                  <>
                    <button
                      onClick={() =>
                        approveCategory(cat.id)
                          .unwrap()
                          .then(() => toast.success("Category Approved"))
                      }
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        rejectCategory(cat.id)
                          .unwrap()
                          .then(() => toast.info("Category Rejected"))
                      }
                      className="px-3 py-1 bg-yellow-600 text-white rounded"
                    >
                      Reject
                    </button>
                  </>
                )}

                {/* ✅ Delete category */}
                <button
                  onClick={() =>
                    deleteCategory(cat.id)
                      .unwrap()
                      .then(() => toast.error("Category Deleted"))
                  }
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
