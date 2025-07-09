# 🎶 TuneQuiz

*Generate AI‑powered music quizzes from your favourite artists, play them in‑browser via Spotify, and share the results with friends.*

---

## ✨ Features

* **Spotify Auth** – secure login with your Spotify account (`NextAuth.js + SpotifyProvider`)
* **OpenAI Quiz Generator** – GPT‑4 (o4‑mini‑high) creates custom multiple‑choice quizzes
* **React Server Components** – App Router (Next 15) for fast, SEO‑friendly pages
* **Tailwind CSS + daisyUI** – clean UI with pre‑built component styles
* **Spotify Web Playback SDK** – optional in‑browser music snippets
* **Full TypeScript** – strict linting (`@typescript-eslint/no‑explicit‑any`)
* **Ready for Vercel** – zero‑config serverless deployment

---

## 🗂️ Tech Stack

| Area      | Choice                            |
| --------- | --------------------------------- |
| Framework | Next.js 15 (App Router)           |
| Language  | TypeScript 5                      |
| Styling   | Tailwind CSS v3 + daisyUI 4       |
| Auth      | NextAuth.js 5 / Spotify OAuth     |
| AI        | OpenAI API (GPT‑4 "o4‑mini‑high") |
| Playback  | Spotify Web Playback SDK          |

---

## ⚡ Quick Start

```bash
# 1 · Clone and install
git clone https://github.com/your‑handle/tunequiz.git
cd tunequiz
npm install

# 2 · Create environment config
cp .env.local.example .env.local
# → fill in keys (see below)

# 3 · Develop with hot reload
npm run dev      # http://localhost:3000
```

---

## 🚀 Production

```bash
npm run build    # optimise & type‑check
npm run start    # serve production build at :3000
```

### Deploying to Vercel

1. Push the repo to GitHub / GitLab.
2. **Import project** in Vercel dashboard.
3. Add the environment variables (below).
4. Click **Deploy** – done!

---

## 🔑 Environment Variables

| Key                     | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
| `NEXTAUTH_URL`          | e.g. `http://localhost:3000` or your Vercel URL |
| `NEXTAUTH_SECRET`       | random 32‑char string                           |
| `SPOTIFY_CLIENT_ID`     | Spotify Dev Portal → **Client ID**              |
| `SPOTIFY_CLIENT_SECRET` | Spotify Dev Portal → **Client Secret**          |
| `OPENAI_API_KEY`        | OpenAI account API key                          |

`.env.local.example` contains a template.

---

## 📂 Project Structure (simplified)

```
app/
 ├ api/
 │   ├ auth/[...nextauth]/route.ts   # NextAuth (Spotify)
 │   └ gpt/route.ts                  # OpenAI quiz generator
 ├ createQuiz/
 │   ├ page.tsx                      # Server Component route
 │   └ CreateQuizClient.tsx          # 'use client' + Suspense
 ├ playQuiz/page.tsx                 # Quiz player
 └ layout.tsx / globals.css
components/                           # Re‑usable UI widgets
lib/                                  # authOptions, helpers
providers/                            # React context for quiz state
public/
```

---

## 🏃 NPM Scripts

| Script          | What it does                              |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Dev server with hot reload (`next dev`)   |
| `npm run build` | Type‑check, lint, optimise (`next build`) |
| `npm run start` | Run compiled app (`next start`)           |
| `npm run lint`  | ESLint + TypeScript rules                 |

---


### 🙏 Acknowledgements

* [Next.js](https://nextjs.org)
* [OpenAI](https://openai.com)
* [Spotify Developer Platform](https://developer.spotify.com)
* [daisyUI](https://daisyui.com)
