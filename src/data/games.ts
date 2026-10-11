import nitroThumb from '../assets/images/thumb_nitro_league_1791725027525.jpg';
import flappyThumb from '../assets/images/thumb_flappy_arcade_1791725038441.jpg';
import heroBanner from '../assets/images/hero_gaming_center_1791725017457.jpg';
import mascotLogo from '../assets/images/mascot_game_center_1791725047626.jpg';

export { nitroThumb, flappyThumb, heroBanner, mascotLogo };

export interface GameControl {
  key: string;
  action: string;
}

export interface Game {
  id: string;
  title: string;
  tagline: string;
  description: string;
  genre: 'Arcade Racing' | 'Retro Arcade' | 'Action Adventure' | 'Puzzle & Strategy';
  category: 'racing' | 'arcade' | 'action';
  status: 'live' | 'upcoming';
  playUrl: string;
  repoUrl: string;
  thumbnailUrl: string;
  bannerUrl?: string;
  features: string[];
  controls: GameControl[];
  releaseYear: string;
  techStack: string[];
  isFeatured?: boolean;
}

export const INITIAL_GAMES: Game[] = [
  {
    id: 'nitro-league',
    title: 'Nitro League',
    tagline: 'High-speed cyberpunk arcade racing with precision nitro drifting',
    description: 'Blaze through illuminated neon city streets in this high-intensity arcade racer. Master drift angles, collect booster charges, avoid barriers, and outpace the competition on challenging midnight circuits.',
    genre: 'Arcade Racing',
    category: 'racing',
    status: 'live',
    playUrl: 'https://harisxcode.github.io/nitro-league/',
    repoUrl: 'https://github.com/harisxcode/nitro-league',
    thumbnailUrl: nitroThumb,
    features: [
      'Responsive physics engine tuned for responsive drift dynamics',
      'Cyberpunk midnight visual aesthetic with custom lighting passes',
      'Dynamic nitro boost gauge with speed multipliers',
      'Zero-install lightweight HTML5 canvas architecture'
    ],
    controls: [
      { key: 'W / ↑', action: 'Accelerate' },
      { key: 'S / ↓', action: 'Brake / Reverse' },
      { key: 'A / D (← / →)', action: 'Steer Left & Right' },
      { key: 'Spacebar', action: 'Nitro Boost Injection' },
      { key: 'Esc', action: 'Pause Game' }
    ],
    releaseYear: '2025',
    techStack: ['HTML5 Canvas', 'JavaScript / TypeScript', 'Web Audio API', 'GitHub Pages'],
    isFeatured: true
  },
  {
    id: 'flappy-bird-arcade',
    title: 'Flappy Bird Arcade',
    tagline: 'Pixel-perfect classic obstacle flight with instant arcade replay',
    description: 'An authentic homage to the iconic arcade sensation. Navigate through tight pipe corridors, time every single wing flap with surgical precision, beat high scores, and enjoy instant restart cycles.',
    genre: 'Retro Arcade',
    category: 'arcade',
    status: 'live',
    playUrl: 'https://harisxcode.github.io/flappy-bird-arcade/',
    repoUrl: 'https://github.com/harisxcode/flappy-bird-arcade',
    thumbnailUrl: flappyThumb,
    features: [
      'Authentic gravity and velocity mechanics tuned for fair hitboxes',
      'High-score persistence across sessions with instant restart',
      'Retro arcade neon skyline artwork and arcade cabinet touches',
      'Optimized for single-tap touchscreens and desktop spacebar input'
    ],
    controls: [
      { key: 'Space / Click', action: 'Flap Wings (Ascend)' },
      { key: 'Touch / Tap', action: 'Flap on Mobile & Tablets' },
      { key: 'R', action: 'Instant Restart' },
      { key: 'P', action: 'Pause Session' }
    ],
    releaseYear: '2025',
    techStack: ['HTML5 Canvas', 'Vanilla JS / TS', 'Local Storage Highscores', 'GitHub Pages'],
    isFeatured: true
  },
  {
    id: 'cyber-runner-dx',
    title: 'Cyber Runner DX',
    tagline: 'Infinite procedurally generated vertical synthwave platformer',
    description: 'Currently in active development. Leap across shifting neon ledges, wall-jump past energy lasers, and harness gravitational momentum in an ever-ascending cyberpunk skyline.',
    genre: 'Action Adventure',
    category: 'action',
    status: 'upcoming',
    playUrl: '',
    repoUrl: 'https://github.com/harisxcode/game-center',
    thumbnailUrl: heroBanner,
    features: [
      'Procedural level generation with escalating velocity curves',
      'Wall-running and dash combo mechanics',
      'Synthwave adaptive audio soundscape'
    ],
    controls: [
      { key: 'A / D', action: 'Move Horizontal' },
      { key: 'Space', action: 'Jump / Double Jump' },
      { key: 'Shift', action: 'Air Dash' }
    ],
    releaseYear: 'Coming Soon',
    techStack: ['TypeScript', 'Vite', 'WebGL'],
    isFeatured: false
  }
];

export const GAME_CENTER_REPO = 'https://github.com/harisxcode/game-center';
export const HARIS_GITHUB_PROFILE = 'https://github.com/harisxcode';
