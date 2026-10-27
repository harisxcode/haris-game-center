// Web Audio synthesizer engine for arcade ambient music lounge

class WebAudioMusicEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrackId: string = 'chillwave';
  private timer: number | null = null;
  private masterGain: GainNode | null = null;
  private step: number = 0;
  private volume: number = 0.25;

  private tracks: Record<string, { name: string; bpm: number; scale: number[] }> = {
    chillwave: {
      name: "Pablo's Midnight Arcade",
      bpm: 96,
      scale: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25] // C major pentatonic
    },
    neon_drift: {
      name: "Neon Ice Rink (Drift Mix)",
      bpm: 118,
      scale: [220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00] // A minor
    },
    retro_chiptune: {
      name: "8-Bit Penguin Hop",
      bpm: 130,
      scale: [261.63, 329.63, 392.00, 493.88, 523.25, 587.33]
    }
  };

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public playTrack(trackId: string = 'chillwave') {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.currentTrackId = trackId;
    this.isPlaying = true;
    this.step = 0;

    if (this.timer) {
      window.clearInterval(this.timer);
    }

    const track = this.tracks[trackId] || this.tracks.chillwave;
    const intervalMs = (60 / track.bpm / 2) * 1000;

    this.timer = window.setInterval(() => {
      this.tick();
    }, intervalMs);
  }

  private tick() {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    const track = this.tracks[this.currentTrackId] || this.tracks.chillwave;
    const now = this.ctx.currentTime;

    // Bass note on quarter beats
    if (this.step % 4 === 0) {
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      const root = track.scale[0] / 2;
      bassOsc.frequency.setValueAtTime(root, now);
      
      bassGain.gain.setValueAtTime(0.3, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      
      bassOsc.connect(bassGain);
      bassGain.connect(this.masterGain);
      
      bassOsc.start(now);
      bassOsc.stop(now + 0.35);
    }

    // Melodic arpeggio note
    const melOsc = this.ctx.createOscillator();
    const melGain = this.ctx.createGain();
    melOsc.type = this.currentTrackId === 'retro_chiptune' ? 'square' : 'sine';

    const noteIdx = (this.step * 3 + (this.step % 5)) % track.scale.length;
    const freq = track.scale[noteIdx];
    melOsc.frequency.setValueAtTime(freq, now);

    melGain.gain.setValueAtTime(0.12, now);
    melGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    melOsc.connect(melGain);
    melGain.connect(this.masterGain);

    melOsc.start(now);
    melOsc.stop(now + 0.22);

    this.step = (this.step + 1) % 32;
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  public toggle(trackId?: string) {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.playTrack(trackId || this.currentTrackId);
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrack(): { id: string; name: string } {
    const track = this.tracks[this.currentTrackId] || this.tracks.chillwave;
    return { id: this.currentTrackId, name: track.name };
  }
}

export const musicEngine = new WebAudioMusicEngine();
