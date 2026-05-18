import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { GalleryManager } from "../components/admin/GalleryManager";

export default async function AdminPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Optional: Add role-based access control
  // const isAdmin = user?.publicMetadata?.role === "admin";
  // if (!isAdmin) {
  //   redirect("/");
  // }

  return (
    <div className="min-h-screen bg-page-secondary">
      {/* Header */}
      <header className="bg-page-primary shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
             
              <p className="text-secondary mt-1">
                Welcome back, {user.firstName || user.username}!
              </p>
            </div>
            
            <div className="flex items-center gap-4">
             
              
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex space-x-8 border-b border-light">
            <a
              href="#"
              className="border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 px-1 pb-4 text-sm font-medium"
            >
              Gallery Management
            </a>
           
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="text-sm font-medium mb-2">Total Gallery Items</div>
              <div className="text-3xl font-bold">12</div>
              <div className="text-sm opacity-90 mt-2">From all categories</div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="text-sm font-medium mb-2">Active Projects</div>
              <div className="text-3xl font-bold">8</div>
              <div className="text-sm opacity-90 mt-2">Currently in progress</div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="text-sm font-medium mb-2">This Month</div>
              <div className="text-3xl font-bold">3</div>
              <div className="text-sm opacity-90 mt-2">New items added</div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <div className="text-sm font-medium mb-2">User Engagement</div>
              <div className="text-3xl font-bold">89%</div>
              <div className="text-sm opacity-90 mt-2">Gallery view rate</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="bg-page-primary p-4 rounded-xl shadow hover:shadow-md transition-shadow text-left group">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <span className="text-blue-600 dark:text-blue-400 text-xl">🖼️</span>
                </div>
                <div className="font-medium text-primary mb-1">Add Gallery Item</div>
                <div className="text-sm text-secondary">Create new printing project</div>
              </button>
              
              <button className="bg-page-primary p-4 rounded-xl shadow hover:shadow-md transition-shadow text-left group">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <span className="text-green-600 dark:text-green-400 text-xl">📊</span>
                </div>
                <div className="font-medium text-primary mb-1">View Analytics</div>
                <div className="text-sm text-secondary">Gallery performance metrics</div>
              </button>
              
              <button className="bg-page-primary p-4 rounded-xl shadow hover:shadow-md transition-shadow text-left group">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <span className="text-purple-600 dark:text-purple-400 text-xl">⚙️</span>
                </div>
                <div className="font-medium text-primary mb-1">Categories</div>
                <div className="text-sm text-secondary">Manage project categories</div>
              </button>
              
              <button className="bg-page-primary p-4 rounded-xl shadow hover:shadow-md transition-shadow text-left group">
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <span className="text-orange-600 dark:text-orange-400 text-xl">📤</span>
                </div>
                <div className="font-medium text-primary mb-1">Export Data</div>
                <div className="text-sm text-secondary">Download gallery data</div>
              </button>
            </div>
          </div>

          {/* Gallery Management Section */}
          <div className="bg-page-primary rounded-2xl shadow-lg overflow-hidden">
            <GalleryManager />
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-page-primary rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { action: 'Added new item', item: 'Premium Leather Business Cards', time: '2 hours ago', user: 'You' },
                { action: 'Updated category', item: 'Eco-Friendly Packaging', time: 'Yesterday', user: 'Admin' },
                { action: 'Deleted item', item: 'Old Brochure Design', time: '2 days ago', user: 'You' },
                { action: 'Added tags', item: 'Custom Wine Labels', time: '3 days ago', user: 'Editor' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-light last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.action.includes('Added') ? 'bg-green-100 dark:bg-green-900' :
                      activity.action.includes('Updated') ? 'bg-blue-100 dark:bg-blue-900' :
                      activity.action.includes('Deleted') ? 'bg-red-100 dark:bg-red-900' :
                      'bg-yellow-100 dark:bg-yellow-900'
                    }`}>
                      <span className={`text-sm ${
                        activity.action.includes('Added') ? 'text-green-600 dark:text-green-400' :
                        activity.action.includes('Updated') ? 'text-blue-600 dark:text-blue-400' :
                        activity.action.includes('Deleted') ? 'text-red-600 dark:text-red-400' :
                        'text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {activity.action.includes('Added') ? '+' :
                         activity.action.includes('Updated') ? '↻' :
                         activity.action.includes('Deleted') ? '×' : '#'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-primary">
                        {activity.action}: <span className="font-normal">{activity.item}</span>
                      </div>
                      <div className="text-sm text-tertiary">
                        By {activity.user} • {activity.time}
                      </div>
                    </div>
                  </div>
                  <button className="text-tertiary hover:text-gray-600 dark:hover:text-gray-300">
                    ⋮
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-light py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-secondary text-sm">
              © {new Date().getFullYear()} Awais Printers Admin Dashboard. All rights reserved.
            </div>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-secondary hover:text-gray-900 dark:hover:text-gray-300">
                Documentation
              </a>
              <a href="#" className="text-sm text-secondary hover:text-gray-900 dark:hover:text-gray-300">
                Support
              </a>
              <a href="#" className="text-sm text-secondary hover:text-gray-900 dark:hover:text-gray-300">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}