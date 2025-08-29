export async function apiFetch<T, TBody = unknown>(
  path: string,
  options: { method?: string; body?: TBody; idToken?: string } = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.idToken) headers["Authorization"] = `Bearer ${options.idToken}`;
  const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + path, {
    method: options.method || 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return (await res.json()) as T;
}