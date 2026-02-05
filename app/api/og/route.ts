import { createOpenGraphImageResponse } from '@/lib/og-image';

/**
 * Forces the OG image route to run on the edge runtime for fast global responses.
 */
export const runtime = 'edge';

/**
 * Serves the generated Open Graph image through an API-style route.
 */
export function GET() {
  return createOpenGraphImageResponse();
}
