/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from 'next/og';

/** Text used to subset the font so only needed glyphs are loaded. */
const OG_TEXT =
  'TeacherBuddy Logo Manage students, run quizzes, and organize class activities in one place.';

/**
 * Fetches Geist font data from Google Fonts for the given weight.
 * Used so the OG image can use the same font as the app (Geist), with system fallbacks.
 * Prefers TTF/OTF URLs (Satori supports those); otherwise uses the first url() in the CSS.
 */
async function loadGeistFont(weight: 400 | 700): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=Geist:wght@${weight}&text=${encodeURIComponent(OG_TEXT)}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Next.js OG; +https://nextjs.org)',
    },
  });
  const css = await res.text();
  const ttfMatch = css.match(
    /src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/,
  );
  const fallbackMatch = css.match(/src: url\(([^)]+)\)/);
  const fontUrl = (ttfMatch?.[1] ?? fallbackMatch?.[1])
    ?.trim()
    .replace(/^['"]|['"]$/g, '');
  if (fontUrl) {
    const fontRes = await fetch(fontUrl);
    if (fontRes.ok) return fontRes.arrayBuffer();
  }
  throw new Error(`Failed to load Geist font (weight ${weight})`);
}

const FONT_FAMILY = 'Geist, Segoe UI, Tahoma, Geneva, Verdana, sans-serif';

/**
 * Serves the shared TeacherBuddy Open Graph image (1200×630) for link previews.
 * Uses the app font (Geist) when available, with system fonts as fallback.
 */
export async function GET() {
  const [geistRegular, geistBold] = await Promise.all([
    loadGeistFont(400),
    loadGeistFont(700),
  ]);

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
        color: '#cdd6f4',
        fontFamily: FONT_FAMILY,
      }}>
      <img
        src="https://www.teacherbuddy.mrbubbles-src.dev/logo-og.svg"
        style={{ width: 650, height: 160, display: 'flex' }}
        alt="TeacherBuddy Logo"
      />
      <p style={{ fontSize: 16, fontWeight: 700 }}>
        Manage students, run quizzes,
        <br />
        and organize class activities in one place.
      </p>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Geist', data: geistRegular, style: 'normal', weight: 400 },
        { name: 'Geist', data: geistBold, style: 'normal', weight: 700 },
      ],
    },
  );
}
