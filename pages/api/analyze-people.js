export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageBase64, mediaType = "image/jpeg" } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: "No image provided" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 800,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: imageBase64,
                },
              },
              {
                type: "text",
                text: `Look at this photo of person/people and describe their personality, vibe, and style in 1-2 sentences as if you're a bartender getting to know them.

Focus on:
- Their energy/personality vibe
- Their style or aesthetic
- Specific visible details worth mentioning (a leather jacket, bold glasses, a bright dress, a great hat, etc.). Calling out a concrete detail makes the read feel personal, so include one where you can.
- What kind of drink person they seem like (creative? adventurous? chill? bold?)

Keep it friendly and observational, not judgmental. For multiple people, describe each briefly.

Return ONLY the description(s), nothing else. Never use em dashes (—); use commas or periods instead.`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(response.status).json({
        error: `Failed to analyze photo: ${data.error.message || "Unknown error"}`,
      });
    }

    if (!data.content || !Array.isArray(data.content)) {
      return res.status(500).json({ error: "Unexpected response format" });
    }

    const description = data.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return res.status(200).json({ description });
  } catch (err) {
    console.error("Error analyzing people photo:", err);
    return res.status(500).json({
      error: err.message || "Failed to analyze photo",
    });
  }
}
