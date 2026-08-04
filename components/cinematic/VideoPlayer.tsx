'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Maximize, Volume2, VolumeX, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function VideoPlayer({ src, provider = 'youtube', thumbnail, className, autoPlay = false, loop = false }: { src: string; provider?: 'youtube' | 'vimeo' | 'file'; thumbnail?: string; className?: string; autoPlay?: boolean; loop?: boolean; }) {
  const [playing, setPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (provider === 'file' && videoRef.current) { if (playing) videoRef.current.pause(); else videoRef.current.play(); setPlaying(!playing); }
    else setPlaying(!playing);
  };
  const toggleMute = () => { if (provider === 'file' && videoRef.current) videoRef.current.muted = !muted; setMuted(!muted); };

  const youtubeId = provider === 'youtube' ? src.split('/embed/')[1]?.split('?')[0] : '';
  const vimeoId = provider === 'vimeo' ? src.split('/').pop() : '';
  const embedUrl = provider === 'youtube'
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=${playing ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&playlist=${youtubeId}&controls=0&modestbranding=1&rel=0`
    : provider === 'vimeo' ? `https://player.vimeo.com/video/${vimeoId}?autoplay=${playing ? 1 : 0}&muted=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&controls=0` : '';

  return (
    <>
      <div className={cn('relative rounded-2xl overflow-hidden glass cinema-border group', className)}>
        {provider === 'file' ? (
          <video ref={videoRef} src={src} poster={thumbnail} loop={loop} muted={muted} autoPlay={autoPlay} className="w-full h-full object-cover" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
        ) : playing ? (
          <iframe src={embedUrl} className="absolute inset-0 w-full h-full" allow="autoplay; encrypted-media; fullscreen" frameBorder="0" />
        ) : thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnail} alt="Video thumbnail" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/15 to-teal/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
        {!playing && (
          <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center group/play" aria-label="Play video">
            <div className="w-16 h-16 rounded-full glass-strong flex items-center justify-center group-hover/play:scale-110 group-hover/play:glow-primary transition-all duration-300"><Play className="w-7 h-7 text-white fill-white" /></div>
          </button>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2">
            <button onClick={togglePlay} className="w-9 h-9 rounded-lg glass-strong flex items-center justify-center hover:scale-105 transition-transform">{playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
            <button onClick={toggleMute} className="w-9 h-9 rounded-lg glass-strong flex items-center justify-center hover:scale-105 transition-transform">{muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}</button>
          </div>
          <button onClick={() => setFullscreen(!fullscreen)} className="w-9 h-9 rounded-lg glass-strong flex items-center justify-center hover:scale-105 transition-transform"><Maximize className="w-4 h-4" /></button>
        </div>
      </div>
      <AnimatePresence>
        {fullscreen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4" onClick={() => setFullscreen(false)}>
            <button className="absolute top-4 right-4 w-10 h-10 rounded-full glass-strong flex items-center justify-center z-10"><X className="w-5 h-5" /></button>
            {provider === 'file' ? (
              <video src={src} autoPlay loop={loop} controls className="max-w-full max-h-full rounded-xl" />
            ) : (
              <iframe src={`${embedUrl}&autoplay=1`} className="w-full h-full max-w-5xl aspect-video rounded-xl" allow="autoplay; encrypted-media; fullscreen" frameBorder="0" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
