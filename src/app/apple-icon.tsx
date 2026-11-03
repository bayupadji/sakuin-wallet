import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1D9BF0',
          borderRadius: 40,
        }}
      >
        <svg
          width="104"
          height="104"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
          <path d="M8 8V6a4 4 0 0 1 8 0v2" />
        </svg>
      </div>
    ),
    { ...size }
  );
}

