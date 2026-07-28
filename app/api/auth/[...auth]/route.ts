import { auth } from '@/lib/auth';
import { NextRequest } from 'next/server';

// Create universal handlers by passing the web standard Request object directly to better-auth
export async function GET(request: NextRequest) {
  return auth.handler(request);
}

export async function POST(request: Request) {
  return auth.handler(request);
}
