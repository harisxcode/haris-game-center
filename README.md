# Haris Game Center 🎮

Interactive landing hub for Haris's arcade and racing web games, featuring **Nitro League** and **Flappy Bird Arcade** with direct play links, in-app playable viewports, and open-source project repositories.

## 🚀 Published Games

- **Nitro League**: [Play Game](https://harisxcode.github.io/nitro-league/) · [GitHub Repo](https://github.com/harisxcode/nitro-league)
- **Roblox (Cloud Edition)**: [Direct Play on now.gg](https://now.gg/apps/a/19900/b.html)
- **Flappy Bird Arcade**: [Play Game](https://harisxcode.github.io/flappy-bird-arcade/) · [GitHub Repo](https://github.com/harisxcode/flappy-bird-arcade)
- **Meme Mania**: [Play Game](https://harisxcode.github.io/meme-mania/) · [GitHub Repo](https://github.com/harisxcode/meme-mania)

---

## 🌐 How to Publish to GitHub Pages

This project is pre-configured with **automated GitHub Actions deployment** and relative asset resolution (`base: './'`).

### Option 1: Automatic Deployment via GitHub Actions (Recommended)

1. **Push this code to your GitHub repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Haris Game Center"
   git branch -M main
   git remote add origin https://github.com/harisxcode/game-center.git
   git push -u origin main
   ```

2. **Enable GitHub Pages in your repository settings**:
   - Go to your repository on GitHub: `https://github.com/harisxcode/game-center`
   - Click **Settings** (top tabs)
   - Click **Pages** in the left sidebar
   - Under **Build and deployment** -> **Source**, select:
     👉 **GitHub Actions**
   - That's it! Every time you push to the `main` branch, the `.github/workflows/deploy.yml` workflow will automatically build and publish your site at:
     **`https://harisxcode.github.io/game-center/`**

---

### Option 2: Manual Build & Push

If you prefer building locally:

```bash
# 1. Install dependencies
npm install

# 2. Build for production (outputs to /dist)
npm run build

# 3. Preview production build locally
npm run preview
```

---

## 🕹️ Adding Future Games

To add more games to the hub:
1. Open `src/data/games.ts`
2. Add a new game object to `INITIAL_GAMES` with its title, GitHub Pages play link, repository, and controls.
3. Or use the built-in **"Add Game"** button on the website to generate and copy the configuration snippet!
