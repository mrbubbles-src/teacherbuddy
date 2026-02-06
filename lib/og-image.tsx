/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from 'next/og';

/**
 * Accessible alt text used for Open Graph image metadata.
 */
export const OG_IMAGE_ALT = 'TeacherBuddy Logo';

/**
 * Pixel dimensions used for the generated Open Graph image.
 */
export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
};

/**
 * MIME type returned by the Open Graph image route.
 */
export const OG_IMAGE_CONTENT_TYPE = 'image/svg+xml';

/**
 * Generates the shared TeacherBuddy Open Graph image response.
 */
export function createOpenGraphImageResponse(): ImageResponse {
  const imageUrl = 'https://teacherbuddy.mrbubbles-src.dev/logo-og.svg';

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgb(15, 15, 28)',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <img
        src={imageUrl}
        alt={OG_IMAGE_ALT}
        width={895}
        height={372}
        style={{ display: 'flex' }}
      />
    </div>,
    {
      ...OG_IMAGE_SIZE,
    },
  );
}
