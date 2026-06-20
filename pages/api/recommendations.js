export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { menu, peopleData, vibeData } = req.body;

  if (!menu || !peopleData || !vibeData) {
    return res.status(400).json({ error: "Missing required data" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const toneMap = {
      witty: "witty and charming, clever observations with a knowing twinkle",
      roast: "gently roasting, playful and spicy, like a best friend who earned the right",
      dramatic: "gloriously over-the-top theatrical, Shakespearean narrator meets Vegas compere",
      kind: "warm, generous and affirming, seeing only the best in everyone",
    };

    const menuDesc =
      menu.mode === "url"
        ? (menu.text || `Bar/venue URL: ${menu.url}. Use web search to find their drinks menu`)
        : menu.text;

    if (!menuDesc || !menuDesc.trim()) {
      return res.status(400).json({ error: "No menu text available. Please rescan the menu photo." });
    }

    const groupDesc = peopleData.people
      .map((p, i) => {
        const name = p.name || `Person ${i + 1}`;
        const lines = [`- ${name}`];
        if (p.description) lines.push(`  Vibe: ${p.description}`);
        if (p.photoAnalysis) lines.push(`  From photo: ${p.photoAnalysis}`);
        lines.push(`  Alcohol: ${p.alcoholic ? "yes" : "no, non-alcoholic drinks only"}`);
        if (p.caffeineFree) lines.push(`  No caffeine`);
        if (p.cantDrink) lines.push(`  Can't drink: ${p.cantDrink}`);
        if (p.surpriseMe) lines.push(`  Preference: surprise me, bartender's choice, be creative`);
        else if (p.prefers) lines.push(`  Prefers: ${p.prefers}`);
        if (peopleData.avoidMode === "everyone")
          lines.push(`  Avoid last drink: yes`);
        if (peopleData.avoidMode === "individual" && p.lastDrink) {
          lines.push(
            `  Last drink: ${p.lastDrink}. ${p.avoidLast ? "please avoid" : "happy to have again"}`
          );
        }
        return lines.join("\n");
      })
      .join("\n");

    const prompt = `You are a brilliant, fun bartender AI. Recommend the perfect drink for each person.

MENU:
${menuDesc}

WHO'S DRINKING:
${groupDesc}

DESCRIPTION TONE: ${toneMap[vibeData.tone] || toneMap.witty}

GROUP VIBE:
- Playfulness: ${vibeData.play}
${peopleData.avoidMode === "everyone" ? "- Everyone wants something different from their last drink" : ""}

For EACH PERSON provide:
1. personName: their name if provided, otherwise empty string
2. archetype: a creative descriptor WITHOUT "The" prefix (e.g. "Midnight Philosopher", "Solar Empress", "Reluctant Accountant Who Secretly Wants to Dance")
3. A fun 2–3 sentence description using the specified tone
4. A specific drink from the menu that matches their preferences
5. A fitting drink emoji
6. 1–2 sentences on why it's perfect for them

RULES:
- NEVER use em dashes (—) anywhere in your response. Use commas, periods, or "and" instead.
- Strictly respect alcoholic/non-alcoholic preferences
- Strictly respect "no caffeine": avoid coffee, espresso, cola, energy drinks, matcha, etc.
- Strictly avoid anything listed in "can't drink"
- If "Prefers" is given, lean into that preference when picking the drink
- If "surprise me" is given, have fun and be extra creative with the choice
- CRITICAL: drinkName MUST be copied exactly as it appears in the MENU list above. Do not invent, rename, modify, or substitute any drink that is not explicitly listed in the MENU section. If you are unsure, re-read the MENU list and pick the closest exact match from it.
- Give each person a different drink where possible, but only from the MENU list. Never duplicate by inventing a similar-sounding drink

Respond with ONLY a valid JSON array. No markdown, no extra text:
[{"personName":"name or empty string","archetype":"descriptor only, no The prefix","description":"...","drinkName":"...","drinkEmoji":"🍹","whyChosen":"..."}]`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Anthropic API error:", data.error);
      return res.status(response.status).json({
        error: `API Error: ${data.error.message || JSON.stringify(data.error)}`,
      });
    }

    if (!data.content || !Array.isArray(data.content)) {
      return res
        .status(500)
        .json({ error: "Unexpected API response format" });
    }

    const txt = data.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    const match = txt.match(/\[[\s\S]*\]/);
    if (!match) {
      console.error("No JSON found in response:", txt.slice(0, 300));
      return res.status(500).json({
        error:
          "Could not parse drink recommendations. Please check your menu is clear.",
      });
    }

    const results = JSON.parse(match[0]);
    return res.status(200).json({ results });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      error: err.message || "Something went wrong. Please try again.",
    });
  }
}
