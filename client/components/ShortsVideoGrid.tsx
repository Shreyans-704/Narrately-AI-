import { DEFAULT_SHORTS_VIDEOS } from '@/config/videosConfig';

export function ShortsVideoGrid() {
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-[1024px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEFAULT_SHORTS_VIDEOS.map((video, index) => (
            <div key={`${video.title}-${index}`} className="group relative">
              <div className="relative w-full overflow-hidden rounded-2xl aspect-[9/16] bg-slate-900/60 border border-white/10 shadow-[0_20px_40px_rgba(15,23,42,0.35)] transition-transform duration-300 hover:scale-[1.03]">
                <video
                  className="h-full w-full object-cover"
                  style={{ imageRendering: 'crisp-edges', filter: 'none' }}
                  src={video.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                />

                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    Shorts
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 px-3 pb-3 text-white">
                    <p className="text-sm font-semibold leading-tight">{video.title}</p>
                    <p className="text-xs text-white/70">{video.views}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
