export default function DashboardSkeleton() {
  return (
    <div className="sm:px-6 px-4 sm:py-6 py-4 animate-pulse">
      <div className="flex gap-6 items-start">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Hero Section - Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-secondary/10 rounded-xl border border-light-border"
              />
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-light-border" />

          {/* Assignments & Announcements Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Assignments */}
            <div className="h-80 bg-secondary/10 rounded-xl border border-light-border" />

            {/* Announcements */}
            <div className="h-80 bg-secondary/10 rounded-xl border border-light-border" />
          </div>

          {/* Divider */}
          <div className="border-t border-light-border" />

          {/* My Rooms */}
          <div className="h-64 bg-secondary/10 rounded-xl border border-light-border" />

          {/* Divider */}
          <div className="border-t border-light-border" />

          {/* Focus Analytics */}
          <div className="h-80 bg-secondary/10 rounded-xl border border-light-border" />
        </div>

        {/* Right Sidebar Widgets */}
        <div className="w-80 hidden lg:block">
          <div className="space-y-4">
            {/* Calendar */}
            <div className="h-96 bg-secondary/10 rounded-xl border border-light-border" />

            {/* Tasks Today */}
            <div className="h-64 bg-secondary/10 rounded-xl border border-light-border" />

            {/* Streak Counter */}
            <div className="h-32 bg-secondary/10 rounded-xl border border-light-border" />

            {/* Rewards Widget */}
            <div className="h-40 bg-secondary/10 rounded-xl border border-light-border" />
          </div>
        </div>
      </div>
    </div>
  );
}
