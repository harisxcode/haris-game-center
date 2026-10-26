import nitroThumb from '../assets/images/thumb_nitro_league_1791725027525.jpg';
import flappyThumb from '../assets/images/thumb_flappy_arcade_1791725038441.jpg';
import heroBanner from '../assets/images/hero_gaming_center_1791725017457.jpg';
import mascotLogo from '../assets/images/mascot_game_center_1791725047626.jpg';
import memeManiaThumb from '../assets/images/thumb_meme_mania_1792447637658.jpg';
import robloxThumb from '../assets/images/thumb_roblox_cloud_1792545369843.jpg';
import harisArcadeThumb from '../assets/images/thumb_haris_arcade_1792546847417.jpg';
import escapeRoadThumb from '../assets/images/thumb_escape_road_1792766021496.jpg';
import musicStreamThumb from '../assets/images/thumb_music_stream_1792979603219.jpg';

export { nitroThumb, flappyThumb, heroBanner, mascotLogo, memeManiaThumb, robloxThumb, harisArcadeThumb, escapeRoadThumb, musicStreamThumb };

export interface GameControl {
  key: string;
  action: string;
}

export type GameCategory = 'racing' | 'arcade' | 'action' | 'cloud' | 'casual' | 'puzzle' | 'meme' | 'other';

export interface CategoryMeta {
  id: 'racing' | 'arcade' | 'action' | 'cloud' | 'casual' | 'puzzle' | 'other';
  title: string;
  shortLabel: string;
  tagline: string;
  iconName: string;
}

export interface GameHypeAd {
  headline: string;
  badge: string;
  funPitch: string;
  hypeQuote: string;
  reviewer: string;
  ratingScore: string;
  gameplayTips: string[];
  excitementLevel: string;
}

export const UNIVERSAL_CATEGORIES: CategoryMeta[] = [
  {
    id: 'racing',
    title: 'Racing & Driving',
    shortLabel: 'Racing',
    tagline: 'High-speed circuits, precision drift physics & time trials',
    iconName: 'Car'
  },
  {
    id: 'cloud',
    title: 'Cloud & Streaming',
    shortLabel: 'Cloud Streaming',
    tagline: 'Instant 3D cloud gaming worlds powered by now.gg with zero install',
    iconName: 'Cloud'
  },
  {
    id: 'arcade',
    title: 'Arcade & Retro',
    shortLabel: 'Arcade',
    tagline: 'Classic 2D coin-op action, pixel precision & high-score reflex tests',
    iconName: 'Gamepad2'
  },
  {
    id: 'casual',
    title: 'Casual & Viral',
    shortLabel: 'Casual & Meme',
    tagline: 'Viral meme challenges, party reflex minigames & quick fun',
    iconName: 'Laugh'
  },
  {
    id: 'action',
    title: 'Action & Platformer',
    shortLabel: 'Action',
    tagline: 'Skill-based movement, cyber platforming & obstacle runs',
    iconName: 'Flame'
  },
  {
    id: 'puzzle',
    title: 'Puzzle & Strategy',
    shortLabel: 'Puzzle & Strategy',
    tagline: 'Logic puzzles, tactical planning & cerebral challenges',
    iconName: 'BrainCircuit'
  },
  {
    id: 'other',
    title: 'Other Apps & Websites',
    shortLabel: 'Other',
    tagline: 'Web tools, streaming audio players & experimental online concepts',
    iconName: 'Headphones'
  }
];

export interface Game {
  id: string;
  title: string;
  tagline: string;
  description: string;
  genre: 'Arcade Racing' | 'Retro Arcade' | 'Action Adventure' | 'Puzzle & Strategy' | 'Cloud Gaming' | 'Casual & Viral' | 'Music & Streaming' | 'Web Apps & Tools';
  category: GameCategory;
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
  isExternal?: boolean;
  directPlayOnly?: boolean;
  iframeUrl?: string;
  hypeAd?: GameHypeAd;
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
    isFeatured: true,
    hypeAd: {
      headline: 'BLISTERING SPEED & PRECISION DRIFTS!',
      badge: '🔥 100% ADRENALINE RUSH',
      funPitch: 'Rev up your engine and burn rubber through neon-drenched cyberpunk tracks! Slide through hairpin turns, ignite your nitrous tank, and leave rivals in your dust with ultra-responsive 60fps drift physics.',
      hypeQuote: 'The most electrifying browser racing game out there—the nitro boost sensation is unmatched!',
      reviewer: 'Pixel Turbo Magazine',
      ratingScore: '9.9 / 10',
      gameplayTips: [
        'Counter-steer into sharp curves to build maximum drift multipliers',
        'Save your Nitro bottle for straightaways to blast past speed limits',
        'Avoid track edge scraping to maintain top momentum'
      ],
      excitementLevel: 'MAXIMUM ADRENALINE'
    }
  },
  {
    id: 'escape-road',
    title: 'Escape Road',
    tagline: 'High-speed police getaway chase through an obstacle-filled 3D city',
    description: 'Slam the accelerator and evade relentless police cruisers, roadblocks, and tactical SWAT interceptors. Drift through tight urban intersections, dodge oncoming traffic, and survive the ultimate high-octane pursuit.',
    genre: 'Arcade Racing',
    category: 'racing',
    status: 'live',
    playUrl: 'https://unblockedescaperoads.com/',
    repoUrl: 'https://unblockedescaperoads.com/',
    thumbnailUrl: escapeRoadThumb,
    features: [
      'High-speed urban getaway pursuit physics with reactive AI police',
      'Dynamic destructive obstacles, barricades, and city traffic',
      'Responsive keyboard steering and emergency handbrake drifting',
      'Direct browser execution with zero iframes or lag'
    ],
    controls: [
      { key: 'A / D or ← / →', action: 'Steer Vehicle' },
      { key: 'W / ↑', action: 'Accelerate' },
      { key: 'S / ↓', action: 'Brake / Reverse' },
      { key: 'Spacebar', action: 'Handbrake Drift' }
    ],
    releaseYear: '2025',
    techStack: ['WebGL 3D Engine', 'Physics Simulation', 'Direct Launch'],
    isFeatured: true,
    isExternal: true,
    directPlayOnly: true,
    hypeAd: {
      headline: 'HIGH-SPEED POLICE CHASE ESCAPE MADNESS!',
      badge: '🚨 100% INTENSE PURSUIT',
      funPitch: 'Can you outsmart an entire metropolitan police force? Slam the pedal, drift around city skyscrapers, dodge spike strips, and weave through oncoming traffic in the most thrilling getaway escape racer on the web!',
      hypeQuote: 'White-knuckle police evasion action—pure adrenaline from the very first second you hit the gas!',
      reviewer: 'Getaway Gaming Reviews',
      ratingScore: '9.9 / 10',
      gameplayTips: [
        'Bait chasing police cruisers into ramming barricades and buildings',
        'Use quick handbrake taps to execute sharp 90-degree alleyway drifts',
        'Keep your momentum high—getting boxed in means instant bust!'
      ],
      excitementLevel: 'MAXIMUM CHASE THRILL'
    }
  },
  {
    id: 'haris-game-center-hub',
    title: 'Haris Game Center (Arcade Portal)',
    tagline: 'Direct arcade gateway to classic web games & community challenges',
    description: 'Jump straight into the Haris Game Center arcade library for fast-paced web action. Launch directly into retro obstacle games, drift circuits, and mini-game reflex trials with zero installation.',
    genre: 'Retro Arcade',
    category: 'arcade',
    status: 'live',
    playUrl: 'https://harisxcode.github.io/haris-game-center/#games',
    repoUrl: 'https://github.com/harisxcode/haris-game-center',
    thumbnailUrl: harisArcadeThumb,
    features: [
      'Direct launch with zero iframe encapsulation',
      'Instant access to retro mini-games and reflex challenges',
      'Optimized for desktop spacebar and mobile touchscreen controls'
    ],
    controls: [
      { key: 'W A S D / Arrows', action: 'Move / Steer' },
      { key: 'Spacebar', action: 'Action / Flap / Nitro' },
      { key: 'Click / Tap', action: 'Touch Controls' }
    ],
    releaseYear: '2025',
    techStack: ['HTML5 Canvas', 'TypeScript', 'GitHub Pages', 'Direct Launch'],
    isFeatured: true,
    isExternal: true,
    directPlayOnly: true,
    hypeAd: {
      headline: 'THE ULTIMATE ALL-IN-ONE RETRO ARCADE!',
      badge: '🕹️ NON-STOP GAMING FEVER',
      funPitch: 'Step into an authentic virtual arcade cabinet floor! Experience handcrafted browser classics, fast-paced reflex mini-games, and competitive challenges all in one place—no downloads, no friction, pure fun.',
      hypeQuote: 'Non-stop gaming variety right in your browser tab—pure retro vibes from start to finish!',
      reviewer: 'Web Arcade Chronicle',
      ratingScore: '9.8 / 10',
      gameplayTips: [
        'Explore all universal categories to discover new hidden gems',
        'Use keyboard hotkeys or touchscreen taps for lightning reactions',
        'Bookmark your top favorites with the heart button'
      ],
      excitementLevel: '100% RETRO THRILLS'
    }
  },
  {
    id: 'roblox-cloud',
    title: 'Roblox (Cloud Edition)',
    tagline: 'Instant cloud gaming access to millions of 3D community worlds & obbies',
    description: 'Jump straight into Roblox through high-speed cloud streaming with zero downloads or local installation. Experience community creations, obstacle courses, multiplayer adventures, and creative sandboxes powered by now.gg.',
    genre: 'Cloud Gaming',
    category: 'cloud',
    status: 'live',
    playUrl: 'https://now.gg/apps/a/19900/b.html',
    repoUrl: 'https://now.gg/apps/a/19900/b.html',
    thumbnailUrl: robloxThumb,
    features: [
      'Direct cloud stream execution via now.gg with no installation',
      'Access to millions of player-created worlds, tycoons, and obbies',
      'Full keyboard, mouse camera control, and touchscreen support',
      'Instant launch in dedicated browser window'
    ],
    controls: [
      { key: 'W A S D', action: 'Move Avatar' },
      { key: 'Space', action: 'Jump' },
      { key: 'Right Click + Drag', action: 'Rotate Camera' },
      { key: 'E / Click', action: 'Interact / Action' }
    ],
    releaseYear: '2025',
    techStack: ['now.gg Cloud Engine', 'WebGL Stream', 'Direct Launch'],
    isFeatured: true,
    isExternal: true,
    directPlayOnly: true,
    hypeAd: {
      headline: 'MILLIONS OF 3D COMMUNITY WORLDS IN YOUR BROWSER!',
      badge: '☁️ NEXT-GEN CLOUD STREAMING',
      funPitch: 'Skip gigabyte downloads and hop straight into endless 3D adventures! Race through crazy obstacle courses (obbies), build tycoon empires, roleplay with friends, and explore community worlds powered by now.gg high-speed cloud streaming.',
      hypeQuote: 'Instant access to all the craziest community creations without eating your computer storage!',
      reviewer: 'Cloud Gamer Weekly',
      ratingScore: '9.9 / 10',
      gameplayTips: [
        'Right-click and drag for smooth 360-degree camera awareness',
        'Time your jump spacing in obbies to conquer difficult parkour',
        'Team up with friends online for multiplier bonuses in tycoons'
      ],
      excitementLevel: 'INFINITE 3D WORLDS'
    }
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
    isFeatured: true,
    hypeAd: {
      headline: 'ONE TAP TO GLORY! CAN YOU BEAT THE RECORD?',
      badge: '🕊️ CRAZY ADDICTIVE CLASSIC',
      funPitch: 'Test your nerve, reflexes, and concentration! Guide your neon wings through tight pipe labyrinths where one tiny flap makes all the difference between a high-score legend and a glorious faceplant. Re-tuned with smooth 60fps physics!',
      hypeQuote: 'Deceptively simple, wildly hilarious, and impossibly addictive! You will keep hitting restart!',
      reviewer: 'Retro Tap Daily',
      ratingScore: '9.7 / 10',
      gameplayTips: [
        'Tap with a steady metronome rhythm rather than frantic tapping',
        'Aim for the lower third of each pipe gap for maximum recovery room',
        'Hit R for instant zero-lag restart when chasing records'
      ],
      excitementLevel: 'HIGH-STAKES REFLEX'
    }
  },
  {
    id: 'meme-mania',
    title: 'Meme Mania',
    tagline: 'Fast-paced viral internet meme challenges & arcade reflex mini-games',
    description: 'Step into the wild world of web culture with Meme Mania. Test your meme knowledge, reaction speeds, and comedic timing across rapid-fire arcade mini-games and viral challenges.',
    genre: 'Casual & Viral',
    category: 'casual',
    status: 'live',
    playUrl: 'https://harisxcode.github.io/meme-mania/',
    repoUrl: 'https://github.com/harisxcode/meme-mania',
    thumbnailUrl: memeManiaThumb,
    features: [
      'Rapid-fire arcade challenges celebrating iconic viral meme culture',
      'Multi-tiered reflex tests with escalating speed and combo multipliers',
      'Vibrant retro-arcade neon visuals and nostalgic sound effects',
      'Smooth keyboard and mobile touchscreen tap support'
    ],
    controls: [
      { key: 'Space / Click', action: 'Tap / Confirm Reaction' },
      { key: 'A / D (← / →)', action: 'Select Choice / Move' },
      { key: 'R', action: 'Instant Restart Round' },
      { key: 'M', action: 'Toggle Audio SFX' }
    ],
    releaseYear: '2025',
    techStack: ['HTML5 Canvas', 'TypeScript / JavaScript', 'Web Audio API', 'GitHub Pages'],
    isFeatured: true,
    hypeAd: {
      headline: 'HILARIOUS VIRAL CHALLENGES & MEME MAYHEM!',
      badge: '🎭 MAXIMUM LAUGHS GUARANTEED',
      funPitch: 'Get ready to laugh uncontrollably while testing your reaction speeds! Packed with web culture’s most iconic memes, chaotic soundboards, escalating reflex puzzles, and comedic surprises at every turn.',
      hypeQuote: 'You will laugh out loud from start to finish. Comedy meets rapid-fire arcade frenzy!',
      reviewer: 'Viral Culture Weekly',
      ratingScore: '9.8 / 10',
      gameplayTips: [
        'Keep sound ON to hear the hilarious voice clips and meme sound cues',
        'Watch out for comedic trick questions that test quick intuition',
        'Chain consecutive fast reactions for huge combo bonus scores'
      ],
      excitementLevel: '100% VIRAL CHAOS'
    }
  },
  {
    id: 'music-stream',
    title: 'Music Stream',
    tagline: 'Stream curated music, playlists & background beats in your browser',
    description: 'Interactive web music streaming player and audio hub. Listen to streaming beats, discover synthwave and chill tracks, and enjoy uninterrupted background playback right while browsing and gaming.',
    genre: 'Music & Streaming',
    category: 'other',
    status: 'live',
    playUrl: 'https://is.gd/musicstream',
    repoUrl: 'https://is.gd/musicstream',
    thumbnailUrl: musicStreamThumb,
    features: [
      'Direct audio streaming playback with web audio controls',
      'Ideal background music companion for gaming sessions',
      'Lightweight browser execution with zero installation needed',
      'Dedicated other concepts showcase'
    ],
    controls: [
      { key: 'Spacebar', action: 'Play / Pause Stream' },
      { key: 'M', action: 'Mute / Unmute' },
      { key: 'Click / Tap', action: 'Select Track & Volume' }
    ],
    releaseYear: '2025',
    techStack: ['Web Audio API', 'Streaming Player', 'Direct Launch'],
    isFeatured: true,
    isExternal: false,
    directPlayOnly: false,
    hypeAd: {
      headline: 'STREAM BEATS & SOUNDTRACKS WHILE YOU PLAY!',
      badge: '🎧 AUDIO & STREAMING APP',
      funPitch: 'Elevate your gaming and browsing experience with Music Stream! Tune in to smooth background music, high-energy gaming beats, and curated audio streams directly in your browser with zero hassle.',
      hypeQuote: 'The ultimate web soundtrack player—perfect for gaming background music and chill listening sessions!',
      reviewer: 'Web Audio Magazine',
      ratingScore: '9.8 / 10',
      gameplayTips: [
        'Leave Music Stream playing in a tab while playing Nitro League or Escape Road',
        'Use spacebar to quickly pause/resume your audio stream',
        'Check back often for newly added web concepts in the Other category'
      ],
      excitementLevel: 'CHILL & IMMERSIVE'
    }
  }
];

export const GAME_CENTER_REPO = 'https://github.com/harisxcode/game-center';
export const HARIS_GITHUB_PROFILE = 'https://github.com/harisxcode';
