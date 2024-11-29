import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.get('/tasks').then((res) => res.data),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome, {user?.username}!</h1>
          <p className="mt-2 text-gray-600">You are logged in as: {user?.role}</p>
          
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900">Your Tasks Overview</h2>
            <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Tasks</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{tasks?.length || 0}</dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}