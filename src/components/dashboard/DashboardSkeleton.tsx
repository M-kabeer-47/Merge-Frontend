export default function DashboardSkeleton() {
  return (
    <div className="sm:px-6 px-4 sm:py-6 py-4">
      <div className="flex gap-6 items-start">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Hero Section - Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-light-border" />

          {/* Assignments & Announcements Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Assignments */}
            <div className="h-80 bg-gray-200 rounded-lg animate-pulse" />

            {/* Announcements */}
            <div className="h-80 bg-gray-200 rounded-lg animate-pulse" />
          </div>

          {/* Divider */}
          <div className="border-t border-light-border" />

          {/* My Rooms */}
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />

          {/* Divider */}
          <div className="border-t border-light-border" />

          {/* Focus Analytics */}
          <div className="h-80 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Right Sidebar Widgets */}
        <div className="w-80 hidden lg:block">
          <div className="space-y-4">
            {/* Calendar */}
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />

            {/* Tasks Today */}
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />

            {/* Streak Counter */}
            <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />

            {/* Rewards Widget */}
            <div className="h-40 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
