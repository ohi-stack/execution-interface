export async function GET() {
  return Response.json({ app: 'OMOS Runtime', status: 'ok', version: '1.0.0' });
}
