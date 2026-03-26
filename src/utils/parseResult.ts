export const parseResult = <T = unknown>(result: unknown): T | null => {
  try {
    return (typeof result === 'string' ? JSON.parse(result) : result) as T;
  } catch {
    return null;
  }
};
