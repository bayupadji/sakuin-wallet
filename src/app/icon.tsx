import { ImageResponse } from 'next/og';

export const size = {
  width: 512,
  height: 512,
};

export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: 112,
        }}
      >
        <svg
          width="300"
          height="300"
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

