const videos = [
  {
    src: 'https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4',
    position: 'left top',
  },
  {
    src: 'https://storage.googleapis.com/coverr-main/mp4/Footboys.mp4',
    position: 'right top',
  },
  {
    src: 'https://storage.googleapis.com/coverr-main/mp4/Skater.mp4',
    position: 'left bottom',
  },
  {
    src: 'https://storage.googleapis.com/coverr-main/mp4/Taking_a_Stroll.mp4',
    position: 'right bottom',
  },
];

type PanelProps = {
  index: number;
  clipPath: string;
};

function OctaPanel({ index, clipPath }: PanelProps) {
  return (
    <div
      className="group relative h-full w-full transition-transform duration-300 ease-out hover:scale-105"
      style={{ clipPath }}
    >
      <div
        className="absolute inset-0 rounded-[2px] bg-gradient-to-br from-white/70 via-sky-200/20 to-white/10 p-[1px] shadow-[0_0_16px_rgba(148,163,184,0.35)] transition-all duration-300 group-hover:brightness-125 group-hover:shadow-[0_0_24px_rgba(56,189,248,0.55)]"
        style={{ clipPath }}
      >
        <div
          className="relative h-full w-full overflow-hidden bg-slate-900/50"
          style={{ clipPath }}
        >
          <div className="absolute inset-0" style={{ transform: 'scale(1.08)' }}>
            <video
              className="h-full w-full object-cover"
              style={{ objectPosition: videos[index].position, filter: 'none', imageRendering: 'crisp-edges' }}
              src={videos[index].src}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-slate-900/30" />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-white/5" />
        </div>
      </div>
    </div>
  );
}

export function Hero3D() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative">
        <div className="relative" style={{ perspective: '1200px' }}>
          <div className="octa-float relative h-72 w-72 rotate-45 sm:h-80 sm:w-80 md:h-96 md:w-96">
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px]">
              <OctaPanel index={0} clipPath="polygon(0% 0%, 100% 0%, 0% 100%)" />
              <OctaPanel index={1} clipPath="polygon(0% 0%, 100% 0%, 100% 100%)" />
              <OctaPanel index={2} clipPath="polygon(0% 0%, 0% 100%, 100% 100%)" />
              <OctaPanel index={3} clipPath="polygon(100% 0%, 0% 100%, 100% 100%)" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="group relative h-[58%] w-[58%] sm:h-[62%] sm:w-[62%] md:h-[64%] md:w-[64%]"
                style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
              >
                <div
                  className="absolute inset-0 rounded-[2px] bg-gradient-to-br from-white/70 via-sky-200/20 to-white/10 p-[1px] shadow-[0_0_18px_rgba(148,163,184,0.4)]"
                  style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                >
                  <div
                    className="relative h-full w-full overflow-hidden bg-slate-900/60"
                    style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                  >
                    <div className="absolute inset-0" style={{ transform: 'scale(1.08)' }}>
                      <video
                        className="h-full w-full object-cover"
                        style={{ filter: 'none', imageRendering: 'crisp-edges' }}
                        src="https://cdn.pixabay.com/video/2024/12/15/246869_large.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                      />
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-slate-900/35" />
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-[44%] border border-white/10 shadow-[0_0_30px_rgba(56,189,248,0.25)]" />
          </div>
        </div>
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/40 blur-xl" />
      </div>
      <style>
        {`@keyframes octaFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .octa-float { animation: octaFloat 6s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
}
