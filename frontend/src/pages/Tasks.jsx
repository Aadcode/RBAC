import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import useAuthStore from "../store/authStore";

export default function Tasks() {
  const user = useAuthStore((state) => state.user);

  const canCreateTask = ["admin", "manager"].includes(user?.role); // Check if user can create tasks

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
          <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
          {canCreateTask && (
            <div className="mt-4">
              <TaskForm />
            </div>
          )}
          <TaskList userRole={user.role} />
        </div>
      </div>
    </div>
  );
}
