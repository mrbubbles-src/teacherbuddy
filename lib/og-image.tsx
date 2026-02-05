import { ImageResponse } from 'next/og';

/**
 * Accessible alt text used for Open Graph image metadata.
 */
export const OG_IMAGE_ALT = 'TeacherBuddy classroom dashboard preview';

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
export const OG_IMAGE_CONTENT_TYPE = 'image/png';

/**
 * Generates the shared TeacherBuddy Open Graph image response.
 */
export function createOpenGraphImageResponse(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background:
          'linear-gradient(135deg, rgb(17, 17, 27) 0%, rgb(30, 30, 46) 55%, rgb(49, 50, 68) 100%)',
        color: 'rgb(205, 214, 244)',
        padding: '72px',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial',
        justifyContent: 'space-between',
        alignItems: 'stretch',
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '70%',
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: 32,
            fontWeight: 600,
            opacity: 0.96,
          }}>
          <div
            style={{
              display: 'flex',
              width: 28,
              height: 28,
              borderRadius: '999px',
              backgroundColor: 'rgb(245, 194, 231)',
            }}
          />
          TeacherBuddy
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            marginBottom: '10px',
          }}>
          <div
            style={{
              display: 'flex',
              fontSize: 78,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.02,
              color: 'rgb(242, 205, 205)',
            }}>
            Classroom Tools
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 34,
              lineHeight: 1.25,
              color: 'rgb(166, 173, 200)',
            }}>
            Manage students, run quizzes, and organize class activities in one
            place.
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          width: 230,
          borderRadius: 32,
          background:
            'linear-gradient(180deg, rgba(137, 180, 250, 0.35) 0%, rgba(137, 180, 250, 0.08) 100%)',
          border: '1px solid rgba(205, 214, 244, 0.28)',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          fontWeight: 600,
          color: 'rgb(205, 214, 244)',
        }}>
        TeacherBuddy
      </div>
    </div>,
    {
      ...OG_IMAGE_SIZE,
    },
  );
}
