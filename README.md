# Pour Decisions 🍹
**Bartender AI - Personalized Drink Recommendations**

A beautiful, mobile-first app that uses AI to recommend the perfect drink for each person in your group. Take photos of the menu or people, and get personalized suggestions.

---

## What This App Does

1. **📸 Menu Upload** - Upload a photo of a bar menu OR type drinks manually
2. **👥 People Input** - Add group members with descriptions (or upload their photos for AI analysis)
3. **✨ Vibe Selection** - Choose playfulness level & how long you're staying
4. **🍹 Get Recommendations** - AI bartender creates personalized drink matches for everyone

---

## Setup (5 minutes)

### Step 1: Get Your API Key
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Go to **Settings → API Keys**
4. Click **Create Key** and copy it
5. Keep this safe! ⚠️

### Step 2: Deploy to Vercel (Easiest)

#### Option A: Click to Deploy (1 click!)
Coming soon! For now, follow Option B below.

#### Option B: Deploy via GitHub (Beginner-Friendly)

1. **Create a GitHub account** (free at github.com)

2. **Create a new repository:**
   - Go to https://github.com/new
   - Name it `pour-decisions`
   - Click **Create repository**

3. **Upload the code:**
   - Click **Add file → Upload files**
   - Download all files from this folder
   - Upload them to your new repo

4. **Connect to Vercel:**
   - Go to https://vercel.com/new
   - Click **Import Git Repository**
   - Select your `pour-decisions` repo
   - Click **Import**

5. **Add your API key:**
   - Under **Environment Variables**, add:
     - **Name:** `ANTHROPIC_API_KEY`
     - **Value:** (paste your API key from step 1)
   - Click **Deploy**

6. **Wait ~2 minutes** - You'll get a live URL! 🎉

---

## Local Development (Optional)

Run it on your computer first to test:

### Prerequisites
- Install Node.js from https://nodejs.org (get the LTS version)

### Steps

```bash
# 1. Download this folder to your computer

# 2. Open terminal/command prompt in this folder

# 3. Install packages
npm install

# 4. Create .env.local file in the project root
# Add this line (replace with your actual key):
# ANTHROPIC_API_KEY=your_api_key_here

# 5. Start the app
npm run dev

# 6. Open your browser to http://localhost:3000
```

You can now see the app locally! Edit files and changes reload automatically.

---

## How to Use

### Menu Step
- **Type drinks:** List available drinks (e.g., "Mojito, Espresso Martini, House Red")
- **Upload photo:** Take a photo of the bar menu → AI extracts the drinks
- **Paste URL:** Paste the bar's website → AI finds their menu online

### People Step
- **Add names & descriptions:** Type personality/vibe details
- **Or upload photos:** AI analyzes their style/energy automatically
- **Select alcoholic preferences** for each person
- **Set restrictions:** Any drinks they can't have?
- **Choose tone:** How should the bartender describe drinks? (Witty, Roast, Dramatic, Kind)

### Vibe Step
- **Playfulness:** Chill / Fun / Wild
- **Duration:** 1 drink / A few rounds / All night

### Results
- Get personalized drink matches with explanations
- Order again to try new combinations

---

## Tech Stack

- **Frontend:** React + Next.js
- **Backend:** Serverless (runs on Vercel)
- **AI:** Claude Sonnet 4.6 (vision + text)
- **Styling:** Pure CSS (no dependencies)
- **Fonts:** Google Fonts (Playfair Display, Space Grotesk, Inter)

---

## Customization

### Change Colors
Open `pages/index.js` and find the `C` object at the top:
```javascript
const C = {
  accent: "#FF2D78",    // Pink - change to any hex color
  gold: "#F5A623",      // Gold
  cyan: "#00CFFF",      // Cyan
  // ... etc
};
```

### Change Model
In `pages/api/recommendations.js`, `pages/api/analyze-menu.js`, and `pages/api/analyze-people.js`, change:
```javascript
model: "claude-sonnet-4-6"
// to:
model: "claude-opus-4-8"  // (more powerful, costs more)
```

### Adjust Prompts
Find the prompt strings in each API file to fine-tune AI behavior.

---

## Troubleshooting

### "API key not configured"
- ❌ You didn't add `ANTHROPIC_API_KEY` to Vercel Environment Variables
- ✅ Go to Vercel → Project Settings → Environment Variables → Add it

### "Failed to analyze photo"
- ❌ Photo is blurry or unclear
- ✅ Take a clearer photo with good lighting

### "No JSON in response"
- ❌ Menu text is too complex or unclear
- ✅ Try simplifying the menu list or take a clearer photo

### App is slow on first load
- Normal! Vercel starts the server when you first use it. Wait 10-15 seconds.

---

## Cost

### Free Tier
- Up to ~20,000 tokens per month
- Perfect for demos!

### Pricing (if you exceed free tier)
- Menu analysis: ~$0.01 per photo
- People analysis: ~$0.01 per photo
- Drink recommendation: ~$0.05 per request
- **Typical demo:** $0.10-$0.50 per session

Check pricing at https://www.anthropic.com/pricing

---

## Need Help?

1. **Vercel Docs:** https://vercel.com/docs
2. **Anthropic Docs:** https://docs.claude.com
3. **Next.js Docs:** https://nextjs.org/docs
4. **Claude API Guide:** https://docs.claude.com/en/docs/build-with-claude/get-started

---

## What's Next?

Ideas to expand:
- 🍺 Save favorite drink combinations
- 📊 Show drink descriptions by price range
- 🌍 Add multi-language support
- 💾 Save sessions locally
- 🎤 Add voice input
- 📤 Share recommendations via link

---

## License

Free to use and modify. Enjoy! 🍹
