import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { Button } from "@/components/ui/button";

export function VideoPlayer({ src, onNext, onPrev, title }: { src?: string; onNext: () => void; onPrev: () => void; title?: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current!;
    if (!src) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else if (Hls.isSupported()) {
      const hls = new Hls({ maxBufferLength: 30 });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }
  }, [src]);

  const seek = (sec: number) => {
    const v = videoRef.current;
    if (v) v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + sec));
  };

  return (
    <div className="w-full">
      <div className="aspect-video w-full overflow-hidden rounded-lg border bg-black">
        <video ref={videoRef} className="h-full w-full" controls playsInline title={title} />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => seek(-10)}>{"«"} 10s</Button>
        <Button variant="outline" size="sm" onClick={() => seek(10)}>10s {"»"}</Button>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onPrev}>Prev ep</Button>
          <Button variant="secondary" size="sm" onClick={onNext}>Next ep</Button>
        </div>
      </div>
    </div>
  );
}
