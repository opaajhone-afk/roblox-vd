import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

/**
 * 单条翻译
 * GET /translate?q=Hello&from=en&to=zh
 */
app.get("/translate", async (req, res) => {
  const { q, from = "en", to = "zh" } = req.query;
  if (!q) return res.status(400).json({ error: "missing q" });

  try {
    const url =
      "https://api.mymemory.translated.net/get" +
      `?q=${encodeURIComponent(q)}` +
      `&langpair=${from}|${to}`;

    const r = await fetch(url);
    const j = await r.json();

    res.json({
      ok: true,
      text: q,
      result: j.responseData.translatedText
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

/**
 * 批量翻译（你要的）
 * POST /translate/batch
 * body:
 * {
 *   "texts": ["hello", "world"],
 *   "from": "en",
 *   "to": "zh"
 * }
 */
app.post("/translate/batch", async (req, res) => {
  const { texts, from = "en", to = "zh" } = req.body;

  if (!Array.isArray(texts)) {
    return res.status(400).json({ error: "texts must be array" });
  }

  try {
    const results = [];

    for (const text of texts) {
      const url =
        "https://api.mymemory.translated.net/get" +
        `?q=${encodeURIComponent(text)}` +
        `&langpair=${from}|${to}`;

      const r = await fetch(url);
      const j = await r.json();

      results.push(j.responseData.translatedText);
    }

    res.json({
      ok: true,
      from,
      to,
      results
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.get("/", (req, res) => {
  res.send("Translate API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server listening on", PORT);
});