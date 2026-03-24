type BlobConfig = {
  width: number;
  height: number;
  background: string;
  animation: string;
  top?: number | string;
  left?: number;
  bottom?: number;
  right?: number;
};

const BLOBS: BlobConfig[] = [
  {
    width: 380,
    height: 380,
    top: -50,
    left: -100,
    background:
      'radial-gradient(circle,#f97316 0%,#ec4899 55%,transparent 100%)',
    animation: 'blob1 28s ease-in-out infinite',
  },
  {
    width: 380,
    height: 380,
    bottom: 40,
    left: -80,
    background:
      'radial-gradient(circle,#7c3aed 0%,#4f46e5 65%,transparent 100%)',
    animation: 'blob2 34s ease-in-out infinite',
  },
  {
    width: 400,
    height: 400,
    top: '25%',
    right: -110,
    background:
      'radial-gradient(circle,#06b6d4 0%,#3b82f6 65%,transparent 100%)',
    animation: 'blob3 40s ease-in-out infinite',
  },
] as const;

export const Blobs = ({ opacity }: { opacity: number }) => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {BLOBS.map(
      (
        { animation, background, width, height, top, left, bottom, right },
        i,
      ) => (
        <div
          key={i}
          className="absolute rounded-full blur-[75px] will-change-transform"
          style={{
            width,
            height,
            top,
            left,
            bottom,
            right,
            opacity,
            background,
            animation,
          }}
        />
      ),
    )}
  </div>
);
