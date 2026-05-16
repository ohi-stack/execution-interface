import { NextResponse } from 'next/server';

const APP_NAME = 'OneGodian Control Plane';
const APP_VERSION = process.env.npm_package_version ?? '0.1.0';
const BUILD_MARKER = process.env.BUILD_MARKER ?? process.env.VERCEL_GIT_COMMIT_SHA ?? 'unknown';

export async function GET() {
  return NextResponse.json({
    app: APP_NAME,
    version: APP_VERSION,
    buildMarker: BUILD_MARKER,
    timestamp: new Date().toISOString()
  });
}
