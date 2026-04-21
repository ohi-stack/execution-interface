export function errorHandler(err: unknown, _req: any, res: any, _next: any) {
  const message = err instanceof Error ? err.message : "Internal server error";
  return res.status(500).json({ error: message });
}
