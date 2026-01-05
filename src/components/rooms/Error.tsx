export default function RoomError() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-heading mb-2">
          Room Not Found
        </h2>
        <p className="text-para-muted">
          The room you're looking for doesn't exist or you don't have access to
          it.
        </p>
      </div>
    </div>
  );
}
