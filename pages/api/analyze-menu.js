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
        max_tokens: 1000,
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
                text: `Please analyze this bar/restaurant menu photo and extract all the drinks listed. 
                
Return ONLY a simple list formatted like this (one drink per line):
- Drink Name: Brief description
- Another Drink: What it is

For example:
- Espresso Martini: Vodka, coffee liqueur, espresso
- Mojito: Rum, mint, lime, soda
- House Red: Spanish red wine

Just list what you see. Be concise. Never use em dashes (—); use commas or periods instead.`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(response.status).json({
        error: `Failed to analyze menu: ${data.error.message || "Unknown error"}`,
      });
    }

    if (!data.content || !Array.isArray(data.content)) {
      return res.status(500).json({ error: "Unexpected response format" });
    }

    const menuText = data.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return res.status(200).json({ menu: menuText });
  } catch (err) {
    console.error("Error analyzing menu:", err);
    return res.status(500).json({
      error: err.message || "Failed to analyze menu photo",
    });
  }
}
