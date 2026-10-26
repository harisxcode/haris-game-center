import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Headphones, 
  Sparkles, 
  ExternalLink, 
  Edit3, 
  Check, 
  RotateCcw, 
  X, 
  Radio,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { playArcadeSfx } from '../utils/audio';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  mood: string;
  rootFreq: number; // Base frequency for Web Audio synth generator
  scale: number[];
}

const TRACKS: MusicTrack[] = [
  {
    id: 'track-1',
    title: 'Cyber Neon Drift',
    artist: 'Haris Studio Beats',
    genre: 'Cyberpunk Synthwave',
    bpm: 124,
    mood: 'High Energy & Nitro Drifting',
    rootFreq: 220, // A3
    scale: [0, 3, 5, 7, 10, 12, 15, 17] // Pentatonic minor
  },
  {
    id: 'track-2',
    title: 'Midnight Lofi Chill',
    artist: 'Haris Lofi Lounge',
    genre: 'Lofi Hip Hop',
    bpm: 82,
    mood: 'Relaxing Background Gaming',
    rootFreq: 174.61, // F3
    scale: [0, 4, 7, 11, 12, 14, 16] // Major 7th
  },
  {
    id: 'track-3',
    title: 'Arcade Pixel Dreams',
    artist: '8-Bit Retro Lab',
    genre: 'Chiptune / Electro',
    bpm: 130,
    mood: 'Retro Platformer Vibes',
    rootFreq: 261.63, // C4
    scale: [0, 2, 4, 7, 9, 12, 14] // Major pentatonic
  },
  {
    id: 'track-4',
    title: 'Sunset Highway Run',
    artist: 'Neon Wave collective',
    genre: 'Outrun / Retrowave',
    bpm: 112,
    mood: 'Smooth Coasting & Chill',
    rootFreq: 196, // G3
    scale: [0, 2, 3, 5, 7, 8, 10, 12] // Natural minor
  },
  {
    id: 'track-5',
    title: 'Night City Rain',
    artist: 'Ambient Soundscape',
    genre: 'Ambient Space',
    bpm: 72,
    mood: 'Deep Concentration Focus',
    rootFreq: 146.83, // D3
    scale: [0, 5, 7, 12, 17, 19] // Quartal ambient
  }
];

interface MusicStreamPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  configuredUrl: string;
  onUpdateConfiguredUrl?: (newUrl: string) => void;
}

export function MusicStreamPlayerModal({
  isOpen,
  onClose,
  configuredUrl,
  onUpdateConfiguredUrl
}: MusicStreamPlayerModalProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [customUrl, setCustomUrl] = useState(configuredUrl);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const stepCountRef = useRef(0);

  const currentTrack = TRACKS[currentTrackIndex];

  // Initialize or resume audio synthesizer
  const startAudioEngine = () => {
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtxClass();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (!gainNodeRef.current && audioCtxRef.current) {
        const masterGain = audioCtxRef.current.createGain();
        masterGain.gain.setValueAtTime((volume / 100) * (isMuted ? 0 : 1), audioCtxRef.current.currentTime);
        masterGain.connect(audioCtxRef.current.destination);
        gainNodeRef.current = masterGain;
      }
    } catch {
      // Audio autoplay policy
    }
  };

  // Play a synthesized musical beat step
  const playSynthesizedBeat = () => {
    if (!audioCtxRef.current || !gainNodeRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    const step = stepCountRef.current % 16;
    stepCountRef.current += 1;

    // 1. Kick/Bass beat on steps 0, 4, 8, 12
    if (step % 4 === 0) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.12);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(gainNodeRef.current);
      osc.start(now);
      osc.stop(now + 0.16);
    }

    // 2. Snare / Clack on steps 4, 12
    if (step === 4 || step === 12) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(gainNodeRef.current);
      osc.start(now);
      osc.stop(now + 0.1);
    }

    // 3. Synth note melody based on track scale
    const noteIntervals = [0, 2, 4, 3, 5, 1, 0, 4];
    const noteOffset = currentTrack.scale[noteIntervals[step % noteIntervals.length] % currentTrack.scale.length];
    const semitones = noteOffset;
    const freq = currentTrack.rootFreq * Math.pow(2, semitones / 12);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = currentTrack.genre.includes('8-Bit') ? 'square' : 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(gainNodeRef.current);
    osc.start(now);
    osc.stop(now + 0.23);
  };

  // Track playback toggle
  const togglePlay = () => {
    playArcadeSfx('click');
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      startAudioEngine();
      setIsPlaying(true);
    }
  };

  // Next / Previous track
  const handleNextTrack = () => {
    playArcadeSfx('click');
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setTrackProgress(0);
    stepCountRef.current = 0;
  };

  const handlePrevTrack = () => {
    playArcadeSfx('click');
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setTrackProgress(0);
    stepCountRef.current = 0;
  };

  // Interval beat scheduler
  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const intervalMs = (60 / currentTrack.bpm / 4) * 1000;
    intervalRef.current = setInterval(() => {
      playSynthesizedBeat();
      setTrackProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, currentTrackIndex]);

  // Volume & Mute adjustments
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      const targetGain = isMuted ? 0 : volume / 100;
      gainNodeRef.current.gain.setValueAtTime(targetGain * 0.5, audioCtxRef.current.currentTime);
    }
  }, [volume, isMuted]);

  // Neon Spectrum Visualizer Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const render = () => {
      tick += 1;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Dark background with faint grid
      ctx.fillStyle = '#060a17';
      ctx.fillRect(0, 0, width, height);

      const numBars = 36;
      const barWidth = width / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        let barHeight = 4;
        if (isPlaying) {
          // Dynamic simulated frequency spectrum
          const wave1 = Math.sin((tick * 0.1) + i * 0.4) * 0.5 + 0.5;
          const wave2 = Math.cos((tick * 0.07) + i * 0.25) * 0.5 + 0.5;
          const energy = (wave1 * 0.6 + wave2 * 0.4) * (height * 0.78);
          barHeight = Math.max(4, energy);
        } else {
          barHeight = 4;
        }

        const x = i * (barWidth + 2);
        const y = height - barHeight;

        // Gradient from cyan to purple/pink
        const grad = ctx.createLinearGradient(0, height, 0, 0);
        grad.addColorStop(0, '#06b6d4');
        grad.addColorStop(0.5, '#3b82f6');
        grad.addColorStop(1, '#a855f7');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Peak dot
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x, Math.max(0, y - 3), barWidth, 1.5);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleSaveCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    if (onUpdateConfiguredUrl) {
      onUpdateConfiguredUrl(customUrl.trim());
    }
    setSaveSuccess(true);
    setIsEditingUrl(false);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-[#060c1d] rounded-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.25)] p-5 sm:p-7 max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-white font-display">
                    Music Stream Player
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    LIVE WEB AUDIO
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Curated background beats &amp; cyber audio streaming console
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Visualizer Display Box */}
          <div className="mt-5 relative rounded-xl overflow-hidden border border-slate-800 bg-[#060a17]">
            <canvas
              ref={canvasRef}
              width={600}
              height={140}
              className="w-full h-32 sm:h-36 object-cover"
            />

            {/* Overlaid Status / Track Tag */}
            <div className="absolute top-2.5 left-3 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              <span className="text-[11px] font-mono tracking-wider text-cyan-300 font-bold uppercase">
                {isPlaying ? 'Streaming Active' : 'Station Idle'}
              </span>
            </div>

            <div className="absolute top-2.5 right-3 text-[11px] font-mono text-slate-400 bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800">
              {currentTrack.bpm} BPM · {currentTrack.genre}
            </div>

            {/* Progress line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900">
              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{ width: `${trackProgress}%` }}
              />
            </div>
          </div>

          {/* Now Playing Info */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-white truncate font-display">
                  {currentTrack.title}
                </h3>
              </div>
              <p className="text-xs text-slate-400 truncate">
                {currentTrack.artist} · <span className="text-cyan-300">{currentTrack.mood}</span>
              </p>
            </div>

            {/* Track badge */}
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-500/20 px-2 py-1 rounded shrink-0 self-start sm:self-auto">
              Track {currentTrackIndex + 1} of {TRACKS.length}
            </span>
          </div>

          {/* Interactive Player Controls */}
          <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            {/* Playback Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevTrack}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Previous Track"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/25'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-slate-950" />
                    <span>Pause Stream</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Start Stream</span>
                  </>
                )}
              </button>

              <button
                onClick={handleNextTrack}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Next Track"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseInt(e.target.value, 10));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-24 sm:w-28 accent-cyan-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] font-mono text-slate-400 w-7 text-right">
                {isMuted ? '0%' : `${volume}%`}
              </span>
            </div>
          </div>

          {/* Quick Playlist Track Selector */}
          <div className="mt-4 space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Select Sound Stream Track
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TRACKS.map((t, idx) => {
                const isSelected = idx === currentTrackIndex;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      playArcadeSfx('click');
                      setCurrentTrackIndex(idx);
                      if (!isPlaying) {
                        startAudioEngine();
                        setIsPlaying(true);
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400/50 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold truncate">{t.title}</div>
                      <div className="text-[10px] text-slate-400 truncate">{t.genre} · {t.bpm} BPM</div>
                    </div>
                    {isSelected && isPlaying ? (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* External Website Status & Custom URL Configuration */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-950/30 border border-blue-900/40 text-xs text-slate-300">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <div className="font-semibold text-white flex items-center gap-1.5 flex-wrap">
                  <span>External Website Destination:</span>
                  <code className="text-cyan-300 font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-950">
                    {configuredUrl}
                  </code>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Notice: <code className="text-slate-300">is.gd/musicstream</code> forwards to an older cloud preview container that currently responds with 404 (error no website found). This built-in Web Audio player streams instantly without errors. You can also update the direct URL below!
                </p>
              </div>
            </div>

            {saveSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Destination URL updated successfully! Future "Play Direct" clicks will use your new link.</span>
              </div>
            )}

            {isEditingUrl ? (
              <form onSubmit={handleSaveCustomUrl} className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="url"
                  required
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase cursor-pointer"
                  >
                    Save URL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingUrl(false);
                      setCustomUrl(configuredUrl);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => setIsEditingUrl(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold hover:underline cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Update Destination URL</span>
                </button>

                <a
                  href={configuredUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 hover:text-white transition-colors"
                >
                  <span>Launch External URL</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
