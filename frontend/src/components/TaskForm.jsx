import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select"; // Import React-Select
import api from "../api/axios";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";

export default function TaskForm({ onSuccess }) {
  const { register, handleSubmit, reset, setValue } = useForm();
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  // Fetching the list of users
  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/users").then((res) => res.data),
    enabled: user?.role === "admin",
  });

  // Mutation for creating a task
  const createTask = useMutation({
    mutationFn: (data) => api.post("/tasks", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task created successfully");
      reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  // Submit handler
  const onSubmit = (data) => {
    createTask.mutate(data);
  };

  // Transform users into React-Select format
  const employeeOptions =
    users
      ?.filter((u) => u.role === "employee")
      .map((u) => ({
        value: u._id,
        label: `${u.username} (${u.email})`,
      })) || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          {...register("title", { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <input
          {...register("description", { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Assign to
        </label>
        {isUsersLoading ? (
          <p>Loading employees...</p>
        ) : (
          <Select
            options={employeeOptions}
            onChange={(selected) => setValue("assignedTo", selected.value)}
            placeholder="Search and select an employee"
            className="mt-1"
          />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          {...register("priority")}
          className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={createTask.isLoading}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {createTask.isLoading ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}
