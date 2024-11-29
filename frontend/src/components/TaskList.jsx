import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { canManageTasks } from "../utils/roleUtils.js";
import { toast } from "react-hot-toast";
import Select from "react-select"; // Import react-select

export default function TaskList({ userRole }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: tasks,
    isLoading: isLoadingTasks,
    refetch,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => api.get("/tasks").then((res) => res.data),
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/users").then((res) => res.data),
  });

  // Filter employees
  const employeeOptions =
    users
      ?.filter((u) => u.role === "employee")
      .map((u) => ({
        value: u._id,
        label: `${u.username} (${u.email})`,
      })) || [];

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success("Task deleted successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Failed to delete task:", error);
    }
  };

  const handleUpdate = (task) => {
    setTaskToUpdate(task);
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async (updatedTask) => {
    try {
      const payload =
        userRole === "employee"
          ? { status: updatedTask.status }
          : {
              title: updatedTask.title,
              description: updatedTask.description,
              priority: updatedTask.priority,
              status: updatedTask.status,
              assignedTo: updatedTask.assignedTo?.value, // Using the ObjectId for assignedTo
              createdBy: updatedTask.createdBy, // Use createdBy ObjectId
            };

      // Update the task in the backend
      await api.put(`/tasks/${updatedTask._id}`, payload);
      toast.success("Task updated successfully!");
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Failed to update task:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTaskToUpdate(null);
    setSearchTerm("");
  };

  if (isLoadingTasks) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <div className="flow-root">
        <ul role="list" className="-my-5 divide-gray-200">
          {tasks.map((task) => (
            <li key={task._id} className="py-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  {task.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {task.description}
                </p>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {task.status}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span className="text-xs text-gray-500">
                    Assigned to: {task.assignedTo?.username || "Unassigned"}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  {canManageTasks(userRole) && (
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  )}
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => handleUpdate(task)}
                  >
                    Update
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mx-auto space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
              Update Task
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateSubmit(taskToUpdate);
              }}
              className="space-y-4"
            >
              {userRole !== "employee" && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      value={taskToUpdate.title}
                      onChange={(e) =>
                        setTaskToUpdate({
                          ...taskToUpdate,
                          title: e.target.value,
                        })
                      }
                      className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={taskToUpdate.description}
                      onChange={(e) =>
                        setTaskToUpdate({
                          ...taskToUpdate,
                          description: e.target.value,
                        })
                      }
                      className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      rows="3"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Priority
                    </label>
                    <select
                      value={taskToUpdate.priority}
                      onChange={(e) =>
                        setTaskToUpdate({
                          ...taskToUpdate,
                          priority: e.target.value,
                        })
                      }
                      className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Assign To
                    </label>
                    {isLoadingUsers ? (
                      <p>Loading employees...</p>
                    ) : (
                      <Select
                        options={employeeOptions}
                        onChange={(selected) =>
                          setTaskToUpdate({
                            ...taskToUpdate,
                            assignedTo: selected, // Pass the selected ObjectId here
                          })
                        }
                        placeholder="Search and select an employee"
                        className="mt-1"
                      />
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={taskToUpdate.status}
                  onChange={(e) =>
                    setTaskToUpdate({
                      ...taskToUpdate,
                      status: e.target.value,
                    })
                  }
                  className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
