// src/pages/user/EditProfile.jsx
import { useState } from "react";
import { useUpdateProfileMutation } from "@/features/user/userApi";
import { toast } from "sonner";

export default function EditProfile() {
  const [updateProfile] = useUpdateProfileMutation();
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(form).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["firstName", "lastName", "phone"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-600 capitalize">
              {field}
            </label>
            <input
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full mt-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
