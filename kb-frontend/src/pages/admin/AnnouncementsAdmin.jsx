// // src/pages/admin/AnnouncementsAdmin.jsx
// import React, { useState } from "react";
// import {
//   useCreateAnnouncementMutation,
//   useGetAnnouncementsQuery,
//   useUpdateAnnouncementMutation,
//   useDeleteAnnouncementMutation,
// } from "@/features/announcements/announcementApi";
// import { toast } from "sonner";

// export default function AnnouncementsAdmin() {
//   const { data: list = [] } = useGetAnnouncementsQuery({ all: true });
//   const [createAnnouncement] = useCreateAnnouncementMutation();
//   const [updateAnnouncement] = useUpdateAnnouncementMutation();
//   const [deleteAnnouncement] = useDeleteAnnouncementMutation();

//   const [form, setForm] = useState({
//     title: "",
//     message: "",
//     type: "info",
//     isActive: true,
//     dismissible: true,
//   });

//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       await createAnnouncement(form).unwrap();
//       toast.success("Announcement created");
//       setForm({
//         title: "",
//         message: "",
//         type: "info",
//         isActive: true,
//         dismissible: true,
//       });
//     } catch (err) {
//       toast.error("Failed to create");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3">
//         <input
//           value={form.title}
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//           placeholder="Title"
//           className="w-full border p-2"
//           required
//         />
//         <textarea
//           value={form.message}
//           onChange={(e) => setForm({ ...form, message: e.target.value })}
//           placeholder="Message (HTML allowed)"
//           className="w-full border p-2"
//         />
//         <div className="flex gap-2">
//           <select
//             value={form.type}
//             onChange={(e) => setForm({ ...form, type: e.target.value })}
//             className="border p-2"
//           >
//             <option value="info">Info</option>
//             <option value="warning">Warning</option>
//             <option value="error">Error</option>
//             <option value="success">Success</option>
//           </select>
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={form.dismissible}
//               onChange={(e) =>
//                 setForm({ ...form, dismissible: e.target.checked })
//               }
//             />{" "}
//             Dismissible
//           </label>
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={form.isActive}
//               onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
//             />{" "}
//             Active
//           </label>
//         </div>
//         <button className="bg-blue-600 text-white px-4 py-2 rounded">
//           Create Announcement
//         </button>
//       </form>

//       {/* <div className="grid gap-3">
//         {list.map((a) => (
//           <div
//             key={a.id}
//             className="bg-white p-3 rounded shadow flex items-center justify-between"
//           >
//             <div>
//               <div className="font-semibold">{a.title}</div>
//               <div className="text-sm text-gray-600">{a.message}</div>
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={() =>
//                   updateAnnouncement({ id: a.id, isActive: !a.isActive })
//                     .unwrap()
//                     .then(() => toast.success("Updated"))
//                     .catch(() => toast.error("Fail"))
//                 }
//                 className="px-3 py-1 bg-yellow-500 rounded text-white"
//               >
//                 Toggle Active
//               </button>
//               <button
//                 onClick={() =>
//                   deleteAnnouncement(a.id)
//                     .unwrap()
//                     .then(() => toast.success("Deleted"))
//                     .catch(() => toast.error("Fail"))
//                 }
//                 className="px-3 py-1 bg-red-600 rounded text-white"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div> */}
//       <div className="grid gap-3">
//         {list.map((a) => (
//           <div
//             key={a.id}
//             className={`bg-white p-3 rounded shadow flex items-center justify-between border-l-4 ${
//               a.isActive ? "border-green-500" : "border-gray-400 opacity-70"
//             }`}
//           >
//             <div>
//               <div className="font-semibold">{a.title}</div>
//               <div
//                 className="text-sm text-gray-600"
//                 dangerouslySetInnerHTML={{ __html: a.message }}
//               />
//               <div className="text-xs mt-1">
//                 Status:{" "}
//                 <span
//                   className={a.isActive ? "text-green-600" : "text-gray-500"}
//                 >
//                   {a.isActive ? "Active" : "Inactive"}
//                 </span>
//               </div>
//             </div>

//             <div className="flex gap-2">
//               <button
//                 onClick={() =>
//                   updateAnnouncement({ id: a.id, isActive: !a.isActive })
//                     .unwrap()
//                     .then(() =>
//                       toast.success(
//                         a.isActive
//                           ? "Announcement Deactivated"
//                           : "Announcement Activated"
//                       )
//                     )
//                     .catch(() => toast.error("Failed to update"))
//                 }
//                 className={`px-3 py-1 rounded text-white ${
//                   a.isActive ? "bg-yellow-500" : "bg-green-600"
//                 }`}
//               >
//                 {a.isActive ? "Deactivate" : "Activate"}
//               </button>

//               <button
//                 onClick={() =>
//                   deleteAnnouncement(a.id)
//                     .unwrap()
//                     .then(() => toast.success("Deleted"))
//                     .catch(() => toast.error("Failed"))
//                 }
//                 className="px-3 py-1 bg-red-600 rounded text-white"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// import { useState } from "react";
// import {
//   useCreateAnnouncementMutation,
//   useGetAnnouncementsQuery,
//   useUpdateAnnouncementMutation,
//   useDeleteAnnouncementMutation,
// } from "@/features/announcements/announcementApi";
// import { toast } from "sonner";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog"; // shdcn Dialog

// export default function AnnouncementsAdmin() {
//   const { data: list = [], refetch } = useGetAnnouncementsQuery({ all: true });
//   const [createAnnouncement] = useCreateAnnouncementMutation();
//   const [updateAnnouncement] = useUpdateAnnouncementMutation();
//   const [deleteAnnouncement] = useDeleteAnnouncementMutation();

//   const [form, setForm] = useState({
//     title: "",
//     message: "",
//     type: "info",
//     isActive: true,
//     dismissible: true,
//   });

//   const [editForm, setEditForm] = useState(null); // <-- for edit

//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       await createAnnouncement(form).unwrap();
//       toast.success("Announcement created");
//       setForm({
//         title: "",
//         message: "",
//         type: "info",
//         isActive: true,
//         dismissible: true,
//       });
//     } catch {
//       toast.error("Failed to create");
//     }
//   };

//   const handleEditSubmit = async () => {
//     try {
//       await updateAnnouncement({ id: editForm.id, ...editForm }).unwrap();
//       toast.success("Announcement updated");
//       setEditForm(null); // close modal
//       refetch();
//     } catch {
//       toast.error("Failed to update");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Create form */}
//       <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3">
//         <input
//           value={form.title}
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//           placeholder="Title"
//           className="w-full border p-2"
//           required
//         />
//         <textarea
//           value={form.message}
//           onChange={(e) => setForm({ ...form, message: e.target.value })}
//           placeholder="Message (HTML allowed)"
//           className="w-full border p-2"
//         />
//         <div className="flex gap-2">
//           <select
//             value={form.type}
//             onChange={(e) => setForm({ ...form, type: e.target.value })}
//             className="border p-2"
//           >
//             <option value="info">Info</option>
//             <option value="warning">Warning</option>
//             <option value="error">Error</option>
//             <option value="success">Success</option>
//           </select>
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={form.dismissible}
//               onChange={(e) =>
//                 setForm({ ...form, dismissible: e.target.checked })
//               }
//             />{" "}
//             Dismissible
//           </label>
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={form.isActive}
//               onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
//             />{" "}
//             Active
//           </label>
//         </div>
//         <button className="bg-blue-600 text-white px-4 py-2 rounded">
//           Create Announcement
//         </button>
//       </form>

//       {/* Announcement list */}
//       <div className="grid gap-3">
//         {list.map((a) => (
//           <div
//             key={a.id}
//             className={`bg-white p-3 rounded shadow flex items-center justify-between border-l-4 ${
//               a.isActive ? "border-green-500" : "border-gray-400 opacity-70"
//             }`}
//           >
//             <div>
//               <div className="font-semibold">{a.title}</div>
//               <div
//                 className="text-sm text-gray-600"
//                 dangerouslySetInnerHTML={{ __html: a.message }}
//               />
//               <div className="text-xs mt-1">
//                 Status:{" "}
//                 <span
//                   className={a.isActive ? "text-green-600" : "text-gray-500"}
//                 >
//                   {a.isActive ? "Active" : "Inactive"}
//                 </span>
//               </div>
//             </div>

//             <div className="flex gap-2">
//               {/* Edit button */}
//               <Dialog
//                 open={!!editForm && editForm.id === a.id}
//                 onOpenChange={(open) => !open && setEditForm(null)}
//               >
//                 <DialogTrigger asChild>
//                   <button
//                     onClick={() => setEditForm(a)}
//                     className="px-3 py-1 bg-blue-600 rounded text-white"
//                   >
//                     Edit
//                   </button>
//                 </DialogTrigger>
//                 <DialogContent>
//                   <DialogHeader>
//                     <DialogTitle>Edit Announcement</DialogTitle>
//                   </DialogHeader>
//                   <div className="flex flex-col gap-2">
//                     <input
//                       value={editForm?.title || ""}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, title: e.target.value })
//                       }
//                       placeholder="Title"
//                       className="border p-2 w-full"
//                     />
//                     <textarea
//                       value={editForm?.message || ""}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, message: e.target.value })
//                       }
//                       placeholder="Message"
//                       className="border p-2 w-full"
//                     />
//                     <select
//                       value={editForm?.type || "info"}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, type: e.target.value })
//                       }
//                       className="border p-2 w-full"
//                     >
//                       <option value="info">Info</option>
//                       <option value="warning">Warning</option>
//                       <option value="error">Error</option>
//                       <option value="success">Success</option>
//                     </select>
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={editForm?.dismissible}
//                         onChange={(e) =>
//                           setEditForm({
//                             ...editForm,
//                             dismissible: e.target.checked,
//                           })
//                         }
//                       />{" "}
//                       Dismissible
//                     </label>
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={editForm?.isActive}
//                         onChange={(e) =>
//                           setEditForm({
//                             ...editForm,
//                             isActive: e.target.checked,
//                           })
//                         }
//                       />{" "}
//                       Active
//                     </label>
//                   </div>
//                   <DialogFooter className="flex gap-2 mt-4">
//                     <button
//                       onClick={handleEditSubmit}
//                       className="bg-green-600 text-white px-4 py-2 rounded"
//                     >
//                       Save
//                     </button>
//                     <button
//                       onClick={() => setEditForm(null)}
//                       className="bg-gray-400 text-white px-4 py-2 rounded"
//                     >
//                       Cancel
//                     </button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>

//               {/* Toggle Active */}
//               <button
//                 onClick={() =>
//                   updateAnnouncement({ id: a.id, isActive: !a.isActive })
//                     .unwrap()
//                     .then(() =>
//                       toast.success(a.isActive ? "Deactivated" : "Activated")
//                     )
//                     .catch(() => toast.error("Failed"))
//                 }
//                 className={`px-3 py-1 rounded text-white ${
//                   a.isActive ? "bg-yellow-500" : "bg-green-600"
//                 }`}
//               >
//                 {a.isActive ? "Deactivate" : "Activate"}
//               </button>

//               {/* Delete */}
//               <button
//                 onClick={() =>
//                   deleteAnnouncement(a.id)
//                     .unwrap()
//                     .then(() => toast.success("Deleted"))
//                     .catch(() => toast.error("Failed"))
//                 }
//                 className="px-3 py-1 bg-red-600 rounded text-white"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// src/pages/admin/AnnouncementsAdmin.jsx
// import { useState } from "react";
// import {
//   useCreateAnnouncementMutation,
//   useGetAnnouncementsQuery,
//   useUpdateAnnouncementMutation,
//   useDeleteAnnouncementMutation,
// } from "@/features/announcements/announcementApi";
// import { toast } from "sonner";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog"; // SHDCN Dialog

// export default function AnnouncementsAdmin() {
//   const { data: list = [], refetch } = useGetAnnouncementsQuery({ all: true });
//   const [createAnnouncement] = useCreateAnnouncementMutation();
//   const [updateAnnouncement] = useUpdateAnnouncementMutation();
//   const [deleteAnnouncement] = useDeleteAnnouncementMutation();

//   const [form, setForm] = useState({
//     title: "",
//     message: "",
//     type: "info",
//     isActive: true,
//     dismissible: true,
//   });

//   const [editForm, setEditForm] = useState(null); // for editing

//   // Create announcement
//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       await createAnnouncement(form).unwrap();
//       toast.success("Announcement created");
//       setForm({
//         title: "",
//         message: "",
//         type: "info",
//         isActive: true,
//         dismissible: true,
//       });
//       refetch();
//     } catch {
//       toast.error("Failed to create");
//     }
//   };

//   // Edit announcement
//   const handleEditSubmit = async () => {
//     try {
//       await updateAnnouncement({ id: editForm.id, ...editForm }).unwrap();
//       toast.success("Announcement updated");
//       setEditForm(null);
//       refetch();
//     } catch {
//       toast.error("Failed to update");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Create Form */}
//       <form
//         onSubmit={submit}
//         className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-end md:gap-2 flex-wrap"
//       >
//         <div className="flex-1 min-w-[150px] mb-2 md:mb-0">
//           <input
//             value={form.title}
//             onChange={(e) => setForm({ ...form, title: e.target.value })}
//             placeholder="Title"
//             className="w-full border p-2 rounded"
//             required
//           />
//         </div>
//         <div className="flex-1 min-w-[150px] mb-2 md:mb-0">
//           <textarea
//             value={form.message}
//             onChange={(e) => setForm({ ...form, message: e.target.value })}
//             placeholder="Message (HTML allowed)"
//             className="w-full border p-2 rounded"
//           />
//         </div>
//         <div className="flex gap-2 flex-wrap items-center">
//           <select
//             value={form.type}
//             onChange={(e) => setForm({ ...form, type: e.target.value })}
//             className="border p-2 rounded"
//           >
//             <option value="info">Info</option>
//             <option value="warning">Warning</option>
//             <option value="error">Error</option>
//             <option value="success">Success</option>
//           </select>

//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={form.dismissible}
//               onChange={(e) =>
//                 setForm({ ...form, dismissible: e.target.checked })
//               }
//             />
//             Dismissible
//           </label>

//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={form.isActive}
//               onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
//             />
//             Active
//           </label>

//           <button className="bg-blue-600 text-white px-4 py-2 rounded mt-2 md:mt-0">
//             Create
//           </button>
//         </div>
//       </form>

//       {/* Announcement List */}
//       <div className="space-y-3">
//         {list.map((a) => (
//           <div
//             key={a.id}
//             className={`bg-white p-3 rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between border-l-4 ${
//               a.isActive ? "border-green-500" : "border-gray-400 opacity-70"
//             }`}
//           >
//             {/* Content */}
//             <div className="flex-1 min-w-0">
//               <div className="font-semibold">{a.title}</div>
//               <div
//                 className="text-sm text-gray-600"
//                 dangerouslySetInnerHTML={{ __html: a.message }}
//               />
//               <div className="text-xs mt-1">
//                 Status:{" "}
//                 <span
//                   className={a.isActive ? "text-green-600" : "text-gray-500"}
//                 >
//                   {a.isActive ? "Active" : "Inactive"}
//                 </span>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
//               {/* Edit */}
//               <Dialog
//                 open={!!editForm && editForm.id === a.id}
//                 onOpenChange={(open) => !open && setEditForm(null)}
//               >
//                 <DialogTrigger asChild>
//                   <button
//                     onClick={() => setEditForm(a)}
//                     className="px-3 py-1 bg-blue-600 rounded text-white"
//                   >
//                     Edit
//                   </button>
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-lg w-full mx-2">
//                   <DialogHeader>
//                     <DialogTitle>Edit Announcement</DialogTitle>
//                   </DialogHeader>
//                   <div className="flex flex-col gap-2">
//                     <input
//                       value={editForm?.title || ""}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, title: e.target.value })
//                       }
//                       placeholder="Title"
//                       className="border p-2 w-full rounded"
//                     />
//                     <textarea
//                       value={editForm?.message || ""}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, message: e.target.value })
//                       }
//                       placeholder="Message"
//                       className="border p-2 w-full rounded"
//                     />
//                     <select
//                       value={editForm?.type || "info"}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, type: e.target.value })
//                       }
//                       className="border p-2 w-full rounded"
//                     >
//                       <option value="info">Info</option>
//                       <option value="warning">Warning</option>
//                       <option value="error">Error</option>
//                       <option value="success">Success</option>
//                     </select>
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={editForm?.dismissible}
//                         onChange={(e) =>
//                           setEditForm({
//                             ...editForm,
//                             dismissible: e.target.checked,
//                           })
//                         }
//                       />{" "}
//                       Dismissible
//                     </label>
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={editForm?.isActive}
//                         onChange={(e) =>
//                           setEditForm({
//                             ...editForm,
//                             isActive: e.target.checked,
//                           })
//                         }
//                       />{" "}
//                       Active
//                     </label>
//                   </div>
//                   <DialogFooter className="flex gap-2 mt-4">
//                     <button
//                       onClick={handleEditSubmit}
//                       className="bg-green-600 text-white px-4 py-2 rounded"
//                     >
//                       Save
//                     </button>
//                     <button
//                       onClick={() => setEditForm(null)}
//                       className="bg-gray-400 text-white px-4 py-2 rounded"
//                     >
//                       Cancel
//                     </button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>

//               {/* Toggle Active */}
//               <button
//                 onClick={() =>
//                   updateAnnouncement({ id: a.id, isActive: !a.isActive })
//                     .unwrap()
//                     .then(() =>
//                       toast.success(a.isActive ? "Deactivated" : "Activated")
//                     )
//                     .catch(() => toast.error("Failed"))
//                 }
//                 className={`px-3 py-1 rounded text-white ${
//                   a.isActive ? "bg-yellow-500" : "bg-green-600"
//                 }`}
//               >
//                 {a.isActive ? "Deactivate" : "Activate"}
//               </button>

//               {/* Delete */}
//               <button
//                 onClick={() =>
//                   deleteAnnouncement(a.id)
//                     .unwrap()
//                     .then(() => toast.success("Deleted"))
//                     .catch(() => toast.error("Failed"))
//                 }
//                 className="px-3 py-1 bg-red-600 rounded text-white"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// import { useState } from "react";
// import {
//   useCreateAnnouncementMutation,
//   useGetAnnouncementsQuery,
//   useUpdateAnnouncementMutation,
//   useDeleteAnnouncementMutation,
// } from "@/features/announcements/announcementApi";
// import { toast } from "sonner";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// export default function AnnouncementsAdmin() {
//   const { data: list = [], refetch } = useGetAnnouncementsQuery({ all: true });
//   const [createAnnouncement] = useCreateAnnouncementMutation();
//   const [updateAnnouncement] = useUpdateAnnouncementMutation();
//   const [deleteAnnouncement] = useDeleteAnnouncementMutation();

//   const [form, setForm] = useState({
//     title: "",
//     message: "",
//     type: "info",
//     isActive: true,
//     dismissible: true,
//     durationMinutes: "", // new
//   });

//   const [editForm, setEditForm] = useState(null); // for editing

//   // Create announcement
//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = { ...form };
//       if (form.type !== "success") delete payload.durationMinutes;
//       await createAnnouncement(payload).unwrap();
//       toast.success("Announcement created");
//       setForm({
//         title: "",
//         message: "",
//         type: "info",
//         isActive: true,
//         dismissible: true,
//         durationMinutes: "",
//       });
//       refetch();
//     } catch {
//       toast.error("Failed to create");
//     }
//   };

//   // Edit announcement
//   const handleEditSubmit = async () => {
//     try {
//       const payload = { ...editForm };
//       if (editForm.type !== "success") delete payload.durationMinutes;
//       await updateAnnouncement({ id: editForm.id, ...payload }).unwrap();
//       toast.success("Announcement updated");
//       setEditForm(null);
//       refetch();
//     } catch {
//       toast.error("Failed to update");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Create Form */}
//       <form
//         onSubmit={submit}
//         className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-end md:gap-2 flex-wrap"
//       >
//         <div className="flex-1 min-w-[150px] mb-2 md:mb-0">
//           <input
//             value={form.title}
//             onChange={(e) => setForm({ ...form, title: e.target.value })}
//             placeholder="Title"
//             className="w-full border p-2 rounded"
//             required
//           />
//         </div>
//         <div className="flex-1 min-w-[150px] mb-2 md:mb-0">
//           <textarea
//             value={form.message}
//             onChange={(e) => setForm({ ...form, message: e.target.value })}
//             placeholder="Message (HTML allowed)"
//             className="w-full border p-2 rounded"
//           />
//         </div>
//         <div className="flex gap-2 flex-wrap items-center">
//           <select
//             value={form.type}
//             onChange={(e) => setForm({ ...form, type: e.target.value })}
//             className="border p-2 rounded"
//           >
//             <option value="info">Info</option>
//             <option value="warning">Warning</option>
//             <option value="error">Error</option>
//             <option value="success">Success</option>
//           </select>

//           {/* Show duration input only for success */}
//           {form.type === "success" && (
//             <input
//               type="number"
//               min="1"
//               placeholder="Duration (minutes)"
//               value={form.durationMinutes}
//               onChange={(e) =>
//                 setForm({ ...form, durationMinutes: e.target.value })
//               }
//               className="border p-2 rounded w-32"
//               required
//             />
//           )}

//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={form.dismissible}
//               onChange={(e) =>
//                 setForm({ ...form, dismissible: e.target.checked })
//               }
//             />
//             Dismissible
//           </label>

//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={form.isActive}
//               onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
//             />
//             Active
//           </label>

//           <button className="bg-blue-600 text-white px-4 py-2 rounded mt-2 md:mt-0">
//             Create
//           </button>
//         </div>
//       </form>

//       {/* Announcement List */}
//       <div className="space-y-3">
//         {list.map((a) => (
//           <div
//             key={a.id}
//             className={`bg-white p-3 rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between border-l-4 ${
//               a.isActive ? "border-green-500" : "border-gray-400 opacity-70"
//             }`}
//           >
//             {/* Content */}
//             <div className="flex-1 min-w-0">
//               <div className="font-semibold">{a.title}</div>
//               <div
//                 className="text-sm text-gray-600"
//                 dangerouslySetInnerHTML={{ __html: a.message }}
//               />
//               <div className="text-xs mt-1">
//                 Status:{" "}
//                 <span
//                   className={a.isActive ? "text-green-600" : "text-gray-500"}
//                 >
//                   {a.isActive ? "Active" : "Inactive"}
//                 </span>
//                 {a.type === "success" && a.endsAt && (
//                   <> | Ends at: {new Date(a.endsAt).toLocaleString()}</>
//                 )}
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
//               {/* Edit */}
//               <Dialog
//                 open={!!editForm && editForm.id === a.id}
//                 onOpenChange={(open) => !open && setEditForm(null)}
//               >
//                 <DialogTrigger asChild>
//                   <button
//                     onClick={() => setEditForm(a)}
//                     className="px-3 py-1 bg-blue-600 rounded text-white"
//                   >
//                     Edit
//                   </button>
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-lg w-full mx-2">
//                   <DialogHeader>
//                     <DialogTitle>Edit Announcement</DialogTitle>
//                   </DialogHeader>
//                   <div className="flex flex-col gap-2">
//                     <input
//                       value={editForm?.title || ""}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, title: e.target.value })
//                       }
//                       placeholder="Title"
//                       className="border p-2 w-full rounded"
//                     />
//                     <textarea
//                       value={editForm?.message || ""}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, message: e.target.value })
//                       }
//                       placeholder="Message"
//                       className="border p-2 w-full rounded"
//                     />
//                     <select
//                       value={editForm?.type || "info"}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, type: e.target.value })
//                       }
//                       className="border p-2 w-full rounded"
//                     >
//                       <option value="info">Info</option>
//                       <option value="warning">Warning</option>
//                       <option value="error">Error</option>
//                       <option value="success">Success</option>
//                     </select>

//                     {/* Duration input for success type */}
//                     {editForm?.type === "success" && (
//                       <input
//                         type="number"
//                         min="1"
//                         placeholder="Duration (minutes)"
//                         value={editForm?.durationMinutes || ""}
//                         onChange={(e) =>
//                           setEditForm({
//                             ...editForm,
//                             durationMinutes: e.target.value,
//                           })
//                         }
//                         className="border p-2 w-32 rounded"
//                         required
//                       />
//                     )}

//                     <label className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={editForm?.dismissible}
//                         onChange={(e) =>
//                           setEditForm({
//                             ...editForm,
//                             dismissible: e.target.checked,
//                           })
//                         }
//                       />
//                       Dismissible
//                     </label>
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={editForm?.isActive}
//                         onChange={(e) =>
//                           setEditForm({
//                             ...editForm,
//                             isActive: e.target.checked,
//                           })
//                         }
//                       />
//                       Active
//                     </label>
//                   </div>
//                   <DialogFooter className="flex gap-2 mt-4">
//                     <button
//                       onClick={handleEditSubmit}
//                       className="bg-green-600 text-white px-4 py-2 rounded"
//                     >
//                       Save
//                     </button>
//                     <button
//                       onClick={() => setEditForm(null)}
//                       className="bg-gray-400 text-white px-4 py-2 rounded"
//                     >
//                       Cancel
//                     </button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>

//               {/* Toggle Active */}
//               <button
//                 onClick={() =>
//                   updateAnnouncement({ id: a.id, isActive: !a.isActive })
//                     .unwrap()
//                     .then(() =>
//                       toast.success(a.isActive ? "Deactivated" : "Activated")
//                     )
//                     .catch(() => toast.error("Failed"))
//                 }
//                 className={`px-3 py-1 rounded text-white ${
//                   a.isActive ? "bg-yellow-500" : "bg-green-600"
//                 }`}
//               >
//                 {a.isActive ? "Deactivate" : "Activate"}
//               </button>

//               {/* Delete */}
//               <button
//                 onClick={() =>
//                   deleteAnnouncement(a.id)
//                     .unwrap()
//                     .then(() => toast.success("Deleted"))
//                     .catch(() => toast.error("Failed"))
//                 }
//                 className="px-3 py-1 bg-red-600 rounded text-white"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import {
  useCreateAnnouncementMutation,
  useGetAnnouncementsQuery,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} from "@/features/announcements/announcementApi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AnnouncementsAdmin() {
  const { data: list = [], refetch } = useGetAnnouncementsQuery({ all: true });
  const [createAnnouncement] = useCreateAnnouncementMutation();
  const [updateAnnouncement] = useUpdateAnnouncementMutation();
  const [deleteAnnouncement] = useDeleteAnnouncementMutation();

  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "info",
    isActive: true,
    dismissible: true,
    durationMinutes: 5, // default 60 minutes for success
  });

  const [editForm, setEditForm] = useState(null); // for editing

  // Handle type change to reset duration default
  const handleTypeChange = (type) => {
    setForm({
      ...form,
      type,
      durationMinutes: type === "success" ? 5 : "",
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (form.type !== "success") delete payload.durationMinutes;
      await createAnnouncement(payload).unwrap();
      toast.success("Announcement created");
      setForm({
        title: "",
        message: "",
        type: "info",
        isActive: true,
        dismissible: true,
        durationMinutes: 5,
      });
      refetch();
    } catch {
      toast.error("Failed to create");
    }
  };

  const handleEditSubmit = async () => {
    try {
      const payload = { ...editForm };
      if (editForm.type !== "success") delete payload.durationMinutes;
      await updateAnnouncement({ id: editForm.id, ...payload }).unwrap();
      toast.success("Announcement updated");
      setEditForm(null);
      refetch();
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Form */}
      <form
        onSubmit={submit}
        className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-end md:gap-2 flex-wrap"
      >
        <div className="flex-1 min-w-[150px] mb-2 md:mb-0">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="flex-1 min-w-[150px] mb-2 md:mb-0">
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Message (HTML allowed)"
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <select
            value={form.type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="success">Success</option>
          </select>

          {form.type === "success" && (
            <input
              type="number"
              min="1"
              placeholder="Duration (minutes)"
              value={form.durationMinutes}
              onChange={(e) =>
                setForm({ ...form, durationMinutes: e.target.value })
              }
              className="border p-2 rounded w-32"
              required
            />
          )}

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.dismissible}
              onChange={(e) =>
                setForm({ ...form, dismissible: e.target.checked })
              }
            />
            Dismissible
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Active
          </label>

          <button className="bg-blue-600 text-white px-4 py-2 rounded mt-2 md:mt-0">
            Create
          </button>
        </div>
      </form>

      {/* Announcement List */}
      <div className="space-y-3">
        {list.map((a) => (
          <div
            key={a.id}
            className={`bg-white p-3 rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between border-l-4 ${
              a.isActive ? "border-green-500" : "border-gray-400 opacity-70"
            }`}
          >
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold">{a.title}</div>
              <div
                className="text-sm text-gray-600"
                dangerouslySetInnerHTML={{ __html: a.message }}
              />
              <div className="text-xs mt-1 flex flex-wrap gap-2">
                <span>
                  Status:{" "}
                  <span
                    className={a.isActive ? "text-green-600" : "text-gray-500"}
                  >
                    {a.isActive ? "Active" : "Inactive"}
                  </span>
                </span>
                <span>
                  Type:{" "}
                  <span
                    className={`${
                      a.type === "success"
                        ? "text-green-700"
                        : a.type === "error"
                        ? "text-red-600"
                        : a.type === "warning"
                        ? "text-yellow-600"
                        : "text-blue-600"
                    } font-semibold`}
                  >
                    {a.type.charAt(0).toUpperCase() + a.type.slice(1)}
                  </span>
                </span>
                {a.type === "success" && a.endsAt && (
                  <span>Ends at: {new Date(a.endsAt).toLocaleString()}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              {/* Edit */}
              <Dialog
                open={!!editForm && editForm.id === a.id}
                onOpenChange={(open) => !open && setEditForm(null)}
              >
                <DialogTrigger asChild>
                  <button
                    onClick={() => setEditForm(a)}
                    className="px-3 py-1 bg-blue-600 rounded text-white"
                  >
                    Edit
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg w-full mx-2">
                  <DialogHeader>
                    <DialogTitle>Edit Announcement</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-2">
                    <input
                      value={editForm?.title || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      placeholder="Title"
                      className="border p-2 w-full rounded"
                    />
                    <textarea
                      value={editForm?.message || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, message: e.target.value })
                      }
                      placeholder="Message"
                      className="border p-2 w-full rounded"
                    />
                    <select
                      value={editForm?.type || "info"}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          type: e.target.value,
                          durationMinutes:
                            e.target.value === "success"
                              ? editForm?.durationMinutes || 5
                              : "",
                        })
                      }
                      className="border p-2 w-full rounded"
                    >
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                      <option value="success">Success</option>
                    </select>

                    {editForm?.type === "success" && (
                      <input
                        type="number"
                        min="1"
                        placeholder="Duration (minutes)"
                        value={editForm?.durationMinutes || 5}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            durationMinutes: e.target.value,
                          })
                        }
                        className="border p-2 w-32 rounded"
                        required
                      />
                    )}

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editForm?.dismissible}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            dismissible: e.target.checked,
                          })
                        }
                      />
                      Dismissible
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editForm?.isActive}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            isActive: e.target.checked,
                          })
                        }
                      />
                      Active
                    </label>
                  </div>
                  <DialogFooter className="flex gap-2 mt-4">
                    <button
                      onClick={handleEditSubmit}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditForm(null)}
                      className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Toggle Active */}
              <button
                onClick={() =>
                  updateAnnouncement({ id: a.id, isActive: !a.isActive })
                    .unwrap()
                    .then(() =>
                      toast.success(a.isActive ? "Deactivated" : "Activated")
                    )
                    .catch(() => toast.error("Failed"))
                }
                className={`px-3 py-1 rounded text-white ${
                  a.isActive ? "bg-yellow-500" : "bg-green-600"
                }`}
              >
                {a.isActive ? "Deactivate" : "Activate"}
              </button>

              {/* Delete */}
              <button
                onClick={() =>
                  deleteAnnouncement(a.id)
                    .unwrap()
                    .then(() => toast.success("Deleted"))
                    .catch(() => toast.error("Failed"))
                }
                className="px-3 py-1 bg-red-600 rounded text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
