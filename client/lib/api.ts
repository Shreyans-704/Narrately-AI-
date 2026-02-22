/**
 * Returns the full URL for a given API path.
 *
 * In production (Firebase hosting → Railway backend) `VITE_API_URL` is set to
 * the Railway origin so that `/api/...` calls reach the correct server.
 *
 * In local development (integrated Vite + Express server) `VITE_API_URL` is
 * empty and relative paths are used — no change needed.
 *
 * Usage:
 *   fetch(apiUrl('/api/admin/users'))
 *   fetch(apiUrl(`/api/admin/users/${id}/credits`), { method: 'PATCH', ... })
 */
export function apiUrl(path: string): string {
  const base = import.meta.env.VITE_API_URL ?? '';
  // Avoid double-slashes when base already has trailing slash
  return base ? `${base.replace(/\/$/, '')}${path}` : path;
}
