export const AdminLoading = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 bg-gray-300 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-64 animate-pulse"></div>
        </div>
        <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-300 rounded w-16"></div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <th key={i} className="px-6 py-3">
                    <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row}>
                  {[1, 2, 3, 4, 5, 6].map((cell) => (
                    <td key={cell} className="px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};