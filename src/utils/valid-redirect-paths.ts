export function checkValidRedirectPath(path: string) {
  // I want all paths
  const validPaths = [
    "/rooms",
    "/dashboard",
    "/calendar",
    "/profile",
    "/settings",
    "/ai-assistant",
    "/notes",
    "/explore-rooms",
  ];
  return validPaths.includes(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000" + path
  );
}
