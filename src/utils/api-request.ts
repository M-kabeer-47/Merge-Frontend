export default async function apiRequest<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    // Optionally log or transform error here
    throw error;
  }
}
