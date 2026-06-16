import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

// Convert the main Better-Auth instance into Next.js App Router handlers
const handler = toNextJsHandler(auth);

export const GET = handler.GET;
export const POST = handler.POST;
