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
        max_tokens: 1200,
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
                text: `Look at this group photo and identify each person in it.

For each person, provide (never use em dashes "—" anywhere in your response; use commas or periods instead):
1. A fun, witty name based on WHERE they are in the photo and how they look. Be creative and playful, like a cheeky friend describing the photo. Examples of the style:
   - "The queen holding court dead centre"
   - "The guy barely surviving on the left edge"
   - "The one getting slowly crushed in the middle"
   - "The mysterious figure lurking at the back"
   - "The one who clearly organised this whole thing"
   - "The legend squeezed in on the right"

2. A brief 1-sentence vibe/personality read based on their expression, style and energy, as if you're a bartender sizing them up.

Return ONLY valid JSON, no markdown, no extra text:
[
  {
    "funName": "The queen holding court dead centre",
    "vibe": "Radiates effortless confidence, the kind who orders something surprising and it turns out to be perfect."
  }
]

One object per person. Order them left to right as they appear in the photo.`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(response.status).json({
        error: `Failed to analyze group photo: ${data.error.message || "Unknown error"}`,
      });
    }

    if (!data.content || !Array.isArray(data.content)) {
      return res.status(500).json({ error: "Unexpected response format" });
    }

    const txt = data.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    const match = txt.match(/\[[\s\S]*\]/);
    if (!match) {
      return res.status(500).json({ error: "Could not parse group photo response" });
    }

    const people = JSON.parse(match[0]);
    return res.status(200).json({ people });
  } catch (err) {
    console.error("Error analyzing group photo:", err);
    return res.status(500).json({
      error: err.message || "Failed to analyze group photo",
    });
  }
}
