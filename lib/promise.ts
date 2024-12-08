export async function generateServerActionPromise<T>(
  promise: Promise<{ success: boolean; message?: string; data?: T }>
): Promise<{ message?: string; data?: T } | undefined> {
  const { success, data, message } = await promise;
  if (!success) {
    throw new Error(message);
  }
  return { data, message };
}
