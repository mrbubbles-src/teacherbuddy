/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from 'next/og';

/**
 * Serves the shared TeacherBuddy Open Graph image (1200×630) for link previews.
 */
export async function GET() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1e1e2e',
      }}>
      <img
        src="https://teacherbuddy.mrbubbles-src.dev/logo-og.png"
        style={{ width: 895, height: 372 }}
        alt="TeacherBuddy Logo"
      />
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
