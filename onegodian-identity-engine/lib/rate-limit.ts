type Bucket = { count: number; expiresAt: number };

const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.expiresAt <= now) {
    buckets.set(key, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (bucket.count >= max) {
    return false;
  }

  bucket.count += 1;
  buckets.set(key, bucket);
  return true;
}

export function clientKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for') ?? 'unknown';
  return forwarded.split(',')[0]?.trim() || 'unknown';
}
