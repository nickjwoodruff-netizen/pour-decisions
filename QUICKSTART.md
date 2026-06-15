# ⚡ Quick Start (10 Minutes)

## You Need:
- ✅ A GitHub account (free at github.com)
- ✅ A Vercel account (free at vercel.com)
- ✅ Your Anthropic API key

---

## Step 1: Get Your API Key (2 min)

1. Go to https://console.anthropic.com/
2. Sign in (or create free account)
3. Click **Settings** → **API Keys**
4. Click **Create Key**
5. **Copy and save it** somewhere safe (you'll need it in Step 3)

---

## Step 2: Upload Code to GitHub (3 min)

1. Go to https://github.com/new
2. Enter repository name: `pour-decisions`
3. Leave everything else default
4. Click **Create repository**

5. Click **Add file** → **Upload files**

6. Download this entire `pour-decisions` folder to your computer

7. Drag these files into the GitHub upload box:
   ```
   package.json
   next.config.js
   .env.example
   .gitignore
   README.md
   pages/
   ```

8. Click **Commit changes**

---

## Step 3: Deploy to Vercel (3 min)

1. Go to https://vercel.com (sign up if needed)

2. Click **Add New** → **Project**

3. Click **Import Git Repository**

4. Find and select your `pour-decisions` repo

5. Click **Import**

6. Under **Environment Variables**, add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** (paste your key from Step 1)

7. Click **Deploy**

8. **Wait 1-2 minutes** ⏳

---

## Step 4: You're Done! 🎉

Once deployment finishes, Vercel gives you a **live URL** like:
```
https://pour-decisions-xyz123.vercel.app
```

### To Use It:
- 📱 **Phone:** Open the URL on your phone camera
- 💻 **Computer:** Open the URL in any browser
- 📤 **Share:** Send the URL to friends

---

## If Something Goes Wrong

### "Failed to analyze photo"
→ Try a clearer photo with better lighting

### "API key not configured"
→ Go to Vercel → Your Project → Settings → Environment Variables
→ Make sure `ANTHROPIC_API_KEY` is there

### "Page not loading"
→ Wait 10-15 seconds (Vercel starts server on first use)
→ Refresh the page

### "No drinks recommended"
→ Make sure your menu list is clear and readable
→ Try typing drinks instead of uploading a photo

---

## 🎯 You Did It!

Your app is now live. Share it, use it, customize it!

Questions? See full README.md for more help.
