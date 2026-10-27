import { UserAccount, PenguinSnack } from '../types';

const STORAGE_KEY_USERS = 'haris_gamecenter_users_v2';
const STORAGE_KEY_ACTIVE_USER = 'haris_gamecenter_active_user_v2';

export const PENGUIN_SNACKS: PenguinSnack[] = [
  {
    id: 'snack-fish',
    name: 'Arctic Silver Fish',
    cost: 20,
    icon: '🐟',
    affectionBoost: 8,
    description: 'Fresh glacial sprats loaded with Omega-3. Pablo crunches these between speedruns!',
    tasteReaction: 'Pablo swallows the fish whole in one bite! *Happy penguin squawk!* (+8 Affection)'
  },
  {
    id: 'snack-shrimp',
    name: 'Crispy Antarctic Krill',
    cost: 40,
    icon: '🦐',
    affectionBoost: 16,
    description: 'Crispy deep-sea krill snack. Pablo says it boosts his FPS reaction time by 300%!',
    tasteReaction: 'Pablo munches enthusiastically! His eyes sparkle with retro gamer joy! (+16 Affection)'
  },
  {
    id: 'snack-squid',
    name: 'Glacial Neon Squid',
    cost: 85,
    icon: '🦑',
    affectionBoost: 35,
    description: 'Glowing deep-sea delicacy. Rumored to give Pablo temporary zero-friction ice speed.',
    tasteReaction: 'Whoa! Pablo does a 360-degree victory spin on the ice! Absolutely gourmet! (+35 Affection)'
  },
  {
    id: 'snack-icepop',
    name: 'Cyberberry Ice Pop',
    cost: 150,
    icon: '🍧',
    affectionBoost: 60,
    description: 'Sub-zero frozen glacier pop infused with arcade neon syrup. The ultimate treat.',
    tasteReaction: 'Pablo wears his RGB headphones proudly and shares a joyful waddle dance! (+60 Affection)'
  }
];

// Initial demo accounts
const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: 'user-demo-guest',
    username: 'ArcadeRider',
    fullName: 'Guest Challenger',
    email: 'guest@harisgamecenter.com',
    avatar: '🐧',
    penguinPoints: 120,
    isVip: false,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    gamesPlayedCount: 3,
    favoriteGameIds: ['escape-road', 'nitro-league'],
    snacksFedCount: 1,
    pabloAffection: 25,
    inventory: []
  },
  {
    id: 'user-pablo-pro',
    username: 'PabloVIP',
    fullName: 'Pablo Fan Club #1',
    email: 'vip@harisgamecenter.com',
    avatar: '👑',
    penguinPoints: 850,
    isVip: true,
    vipTier: 'Gold',
    vipActivatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    gamesPlayedCount: 42,
    favoriteGameIds: ['nitro-league', 'escape-road', 'roblox-cloud'],
    snacksFedCount: 12,
    pabloAffection: 88,
    inventory: []
  }
];

export function getAllUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

export function saveUsers(users: UserAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users', err);
  }
}

export function getActiveUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_USER);
    if (!raw) return null;
    const user: UserAccount = JSON.parse(raw);
    // sync with latest in all users
    const all = getAllUsers();
    const found = all.find((u) => u.id === user.id);
    return found || user;
  } catch {
    return null;
  }
}

export function setActiveUser(user: UserAccount | null): void {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_USER);
    } else {
      localStorage.setItem(STORAGE_KEY_ACTIVE_USER, JSON.stringify(user));
      // update in users array
      const all = getAllUsers();
      const idx = all.findIndex((u) => u.id === user.id);
      if (idx >= 0) {
        all[idx] = user;
      } else {
        all.push(user);
      }
      saveUsers(all);
    }
  } catch (err) {
    console.error('Failed to set active user', err);
  }
}

export function createPlayerAccount(
  username: string,
  fullName: string = '',
  avatar: string = '🐧'
): UserAccount {
  const newUser: UserAccount = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    username: username.trim(),
    fullName: fullName.trim() || username.trim(),
    email: `${username.toLowerCase().replace(/\s+/g, '')}@player.local`,
    avatar,
    penguinPoints: 100, // starter gift points!
    isVip: false,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    gamesPlayedCount: 0,
    favoriteGameIds: [],
    snacksFedCount: 0,
    pabloAffection: 15,
    inventory: []
  };

  const users = getAllUsers();
  users.push(newUser);
  saveUsers(users);
  setActiveUser(newUser);
  return newUser;
}

export function awardPenguinPoints(amount: number = 25): UserAccount | null {
  const user = getActiveUser();
  if (!user) return null;

  user.penguinPoints = (user.penguinPoints || 0) + amount;
  user.gamesPlayedCount = (user.gamesPlayedCount || 0) + 1;
  setActiveUser(user);
  return user;
}

export function unlockVipWithPoints(): { success: boolean; message: string; user?: UserAccount } {
  const user = getActiveUser();
  if (!user) {
    return { success: false, message: 'Please sign in first to unlock VIP!' };
  }

  if (user.isVip) {
    return { success: true, message: 'You already possess VIP access!', user };
  }

  const REQUIREMENT = 500;
  if (user.penguinPoints < REQUIREMENT) {
    return {
      success: false,
      message: `You need 500 Penguin Points to unlock VIP. You currently have ${user.penguinPoints} pts. Play more games to earn +25 pts per game!`
    };
  }

  user.penguinPoints -= REQUIREMENT;
  user.isVip = true;
  user.vipTier = 'Gold';
  user.vipActivatedAt = new Date().toISOString();
  setActiveUser(user);

  return {
    success: true,
    message: 'VIP Access Unlocked! Enjoy exclusive access to Escape Road, Nitro League 3D, and Roblox Cloud!',
    user
  };
}

export function unlockVipWithCash(): { success: boolean; message: string; user?: UserAccount } {
  const user = getActiveUser();
  if (!user) {
    return { success: false, message: 'Please sign in first to unlock VIP!' };
  }

  user.isVip = true;
  user.vipTier = 'Diamond';
  user.vipActivatedAt = new Date().toISOString();
  // bonus points on purchase
  user.penguinPoints += 250;
  setActiveUser(user);

  return {
    success: true,
    message: 'Diamond VIP Tier Activated ($5.00 USD Upgrade)! +250 Bonus Points granted!',
    user
  };
}

export function feedPabloSnack(snackId: string): { success: boolean; message: string; user?: UserAccount } {
  const user = getActiveUser();
  if (!user) return { success: false, message: 'Sign in to feed Pablo!' };

  const snack = PENGUIN_SNACKS.find((s) => s.id === snackId);
  if (!snack) return { success: false, message: 'Snack not found' };

  if (user.penguinPoints < snack.cost) {
    return {
      success: false,
      message: `Not enough Penguin Points! Need ${snack.cost} pts, you have ${user.penguinPoints} pts.`
    };
  }

  user.penguinPoints -= snack.cost;
  user.snacksFedCount = (user.snacksFedCount || 0) + 1;
  user.pabloAffection = Math.min(100, (user.pabloAffection || 0) + snack.affectionBoost);
  setActiveUser(user);

  return {
    success: true,
    message: snack.tasteReaction,
    user
  };
}
